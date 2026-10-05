# AGENTS.md — KnowledgeAssemble V1 Website

## What this project is

The public website for **KnowledgeAssemble**, an open-source umbrella
organization stewarding tools that make knowledge portable and composable. First
flagship project: **OpenEdu**.

## Read these before working

| File | Authority for |
| :--- | :--- |
| `docs/IMPLEMENTATION_PLAN.md` | How to build. **The primary document.** |
| `docs/KNOWLEDGEASSEMBLE-WEBSITE-V1.md` | What to build and say. Copy is verbatim here. |
| `docs/stitch_knowledgeassemble_website_v1/assembled_knowledge_framework/DESIGN.md` | Token values, shape, spacing. |
| `docs/stitch_knowledgeassemble_website_v1/*/code.html` | Layout reference only. |

Where they disagree, the plan states the resolution. Read §2.5 (prototype
deviations) and §10 (open questions) early — both contain decisions that look
like errors otherwise.

## Current state

Phases 1–4 are committed. `src/App.tsx` routes the five pages plus a not-found
route through a `RootLayout` that renders `SkipLink`, `SiteHeader`, `<main>`,
and `SiteFooter`. Pages are built on the design tokens in
`src/styles/index.css` (imported from `src/main.tsx`); content lives in
`src/content/` and external URLs in `src/config/links.ts`. React replaces
`#root`'s children, so the hydrated page — not the static shell in `index.html`
— provides the landmarks.

Phase 5 (content layer) is next. A first cut of the content already exists
because the Phase 4 pages required it; Phase 5 should complete it and verify
every PRD heading string against the pages.

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
- **External URLs only from `src/config/links.ts`.** Never inline one. Never
  invent a domain: OpenEdu is `github.com/KnowledgeAssembly/open-edu`;
  `openedu.org` is wrong and does not resolve.
- **`knowledgeassemble.org` is not registered.** Do not ship canonical or
  `og:url` tags pointing at it.
- **Principle numbers render as `01`–`07`.** The `13.x` values are PRD section
  references and never reach the UI.
- **Accessibility is a requirement, not a pass at the end.** Skip link, one
  `<h1>` per route, sequential headings, 44x44px primary touch targets, focus
  rings everywhere, `aria-hidden` on decorative SVG.

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

Do not invent answers to these; they are organizational decisions (§10):

- Domain `knowledgeassemble.org` is **unregistered** — blocks Phase 7 canonical URLs.
- **CSR vs prerender** sign-off — affects Phase 2 (§4.2).
- **Contact link** — include only if a real destination exists; do not invent an email.

Resolved: deploy target is **Vercel** (§10 Q4), so `vercel.json` is the SPA
rewrite. If the host ever changes, that rule must be migrated — a stale
`vercel.json` on another host means deep links silently 404.

## Screenshots

The `screen.png` prototypes need image input, which is not assumed. Build from
`DESIGN.md` and `code.html`. If a design decision truly requires viewing a
screenshot, say so rather than guessing.
