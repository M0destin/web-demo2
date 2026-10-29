<?php
/* ==========================================================================
   CONSTRE SOLUTIONS: contact form settings
   Reads the secrets and settings (see .env.example for the full list).
   They come from real environment variables when the host provides them,
   otherwise from a .env file. The file is looked for, in this order:
     1. the path in the CONSTRE_ENV_FILE environment variable
     2. one folder ABOVE the website folder (recommended: never public)
     3. the website folder itself (protected by .htaccess as a fallback)
   ========================================================================== */

declare(strict_types=1);

function constre_load_env(): array
{
    static $values = null;
    if ($values !== null) return $values;

    $values = [];
    $siteRoot = dirname(__DIR__, 2);                 // the folder with index.html
    $candidates = array_filter([
        getenv('CONSTRE_ENV_FILE') ?: null,
        dirname($siteRoot) . '/.env',
        $siteRoot . '/.env',
    ]);

    foreach ($candidates as $file) {
        if (!is_file($file) || !is_readable($file)) continue;
        foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) continue;
            [$key, $value] = array_map('trim', explode('=', $line, 2));
            // Strip matching surrounding quotes: KEY="value" or KEY='value'
            if (strlen($value) >= 2 && ($value[0] === '"' || $value[0] === "'") && substr($value, -1) === $value[0]) {
                $value = substr($value, 1, -1);
            }
            $values[$key] = $value;
        }
        break;                                       // first file found wins
    }
    return $values;
}

/** One setting: a real environment variable wins over the .env file. */
function env(string $key, ?string $default = null): ?string
{
    $real = getenv($key);
    if ($real !== false && $real !== '') return $real;
    $file = constre_load_env();
    return isset($file[$key]) && $file[$key] !== '' ? $file[$key] : $default;
}

function env_bool(string $key, bool $default): bool
{
    $value = env($key);
    if ($value === null) return $default;
    return in_array(strtolower($value), ['1', 'true', 'yes', 'on'], true);
}

/** All settings the form uses, with safe defaults. */
function constre_config(): array
{
    $siteRoot = dirname(__DIR__, 2);
    return [
        'env'            => env('APP_ENV', 'production'),          // 'development' also allows localhost
        'to'             => env('CONTACT_TO_EMAIL', 'info@constre.com'),
        'from_email'     => env('MAIL_FROM_EMAIL', 'noreply@constre.com'),
        'from_name'      => env('MAIL_FROM_NAME', 'Constre website'),
        'provider'       => strtolower(env('MAIL_PROVIDER', 'brevo')),   // brevo | resend | log
        'brevo_key'      => env('BREVO_API_KEY'),
        'resend_key'     => env('RESEND_API_KEY'),
        'turnstile_site' => env('TURNSTILE_SITE_KEY'),
        'turnstile_key'  => env('TURNSTILE_SECRET_KEY'),
        'form_secret'    => env('FORM_SECRET'),                     // signs the form timestamp
        'origins'        => array_filter(array_map('trim', explode(',',
                                env('ALLOWED_ORIGINS', 'https://constre.com,https://www.constre.com')))),
        'rate_limit'     => env_bool('RATE_LIMIT_ENABLED', true),
        // Rate-limit and duplicate records: outside the website folder by default
        'data_dir'       => env('DATA_DIR', dirname($siteRoot) . '/constre-form-data'),
    ];
}
