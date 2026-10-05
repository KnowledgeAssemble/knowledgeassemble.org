# Test Framework, CI & TDD Policy — Implementation Plan

**Status:** Implemented. Phases A–C (unit/component tests, guard tests, e2e, and CI) are in place; Phase D is the TDD directive in `AGENTS.md`.

**Scope:** Establishes automated verification (Phases A–C below) and a TDD directive for future work (Phase D). Written after a review of PR #2 found that every project constraint currently rests on manual verification.

**Authority:** `docs/IMPLEMENTATION_PLAN.md` (build), `docs/KNOWLEDGEASSEMBLE-WEBSITE-V1.md` (copy), `AGENTS.md` (hard constraints). Where this plan and the implementation plan disagree, the implementation plan states the resolution; this document does not alter any phase sequence.

---

## 1. Current State

> Historical. This section records the state *before* the test framework in §4–§8
> was built, and is kept as the baseline that justified it. For what the suite
> contains today, see §4.5, §7.1, and the `scripts` block in `package.json`.

The `scripts` block in `package.json` is the whole verification story:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit"
}
```

Absent today:

- No test runner (`vitest`, `jest`, `playwright`, `cypress` — none in `devDependencies` or `node_modules`).
- No test files (nothing matching `*.test.*`, `*.spec.*`, or `__tests__` under `src/`).
- No CI (no `.github/` directory), so `typecheck` and `build` never run automatically.
- No automated accessibility checks. Phases 8 and 9 are written entirely as manual browser passes.
- No link checker. The four external URLs in `src/config/links.ts` are verified by hand.

`.gitignore` already carries a `# Test / coverage` block (`coverage/`, `.nyc_output/`), so the project anticipated tests. That block is currently aspirational.

The implementation plan never specifies automated testing — the only matches for "test" are a user-testing bullet in a design-principle list and a note about early manual testing. This is not drift; testing was never in scope as written.

## 2. Decision: Node Engine Floor

**This must be settled before installing anything.**

`package.json` declares `"engines": { "node": "^20.19.0 || >=22.12.0" }`. Latest Vitest (5.0.3) requires `^22.12.0 || ^24.0.0 || >=26.0.0` — it drops Node 20. Vitest 4.1.11 accepts `^20.0.0 || ^22.0.0 || >=24.0.0`.

| Option | Vitest | Effect |
| :--- | :--- | :--- |
| **A (recommended)** | 5.0.3 | Bump `engines.node` to `>=22.12.0`. Node 20 reached end-of-life in April 2026, and Vercel provisions Node 22. Cleanest, and the newest Vitest matches Vite 7. |
| B | 4.1.11 | Keeps Node 20 in the supported range. One major behind, and retains support for an EOL runtime. |

Local Node is v22.22.3, so either option runs today. Option A is recommended and requires a one-line `engines` change plus a CI `node-version` bump.

## 3. Dependencies

Pinned to versions verified against the registry on 2026-10-05.

**Unit and component (devDependencies):**

| Package | Version | Why |
| :--- | :--- | :--- |
| `vitest` | `5.0.3` | Runner. Shares Vite 7's transform pipeline, so no separate babel/ts-node setup. |
| `@vitest/coverage-v8` | `5.0.3` | Coverage via V8 instrumentation. Must match `vitest` exactly. |
| `@testing-library/react` | `16.3.3` | Renders components and `useDocumentMeta` against jsdom. |
| `@testing-library/dom` | `^10` | **Required peer** of `@testing-library/jest-dom@7` (`>=10 <11`). Omitting it is an install-time error. |
| `@testing-library/jest-dom` | `7.0.1` | Matchers like `toHaveAttribute`, `toHaveFocus`. |
| `jsdom` | `30.1.2` | DOM environment. |

**End-to-end (devDependencies):**

| Package | Version | Why |
| :--- | :--- | :--- |
| `@playwright/test` | `1.63.0` | Route smoke tests and accessibility assertions against the production build. |
| `@axe-core/playwright` | `4.13.0` | Injects axe-core into Playwright pages. Covers part of Phase 8 automatically. |

`@types/node` is also required: `vitest` peers on `^22.0.0 || >=24.0.0`, and `tsconfig.node.json` currently sets `"types": []`.

## 4. Configuration

### 4.1 New files

```
vitest.config.ts        # unit/component runner — react plugin, jsdom, setup file
playwright.config.ts    # e2e runner — chromium only, builds and serves the app
src/test/setup.ts       # @testing-library/jest-dom import + cleanup
tests/e2e/*.spec.ts     # route smoke + axe assertions
```

### 4.2 `vitest.config.ts`

A separate file rather than a `test` block inside `vite.config.ts`. Putting `test` in the Vite config requires importing `defineConfig` from `vitest/config` and a `/// <reference types="vitest/config" />`, which risks breaking the production build config for no benefit. A standalone file also keeps `tsconfig.node.json`'s `include` meaningful.

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test/**', '**/*.d.ts'],
    },
  },
});
```

The Tailwind plugin is deliberately absent. Components do not import CSS — only `src/main.tsx` does — so CSS processing is irrelevant under jsdom, and pulling it in would make every test run slower for no benefit.

### 4.3 `playwright.config.ts`

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
```

Chromium only, deliberately. The constraints being tested (heading counts, horizontal overflow, landmark structure) are not engine-specific, and adding WebKit and Firefox triples CI time for no coverage gain on a static site.

E2E runs against `npm run preview`, not `npm run dev`. The dev server reproduces a ~400 ms unstyled flash (Vite injects CSS via JS at runtime); testing the production build means tests exercise the artifact that actually deploys, and the FOUC never appears.

### 4.4 `src/test/setup.ts`

```ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);
```

The `afterEach(cleanup)` call is redundant while `globals: true` auto-cleanup works, but explicit is safer if `globals` is ever dropped.

### 4.5 TypeScript

Two constraints from `tsconfig.json` will bite on the first test file written:

- **`verbatimModuleSyntax: true`** — type-only imports must use `import type { PageMeta }`, not `import { type PageMeta }` or a bare import.
- **`noUnusedLocals` and `noUnusedParameters`** — an unused variable in a test fails `npm run typecheck`, not just the test.

`tsconfig.json` has `"include": ["src"]`, so co-located `src/**/*.test.tsx` files are typechecked by `tsc -b` automatically. **No change needed there.**

Playwright specs in `tests/e2e/` fall *outside* that include and so are not typechecked at all. Playwright transpiles them itself and will run, but type errors go unreported. Two options:

- Add `tests/e2e` to a new `tsconfig.e2e.json` and a `typecheck:e2e` script (recommended — keeps e2e types honest).
- Or add `tests` to the root `include`, accepting that `tsc -b` then typechecks Playwright specs with `types: ["vite/client"]` and no `@playwright/test` types.

**Build scripts need their own project.** `scripts/prerender.tsx` writes every page's HTML, so a type error there is a wrong deploy rather than a red build — but `tsconfig.json` includes only `src` and `tsconfig.node.json` only `vite.config.ts`. `tsconfig.scripts.json` covers `scripts/` with `types: ["node"]` (it uses `node:fs`) and `jsx: "react-jsx"`. Its `lib` must include `DOM`, because it imports page components that reference `document`. It is checked by `npm run typecheck`, not by `tsc -b`, because it is a build tool rather than an app source.

## 5. Scripts to add

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage",
"test:e2e": "playwright test",
"typecheck": "tsc --noEmit && tsc -p tsconfig.e2e.json --noEmit && tsc -p tsconfig.scripts.json --noEmit",
"verify": "npm run typecheck && npm run test && npm run build && npm run test:e2e"
```

`verify` is the single command CI runs and the one to run before pushing.

## 6. Phase A — Unit and Component Tests

Highest value first: `useDocumentMeta` is the only file in `src/` with real branching logic, and it is the code most recently found to have a gap during review.

### A1. `src/hooks/useDocumentMeta.test.ts`

Covers the behaviour that was verified by hand in the PR #2 review, so it cannot silently regress:

| Test | Asserts |
| :--- | :--- |
| Title and description | `document.title` and `meta[name=description]` match `meta` |
| OG and Twitter | `og:title`, `og:description`, `twitter:title`, `twitter:description`, `twitter:card` all set |
| Canonical suppressed | With `siteUrl = ''`, neither `link[rel=canonical]` nor `og:url` exists |
| Canonical emitted | With `siteUrl` set, `href` and `og:url` are absolute (`${siteUrl}${canonicalPath}`) |
| `noIndex` | The 404 meta yields `meta[name=robots]` with `noindex` |
| `noIndex` cleanup | Navigating off the 404 removes the robots tag — the specific regression risk in the current implementation |
| Unmount | Title restored and created tags removed |

Canonical tests need `siteUrl` non-empty. Since `site.ts` exports a const, mock the module:

```ts
vi.mock('../config/site', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../config/site')>();
  return { ...actual, siteUrl: 'https://example.test' };
});
```

### A2. `src/config/site.test.ts`

- `siteUrl` is `''` or a valid absolute origin (the unregistered-domain guard, §10 Q3).
- `defaultMeta` matches PRD §27 title and description verbatim.

### A3. `src/config/links.test.ts`

- All four URLs are `https:` and well-formed.
- None point at `openedu.org` (§11.2 records that the invented domain does not resolve).
- An optional `it.each` over the values asserts they still resolve, **skipped by default** and enabled via `RUN_NET_TESTS=1`. Network-dependent tests must not run in CI by default; a flaky outbound request should never fail the build.

### A4. `src/content/*.test.ts`

- `principles.ts` has exactly 7 items, `number` runs `01`–`07` with no gaps or duplicates, and `id` is unique.
- `community.ts` has exactly 5 tracks.
- `projects.ts` marks OpenEdu as `isFlagship`.

### A5. Component tests

One test per layout primitive, covering only what jsdom can verify — `aria-*` attributes, conditional rendering, tab order. **Layout and contrast are explicitly out of scope here**; jsdom does not lay out or paint, so a test asserting either would be theatre. Those remain Phase 8–9 manual passes.

Priority order if time is short: `SkipLink` (first focusable, targets `#main-content`), `SiteHeader` (disclosure `aria-expanded` toggle, `Escape` closes, focus returns to toggle), `Button` (renders as `Button` with an anchor when `to` is set).

## 7. Phase B — Guard Tests

The project's hard constraints in `AGENTS.md` are exactly the kind of rule that decays. These are assertions over static source and over the built page, and they are what justifies a test framework here more than the unit tests do.

| Test | Asserts | Constraint |
| :--- | :--- | :--- |
| Colour tokens | No hex, `rgb()`, or `hsl()` literal in any `src/**` file except `src/styles/index.css` | AGENTS.md, §2.2 |
| Focus rings | No `ring-*` utility anywhere in `src/` — focus rings use `outline-*` | AGENTS.md |
| No forbidden visuals | No `shadow-*`, `drop-shadow-*`, `bg-gradient-*`, `rounded-full`, `rounded-pill` | AGENTS.md |
| Radius tokens | Only `rounded-control` (4px) and `rounded-panel` (8px) | AGENTS.md, §2.2 |
| URLs centralized | `rg` over `src/` matches `https?://` only in `src/config/links.ts` | §11, Phase 11 |
| Principle numbers | No `13.x` string appears in any rendered `textContent` | AGENTS.md, §13 |
| One `h1` | Exactly one `h1` per route | §6.1 |
| No overflow | `documentElement.scrollWidth <= clientWidth` at 320px | §6.4 |
| Metadata | Distinct title and description per route; no canonical or `og:url` while `siteUrl` is empty | §4.3 |
| axe-core | Zero serious or critical violations per route | Phase 8, PRD §32 |

Two details worth calling out:

**The colour-literal test needs allowlisting.** `index.html` contains `theme-color="#FBFBF9"`, and `public/favicon.svg` contains `#FBFBF9` and `#164E63`. Both are correct — §4.3:235 explicitly requires theme-color as a static fallback in `index.html`, and the value matches the `--color-canvas` token. The test asserts the *palette* is drawn from tokens rather than banning literals outright, with `index.html` and `public/favicon.svg` on an explicit allowlist and a comment citing §4.3. Banning them would fail the build on correct code.

**Source-scanning tests belong in Vitest, not Playwright.** They read files from disk and need no browser, so they belong in the unit suite. The overflow, `h1`, and axe checks need a rendered page and belong in Playwright.

The axe check covers the *mechanical* part of Phase 8 only. It cannot judge whether focus rings are visible, whether headings are logically ordered for a screen reader, or whether contrast holds on a gradient — which is why the plan does not let passing tests retire the manual audit.

### 7.1 Prerender and no-JS specs (gap closure)

Added with the prerender pass, because a build-time HTML claim that nothing asserts will rot the first time someone edits a page.

| Test | Asserts | Why it exists |
| :--- | :--- | :--- |
| `src/test/routes.test.ts` | `prerenderEntries` matches the five canonical routes *and* the leaf paths of the route table; each entry's `canonicalPath` equals its route; the 404 entry writes `404.html`, is `noIndex` with no canonical, and is not in the canonical set | Guards against the two lists drifting. Nothing else fails loudly when a page is added to one and not the other — the build still succeeds, that route just silently stops being prerendered. |
| `tests/e2e/prerender.spec.ts` | The **served HTML** carries per-route title, description, canonical, `og:url`, `og:image`; no `JavaScript application` text; `/` is not an empty `#root`; the 404 is a real document, is styled (not a browser-default serif), exposes the primary nav and footer, and is `noindex` with no canonical | Asserts the served bytes, not the hydrated DOM. A Playwright `page.goto` sees whatever React produced; only `request.get` sees what a crawler sees. |
| `tests/e2e/nojs.spec.ts` | Each route's `h1` text and count with `javaScriptEnabled: false`, plus link navigation between routes | The prerender exists for no-JS visitors, so this is the acceptance test for the whole change. |
| `routes.spec.ts` → `not-found route` | Both a hard request *and* a client-side navigation to an unknown path render the not-found experience; the latter claims no canonical | A hard request never reaches `NotFoundPage` — the host answers with `dist/404.html` first. Without the SPA-navigation case, `NotFoundPage` and its `noIndex` branch have no coverage at all. |

`vite preview` runs a preview-only plugin (`vite.config.ts`) that resolves clean URLs to their directory index and serves `dist/404.html` for unknown paths, mirroring `cleanUrls` on Vercel. Without it, `vite preview`'s SPA fallback serves the homepage for `/projects` and the specs above would pass against the wrong document.

The 404 spec asserts a computed `font-family` is not the browser default. That is the regression test for the one bug this pass introduced: a hand-written `public/404.html` shipped with no stylesheet link, so every mistyped URL rendered as Times New Roman with no site chrome. The 404 is now prerendered from `NotFoundPage` into `dist/404.html`, which keeps one copy of the copy and inherits the real stylesheet.

## 8. Phase C — CI

`.github/workflows/ci.yml`, running on `pull_request` and `push` to `main`:

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run test:coverage
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

Decisions:

- **Single `verify` job, not a matrix.** Splitting lint/test/e2e into parallel jobs would save ~40 seconds and cost a second install of the toolchain. Premature for a repo this size.
- **`concurrency` cancels superseded runs.** Iterating on a branch should not queue three full e2e passes.
- **`npx playwright install --with-deps chromium` is required** before `test:e2e`, otherwise the runner has no browser binary. It is deliberately not folded into `npm ci` because it downloads ~150 MB and should be visible in the log rather than hidden in a postinstall.
- **Coverage is reported, not gated initially.** No threshold in the first pass; a coverage number nobody trusts gets ignored. Set a floor once the suite has been stable for a few PRs.
- **No auto-merge.** Human review stays, per the repo's git policy.

Branch protection on `main` requiring `verify` is the natural follow-up, but it is an organizational setting and not something a workflow file can enforce. Flag it rather than assume it.

## 9. Phase D — AGENTS.md TDD Directive

### 9.1 The honest version

TDD does not fit all of this project, and a directive claiming it does would be worse than none.

**TDD applies to:**
- `src/hooks/`, `src/config/`, `src/types/`, `src/content/` — anything with branching logic or data shape.
- `src/components/` for behaviour: ARIA attributes, conditional rendering, focus management.
- Any change touching a hard constraint, which requires the Phase B guard test to exist first.

**TDD does not apply to:**
- Visual and layout work in `src/styles/index.css` and Tailwind class names. A test asserting a specific pixel position is brittle and proves little; the Phase 8–9 manual passes are the right instrument.
- Copy edits, except where Phase B guards them.

**For visual work, the substitute for a test is a stated verification step** in the commit or task description — viewport, what was checked, what was observed. That is what Phase 8 and 9 already specify in detail.

### 9.2 Draft `AGENTS.md` addition

Append after "Hard constraints":

```markdown
## Test-driven development

**Write the failing test first** for anything with logic: hooks, config,
content shape, and component behaviour (ARIA, conditional rendering, focus
management). No exceptions — if the code has a branch, it gets a test.

The constraints under "Hard constraints" are enforced by automated guard
tests, not by discipline. Before changing anything that could affect one,
confirm the guard exists; if it does not, write it and watch it fail.

**Not every change is test-first.** CSS, layout, and Tailwind utilities are
verified by the manual passes in plan Phases 8–9 — Lighthouse, axe,
keyboard, and the eight viewports. Asserting pixel positions produces
brittle tests that pass while the page is wrong. For visual work, state the
verification you performed in the commit message instead.

Run `npm run verify` before pushing: typecheck, unit tests, build, e2e.
CI runs the same command and is required to pass on `main`.
```

### 9.3 Also update `AGENTS.md`

- **Current state** — replace "Phase 8 (accessibility audit) is next" with the phase-accurate position, since Phases A–C land before Phase 8 runs.
- **Read-these-first table** — add `docs/TESTING_PLAN.md` as the authority for test setup and the TDD boundary.

### 9.4 Do not change

`AGENTS.md` is the file every future session reads first. The TDD directive is additive: the existing Hard constraints, Tone, Git, and Open blockers sections stay as written. In particular the three deliberate token overrides (`--color-ink-tertiary`, `--color-rule-interactive`) must survive verbatim — a guard test asserts the palette, it does not get to redefine it.

## 10. Execution Order

| Phase | Deliverable | Depends on |
| :--- | :--- | :--- |
| 0 | Decide Node engine floor (§2); bump `engines` if Option A | — |
| 1 | Install devDependencies (§3); add scripts (§5) | Phase 0 |
| 2 | `vitest.config.ts`, `src/test/setup.ts`, `tsconfig.e2e.json` | Phase 1 |
| 3 | `useDocumentMeta` + config + content tests (§6) | Phase 2 |
| 4 | Guard tests (§7, Vitest half) | Phase 2 |
| 5 | `playwright.config.ts` + route and axe specs (§7, Playwright half) | Phase 2 |
| 6 | `.github/workflows/ci.yml` | Phase 4, 5 |
| 7 | `AGENTS.md` TDD directive (§9) | Phase 6 |

Phases 3 and 4 can proceed in parallel with 5.

## 11. What This Does Not Buy

State these plainly so the plan is not oversold:

- **Contrast, focus-ring visibility, and screen-reader usability** stay manual. No automated check in this plan evaluates whether a focus ring is actually visible against its background.
- **Visual regression** is not covered. No Playwright snapshot comparison is proposed; baselines are brittle across environments and the design is already specified precisely enough in `DESIGN.md` to check by eye.
- **Real-device behaviour**, Safari and Firefox rendering, and VoiceOver remain Phase 8 work.
- **Network-dependent link checking** is opt-in, so a dead link can reach `main` between manual checks.
- **Nothing here retires Phases 8, 9, or 10.** It converts a meaningful subset of repeatable mechanical checks into something CI enforces, and leaves judgement-based review with a human.

## 12. Open Questions

Do not invent answers to these; they are organizational decisions.

1. **Node floor** — drop Node 20 (§2 Option A), or keep it and take Vitest 4?
2. **Branch protection** — should `verify` be required on `main`? Configured in repo settings, not in the workflow file.
3. **Coverage floor** — none initially (§8). Set a threshold later, or never?
4. **TDD scope** — is the §9.1 boundary right? In particular, is requiring behaviour tests for component ARIA too strict, or is leaving focus management to manual keyboard passes too lax?