# KnowledgeAssemble Website — V1

**Status:** Draft
**Audience:** AI coding agents, developers, designers
**Purpose:** Define the first public website for KnowledgeAssemble, the umbrella organization behind OpenEdu and future open knowledge projects.

---

## 1. Objective

Build a small, polished, accessible website for **KnowledgeAssemble**.

The website should establish KnowledgeAssemble as:

> **An open-source organization building tools and systems that make knowledge easier to create, connect, explore, and share.**

The site is **not** intended to be:

* a SaaS marketing website
* an OpenEdu product website
* a documentation portal
* a community platform
* a blog platform
* a complex CMS
* a showcase of every experiment

V1 should establish the organization's identity and provide a clear path into OpenEdu.

---

# 2. Core positioning

## 2.1 Organization

**KnowledgeAssemble**

KnowledgeAssemble is the umbrella organization.

It can contain:

* OpenEdu
* knowledge tools
* interactive knowledge engines
* open formats
* experiments
* future projects

## 2.2 First major project

**OpenEdu**

OpenEdu is presented as the first major project of KnowledgeAssemble.

Relationship:

```text
KnowledgeAssemble
│
├── OpenEdu
│
├── Knowledge Tools
│
└── Experiments
```

Do not make OpenEdu appear to be the organization itself.

---

# 3. V1 information architecture

Implement only these routes:

```text
/
├── /projects
├── /principles
├── /community
└── /about
```

Optional external destination:

```text
OpenEdu → existing OpenEdu website/repository
GitHub → KnowledgeAssemble GitHub organization
```

Do not build additional routes unless required by implementation.

---

# 4. Navigation

Desktop navigation:

```text
KnowledgeAssemble

Projects
Principles
Community
About

[GitHub]
```

Mobile:

```text
KnowledgeAssemble        [Menu]
```

Mobile navigation should use a simple accessible disclosure/menu.

The navigation should remain visually quiet.

Avoid a large SaaS-style header.

---

# 5. Homepage

## 5.1 Hero

Primary heading:

> **Building open systems for assembling knowledge.**

Supporting text:

> KnowledgeAssemble is an open-source organization exploring better ways to create, connect, explore, and share knowledge through software, educational tools, and experimental learning systems.

Primary CTA:

> Explore projects

Secondary CTA:

> GitHub

The hero should be visually strong without relying on a large stock photograph.

---

# 6. Homepage — Knowledge concept

Create a section introducing the central idea.

### Heading

> **Knowledge should be able to move.**

Copy:

> Knowledge is often trapped inside platforms, formats, applications, and institutional silos. We explore systems that make knowledge more portable, composable, accessible, and useful.

Use a simple conceptual diagram:

```text
Ideas
  ↓
Content
  ↓
Structure
  ↓
Interaction
  ↓
Experience
  ↓
Understanding
```

The diagram should be static in V1.

Do not implement complex animation.

---

# 7. Homepage — What we're building

Heading:

> **What we're building**

Three cards.

## Card 1 — OpenEdu

**Title**

> OpenEdu

**Description**

> An open framework for creating accessible, interactive learning experiences.

**Tags**

```text
Education
Open Source
Interactive Learning
```

CTA:

> Explore OpenEdu →

This should link to the current OpenEdu website/repository.

---

## Card 2 — Knowledge Systems

**Title**

> Knowledge Systems

**Description**

> Tools, formats, and engines for structuring, connecting, and exploring knowledge.

This is descriptive rather than a claim that a finished product exists.

Do not imply that there is already a mature standalone product.

---

## Card 3 — Experiments

**Title**

> Experiments

**Description**

> Prototypes and explorations for discovering better ways to work with knowledge.

CTA:

> See what we're exploring →

For V1 this can link to `/projects`.

---

# 8. Homepage — Principles

Heading:

> **How we work**

Display four principles:

### Open

Build in the open and prefer open technologies, formats, and knowledge.

### Composable

Build small systems that can work together rather than one giant platform.

### Accessible

Accessibility should be part of the foundation, not an afterthought.

### Human + AI

Use AI to amplify human ability without making AI the purpose of the experience.

Keep each principle concise.

CTA:

> Read our principles →

---

# 9. Homepage — Community

Heading:

> **Knowledge is built by many people.**

Copy:

> KnowledgeAssemble is for people who create, teach, research, build, learn, and experiment.

Show five lightweight categories:

```text
Educators
Developers
Researchers
Families
Contributors
```

CTA:

> Join the community →

For V1, this may simply link to the GitHub organization/community destination.

Do not build authentication, forums, profiles, or community accounts.

---

# 10. Homepage — Open source

Heading:

> **Open source, by default.**

Copy:

> We believe the systems that help people create and explore knowledge should be understandable, reusable, and shareable.

CTA:

> Explore GitHub →

This should point to the official KnowledgeAssemble GitHub organization.

---

# 11. Homepage — Footer statement

Use a simple closing statement:

> **KnowledgeAssemble**
> Open systems for knowledge.

Footer links:

```text
Projects
Principles
Community
About
GitHub
```

Optional:

```text
Contact
```

Only include Contact if a real contact destination exists.

Do not invent an email address.

---

# 12. Projects page

Route:

```text
/projects
```

Heading:

> **Projects**

Intro:

> KnowledgeAssemble projects explore different parts of the knowledge ecosystem — from learning systems to interactive tools and experimental ideas.

## Project structure

Each project should have:

* name
* short description
* status
* category
* external link where applicable

### OpenEdu

Status:

> Active

Description:

> An open framework for creating accessible, interactive learning experiences.

Categories:

```text
Education
Open Source
Learning
```

External link:

> OpenEdu →

---

### Knowledge Systems

Status:

> Exploring

Description:

> Tools and infrastructure for making knowledge structured, portable, and interactive.

Do not present unfinished components as a mature product.

---

### Experiments

Status:

> Ongoing

Description:

> Small explorations, prototypes, and ideas around knowledge and learning.

---

# 13. Principles page

Route:

```text
/principles
```

Heading:

> **Principles**

Intro:

> KnowledgeAssemble is guided by a small set of principles. They describe how we think about technology, knowledge, and the people who use it.

Sections:

## 13.1 Open by default

Prefer open-source software, open standards, open formats, and publicly understandable systems.

## 13.2 Knowledge should be portable

Knowledge should not depend unnecessarily on the application that happens to display it.

## 13.3 Composable over monolithic

Prefer systems that can be combined, replaced, extended, and reused.

## 13.4 Experience matters

Knowledge is more than stored information. People understand through interaction, exploration, context, and experience.

## 13.5 Accessibility is foundational

Accessibility should influence architecture, interaction, content, and visual design from the beginning.

## 13.6 Human judgment matters

AI can assist with creation, discovery, and exploration, but people remain responsible for meaning, context, and judgment.

## 13.7 Build, test, learn

Ideas should be tested through real use rather than protected by elaborate speculation.

This last principle is especially important.

KnowledgeAssemble should demonstrate that philosophy through its own development process.

---

# 14. Community page

Route:

```text
/community
```

Heading:

> **Build with us.**

Intro:

> KnowledgeAssemble is an open project. You don't need to be a developer to contribute.

Sections:

### Educators

Help us understand how people teach and learn.

### Developers

Build tools, engines, integrations, and infrastructure.

### Researchers

Explore questions around learning, knowledge, accessibility, and technology.

### Families and learners

Try things, share experiences, and help us understand what actually works.

### Contributors

Improve documentation, translations, examples, design, testing, and open-source projects.

CTA:

> Find us on GitHub →

Do not create a custom community system for V1.

---

# 15. About page

Route:

```text
/about
```

Heading:

> **About KnowledgeAssemble**

Primary statement:

> We are exploring what it could look like if knowledge were easier to create, connect, explore, and share.

Then explain:

> Much of the world's knowledge exists inside books, applications, websites, databases, institutions, and proprietary platforms. These systems are useful, but the knowledge within them is often difficult to move, remix, or experience in new ways.

> KnowledgeAssemble explores open systems that separate knowledge from the software used to present it.

Then introduce OpenEdu:

> **OpenEdu is our first major exploration of this idea in education.**

CTA:

> Explore OpenEdu →

---

# 16. Visual identity

KnowledgeAssemble should have its own visual identity.

It should feel related to OpenEdu but not identical.

## Desired characteristics

```text
Quiet
Intellectual
Open
Technical
Human
Accessible
Curious
```

Avoid:

```text
Corporate SaaS
Neon AI
Generic startup gradients
Crypto aesthetic
Heavy glassmorphism
Excessive animation
Stock photography
```

---

# 17. Color direction

Use a restrained palette.

Suggested foundation:

```text
Background:
warm off-white / very light neutral

Primary text:
deep charcoal

Secondary text:
muted slate

Primary accent:
deep blue or blue-green

Secondary accent:
muted green

Borders:
soft neutral
```

Avoid pure black and pure white as the dominant visual treatment.

Do not use gradients.

---

# 18. Typography

Use a highly readable modern typeface.

Recommended characteristics:

* excellent readability
* strong Unicode coverage
* accessible x-height
* clear distinction between characters
* good rendering on mobile

Possible choices:

* Inter
* IBM Plex Sans
* Source Sans 3

Do not overuse multiple fonts.

A single primary typeface is preferred.

Monospace may be used sparingly for:

* technical labels
* project status
* code-like metadata

---

# 19. Visual motif

The primary visual motif should be **assembly / connection**.

Possible visual language:

```text
nodes
lines
cards
layers
relationships
diagrams
structured information
```

Avoid turning this into a literal "network graph everywhere."

Use diagrams selectively.

A particularly strong homepage visual is:

```text
Ideas
 ↓
Content
 ↓
Structure
 ↓
Interaction
 ↓
Experience
 ↓
Understanding
```

---

# 20. Illustration

Do not depend on stock imagery.

If illustrations are used:

* simple SVG
* geometric
* restrained
* accessible
* no gradients
* no filters
* no decorative noise

Illustrations should communicate an idea rather than simply decorate a section.

---

# 21. Interaction design

Keep interaction deliberately restrained.

Allowed:

* subtle hover states
* card elevation/border changes
* navigation transitions
* menu open/close
* gentle reveal animations

Avoid:

* parallax
* animated backgrounds
* continuous motion
* cursor-following effects
* excessive scroll animations

Respect:

```css
prefers-reduced-motion
```

---

# 22. Accessibility

Accessibility is a V1 requirement.

Minimum requirements:

* semantic HTML
* keyboard navigation
* visible focus states
* accessible navigation
* correct heading hierarchy
* sufficient color contrast
* meaningful link labels
* alt text for meaningful images
* decorative images marked appropriately
* reduced-motion support
* responsive text sizing
* touch targets appropriate for mobile

Do not make accessibility dependent on JavaScript.

---

# 23. Responsive design

The website must work well at:

```text
320px
375px
768px
1024px
1280px
1440px+
```

Prioritize mobile readability rather than shrinking the desktop layout.

The conceptual diagrams should remain understandable on narrow screens.

---

# 24. Technical direction

Use the simplest appropriate architecture.

Preferred:

```text
React
Vite
TypeScript
```

Use existing KnowledgeAssemble/OpenEdu conventions where available.

Avoid introducing:

* CMS
* database
* authentication
* backend API
* analytics platform
* complex state management
* component library dependency solely for this site

Content should initially be local/static.

---

# 25. Content architecture

Keep site content easy to modify.

Prefer structured local content such as:

```text
src/
  content/
    projects.ts
    principles.ts
    community.ts
```

or equivalent simple data structures.

Do not build a CMS.

Do not over-generalize the content schema.

---

# 26. External links

External destinations should be configuration-driven where practical.

Example:

```ts
const links = {
  github: "...",
  openedu: "...",
};
```

Do not scatter URLs throughout components.

The actual KnowledgeAssemble GitHub/OpenEdu URLs should be confirmed from the project configuration rather than invented.

---

# 27. SEO

V1 should have basic SEO.

Implement:

* page title
* meta description
* canonical URL if known
* Open Graph title
* Open Graph description
* Open Graph image if available
* favicon
* semantic headings

Homepage title:

> KnowledgeAssemble — Open Systems for Knowledge

Description:

> KnowledgeAssemble builds open-source tools and systems for creating, connecting, exploring, and sharing knowledge.

Do not implement a complex SEO framework.

---

# 28. Performance

Target:

* fast first load
* minimal JavaScript
* optimized assets
* no unnecessary animation libraries
* no large image dependencies

The homepage should remain lightweight.

Prefer SVG and CSS over raster artwork where appropriate.

---

# 29. Analytics

Do not add analytics in V1 unless there is already an approved KnowledgeAssemble analytics solution.

If analytics are added later, accessibility and privacy must be considered.

Do not add tracking libraries simply because they are common.

---

# 30. Content tone

Voice:

```text
Calm
Clear
Curious
Confident
Open
Non-corporate
```

Prefer:

> We are exploring...

over:

> We are revolutionizing...

Prefer:

> An open framework for...

over:

> The world's leading...

Prefer:

> We're building...

over:

> Our cutting-edge AI-powered platform...

Avoid marketing clichés.

---

# 31. What V1 must NOT include

Do not implement:

* user accounts
* CMS
* blog engine
* comments
* newsletter infrastructure
* search
* localization system
* complex animations
* dark/light theme switching unless already supported by the site's foundation
* AI chatbot
* contact forms requiring backend infrastructure
* project dashboards
* GitHub API integrations
* dynamic project fetching
* database
* admin panel

These can be considered later.

---

# 32. Definition of done

V1 is complete when:

### Content

* [ ] Home page implemented
* [ ] Projects page implemented
* [ ] Principles page implemented
* [ ] Community page implemented
* [ ] About page implemented
* [ ] OpenEdu clearly positioned as a KnowledgeAssemble project
* [ ] No unsupported claims about projects or community

### Design

* [ ] Consistent visual system
* [ ] Responsive layout
* [ ] Strong typography
* [ ] Restrained color palette
* [ ] No gradients
* [ ] No stock photography
* [ ] Conceptual knowledge/assembly visual included

### Accessibility

* [ ] Keyboard navigation works
* [ ] Focus states are visible
* [ ] Navigation is accessible
* [ ] Heading hierarchy is correct
* [ ] Contrast passes WCAG AA where applicable
* [ ] Reduced motion is respected
* [ ] Mobile interaction is accessible

### Technical

* [ ] TypeScript builds without errors
* [ ] Production build succeeds
* [ ] No unnecessary dependencies
* [ ] External links work
* [ ] Metadata is present
* [ ] No console errors
* [ ] No broken routes

### Quality

* [ ] Tested at mobile width
* [ ] Tested at desktop width
* [ ] Tested keyboard-only navigation
* [ ] Tested with reduced motion
* [ ] Content reviewed for exaggerated marketing language

---

# 33. Implementation sequence

Build in this order:

```text
1. Establish site shell
       ↓
2. Typography + color tokens
       ↓
3. Header/navigation
       ↓
4. Homepage
       ↓
5. Projects
       ↓
6. Principles
       ↓
7. Community
       ↓
8. About
       ↓
9. Accessibility pass
       ↓
10. Responsive pass
       ↓
11. SEO/performance pass
       ↓
12. Final visual polish
```

Do not start by building a design system.

Create only the primitives actually required by the V1 pages.

---

# 34. Suggested component structure

Keep the component hierarchy simple.

```text
components/
  SiteHeader
  SiteFooter
  PageContainer
  Section
  SectionHeading
  Button
  ProjectCard
  PrincipleCard
  CommunityCard
  KnowledgeFlow
```

Do not create generic abstractions until repeated patterns actually appear.

---

# 35. Success criteria

The site should leave a visitor with three clear impressions:

### 1. KnowledgeAssemble is real

There is a coherent organization and philosophy behind the projects.

### 2. OpenEdu is tangible

There is already a concrete project being built.

### 3. The organization has room to grow

KnowledgeAssemble is larger than OpenEdu without pretending to already have a large portfolio.

---

# 36. Final design principle

> **Make the organization feel bigger through clarity, not through more content.**

V1 should feel like a small but serious open-source organization that has a clear point of view.

Do not manufacture scale.

Do not manufacture community.

Do not manufacture products.

Build the identity first.

