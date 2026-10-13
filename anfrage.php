<?php
/* ==========================================================================
   PRINT LAB Trier: receives the quote form (js/main.js posts here) and
   e-mails it to the shop, with up to 3 design files attached, plus a short
   confirmation to the customer. Answers with JSON: { "ok": true|false }.
   Compatible with PHP 7.4+. No database. The only thing stored is a
   one-way hash of the sender's IP with timestamps (abuse limit), deleted
   after a day.
   ========================================================================== */

declare(strict_types=1);

ini_set('display_errors', '0'); // warnings must never break the JSON reply

const SHOP_EMAIL    = 'info@printlab-trier.de';
const SHOP_NAME     = 'PRINT LAB Trier';
const SITE_URL      = 'printlab-trier.de';
const WHATSAPP      = '+49 159 01378917';
const MAX_FILES     = 3;
const MAX_TOTAL     = 15 * 1024 * 1024; // 15 MB for all files together
const ALLOWED_EXT   = ['png', 'jpg', 'jpeg', 'pdf', 'svg', 'ai', 'eps', 'psd', 'tif', 'tiff', 'webp', 'heic'];
const MIN_SECONDS   = 3;  // faster than this is a bot
const RATE_LIMIT    = 5;  // submissions per IP and hour

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method']);
}

/* ---- Bots: honeypot and time trap. Pretend success so they move on. */
$started = (int) ($_POST['t'] ?? 0);
$age = time() - intdiv($started, 1000);
if (trim((string) ($_POST['website'] ?? '')) !== '' || $started <= 0 || $age < MIN_SECONDS || $age > 86400) {
    respond(200, ['ok' => true]);
}

/* ---- Rate limit: max RATE_LIMIT sent requests per IP and hour. Only a
   one-way hash of the IP is kept, and only for the current day. */
function rate_file(): string
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    return rtrim(sys_get_temp_dir(), '/') . '/printlab-rl-' . hash('sha256', 'printlab|' . $ip . '|' . date('Y-m-d'));
}

function recent_hits(): array
{
    $now = time();
    // Remove entries older than a day (as promised in the privacy policy)
    foreach ((array) @glob(rtrim(sys_get_temp_dir(), '/') . '/printlab-rl-*') as $old) {
        if (is_string($old) && @filemtime($old) < $now - 86400) @unlink($old);
    }
    $file = rate_file();
    if (!@is_file($file)) return [];
    return array_values(array_filter(array_map('intval', explode(',', (string) @file_get_contents($file))), function ($ts) use ($now) {
        return $ts > $now - 3600;
    }));
}

function record_hit(array $hits): void
{
    $hits[] = time();
    @file_put_contents(rate_file(), implode(',', $hits), LOCK_EX);
}

$hits = recent_hits();
if (count($hits) >= RATE_LIMIT) {
    respond(429, ['ok' => false, 'error' => 'rate']);
}

/* ---- Read and check the fields */
function field(string $name, int $max, bool $multiline = false): string
{
    $value = trim((string) ($_POST[$name] ?? ''));
    $value = $multiline ? str_replace("\r\n", "\n", $value) : (string) preg_replace('/[\r\n\t]+/', ' ', $value);
    $value = (string) preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
    return mb_substr((string) $value, 0, $max);
}

$lang     = field('lang', 2) === 'en' ? 'en' : 'de';
$name     = field('name', 100);
$email    = field('email', 160);
$phone    = field('phone', 40);
$product  = field('product', 80);
$quantity = field('quantity', 7);
$color    = field('color', 80);
$position = field('position', 80);
$design   = field('has_design', 4) === 'Nein' ? 'Nein' : 'Ja';
$deadline = field('deadline', 10);
$delivery = field('delivery', 40);
$zip      = field('zip', 80);
$message  = field('message', 5000, true);

$errors = [];
if ($name === '') $errors[] = 'name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if ($product === '') $errors[] = 'product';
if (!ctype_digit($quantity) || (int) $quantity < 1) $errors[] = 'quantity';
if (!in_array($delivery, ['Abholung in Trier', 'Versand'], true)) $errors[] = 'delivery';
if ($deadline !== '') {
    $d = DateTime::createFromFormat('!Y-m-d', $deadline);
    if (!$d || $d->format('Y-m-d') !== $deadline) $errors[] = 'deadline';
}
if ($errors) {
    respond(422, ['ok' => false, 'error' => 'fields', 'fields' => $errors]);
}

/* ---- Files (only when the customer has a design) */
$files = [];
if ($design === 'Ja' && isset($_FILES['files']) && is_array($_FILES['files']['name'])) {
    $total = 0;
    foreach ($_FILES['files']['name'] as $i => $original) {
        $err = $_FILES['files']['error'][$i];
        if ($err === UPLOAD_ERR_NO_FILE) continue;
        if ($err !== UPLOAD_ERR_OK) respond(413, ['ok' => false, 'error' => 'files']);
        $ext = strtolower(pathinfo((string) $original, PATHINFO_EXTENSION));
        if (!in_array($ext, ALLOWED_EXT, true)) respond(422, ['ok' => false, 'error' => 'filetype']);
        $tmp = $_FILES['files']['tmp_name'][$i];
        if (!is_uploaded_file($tmp)) respond(422, ['ok' => false, 'error' => 'files']);
        $size = (int) $_FILES['files']['size'][$i];
        $total += $size;
        if (count($files) >= MAX_FILES || $total > MAX_TOTAL) respond(413, ['ok' => false, 'error' => 'files']);
        $clean = preg_replace('/[^\w.\- ]+/u', '_', basename((string) $original));
        $files[] = ['name' => mb_substr((string) $clean, 0, 120), 'path' => $tmp, 'ext' => $ext];
    }
}

/* ---- Build the e-mails */
function enc_header(string $text): string
{
    return preg_match('/[^\x20-\x7E]/', $text) ? '=?UTF-8?B?' . base64_encode($text) . '?=' : $text;
}

function format_date(string $ymd): string
{
    if ($ymd === '') return '';
    $d = DateTime::createFromFormat('!Y-m-d', $ymd);
    return $d ? $d->format('d.m.Y') : $ymd;
}

function rows_to_text(array $rows): string
{
    $out = [];
    foreach ($rows as $label => $value) {
        if ($value !== '') $out[] = $label . ': ' . $value;
    }
    return implode("\n", $out);
}

/** Sends a UTF-8 text mail, as multipart/mixed when there are attachments. */
function send_mail(string $to, string $subject, string $text, array $headers, array $attachments = []): bool
{
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Auto-Submitted: auto-generated';
    $headers[] = 'X-Auto-Response-Suppress: All';

    if (!$attachments) {
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';
        $headers[] = 'Content-Transfer-Encoding: base64';
        $body = chunk_split(base64_encode($text));
    } else {
        $boundary = 'pl-' . bin2hex(random_bytes(12));
        $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';
        $body = '--' . $boundary . "\r\n"
            . "Content-Type: text/plain; charset=UTF-8\r\n"
            . "Content-Transfer-Encoding: base64\r\n\r\n"
            . chunk_split(base64_encode($text));
        foreach ($attachments as $file) {
            $mime = function_exists('mime_content_type') ? (mime_content_type($file['path']) ?: 'application/octet-stream') : 'application/octet-stream';
            $ascii = preg_replace('/[^\x20-\x7E]/', '_', $file['name']);
            $body .= '--' . $boundary . "\r\n"
                . 'Content-Type: ' . $mime . '; name="' . $ascii . '"' . "\r\n"
                . "Content-Transfer-Encoding: base64\r\n"
                . 'Content-Disposition: attachment; filename="' . $ascii . '"; filename*=UTF-8\'\'' . rawurlencode($file['name']) . "\r\n\r\n"
                . chunk_split(base64_encode((string) file_get_contents($file['path'])));
        }
        $body .= '--' . $boundary . "--\r\n";
    }

    return mail($to, enc_header($subject), $body, implode("\r\n", $headers), '-f' . SHOP_EMAIL);
}

$rows = [
    'Name'          => $name,
    'E-Mail'        => $email,
    'Telefon'       => $phone,
    'Produkt'       => $product,
    'Stückzahl'     => $quantity,
    'Farbe'         => $color,
    'Druckposition' => $position,
    'Wunschtermin'  => format_date($deadline),
    'Lieferung'     => $delivery,
    'PLZ und Ort'   => $delivery === 'Versand' ? $zip : '',
    'Design vorhanden' => $design,
];
$fileNames = array_map(function ($f) { return $f['name']; }, $files);
if ($fileNames) $rows['Dateien'] = implode(', ', $fileNames);
elseif ($design === 'Ja') $rows['Dateien'] = 'keine hochgeladen (kommen ggf. per E-Mail oder WhatsApp)';

$shopText = "Neue Anfrage über printlab-trier.de\n\n" . rows_to_text($rows)
    . ($message !== '' ? "\n\nNachricht:\n" . $message : '')
    . "\n\nAntworten: einfach auf diese E-Mail antworten, sie geht direkt an " . $email . '.';

$shopSubject = 'Neue Anfrage: ' . $product . ', ' . $quantity . ' Stk. (' . $name . ')';
$safeName = str_replace(['"', '\\'], '', $name);
$shopHeaders = [
    'From: ' . enc_header('PRINT LAB Website') . ' <' . SHOP_EMAIL . '>',
    'Reply-To: ' . enc_header($safeName) . ' <' . $email . '>',
];

if (!send_mail(SHOP_EMAIL, $shopSubject, $shopText, $shopHeaders, $files)) {
    respond(500, ['ok' => false, 'error' => 'mail']);
}
record_hit($hits);

/* ---- Confirmation to the customer: fixed text plus the selected options.
   Free text (message) is not echoed back, so the form can't be abused to
   send arbitrary content to strangers. */
$greetName = preg_match('/https?:|www\.|@|\d{4,}/i', $name) ? '' : ' ' . $name;
$summary = rows_to_text([
    ($lang === 'en' ? 'Product' : 'Produkt') => $product,
    ($lang === 'en' ? 'Quantity' : 'Stückzahl') => $quantity,
    ($lang === 'en' ? 'Preferred date' : 'Wunschtermin') => format_date($deadline),
    ($lang === 'en' ? 'Delivery' : 'Lieferung') => $lang === 'en'
        ? ($delivery === 'Versand' ? 'Shipping' : 'Pickup in Trier')
        : $delivery,
    ($lang === 'en' ? 'Files' : 'Dateien') => $files ? (string) count($files) : '',
]);

if ($lang === 'en') {
    $confirmSubject = 'Your request at PRINT LAB Trier';
    $confirmText = "Hello" . $greetName . ",\n\n"
        . "thank you for your request! We have received it and will get back to you with a non-binding quote within 24 hours.\n\n"
        . $summary . "\n\n"
        . "If you would like to add a file or a note, simply reply to this email.\n"
        . "You can also reach us on WhatsApp: " . WHATSAPP . "\n\n"
        . "Best regards\nAyoub\n" . SHOP_NAME . "\n" . SITE_URL . "\n";
} else {
    $confirmSubject = 'Deine Anfrage bei PRINT LAB Trier';
    $confirmText = "Hallo" . $greetName . ",\n\n"
        . "vielen Dank für deine Anfrage! Sie ist bei uns angekommen und wir melden uns innerhalb von 24 Stunden mit einem unverbindlichen Angebot bei dir.\n\n"
        . $summary . "\n\n"
        . "Möchtest du noch eine Datei oder einen Hinweis ergänzen? Antworte einfach auf diese E-Mail.\n"
        . "Du erreichst uns auch per WhatsApp: " . WHATSAPP . "\n\n"
        . "Viele Grüße\nAyoub\n" . SHOP_NAME . "\n" . SITE_URL . "\n";
}

send_mail($email, $confirmSubject, $confirmText, [
    'From: ' . enc_header(SHOP_NAME) . ' <' . SHOP_EMAIL . '>',
    'Reply-To: ' . SHOP_EMAIL,
]);

respond(200, ['ok' => true]);
