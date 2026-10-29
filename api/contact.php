<?php
/* ==========================================================================
   CONSTRE SOLUTIONS: contact form endpoint  (api/contact.php)

   GET   → { siteKey, formToken }  the Turnstile site key and a signed
           timestamp; the contact page asks for these when it loads.
   POST  → JSON with the form fields → { ok: true } or { ok: false, ... }

   Checks, in order (each one is done here on the server):
     1. POST from constre.com only (Origin / Referer)
     2. body under 20 KB, valid JSON, no unknown fields
     3. honeypot field empty                 → bots get a fake "success"
     4. signed time trap: 3 s – 2 h           → too fast: fake "success"
     5. rate limit: 3 per 10 min, 10 per day per IP
     6. field validation, line breaks, links
     7. Cloudflare Turnstile
     8. same message within 10 minutes        → ignored, fake "success"
   Then the email is sent to CONTACT_TO_EMAIL. Rejections return one
   generic error, so a bot can't tell which check stopped it.
   Setup: CONTACT_FORM_SETUP.md
   ========================================================================== */

declare(strict_types=1);

require __DIR__ . '/lib/config.php';
require __DIR__ . '/lib/validate.php';
require __DIR__ . '/lib/guard.php';
require __DIR__ . '/lib/mailer.php';

const MAX_BODY_BYTES = 20480;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

/** Sends the JSON reply and stops. */
function reply(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Looks like success to whoever sent it, but nothing is sent. */
function fake_success(string $reason): void
{
    log_outcome('ignored', $reason);
    reply(200, ['ok' => true]);
}

/** The one error every rejected request gets. */
function reject(int $status, string $reason): void
{
    log_outcome('rejected', $reason);
    reply($status, ['ok' => false, 'error' => 'generic']);
}

$config = constre_config();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Settings check: without these the form can't work safely
if ((string) $config['form_secret'] === '' || strlen((string) $config['form_secret']) < 32
    || (string) $config['turnstile_key'] === '' || (string) $config['turnstile_site'] === ''
    || !mailer_configured($config)) {
    reject(503, 'misconfigured');
}

/* ---- GET: what the page needs to show the form ------------------------- */
if ($method === 'GET') {
    reply(200, [
        'siteKey' => $config['turnstile_site'],
        'formToken' => make_form_token($config['form_secret']),
    ]);
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    reject(405, 'method');
}

/* ---- 1. Origin --------------------------------------------------------- */
if (!origin_allowed($config)) reject(403, 'origin');

/* ---- 2. Size and shape -------------------------------------------------- */
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY_BYTES) reject(413, 'too_large');
$raw = (string) file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if (strlen($raw) > MAX_BODY_BYTES) reject(413, 'too_large');

$input = json_decode($raw, true);
if (!is_array($input) || array_is_list_compat($input)) reject(400, 'bad_json');

/* ---- 3. Honeypot -------------------------------------------------------- */
if (isset($input['website']) && $input['website'] !== '') fake_success('honeypot');

/* ---- 4. Time trap ------------------------------------------------------- */
$tokenState = check_form_token(is_string($input['formToken'] ?? null) ? $input['formToken'] : '', $config['form_secret']);
if ($tokenState === 'too_fast' || $tokenState === 'invalid') fake_success('time_' . $tokenState);
// A form left open for hours: a real person, so a normal error (their text stays in the form)
if ($tokenState === 'stale') reject(400, 'time_stale');

/* ---- 5. Rate limit ------------------------------------------------------ */
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$ipHash = hash_hmac('sha256', $ip, $config['form_secret']);
$dir = $config['rate_limit'] ? data_dir($config) : null;
if ($config['rate_limit'] && $dir === null) log_outcome('warning', 'store_unavailable');
if ($dir !== null) {
    cleanup_records($dir);
    if (rate_limited($dir, $ipHash)) reject(429, 'rate_limited');
}

/* ---- 6. Validation ------------------------------------------------------ */
$result = validate_submission($input);
if (isset($result['spam'])) reject(400, $result['spam']);
if (isset($result['fields'])) {
    log_outcome('rejected', 'validation');
    reply(422, ['ok' => false, 'error' => 'validation', 'fields' => $result['fields']]);
}
$data = $result['data'];

/* ---- 7. Turnstile ------------------------------------------------------- */
$turnstileToken = is_string($input['turnstileToken'] ?? null) ? $input['turnstileToken'] : '';
$turnstile = verify_turnstile($turnstileToken, $config['turnstile_key'], $ip);
if ($turnstile !== 'ok') reject($turnstile === 'unreachable' ? 502 : 400, 'turnstile_' . $turnstile);

/* ---- 8. Duplicates ------------------------------------------------------ */
$duplicateKeys = duplicate_keys($data, $ipHash, $config['form_secret']);
if ($dir !== null && is_duplicate($dir, $duplicateKeys)) fake_success('duplicate');

/* ---- Send --------------------------------------------------------------- */
if (!send_quote_email($config, $data)) reject(502, 'send_failed');
if ($dir !== null) remember_message($dir, $duplicateKeys);
log_outcome('sent', 'ok');
reply(200, ['ok' => true]);


/** True for a JSON array ([...]) rather than an object ({...}); works before PHP 8.1. */
function array_is_list_compat(array $value): bool
{
    return $value !== [] && array_keys($value) === range(0, count($value) - 1);
}
