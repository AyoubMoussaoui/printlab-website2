<?php
/* PRINT LAB Trier: published reviews as JSON for bewertungen.html and the
   home page (js/bewertungen.js, js/main.js). Only public fields. */
declare(strict_types=1);
ini_set('display_errors', '0');
require __DIR__ . '/inc/reviews.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache');
header('X-Robots-Tag: noindex');

try {
    $reviews = public_reviews(load_live_reviews());
} catch (Throwable $e) {
    // No storage yet: show what is in the repository
    $seed = json_decode((string) @file_get_contents(__DIR__ . '/reviews.json'), true);
    $reviews = is_array($seed) ? public_reviews($seed) : [];
}
echo json_encode($reviews, JSON_UNESCAPED_UNICODE);
