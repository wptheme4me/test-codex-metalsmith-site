# Sub-agent: Frontend Cart

## Scope (owned files/folders)
- src/assets/js/cart.js
- src/assets/js/format.js (if cart needs it)
- Cart rendering hooks in src/assets/js/app.js ONLY if strictly required
- Hidden field population for Netlify form: cartJson

## Do NOT touch
- build/metalsmith.js, templates (unless you must add a single data-hook attribute; if so, coordinate via STATUS.md)
- i18n translation table structure (owned by i18n agent)
- CSS files

## Cart behavior
- Storage key: cart_v1
- Stored value:
  { "items": { "<itemId>": <qty> }, "updatedAt": "<ISO>" }
- Validate:
  - itemId exists in active items map
  - qty integer clamp 1..999
  - removing item deletes key
- Derived view model:
  - name/category resolved per active language via a resolver callback passed from app.js

## UI
- Add-to-cart increments qty
- Controls: minus/plus, input, remove
- Totals:
  - lineTotal = qty * priceEur
  - grandTotal = sum(lineTotals)
- If cart empty:
  - show localized empty message hook (i18n supplies string)

## Form serialization (Netlify)
- On submit:
  - block submit if empty cart
  - write hidden field `cartJson`:
    {
      "lines": [{ "itemId": "...", "qty": 2, "priceEur": 4.99, "lineTotalEur": 9.98 }],
      "totalEur": 9.98
    }

## Output
- Provide stable exports:
  - loadCart(), saveCart()
  - addItem(id), setQty(id, qty), removeItem(id)
  - getSummary() (lines + totals)
- Append integration notes + how to test to agents/STATUS.md.
