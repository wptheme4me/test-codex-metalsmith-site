# DECISIONS

Record short decisions here (with date).

- 2026-02-12: Use query param `?lang=` + `localStorage(lang_v1)` for language switching persistence.
- 2026-02-12: Keep cart storage language-agnostic (`itemId -> qty`) and resolve item names at render time per active language.
- 2026-02-12: Build routing emits localized rules at `/rules/{lt,en,ru}.html` and updates rules link on language switch.
- 2026-02-12: Use JSON script tags (`type="application/json"`) for runtime data handoff from build to client app.
