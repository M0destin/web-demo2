<?php
/* ==========================================================================
   CONSTRE SOLUTIONS: contact form spam protection
   Origin check, signed time trap, Cloudflare Turnstile, per-IP rate
   limits and duplicate detection. Records are small files in DATA_DIR
   (outside the website folder); IP addresses are stored only as hashes.
   ========================================================================== */

declare(strict_types=1);

const MIN_FILL_SECONDS = 3;          // faster than this is a bot
const MAX_FORM_AGE = 7200;           // 2 hours: the page refreshes its token every hour
const RATE_LIMITS = [600 => 3, 86400 => 10];   // seconds => max submissions per IP
const DUPLICATE_WINDOW = 600;        // identical message ignored for 10 minutes

/** Writes one line to the server log: outcome and reason only, never personal data. */
function log_outcome(string $outcome, string $reason): void
{
    error_log('[contact-form] outcome=' . $outcome . ' reason=' . $reason);
}

/* ---- Origin ------------------------------------------------------------ */

/** True when the request comes from the site itself (Origin, or Referer as a fallback). */
function origin_allowed(array $config): bool
{
    $source = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($source === '' || $source === 'null') $source = $_SERVER['HTTP_REFERER'] ?? '';
    $parts = parse_url($source);
    if (empty($parts['scheme']) || empty($parts['host'])) return false;

    $origin = strtolower($parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : ''));
    if (in_array($origin, array_map('strtolower', $config['origins']), true)) return true;

    return $config['env'] === 'development'
        && in_array($parts['host'], ['localhost', '127.0.0.1'], true);
}

/* ---- Time trap ---------------------------------------------------------- */

/** A token holding the time the form was shown, signed so it can't be faked. */
function make_form_token(string $secret): string
{
    $time = (string) time();
    return $time . '.' . hash_hmac('sha256', $time, $secret);
}

/** 'ok', 'invalid', 'too_fast' or 'stale' */
function check_form_token(string $token, string $secret): string
{
    if (!preg_match('/^(\d{9,12})\.([a-f0-9]{64})$/', $token, $m)) return 'invalid';
    if (!hash_equals(hash_hmac('sha256', $m[1], $secret), $m[2])) return 'invalid';
    $age = time() - (int) $m[1];
    if ($age < -60) return 'invalid';                // from the future
    if ($age < MIN_FILL_SECONDS) return 'too_fast';
    if ($age > MAX_FORM_AGE) return 'stale';
    return 'ok';
}

/* ---- Cloudflare Turnstile ---------------------------------------------- */

/** 'ok', 'failed', or 'unreachable' (Cloudflare couldn't be asked: logged separately) */
function verify_turnstile(string $token, string $secret, string $ip): string
{
    if ($token === '' || strlen($token) > 2048) return 'failed';
    $response = http_post_json('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $ip,
    ], [], true);
    if (!is_array($response['body'])) return 'unreachable';
    return ($response['body']['success'] ?? false) === true ? 'ok' : 'failed';
}

/* ---- Rate limits and duplicates ---------------------------------------- */

/** The folder for records, created on first use. Null when it can't be written. */
function data_dir(array $config): ?string
{
    $dir = rtrim($config['data_dir'], '/\\');
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) return null;
    if (!is_writable($dir)) return null;
    // Belt and braces, in case the folder ends up inside the website
    if (!is_file($dir . '/.htaccess')) @file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n");
    return $dir;
}

/**
 * Opens a small JSON record, lets $update change it, and saves it, with a
 * file lock so two requests at once can't both slip through.
 * $update receives the stored array and returns [new array, result].
 */
function with_record(string $dir, string $name, callable $update)
{
    $handle = @fopen($dir . '/' . $name . '.json', 'c+');
    if ($handle === false) return null;
    try {
        flock($handle, LOCK_EX);
        $stored = json_decode((string) stream_get_contents($handle), true);
        [$next, $result] = $update(is_array($stored) ? $stored : []);
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($next));
        fflush($handle);
        return $result;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

/** Records this attempt and says whether the IP is over a limit. */
function rate_limited(string $dir, string $ipHash): bool
{
    $now = time();
    return (bool) with_record($dir, 'rate-' . $ipHash, static function (array $times) use ($now) {
        $longest = max(array_keys(RATE_LIMITS));
        $times = array_values(array_filter($times, static function ($t) use ($now, $longest) {
            return is_int($t) && $t > $now - $longest;
        }));
        foreach (RATE_LIMITS as $window => $max) {
            $recent = count(array_filter($times, static function ($t) use ($now, $window) { return $t > $now - $window; }));
            if ($recent >= $max) return [$times, true];
        }
        $times[] = $now;
        return [$times, false];
    });
}

/** Keys that identify "the same message from the same sender" (by email and by IP). */
function duplicate_keys(array $data, string $ipHash, string $secret): array
{
    $message = preg_replace('/\s+/u', ' ', $data['message']);
    $message = function_exists('mb_strtolower') ? mb_strtolower($message, 'UTF-8') : strtolower($message);
    return [
        hash_hmac('sha256', 'email|' . strtolower($data['email']) . '|' . $message, $secret),
        hash_hmac('sha256', 'ip|' . $ipHash . '|' . $message, $secret),
    ];
}

function is_duplicate(string $dir, array $keys): bool
{
    foreach ($keys as $key) {
        $file = $dir . '/dup-' . $key . '.json';
        if (is_file($file) && filemtime($file) > time() - DUPLICATE_WINDOW) return true;
    }
    return false;
}

function remember_message(string $dir, array $keys): void
{
    foreach ($keys as $key) @touch($dir . '/dup-' . $key . '.json');
}

/** Now and then, deletes records older than two days. */
function cleanup_records(string $dir): void
{
    if (random_int(1, 50) !== 1) return;
    foreach (glob($dir . '/*.json') ?: [] as $file) {
        if (filemtime($file) < time() - 2 * 86400) @unlink($file);
    }
}

/* ---- HTTP helper -------------------------------------------------------- */

/**
 * POSTs to an API and decodes the JSON reply.
 * $form: send as a normal form (Turnstile) instead of JSON.
 * Returns ['status' => int, 'body' => array|null]; status 0 = no connection.
 */
function http_post_json(string $url, array $payload, array $headers = [], bool $form = false): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $form ? http_build_query($payload) : json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => array_merge(
            ['Accept: application/json', 'Content-Type: ' . ($form ? 'application/x-www-form-urlencoded' : 'application/json')],
            $headers
        ),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
    ]);
    $raw = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    // Needed only before PHP 8: it does nothing since 8.0 and is deprecated in 8.5
    if (PHP_VERSION_ID < 80000) curl_close($ch);
    return ['status' => $raw === false ? 0 : $status, 'body' => is_string($raw) ? json_decode($raw, true) : null];
}
