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

Phases 1 and 2 are committed. `src/App.tsx` routes the five pages plus a
not-found route to `src/pages/*`, each rendering a placeholder `<h1>` only.
**No page internals exist yet** — that is Phase 4. Two consequences worth
knowing before Phase 3:

- `src/styles/index.css` does not exist and is not imported anywhere, so every
  Tailwind utility class is currently inert. The 27 kB CSS bundle is `@font-face`
  rules only. Phase 3 must both create the file and import it from `src/main.tsx`.
- React replaces `#root`'s children, which **discards the static shell in
  `index.html`**. With JavaScript on — the normal case — the document currently
  has *no* landmarks at all. This is expected per §6.2 and Phase 4 restores them
  via `SkipLink` / `SiteHeader` / `SiteFooter`, but it means the no-JS
  mitigation and the hydrated page disagree until then.

Phase 3 (design tokens) is next.

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
