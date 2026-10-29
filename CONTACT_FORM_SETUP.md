# Contact form setup: constre.com

The "Request a Quote" form on `contact.html` sends each request to **info@constre.com**.
This guide covers what has to be done outside the code, in order. A short checklist
version is in `SETUP-CHECKLIST.txt`.

## How it works

```
Visitor's browser                        Your hosting (Interneto vizija)          Services
─────────────────                        ─────────────────────────────            ────────
contact.html + js/main.js
  1. asks api/contact.php for a  ──GET──▶ api/contact.php
     signed timestamp + Turnstile key       returns them
  2. Cloudflare Turnstile checks  ◀────────────────────────────────────────────  Cloudflare
     the visitor (invisible)
  3. checks the fields, sends    ──POST─▶ api/contact.php
                                            origin, size, honeypot, time trap,
                                            rate limit, validation, links,
                                            Turnstile (asks Cloudflare)  ───────▶ Cloudflare
                                            duplicate check
                                            sends the email  ─────────────────────▶ Brevo ─▶ info@constre.com
```

- **From:** `Constre website <noreply@constre.com>`. **Reply-To:** the visitor, so "Reply" answers the customer.
- No confirmation email is sent to the visitor. They see a message on screen instead.
- Nothing is stored in a database. The server log records only the outcome and a reason code
  (e.g. `outcome=ignored reason=honeypot`), never names, emails or messages.
- Spam checks and limits are listed at the top of `api/contact.php`.

### Files

| File | What it is |
|---|---|
| `api/contact.php` | The form endpoint (PHP 7.4 or newer) |
| `api/lib/*.php` | Settings, validation, spam checks, email. Blocked from the web by `api/lib/.htaccess` |
| `.env.example` | Every setting, with placeholders. Copy it to `.env` |
| `.htaccess` | Blocks `.env`, notes and tests from the web; optional HTTPS redirect |
| `privacy.html` | **Placeholder** privacy policy that the form links to |
| `tests/` | Automated tests and test settings (don't upload) |

---

## What I found about constre.com (October 2026)

- The domain is registered with **Interneto vizija** (IV), with nameservers `ns1–4.serveriai.lt`.
- **There's no hosting yet.** The domain shows IV's "domain registered" parking page.
- **There's no mailbox yet.** Mail for constre.com goes to `mx-parked.serveriai.lt`, so **mail sent to info@constre.com
  doesn't currently reach anyone.**
- The current SPF record is `v=spf1 a mx ptr redirect=spf.serveriai.lt` (IV's default).

So the first two steps are with IV.

---

## Step 1: Hosting and the info@constre.com mailbox (Interneto vizija)

1. In the IV client area, order a **hosting plan** (any "Hostingas" plan with PHP and email; the WordPress plans are
   PHP hosting too) and attach **constre.com** to it.
2. In the hosting panel:
   - set **PHP 8.x** (7.4 is the minimum) and make sure the **curl** extension is on (it normally is);
   - turn on the free **SSL certificate** (Let's Encrypt) for `constre.com` and `www.constre.com`.
3. Create the mailbox **info@constre.com**. IV then points the domain's mail (MX) at its mail servers.
   Send it a test email from your phone and check it arrives.
4. Upload the website to the web folder (usually `public_html` or `domains/constre.com/public_html`):
   all `.html` files, `assets/`, `css/`, `js/`, `api/` and `.htaccess`.
   Don't upload `tests/`, `.impeccable/`, `.claude/`, the `.md`/`.txt` notes or `.env.example`. They're blocked
   from the web anyway, but they don't belong on the server.

## Step 2: The email service (Brevo)

Brevo is a French (EU) company. Its free plan sends up to 300 emails a day, far more than a quote form needs.

1. Create an account at <https://www.brevo.com> with your company details.
2. Go to **Settings → Senders, Domains & Dedicated IPs → Domains → Add a domain** and enter `constre.com`.
   Brevo offers automatic setup for some registrars. IV probably isn't one of them, so choose
   **"Authenticate the domain yourself"**. Brevo then shows the DNS records to add (see Step 3).
3. Once the domain shows as **Authenticated**, go to **Senders → Add a sender**:
   name `Constre website`, email `noreply@constre.com`.
   (The address doesn't need a mailbox. Replies go to the visitor through Reply-To.)
4. Go to **Settings → SMTP & API → API keys → Generate a new API key**, name it `constre-website`, and copy it
   (it starts with `xkeysib-`). You'll put it in `.env` in Step 5. Brevo shows it only once.
5. Brevo may ask you to activate the transactional email feature or confirm your account by phone. Follow its prompts.

> **Prefer Resend?** Set `MAIL_PROVIDER=resend` and `RESEND_API_KEY=…` instead. Add the domain in Resend
> and choose the **EU (Ireland)** region. Its DNS records go in the same place.

## Step 3: DNS records (in IV's DNS panel)

constre.com uses IV's nameservers, so all records are added in the **IV client area → Domains → constre.com → DNS**.
Changes take from a few minutes to 48 hours to spread.

### 3a. Brevo's records

Copy them exactly as Brevo shows them:

| Type | Name | Value |
|---|---|---|
| TXT | `@` (constre.com) | `brevo-code:…` (proves you own the domain) |
| CNAME ×2 *or* TXT ×1 | e.g. `brevo1._domainkey` / `brevo2._domainkey` | DKIM: the values Brevo gives |

### 3b. SPF: only ever ONE SPF record

A domain may have only **one** TXT record starting with `v=spf1`. If you have two, both fail.

- Brevo now sends with its own "envelope" address, so it **usually doesn't ask for an SPF change**. If Brevo's
  domain page shows SPF as fine, leave IV's record as it is.
- If Brevo (or another sending service) asks you to add `include:spf.brevo.com`, **edit the existing record**
  rather than adding a second one:

  ```
  v=spf1 a mx include:spf.brevo.com redirect=spf.serveriai.lt
  ```

  This keeps IV's mail servers (`a mx … redirect=spf.serveriai.lt`) and adds Brevo.
- The same rule applies if your mailbox ever moves (e.g. to Google Workspace: `include:_spf.google.com`). Every
  service that sends as @constre.com goes into the same single record.

### 3c. DMARC

Add one TXT record:

| Type | Name | Value |
|---|---|---|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:info@constre.com; adkim=r; aspf=r` |

- `p=none` only **monitors**: nothing is blocked, and mailbox providers email daily reports to `rua`. To keep them
  out of the main inbox, use a separate address (e.g. create `dmarc@constre.com`) or the filter in Step 7.
- **When to tighten:** after 2–4 weeks in which the reports show that all your real mail passes (website emails via
  Brevo **and** normal emails you send from info@constre.com), change it to `p=quarantine` (fakes go to spam).
  After a few more quiet weeks, consider `p=reject`.

Check the records at <https://mxtoolbox.com/SuperTool.aspx> (look up `constre.com` for SPF and `_dmarc.constre.com` for DMARC).

## Step 4: Cloudflare Turnstile (spam check)

Turnstile is free, and you **don't** need to move the domain to Cloudflare.

1. Create a free account at <https://dash.cloudflare.com>.
2. Go to **Turnstile → Add widget**:
   - **Name:** `constre.com quote form`
   - **Hostnames:** `constre.com` and `www.constre.com`
   - **Widget mode:** **Managed**. The code shows it only when Cloudflare is unsure, so most visitors see nothing.
3. Copy the **Site key** and the **Secret key**.
4. For local testing, use Cloudflare's public test keys (already in `tests/test.env.example`) rather than adding
  `localhost` to the real widget.

## Step 5: Settings file (`.env`)

1. Copy `.env.example` to a new file called `.env` and fill it in:

   | Setting | Value |
   |---|---|
   | `APP_ENV` | `production` |
   | `CONTACT_TO_EMAIL` | `info@constre.com` |
   | `MAIL_FROM_EMAIL` / `MAIL_FROM_NAME` | `noreply@constre.com` / `Constre website` |
   | `MAIL_PROVIDER` | `brevo` |
   | `BREVO_API_KEY` | the key from Step 2.4 |
   | `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | the keys from Step 4.3 |
   | `FORM_SECRET` | 64 random letters and digits, e.g. from your password manager's generator, or `php -r "echo bin2hex(random_bytes(32));"` |
   | `ALLOWED_ORIGINS` | `https://constre.com,https://www.constre.com` |
   | `RATE_LIMIT_ENABLED` | `true` |

2. Upload `.env` **one folder above** the web folder, i.e. next to `public_html`, not inside it. The form looks
   there first. If IV's file manager doesn't let you go above `public_html`, put it **inside** `public_html`.
   The `.htaccess` file blocks it from the web, but check that by opening `https://constre.com/.env`:
   you must get **403 Forbidden** or **404**, never the file.
3. The form creates a folder `constre-form-data` next to the web folder for its rate-limit records. If the host
   doesn't allow that, set `DATA_DIR` to a folder that PHP can write to (still outside `public_html` if you can).
   If the folder can't be written, the form still works but rate limiting and duplicate checks switch off, and the
   server's error log shows `reason=store_unavailable`.

Never send the `.env` contents by email or chat, and never commit them to a code repository.

## Step 6: Go live and test

1. Open <https://constre.com/api/contact.php> in a browser. You should see something like
   `{"siteKey":"0x…","formToken":"…"}`. If you see `{"ok":false,"error":"generic"}`, a setting is missing: check
   `.env` (and the error log, which shows `reason=misconfigured`).
2. Send a real request from <https://constre.com/contact.html>. Within a minute it should be in **info@constre.com,
   not in spam**. Click **Reply** and check that the reply is addressed to the email you typed in the form.
3. In Brevo, open **Transactional → Logs**. The email should show as *Delivered*.
4. Optional deliverability score: temporarily set `CONTACT_TO_EMAIL` to the address shown on
   <https://www.mail-tester.com>, send the form, check the score (aim for 9+/10), then set it back.
5. Once SSL works, turn on the HTTPS redirect: remove the `#` signs from the marked block in `.htaccess`.

## Step 7 (optional): Inbox filter

In the info@constre.com mailbox (IV webmail → Settings → Filters, or your mail app):

- **If** the sender is `noreply@constre.com` → **label/move to** "Website quotes" (and mark as important).
- **If** the subject contains `Report domain: constre.com` (DMARC reports) → move to "DMARC reports".

## Still to do on the website

- **Privacy policy:** `privacy.html` is a marked **placeholder**. Add the company code, check the wording
  (especially the retention period), then remove the "[Placeholder]" line. Lithuanian text is in
  `js/translations.js` (`privacy.*` keys).

---

## Testing

### Locally (on your own computer)

You need PHP 7.4+ on your computer (e.g. from <https://windows.php.net/download>; take the "Non Thread Safe" zip,
and in `php.ini` enable `extension=curl` and `extension=openssl`). The plain static preview
(`npx http-server`) can't run the form, because it has no PHP.

1. Copy `tests/test.env.example` to `tests/test.env`. It uses:
   - Cloudflare's **test keys**: site key `1x00000000000000000000AA` and secret `1x0000000000000000000000000000000AA`
     always pass. Other test keys: site key `2x00000000000000000000AB` always fails, and `3x00000000000000000000FF`
     forces the visible "click to verify" box, which is useful to see what a suspicious visitor sees;
   - `MAIL_PROVIDER=log`: **nothing is emailed**. Each email is saved as a file in `tests/.data/outbox/`.
2. In the website folder, start PHP's built-in server with those settings:

   ```
   # Git Bash
   CONSTRE_ENV_FILE=tests/test.env php -S localhost:8081
   # PowerShell
   $env:CONSTRE_ENV_FILE="tests/test.env"; php -S localhost:8081
   ```

3. Open <http://localhost:8081/contact.html> and use the form. The "emails" appear in `tests/.data/outbox/`.
4. Run the automated tests in a second terminal:

   ```
   php tests/contact-form.test.php http://localhost:8081 tests/test.env
   ```

   They need internet, because Cloudflare checks even the test keys. The result should be `29 passed, 0 failed`.

To test real sending before going live, set `MAIL_PROVIDER=brevo` with your real API key in `tests/test.env`
and `CONTACT_TO_EMAIL` to your own address.

### What the automated tests cover

| Check | Expected |
|---|---|
| Valid submission | email created; From = noreply, To = CONTACT_TO_EMAIL, **Reply-To = visitor**, subject `New quote request – Name – Company`, plain-text part, language |
| Honeypot filled | looks like success, **nothing sent** |
| Sent within 3 s / forged timestamp | looks like success, nothing sent |
| Form open more than 2 h | generic error (the visitor keeps their text) |
| 4th submission in 10 min from one IP | refused (HTTP 429) |
| Invalid email, 1-letter name, 9-character message, letters in phone, 151-character company | field error |
| Unknown extra field, body over 20 KB, request from another website, missing Turnstile | generic error |
| CR/LF in name or email (header injection) | generic error, nothing sent |
| 4 links in message / link in name | refused; 3 links are allowed |
| `<script>` and HTML in message | escaped in the email |
| Lithuanian (ą č ę ė į š ų ū ž) and Russian (кириллица) text | arrives intact, including in the subject |
| Same message twice within 10 min | second is ignored |

### Check by hand on the live site

- [ ] A real request arrives in info@constre.com **inbox** (not spam), and **Reply** goes to the visitor.
- [ ] Switching the page to EN / LT changes the success and error messages.
- [ ] With the network turned off (browser dev tools → Network → Offline), sending shows the error with the email
      and phone links, and what you typed stays in the form.
- [ ] `https://constre.com/.env` and `https://constre.com/api/lib/config.php` both return 403/404.
- [ ] The hosting error log shows lines like `[contact-form] outcome=sent reason=ok`, with no names or emails.
