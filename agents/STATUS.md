# STATUS

## Workstreams
- Build/Metalsmith: DONE (baseline implementation)
- Frontend Cart: DONE (baseline implementation)
- i18n: DONE (baseline implementation)
- CSS/Responsive: DONE (baseline implementation)
- Netlify: DONE (baseline implementation)
- Integration/QA: DONE (build + output smoke checks completed)

## Integration notes
- Build/Metalsmith
  - Files: `build/metalsmith.js`, `src/layouts/base.njk`, `src/layouts/index.njk`, `src/layouts/rules.njk`, `index.md`
  - Implemented Metalsmith pipeline with markdown conversion, rules routing (`dist/rules/{lt,en,ru}.html`), Nunjucks layouts, metadata JSON injection script tags, and public file copy.
  - How to test:
    - `npm install`
    - `npm run build`
    - Verify `dist/index.html` and `dist/rules/lt.html`, `dist/rules/en.html`, `dist/rules/ru.html` exist.

- Frontend Cart
  - Files: `src/assets/js/cart.js`, `src/assets/js/format.js`, `src/assets/js/app.js`
  - Implemented cart persistence (`cart_v1`), add/set/remove flows, quantity clamp (`1..999`), line/total calculations, empty-cart submit block, and `cartJson` hidden field serialization for Netlify form.
  - How to test:
    - Build and open `dist/index.html`.
    - Add items, change qty via +/- and input, remove items.
    - Reload page and confirm cart persists.
    - Try submitting with empty cart (must be blocked).

- i18n
  - Files: `src/assets/js/i18n.js`, `src/assets/js/app.js`
  - Implemented language resolution order (`?lang` -> `lang_v1` -> browser -> `lt`), URL + localStorage persistence, UI text translation, item/category localization, shipping label localization, and language-aware rules link.
  - How to test:
    - Switch language selector LT/EN/RU.
    - Confirm URL `?lang=` updates and labels/catalog/cart rerender.
    - Reload and verify language persists.

- CSS/Responsive
  - Files: `src/assets/css/styles.css`
  - Implemented responsive layout with three breakpoints, desktop split layout, mobile/medium stacked layout, form/cart/catalog styling, and visible focus states.
  - How to test:
    - Resize viewport to <=640, 641-1024, >=1025 and verify layout behavior.

- Netlify
  - Files: `netlify.toml`, `public/_headers`, `public/_redirects`, `src/layouts/index.njk`
  - Implemented Netlify build/publish config, form attributes (`data-netlify`, `form-name`, honeypot), and baseline security headers and redirects.
  - How to test:
    - Deploy to Netlify and check form detection in dashboard.
    - Submit valid order and verify payload contains `cartJson`.

## Blockers
- None in local environment.
