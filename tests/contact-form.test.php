<?php
/* ==========================================================================
   CONSTRE SOLUTIONS: contact form tests
   Sends real requests to a local copy of the site and checks what
   api/contact.php does. Nothing is emailed: the test settings use
   MAIL_PROVIDER=log, which saves each email in DATA_DIR/outbox.

   HOW TO RUN (see CONTACT_FORM_SETUP.md, "Testing"):
     1. Make a test settings file from tests/test.env.example
     2. Start PHP's built-in server in the website folder:
          CONSTRE_ENV_FILE=tests/test.env php -S localhost:8081
     3. In a second terminal:
          php tests/contact-form.test.php http://localhost:8081 tests/test.env
   Needs internet (Turnstile test keys are checked by Cloudflare).
   ========================================================================== */

declare(strict_types=1);

$base = rtrim($argv[1] ?? 'http://localhost:8081', '/');
$envFile = $argv[2] ?? __DIR__ . '/test.env';
putenv('CONSTRE_ENV_FILE=' . $envFile);
require __DIR__ . '/../api/lib/config.php';
require __DIR__ . '/../api/lib/guard.php';
$config = constre_config();
$outbox = rtrim($config['data_dir'], '/\\') . '/outbox';

if ($config['provider'] !== 'log' || $config['env'] !== 'development') {
    fwrite(STDERR, "Use test settings with MAIL_PROVIDER=log and APP_ENV=development.\n");
    exit(1);
}

$passed = 0;
$failed = 0;
function check(string $name, bool $ok, string $detail = ''): void
{
    global $passed, $failed;
    $ok ? $passed++ : $failed++;
    echo ($ok ? "PASS " : "FAIL ") . $name . ($ok || $detail === '' ? '' : "  ($detail)") . "\n";
}

/** A signed timestamp from $secondsAgo seconds ago (what the page would hold). */
function token(int $secondsAgo = 10): string
{
    global $config;
    $time = (string) (time() - $secondsAgo);
    return $time . '.' . hash_hmac('sha256', $time, $config['form_secret']);
}

function post(array $body, array $headers = [], ?string $raw = null): array
{
    global $base;
    $ch = curl_init($base . '/api/contact.php');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $raw ?? json_encode($body, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => array_merge(['Content-Type: application/json', 'Origin: http://localhost:8081'], $headers),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
    ]);
    $response = (string) curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['status' => $status, 'body' => json_decode($response, true)];
}

function valid(array $overrides = []): array
{
    static $n = 0;
    $n++;
    return array_merge([
        'name' => 'Test Person',
        'email' => 'visitor@example.com',
        'phone' => '+370 600 00000',
        'company' => 'UAB Testas',
        'message' => "Test message number $n: a 120 m2 extension in Vilnius.",
        'lang' => 'lt',
        'website' => '',
        'formToken' => token(),
        'turnstileToken' => 'XXXX.DUMMY.TOKEN.XXXX',   // accepted by the Turnstile test secret
    ], $overrides);
}

function outbox_files(): array
{
    global $outbox;
    return glob($outbox . '/*.json') ?: [];
}

function last_email(): ?array
{
    $files = outbox_files();
    sort($files);
    return $files ? json_decode((string) file_get_contents(end($files)), true) : null;
}

/** Forget the rate-limit records, so each test starts fresh. */
function reset_limits(): void
{
    global $config;
    $dir = rtrim($config['data_dir'], '/\\');
    foreach (array_merge(glob($dir . '/rate-*.json') ?: [], glob($dir . '/dup-*.json') ?: []) as $file) unlink($file);
}

/** Runs one request and reports whether an email was "sent". */
function attempt(array $body, array $headers = [], ?string $raw = null): array
{
    reset_limits();
    $before = count(outbox_files());
    $result = post($body, $headers, $raw);
    $result['sent'] = count(outbox_files()) > $before;
    return $result;
}

echo "Testing $base\n\n";

// 1. Valid submission arrives, with the right sender, recipient and Reply-To
$r = attempt(valid(['name' => 'Jonas Jonaitis', 'email' => 'jonas@example.com']));
$mail = last_email();
check('valid submission is sent', $r['status'] === 200 && ($r['body']['ok'] ?? false) && $r['sent'], json_encode($r));
check('From is our own address', $mail && $mail['from'] === $config['from_name'] . ' <' . $config['from_email'] . '>');
check('To is CONTACT_TO_EMAIL', $mail && $mail['to'] === $config['to']);
check('Reply-To is the visitor', $mail && $mail['reply_to'] === 'jonas@example.com');
check('subject has name and company', $mail && $mail['subject'] === 'New quote request – Jonas Jonaitis – UAB Testas', $mail['subject'] ?? '');
check('plain-text version included', $mail && strpos($mail['text'], 'Jonas Jonaitis') !== false && strpos($mail['text'], 'Site language: LT') !== false);

// 2. Honeypot filled: looks like success, nothing sent
$r = attempt(valid(['website' => 'http://spam.example']));
check('honeypot: fake success, nothing sent', $r['status'] === 200 && ($r['body']['ok'] ?? false) && !$r['sent']);

// 3. Too fast: looks like success, nothing sent
$r = attempt(valid(['formToken' => token(1)]));
check('sent within 3 s: fake success, nothing sent', $r['status'] === 200 && !$r['sent']);

// 4. Forged and stale timestamps
$r = attempt(valid(['formToken' => time() - 60 . '.' . str_repeat('a', 64)]));
check('forged timestamp: nothing sent', !$r['sent']);
$r = attempt(valid(['formToken' => token(3 * 3600)]));
check('3-hour-old form: generic error', $r['status'] === 400 && ($r['body']['error'] ?? '') === 'generic' && !$r['sent']);

// 5. Rate limit: the 4th submission within 10 minutes is refused
reset_limits();
$statuses = [];
for ($i = 0; $i < 4; $i++) $statuses[] = post(valid())['status'];
check('4th submit in 10 min is rate-limited', $statuses === [200, 200, 200, 429], implode(',', $statuses));

// 6. Validation
$r = attempt(valid(['email' => 'not-an-email']));
check('invalid email rejected', $r['status'] === 422 && isset($r['body']['fields']['email']) && !$r['sent']);
$r = attempt(valid(['name' => 'J']));
check('1-character name rejected', $r['status'] === 422 && isset($r['body']['fields']['name']));
$r = attempt(valid(['message' => 'Too short']));
check('9-character message rejected', $r['status'] === 422 && isset($r['body']['fields']['message']));
$r = attempt(valid(['phone' => '+370 600 00000 ext. 5']));
check('letters in phone rejected', $r['status'] === 422 && isset($r['body']['fields']['phone']));
$r = attempt(valid(['company' => str_repeat('Ą', 151)]));
check('151-character company rejected', $r['status'] === 422 && isset($r['body']['fields']['company']));
$r = attempt(valid(['extra' => 'x']));
check('unknown extra field rejected', $r['status'] === 400 && !$r['sent']);
$r = attempt([], [], json_encode(valid(['message' => str_repeat('a', 25000)])));
check('body over 20 KB rejected', $r['status'] === 413 && !$r['sent']);

// 7. Header injection: line breaks in single-line fields
$r = attempt(valid(['name' => "Jonas\r\nBcc: victim@example.com"]));
check('CR/LF in name rejected (generic error)', $r['status'] === 400 && ($r['body']['error'] ?? '') === 'generic' && !$r['sent']);
$r = attempt(valid(['email' => "jonas@example.com\nBcc: x@example.com"]));
check('CR/LF in email rejected', $r['status'] === 400 && !$r['sent']);

// 8. Links
$r = attempt(valid(['message' => 'See https://a.example https://b.example https://c.example www.d.example now']));
check('4 links rejected', $r['status'] === 400 && !$r['sent']);
$r = attempt(valid(['message' => 'Plans: https://a.example https://b.example https://c.example ok']));
check('3 links allowed', $r['status'] === 200 && $r['sent']);
$r = attempt(valid(['name' => 'Visit www.spam.example']));
check('link in name rejected', $r['status'] === 400 && !$r['sent']);

// 9. HTML/script is escaped in the email
$r = attempt(valid(['message' => '<script>alert(1)</script> <b>bold</b> & "quotes"']));
$mail = last_email();
check('HTML in message is escaped',
    $r['sent'] && strpos($mail['html'], '<script>') === false && strpos($mail['html'], '&lt;script&gt;alert(1)&lt;/script&gt;') !== false);

// 10. Lithuanian and Russian text arrives intact
$lt = 'Ąžuolinės grindys, čerpių stogas: ę ė į š ų ū ž Č Š Ž.';
$ru = 'Здравствуйте! Нужен ремонт квартиры, кириллица.';
$r = attempt(valid(['name' => 'Žydrūnė Šimkūnaitė', 'message' => $lt . "\n" . $ru]));
$mail = last_email();
check('LT + RU characters arrive intact', $r['sent'] && strpos($mail['text'], $lt) !== false && strpos($mail['text'], $ru) !== false
    && strpos($mail['subject'], 'Žydrūnė Šimkūnaitė') !== false);

// 11. Same message again within 10 minutes is ignored
reset_limits();
$same = valid(['message' => 'Exactly the same message, sent twice by mistake.']);
$first = post($same);
$before = count(outbox_files());
$second = post(array_merge($same, ['formToken' => token()]));
check('duplicate within 10 min ignored', $first['status'] === 200 && $second['status'] === 200 && count(outbox_files()) === $before);

// 12. Wrong origin, missing Turnstile, wrong method
$r = attempt(valid(), ['Origin: https://evil.example']);
check('other website (Origin) rejected', $r['status'] === 403 && !$r['sent']);
$r = attempt(valid(['turnstileToken' => '']));
check('missing Turnstile token rejected', $r['status'] === 400 && !$r['sent']);
$ch = curl_init($base . '/api/contact.php');
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true]);
$get = json_decode((string) curl_exec($ch), true);
curl_close($ch);
check('GET returns site key and signed timestamp', isset($get['siteKey'], $get['formToken']) && check_form_token($get['formToken'], $config['form_secret']) === 'too_fast');

reset_limits();
echo "\n$passed passed, $failed failed\n";
exit($failed ? 1 : 0);
