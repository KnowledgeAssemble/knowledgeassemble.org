# KnowledgeAssemble Website V1 — Detailed Implementation Plan

**Reference Documents:**
- Product Specification: [`docs/KNOWLEDGEASSEMBLE-WEBSITE-V1.md`](./KNOWLEDGEASSEMBLE-WEBSITE-V1.md)
- Stitch UI Prototypes & Design Systems: [`docs/stitch_knowledgeassemble_website_v1`](./stitch_knowledgeassemble_website_v1)
  - `assembled_knowledge_framework/DESIGN.md` (Primary token and aesthetic authority)
  - `knowledgeassemble_home/code.html` & `screen.png`
  - `knowledgeassemble_projects/code.html` & `screen.png`
  - `knowledgeassemble_principles/code.html` & `screen.png`
  - `knowledgeassemble_community/code.html` & `screen.png`
  - `knowledgeassemble_about_1` / `knowledgeassemble_about_2` & `screen.png`

**Authority order when documents conflict:** PRD §17–18 (palette/typography direction) → `assembled_knowledge_framework/DESIGN.md` (token values, shape, spacing) → Stitch `code.html` (layout reference only). Where the Stitch mocks contradict `DESIGN.md`, `DESIGN.md` wins; see §2.5 for the known deviations.

---

## 1. Executive Summary & Core Positioning

KnowledgeAssemble is an open-source umbrella organization stewarding tools, specifications, and systems that make knowledge portable, composable, interactive, and accessible. Its first flagship project is **OpenEdu**.

### 1.1 Strict Guardrails (What V1 Is and Is NOT)
- **Is:** A quiet, authoritative, intellectual, and technical identity establishing KnowledgeAssemble as an open-source umbrella organization, clearly positioning OpenEdu as its first initiative.
- **Is NOT:** A SaaS landing page, blog, community forum, documentation portal, or dynamic product catalog.
- **Explicit Exclusions:** No user accounts/logins, no backend or database, no CMS, no tracking/analytics, no gradients, no stock photos, no AI marketing hype, and no ungrounded scale claims.

---

## 2. Design System & Visual Language Specification

Synthesizing the PRD guidelines with the `assembled_knowledge_framework` design tokens:

### 2.1 Aesthetic Archetype: Archival Rigor & Humanist Functionalism
The visual system reflects ink on pressed warm paper, structured with hairline architectural borders and precise typography. Depth is achieved via tonal layering and fine 1px strokes rather than heavy drop shadows.

### 2.2 Color Tokens & Surface Hierarchy

Defined **once** in `src/styles/index.css` inside a Tailwind v4 `@theme` block. Tailwind generates matching utilities (`bg-canvas`, `text-ink-secondary`, `border-rule-interactive`). No hex values appear in any other file — no `tailwind.config.ts` color block, no arbitrary values like `ring-[#164E63]`.

Token names are chosen so generated utility names read naturally (`--color-ink-secondary` → `text-ink-secondary`). Source-token mapping is preserved in the comments for traceability to `DESIGN.md`.

```css
@theme {
  /* ── Canvas & Surfaces ─────────────────────────────────────────── */
  /* DESIGN.md: canvas #FBFBF9 · surface #FFFFFF · subtle #F7F7F4 · muted #ECEEF3 */
  --color-canvas: #FBFBF9;             /* Warm off-white paper ground */
  --color-surface: #FFFFFF;            /* Elevated card & module surface */
  --color-surface-subtle: #F7F7F4;     /* Secondary tinted containers & code blocks */
  --color-surface-muted: #ECEEF3;      /* Deep subtle container tier */

  /* ── Text & Foreground ─────────────────────────────────────────── */
  /* DESIGN.md: primary #1C1F23 · secondary #545B64 · tertiary #737A84 */
  --color-ink: #1C1F23;                /* 15.96:1 on canvas — WCAG AAA */
  --color-ink-secondary: #545B64;      /*  6.63:1 on canvas — WCAG AA */
  --color-ink-tertiary: #666D77;       /*  5.04:1 on canvas — WCAG AA */

  /* ── Accent Tones (Mineral & Archival) ─────────────────────────── */
  /* DESIGN.md: primary #164E63 · hover #113B4B · secondary #2D5A46 · subtle #F2F7F4 */
  --color-accent: #164E63;             /*  8.80:1 on canvas; white text on it 9.11:1 */
  --color-accent-hover: #113B4B;       /* 11.99:1 with white text */
  --color-verified: #2D5A46;           /*  7.61:1 on canvas — status pills & verification */
  --color-verified-subtle: #F2F7F4;    /* Pill background for `verified` */

  /* ── Borders & Hairlines ───────────────────────────────────────── */
  /* DESIGN.md: hairline #E2E2DC · interactive perimeter #CECEC6 */
  --color-rule: #E2E2DC;               /* 1px structural hairline rules (decorative only) */
  --color-rule-strong: #CECEC6;        /* Overlay/drawer perimeter (decorative only) */
  --color-rule-interactive: #8C8C82;   /* 3.28:1 — REQUIRED for interactive component
                                         boundaries per WCAG 1.4.11 Non-text Contrast.
                                         Never substitute `rule-strong` here. */

  /* ── Focus Indicator ───────────────────────────────────────────── */
  --color-focus-ring: #164E63;         /* 8.80:1 on canvas, 7.85:1 on muted */

  /* ── Shape (DESIGN.md §Shapes: "machined, orderly, architectural") ── */
  --radius-control: 0.25rem;           /* 4px — buttons, badges, inputs, code */
  --radius-panel: 0.5rem;              /* 8px — cards, panels, dialogs */
  /* Explicitly forbidden: pill/stadium radii and circular avatars. */
}
```

**Contrast corrections vs. the previous draft of this plan** (all values measured, not estimated):

| Token | Value | vs `#FBFBF9` | vs `#FFFFFF` | vs `#F7F7F4` | vs `#ECEEF3` | Verdict |
| :--- | :--- | --- | --- | --- | --- | :--- |
| `--color-ink` | `#1C1F23` | 15.96 | 16.54 | 15.41 | 14.25 | AAA |
| `--color-ink-secondary` | `#545B64` | 6.63 | 6.87 | 6.40 | 5.92 | AA |
| `--color-ink-tertiary` | `#666D77` | 5.04 | 5.23 | 4.87 | 4.50 | AA |
| `--color-accent` | `#164E63` | 8.80 | 9.11 | 8.49 | 7.85 | AAA |
| `--color-verified` | `#2D5A46` | 7.61 | 7.89 | 7.35 | 6.80 | AAA |
| `--color-rule` | `#E2E2DC` | 1.26 | 1.26 | — | — | Decorative only |
| `--color-rule-interactive` | `#8C8C82` | 3.28 | 3.39 | 3.16 | — | Passes 1.4.11 |

**Token changes required from the previous draft, and why:**

1. **`--color-ink-tertiary` changed from `#737A84` to `#666D77`.** The `DESIGN.md` value `#737A84` measures 4.18:1 on canvas, 4.33:1 on white, 4.04:1 on subtle, and 3.73:1 on muted — it **fails WCAG AA 4.5:1** at all four. `DESIGN.md` itself only claims AAA for *primary* text, so darkening tertiary does not contradict it. `#666D77` retains the same cool-grey hue relationship and passes AA on every surface in the system, including `surface-muted`.
2. **New `--color-rule-interactive: #8C8C82`.** `DESIGN.md` assigns `#CECEC6` to "interactive or hovered perimeters," but that measures 1.53:1 and fails WCAG 1.4.11 (3:1 required for the visual boundary of interactive components). Hairline `--color-rule` / `--color-rule-strong` remain decorative-only. Any focusable, clickable, or form element uses `border-rule-interactive`.
3. **Prior draft's contrast figures were wrong** (claimed 14.5:1 and 6.1:1 for charcoal and secondary). The table above replaces them.

### 2.3 Typography Scale
- **Primary Font:** `IBM Plex Sans` (Humanist, legible, calm authority)
- **Monospace Font:** `JetBrains Mono` (Technical telemetry, status badges, version markers, code snippets)

Fonts are **self-hosted** via `@fontsource/ibm-plex-sans` and `@fontsource/jetbrains-mono`, imported in `main.tsx`. No Google Fonts `<link>`, no external font CDN request at runtime. This is what makes the "zero external runtime dependencies" Definition-of-Done item (§8) true.

| Style Token | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | IBM Plex Sans | 48px / 32px (mob) | 600 | 56px / 40px | -0.02em / -0.015em (mob) | Hero headline |
| `headline-lg` | IBM Plex Sans | 32px / 26px (mob) | 600 | 40px / 34px | -0.015em / -0.01em (mob) | Page H1 & major section titles |
| `headline-md` | IBM Plex Sans | 24px | 600 | 32px | -0.01em | Card & category titles |
| `headline-sm` | IBM Plex Sans | 20px | 600 | 28px | -0.005em | Subsections |
| `body-lg` | IBM Plex Sans | 18px | 400 | 28px | normal | Lead paragraphs & hero intros |
| `body-md` | IBM Plex Sans | 15px | 400 | 24px | normal | Standard body text |
| `body-sm` | IBM Plex Sans | 13px | 400 | 20px | normal | Secondary text & footnotes |
| `code-md` | JetBrains Mono | 13px | 400 | 20px | normal | Code snippets & ASCII diagrams |
| `label-md` | JetBrains Mono | 12px | 500 | 16px | +0.02em | Version tags, repo refs |
| `label-sm` | JetBrains Mono | 11px | 500 | 14px | +0.04em | Status badges, category pills |

Defined as Tailwind v4 `@theme` tokens (`--text-display-lg`, `--text-body-md`, `--font-mono`, …) so `text-display-lg` / `font-mono` are available with no plugin.

**Mobile sizes are distinct tokens, not overrides.** `display-lg` (48px, -0.02em) and `display-lg-mobile` (32px, -0.015em) are separate entries in `DESIGN.md`, so they must be applied via explicit responsive utilities rather than one token with a loose breakpoint.

### 2.4 Visual Motifs & Components
1. **Assembly Blocks Logo:** Custom geometric SVG logo consisting of three connected modular blocks representing knowledge assembly. Radius `0.25rem`, stroke `currentColor`, sized 24px in the header and 32px in the footer.
2. **Concept Flow Pipeline:** Clean 6-step static diagram (`Ideas → Content → Structure → Interaction → Experience → Understanding`) styled with hairline card containers and monospace step indices (`01` to `06`).
3. **No Synthetic Artifacts:** Remove the dummy user avatar profile icon found in the Stitch mockups. Replace with a clean, responsive navigation disclosure and GitHub external link. Per `DESIGN.md` §Shapes, circular avatars are forbidden outright — do not substitute one elsewhere.
4. **Shape discipline:** All controls and badges use `rounded-control` (4px); cards, panels, and the mobile drawer use `rounded-panel` (8px). No pill/stadium shapes.

### 2.5 Known Prototype Deviations (Decisions, Not Oversights)

The Stitch mocks are **not** fully consistent with `DESIGN.md`. Build to `DESIGN.md`; record these so they are not "corrected" back later:

| Deviation | Detail | Decision |
| :--- | :--- | :--- |
| Mockup font | `knowledgeassemble_home`, `_projects`, `_principles`, `_community`, `_about_1` all load **Plus Jakarta Sans**. Only `_about_2` uses IBM Plex Sans. | Use **IBM Plex Sans**. Matches `DESIGN.md` §Typography and PRD §18. Built screens will not pixel-match four of the five mockups. |
| `about_2` palette | `_about_2/code.html` ships a complete Material palette (`#f8f9ff`, `#eceef3`, `#003748`) unrelated to the archival palette. | **Rebuild About from scratch on the §2.2 tokens.** Do not adapt `_about_2` markup. |
| `DESIGN.md` frontmatter | Frontmatter says `surface: '#f8f9ff'` / `background: '#f8f9ff'` (cool blue-grey); the prose at line 155 says `#FBFBF9` (warm paper). | Use **`#FBFBF9`** per the prose, which §2.1 "Archival Rigor" and PRD §17 "warm off-white" both require. |

---

## 3. Information Architecture & Route Specifications

```
/
├── /projects       (Flagship OpenEdu, Knowledge Systems, Experiments)
├── /principles     (7 Core Tenets & architectural axioms)
├── /community      (5 audience tracks: Educators, Developers, Researchers, Families, Contributors)
└── /about          (Core philosophy, Content-Presentation decoupling thesis, Umbrella hierarchy)
```

### 3.1 Route Breakdown

#### 1. Home (`/`)
- **Hero:** "Building open systems for assembling knowledge." + lead narrative + CTAs (`Explore projects` → `/projects`, `GitHub` → external link).
- **Concept Section:** "Knowledge should be able to move." Static 6-step flow pipeline with clear explanations of decoupled knowledge.
- **What We're Building:** 3 cards:
  1. *OpenEdu* (Status: `Active`, Tags: Education, Open Source, Interactive Learning; links to `LINKS.openedu`).
  2. *Knowledge Systems* (Status: `Exploring`, Tags: Formats, Graph, AST; links to `/projects`).
  3. *Experiments* (Status: `Ongoing`, Tags: Prototypes, Canvas; links to `/projects`).
- **Principles Preview:** 4 key tenets (`Open`, `Composable`, `Accessible`, `Human + AI`) with link to `/principles`.
- **Community Preview:** 5 participant segments + CTA to `/community`.
- **Open Source Foundation:** Commitment to open software + official GitHub organization link.

#### 2. Projects (`/projects`)
- **Header:** "Projects" + Framing narrative on exploring different facets of the knowledge ecosystem.
- **Flagship Project:** Detailed spotlight on **OpenEdu** — an open runtime for educational experiences that separates content from delivery platforms (§11.3). Active status, architecture notes, CTA to `LINKS.openedu` (repo) and `LINKS.openeduSite` (live demo).
- **Knowledge Systems Section:** Structured exploration into decoupled formats, AST definitions, and graph engines.
- **Experiments & Prototypes Section:** Small, agile explorations and proof-of-concepts.
- **Umbrella Hierarchy Diagram:** Clear ASCII/SVG structural tree showing how KnowledgeAssemble hosts projects.

#### 3. Principles (`/principles`)
- **Header:** "Principles" + Living canon statement.
- **7 Guiding Axioms** — display numbered `01`–`07`. The `13.x` values below are **PRD section references for traceability only** and are never rendered:
  1. `13.1` Open by default — Open-source software, standards, and publicly auditable systems.
  2. `13.2` Knowledge should be portable — Content decoupled from the rendering application.
  3. `13.3` Composable over monolithic — Small interoperable units instead of walled gardens.
  4. `13.4` Experience matters — True understanding happens through interactive context.
  5. `13.5` Accessibility is foundational — WCAG-compliant design baked into architectures from day one.
  6. `13.6` Human judgment matters — AI as an amplifier; human responsibility for meaning.
  7. `13.7` Build, test, learn — Real-world verification over theoretical speculation.

#### 4. Community (`/community`)
- **Header:** "Build with us." + Open participation narrative (no coding requirement).
- **5 Track Modules:**
  1. *Educators:* Pedagogical models, classroom utility, interactive learning workflows.
  2. *Developers:* Parsing engines, AST protocols, render engines, integrations.
  3. *Researchers:* Accessibility research, cognitive load, learning telemetry.
  4. *Families and Learners:* User testing, lived experience feedback, clarity audits.
  5. *Contributors:* Documentation, translation, code review, design polish.
- **Contribution Channels:** Direct, honest pathways via GitHub Issues, Discussions, and RFC pull requests.

#### 5. About (`/about`)
- **Header:** "About KnowledgeAssemble" + The core premise.
- **The Decoupling Thesis:** Explaining the historical trap of content locked in proprietary database/presentation silos.
- **Umbrella Relationship:** Structural visualization and rationale for hosting OpenEdu alongside future protocols.
- **Long-term Stewardship:** Commitment to public digital goods and open standards.

---

## 4. Technical Architecture & Tech Stack

### 4.1 Core Stack

Pinned to current majors. Versions are exact and must not drift silently.

- **Framework:** `React 19` + `Vite 7`
- **Language:** `TypeScript` (Strict mode enabled, complete type safety)
- **Routing:** `react-router-dom` v7 — **decided, not optional.** See rationale below.
- **Styling:** `Tailwind CSS v4` via `@tailwindcss/vite`, tokens declared as CSS `@theme` (no JS config file)
- **Fonts:** `@fontsource/ibm-plex-sans`, `@fontsource/jetbrains-mono` (self-hosted, bundled)
- **Icons:** Inline accessible SVGs (matching the prototypes' assembly blocks and directional arrows)

**Why `react-router-dom` v7 rather than `wouter`:** V7 is the current major (v6 is unmaintained). It ships `ScrollRestoration`, `NavLink` with `aria-current` built in, and `StaticRouter` — which is why prerendering (§4.2) needed no routing rewrite. `wouter` is ~1kB lighter, which is not worth giving up declarative data routers and static-render compatibility for a 5-page static site.

**Why Tailwind v4 rather than v3:** v4 is CSS-first. Design tokens live in `@theme` in `src/styles/index.css`, which is the single source of truth required by §2.2. There is **no `tailwind.config.ts`** in this project; the previous draft's file tree and Phase 1 task are superseded. The Vite plugin replaces the PostCSS pipeline, so no `postcss.config.js` is needed either.

### 4.2 Rendering Strategy — Prerendered, Then Enhanced

PRD §22 states: *"Do not make accessibility dependent on JavaScript."* The site satisfies this by **prerendering all five canonical routes to static HTML at build time** (gap closure §4, §36). The build pipeline is:

```text
vite build                  → dist/index.html + hashed assets
vite build --ssr …          → dist-ssr/prerender.js (the renderer)
node dist-ssr/prerender.js  → writes dist/index.html and dist/{route}/index.html
```

`src/routes.tsx` is the single source of truth for both the route table and the `prerenderEntries` list; `scripts/prerender.tsx` renders each entry with `react-router-dom`'s `createStaticHandler` / `createStaticRouter` and `renderToStaticMarkup`.

Client-side rendering is retained as the enhancement layer: `src/main.tsx` still calls `createRoot(...).render(<App/>)`, which re-renders the already-present markup and attaches interactivity. `renderToStaticMarkup` is markers-free, so `createRoot` is the correct pairing — not `hydrateRoot`. `index.html` is a minimal Vite template with an empty `#root`; the prerender overwrites it for the homepage.

### 4.3 SEO Metadata Strategy

Each route needs distinct `<title>`, meta description, canonical, and OpenGraph tags, present in the **served HTML** (gap closure §5, §6):

- `src/config/site.ts` exports `siteUrl`, set to the live apex `https://knowledgeassemble.org` (§10 Q3 resolved).
- Each page module exports `const meta: PageMeta = { title, description, canonicalPath }`. The prerender reads it and writes the tags into that route's HTML; `useDocumentMeta` reads the same object for SPA navigation. There is one source of truth, not two.
- `scripts/prerender.tsx` emits title, description, canonical, `og:*`, and `twitter:*` with absolute URLs into each generated page.
- Route-independent fallbacks (favicon, theme-color) live in `index.html`; the OpenGraph/Twitter tags are route-specific and generated per page.
- Canonical and `og:url` are emitted only when `siteUrl` is set and the route has a `canonicalPath`. The not-found route sets `''` and is `noindex`.

### 4.4 Static Host Routing Configuration

The five canonical routes are prerendered to `dist/{route}/index.html`, so a direct request to `/principles` serves real HTML with no rewrite. The deploy uses Vercel's static hosting:

| Host | Config | Behavior |
| :--- | :--- | :--- |
| Vercel | `vercel.json` | `cleanUrls: true`, `trailingSlash: false` — `/principles` serves the prerendered file |
| Static 404 | `dist/404.html` (generated by `scripts/prerender.tsx`) | Served for unknown paths; `noindex`, no canonical |

**Deploy target is Vercel** (§10 Q4). The previous SPA rewrite was removed in the gap-closure pass; a rewrite left in place would serve the homepage for every route and defeat the prerender. If the host changes, `cleanUrls` + static-404 behavior must be reproduced.

### 4.5 Workspace File Structure

```text
knowledgeassemble.org/
├── docs/
│   ├── KNOWLEDGEASSEMBLE-WEBSITE-V1.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── stitch_knowledgeassemble_website_v1/
├── public/
│   ├── 404.html                       # Static noindex 404 (§4.4)
│   ├── favicon.svg
│   ├── og-image.png
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   └── prerender.tsx                  # Static renderer for the five routes (§4.2)
├── src/
│   ├── config/
│   │   ├── links.ts                   # Centralized external URLs (verified, see §5.1)
│   │   └── site.ts                    # siteUrl, titles, descriptions, PageMeta
│   ├── content/
│   │   ├── projects.ts                # Project data & taxonomy
│   │   ├── principles.ts              # 7 Principles content & metadata
│   │   ├── community.ts               # 5 Community tracks & involvement pathways
│   │   └── about.ts                   # About copy & structural manifesto
│   ├── hooks/
│   │   └── useDocumentMeta.ts         # Per-route title/meta/canonical/OG (§4.3)
│   ├── types/
│   │   ├── index.ts                   # Project, Principle, Community, PageMeta types
│   │   └── env.d.ts                   # Vite client types
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SiteHeader.tsx         # Quiet header, responsive disclosure
│   │   │   ├── SiteFooter.tsx         # Architectural footer
│   │   │   ├── PageContainer.tsx      # Max-width container (see §4.6)
│   │   │   └── SkipLink.tsx           # Keyboard bypass link (§6.1)
│   │   ├── common/
│   │   │   ├── Button.tsx             # Primary, Outline, Ghost variants
│   │   │   ├── Badge.tsx              # JetBrains Mono technical pills
│   │   │   ├── Logo.tsx               # Assembly blocks SVG logo
│   │   │   ├── ExternalLink.tsx       # Accessible link + north_east arrow
│   │   │   ├── Section.tsx            # Landmark section wrapper
│   │   │   └── SectionHeading.tsx     # Consistent section title/lede
│   │   └── sections/
│   │       ├── KnowledgeFlow.tsx      # 6-step static concept pipeline
│   │       ├── ProjectCard.tsx        # Standardized project presentation
│   │       ├── PrincipleCard.tsx      # Detailed principle breakdown
│   │       └── CommunityCard.tsx      # Community track card
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── PrinciplesPage.tsx
│   │   ├── CommunityPage.tsx
│   │   ├── AboutPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── styles/
│   │   └── index.css                  # @theme tokens, base layer, reduced-motion reset
│   ├── routes.tsx                     # Shared route table + prerender entries (§4.2)
│   ├── App.tsx                        # Client router (createBrowserRouter)
│   └── main.tsx                       # React root entry, fontsource imports
├── .gitignore                         # committed ✓
├── index.html
├── LICENSE                            # MIT — committed ✓
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts                     # react() + tailwindcss() + preview clean URLs
├── vercel.json                        # cleanUrls + static 404 (see §4.4)
└── README.md                          # Prerendered delivery, deploy target (§4.2)
```

**Removed from the previous draft:** `tailwind.config.ts`, `postcss.config.js` (Tailwind v4 needs neither), `og-image.png` without a generating step (now Phase 6).

**Added:** `SkipLink.tsx`, `Section.tsx`, `SectionHeading.tsx` (both from PRD §34), `useDocumentMeta.ts`, `types/env.d.ts`, `tsconfig.node.json`, `.gitignore`, `README.md`, `vercel.json`.

**Re-added in the gap-closure pass:** `public/404.html`, as the static 404 for unknown deep links (§4.4). The SPA rewrite was removed and the five routes are prerendered (§4.2).

**Already committed (2026-10-05):** `.gitignore`, `LICENSE` (MIT). The tree root is `knowledgeassemble.org/`, matching the repo name.

### 4.6 Layout Container

`PageContainer` uses **`max-w-[1280px]`**, matching `DESIGN.md` §Layout Philosophy ("max-width `1280px` centered"). The previous draft's `max-w-6xl` (1152px) was narrower than the design system specifies. Horizontal gutters: 1rem mobile, 1.5rem and up (`DESIGN.md` spacing `gutter-mobile` / `gutter`). Outer page padding `space-lg`, section rhythm `space-lg`→`space-xl`.

---

## 5. Content Architecture & Static Configurations

### 5.1 Link Registry (`src/config/links.ts`)

URLs below were **verified against the live KnowledgeAssemble GitHub organization** and are no longer placeholders. PRD §26: *"The actual KnowledgeAssemble GitHub/OpenEdu URLs should be confirmed from the project configuration rather than invented."*

```typescript
export const LINKS = {
  // Verified against github.com/KnowledgeAssemble — see §10 Q1 (resolved).
  githubOrg: "https://github.com/KnowledgeAssemble",
  githubRepo: "https://github.com/KnowledgeAssemble/knowledgeassemble.org", // this repo

  // OpenEdu flagship. Repo is the canonical artifact; the Pages site is its
  // published demo. Note the hyphen: the org has several similarly named
  // repos (open-edu, open-edu-interactive, openedu-library, open-edu-pipeline).
  openedu: "https://github.com/KnowledgeAssemble/open-edu",
  openeduSite: "https://knowledgeassemble.github.io/open-edu/",
} as const;
```

**Correction from the previous draft.** It listed `github.com/knowledgeassemble` (lowercase, wrong owner) and `openedu.org`. The `.org` domain does not resolve at all; it was an invented placeholder and has been removed. The canonical OpenEdu destination is the `open-edu` repository, with its GitHub Pages deployment as the public-facing site.

**Org naming:** the GitHub org was renamed from `KnowledgeAssembly` to `KnowledgeAssemble` on 2026-10-06, so the org and the brand now match. The old handle does not resolve and redirects do not save it — `knowledgeassembly.github.io` 404s while `knowledgeassemble.github.io/open-edu/` returns 200. GitHub keeps the org id stable across a rename (still `312102580`), so this is the same organization, not a successor.

**This repository is public and MIT-licensed.** The repo is named `knowledgeassemble.org` to match the production domain, so `gh api repos/KnowledgeAssemble/knowledgeassemble.org` and a bare `curl` both return 200. License and visibility questions are closed (§10 Q2, Q6).

**The repo name is a URL, not a typo.** It matches the production domain `knowledgeassemble.org`, which is **registered and live** (§10 Q3 resolved). Do not "normalize" it to `knowledgeassemble-website`. Note that the repo name (`knowledgeassemble.org`) and the org (`KnowledgeAssemble`) are two distinct strings — verify each against this registry rather than assuming they match.

**`LINKS` contains no self-link.** `githubRepo` is the repository; the deployed site URL is a separate concern owned by `siteUrl` (§4.3), since it is unresolved until the domain is registered. Do not add a `site` entry to `LINKS` that duplicates it.

Every consumer imports from `LINKS`. A `rg -n 'https?://' src/` check in Phase 11 must return matches only in this file and `src/config/site.ts`, which owns the site's own origin (§4.3) — test files hold fixtures and are out of scope. PRD §26 forbids scattered URLs, and §8 makes this a Definition-of-Done item.

### 5.2 Content Typings (`src/types/index.ts`)

```typescript
export type ProjectStatus = 'Active' | 'Exploring' | 'Ongoing';

export interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  version?: string;
  categories: string[];
  externalUrl?: string;
  isFlagship?: boolean;
}

export interface PrincipleItem {
  id: string;
  number: string;        // "01".."07" — THIS is what renders
  sectionNumber: string; // "13.1" — PRD traceability only. NEVER rendered.
  title: string;
  summary: string;
  body: string[];
}

export interface CommunityTrack {
  id: string;
  role: string;
  tagline: string;
  contributions: string[];
  suggestedAction: string;
}

export interface PageMeta {
  title: string;          // "Principles — KnowledgeAssemble"
  description: string;    // 120–160 chars, from PRD copy
  canonicalPath: string;  // "/principles" — resolved to absolute via site.siteUrl
}
```

**`sectionNumber` is documented in-code as non-rendering.** `13.1 Open by default` is a PRD section number; surfacing it to visitors produces meaningless numbering. Display is `01`–`07` only.

---

## 6. Accessibility & Responsiveness Strategy

Target: **WCAG 2.1 AA**, with the specific 2.2 additions noted. Every claim below is verified against measured contrast ratios in §2.2.

### 6.1 Accessibility Requirements

- **Language:** `<html lang="en">` on `index.html`.
- **Skip link:** `SkipLink.tsx` is the first focusable element in `DOM` order, visually hidden until focused, then visible per `DESIGN.md` focus treatment. Required — the previous draft omitted it while claiming correct document structure.
- **Semantic Structure:** `<header>`, `<main>`, `<section>`, `<footer>`, sequential `<h1>`→`<h3>`. `Section.tsx` renders `<section aria-labelledby={headingId}>`.
- **Focus Management:** 2px offset focus ring on every interactive element, using the token — never an arbitrary hex:
  ```tsx
  className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
  ```
  In Tailwind v4, `outline-*` is the correct primitive for focus rings (`ring-*` applies `box-shadow`, which is easily clipped by `overflow`).
- **Non-text contrast:** interactive component boundaries use `border-rule-interactive` (`#8C8C82`, 3.28:1). `--color-rule-strong` is decorative-only — see §2.2 item 2.
- **Mobile Menu Accessibility:**
  - `<button aria-expanded={open} aria-controls="site-mobile-menu">`
  - `Escape` key closes the drawer
  - Focus is moved into the drawer on open, trapped while open, and returned to the toggle on close
  - The menu is removed from the DOM (not just hidden) when closed, so it is out of the tab order
  - Toggle meets a 44×44px hit area (§6.3)
- **Color Contrast:** verified in §2.2. `--color-ink` 15.96:1 (AAA), `--color-ink-secondary` 6.63:1 (AA), `--color-ink-tertiary` 5.04:1 (AA on all four surfaces), `--color-accent` 8.80:1 (AAA). Tertiary was darkened from `#737A84` because it failed AA at every surface.
- **Reduced Motion:** a global reset in `index.css` — not Tailwind variant sprinkling:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
  The previous draft cited `motion-safe:`/`motion-reduce:` variants, which is not a reduced-motion strategy. All optional motion is implemented with CSS transitions guarded by this reset.
- **Meaningful link labels:** icon-only links (GitHub, external arrows) carry `aria-label` or visually-hidden text. Arrow glyphs are `aria-hidden="true"`.
- **Decorative SVG:** `aria-hidden="true" focusable="false"`; meaningful SVG gets `role="img"` + `<title>`.

### 6.2 Structural Markup Baseline

Each canonical route is prerendered to static HTML at build time, so the served document already contains the full site — header, `<main id="main-content">`, sections, footer — with no JavaScript. `index.html` is only the Vite entry template: it has an empty `#root` and no route content. `#root` is empty in the template but filled in every built `dist/{route}/index.html`.

This replaces the former `<noscript>` shell, which the prerendered HTML makes redundant. Asserted by `tests/e2e/prerender.spec.ts`, `tests/e2e/nojs.spec.ts`, and `src/test/guards.test.ts`.

### 6.3 Touch Targets

The previous draft omitted these entirely despite PRD §22 requiring them.

- Minimum **24×24 CSS px** — WCAG 2.2 AA, SC 2.5.8 *Target Size (Minimum)*.
- **44×44px** for all primary interactive elements (nav links, menu toggle, footer links, card CTAs) — WCAG 2.1 AAA, SC 2.5.5. Adopted as the project standard for comfortable mobile use.
- Inline text links within prose are exempt (SC 2.5.8 has an inline exception).

### 6.4 Responsive Viewport Verification

PRD §23 list, plus the two intermediate widths that catch real breakpoints:

| Class | Widths |
| :--- | :--- |
| Mobile | `320px`, `375px`, `414px` |
| Tablet | `768px`, `834px` |
| Desktop | `1024px`, `1280px`, `1440px` |

- The concept flow pipeline reflows from 6 horizontal cards on desktop → 2-column at `768px` → single-column stacked with visible directional indicators at `375px` and below. Narrow layout is a genuine reflow, not a shrunken desktop grid (PRD §23).
- The umbrella hierarchy diagram must stay legible at `320px`: the ASCII tree switches to a nested-card layout below `768px` rather than horizontally scrolling.

---

## 7. Phased Implementation Roadmap

This sequence follows PRD §33 — *"Do not start by building a design system. Create only the primitives actually required by the V1 pages."* It therefore **reverses the previous draft**, which pre-built Button, Badge, Logo, and ExternalLink in Phase 2 before any page existed.

```
Phase 1: Repo Setup & Scaffolding (LICENSE + repo already public/MIT)
   ↓
Phase 2: Routing Shell + Static Host Config
   ↓
Phase 3: Design Tokens & Base Styles (CSS only, no component library)
   ↓
Phase 4: Layout Primitives — built on demand per page
   ├── Header, Footer, PageContainer, SkipLink
   ├── Home Page & Concept Pipeline  → yields Button, Badge, Section, SectionHeading
   ├── Projects Page                 → yields ProjectCard
   ├── Principles Page               → yields PrincipleCard
   ├── Community Page                → yields CommunityCard
   └── About Page & Hierarchy Tree
   ↓
Phase 5: Content Layer (TypeScript data files, verbatim from PRD; links per §5.1)
   ↓
Phase 6: Brand & Social Assets (favicon, OG image)
   ↓
Phase 7: Metadata Wiring (useDocumentMeta, canonical, OG)
   ↓
Phase 8: Accessibility Audit
   ↓
Phase 9: Responsive Pass
   ↓
Phase 10: SEO & Performance Pass
   ↓
Phase 11: Build, Deploy Target Verification & Definition of Done
```

Content data files land in Phase 5, after the shell renders, so page structure is proven against real shapes rather than assumed ones.

### Detailed Phase Tasks

#### Phase 1: Licensing, Repo Setup & Scaffolding
- **`LICENSE` is already done.** MIT, © 2026 KnowledgeAssembly, committed at the repo root and made public on 2026-10-05 — the holder line was updated to `KnowledgeAssemble` on 2026-10-06 alongside the org rename. The site asserts "Open source, by default" (PRD §10) and PRD §16 requires an open-source identity, so this was treated as a blocker rather than a nicety. Remaining Phase 1 licensing work: declare `"license": "MIT"` in `package.json`, and add the footer license line in Phase 4.
- Initialize React 19 + TypeScript strict + Vite 7 workspace.
- Install: `tailwindcss`, `@tailwindcss/vite`, `react-router-dom`. **No PostCSS, no autoprefixer** — the Vite plugin replaces it.
- Install `@fontsource/ibm-plex-sans`, `@fontsource/jetbrains-mono` (self-hosted; no Google Fonts link).
- Add `.gitignore`, `README.md` (deploy target + §4.2 no-JS note), `tsconfig.node.json`.
- Confirm `strict: true` and `noUncheckedIndexedAccess: true` in `tsconfig.json`.

#### Phase 2: Routing Shell & Static Host Configuration
> Superseded by the gap-closure pass. The route table now lives in
> `src/routes.tsx` (shared by the client router and the prerender), `index.html`
> is a minimal template with an empty `#root`, and there is no `<noscript>`
> shell — the prerendered document *is* the no-JS document. `vercel.json` uses
> `cleanUrls`, not a rewrite. See §4.5 for the delivered arrangement.
- Define the 5 routes + `NotFoundPage` in `src/routes.tsx`, with `App.tsx` consuming it via `createBrowserRouter`; add `ScrollRestoration`.
- Commit the host config from §4.4 for the chosen deploy target — `vercel.json` for Vercel (§10 Q4).
- Keep `index.html` a minimal template (`lang="en"`, `#root`, module script). Do **not** add a `<noscript>` fallback: the prerender in `scripts/prerender.tsx` writes the full document, so a shell would render twice for no-JS visitors.
- Verify `npm run dev` serves all routes and that a hard refresh on `/principles` does not 404.

#### Phase 3: Design Tokens & Base Styles
- Declare all §2.2 tokens in `@theme` in `src/styles/index.css`. This is the **single source of truth** for color.
- Declare the §2.3 typography scale as `--text-*` / `--font-*` tokens; add `--radius-control` / `--radius-panel`.
- Add the §6.1 reduced-motion reset, base focus-visible treatment, and `border-color` defaults.
- Define the shared focus-ring utility class so every component inherits the same treatment.
- **Verify:** no component file contains a hex literal or an arbitrary color value (`ring-[#…]`, `bg-[#…]`).

#### Phase 4: Layout Primitives & Pages (on demand)
- `SkipLink`, `SiteHeader` (brand, desktop links, GitHub link, accessible disclosure), `SiteFooter`, `PageContainer` (`max-w-[1280px]`, §4.6).
- **Home:** Hero, `KnowledgeFlow` 6-step pipeline, 3 project cards, principles preview, community preview, open-source CTA.
- **Projects:** OpenEdu spotlight with feature tags, Knowledge Systems, Experiments, umbrella hierarchy tree.
- **Principles:** 7 cards numbered `01`–`07`, hairline borders, rationale copy.
- **Community:** 5 track cards with involvement avenues and GitHub issue/discussion links.
- **About:** Decoupling thesis, umbrella tree, OpenEdu relationship — rebuilt on §2.2 tokens per §2.5, not adapted from `_about_2`.
- Extract `Button`, `Badge`, `ExternalLink`, `Logo`, `Section`, `SectionHeading`, and the card components **at the point each is first needed**. Do not pre-build.

#### Phase 5: Content Layer
- `src/config/links.ts` using the verified URLs in §5.1 — no placeholders — and `src/config/site.ts` (incl. `siteUrl`, pending §10 Q3).
- Populate `src/content/{projects,principles,community,about}.ts` from PRD copy **verbatim** — headings, intros, and CTAs are already written in PRD §5–15. No paraphrase, no invented metrics.
- Verify every PRD heading string appears on the corresponding page.

#### Phase 6: Brand & Social Assets
- Generate `public/favicon.svg` (assembly blocks, `DESIGN.md` palette, 4px radius).
- Generate `public/og-image.png` at 1200×630 using the §2.2 palette and IBM Plex Sans. **The previous draft listed this file with no task to produce it.**
- Add `public/robots.txt` allowing all crawlers and pointing at the sitemap if one is added.

#### Phase 7: Metadata Wiring
- Implement `useDocumentMeta` (§4.3) and export `meta` from all 6 page modules.
- `siteUrl` is set to the live apex `https://knowledgeassemble.org` (§10 Q3 resolved). Page titles and meta descriptions come from PRD §27:
  - Homepage title: `KnowledgeAssemble — Open Systems for Knowledge`
  - Homepage description: `KnowledgeAssemble builds open-source tools and systems for creating, connecting, exploring, and sharing knowledge.`
- Wire static OG/favicon/theme-color fallbacks in `index.html`.
- **Verify:** each of the 5 routes produces a distinct `document.title`, meta description, absolute canonical, and `og:url`.

#### Phase 8: Accessibility Audit
- Run **Lighthouse** accessibility audit and **axe DevTools** against every route; resolve all `serious` and `critical` violations.
- Keyboard-only pass: tab through every route, operate the mobile drawer (open → tab → `Escape` → focus returns to toggle), confirm the skip link is first.
- Verify heading hierarchy per route with a browser a11y tree, confirming exactly one `<h1>`.
- Verify all interactive boundaries use `border-rule-interactive`, and re-check the §2.2 contrast table in-browser.
- Test with OS-level reduced motion enabled.
- Check with a screen reader (VoiceOver) on at least Home and Community.

#### Phase 9: Responsive Pass
- Verify all 8 widths in §6.4 with browser devtools, including `320px`.
- Confirm the `KnowledgeFlow` and umbrella-tree reflows per §6.4.
- Verify no horizontal overflow at any width (`document.documentElement.scrollWidth <= clientWidth`).
- Verify tap targets meet §6.3.

#### Phase 10: SEO & Performance Pass
- Confirm canonical, OG, and Twitter tags resolve to absolute URLs.
- Check heading hierarchy and internal link text for SEO sanity.
- Run Lighthouse performance; confirm fonts are self-hosted (zero third-party requests) and no layout shift from font loading (`font-display: swap` via fontsource).
- Confirm no unused CSS/JS shipped.

#### Phase 11: Build, Deploy Target Verification & Definition of Done
- `npm run build` and `npx tsc --noEmit` — zero errors, zero warnings.
- `npm run preview`, then re-verify all 5 routes plus a hard refresh on a deep link against the **production** build.
- `rg -n 'https?://' src/` returns matches only in `src/config/links.ts` and `src/config/site.ts` (the deployed origin); test files are out of scope.
- External link check: every URL in `LINKS` resolves (HTTP 200/301). All four are public, so plain `curl -L` is sufficient — no authenticated checks needed (§5.1).
- Confirm no console errors on any route.
- Copy review against PRD §30 and §36: no SaaS language, no exaggerated claims, no manufactured scale/community/products.
- Deploy to the chosen host and verify SPA rewrites work in production.

---

## 8. Definition of Done Checklist

The final four items in the Technical block are carried over from PRD §32 and were missing entirely from the previous draft.

### Content
- [ ] Home, Projects, Principles, Community, and About pages fully implemented.
- [ ] Every PRD §5–15 heading string present verbatim.
- [ ] OpenEdu correctly positioned as KnowledgeAssemble's first project.
- [ ] No fake metrics, fictional testimonials, or phantom SaaS features.

### Legal & Licensing
- [x] `LICENSE` present at repo root (MIT, © 2026 KnowledgeAssemble).
- [ ] `package.json` declares `"license": "MIT"` — Phase 1.
- [ ] Footer names the license — Phase 4.
- [ ] All external URLs in `LINKS` resolve (HTTP 200/301) and point at the correct `KnowledgeAssemble` repos per §11.2 — no invented domains, no `openedu.org`.

### Design Alignment
- [ ] Warm paper canvas (`#FBFBF9`), charcoal ink (`#1C1F23`), mineral accents (`#164E63`, `#2D5A46`).
- [ ] Hairline 1px borders (`#E2E2DC`), no drop shadows, no gradients.
- [ ] No hex literals or arbitrary color values outside `src/styles/index.css`.
- [ ] Custom assembly blocks mark used as brand logo; radii are 4px/8px with no pill shapes or circular avatars.
- [ ] Static 6-step knowledge flow pipeline implemented on home page.
- [ ] Prototype deviations in §2.5 applied as specified, not "corrected" back to Plus Jakarta Sans or the `about_2` palette.

### Accessibility & Responsiveness
- [ ] Verified rendering at all 8 widths in §6.4, `320px` included.
- [ ] Skip link is the first focusable element and is visible on focus.
- [ ] Visible, accessible focus rings on all interactive elements, using `outline-accent`.
- [ ] Valid ARIA on the mobile drawer disclosure; focus trap, `Escape`, and focus return all verified.
- [ ] Exactly one `<h1>` per route; heading hierarchy sequential.
- [ ] Interactive boundaries use `border-rule-interactive` (≥3:1, WCAG 1.4.11).
- [ ] WCAG AA contrast verified against the §2.2 measured table in-browser.
- [ ] `prefers-reduced-motion` honored via the global reset.
- [ ] Tap targets meet §6.3 (24px AA minimum, 44px for primary controls).
- [ ] Screen-reader pass completed on at least Home and Community.

### Technical
- [ ] Clean Vite production build with zero warnings; `tsc --noEmit` passes with 0 errors.
- [ ] Zero external runtime requests for fonts or UI kits (self-hosted via fontsource).
- [ ] All external links driven by centralized configuration; `rg` check confirms no scattered URLs.
- [ ] Metadata present: distinct `<title>`, description, canonical, and `og:` tags on all 5 routes.
- [ ] No console errors on any route.
- [ ] No broken routes — deep-link hard refresh verified against the production build on the deploy target.
- [ ] All five canonical routes produce meaningful HTML at build time (gap closure §4).
- [ ] Vercel static-hosting config (`cleanUrls`) and `public/404.html` committed (§4.4).
- [ ] `README.md`, `AGENTS.md`, and this plan describe prerendered delivery — no stale CSR exception.

### Quality
- [ ] Lighthouse accessibility audit run on all routes; no serious or critical violations.
- [ ] axe DevTools run on all routes; clean.
- [ ] Keyboard-only navigation tested on every route.
- [ ] Reduced-motion behaviour tested with OS setting enabled.
- [ ] Copy reviewed against PRD §30 tone and §36 anti-manufacturing principles.

---

## 9. Explicit Non-Goals

Reinforcing PRD §31: no accounts, auth, CMS, blog engine, comments, newsletter, search, localization, complex animations, dark/light theme switching, AI chatbot, contact forms requiring a backend, project dashboards, GitHub API integration, or dynamic project fetching.

---

## 10. Open Questions

### 10.1 Resolved

| # | Question | Resolution |
| :--- | :--- | :--- |
| 1 | **External URLs** for the GitHub org, this repo, OpenEdu repo, and OpenEdu site | Verified against the live org. `github.com/KnowledgeAssemble`; this repo at `KnowledgeAssemble/knowledgeassemble.org`; OpenEdu at `KnowledgeAssemble/open-edu` with its Pages site at `knowledgeassemble.github.io/open-edu/`. The invented `openedu.org` domain was removed — it does not resolve. Re-verified after the org rename on 2026-10-06. Recorded in §5.1. |
| 2 | **License choice** | **MIT**, `LICENSE` committed at repo root (2026-10-05), copyright holder `KnowledgeAssemble`. Must be mirrored in `package.json` (`"license": "MIT"`) and named in the site footer (Phase 1, Phase 4). | Resolved |
| 3 | **Domain registration + deployed origin** for `siteUrl` | Registered and live at the apex **`https://knowledgeassemble.org`** on Vercel (2026-10-05). `www` does not resolve. `siteUrl` is set, so canonical and `og:url` are absolute on every route. |
| 4 | **Deploy target** | **Vercel.** `vercel.json` uses `cleanUrls` with `trailingSlash: false`; the five routes are prerendered static files and `dist/404.html` is the static 404. Verified in production. |
| 5 | **Is CSR acceptable** given PRD §22? | **Superseded by prerendering.** All five canonical routes produce meaningful HTML at build time (gap closure §4, §22); client-side JavaScript only enhances. |
| 6 | **Website repo visibility** | **Public.** Confirms PRD §10 "open source, by default" and §16. The footer's GitHub CTA can point at `LINKS.githubRepo`. | Resolved |

### 10.2 Still Open

| # | Question | Blocks | Default if unanswered |
| :--- | :--- | :--- | :--- |
| 7 | Contact link in footer — include only if a real destination exists (PRD §11; do not invent an email) | Phase 4 — footer contents | Omit |

**Q3 resolved 2026-10-05.** `knowledgeassemble.org` is registered and live at the apex on Vercel; `https://knowledgeassemble.org/principles` returns 200. `www` does not resolve; if it is ever added it must 301 to the apex rather than be treated as a second canonical host. `siteUrl` in `src/config/site.ts` is set, so canonical and `og:url` are absolute on every route.

**Q4 resolved 2026-10-05.** Deploy target is Vercel. After the gap-closure pass, `vercel.json` uses `cleanUrls` and the routes are prerendered static files with a static `404.html`; the SPA rewrite was removed. A host change requires reproducing that static-hosting behavior.

---

## 11. Verified External Context

Facts confirmed against the live `KnowledgeAssemble` GitHub org and `open-edu` repository. Recorded so later phases do not re-derive or re-guess them.

### 11.1 Organization

- Org `KnowledgeAssemble` (id `312102580`), created 2026-08-02. **Renamed from `KnowledgeAssembly` to `KnowledgeAssemble` on 2026-10-06.** The org handle and the brand spelling now match; the old handle does not resolve.
- The website repo `KnowledgeAssemble/knowledgeassemble.org` was created 2026-10-05, is **public**, and is **MIT-licensed**. It is named for the production domain `knowledgeassemble.org`, so the repo (`knowledgeassemble.org`) and the org (`KnowledgeAssemble`) remain two distinct strings.
- Remote repo directory is `KnowledgeAssemble/knowledgeassemble.org`, matching the repo name. The path contains a dot, which is fine for Git and Vite but worth knowing when scripting.
- A **local** clone of that repo may still sit in a directory named after the pre-rename project (e.g. `knowledgeassemble-website`) — `git remote -v` is the authority, not the local folder name.

### 11.2 OpenEdu Repos — Disambiguation Required

The org contains several similarly named repositories. `open-edu` is the flagship framework; the others are adjacent projects and must **not** be linked from the site.

| Repo | Visibility | Description | Use on site |
| :--- | :--- | :--- | :--- |
| `KnowledgeAssemble/open-edu` | public | Open-Edu Framework: an open runtime for portable, accessible educational experiences | **Yes — this is OpenEdu** |
| `KnowledgeAssemble/open-edu-interactive` | public | (no description) | No |
| `KnowledgeAssemble/openedu-library` | public | (no description) | No |
| `KnowledgeAssemble/open-edu-pipeline` | public | (no description) | No |
| `KnowledgeAssemble/openedu-geo-assets` | private | India Geo Assets pipeline: topojson boundary/point/river/lake assets | No |

The name contains a **hyphen** (`open-edu`). The previous draft's `openedu` (no hyphen) did not exist.

### 11.3 OpenEdu Facts Usable as Accurate Copy

Verified from the `open-edu` README, so site copy describes the real project:

- **Positioning:** "An open runtime for educational experiences that separates content from delivery platforms." This is the same decoupling thesis as PRD §15, so `/about` and `/projects` can reference it truthfully.
- **Format:** Learning packages are Markdown + JSON, validated and rendered through a configurable runtime, distributed as `.oep` files.
- **Accessibility:** Built-in accessibility and telemetry are part of the runtime, supporting PRD §13.5 (accessibility as foundational) with a real example.
- **Live demo:** `https://knowledgeassemble.github.io/open-edu/` returns HTTP 200 — verified suitable as the `openeduSite` CTA target. Re-verified after the org rename; the old `knowledgeassembly.github.io` host now 404s.

Do **not** claim OpenEdu features the repo does not have, and do not describe it as a product with users or scale (PRD §36: do not manufacture products, community, or scale).

### 11.4 OpenEdu Design System — Deliberate Divergence

`open-edu/DESIGN.md` is a **different** system from the `assembled_knowledge_framework/DESIGN.md` used by this site:

| | OpenEdu runtime | This site |
| :--- | :--- | :--- |
| Typeface | Inter | IBM Plex Sans + JetBrains Mono |
| Background | `#ffffff` | `#FBFBF9` |
| Structure | Material-derived purple/blue (`#6750a4` tertiary) | Archival charcoal + mineral accents |
| Themes | 3 (Light, Dark, Zen) | 1 (light only) |

PRD §16 requires the site to feel "related to OpenEdu but not identical." **Do not inherit OpenEdu's tokens.** This site uses `assembled_knowledge_framework/DESIGN.md` per §2. The relationship is conceptual — shared decoupling thesis and accessibility commitment — not visual.

Note also that OpenEdu's stack is React 18 / Vite 5 / Tailwind 3 / pnpm (§4.1 of its `AGENTS.md`), while this plan pins React 19 / Vite 7 / Tailwind 4 (§4.1). That divergence is intentional: the website is standalone and follows current majors. If shared components are ever needed across the two, revisit.
