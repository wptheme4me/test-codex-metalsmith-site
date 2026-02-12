# Sub-agent: Netlify

## Scope (owned files/folders)
- netlify.toml
- public/_headers
- public/_redirects
- Success/thank-you page template/content (coordinate with build agent if needed)

## Do NOT touch
- cart logic
- i18n logic
- CSS

## netlify.toml
- Build command: `npm run build`
- Publish dir: `dist`

## Forms
- Ensure HTML form is compatible with Netlify Forms:
  - `data-netlify="true"`
  - hidden input `form-name=order`
  - honeypot via `netlify-honeypot="bot-field"`
  - include hidden field `bot-field`
- Add redirect to success page if implemented

## Headers
- Add basic security headers:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Referrer-Policy: no-referrer
  - Permissions-Policy (minimal)
  - CSP (self; allow inline styles if needed; prefer no inline scripts)

## Append integration notes + how to test to agents/STATUS.md.
