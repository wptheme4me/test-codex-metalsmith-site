# Supervisor Agent

## Objective
Orchestrate parallel development using role files in /agents and ensure final integration passes Definition of Done in AGENTS.md.

## Operating mode
- Start by ensuring repo structure matches AGENTS.md.
- Create missing scaffolding quickly (package.json, folders, build script placeholders).
- Then delegate to sub-agents by creating tasks for each role using the corresponding /agents/*.md as their brief.

## Delegation plan
1) Build/Metalsmith: pipeline, templates, markdown rules, dist output
2) Frontend Cart: cart module + UI wiring + persistence + cartJson serializer
3) i18n: language switcher + translation application for UI and items
4) CSS/Responsive: layout + breakpoints
5) Netlify: netlify.toml + headers/redirects + form wiring + success page
6) Integrator/QA: wire modules + smoke test + fix integration issues

## Coordination
- Require each sub-agent to append to agents/STATUS.md:
  - What changed (files)
  - How to test
  - Any blockers
- Track key decisions in agents/DECISIONS.md.
- Maintain agents/INTEGRATION_TODO.md.

## Acceptance checks
- Run `npm run build`
- Open dist/index.html (or local dev server)
- Verify:
  - add to cart, qty changes, totals
  - persist across reload + language switch
  - form blocks empty cart
  - rules checkbox required and links work
  - form submission is correctly configured for Netlify
