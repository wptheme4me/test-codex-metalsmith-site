# Sub-agent: CSS / Responsive Layout

## Scope (owned files/folders)
- src/assets/css/styles.css

## Do NOT touch
- JS modules
- Build pipeline
- Netlify config

## Requirements
- CSS3 Flex-based responsive layout
- 3 breakpoints:
  - Mobile: <= 640px
  - Medium: 641–1024px
  - Large: >= 1025px

## Layout
- Large:
  - main container flex row
  - catalog area (flex: 2)
  - cart + form area (flex: 1) (sticky if feasible)
- Mobile:
  - stacked sections in readable order
- Provide clear spacing, readable typography, focus states

## Components to style
- Header + language switcher
- Catalog list/table-like rows
- Buttons (Add to cart, +/-)
- Cart line items + totals
- Order form inputs/select/checkbox
- Rules link

## Accessibility
- Visible focus outlines
- Adequate contrast
- Form controls aligned and touch-friendly on mobile

## Append integration notes + how to test to agents/STATUS.md.
