# knowledgeassemble.org

Public website for **KnowledgeAssemble**, an open-source umbrella organization stewarding tools that make knowledge portable and composable. Its first flagship project is [OpenEdu](https://github.com/KnowledgeAssembly/open-edu).

The site is live at the apex [`knowledgeassemble.org`](https://knowledgeassemble.org) on Vercel; the repo name matches the production domain. `www` does not resolve, and if it is ever added it must 301 to the apex.

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

Requires Node `>=22.12` and npm.

```sh
npm install
npm run dev        # Vite dev server
npm run build      # tsc -b, vite build, then prerender dist/*/index.html
npm run prerender  # (re)render the five routes from an existing dist/
npm run preview    # serve the production build (clean URLs + static 404)
npm run typecheck  # tsc --noEmit plus the e2e tsconfig
npm run test       # Vitest unit, component, and guard tests
npm run test:e2e   # Playwright route, axe, responsive, SEO, prerender, no-JS
npm run verify     # typecheck + test + build + e2e (what CI runs)
```

Status: V1 complete. The five canonical routes are prerendered to static HTML at build time; JavaScript enhances navigation. Pages are built on the design tokens in `src/styles/index.css`; content lives in `src/content/`, external URLs in `src/config/links.ts`, and site metadata in `src/config/site.ts`. Canonical and `og:url` are absolute because `siteUrl` is set.

## Deploy target: Vercel

Vercel is the chosen host (plan §10 Q4). The build prerenders each canonical route to `dist/{route}/index.html`; [`vercel.json`](vercel.json) sets `cleanUrls` and `trailingSlash: false` so `/principles` serves the prerendered file, and `dist/404.html` is the static, `noindex` 404 for anything else. There is no SPA rewrite.

`siteUrl` is set to the live apex `https://knowledgeassemble.org` (plan §10 Q3 resolved), so canonical and `og:url` are absolute. `www` does not resolve; if it is ever added it must 301 to the apex.

## Delivery: prerendered, then enhanced

The site is a web document first and a React application second (gap closure §36). `src/routes.tsx` declares the routes and their metadata once; `scripts/prerender.tsx` renders each of the five canonical routes to static HTML at build time, so every route has real content, its own `<title>`, canonical, and OpenGraph/Twitter metadata without JavaScript — for search engines, social crawlers, and no-JS browsers.

Client-side rendering is retained as the enhancement layer: `src/main.tsx` still calls `createRoot(...).render(<App/>)`, which re-renders the same markup and attaches navigation and interactivity. The prerender uses `renderToStaticMarkup` (markers-free), so `createRoot` — not `hydrateRoot` — is the correct pairing. `index.html` is a minimal Vite template with an empty `#root`; there is no `<noscript>` shell, because the generated HTML is already the full document.

`vite preview` is configured (a preview-only plugin in `vite.config.ts`) to serve clean URLs and the static 404 the way Vercel does, so `npm run verify` exercises the deployed behavior.

## License

MIT — see [`LICENSE`](LICENSE).
