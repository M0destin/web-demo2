<?php
/* ==========================================================================
   CONSTRE SOLUTIONS: contact form email
   Builds the email (HTML + plain text) and sends it through the email
   service chosen in MAIL_PROVIDER:
     brevo   Brevo transactional API (EU company, recommended)
     resend  Resend API
     log     nothing is sent; the email is saved in DATA_DIR/outbox
             (for local testing only)
   From is always our own address; the visitor goes in Reply-To.
   ========================================================================== */

declare(strict_types=1);

const FIELD_LABELS = [
    'name'    => 'Full name',
    'email'   => 'Email',
    'phone'   => 'Phone',
    'company' => 'Company',
    'message' => 'About the project',
];

function build_email(array $data): array
{
    $subject = 'New quote request – ' . $data['name'] . ($data['company'] !== '' ? ' – ' . $data['company'] : '');
    $sent = (new DateTimeImmutable('now', new DateTimeZone('Europe/Vilnius')))->format('Y-m-d H:i');
    $lang = strtoupper($data['lang']);
    $h = static function (string $value): string {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    };

    $text = "New quote request from the website\n\n";
    $rows = '';
    foreach (FIELD_LABELS as $key => $label) {
        $value = $data[$key] !== '' ? $data[$key] : '—';
        if ($key === 'message') {
            $text .= "\n" . $label . ":\n" . $value . "\n";
            $cell = nl2br($h($value), false);
        } else {
            $text .= $label . ': ' . $value . "\n";
            $cell = $key === 'email' ? '<a href="mailto:' . $h($value) . '">' . $h($value) . '</a>' : $h($value);
        }
        $rows .= '<tr><th align="left" valign="top" style="padding:8px 16px 8px 0;color:#6E6E6E;font-weight:600;white-space:nowrap">'
            . $h($label) . '</th><td style="padding:8px 0;color:#2B2B2B">' . $cell . '</td></tr>';
    }
    $text .= "\nSent: " . $sent . " (Europe/Vilnius)\nSite language: " . $lang . "\n\nReply to this email to answer the customer.\n";

    $html = '<!doctype html><html><body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;background:#F2F2F2">'
        . '<table role="presentation" width="100%" style="max-width:640px;background:#FFFFFF;border-top:4px solid #8DC63F;padding:24px">'
        . '<tr><td><h1 style="margin:0 0 16px;font-size:20px;color:#2B2B2B">New quote request</h1>'
        . '<table role="presentation" cellpadding="0" cellspacing="0">' . $rows . '</table>'
        . '<p style="margin:24px 0 0;color:#6E6E6E;font-size:13px">Sent ' . $h($sent) . ' (Europe/Vilnius) · Site language: ' . $h($lang)
        . '<br>Reply to this email to answer the customer.</p></td></tr></table></body></html>';

    return ['subject' => $subject, 'html' => $html, 'text' => $text];
}

/** Sends the quote request. Returns true when the email service accepted it. */
function send_quote_email(array $config, array $data): bool
{
    $email = build_email($data);
    $replyName = $data['name'];

    switch ($config['provider']) {
        case 'brevo':
            $reply = http_post_json('https://api.brevo.com/v3/smtp/email', [
                'sender'      => ['name' => $config['from_name'], 'email' => $config['from_email']],
                'to'          => [['email' => $config['to']]],
                'replyTo'     => ['email' => $data['email'], 'name' => $replyName],
                'subject'     => $email['subject'],
                'htmlContent' => $email['html'],
                'textContent' => $email['text'],
            ], ['api-key: ' . $config['brevo_key']]);
            return $reply['status'] >= 200 && $reply['status'] < 300;

        case 'resend':
            $reply = http_post_json('https://api.resend.com/emails', [
                'from'     => $config['from_name'] . ' <' . $config['from_email'] . '>',
                'to'       => [$config['to']],
                'reply_to' => $data['email'],
                'subject'  => $email['subject'],
                'html'     => $email['html'],
                'text'     => $email['text'],
            ], ['Authorization: Bearer ' . $config['resend_key']]);
            return $reply['status'] >= 200 && $reply['status'] < 300;

        case 'log':
            $dir = data_dir($config);
            if ($dir === null) return false;
            if (!is_dir($dir . '/outbox')) @mkdir($dir . '/outbox', 0700);
            $file = $dir . '/outbox/' . date('Ymd-His') . '-' . bin2hex(random_bytes(3)) . '.json';
            return (bool) file_put_contents($file, json_encode([
                'from' => $config['from_name'] . ' <' . $config['from_email'] . '>',
                'to' => $config['to'],
                'reply_to' => $data['email'],
            ] + $email, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }
    return false;
}

/** True when the chosen email service has its key. */
function mailer_configured(array $config): bool
{
    switch ($config['provider']) {
        case 'brevo':  return (string) $config['brevo_key'] !== '';
        case 'resend': return (string) $config['resend_key'] !== '';
        case 'log':    return $config['env'] === 'development';
    }
    return false;
}
