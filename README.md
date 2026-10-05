# knowledgeassemble.org

Public website for **KnowledgeAssemble**, an open-source umbrella organization stewarding tools that make knowledge portable and composable. Its first flagship project is [OpenEdu](https://github.com/KnowledgeAssembly/open-edu).

The repo name matches the intended production domain, which is **not yet registered** (plan §10 Q3).

Build instructions are in [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md), which is the authority for how to build. The product specification is [`docs/KNOWLEDGEASSEMBLE-WEBSITE-V1.md`](docs/KNOWLEDGEASSEMBLE-WEBSITE-V1.md). This README records setup facts only.

## Stack

Pinned to current majors (plan §4.1). Versions must not drift silently.

| Concern | Choice |
| :--- | :--- |
| Framework | React 19 + Vite 7 |
| Language | TypeScript, `strict` and `noUncheckedIndexedAccess` |
| Routing | `react-router-dom` v7 |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`; tokens declared in `@theme` in `src/styles/index.css` |
| Fonts | `@fontsource/ibm-plex-sans` and `@fontsource/jetbrains-mono`, self-hosted |
| Icons | Inline SVG — no icon library |

There is deliberately no `tailwind.config.ts`, no `postcss.config.js` (the Vite plugin replaces the PostCSS pipeline), and no component library (plan §4.1; PRD §24).

## Local development

Requires Node `^20.19 || >=22.12` and npm.

```sh
npm install
npm run dev        # Vite dev server
npm run build      # tsc -b, then vite build into dist/
npm run preview    # serve the production build
npm run typecheck  # tsc --noEmit
```

Status: scaffolding only. `npm run preview` renders an empty `#root` until the router lands in Phase 2; with JavaScript disabled, the static shell in `index.html` is what renders.

## Deploy target: undecided

No host has been chosen (plan §10 Q4). This blocks the SPA rewrite config in plan §4.4 — `public/_redirects` for Netlify or Cloudflare Pages, `vercel.json` for Vercel, `public/404.html` for GitHub Pages. Until a host is picked, deep links such as `/principles` will 404 on a static host.

Domain registration (plan §10 Q3) blocks canonical and `og:url` wiring in Phase 7. Never ship those tags pointing at the unregistered domain.

## Known limitation: V1 is client-side rendered

PRD §22 states: *"Do not make accessibility dependent on JavaScript."* A React SPA with client-side routing cannot satisfy that — without JavaScript, route content is unavailable.

**V1 accepts client-side rendering as a documented deviation** (plan §4.2, §10 Q5). It mitigates rather than solves the problem: `index.html` ships a real semantic shell — `<header>`, `<nav>`, `<main id="main-content">`, `<footer>` — plus a `<noscript>` block that explains the requirement and links to the [GitHub organization](https://github.com/KnowledgeAssembly), so the document has valid landmarks and a route out before hydration. Route content is deliberately not duplicated into `index.html`, which would create a second source of truth that drifts.

If full no-JavaScript parity is required for V1, the remedy is to add `vite-plugin-ssg` and prerender all five routes. That also resolves plan §4.3 and is the recommended path if the deviation is rejected.

## License

MIT — see [`LICENSE`](LICENSE).
