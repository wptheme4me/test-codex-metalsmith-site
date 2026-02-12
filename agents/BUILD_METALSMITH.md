# Sub-agent: Build / Metalsmith

## Scope (owned files/folders)
- build/metalsmith.js (or build pipeline entry)
- src/layouts/**, src/partials/**
- content/rules/** (processing only; not authoring)
- Public asset copy rules (src/assets -> dist/assets)
- Ensure JSON data injection into HTML (safe script tags)

## Do NOT touch
- src/assets/js/cart.js, i18n.js (owned by other agents)
- src/assets/css/styles.css (owned by CSS agent)
- netlify.toml (owned by Netlify agent)

## Deliverables
- Metalsmith build that outputs to dist/
- Nunjucks templates:
  - base layout
  - index page with placeholders for catalog/cart/form
  - rules pages built from markdown for lt/en/ru
- Safe JSON injection:
  - <script type="application/json" id="items-data">...</script>
  - <script type="application/json" id="ui-texts-data">...</script>
  - <script type="application/json" id="shipping-data">...</script>
- Nunjucks autoescape enabled

## Rules pages routing
- dist/rules/lt.html
- dist/rules/en.html
- dist/rules/ru.html

## Notes
- Keep templates minimal and semantic.
- Provide stable DOM IDs/hooks for runtime JS:
  - #language-switcher
  - #catalog
  - #cart
  - #order-form
  - hidden field name="cartJson"
- Append your integration notes + how to test to agents/STATUS.md.
