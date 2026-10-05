# AGENTS.md — KnowledgeAssemble V1 Website

## What this project is

The public website for **KnowledgeAssemble**, an open-source umbrella
organization stewarding tools that make knowledge portable and composable. First
flagship project: **OpenEdu**.

## Read these before working

| File | Authority for |
| :--- | :--- |
| `docs/IMPLEMENTATION_PLAN.md` | How to build. **The primary document.** |
| `docs/TESTING_PLAN.md` | Test setup, guard tests, and the TDD boundary. |
| `docs/KNOWLEDGEASSEMBLE-WEBSITE-V1.md` | What to build and say. Copy is verbatim here. |
| `docs/stitch_knowledgeassemble_website_v1/assembled_knowledge_framework/DESIGN.md` | Token values, shape, spacing. |
| `docs/stitch_knowledgeassemble_website_v1/*/code.html` | Layout reference only. |

Where they disagree, the plan states the resolution. Read §2.5 (prototype
deviations) and §10 (open questions) early — both contain decisions that look
like errors otherwise.

## Current state

Phases 1–11 are implemented. `src/App.tsx` routes the five pages plus a
not-found route through a `RootLayout` that renders `SkipLink`, `SiteHeader`,
`<main>`, and `SiteFooter`. Pages are built on the design tokens in
`src/styles/index.css` (imported from `src/main.tsx`); content lives in
`src/content/`, external URLs in `src/config/links.ts`, and site metadata in
`src/config/site.ts`. Each page module exports `meta` and calls
`useDocumentMeta`, which sets title, description, OpenGraph/Twitter tags, and
absolute canonical/`og:url`. `public/sitemap.xml` lists the five canonical
routes and `public/robots.txt` points at it, because the `200`-for-everything
rewrite leaves the URL space otherwise unbounded.

`siteUrl` in `src/config/site.ts` is the live apex
`https://knowledgeassemble.org` (§10 Q3 resolved), so canonical and `og:url`
are absolute on every route. `www` does not resolve; if it is ever added it
must 301 to the apex. Brand assets (`public/favicon.svg`,
`public/og-image.png`, `public/robots.txt`) are in place.

Automated verification lives in `docs/TESTING_PLAN.md`: Vitest unit, component,
and guard tests; Playwright route, axe, responsive, and SEO specs; and CI,
which runs on every PR.

Stack is pinned in plan §4.1: **React 19 + Vite 7 + TypeScript strict +
Tailwind CSS v4** (CSS-first `@theme`, no `tailwind.config.ts`, no PostCSS) +
**react-router-dom v7**. Fonts self-hosted via `@fontsource`.

## Hard constraints

Violating any of these fails the phase.

- **All color tokens live in one place:** the `@theme` block in
  `src/styles/index.css`. No hex literals or arbitrary color values
  (`bg-[#…]`, `ring-[#…]`) anywhere else. Reference tokens by name.
- **Two tokens are deliberately overridden** from DESIGN.md for measured WCAG
  failures: `--color-ink-tertiary` is `#666D77` (not `#737A84`, which fails AA
  at every surface) and `--color-rule-interactive` is `#8C8C82` for interactive
  boundaries. `--color-rule-strong` (`#CECEC6`) is decorative-only. Do not
  revert these.
- **Focus rings use `outline-*`, never `ring-*`** — box-shadows get clipped.
- **No gradients, no drop shadows, no stock imagery, no dark/light theme
  switching, no pill/stadium radii, no circular avatars.** Radii are 4px
  (controls) and 8px (panels).
- **External URLs only from the config layer:** `src/config/links.ts` for
  third-party destinations, and `src/config/site.ts` for the site's own origin.
  Never inline one anywhere else. Never invent a domain: OpenEdu is
  `github.com/KnowledgeAssembly/open-edu`; `openedu.org` is wrong and does not
  resolve.
- **Canonical and `og:url` are per-route and runtime-injected.** `siteUrl` in
  `src/config/site.ts` is the live apex `https://knowledgeassemble.org`. Do not
  put a static `<link rel="canonical">` in `index.html`: `vercel.json` rewrites
  every path to `index.html` with a `200`, so a static tag would claim the
  homepage on every deep link. `www` does not resolve; if it is ever added it
  must 301 to the apex.
- **Principle numbers render as `01`–`07`.** The `13.x` values are PRD section
  references and never reach the UI.
- **Accessibility is a requirement, not a pass at the end.** Skip link, one
  `<h1>` per route, sequential headings, 44x44px primary touch targets, focus
  rings everywhere, `aria-hidden` on decorative SVG.

## Test-driven development

**Write the failing test first** for anything with logic: hooks, config,
content shape, and component behaviour (ARIA, conditional rendering, focus
management). No exceptions — if the code has a branch, it gets a test.

The constraints under "Hard constraints" are enforced by automated guard
tests, not by discipline. Before changing anything that could affect one,
confirm the guard exists; if it does not, write it and watch it fail.

**Not every change is test-first.** CSS, layout, and Tailwind utilities are
verified by the manual passes in plan Phases 8–9 — Lighthouse, axe, keyboard,
and the eight viewports. Asserting pixel positions produces brittle tests that
pass while the page is wrong. For visual work, state the verification you
performed in the commit message instead.

Run `npm run verify` before pushing: typecheck, unit tests, build, e2e. CI runs
the same command and is required to pass on `main`.

## Tone

PRD §30 and §36 govern. Calm, clear, curious, confident, open, non-corporate.
Write "We are exploring…", never "We are revolutionizing…". **Do not manufacture
scale, community, or products.** OpenEdu is a real project in early stages —
describe it accurately, including that it is early. No metrics, testimonials,
or adoption claims that do not exist.

## Git

`main` tracks `origin/main` on the private-then-public repo
`KnowledgeAssembly/knowledgeassemble.org` (MIT). Commit only when the user asks.
Never force-push, rewrite history, or amend a pushed commit.

## Open blockers

None blocking. Resolved decisions:

- Domain `knowledgeassemble.org` is **registered and live** at the apex on Vercel
  (§10 Q3); `siteUrl` is set, so canonical and `og:url` are absolute.
- **Deploy target is Vercel** (§10 Q4), so `vercel.json` is the SPA rewrite. If
  the host ever changes, that rule must be migrated — a stale `vercel.json` on
  another host means deep links silently 404.
- **CSR is accepted** (§10 Q5) with the `<noscript>` shell mitigation, documented
  in `README.md` (§4.2).

The **Contact link** stays omitted until a real destination exists (PRD §11). Do
not invent an email.

## Screenshots

The `screen.png` prototypes need image input, which is not assumed. Build from
`DESIGN.md` and `code.html`. If a design decision truly requires viewing a
screenshot, say so rather than guessing.
