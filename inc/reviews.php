<?php
/* ==========================================================================
   PRINT LAB Trier: review storage and approval links (shared by
   anfrage.php, freigabe.php and reviews.php). Not reachable on its own
   (blocked in .htaccess).

   - Submitted reviews wait in <data>/pending/<id>.json.
   - Published reviews are in <data>/live.json. The first time it is read,
     it is filled from reviews.json in the repository (older reviews).
   - Approval links carry an HMAC of id and action, made with a random key
     that is created on the server (<data>/secret.key) and never leaves it.

   <data> is "printlab-data" next to the web folder (outside the public
   area, not touched by deployments). If that is not writable, the "data"
   folder in the web folder is used, which .htaccess blocks.
   ========================================================================== */

declare(strict_types=1);

const REVIEW_TZ       = 'Europe/Berlin';
const REVIEW_SITE     = 'https://printlab-trier.de';
const PENDING_MAX_AGE = 60 * 86400; // unanswered reviews are deleted after 60 days

function reviews_dir(): string
{
    static $dir = null;
    if ($dir !== null) return $dir;
    $web = dirname(__DIR__);
    foreach ([dirname($web) . '/printlab-data', $web . '/data'] as $candidate) {
        if ((is_dir($candidate) || @mkdir($candidate, 0700, true)) && is_writable($candidate)) {
            if (!is_dir($candidate . '/pending')) @mkdir($candidate . '/pending', 0700, true);
            return $dir = $candidate;
        }
    }
    throw new RuntimeException('No writable folder for reviews');
}

function reviews_secret(): string
{
    $file = reviews_dir() . '/secret.key';
    $key = is_file($file) ? trim((string) file_get_contents($file)) : '';
    if (strlen($key) < 64) {
        $key = bin2hex(random_bytes(32));
        file_put_contents($file, $key, LOCK_EX);
        @chmod($file, 0600);
    }
    return $key;
}

function review_token(string $id, string $action): string
{
    return hash_hmac('sha256', $id . '|' . $action, reviews_secret());
}

function review_link(string $id, string $action): string
{
    return REVIEW_SITE . '/freigabe.php?id=' . rawurlencode($id) . '&a=' . $action . '&t=' . review_token($id, $action);
}

function valid_review_id(string $id): bool
{
    return (bool) preg_match('/^[a-z0-9-]{4,40}$/', $id);
}

/* Runs $fn while holding an exclusive lock, so two clicks or two
   submissions at the same moment cannot overwrite each other. */
function reviews_locked(callable $fn)
{
    $lock = fopen(reviews_dir() . '/.lock', 'c');
    flock($lock, LOCK_EX);
    try {
        return $fn();
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function write_json_file(string $file, $data): void
{
    $tmp = $file . '.tmp';
    file_put_contents($tmp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
    rename($tmp, $file);
}

/** Published reviews (all fields as stored). */
function load_live_reviews(): array
{
    $file = reviews_dir() . '/live.json';
    if (!is_file($file)) {
        $seed = json_decode((string) @file_get_contents(dirname(__DIR__) . '/reviews.json'), true);
        $seed = is_array($seed) ? array_values($seed) : [];
        foreach ($seed as $i => $r) {
            if (is_array($r) && empty($r['id'])) $seed[$i]['id'] = 'seed-' . ($i + 1);
        }
        write_json_file($file, $seed);
        return $seed;
    }
    $data = json_decode((string) file_get_contents($file), true);
    return is_array($data) ? $data : [];
}

/** What the website shows: never the e-mail address. */
function public_reviews(array $reviews): array
{
    $out = [];
    foreach ($reviews as $r) {
        if (!is_array($r) || !isset($r['rating'], $r['text'])) continue;
        $out[] = [
            'id'      => (string) ($r['id'] ?? ''),
            'name'    => (string) ($r['name'] ?? 'Anonym'),
            'context' => (string) ($r['context'] ?? ''),
            'date'    => (string) ($r['date'] ?? ''),
            'rating'  => (int) $r['rating'],
            'text'    => (string) $r['text'],
        ];
    }
    return $out;
}

function pending_file(string $id): string
{
    return reviews_dir() . '/pending/' . $id . '.json';
}

/** Stores a submitted review until it is approved; returns its id. */
function create_pending_review(array $review): string
{
    $id = bin2hex(random_bytes(8));
    $review['id'] = $id;
    $review['date'] = (new DateTime('now', new DateTimeZone(REVIEW_TZ)))->format('Y-m-d\TH:i');
    write_json_file(pending_file($id), $review);
    // Tidy up reviews nobody answered
    foreach ((array) glob(reviews_dir() . '/pending/*.json') as $old) {
        if (is_string($old) && filemtime($old) < time() - PENDING_MAX_AGE) @unlink($old);
    }
    return $id;
}

function load_pending_review(string $id): ?array
{
    if (!valid_review_id($id) || !is_file(pending_file($id))) return null;
    $data = json_decode((string) file_get_contents(pending_file($id)), true);
    return is_array($data) ? $data : null;
}

function find_live_review(string $id): ?array
{
    foreach (load_live_reviews() as $r) {
        if (is_array($r) && ($r['id'] ?? '') === $id) return $r;
    }
    return null;
}

/** publish | reject | remove. Returns a short status for the result page. */
/** E-mail address and order number are only needed to check a review, so
    they are not kept once it is published (also cleans older entries). */
function strip_private(array $reviews): array
{
    return array_map(function ($r) {
        if (is_array($r)) unset($r['email'], $r['order']);
        return $r;
    }, $reviews);
}

function apply_review_action(string $id, string $action): string
{
    return reviews_locked(function () use ($id, $action) {
        if ($action === 'publish') {
            if (find_live_review($id)) return 'already-published';
            $review = load_pending_review($id);
            if (!$review) return 'missing';
            $live = load_live_reviews();
            $live[] = $review;
            write_json_file(reviews_dir() . '/live.json', strip_private($live));
            @unlink(pending_file($id));
            return 'published';
        }
        if ($action === 'reject') {
            if (!load_pending_review($id)) return find_live_review($id) ? 'already-published' : 'missing';
            @unlink(pending_file($id));
            return 'rejected';
        }
        if ($action === 'remove') {
            $live = load_live_reviews();
            $kept = array_values(array_filter($live, function ($r) use ($id) { return !is_array($r) || ($r['id'] ?? '') !== $id; }));
            if (count($kept) === count($live)) return 'missing';
            write_json_file(reviews_dir() . '/live.json', strip_private($kept));
            return 'removed';
        }
        return 'missing';
    });
}
