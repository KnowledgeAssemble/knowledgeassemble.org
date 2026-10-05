# KnowledgeAssemble — Motion & SVG Visual Specification

**Status:** V1
**Purpose:** Add a restrained, meaningful visual-motion layer to the KnowledgeAssemble website.

---

# 1. Objective

Make the KnowledgeAssemble website feel **alive, thoughtful, and distinctive** without turning it into a highly animated marketing site.

The visual language should communicate:

> **Knowledge is assembled, connected, explored, and shared.**

Motion should therefore represent **relationships and transformation**, not decoration.

---

# 2. Design principle

## Animate meaning, not decoration

Every animation must answer at least one of these questions:

* What is being assembled?
* What is being connected?
* What is moving?
* What is being transformed?
* What is being explored?
* How do different contributors or ideas relate?

Avoid animation whose only purpose is:

> "It looks cool."

---

# 3. Overall motion language

Motion should feel:

```text
Calm
Deliberate
Organic
Precise
Quiet
Intellectual
Human
```

Avoid:

```text
Fast
Bouncy
Aggressive
Gimmicky
Constantly moving
AI-startup-like
Game-like
```

---

# 4. Motion principles

## 4.1 Slow rather than fast

Preferred durations:

```text
Micro interaction: 150–250ms
Small transition: 250–400ms
Reveal: 400–700ms
Diagram assembly: 700–1400ms
Large conceptual animation: 1200–2000ms
Loop: 5–12 seconds
```

Avoid animations shorter than ~150ms unless they are extremely subtle UI feedback.

---

## 4.2 Ease naturally

Prefer:

```css
ease-out
ease-in-out
```

or carefully tuned cubic-bezier curves.

Avoid:

```text
elastic
bounce
overshoot
excessive spring physics
```

---

## 4.3 Minimal displacement

Most motion should involve:

```text
opacity
stroke-dashoffset
small translation
small scale
line drawing
```

Avoid large movement across the viewport.

---

# 5. Visual language

The primary visual vocabulary is:

```text
points
nodes
lines
paths
containers
layers
blocks
connections
small geometric forms
```

The system should feel like **knowledge architecture**, not a literal computer network.

---

# 6. SVG rules

All custom illustrations should be SVG.

## Allowed

```text
<svg>
<path>
<line>
<polyline>
<polygon>
<circle>
<rect>
<g>
<text>
```

Use semantic grouping where useful.

---

## Avoid

Do not use:

* raster images inside SVG
* SVG filters
* blur effects
* complex gradients
* embedded fonts
* external SVG dependencies
* excessive path complexity

Prefer simple geometry.

---

# 7. Color rules

SVG illustrations must use the existing KnowledgeAssemble design tokens.

Do not introduce a separate illustration palette.

Use:

```text
primary
secondary
muted
accent
border
surface
```

where available.

Avoid:

* neon colors
* rainbow palettes
* bright gradients
* glowing effects
* excessive saturation

The illustrations should feel integrated with the page rather than pasted on top.

---

# 8. Animation architecture

Do not introduce a large animation library solely for these visuals.

Preferred stack:

```text
SVG
+
CSS transitions/animations
+
IntersectionObserver
+
existing React components
```

Use JavaScript only where CSS cannot reasonably express the behavior.

---

# 9. Component architecture

Add a dedicated visual component namespace.

Suggested:

```text
src/
  components/
    visuals/
      KnowledgeAssembly.svg / KnowledgeAssembly.tsx
      KnowledgeFlow.svg / KnowledgeFlow.tsx
      ProjectVisual.tsx
      PrincipleVisual.tsx
      CommunityAssembly.svg / CommunityAssembly.tsx
```

Exact filenames may differ.

Do not create a large generic SVG framework.

---

# 10. Hero visual — Knowledge Assembly

## Priority

**P0**

## Location

Homepage hero.

## Purpose

This is the primary visual signature of KnowledgeAssemble.

It should visually communicate:

> Ideas and information becoming structured knowledge.

---

# 11. Hero visual concept

Create a simple asymmetric SVG consisting of:

```text
        Ideas       Data
          ○          ○
           \        /
            \      /
             ○────○
            /  │   \
           /   │    \
      Content Context Structure
           \    │   /
            \   │  /
             \  │ /
               ◉
            Knowledge
```

This is conceptual guidance, not a literal layout requirement.

The final illustration should feel handcrafted and balanced.

Do not create a perfect symmetric network graph.

---

# 12. Hero animation sequence

On initial page load:

### Stage 1 — Nodes appear

Input nodes fade/scale into place.

Duration:

```text
300–500ms
```

### Stage 2 — Connections assemble

Lines draw between related nodes.

Use:

```css
stroke-dasharray
stroke-dashoffset
```

Duration:

```text
500–900ms
```

### Stage 3 — Components converge

Relevant elements gently move toward their assembled positions.

Duration:

```text
500–800ms
```

### Stage 4 — Knowledge node resolves

Central node appears.

Duration:

```text
300–500ms
```

### Stage 5 — Settle

Everything reaches the final static state.

Total sequence:

```text
~1.5–2.5 seconds
```

Do not loop the complete assembly animation.

---

# 13. Hero idle state

After assembly:

**Remain still.**

Do not continuously animate the hero.

Optional:

A very subtle 6–10 second opacity/line pulse may be introduced later, but it is not required for V1.

Prefer static over continuous motion.

---

# 14. Hero accessibility

The visual must never contain the only explanation of the organization.

Provide:

```text
aria-hidden="true"
```

if it is purely decorative.

The surrounding text must communicate the same conceptual message.

For reduced motion:

```text
display final assembled state immediately
```

Do not play the assembly sequence.

---

# 15. Homepage — Knowledge Flow

## Priority

**P0**

## Location

Homepage knowledge/concept section.

Current conceptual sequence:

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

Turn this into a visual SVG.

---

# 16. Knowledge Flow visual

Represent each stage as a node or simple geometric object.

Example:

```text
Ideas
  ●
  │
  ▼
Content
  ●
  │
  ▼
Structure
  ●
  │
  ▼
Interaction
  ●
  │
  ▼
Experience
  ●
  │
  ▼
Understanding
  ●
```

The final implementation can use a more organic path.

---

# 17. Knowledge Flow animation

When the section enters the viewport:

1. Path draws
2. Nodes appear
3. A small particle moves through the path
4. Particle reaches Understanding
5. Animation settles

Optional loop:

```text
5–10 seconds
```

If looping is implemented, make it extremely subtle.

The particle should never distract from the text.

---

# 18. Scroll behavior

Do not hijack scrolling.

Do not:

* lock scrolling
* create horizontal scroll sections
* pin the entire page
* force animation progress based on scroll position

Use IntersectionObserver simply to trigger the animation.

---

# 19. Projects page — project visuals

## Priority

**P1**

Create small SVG illustrations for:

```text
OpenEdu
Knowledge Systems
Experiments
```

---

# 20. OpenEdu visual

Concept:

```text
learning pieces → connected learning experience
```

Possible structure:

```text
□ → □ → ◇ → □
```

The objects represent:

```text
content
activity
interaction
experience
```

Animation:

* one piece gently joins the sequence
* connection appears
* final state settles

Duration:

```text
800–1200ms
```

Trigger:

```text
hover
focus
or card entering viewport
```

Do not continuously animate.

---

# 21. Knowledge Systems visual

Concept:

```text
knowledge can be structured and connected
```

Use a small graph-like arrangement:

```text
○──○
│  │
○──○──○
```

Animation:

One relationship appears/disappears or one node connects.

Do not create a constantly moving graph.

The structure must remain readable.

---

# 22. Experiments visual

Concept:

```text
exploration → possibilities
```

Use a branching structure:

```text
        ○
       /
○─────○
       \
        ○
```

Animation:

A central path branches into two alternatives.

Keep it subtle.

---

# 23. Project visual interaction

On pointer hover:

```text
SVG moves 2–4px
```

or:

```text
one connection draws
```

Do not use:

```text
scale > 1.05
rotation
large movement
glow
```

Keyboard focus should trigger the same meaningful state.

---

# 24. Principles page — principle illustrations

## Priority

**P1**

Each principle may have a small geometric SVG.

Seven principles:

```text
01 Open by default
02 Knowledge should be portable
03 Composable over monolithic
04 Experience matters
05 Accessibility is foundational
06 Human judgment matters
07 Build, test, learn
```

---

# 25. Principle visual vocabulary

Each illustration must express the principle.

### Open by default

A container opens.

```text
┌────
│
│
└────
```

One boundary separates.

---

### Knowledge should be portable

An object moves between containers.

```text
□  →  □
```

---

### Composable over monolithic

Multiple pieces connect:

```text
□ + □ + □
      ↓
    ┌───┐
```

---

### Experience matters

A static object becomes an interactive path.

```text
● → ○ → ◇
```

---

### Accessibility is foundational

Multiple possible paths converge on an accessible route.

Keep this abstract rather than using disability symbols.

---

### Human judgment matters

Two distinct elements contribute to a shared outcome.

Do not imply:

```text
AI → human
```

as a hierarchy.

Prefer:

```text
human ↔ machine
       ↓
    outcome
```

---

### Build, test, learn

A circular loop:

```text
Build
  ↓
Test
  ↓
Learn
  ↓
Build
```

This should be the only principle visual with a naturally repeating motion.

---

# 26. Principle animation behavior

Default:

```text
static
```

On entering viewport:

```text
small reveal
```

On hover/focus:

```text
meaningful micro-animation
```

Do not animate all seven simultaneously.

---

# 27. Community page — Contributors → Knowledge

## Priority

**P2**

Create a visual showing different contributors assembling knowledge.

Concept:

```text
Educator ──────┐
Developer ─────┤
Learner ───────┼──→ Knowledge
Researcher ────┤
Contributor ───┘
```

The labels already exist in the page content.

The visual should reinforce:

> Knowledge is built by many people.

---

# 28. Community animation

When the section enters viewport:

1. contributor nodes appear
2. lines draw toward the center
3. central knowledge node appears

Duration:

```text
1200–1800ms
```

Do not continuously animate.

---

# 29. About page

Do not introduce a new complex animation in V1.

The About page should remain primarily textual.

Optional future concept:

```text
Create
   ↓
Connect
   ↓
Explore
   ↓
Share
```

Defer unless the existing page needs stronger visual support.

---

# 30. Micro-interactions

Implement a restrained global interaction language.

## Links

Arrow links may shift slightly:

```text
Explore OpenEdu →
```

On hover/focus:

```text
Explore OpenEdu  →
```

with:

```text
translateX: 2–4px
```

---

## Cards

On hover/focus:

* border subtly changes
* SVG may move 2–3px
* no large scaling

---

## Navigation

Active route indicator may animate into place.

Duration:

```text
200–300ms
```

Do not animate the entire navigation bar.

---

# 31. Logo animation

## Priority

**P2**

Do not modify the existing logo unless its structure naturally supports assembly.

If it does:

Initial load:

```text
logo components
      ↓
small separation
      ↓
assemble
      ↓
settle
```

Duration:

```text
800–1200ms
```

Play once.

Do not continuously animate the logo.

If implementing this requires changing the logo asset substantially, defer it.

---

# 32. Section reveal

Use restrained reveal animations.

Preferred:

```text
opacity: 0 → 1
translateY: 8px → 0
```

Duration:

```text
400–600ms
```

Use only on meaningful sections.

Avoid animating every paragraph independently.

---

# 33. Reduced-motion requirement

This is mandatory.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is enabled:

### Hero

Show final assembled state.

### Knowledge Flow

Show complete diagram.

### Project visuals

Show final state.

### Principles

Show final state.

### Community

Show final state.

### Micro-interactions

Use immediate state changes or disable motion.

There must be **no continuously moving element** for reduced-motion users.

---

# 34. Accessibility requirements

All SVGs must fall into one of two categories.

## Decorative

Use:

```html
aria-hidden="true"
```

No redundant screen-reader text.

---

## Informational

Provide:

```html
role="img"
aria-label="..."
```

or an equivalent accessible description.

The visual must not be the only place where information exists.

---

# 35. Performance requirements

SVGs must remain lightweight.

Targets:

```text
Individual visual: ideally < 20 KB
Total custom SVG assets: ideally < 150 KB
```

Do not optimize prematurely if readability suffers.

Avoid:

* huge SVG path data
* unnecessary metadata
* embedded raster assets
* animation libraries loaded globally

---

# 36. No animation framework requirement

Do not install:

```text
Framer Motion
GSAP
Lottie
Three.js
Rive
```

unless an actual implementation requirement demonstrates that CSS/SVG/IntersectionObserver cannot reasonably provide the needed behavior.

V1 should not need any of them.

---

# 37. Testing

Add automated tests where practical.

## Visual existence

Verify:

* hero visual exists
* Knowledge Flow exists
* project visuals exist
* principle visuals exist where required
* community visual exists if implemented

---

## Accessibility

Verify:

* decorative SVGs have `aria-hidden`
* informational SVGs have accessible names
* no SVG receives keyboard focus accidentally
* reduced-motion behavior works

---

## Reduced motion

Test with:

```text
prefers-reduced-motion: reduce
```

Ensure:

* no infinite animation
* no animated transforms
* final state visible

---

# 38. Browser testing

Test:

```text
Chrome
Safari
Firefox
```

At minimum:

```text
desktop
mobile viewport
```

Verify:

* SVG rendering
* animation timing
* no layout shift
* no horizontal overflow
* no animation clipping

---

# 39. Mobile behavior

Do not simply shrink desktop SVGs.

Design mobile compositions deliberately.

For example:

Desktop:

```text
        Ideas
          \
Content ─ Knowledge ─ Structure
          /
       Context
```

Mobile:

```text
Ideas
  ↓
Content
  ↓
Structure
  ↓
Knowledge
```

The meaning must remain clear.

---

# 40. Animation failure behavior

If JavaScript fails:

```text
SVG should still display
```

If animation fails:

```text
final visual state remains visible
```

Animation must never be required for comprehension.

---

# 41. Implementation order

Implement in this order:

```text
Phase 1
│
├── Hero Knowledge Assembly
└── Reduced-motion foundation

Phase 2
│
└── Homepage Knowledge Flow

Phase 3
│
└── Project visuals

Phase 4
│
└── Principle visuals

Phase 5
│
└── Community visual

Phase 6
│
├── Micro-interactions
└── Final motion tuning

Phase 7
│
├── Accessibility audit
├── Mobile audit
├── Performance audit
└── Browser audit
```

---

# 42. Definition of done

## Hero

* [ ] Knowledge Assembly SVG implemented
* [ ] Animation plays once
* [ ] Final state remains visible
* [ ] Reduced motion shows final state
* [ ] SVG is lightweight
* [ ] No layout shift

## Homepage

* [ ] Knowledge Flow implemented
* [ ] Path animation works
* [ ] Particle animation is subtle
* [ ] Reduced motion works

## Projects

* [ ] OpenEdu visual
* [ ] Knowledge Systems visual
* [ ] Experiments visual
* [ ] Hover/focus behavior
* [ ] Mobile layouts

## Principles

* [ ] Seven principle visuals
* [ ] Meaningful visual metaphors
* [ ] No simultaneous distracting animations
* [ ] Reduced motion support

## Community

* [ ] Contributor → Knowledge visual
* [ ] Accessible labels where necessary
* [ ] Reduced motion support

## Global

* [ ] Link micro-interactions
* [ ] Card micro-interactions
* [ ] Navigation transition
* [ ] No excessive motion
* [ ] No animation framework unless justified

---

# 43. Design acceptance test

Ask the following after implementation:

### Without animation

Does the website still look good?

If no:

> Fix the design.

### With animation

Does the animation make the concept easier to understand?

If no:

> Remove it.

### After 30 seconds

Does the motion become annoying?

If yes:

> Reduce or stop it.

### With reduced motion

Does the site remain equally understandable?

If no:

> Fix accessibility.

### On mobile

Does the animation still communicate the same idea?

If no:

> Simplify the composition.

---

# 44. Final visual principle

KnowledgeAssemble should not feel like:

> **A website with animations added to it.**

It should feel like:

> **A system whose visual language naturally expresses assembly, connection, exploration, and understanding.**

The strongest visual identity should come from this simple idea:

```text
        CREATE
           │
           ▼
      ┌─────────┐
      │ CONNECT │
      └────┬────┘
           │
           ▼
       EXPLORE
           │
           ▼
         SHARE
```

Motion should make that idea perceptible.

**Keep the movement quiet.
Keep the geometry simple.
Keep the meaning strong.**
