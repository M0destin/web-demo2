<?php
/* ==========================================================================
   CONSTRE SOLUTIONS: contact form validation
   The same limits are checked in the browser (js/main.js, "rules"), so
   visitors see errors at once; this is the check that cannot be skipped.
   ========================================================================== */

declare(strict_types=1);

/** Every field the form may send. Anything else is rejected. */
const FORM_FIELDS = ['name', 'email', 'phone', 'company', 'message', 'lang', 'website', 'formToken', 'turnstileToken'];

/** Length in characters (not bytes), so ą, š, ж count as one. -1 for invalid UTF-8. */
function text_length(string $value): int
{
    $count = preg_match_all('/./us', $value);
    return $count === false ? -1 : $count;
}

function has_line_break(string $value): bool
{
    return strpbrk($value, "\r\n") !== false;
}

/** Counts web links: http(s)://… and www.… */
function count_urls(string $value): int
{
    return preg_match_all('~\b(?:https?://|www\.)\S+~iu', $value);
}

/**
 * Checks a decoded submission.
 * Returns ['data' => clean values] when everything is fine,
 * ['fields' => [field => code]] for ordinary mistakes a person can fix,
 * or ['spam' => reason] for content that only bots send. The reason is
 * logged, never shown to the visitor.
 */
function validate_submission(array $input): array
{
    // Unknown extra fields, or values that aren't plain text
    foreach ($input as $key => $value) {
        if (!in_array($key, FORM_FIELDS, true)) return ['spam' => 'unknown_field'];
        if (!is_string($value)) return ['spam' => 'bad_type'];
        if (text_length($value) < 0) return ['spam' => 'bad_encoding'];
    }

    $get = static function (string $key) use ($input): string {
        return isset($input[$key]) ? trim($input[$key]) : '';
    };
    $data = [
        'name'    => $get('name'),
        'email'   => $get('email'),
        'phone'   => $get('phone'),
        'company' => $get('company'),
        'message' => str_replace(["\r\n", "\r"], "\n", $get('message')),
        'lang'    => $get('lang') === 'en' ? 'en' : 'lt',
    ];

    // Header injection: single-line fields must not contain line breaks
    foreach (['name', 'email', 'phone', 'company'] as $key) {
        if (has_line_break($data[$key])) return ['spam' => 'line_break'];
    }
    // Control characters (other than new lines and tabs in the message)
    if (preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', implode('', $data))) return ['spam' => 'control_char'];

    // Links where no person would put them, or a message full of links
    if (count_urls($data['name']) || count_urls($data['company'])) return ['spam' => 'url_in_name'];
    if (count_urls($data['message']) > 3) return ['spam' => 'too_many_urls'];

    $errors = [];
    $nameLength = text_length($data['name']);
    if ($nameLength === 0) $errors['name'] = 'empty';
    elseif ($nameLength < 2 || $nameLength > 100) $errors['name'] = 'length';

    if ($data['email'] === '') $errors['email'] = 'empty';
    elseif (strlen($data['email']) > 254 || filter_var($data['email'], FILTER_VALIDATE_EMAIL) === false) $errors['email'] = 'invalid';

    if ($data['phone'] !== '' && !preg_match('/^[0-9 +()\-]{1,30}$/', $data['phone'])) $errors['phone'] = 'invalid';

    if (text_length($data['company']) > 150) $errors['company'] = 'length';

    $messageLength = text_length($data['message']);
    if ($messageLength === 0) $errors['message'] = 'empty';
    elseif ($messageLength < 10 || $messageLength > 5000) $errors['message'] = 'length';

    return $errors ? ['fields' => $errors] : ['data' => $data];
}
