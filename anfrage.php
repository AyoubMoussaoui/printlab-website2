<?php
/* ==========================================================================
   PRINT LAB Trier: receives the quote form (js/main.js posts here), the
   claim form (reklamation.html, js/reklamation.js, form=reklamation) and
   the review form (bewertung.html, js/bewertung.js, form=bewertung) and
   e-mails them to the shop with the uploaded files attached, plus a short
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
const CLAIM_MAX_FILES = 6;  // photos of the defect (up to 4) + of the whole item (up to 2)
const CLAIM_MAX_TOTAL = 25 * 1024 * 1024;
const CLAIM_EXT     = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];
const CLAIM_ISSUES  = [
    'Druckfehler / Druckqualität' => 'Print defect / print quality',
    'Beschädigter Artikel'        => 'Damaged item',
    'Falsche Größe oder Farbe'    => 'Wrong size or colour',
    'Falsches Motiv oder Position' => 'Wrong design or position',
    'Sonstiges'                   => 'Other',
];
const REVIEW_ROLES  = ['Privat', 'Verein', 'Unternehmen', 'Schule / Hochschule', 'Event / Feier', 'Sonstiges'];
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

/* ---- E-mail helpers */
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

/**
 * Checks the uploaded files of one input (name[]) and adds them to $files.
 * Stops the request with an error for a wrong type or too much data.
 */
function collect_files(string $key, array $allowedExt, int $maxFiles, int $maxTotal, array &$files, int &$total, string $prefix = ''): int
{
    if (!isset($_FILES[$key]) || !is_array($_FILES[$key]['name'])) return 0;
    $added = 0;
    foreach ($_FILES[$key]['name'] as $i => $original) {
        $err = $_FILES[$key]['error'][$i];
        if ($err === UPLOAD_ERR_NO_FILE) continue;
        if ($err !== UPLOAD_ERR_OK) respond(413, ['ok' => false, 'error' => 'files']);
        $ext = strtolower(pathinfo((string) $original, PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedExt, true)) respond(422, ['ok' => false, 'error' => 'filetype']);
        $tmp = $_FILES[$key]['tmp_name'][$i];
        if (!is_uploaded_file($tmp)) respond(422, ['ok' => false, 'error' => 'files']);
        $total += (int) $_FILES[$key]['size'][$i];
        if (count($files) >= $maxFiles || $total > $maxTotal) respond(413, ['ok' => false, 'error' => 'files']);
        $clean = preg_replace('/[^\w.\- ]+/u', '_', basename((string) $original));
        $files[] = ['name' => mb_substr($prefix . $clean, 0, 120), 'path' => $tmp, 'ext' => $ext];
        $added++;
    }
    return $added;
}

/* ---- Read and check the fields */
function field(string $name, int $max, bool $multiline = false): string
{
    $value = trim((string) ($_POST[$name] ?? ''));
    $value = $multiline ? str_replace("\r\n", "\n", $value) : (string) preg_replace('/[\r\n\t]+/', ' ', $value);
    $value = (string) preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
    return mb_substr((string) $value, 0, $max);
}

/* ==========================================================================
   Claim form (reklamation.html): description plus photos of the defect and
   of the whole item. Handled completely here, then the script ends.
   ========================================================================== */
/* ==========================================================================
   Review form (bewertung.html): goes to the shop only. Nothing is published
   automatically; PRINT LAB checks each review and only shows it on the
   website when the customer has agreed.
   ========================================================================== */
if (field('form', 20) === 'bewertung') {
    $name    = field('name', 100);
    $role    = field('role', 40);
    $rating  = field('rating', 1);
    $email   = field('email', 160);
    $message = field('message', 3000, true);
    $consent = field('consent', 2) === 'ja';

    $errors = [];
    if ($name === '') $errors[] = 'name';
    if ($role !== '' && !in_array($role, REVIEW_ROLES, true)) $errors[] = 'role';
    if (!in_array($rating, ['1', '2', '3', '4', '5'], true)) $errors[] = 'rating';
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
    if ($message === '') $errors[] = 'message';
    if ($errors) {
        respond(422, ['ok' => false, 'error' => 'fields', 'fields' => $errors]);
    }

    $stars = str_repeat('★', (int) $rating) . str_repeat('☆', 5 - (int) $rating);
    $text = "Neue Bewertung über printlab-trier.de\n\n" . rows_to_text([
        'Bewertung' => $stars . ' (' . $rating . ' von 5)',
        'Name / Projekt' => $name,
        'Kontext' => $role,
        'E-Mail (nicht veröffentlichen)' => $email,
        'Veröffentlichung' => $consent
            ? 'erlaubt (mit Namen oder anonymisiert)'
            : 'NICHT erlaubt, nur intern verwenden',
    ]) . "\n\nFeedback:\n" . $message
        . ($email !== '' ? "\n\nAntworten: einfach auf diese E-Mail antworten, sie geht direkt an " . $email . '.' : '');
    $headers = ['From: ' . enc_header('PRINT LAB Website') . ' <' . SHOP_EMAIL . '>'];
    if ($email !== '') {
        $headers[] = 'Reply-To: ' . enc_header(str_replace(['"', '\\'], '', $name)) . ' <' . $email . '>';
    }
    if (!send_mail(SHOP_EMAIL, 'Neue Bewertung: ' . $rating . '/5 von ' . $name, $text, $headers)) {
        respond(500, ['ok' => false, 'error' => 'mail']);
    }
    record_hit($hits);
    respond(200, ['ok' => true]);
}

if (field('form', 20) === 'reklamation') {
    $lang    = field('lang', 2) === 'en' ? 'en' : 'de';
    $name    = field('name', 100);
    $email   = field('email', 160);
    $order   = field('order', 60);
    $issue   = field('issue', 60);
    $message = field('message', 5000, true);

    $errors = [];
    if ($name === '') $errors[] = 'name';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
    if (!array_key_exists($issue, CLAIM_ISSUES)) $errors[] = 'issue';
    if ($message === '') $errors[] = 'message';

    $files = [];
    $total = 0;
    $defectCount = collect_files('photos_defect', CLAIM_EXT, CLAIM_MAX_FILES, CLAIM_MAX_TOTAL, $files, $total, 'Mangel_');
    $itemCount   = collect_files('photos_item', CLAIM_EXT, CLAIM_MAX_FILES, CLAIM_MAX_TOTAL, $files, $total, 'Artikel_');
    if ($defectCount < 1) $errors[] = 'photos_defect';
    if ($itemCount < 1) $errors[] = 'photos_item';
    if ($errors) {
        respond(422, ['ok' => false, 'error' => 'fields', 'fields' => $errors]);
    }

    $shopText = "Neue Reklamation über printlab-trier.de\n\n" . rows_to_text([
        'Name'           => $name,
        'E-Mail'         => $email,
        'Auftragsnummer' => $order !== '' ? $order : 'nicht angegeben',
        'Art des Problems' => $issue,
        'Fotos'          => $defectCount . ' vom Mangel, ' . $itemCount . ' vom ganzen Artikel (im Anhang)',
    ]) . "\n\nBeschreibung:\n" . $message
        . "\n\nAntworten: einfach auf diese E-Mail antworten, sie geht direkt an " . $email . '.';
    $shopSubject = 'Reklamation: ' . $issue . ($order !== '' ? ', Auftrag ' . $order : '') . ' (' . $name . ')';
    $safeName = str_replace(['"', '\\'], '', $name);

    if (!send_mail(SHOP_EMAIL, $shopSubject, $shopText, [
        'From: ' . enc_header('PRINT LAB Website') . ' <' . SHOP_EMAIL . '>',
        'Reply-To: ' . enc_header($safeName) . ' <' . $email . '>',
    ], $files)) {
        respond(500, ['ok' => false, 'error' => 'mail']);
    }
    record_hit($hits);

    // Confirmation: fixed text and the selected options only (no free text)
    $greetName = preg_match('/https?:|www\.|@|\d{4,}/i', $name) ? '' : ' ' . $name;
    if ($lang === 'en') {
        $summary = rows_to_text([
            'Order number' => $order,
            'Issue'        => CLAIM_ISSUES[$issue],
            'Photos'       => (string) count($files),
        ]);
        $confirmSubject = 'Your claim at PRINT LAB Trier';
        $confirmText = "Hello" . $greetName . ",\n\n"
            . "we are sorry that something is not right with your order. We have received your claim and the photos, will check everything carefully and usually get back to you within one working day with a solution.\n\n"
            . $summary . "\n\n"
            . "Please keep the affected items as they are (unused and uncleaned) until we have sorted it out.\n"
            . "If you would like to add something, simply reply to this email or write to us on WhatsApp: " . WHATSAPP . "\n\n"
            . "Your statutory warranty rights are of course not affected.\n\n"
            . "Best regards\nAyoub\n" . SHOP_NAME . "\n" . SITE_URL . "\n";
    } else {
        $summary = rows_to_text([
            'Auftragsnummer'   => $order,
            'Art des Problems' => $issue,
            'Fotos'            => (string) count($files),
        ]);
        $confirmSubject = 'Deine Reklamation bei PRINT LAB Trier';
        $confirmText = "Hallo" . $greetName . ",\n\n"
            . "es tut uns leid, dass bei deinem Auftrag etwas nicht stimmt. Deine Reklamation und die Fotos sind bei uns angekommen. Wir prüfen alles sorgfältig und melden uns in der Regel innerhalb eines Werktags mit einer Lösung bei dir.\n\n"
            . $summary . "\n\n"
            . "Bitte bewahre die betroffenen Artikel bis zur Klärung so auf, wie sie sind (möglichst unbenutzt und ungereinigt).\n"
            . "Möchtest du noch etwas ergänzen? Antworte einfach auf diese E-Mail oder schreib uns per WhatsApp: " . WHATSAPP . "\n\n"
            . "Deine gesetzlichen Gewährleistungsrechte bleiben selbstverständlich unberührt.\n\n"
            . "Viele Grüße\nAyoub\n" . SHOP_NAME . "\n" . SITE_URL . "\n";
    }
    send_mail($email, $confirmSubject, $confirmText, [
        'From: ' . enc_header(SHOP_NAME) . ' <' . SHOP_EMAIL . '>',
        'Reply-To: ' . SHOP_EMAIL,
    ]);

    respond(200, ['ok' => true]);
}

/* ==========================================================================
   Quote form
   ========================================================================== */
$lang     = field('lang', 2) === 'en' ? 'en' : 'de';
$name     = field('name', 100);
$email    = field('email', 160);
$phone    = field('phone', 40);
$product  = field('product', 80);
$quantity = field('quantity', 7);
$color    = field('color', 80);
$position = field('position', 80);
// The form no longer asks "Design vorhanden?" (uploading is optional);
// older senders may still send Ja or Nein
$design   = in_array(field('has_design', 4), ['Ja', 'Nein'], true) ? field('has_design', 4) : '';
$deadline = field('deadline', 10);
$delivery = field('delivery', 40);
$zip      = field('zip', 80);
$message  = field('message', 5000, true);

/* Requests from the Design-Konfigurator (js/configurator.js) bring
   quantities per size, the print size and the image resolution, and don't
   ask for pickup or shipping. */
$fromConfigurator = field('source', 20) === 'konfigurator';
$view      = field('view', 10);
$printSize = field('print_size', 40);
$dpi       = field('dpi', 5);
$sizes = [];
foreach (['S', 'M', 'L', 'XL', 'XXL'] as $s) {
    $n = field('size_' . $s, 4);
    if (ctype_digit($n) && (int) $n > 0) $sizes[$s] = (int) $n;
}
if ($sizes) $quantity = (string) array_sum($sizes);
if ($fromConfigurator && $delivery === '') $delivery = 'Noch offen';

$errors = [];
if ($name === '') $errors[] = 'name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if ($product === '') $errors[] = 'product';
if (!ctype_digit($quantity) || (int) $quantity < 1) $errors[] = 'quantity';
if (!in_array($delivery, ['Abholung in Trier', 'Versand', 'Noch offen'], true)) $errors[] = 'delivery';
if ($dpi !== '' && !ctype_digit($dpi)) $errors[] = 'dpi';
if ($deadline !== '') {
    $d = DateTime::createFromFormat('!Y-m-d', $deadline);
    if (!$d || $d->format('Y-m-d') !== $deadline) $errors[] = 'deadline';
}
if ($errors) {
    respond(422, ['ok' => false, 'error' => 'fields', 'fields' => $errors]);
}

/* ---- Files (only when the customer has a design) */
$files = [];
$total = 0;
if ($design !== 'Nein') collect_files('files', ALLOWED_EXT, MAX_FILES, MAX_TOTAL, $files, $total);

$sizeText = implode(', ', array_map(function ($s, $n) { return $s . ': ' . $n; }, array_keys($sizes), $sizes));

$rows = [
    'Quelle'        => $fromConfigurator ? 'Design-Konfigurator' : 'Anfrageformular',
    'Name'          => $name,
    'E-Mail'        => $email,
    'Telefon'       => $phone,
    'Produkt'       => $product,
    'Stückzahl'     => $quantity,
    'Farbe'         => $color,
    'Druckposition' => $position . ($view !== '' ? ' (' . $view . ')' : ''),
    'Druckgröße'    => $printSize,
    'Auflösung'     => $dpi !== '' ? 'ca. ' . $dpi . ' dpi' . ((int) $dpi < 150 ? ' (gering, bitte prüfen)' : '') : '',
    'Größen'        => $sizeText,
    'Wunschtermin'  => format_date($deadline),
    'Lieferung'     => $delivery,
    'PLZ und Ort'   => $delivery === 'Versand' ? $zip : '',
    'Design vorhanden' => $design,
];
$fileNames = array_map(function ($f) { return $f['name']; }, $files);
if ($fileNames) $rows['Dateien'] = implode(', ', $fileNames);
elseif ($design !== 'Nein') $rows['Dateien'] = 'keine hochgeladen (kommen ggf. per E-Mail oder WhatsApp, oder Designvorschläge gewünscht)';

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
    ($lang === 'en' ? 'Quantity' : 'Stückzahl') => $quantity . ($sizeText !== '' ? ' (' . $sizeText . ')' : ''),
    ($lang === 'en' ? 'Colour' : 'Farbe') => $color,
    ($lang === 'en' ? 'Position' : 'Position') => $position,
    ($lang === 'en' ? 'Preferred date' : 'Wunschtermin') => format_date($deadline),
    ($lang === 'en' ? 'Delivery' : 'Lieferung') => $delivery === 'Noch offen' ? '' : ($lang === 'en'
        ? ($delivery === 'Versand' ? 'Shipping' : 'Pickup in Trier')
        : $delivery),
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
