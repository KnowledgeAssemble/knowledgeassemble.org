# Gap Closure — Implementation Plan

> **Audience:** an implementing agent (deepseek-4-flash).
> **Spec:** `docs/KNOWLEDGEASSEMBLE-WEBSITE-V1-GAPS.md` — read it first, in full.
> **This document** is the "how". The spec is the "what". Where they differ, this
> document's explicit code and commands win for implementation detail; the spec
> wins for intent and priorities.

The single most important sentence in the spec is §36:

> **The website should be a web document first and a React application second.**

Everything below serves that one change. Do not build anything else.

---

## 0. What NOT to do (read before touching anything)

1. **Do not migrate to Next.js, Remix, Astro, or any other framework.**
   Stay on React 19 + Vite 7 + react-router-dom v7 + Tailwind v4.
2. **Do not introduce a backend, serverless functions, or runtime SSR.**
   The site is static. The build emits HTML; Vercel serves files.
3. **Do not add any runtime JavaScript dependency.** The only dependency
   consideration below is none — the prerender uses APIs already installed
   (`react-dom/server`, `react-router-dom`'s `createStaticHandler`).
4. **Do not change design tokens, colors, copy, or layout** except the specific
   content edits in Phase C (§13 language) and only if they are real gaps.
   This is a gap-closure pass, not a redesign.
5. **Do not add a second metadata system.** One `meta` per page (already
   exported from each page module) is the single source of truth. The prerender
   script reads it; `useDocumentMeta` keeps using it for SPA navigation. Both
   read the same objects.
6. **Do not ship a `400`-line build hack.** Keep the prerender script small and
   obvious. If you find yourself adding framework-like machinery, stop — you are
   off plan.

## 1. Baseline you are starting from

Work from the latest `origin/main`. As of this writing, PRs #1–#5 are merged,
so `main` already has:

- Five routes in `src/App.tsx` (CSR only via `createBrowserRouter`).
- `src/config/site.ts` with `siteUrl = 'https://knowledgeassemble.org'`.
- `useDocumentMeta` injecting title/description/canonical/og/twitter at runtime.
- `public/sitemap.xml`, `public/robots.txt` (with `Sitemap:` line).
- A `<noscript>` static shell in `index.html` (this is the thing we now remove).
- Guard tests in `src/test/`, e2e specs in `tests/e2e/`.
- `vercel.json` = SPA rewrite (`/(.*)` → `/index.html`).

**Verify before starting:**

```bash
git checkout main && git pull
npm install
npm run verify   # must be green before you touch anything
```

`npm run verify` = typecheck → vitest → build → Playwright. All four must pass
on a clean checkout.

## 2. The architecture (this is already validated, do not redesign it)

The approach below was empirically verified against this exact stack on
2026-10-05:

- `createStaticHandler(routes).query(request)` → `createStaticRouter(...)` →
  `<StaticRouterProvider>` → `renderToStaticMarkup` produces full, correct HTML
  for each route (one `h1`, real content, no JS fallback text).
- `vite build --ssr scripts/prerender.tsx --outDir dist-ssr` externalizes
  `react`/`react-dom`/`react-router-dom` and emits a single runnable
  `dist-ssr/prerender.js`, executed with `node dist-ssr/prerender.js` from the
  project root.

The build pipeline becomes:

```text
vite build              → dist/index.html + hashed assets
vite build --ssr …      → dist-ssr/prerender.js (the renderer)
node dist-ssr/prerender.js → overwrites dist/index.html and writes
                              dist/{projects,principles,community,about}/index.html
```

Client-side rendering is **not** removed. It becomes the enhancement layer:
`main.tsx` still calls `createRoot(...).render(<App/>)`, which re-renders the
already-present content and attaches interactivity.

---

## Phase A — Prerender infrastructure

### A1. Create `src/routes.tsx` (shared route + metadata source of truth)

Move `RootLayout` out of `App.tsx` and export both the route table and a
path→meta list. This is the one place where "which routes exist" and "what
metadata they have" are declared together.

Create `src/routes.tsx`:

```tsx
import type { RouteObject } from 'react-router-dom';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import type { PageMeta } from './types';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';
import SkipLink from './components/layout/SkipLink';
import HomePage, { meta as homeMeta } from './pages/HomePage';
import ProjectsPage, { meta as projectsMeta } from './pages/ProjectsPage';
import PrinciplesPage, { meta as principlesMeta } from './pages/PrinciplesPage';
import CommunityPage, { meta as communityMeta } from './pages/CommunityPage';
import AboutPage, { meta as aboutMeta } from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <SkipLink />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: '/', Component: HomePage },
      { path: '/projects', Component: ProjectsPage },
      { path: '/principles', Component: PrinciplesPage },
      { path: '/community', Component: CommunityPage },
      { path: '/about', Component: AboutPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
];

export interface PrerenderEntry {
  path: string;
  meta: PageMeta;
}

/** The five canonical routes, in the exact order they appear in the sitemap. */
export const prerenderEntries: PrerenderEntry[] = [
  { path: '/', meta: homeMeta },
  { path: '/projects', meta: projectsMeta },
  { path: '/principles', meta: principlesMeta },
  { path: '/community', meta: communityMeta },
  { path: '/about', meta: aboutMeta },
];
```

### A2. Rewrite `src/App.tsx` to consume the shared routes

Replace the whole file with:

```tsx
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';

const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
```

Do not leave a second copy of `RootLayout` or the route table in `App.tsx`.

### A3. Create `scripts/prerender.tsx`

Create the `scripts/` directory and this file. Copy it exactly; do not
"improve" it:

```tsx
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom';
import { prerenderEntries, routes } from '../src/routes';
import { siteName, siteUrl } from '../src/config/site';
import type { PageMeta } from '../src/types';

const dist = join(process.cwd(), 'dist');

// The client build has already produced dist/index.html with the hashed asset
// URLs. Reuse those URLs verbatim so each generated page loads the exact CSS
// and JS bundle Vite emitted.
const builtIndex = readFileSync(join(dist, 'index.html'), 'utf8');
const cssHref = builtIndex.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/)?.[1];
const jsSrc = builtIndex.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)?.[1];
if (!cssHref || !jsSrc) {
  throw new Error('prerender: could not locate built stylesheet/script in dist/index.html');
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function headFor(meta: PageMeta): string {
  const lines = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:image" content="${siteUrl}/og-image.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${siteUrl}/og-image.png" />`,
  ];
  if (siteUrl && meta.canonicalPath) {
    const url = `${siteUrl}${meta.canonicalPath}`;
    lines.push(`<link rel="canonical" href="${escapeHtml(url)}" />`);
    lines.push(`<meta property="og:url" content="${escapeHtml(url)}" />`);
  }
  if (meta.noIndex) {
    lines.push(`<meta name="robots" content="noindex" />`);
  }
  return lines.join('\n    ');
}

async function renderRoute(path: string): Promise<string> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`${siteUrl}${path}`));
  if (context instanceof Response) {
    throw new Error(`prerender: query returned a Response (${context.status}) for ${path}`);
  }
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToStaticMarkup(<StaticRouterProvider router={router} context={context} />);
}

function documentFor(routeHtml: string, head: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${head}
    <meta name="theme-color" content="#FBFBF9" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" crossorigin href="${cssHref}" />
  </head>
  <body>
    <div id="root">${routeHtml}</div>
    <script type="module" crossorigin src="${jsSrc}"></script>
  </body>
</html>
`;
}

async function main(): Promise<void> {
  for (const entry of prerenderEntries) {
    const html = await renderRoute(entry.path);
    const file = join(dist, entry.path, 'index.html');
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, documentFor(html, headFor(entry.meta)));
    console.log(`prerendered ${entry.path} -> ${file}`);
  }
}

void main();
```

Note: `#FBFBF9` in `documentFor` is a `<meta name="theme-color">` value, not a
CSS color token. It mirrors the value already in `index.html`. This is the one
acceptable literal of this kind, matching the existing `index.html` precedent.

### A4. Rewrite `index.html` to the minimal template

Prerendered output replaces everything route-specific. `index.html` is now only
the Vite entry template and the dev-mode shell. Remove the `<noscript>` block
and all OpenGraph/Twitter/canonical `<meta>` tags (they move into the prerender
script). Replace the entire file with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>KnowledgeAssemble</title>
    <meta name="theme-color" content="#FBFBF9" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/main.tsx` stays exactly as it is — `createRoot(container).render(<App/>)`.
Do not switch to `hydrateRoot`; the prerender uses `renderToStaticMarkup`
(markers-free), so `createRoot` is correct and simplest.

### A5. Update `package.json` build scripts

Change the `scripts` block so `build` runs the client build first, then the
SSR build, then the renderer:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build && npm run prerender",
  "prerender": "vite build --ssr scripts/prerender.tsx --outDir dist-ssr --emptyOutDir && node dist-ssr/prerender.js",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit && tsc -p tsconfig.e2e.json --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "verify": "npm run typecheck && npm run test && npm run build && npm run test:e2e"
}
```

`dist-ssr/` is already gitignored (the repo ignores `dist-ssr/`). Confirm with
`git status` after a build that nothing under `dist/` or `dist-ssr/` is staged.

### A6. Replace `vercel.json` and add a static 404

The SPA rewrite must go, or Vercel will serve the homepage for every route.
Replace `vercel.json` with:

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

Create `public/404.html` (a plain static file — this is the *server* 404; the
client-side `*` route in `src/routes.tsx` still handles in-app navigation):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Page not found — KnowledgeAssemble</title>
    <meta name="robots" content="noindex" />
    <meta name="description" content="The page you requested does not exist or has moved." />
  </head>
  <body>
    <main id="main-content">
      <h1>Page not found</h1>
      <p>The page you requested does not exist or has moved.</p>
      <p><a href="/">Return home</a></p>
    </main>
  </body>
</html>
```

The tiny duplication between this file and `NotFoundPage.tsx` is intentional and
acceptable: one is the server's 404 for unknown deep links, the other is the
SPA's catch-all for in-app navigation. They are not the same execution path.

### A7. First manual verification (do this before writing any tests)

```bash
npm run build
ls dist/index.html dist/projects/index.html dist/principles/index.html dist/community/index.html dist/about/index.html
npx vite preview   # then, in a second terminal:
```

With JavaScript disabled (DevTools → Disable JavaScript), open each of the five
routes and confirm `document.body.innerText` contains the real page content and
does **not** contain "JavaScript application". Confirm each page has exactly one
`<h1>`.

Also confirm the raw HTML (view-source) for `/projects` contains:

```html
<link rel="canonical" href="https://knowledgeassemble.org/projects" />
<meta property="og:url" content="https://knowledgeassemble.org/projects">
```

If any of this fails, fix it before proceeding. This is the core of the entire
gap-closure.

---

## Phase B — Tests (spec §23, §24, §8–§10)

Follow the repo's TDD rule where it applies: for new behavioural guards, write
the test first and watch it fail, then satisfy it. For the two deletions below,
deletion *is* the change.

### B1. Delete `src/test/staticShell.test.ts`

It asserts `#root` is empty and the shell sits in `<noscript>` — both are now
wrong. Delete the file. Its coverage is replaced by B3/B4 below.

### B2. Update `src/test/guards.test.ts`

Find the `describe('static metadata fallbacks (implementation plan §4.3)'`
block. It currently asserts `index.html` contains an absolute `og:image`. That
is no longer true — the image is injected by the prerender script. Replace that
block with one that asserts the new template reality:

```ts
describe('static metadata fallbacks (implementation plan §4.3)', () => {
  const html = () => read(join(process.cwd(), 'index.html'));

  it('declares only the route-independent head in the template', () => {
    const contents = html();
    expect(contents).toContain('rel="icon"');
    expect(contents).toContain('name="theme-color"');
    // Route-specific tags live in the prerender, not the Vite template.
    expect(contents).not.toContain('property="og:title"');
    expect(contents).not.toContain('rel="canonical"');
  });

  it('emits no static canonical, since Vercel serves index.html for every route', () => {
    expect(html()).not.toContain('rel="canonical"');
  });
});
```

### B3. Update `tests/e2e/routes.spec.ts`

Remove the entire `test.describe('static shell', …)` block (it asserts the
now-removed `<noscript>` shell behaviour). In its place, add a no-JS content
spec. If the file has no obvious slot, create `tests/e2e/nojs.spec.ts` instead:

```ts
import { expect, test } from '@playwright/test';

const ROUTES: { path: string; heading: string }[] = [
  { path: '/', heading: 'Building open systems for assembling knowledge.' },
  { path: '/projects', heading: 'Projects' },
  { path: '/principles', heading: 'Principles' },
  { path: '/community', heading: 'Build with us.' },
  { path: '/about', heading: 'About KnowledgeAssemble' },
];

// Spec §4, §23: the page must be a real document without JavaScript.
test.describe('no-JS content', () => {
  for (const { path, heading } of ROUTES) {
    test(`${path} exposes real content with JavaScript disabled`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(path);

      await expect(page.locator('h1')).toHaveText(heading);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('body')).not.toContainText('JavaScript application');

      await context.close();
    });
  }
});
```

Note the exact `h1` text must match the page. Verify each against the page
source before finalising (the `/community` heading is "Build with us.", the
`/about` heading is "About KnowledgeAssemble", etc.).

### B4. Add `tests/e2e/prerender.spec.ts` (server-delivered HTML, spec §5, §6, §7)

This is the most important new test: it asserts the *served HTML itself* — not
the hydrated DOM — carries the content and absolute metadata. It runs against
`vite preview` after `npm run build`, so the prerendered files are what it sees.

```ts
import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/projects', '/principles', '/community', '/about'];

test.describe('prerendered HTML (spec §5–§7)', () => {
  for (const route of ROUTES) {
    test(`${route} HTML carries content and absolute metadata`, async ({ request }) => {
      // Trailing-slash form is what vite preview serves for a subdirectory index.
      const url = route === '/' ? '/' : `${route}/`;
      const response = await request.get(url);
      expect(response.status()).toBe(200);

      const html = await response.text();
      expect(html, `${route} has no canonical`).toContain(
        `<link rel="canonical" href="https://knowledgeassemble.org${route}"`,
      );
      expect(html, `${route} has no og:url`).toContain(
        `property="og:url" content="https://knowledgeassemble.org${route}"`,
      );
      expect(html, `${route} has no og:image`).toContain(
        'content="https://knowledgeassemble.org/og-image.png"',
      );
      // The document must not be the empty SPA shell.
      expect(html).not.toContain('JavaScript application');
    });
  }
});
```

**Caveat to check while implementing:** `vite preview` serves a subdirectory
`index.html` at both `/projects` and `/projects/`. If `request.get('/projects')`
(no slash) 404s under preview, use the trailing-slash URL as above; the Vercel
deploy uses `cleanUrls` and serves the no-slash form. The canonical/og:url
assertions compare against the no-slash apex form, which is the deployed truth.

### B5. Add a guard test that the route table and prerender list cannot drift

Create `src/test/routes.test.ts`. Its purpose: if someone adds a page to
`routes` but forgets `prerenderEntries` (or vice versa), the build should fail.

```ts
import { describe, expect, it } from 'vitest';
import { prerenderEntries, routes } from '../routes';
import { projects } from '../content/projects';

describe('route table and prerender entries stay in sync', () => {
  it('exposes the five canonical routes', () => {
    const paths = prerenderEntries.map((entry) => entry.path).sort();
    expect(paths).toEqual(['/', '/about', '/community', '/principles', '/projects']);
  });

  it('matches the leaf paths of the route table', () => {
    const root = routes[0];
    const children = root && 'children' in root ? root.children : [];
    const leafPaths = (children ?? [])
      .map((child) => child.path)
      .filter((path) => path && path !== '*')
      .sort();
    expect(leafPaths).toEqual(
      prerenderEntries
        .map((entry) => entry.path)
        .sort(),
    );
  });

  it('never exposes a PRD section number in principle copy', () => {
    // Existing constraint, restated here because the prerender now publishes
    // this content into the initial HTML.
    for (const principle of projects) void principle;
  });
});
```

That last test is a placeholder — replace it or delete it; do not ship a vacuous
test. The intent is only to signal that the `13.x` numbers must never reach the
HTML (already covered by `src/test/guards.test.ts` and the route e2e). If you
are unsure, drop it.

---

## Phase C — Documentation (spec §21, §22, §20)

The spec calls out three files. Update all three, because leaving a stale
"CSR is accepted" claim is itself a gap.

### C1. `AGENTS.md`

In the **Current state** section, replace the `siteUrl`-is-empty paragraph and
the "Phases A–C" paragraph with the post-prerender reality. In **Hard
constraints**, add this bullet (it is the new architectural rule, per spec §22):

> - **Web document first.** All five canonical routes (`/`, `/projects`,
>   `/principles`, `/community`, `/about`) must produce meaningful HTML at build
>   time. Client-side JavaScript may enhance navigation and interaction but must
>   not be the sole source of route content.

In **Open blockers**, remove or rewrite the "CSR is accepted … noscript shell
mitigation" bullet (it is now false). The `knowledgeassemble.org` registered
bullet stays.

### C2. `README.md`

Remove the "Known limitation: V1 is client-side rendered" section (or rewrite it
to state that the five routes are statically prerendered and JavaScript
enhances). Align the status line with the new architecture.

### C3. `docs/IMPLEMENTATION_PLAN.md`

This is the authority document; it still says §4.2 "V1 accepts client-side
rendering" and §6.2 describes the `<noscript>` shell. Edit both to describe the
prerender, and strike the now-obsolete "vite-plugin-ssg" recommendation and the
"V2 prerender" deferral language. Do not rewrite the whole plan — surgically
update the sections that describe delivery (§4.2, §4.3, §6.2) and the open
question table row about CSR (§10 Q5).

---

## Phase D — P1 content review (spec §11–§20)

Most P1 items are **already satisfied** by the existing copy. Do not touch copy
unless you can point at a specific gap. The one genuine item to verify:

### D1. Knowledge Systems categories (spec §13)

`src/content/projects.ts` currently gives the "Knowledge Systems" card the
categories `['Formats', 'Graph', 'AST']`. The spec flags "AST"/"Graph" as too
implementation-oriented for a public organizational page and suggests
user-facing language like `Structured Knowledge / Portable Formats /
Interactive Systems`.

**Decision point — do not silently change this.** It is a judgement call about
public tone, and it changes visible content. If you change it, also update the
tests/guards that may assert the category list, and state in your commit message
exactly what you changed and why. If unsure, leave the categories as they are
and note it for a human to decide.

### D2. Everything else in §11–§20 is verification, not change

Homepage positioning (§11), OpenEdu prominence (§12), Experiments honesty
(§14), principles 01–07 (§15), community honesty (§17), GitHub as a destination
(§19) are all already correct in the current content. Verify each and do not
"improve" correct copy.

---

## Phase E — Full verification

Run the complete gate before you consider the work done:

```bash
npm run verify
```

Then, against `vite preview`:

1. **No-JS content** — JS disabled, all five routes show real content (Phase A7).
2. **Deep-route HTML** — view-source of each route shows correct `<title>`,
   `<meta name="description">`, canonical, og:title/description/url/image,
   twitter metadata, exactly one `<h1>` (spec §5).
3. **Sitemap/robots** — `curl localhost:4173/sitemap.xml` returns valid XML with
   exactly the five apex URLs, no duplicate slashes; `robots.txt` points at it
   (spec §8–§9). These already have guard tests from PR #5 — confirm they still
   pass.
4. **404** — `curl -s -o /dev/null -w "%{http_code}"` on a nonsense path; the
   served `404.html` has `noindex` and no canonical (spec §10). Note: `vite
   preview` uses SPA fallback locally, so the *Vercel* 404.html is the source of
   truth here — verify it exists and is correct in `public/404.html`, and reason
   about Vercel behaviour from the `vercel.json` change.
5. **axe + responsive + performance** — the existing `a11y.spec.ts` and
   `responsive.spec.ts` must still pass (spec §24, §27). Re-run Lighthouse
   against the preview; target a11y ≥ 95, SEO ≥ 95, best-practices ≥ 95,
   performance ≥ 95, CLS ≈ 0 (spec §28).

---

## Definition of done (mirrors spec §35)

- [ ] All five routes produce meaningful HTML without JavaScript.
- [ ] Each route's HTML carries correct title, description, canonical, and OG/Twitter metadata.
- [ ] `#root` in the template is empty but the built `dist/*/index.html` is not.
- [ ] `vercel.json` no longer rewrites everything to `index.html`.
- [ ] `public/404.html` exists with `noindex` and no canonical.
- [ ] `src/test/staticShell.test.ts` is deleted and no test still asserts the `<noscript>` shell.
- [ ] `npm run verify` passes on a clean checkout.
- [ ] `README.md`, `AGENTS.md`, and `docs/IMPLEMENTATION_PLAN.md` no longer claim "V1 accepts client-side rendering" or describe the `<noscript>` shell as the delivery mechanism.
- [ ] No new runtime dependency was added.
- [ ] Commit messages state the verification performed, per `AGENTS.md`.

## Known pitfalls (read twice)

- **`vite build --ssr` must run *after* the client `vite build`.** The prerender
  script reads `dist/index.html` for the hashed asset URLs; if the client build
  hasn't run, that read fails.
- **The SSR entry must live inside the project root** (not `/tmp`). Vite and
  Node both need to resolve `react`/`react-dom` from the project's
  `node_modules`.
- **`renderToStaticMarkup`, not `renderToString`.** Markers-free output is what
  pairs with the unchanged `createRoot` client entry. Switching to
  `renderToString` + `hydrateRoot` is a different, riskier change and is out of
  scope.
- **Do not leave the `<noscript>` shell.** It is dead once the real HTML is
  prerendered, and leaving it in means the no-JS user gets *two* documents.
- **Do not let `useDocumentMeta` duplicate tags.** It already finds-and-updates
  existing tags, so against the prerendered head it is a no-op. If you rewrite
  it, keep that property.
- **Trailing slash.** `siteUrl` has no trailing slash and the homepage path is
  `/`, so the homepage canonical is `https://knowledgeassemble.org/`. The
  existing `site.test.ts` already pins this. Do not "fix" it by stripping the
  slash.
