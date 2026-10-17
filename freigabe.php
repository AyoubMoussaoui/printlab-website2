<?php
/* ==========================================================================
   PRINT LAB Trier: approve, reject or remove a review from the links in the
   review e-mail. The link (GET) only shows the review and a button; the
   change happens on the button (POST). E-mail programs that open links in
   the background (e.g. Outlook Safe Links) therefore cannot publish
   anything. Each link works only for its own review and action.
   ========================================================================== */
declare(strict_types=1);
ini_set('display_errors', '0');
require __DIR__ . '/inc/reviews.php';

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('Referrer-Policy: no-referrer');

const ACTIONS = [
    'publish' => ['Bewertung veröffentlichen?', 'Veröffentlichen', 'btn--primary'],
    'reject'  => ['Bewertung ablehnen?', 'Ablehnen und löschen', 'btn--outline'],
    'remove'  => ['Bewertung von der Website entfernen?', 'Entfernen', 'btn--outline'],
];
const RESULTS = [
    'published'         => 'Veröffentlicht. Die Bewertung ist jetzt auf der Website zu sehen.',
    'already-published' => 'Diese Bewertung ist bereits veröffentlicht.',
    'rejected'          => 'Abgelehnt. Die Bewertung wurde gelöscht und erscheint nicht auf der Website.',
    'removed'           => 'Entfernt. Die Bewertung ist nicht mehr auf der Website zu sehen.',
    'missing'           => 'Diese Bewertung gibt es nicht (mehr). Vielleicht wurde sie schon bearbeitet.',
    'invalid'           => 'Dieser Link ist ungültig.',
    'error'             => 'Das hat leider nicht geklappt. Bitte versuche es später noch einmal.',
];

$src    = $_SERVER['REQUEST_METHOD'] === 'POST' ? $_POST : $_GET;
$id     = (string) ($src['id'] ?? '');
$action = (string) ($src['a'] ?? '');
$token  = (string) ($src['t'] ?? '');

$h = function (string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); };
$review = null;
$result = null;

try {
    if (!valid_review_id($id) || !isset(ACTIONS[$action]) || !hash_equals(review_token($id, $action), $token)) {
        $result = 'invalid';
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $result = apply_review_action($id, $action);
    } else {
        $review = $action === 'remove' ? find_live_review($id) : (load_pending_review($id) ?: null);
        if (!$review) $result = ($action !== 'remove' && find_live_review($id)) ? 'already-published' : 'missing';
    }
} catch (Throwable $e) {
    $result = 'error';
}
if ($result === 'invalid') http_response_code(403);
?>
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Bewertung freigeben | PRINT LAB Trier</title>
  <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
  <link rel="icon" href="/assets/icons/favicon-48.png" type="image/png" sizes="48x48">
  <link rel="icon" href="/assets/icons/favicon-96.png" type="image/png" sizes="96x96">
  <link rel="icon" href="/assets/icons/icon-192.png" type="image/png" sizes="192x192">
  <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="css/variables.css?v=<?= (int) @filemtime(__DIR__ . '/css/variables.css') ?>">
  <link rel="stylesheet" href="css/base.css?v=<?= (int) @filemtime(__DIR__ . '/css/base.css') ?>">
  <link rel="stylesheet" href="css/layout.css?v=<?= (int) @filemtime(__DIR__ . '/css/layout.css') ?>">
  <link rel="stylesheet" href="css/components.css?v=<?= (int) @filemtime(__DIR__ . '/css/components.css') ?>">
  <link rel="stylesheet" href="css/responsive.css?v=<?= (int) @filemtime(__DIR__ . '/css/responsive.css') ?>">
</head>
<body class="page-dark">
  <main class="section section--dark approve">
    <div class="container approve__inner">
      <p class="section-head__kicker">Bewertungen</p>
<?php if ($review): [$title, $label, $btn] = ACTIONS[$action]; ?>
      <h1 class="approve__title"><?= $h($title) ?></h1>
      <article class="rv-card approve__review">
        <p class="rv-item__name"><?= $h((string) ($review['name'] ?? 'Anonym')) ?>
          <?php if (!empty($review['context'])): ?><span class="rv-item__context"><?= $h((string) $review['context']) ?></span><?php endif; ?></p>
        <p class="approve__stars" aria-label="<?= (int) $review['rating'] ?> von 5 Sternen"><?= str_repeat('★', (int) $review['rating']) . str_repeat('☆', 5 - (int) $review['rating']) ?></p>
        <p class="rv-item__text"><?= $h((string) $review['text']) ?></p>
        <?php if (!empty($review['email'])): ?><p class="approve__meta">E-Mail (wird nicht veröffentlicht): <?= $h((string) $review['email']) ?></p><?php endif; ?>
        <?php if (!empty($review['order'])): ?><p class="approve__meta">Bestellnummer (wird nicht veröffentlicht): <?= $h((string) $review['order']) ?></p><?php endif; ?>
      </article>
      <form method="post" class="approve__actions">
        <input type="hidden" name="id" value="<?= $h($id) ?>">
        <input type="hidden" name="a" value="<?= $h($action) ?>">
        <input type="hidden" name="t" value="<?= $h($token) ?>">
        <button class="btn <?= $btn ?>" type="submit"><?= $h($label) ?></button>
        <a class="btn btn--outline" href="bewertungen">Abbrechen</a>
      </form>
<?php else: ?>
      <h1 class="approve__title"><?= $h(RESULTS[$result] ?? RESULTS['error']) ?></h1>
      <div class="approve__actions">
        <a class="btn btn--primary" href="bewertungen">Zu den Bewertungen</a>
<?php if ($result === 'published' && valid_review_id($id)): ?>
        <a class="btn btn--outline" href="<?= $h(review_link($id, 'remove')) ?>">Doch wieder entfernen</a>
<?php endif; ?>
      </div>
<?php endif; ?>
    </div>
  </main>
</body>
</html>
