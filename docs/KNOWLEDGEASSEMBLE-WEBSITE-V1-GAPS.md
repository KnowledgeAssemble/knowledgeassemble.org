# KnowledgeAssemble Website V1 — Gap Closure Specification

**Status:** Ready for implementation
**Date:** 2026-10-05
**Scope:** Review and close remaining V1 gaps on `knowledgeassemble.org`
**Repository:** `KnowledgeAssembly/knowledgeassemble.org`
**Production:** `https://knowledgeassemble.org`

---

# 1. Purpose

This document defines the remaining work required to take the KnowledgeAssemble website from the current V1 implementation to a **strong, production-ready public V1**.

This is a **gap-closure specification**, not a redesign.

The current site already has:

* five primary routes
* established visual identity
* responsive layouts
* accessibility testing
* SEO metadata infrastructure
* canonical URL infrastructure
* sitemap
* robots.txt
* Open Graph/Twitter metadata
* self-hosted fonts
* design-token guards
* automated tests
* CI
* public MIT-licensed repository

Do **not** rebuild these systems unnecessarily.

The goal now is to identify and close the remaining gaps between:

```text
Current V1
    ↓
Publicly credible organization website
    ↓
KnowledgeAssemble V1 complete
```

---

# 2. Current assessment

## 2.1 Overall assessment

Current implementation is approximately:

> **Strong technical V1, but not yet an ideal public-web V1.**

The implementation has been unusually thorough around internal constraints and automated verification.

The remaining gaps are primarily:

1. public HTML delivery / prerendering
2. crawler and social-preview correctness on deep routes
3. actual public-content discoverability
4. production verification of all canonical routes
5. content clarity and organization positioning
6. repository/site consistency
7. final human-facing polish

---

# 3. Priority model

Use the following priority levels.

## P0 — Must fix before calling V1 complete

Issues that materially affect the public site's correctness, discoverability, accessibility, or credibility.

## P1 — Should fix for V1

Important quality improvements that make the site substantially better but do not invalidate the site.

## P2 — Nice to have

Useful improvements that should not delay V1.

## P3 — Explicitly defer

Potential future work that should **not** be implemented during this gap-closure phase.

---

# 4. P0 — Replace CSR-only public content with prerendered HTML

## Problem

The production HTML currently exposes only the application shell to non-JavaScript clients.

The live page currently contains:

```text
KnowledgeAssemble

This site is a JavaScript application, so its pages need JavaScript enabled.

You can browse our work on GitHub instead.
```

This is not the intended public experience.

The repository currently documents this as an accepted V1 deviation.

That decision should now be revisited.

---

## Why this matters

KnowledgeAssemble is a public organizational website.

Its primary content should be available as HTML to:

* search engines
* social crawlers
* link-preview systems
* accessibility tools
* browsers with JavaScript disabled
* text-only clients
* future indexing systems
* archival systems

The organization also explicitly claims:

> Open
> Accessible
> Portable

The website should demonstrate those principles.

---

## Required solution

Evaluate and implement static prerendering for all canonical routes.

Preferred V1 approach:

```text
React
+
Vite
+
react-router
+
static generation / prerendering
```

The site does not need SSR infrastructure.

It only needs the five public routes generated into HTML at build time.

Routes:

```text
/
 /projects
 /principles
 /community
 /about
```

Not-found handling must remain separate.

---

## Important constraint

Do NOT migrate the entire site to Next.js merely to solve this problem.

Do NOT introduce a backend.

Do NOT introduce runtime SSR infrastructure.

The site is fundamentally static.

Prefer the smallest change that provides:

```text
source
  ↓
build
  ↓
HTML per route
  ↓
Vercel static deployment
```

---

## Acceptance criteria

With JavaScript disabled:

### `/`

Must expose:

* site name
* hero heading
* hero description
* primary CTA
* major homepage sections
* OpenEdu
* principles
* footer

### `/projects`

Must expose:

* Projects heading
* OpenEdu
* Knowledge Systems
* Experiments
* project descriptions
* external links

### `/principles`

Must expose:

* Principles heading
* all seven principles

### `/community`

Must expose:

* Community heading
* audience groups
* contribution information

### `/about`

Must expose:

* About heading
* KnowledgeAssemble explanation
* OpenEdu relationship
* organization philosophy

---

## Verification

Run:

```bash
npm run build
npm run verify
```

Then run production server.

Use a browser with JavaScript disabled.

Assert:

```text
document.body.innerText
```

contains the actual route content.

Do not accept:

```text
"This site is a JavaScript application..."
```

as the primary no-JS experience.

---

# 5. P0 — Deep-route HTML correctness

Prerendering must not only make `/` work.

Verify every canonical route independently.

Test:

```text
https://knowledgeassemble.org/
https://knowledgeassemble.org/projects
https://knowledgeassemble.org/principles
https://knowledgeassemble.org/community
https://knowledgeassemble.org/about
```

For each route verify:

* HTTP success
* correct HTML
* correct `<title>`
* correct `<meta name="description">`
* correct canonical URL
* correct `og:title`
* correct `og:description`
* correct `og:url`
* correct `og:image`
* correct Twitter metadata
* exactly one `<h1>`
* meaningful page content without JavaScript

---

# 6. P0 — Re-evaluate runtime metadata architecture

The current site injects canonical and route metadata at runtime.

This was necessary because the current Vercel SPA rewrite maps every route to `index.html`.

Once prerendering exists, route metadata should preferably become part of the generated HTML.

Required outcome:

```html
<link
  rel="canonical"
  href="https://knowledgeassemble.org/projects"
/>
```

must exist in the server-delivered HTML for `/projects`.

Similarly:

```html
<meta property="og:url" content="https://knowledgeassemble.org/projects">
```

must exist in the initial HTML.

---

## Constraint

Do not maintain two independent metadata systems.

There must remain one source of truth.

Preferred architecture:

```text
page metadata
      ↓
route/page configuration
      ↓
prerender
      ↓
HTML
```

Client-side metadata management can remain only if it is necessary for SPA navigation.

---

# 7. P0 — Production crawler verification

After prerendering, verify the actual production domain rather than only the local build.

For every route:

```text
curl -L https://knowledgeassemble.org/
curl -L https://knowledgeassemble.org/projects
curl -L https://knowledgeassemble.org/principles
curl -L https://knowledgeassemble.org/community
curl -L https://knowledgeassemble.org/about
```

The returned HTML must contain real page content.

Do not use browser rendering as the only verification.

---

# 8. P0 — Verify sitemap against generated routes

The repository already contains a sitemap listing five canonical routes.

Keep exactly:

```text
/
 /projects
 /principles
 /community
 /about
```

Verify:

* all five exist
* all five resolve
* all five contain real HTML
* no noncanonical route appears
* no route has accidental duplicate slash
* sitemap uses the apex domain
* sitemap remains valid XML

Do not add speculative URLs.

---

# 9. P0 — Verify robots.txt

Required:

```text
User-agent: *
Allow: /

Sitemap: https://knowledgeassemble.org/sitemap.xml
```

Do not introduce unnecessary crawler restrictions.

---

# 10. P0 — Not-found route correctness

The Vercel SPA rewrite currently makes arbitrary paths return the application entry point.

This is acceptable only if the application correctly identifies unknown routes.

Verify:

```text
/nonexistent
/random-test
/foo/bar
```

produce:

* a visually appropriate not-found page
* `noindex`
* no misleading canonical pointing at `/`
* no misleading sitemap entry
* HTTP behavior documented

If the architecture can support an actual static 404 without compromising the five canonical routes, prefer that.

Otherwise preserve the existing application-level 404 behavior.

---

# 11. P1 — Review homepage positioning

The homepage should communicate the following within the first screenful:

```text
KnowledgeAssemble
        ↓
Open systems for knowledge
        ↓
OpenEdu is the first major project
```

The current metadata already describes the organization as building open-source tools and systems for creating, connecting, exploring, and sharing knowledge.

Ensure the visible homepage communicates the same idea.

---

## Required positioning

The primary message should be close to:

> **Building open systems for assembling knowledge.**

Supporting message:

> KnowledgeAssemble builds open-source tools and systems for creating, connecting, exploring, and sharing knowledge.

Then make OpenEdu tangible:

> **Our first major project: OpenEdu**

Do not introduce stronger claims than the existing evidence supports.

---

# 12. P1 — Strengthen OpenEdu relationship

OpenEdu is already correctly represented in the project data as the flagship project, with the description:

> An open framework for creating accessible, interactive learning experiences.

and:

> An open runtime for educational experiences that separates content from delivery platforms.

Preserve this positioning.

The website should make the relationship visually obvious:

```text
KnowledgeAssemble
        │
        └── OpenEdu
             First flagship project
```

Do not make OpenEdu appear to be merely another card among equal projects.

---

# 13. P1 — Review "Knowledge Systems" claims

Current project content describes:

> Tools and infrastructure for making knowledge structured, portable, and interactive.

and categories:

```text
Formats
Graph
AST
```

These are useful internally but may be too implementation-oriented for a general organizational website.

Review whether visitors actually need to see:

```text
AST
Graph
```

on the public project card.

Prefer user-facing conceptual language unless the technical terms add real value.

Possible direction:

```text
Structured Knowledge
Portable Formats
Interactive Systems
```

Do not imply a finished product exists.

---

# 14. P1 — Review "Experiments" presentation

Experiments should communicate that these are explorations rather than products.

Use language such as:

> Small explorations, prototypes, and ideas around knowledge and learning.

The current wording already follows this direction. Preserve the honesty.

Do not add:

* roadmap promises
* fake project counts
* metrics
* "coming soon" clutter
* fabricated case studies

---

# 15. P1 — Principles page: make the seven principles feel intentional

The seven principles are currently concise and coherent:

1. Open by default
2. Knowledge should be portable
3. Composable over monolithic
4. Experience matters
5. Accessibility is foundational
6. Human judgment matters
7. Build, test, learn

The source content is already clean and should not be expanded merely for length.

However, visually distinguish:

```text
Principle
short explanation
```

from internal specification numbering.

Never expose:

```text
13.1
13.2
...
```

Only:

```text
01
02
...
07
```

This is already an explicit project constraint.

---

# 16. P1 — Add a stronger connection between principles and projects

The site should subtly demonstrate that the principles aren't abstract statements.

For example:

### Knowledge should be portable

→ OpenEdu separates knowledge/content from presentation.

### Composable over monolithic

→ OpenEdu consists of independently useful systems and engines.

### Accessibility is foundational

→ OpenEdu is designed around accessible learning experiences.

Do not turn the Principles page into technical documentation.

One short contextual sentence per principle is enough if needed.

---

# 17. P1 — Community page: avoid implying an existing large community

The current site deliberately avoids manufacturing scale.

Keep that.

Do not use:

```text
Join thousands of contributors
Our growing community
Hundreds of educators
Global community
```

unless those claims become demonstrably true.

The correct framing is:

> KnowledgeAssemble is open to people who want to build, teach, research, learn, and experiment.

The repository's own project guidance explicitly prohibits manufacturing community or product scale.

---

# 18. P1 — Make contribution paths concrete

The Community page should answer:

> "What can I actually do?"

At minimum:

```text
Explore
Try OpenEdu and the experiments.

Build
Contribute code and technical ideas.

Teach
Help test ideas with real learners.

Improve
Contribute documentation, examples, accessibility, or translations.

Discuss
Open issues and share observations.
```

Each action should link somewhere real.

Do not create links to nonexistent community infrastructure.

---

# 19. P1 — GitHub organization should be treated as a first-class destination

The GitHub organization currently contains five public repositories, including:

* `open-edu`
* `openedu-library`
* `open-edu-pipeline`
* `open-edu-interactive`
* `knowledgeassemble.org`

and the website repository itself is public and MIT licensed.

The website should therefore provide a clear path:

```text
KnowledgeAssemble website
        ↓
GitHub organization
        ↓
OpenEdu ecosystem
```

Do not dynamically fetch GitHub repositories for V1.

Keep the website content curated.

---

# 20. P1 — Repository README alignment

The repository README currently describes the project as:

> Public website for KnowledgeAssemble, an open-source umbrella organization stewarding tools that make knowledge portable and composable.

This is good.

After V1 gap closure, ensure README and website agree on:

* organization description
* OpenEdu relationship
* production URL
* stack
* license
* deployment
* current architectural status

Avoid documentation saying one thing while the public site says another.

---

# 21. P1 — Remove obsolete documentation language

After implementing prerendering, update:

```text
README.md
AGENTS.md
docs/IMPLEMENTATION_PLAN.md
```

Remove or revise statements such as:

> V1 accepts client-side rendering as a documented deviation.

and:

> If full no-JavaScript parity is required for V1...

That becomes obsolete once prerendering is implemented.

---

# 22. P1 — Update AGENTS.md after architecture change

AGENTS.md is currently the primary agent instruction document.

After the change, replace the CSR exception with the new rule:

> All five canonical public routes must produce meaningful HTML at build time. Client-side JavaScript may enhance navigation and interaction but must not be the sole source of route content.

This should become a hard constraint.

---

# 23. P1 — Add regression tests for no-JS content

Existing testing is already extensive.

Add tests specifically for the architectural change.

Required tests:

### Route prerender test

For each route:

```text
/
 /projects
 /principles
 /community
 /about
```

read the generated HTML without executing JavaScript.

Assert:

* expected `<h1>`
* expected page-specific content
* canonical
* description
* Open Graph metadata

---

### No-JS browser test

Playwright:

```text
javaScriptEnabled: false
```

For every route:

* page loads
* heading visible
* navigation works
* content visible
* no "JavaScript application" fallback
* GitHub link works

---

### Production HTML smoke test

If practical, add a lightweight production verification step.

Do not make CI dependent on the live production site unless the project deliberately wants deployment smoke tests.

---

# 24. P1 — Accessibility re-audit after prerendering

Do not assume existing accessibility tests remain sufficient.

Verify:

* skip link
* landmarks
* heading hierarchy
* keyboard navigation
* focus visibility
* link names
* mobile menu
* SVG labels
* decorative SVG handling
* reduced motion
* no duplicate navigation in prerendered HTML

Run axe against the prerendered application.

---

# 25. P1 — Social sharing verification

The site already has:

```text
og:title
og:description
og:image
twitter:card
twitter:title
twitter:description
twitter:image
```

and the repository has an OG image asset.

After prerendering, ensure these are present in the initial HTML for each page.

The homepage fallback must not accidentally become the social metadata for every deep route.

Recommended route-specific examples:

```text
/projects
KnowledgeAssemble Projects

/principles
KnowledgeAssemble Principles

/community
KnowledgeAssemble Community

/about
About KnowledgeAssemble
```

---

# 26. P1 — Favicon and brand consistency

Verify:

* favicon loads
* SVG has no prohibited visual constructs
* logo is visible at appropriate sizes
* header and footer logo use the same underlying asset/geometry
* Open Graph image reflects current brand

Do not redesign the logo during this pass unless a concrete defect is found.

---

# 27. P1 — Mobile final pass

Verify at minimum:

```text
320px
375px
768px
1024px
1280px
1440px
```

Specific checks:

* no horizontal overflow
* navigation opens correctly
* all primary controls have sufficient touch target
* hero remains readable
* project cards remain legible
* principle numbering doesn't collide with content
* KnowledgeFlow reflows correctly
* footer remains usable

The existing project already has automated responsive checks; preserve and extend them rather than replacing them.

---

# 28. P1 — Performance verification

The latest project audit reports approximately:

```text
Accessibility: 100
SEO: 100
Best Practices: 100
Performance: 96–97
CLS: ~0
```

Treat this as a strong baseline rather than a reason to add optimization complexity.

After prerendering, rerun Lighthouse.

Target:

```text
Accessibility >= 95
SEO >= 95
Best Practices >= 95
Performance >= 95
CLS ≈ 0
```

Do not introduce a new framework merely to improve a few Lighthouse points.

---

# 29. P2 — Improve page-to-page narrative

Once P0/P1 work is complete, inspect whether the five pages form a coherent journey:

```text
Home
  ↓
What is KnowledgeAssemble?
  ↓
Projects
  ↓
Why these projects?
  ↓
Principles
  ↓
How can I participate?
  ↓
Community
  ↓
Who is behind this?
  ↓
About
```

Each page should have a natural next action.

Avoid adding excessive CTAs.

---

# 30. P2 — Improve About page depth only if necessary

The About page should answer:

1. What is KnowledgeAssemble?
2. Why does it exist?
3. What is the relationship to OpenEdu?
4. What does "knowledge should be portable" mean?

It does not need:

* founder biography
* company history
* corporate timeline
* legal entity details
* mission/vision/value boilerplate

unless there is a real reason to publish those.

---

# 31. P2 — Consider a small "Built in the open" section

Potential future section:

> **Built in the open.**

> Our projects, specifications, experiments, and source code are developed publicly.

CTA:

> Explore GitHub →

This is especially appropriate because the organization already has a public repository ecosystem.

Keep this concise.

---

# 32. P2 — Add project status semantics carefully

Current statuses:

```text
Active
Exploring
Ongoing
```

These are useful.

Ensure status labels are explained or self-evident.

Do not introduce:

```text
Alpha
Beta
Production
Scale
Enterprise
```

unless these states actually exist.

---

# 33. P3 — Explicitly defer

Do NOT implement as part of V1 gap closure:

* CMS
* blog
* newsletter
* analytics
* authentication
* search
* dynamic GitHub API
* GitHub repository browser
* community forum
* comments
* user profiles
* multilingual content
* AI chatbot
* dark mode
* complex animations
* interactive network graph
* dynamic knowledge visualization
* project dashboard
* contact form
* donations/payment system

These can be considered after real usage provides evidence.

---

# 34. Recommended implementation order

Execute in this exact order.

```text
PHASE A — Public HTML
        │
        ├── 1. Add route prerendering
        ├── 2. Generate five canonical HTML pages
        ├── 3. Ensure route metadata is generated
        └── 4. Verify no-JS rendering

PHASE B — SEO / Web correctness
        │
        ├── 5. Verify canonical URLs
        ├── 6. Verify OG/Twitter metadata
        ├── 7. Verify sitemap
        ├── 8. Verify robots.txt
        └── 9. Verify 404/noindex

PHASE C — Content correctness
        │
        ├── 10. Review homepage positioning
        ├── 11. Review OpenEdu prominence
        ├── 12. Review Knowledge Systems language
        ├── 13. Review Community claims
        └── 14. Review page-to-page narrative

PHASE D — Regression / accessibility
        │
        ├── 15. Add no-JS tests
        ├── 16. Add generated-HTML tests
        ├── 17. Re-run axe
        ├── 18. Re-run responsive tests
        └── 19. Re-run Lighthouse

PHASE E — Documentation
        │
        ├── 20. Update AGENTS.md
        ├── 21. Update README.md
        ├── 22. Update IMPLEMENTATION_PLAN.md
        └── 23. Record final V1 architecture
```

---

# 35. Definition of V1 complete

KnowledgeAssemble V1 can be considered complete when all of the following are true.

## Public delivery

* [ ] All five routes produce meaningful HTML without JavaScript
* [ ] JavaScript enhances rather than supplies the core content
* [ ] Deep links work
* [ ] Unknown routes behave correctly

## SEO

* [ ] Every route has correct title
* [ ] Every route has correct description
* [ ] Every route has correct canonical
* [ ] Every route has correct OG metadata
* [ ] Sitemap is valid
* [ ] Robots references sitemap
* [ ] 404 is noindex

## Content

* [ ] KnowledgeAssemble positioning is immediately understandable
* [ ] OpenEdu is clearly the first flagship project
* [ ] No unsupported scale claims
* [ ] Knowledge Systems is presented honestly
* [ ] Experiments are presented honestly
* [ ] Principles are coherent
* [ ] Community paths are actionable but honest

## Accessibility

* [ ] Keyboard navigation works
* [ ] Focus states work
* [ ] Skip link works
* [ ] Heading hierarchy works
* [ ] No-JS content remains accessible
* [ ] Mobile menu is accessible
* [ ] Reduced motion works
* [ ] Axe has no serious/critical issues

## Performance

* [ ] Lighthouse performance >= 95 target
* [ ] CLS approximately zero
* [ ] No unnecessary third-party runtime requests
* [ ] Fonts remain self-hosted
* [ ] No unnecessary JS dependencies

## Engineering

* [ ] `npm run verify` passes
* [ ] CI passes
* [ ] No new architecture complexity without justification
* [ ] Documentation matches implementation
* [ ] No stale CSR exception remains in primary documentation

---

# 36. Final architectural principle

The most important change in this phase is:

> **The website should be a web document first and a React application second.**

The current architecture is:

```text
HTML shell
   ↓
JavaScript
   ↓
actual website
```

The target architecture is:

```text
HTML
   ↓
actual website
   ↓
JavaScript enhancement
```

This is the right fit for KnowledgeAssemble.

It makes the website:

* more open
* more accessible
* more indexable
* more portable
* more resilient
* simpler to understand
* more aligned with the organization's own principles

Do not solve this by making the website more complicated.

Solve it by making the existing site deliver its content in the simplest possible form.
