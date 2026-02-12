# AGENTS.md — Multilingual Static Stock Site (LT/EN/RU)

## Mission
Build and deploy a multilingual static website that lists stock items and allows visitors to compose an order in a same-page cart and submit it via Netlify Forms.

Target stack:
- Node.js (current LTS)
- Metalsmith static site generator
- Nunjucks templates
- Vanilla JS (ES modules)
- CSS3 Flex (3 breakpoints)
- Netlify hosting + Netlify Forms

## Repository layout (expected)
- data/
  - items.json (categories -> items; all languages in same file)
  - ui-texts.json (all UI labels for all languages)
  - shipping.json (dropdown options in all languages)
- content/rules/
  - lt.md, en.md, ru.md (seller/buyer duties, shipping, warranty)
- src/
  - layouts/ (Nunjucks)
  - partials/ (Nunjucks)
  - assets/css/styles.css
  - assets/js/*.js (app/cart/i18n/format)
- build/metalsmith.js (build pipeline)
- netlify.toml
- public/_headers, public/_redirects
- dist/ (build output)

If the repo differs, update this file first.

## Setup commands
- Install: `npm install`
- Dev build + serve: `npm run dev`
- Production build: `npm run build`
- Lint (if present): `npm run lint`
- Format (if present): `npm run format`

## Global rules (must follow)
- Prefer small, testable modules over monolith files.
- No frameworks for runtime UI (no React/Vue/etc).
- Never use `innerHTML` with untrusted strings. Use `textContent` and DOM APIs.
- Escape template output (Nunjucks autoescape enabled).
- Do not store personal form data in localStorage (cart only).
- Validate item IDs and quantities before using (qty clamp 1..999).
- Currency: EUR only. Format with `Intl.NumberFormat`.
- Ensure cart persists across language switches (store item IDs + quantities only).

## Data contracts

### data/items.json (no repeated category per item)
Shape:
{
  "categories": [
    {
      "id": "electronics",
      "name": { "lt": "...", "en": "...", "ru": "..." },
      "items": [
        {
          "id": "usb-cable-1m",
          "name": { "lt": "...", "en": "...", "ru": "..." },
          "description": { "lt": "...", "en": "...", "ru": "..." },
          "priceEur": 4.99,
          "active": true
        }
      ]
    }
  ]
}

Rules:
- item.id is stable and unique across all categories.
- active=false items are not displayed and cannot be added to cart.
- priceEur is numeric with up to 2 decimals.

### data/ui-texts.json
- Object tree where each leaf is {lt,en,ru}
- Example: { "buttons": { "addToCart": { "lt": "...", "en": "...", "ru": "..." } } }

### data/shipping.json
{
  "companies": [
    { "id": "omniva", "label": { "lt": "Omniva", "en": "Omniva", "ru": "Omniva" } }
  ]
}

## UX requirements
- Same page: catalog + cart + order form visible.
- Breakpoints:
  - Mobile: <= 640px
  - Medium: 641–1024px
  - Large: >= 1025px
- Layout:
  - Large: catalog left, cart+form right (sticky sidebar if feasible)
  - Mobile: stacked sections

## Netlify Forms requirements
- Form name: `order`
- Use honeypot: `netlify-honeypot="bot-field"` and a hidden `bot-field` input
- Include hidden `cartJson` field (required) containing serialized cart lines and total

## Sub-agent workflow (preferred)
Work in parallel by role. Each sub-agent edits only its owned area and writes integration notes to `agents/STATUS.md`.

Roles:
- Supervisor: agents/SUPERVISOR.md
- Build/Metalsmith: agents/BUILD_METALSMITH.md
- Frontend Cart: agents/FRONTEND_CART.md
- i18n: agents/I18N.md
- CSS/Responsive: agents/CSS_RESPONSIVE.md
- Netlify: agents/NETLIFY.md
- Integrator/QA: agents/INTEGRATOR_QA.md

All agents must:
- Keep changes scoped
- Add/update TODOs if blocked
- Provide “How to test” steps in STATUS.md

## Definition of done
- `npm run build` outputs a working `dist/` site
- LT/EN/RU fully functional
- Cart persists across reload + language switching
- Netlify form submission includes cartJson + required fields
- Rules pages exist for all languages
