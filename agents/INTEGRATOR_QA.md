# Sub-agent: Integrator / QA

## Scope
- Wire together outputs from all workstreams
- Fix integration issues across templates + JS modules
- Add minimal smoke-test instructions to README.md (if present)

## Primary checks
- Build:
  - `npm run build` produces dist/
- Runtime:
  - Language switching updates UI + items
  - Cart:
    - add/remove/change qty
    - totals correct
    - persists across reload
    - persists across language switch
  - Form:
    - blocks empty cart
    - blocks missing required fields
    - blocks unchecked rules
    - cartJson populated with correct totals

## Coordination
- Read agents/STATUS.md and address remaining blockers.
- Record any cross-cutting decisions in agents/DECISIONS.md.
