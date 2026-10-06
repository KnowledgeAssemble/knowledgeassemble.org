# Motion & SVG Visual Layer — Implementation Plan

> **Audience:** an implementing agent (deepseek-4-flash).
> **Spec:** `docs/MOTION-WEBSITE-SPEC.md` — read it in full first. It is the
> "what" and the design authority. This document is the "how".
> **Baseline:** `main` (PR #6 merged). Start from the latest `origin/main`.

This is the highest-risk plan in the repo, and not because of the SVG. It is
risky because **the spec asks for motion on a site whose defining constraint is
that it must be a complete, readable document with JavaScript switched off.**
Almost every natural way to implement this spec breaks that. §4 states the
three mechanisms that make it safe; they are load-bearing and must not be
"simplified" back into the failure modes they exist to avoid.

---

## 1. What was verified before writing this plan

Claims in this document that were checked against the actual repo, not assumed:

- `src/components/sections/KnowledgeFlow.tsx` exists and is a semantic `<ol>`
  with real text — see §2.1.
- jsdom implements **no** `IntersectionObserver` (probe returned `undefined`)
  — §5.1 adds the stub.
- Effects **never run during prerender**: a probe component with a state-flipping
  `useLayoutEffect` rendered through `renderToStaticMarkup` leaves the initial
  state in the markup. That is the property the reveal mechanism depends on.
- Tailwind v4 emits `stroke-accent{stroke:var(--color-accent)}` and
  `fill-surface{fill:var(--color-surface)}` from the existing `@theme` block —
  token paint utilities work as-is.
- The existing reduced-motion reset in `src/styles/index.css` covers duration
  and iteration count but **not `animation-delay`** — see §4.6.
- `ProjectCard` already carries `transition-colors hover:border-rule-interactive`
  — §30's "border subtly changes" is already satisfied; only the visual nudge
  is new (§5.6).
- On `/projects`, OpenEdu renders as a **bespoke flagship panel**, not a
  `ProjectCard`; only Knowledge Systems and Experiments are cards (§5.4).
- `SiteHeader` has **no active-route indicator element** today — the active
  state is a colour change (§5.6).

---

## 2. Review of the spec — decisions before implementation

The spec is internally consistent, and its bans (§6 SVG, §7 colour, §36 no
framework, §33 reduced motion) agree with `AGENTS.md`. Four things needed a
decision. Two are baked into this plan; two are flagged for a human.

### 2.1 BLOCKING — §15–§17 would delete a working accessible component

The spec says of the homepage Knowledge Flow: *"Turn this into a visual SVG."*

**That component already exists and it is not an SVG.** `KnowledgeFlow.tsx`
is a semantic `<ol>` of six stages, each with a real number, name, and note
(`Ideas / Content / Structure / Interaction / Experience / Understanding`),
joined by `aria-hidden` arrow connectors — six-up on desktop, a single
vertical stack on mobile, which is already the stack idea from §39.

Replacing it with an SVG would:

- remove the only accessible representation of the six-stage sequence;
- violate the spec's own §34 — *"The visual must not be the only place where
  information exists"*;
- violate `AGENTS.md`'s web-document-first constraint — an SVG-only diagram is
  strictly worse than a list for no-JS readers and crawlers.

**Decision (baked in): augment, do not replace.** The `<ol>` is untouched, the
accessible and crawlable truth. A **decorative** `aria-hidden` SVG beside it
carries the path, the nodes, and the travelling particle from §17.

> **Needs your confirmation.** If you actually want the list replaced, say so
> and this plan gets revised. It will not happen silently.

### 2.2 BLOCKING — the hidden-by-default trap

The obvious scroll-reveal implementation:

```css
/* WRONG. Ships an invisible website to every no-JS reader and crawler. */
.reveal { opacity: 0; }
.reveal.is-visible { opacity: 1; }
```

`main` prerenders every route to static HTML. No-JS users never get
`.is-visible`, so prerendered content is **permanently invisible** — and
`nojs.spec.ts` would not catch it, because it asserts `h1` *text*, not computed
opacity. The same trap applies to `stroke-dashoffset` line-drawing that starts
hidden and only JS animates it to `0`.

**Decision (baked in): the resting CSS state of every visual is its final,
fully-drawn state.** The hidden start state exists only as an attribute that
JavaScript applies **before paint** (§4.2) — never in the prerendered markup,
never in a stylesheet rule that can hide content on its own. This was probed:
effects do not run during `renderToStaticMarkup`, so prerendered HTML can never
contain it.

### 2.3 The hero replays on every in-app navigation

The hero sequence is *"On initial page load"* (§12) and *"Animation plays once"*
(§42). But `src/main.tsx` uses `createRoot`, which **discards the prerendered
markup and re-renders** on mount — so returning to `/` by SPA navigation
restarts the 1.6-second assembly, forever.

**Decision (baked in):** play once per browser session, via a read-only inline
script plus a component-side writer — the exact split matters and is specified
in §4.3. Note the two wrong ways, both of which fail visibly:

- a `useState` flag flipped in an effect **flashes**: the prerendered hero
  paints at its final state, then the effect hides it, then it animates;
- the inline script *writing* the session flag on every page would consume the
  once-per-session play on a `/projects` landing — a visitor who arrives on
  `/projects` and navigates home would never see the hero assemble at all.

### 2.4 About and logo should not be built

The spec says so itself:

- **§29 About** — *"Do not introduce a new complex animation in V1."* Deferred.
- **§31 Logo** — *"If implementing this requires changing the logo asset
  substantially, defer it."* `Logo.tsx` is a static wordmark; assembling it
  means redesigning a brand asset. Deferred.

Both are out of scope. Do not build them.

### 2.5 Most of §42 and all of §43 are not machine-verifiable

§42 mixes provable items (`aria-hidden` present, reduced-motion final state,
file size) with judgements (*"meaningful visual metaphors"*,
*"no excessive motion"*). §43 is four human-judgement questions.

deepseek-4-flash cannot answer them. **Do not mark those done.** §9 defines
review gates; §10 splits the DoD into what the agent may tick and what it may
not.

---

## 3. Ground rules

1. **No animation library.** §36 forbids Framer Motion, GSAP, Lottie, Three.js,
   Rive. Stack is SVG + CSS + IntersectionObserver. **No new runtime dependency.**
2. **No new copy.** `AGENTS.md` holds copy verbatim from the PRD. Visuals are
   decorative; the existing prose already carries the meaning (§14).
3. **No new colour token.** §7 forbids a separate illustration palette. Reuse
   the existing `@theme` colour tokens.
4. **Never break web-document-first.** A visual that is invisible, empty, or
   clipped without JavaScript is a failed task, however good it looks animated.
5. **Motion is never load-bearing.** §40 — comprehension must not depend on it.
6. **The reveal system is for below-the-fold sections only.** Above-the-fold
   entry motion (the hero) uses pure CSS keyframes, which cannot flash because
   the stylesheet is render-blocking. The reason is in §4.2.
7. **One reviewable commit per phase**, each green on `npm run verify`.

---

## 4. Architecture — the three load-bearing mechanisms

### 4.1 Files

```
src/
  components/
    visuals/
      KnowledgeAssembly.tsx      # hero, desktop + mobile compositions
      KnowledgeFlowDiagram.tsx   # decorative diagram BESIDE the existing <ol>
      ProjectVisual.tsx          # keyed by project.id
      PrincipleVisual.tsx        # keyed by principle.id
      CommunityAssembly.tsx      # contributors -> knowledge
  hooks/
    useRevealOnScroll.ts         # IntersectionObserver; manages data-reveal
  styles/
    visuals.css                  # keyframes + motion rules (tokens only)
```

Named `KnowledgeFlowDiagram`, **not** `KnowledgeFlow` — the existing
`components/sections/KnowledgeFlow.tsx` keeps its name, its markup, and its
behaviour.

### 4.2 The reveal mechanism — fail-safe by construction

`src/hooks/useRevealOnScroll.ts`, exactly:

```tsx
import { useEffect, useLayoutEffect, useRef } from 'react';

// Effects never run during prerender (verified), so in Node this alias only
// keeps the prerender output quiet; in the browser it is what applies the
// pending state before paint. Use it — do not call useLayoutEffect directly.
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Marks a section pending before the browser paints it hidden, then promotes
 * it when it enters the viewport (spec §17, §18 — trigger only, never hijack
 * scroll).
 *
 * The attribute is applied imperatively and deliberately never rendered in
 * JSX: prerendered documents must not contain it, so no-JS readers, crawlers,
 * and a failed bundle always get the final state (spec §40).
 */
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      node.dataset.reveal = 'visible'; // §40: no observer, no hiding
      return;
    }

    node.dataset.reveal = 'pending';

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.dataset.reveal = 'visible';
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}
```

And in `src/styles/visuals.css`:

```css
/* Resting state IS the final state. These two rules exist only while JS is
   driving a reveal; no stylesheet rule hides content on its own. */
[data-reveal='pending'] {
  opacity: 0;
  transform: translateY(8px);
}
[data-reveal='visible'] {
  opacity: 1;
  transform: none;
}
[data-reveal='pending'],
[data-reveal='visible'] {
  transition:
    opacity var(--motion-reveal) var(--motion-ease-out),
    transform var(--motion-reveal) var(--motion-ease-out);
}
```

Why this is the safe shape — each property is deliberate:

- **`data-reveal` is applied by the hook, not present in JSX.** Verified: the
  prerender never runs effects, so prerendered HTML cannot contain `pending`.
  No-JS readers and crawlers always get fully-drawn content. If the bundle
  404s, the attribute is never applied — same guarantee.
- **`useIsomorphicLayoutEffect`, not `useEffect`**, so on a JS-enabled load the
  attribute lands *before the post-mount paint*. There is still one earlier
  paint — the prerendered markup, at its final state. That is why the reveal
  system is restricted to **below-the-fold sections** (ground rule 6): that
  first paint is offscreen, so the final-state → pending → visible sequence is
  imperceptible. Above the fold it would be a visible flash.
- **No `.js-motion` class, no inline reveal script.** An inline `<head>` script
  that gates hiding runs even when the bundle fails — leaving every reveal
  element permanently hidden and the document blank. That failure mode is why
  the gate lives inside the hook, applied only when the observer machinery is
  actually running.
- **The threshold fires once, then disconnects** — §18 trigger-only behaviour.

### 4.3 The hero — pure CSS keyframes plus a session-once split

The hero does **not** use the reveal system. It is above the fold; its assembly
is pure CSS, which cannot flash: the stylesheet is render-blocking, so the
first paint already has the keyframes applied, and `animation-fill-mode:
backwards` holds each stage's from-state during its delay.

All animated hero elements carry one shared attribute, `data-hero-seq`, and:

```css
.hero-played [data-hero-seq] {
  animation: none;
}
```

**Session-once is a read/write split — this exact division is the mechanism:**

1. An inline script in `<head>` (in **both** `index.html` **and**
   `scripts/prerender.tsx`'s `documentFor`), **read-only**:

```html
<script>
  try {
    if (sessionStorage.getItem('ka:hero-played') === '1') {
      document.documentElement.classList.add('hero-played');
    }
  } catch (e) {}
</script>
```

2. The hero component is the **only writer**, and it writes **after the
   sequence completes**, never on mount — adding the class mid-animation is a
   jump-cut from half-assembled to complete:

```tsx
const HERO_SEQUENCE_MS = 1700; // stages end at ~1600ms; 100ms buffer

useEffect(() => {
  const root = document.documentElement;
  if (root.classList.contains('hero-played')) return;
  const timer = window.setTimeout(() => {
    root.classList.add('hero-played');
    try {
      sessionStorage.setItem('ka:hero-played', '1');
    } catch {
      // Storage unavailable: the hero replays next load. Harmless.
    }
  }, HERO_SEQUENCE_MS);
  return () => window.clearTimeout(timer);
}, []);
```

Walk the cases, because each is a bug the wrong design produces:

| Scenario | What happens |
| :--- | :--- |
| First visit, lands on `/` | Script reads nothing → no class → CSS animates from first paint, no flash. Component writes class + flag at 1.7s, after completion. |
| Same session, reloads `/` | Script reads flag → class present **before paint** → static hero, no flash. |
| SPA `/` → `/projects` → `/` | The class persists on `<html>` (React only manages `#root`) → no replay. |
| First visit, lands on `/projects`, SPA → `/` | Script read nothing (it never writes), no hero existed to write the flag → the hero animates on arrival, then the component records it. The once-per-session play is not consumed by a page with no hero. |
| User leaves mid-animation | Timer cleanup: flag unset, next visit replays. Correct — they never saw it complete. |
| No JS at all | No script, no component — the CSS animation simply plays once per load. Content visible throughout (§40). |
| Reduced motion | Stages complete instantly (§4.6, delays zeroed) — timer adds the class with no visible change. |

### 4.4 Motion tokens — `:root`, not `@theme`

Define these at the top of `src/styles/visuals.css`:

```css
:root {
  --motion-micro: 180ms;    /* micro interaction        spec §4.1 */
  --motion-small: 320ms;    /* small transition         spec §4.1 */
  --motion-reveal: 500ms;   /* section reveal           spec §4.1 */
  --motion-line: 700ms;     /* line draw / assembly     spec §4.1 */
  --motion-ease-out: cubic-bezier(0.22, 0.61, 0.36, 1);
  --motion-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

Not in the `@theme` block in `index.css`. Two reasons: `@theme` is documented
(in `AGENTS.md` and the block's own header) as the single source of truth for
**colour, typography, and shape**, and Tailwind maps `@theme` namespaces to
utilities — an unverified `--motion-*` namespace buys nothing but risk. These
are consumed only by `visuals.css`, so plain custom properties are exact.
Colours used by visuals still come from `@theme` via `var(--color-*)` (§4.5).

Durations are pinned, not ranged — §4.1 gives ranges, and ranges invite drift
across five components. Every easing is a plain decelerating or symmetric
curve, per §4.2's ban on elastic/bounce/overshoot.

### 4.5 Paint conventions

Follow `src/components/common/icons.tsx` — the established convention, already
satisfying §6 and §34:

```tsx
<svg viewBox="0 0 320 240" aria-hidden="true" focusable="false" className={className}>
```

- `fill="none"`, `stroke="currentColor"`, or a token utility — verified to
  compile from the existing `@theme`: `stroke-accent`, `fill-surface`,
  `text-ink-tertiary` (for `currentColor` inheritance via a `text-*` class).
- **Never a hex literal** — §7.1.
- **Line-drawing:** set `pathLength={1}` on the element and animate
  `stroke-dashoffset: 1 → 0` with `stroke-dasharray: 1`. The attribute
  normalises the path length, so no measurement code is needed. This is the
  difference between a five-line component and a measuring hack.
- **Scaling SVG shapes:** CSS `transform` on SVG elements needs
  `transform-box: fill-box; transform-origin: center;` or the scale anchors
  to the SVG canvas, not the shape. Put both on any class that scales.

### 4.6 Reduced motion — extend the existing reset, do not replace it

`src/styles/index.css` already has:

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

This already satisfies most of §33. **Do not build a second system.** It has
one gap for this feature, and it must be fixed **in that same block**: it does
not zero `animation-delay`, so a staged sequence like the hero would sit in its
hidden `backwards` from-state for up to ~1.2s before snapping visible — a
blank hero that also makes every reduced-motion test flaky. Add to the block:

```css
    animation-delay: 0s !important;
    transition-delay: 0s !important;
```

Then add only what the reset cannot express, in `visuals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  /* A dashoffset that never animates must not stay undrawn. */
  [data-reveal='pending'],
  .vis-line {
    stroke-dashoffset: 0 !important;
  }
  /* The particle is motion, not information — remove it, do not make it
     instant. §33: no continuously moving element. */
  .vis-particle {
    display: none !important;
  }
}
```

`display: none`, not a 0.01ms animation: an instant-but-visible particle reads
as a glitch. And note the pinned `animation-delay: 0s` also makes the hero's
reduced-motion state deterministic for tests — every stage completes on the
first frame.

### 4.7 Sizing and layout shift

§42 requires no layout shift. Every visual reserves its box before it paints:

- `viewBox` plus explicit `width`/`height` attributes on the `<svg>`;
- the wrapper carries a fixed aspect ratio (`aspect-[4/3]`-style utilities or
  an explicit height) so the box is known before the SVG loads.

§6.2 adds the CLS test that enforces it.

---

## 5. Phases

Follow spec §41's order.

### 5.1 Phase 0 — foundation

1. Create `src/styles/visuals.css` with the §4.4 tokens, the §4.2 reveal rules,
   and the §4.6 reduced-motion additions (the `animation-delay` lines go into
   the **existing** reset block in `index.css`, not into `visuals.css`).
   Import `visuals.css` from `src/main.tsx`, after `index.css`.
2. Add the read-only hero script (§4.3) to `index.html` **and** to
   `documentFor` in `scripts/prerender.tsx`.
3. Add an `IntersectionObserver` stub to `src/test/setup.ts` — jsdom
   implements none (verified):

```ts
class IntersectionObserverStub {
  constructor(private readonly callback: IntersectionObserverCallback) {}
  observe(target: Element): void {
    // Default to intersecting so reveal behaviour is testable. A test that
    // needs the non-intersecting path overrides the stub for itself.
    this.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
  get root(): Element | null { return null; }
  get rootMargin(): string { return ''; }
  get thresholds(): ReadonlyArray<number> { return []; }
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
```

4. Write `src/test/visuals.test.ts` (§6.1) and `tests/e2e/visuals.spec.ts`
   (§6.2) first, and watch them fail.

### 5.2 Phase 1 — hero, Knowledge Assembly (spec §10–§14, P0)

`src/components/visuals/KnowledgeAssembly.tsx`.

**Composition** (§11): asymmetric — five inputs (Ideas, Data, Content, Context,
Structure) converging on one central Knowledge node; six circles, ~seven
connecting lines, `viewBox="0 0 320 240"`. §11: *"Do not create a perfect
symmetric network graph"* — vary radii and angles.

**Sequence** (§12) — pure CSS keyframes, `animation-fill-mode: backwards`,
staggered by delay, on `[data-hero-seq]` elements. The durations are within
§12's ranges and the **total is inside the 1.5–2.5s window** — the arithmetic
is checked, keep these numbers:

| Stage | Duration | Delay | Ends at | Keyframe |
| :--- | :--- | :--- | :--- | :--- |
| 1 Nodes appear | 400ms | 0ms | 400ms | `opacity 0→1`, `scale .96→1` |
| 2 Connections assemble | 700ms | 300ms | 1000ms | `stroke-dashoffset 1→0` (`pathLength={1}`) |
| 3 Components converge | 600ms | 700ms | 1300ms | `translate` ≤8px to final, `--motion-ease-in-out` |
| 4 Knowledge node resolves | 400ms | 1200ms | 1600ms | `opacity`, `scale` |

`HERO_SEQUENCE_MS = 1700` (§4.3) is derived from the 1600ms figure.

**§13 idle — mandatory:** after the sequence the hero is **completely still**.
No loop, no pulse; §13's optional pulse is *"not required for V1"*.

**Hero text never animates.** §12 is the visual's sequence. The `h1`, lede,
and buttons paint immediately — content first, decoration second, and no CLS
from text reflow.

**Accessibility (§14):** `aria-hidden="true"`, `focusable="false"`. Add **no
new copy** — the existing lede already says *"create, connect, explore, and
share knowledge"*, which is the conceptual message §14 requires the text to
carry.

**Mobile (§39):** *"Do not simply shrink desktop SVGs."* Two deliberate
compositions in one component:

```tsx
<div className="md:hidden">{/* vertical, viewBox 0 0 200 320 */}</div>
<div className="hidden md:block">{/* asymmetric, viewBox 0 0 320 240 */}</div>
```

Duplicating the SVG is safe here specifically because §6 forbids filters and
gradients, so there are no `id` / `url(#…)` references to collide. The
`hidden` copy does not animate while `display: none`.

### 5.3 Phase 2 — Knowledge Flow diagram (spec §15–§18, P0)

Per §2.1: **add, do not replace.** `sections/KnowledgeFlow.tsx` is not modified.

- New `KnowledgeFlowDiagram.tsx` in the Concept `Section` on the homepage,
  **above** the existing `<ol>`. `aria-hidden="true"`, decorative — the `<ol>`
  carries the meaning.
- Self-contained. Do **not** try to align its dots to card positions across
  breakpoints — it illustrates the sequence, it is not a chart of the grid.
- §17 sequence, via `useRevealOnScroll` (this section is below the fold):
  path draws (`pathLength={1}`, `--motion-line`), nodes appear staggered, one
  particle travels the path.
- **§17 loop: defer it.** The 5–10s loop is optional; implement a **single
  pass** (~5s). This respects §13's "prefer static over continuous motion"
  and pre-answers §43's "after 30 seconds, does it become annoying?" Flag the
  loop as a possible follow-up, not a gap.
- **Particle: CSS `offset-path` + `offset-distance` keyframes**, class
  `vis-particle`. **The fallback if `offset-path` misbehaves is to drop the
  particle, not to switch technology** — SMIL `<animateMotion>` is *not* a CSS
  animation, the existing reduced-motion reset cannot stop it, and it would
  survive only via the separate `display: none` rule. A missing particle is a
  smaller deviation than a reduced-motion violation.
- §18: `IntersectionObserver` as a trigger only. No scroll hijacking, no
  pinning, no horizontal scroll, no scroll-progress-driven animation.

### 5.4 Phase 3 — project visuals (spec §19–§23, P1)

Grounded placement — `/projects` does **not** render three cards:

- **OpenEdu** is the bespoke flagship panel. `ProjectsPage` renders
  `<ProjectVisual projectId="openedu" />` inside that panel, above the
  description `dl`.
- **Knowledge Systems** and **Experiments** are `ProjectCard`s. `ProjectCard`
  gains an opt-in `withVisual?: boolean` prop rendering
  `<ProjectVisual projectId={project.id} />` in a fixed-height slot above the
  tagline; `ProjectsPage` passes it for these two.
- **The homepage does not pass `withVisual`.** `ProjectCard` is shared with the
  homepage's "What we're building" grid; rendering visuals there would put
  three more animated diagrams on a page that already has the hero and the
  flow diagram. §19 locates this work on the Projects page; §44's restraint
  agrees. Opt-in keeps the homepage unchanged.

The three ids are fixed by `src/content/projects.ts`: `openedu`,
`knowledge-systems`, `experiments`. Concepts per §20–§22:

| id | Visual |
| :--- | :--- |
| `openedu` | `□ → □ → ◇ → □` — content, activity, interaction, experience |
| `knowledge-systems` | small readable graph, ~5 nodes |
| `experiments` | one path branching into two |

**§23 interaction:** on **hover and focus-visible** of the card's link, either
translate the SVG 2–4px or draw one connection. Banned by §23: `scale > 1.05`,
rotation, large movement, glow. Keyboard focus must produce the identical
state — test with `.focus()`, never only `:hover`.

Each animation runs **once** per trigger, 800–1200ms. §20: *"Do not
continuously animate."*

**Robustness:** `ProjectVisual` returns `null` for an unknown id — a project
added to `content/projects.ts` must not break the build. Guard-tested (§6.1).

### 5.5 Phase 4 — principle visuals (spec §24–§26, P1)

`PrincipleVisual.tsx` keyed by `principle.id`, rendered by `PrincipleCard` in a
**fixed-height slot (h-12) between the number and the title** — identical
across all seven so the grid keeps its rhythm.

Ids from `src/content/principles.ts`: `open-by-default`,
`knowledge-should-be-portable`, `composable-over-monolithic`,
`experience-matters`, `accessibility-is-foundational`,
`human-judgment-matters`, `build-test-learn`.

Metaphors are dictated by §25 — follow them, do not improvise:

| id | §25 metaphor |
| :--- | :--- |
| `open-by-default` | container with one boundary separating |
| `knowledge-should-be-portable` | object moving between two containers |
| `composable-over-monolithic` | three pieces combining into one form |
| `experience-matters` | `● → ○ → ◇` — static becomes a path |
| `accessibility-is-foundational` | several paths converging on one open route — **abstract, no disability symbols** |
| `human-judgment-matters` | `human ↔ machine` → shared outcome — **not an `AI → human` hierarchy** |
| `build-test-learn` | circular Build → Test → Learn loop |

The two bolded prohibitions are §25's own, restated because they are the easy
ones to get wrong.

§26: static by default, small reveal on viewport entry (per-card observer —
each card is its own target, so reveals stagger naturally by scroll position),
micro-animation on hover/focus. `build-test-learn` is the **only** visual
permitted a repeating motion (§25). Keep it slow; the reduced-motion reset
collapses it to one iteration automatically (§4.6).

### 5.6 Phase 5 — community visual (spec §27–§28, P2)

`CommunityAssembly.tsx`, placed in the "Ways to take part" `Section` on
`/community`, above the five `CommunityCard`s. Five contributor nodes
converging on one Knowledge node, keyed to the real track ids in
`src/content/community.ts`: `educators`, `developers`, `researchers`,
`families-and-learners`, `contributors`.

The labels already exist in the page content (§27) — do **not** duplicate them
into the SVG as `<text>`. Two sources of truth for the same labels is exactly
the drift §9 warns about.

§28: nodes appear, lines draw to the centre, central node appears,
1200–1800ms total, no loop.

### 5.7 Phase 6 — micro-interactions (spec §30)

Grounded against what exists:

- **Links:** `Button`'s `withArrow` arrow glyph shifts `translateX` 2–4px on
  hover/focus (`translate-x-1` = 4px). Add `group` to the control and
  `transition-transform group-hover:translate-x-1
  group-focus-visible:translate-x-1` to the arrow. Under reduced motion the
  global reset makes it instant — §33 explicitly allows immediate state
  changes.
- **Cards:** the border change **already exists**
  (`transition-colors hover:border-rule-interactive`). Only the 2–3px visual
  nudge is new, and only on `/projects` where visuals render.
- **Navigation:** there is **no active-route indicator today** — active state
  is a colour change on `NavLink`. Add a small `::after` underline on the
  active desktop `NavLink` that animates in via `scale-x` over
  `--motion-small`, defined in `visuals.css`. Per-link CSS only — do **not**
  build a sliding indicator that measures link positions; §30 says "may
  animate" and *"Do not animate the entire navigation bar"*, and a
  position-measuring element is the kind of machinery §8 and §9 tell you not
  to build. If the underline reads as too much at Gate D, drop it — it is the
  one §30 item that adds new UI rather than animating existing UI.

### 5.8 Phase 7 — audits

Run §8. Do not start until 1–6 are done.

---

## 6. Tests

Spec §37. The existing suite is the baseline; everything here is additive.

### 6.1 `src/test/visuals.test.ts` (new, Vitest)

| Assertion | Guards against |
| :--- | :--- |
| `ka:hero-played` appears in **both** `index.html` and `scripts/prerender.tsx` | The prerendered pages silently diverging from the dev template — a stale `documentFor` means the hero replays every load in production and nothing else fails |
| No `data-reveal` in any `src/components/visuals/` JSX | The §2.2 catastrophe — a hidden-by-default state reaching the prerendered document |
| No `fill="#`, `stroke="#`, `rgb(`, `hsl(` in `src/components/visuals/` | §7 and the existing colour guard |
| No `<filter`, `<feGaussianBlur`, `<image`, `<foreignObject`, `linearGradient`, `radialGradient`, `@font-face` in `src/components/visuals/` or `visuals.css` | §6 bans (`foreignObject` is the loophole around "simple geometry") |
| No `infinite` in `visuals.css` or the visuals components outside `build-test-learn` | §13, §21, §28 |
| Every visual component root is `aria-hidden="true"` and `focusable="false"` | §34 |
| No `tabIndex` on a decorative visual | §37 ("no SVG receives keyboard focus accidentally") |
| `src/components/visuals/` total under 150 KB, each file under 20 KB | §35 |
| `package.json` has no `framer-motion`, `gsap`, `lottie`, `three`, `rive` | §36 |
| `ProjectVisual('nope')` and `PrincipleVisual('nope')` return null | content growth breaking the build |

### 6.2 `tests/e2e/visuals.spec.ts` (new, Playwright)

Deterministic techniques matter here — CSS animations run without page
JavaScript, so a naive no-JS opacity assertion races the keyframes:

- **No-JS visibility, reduced motion** (the §33/§14 acceptance case):
  `browser.newContext({ javaScriptEnabled: false })` **plus**
  `page.emulateMedia({ reducedMotion: 'reduce' })` — media emulation is
  browser-level and works with page JS disabled. With §4.6's zeroed delays
  every stage completes on the first frame, so
  `await expect(locator).toHaveCSS('opacity', '1')` is deterministic. Assert it
  for the hero and the flow diagram, plus a non-zero `boundingBox`.
- **No-JS visibility, normal motion:** the same without emulation, relying on
  `toHaveCSS`'s retry — the sequence ends at 1.6s, well inside the default
  timeout. This case exists to prove the animation is CSS, not JS-driven.
- **Reduced motion (JS on):** no `[data-hero-seq]` element has
  `animation-name` other than `none` after the sequence; no element reports
  `animation-iteration-count: infinite`; `.vis-particle` computes to
  `display: none`; every `stroke-dashoffset` computes to `0px`.
- **Hero session-once:** load `/`, wait for `<html>` to gain `hero-played`
  (`expect.poll`), then SPA-navigate to `/projects` and back — a
  `[data-hero-seq]` element must report `animation-name: none` (it did not
  restart).
- **Reveal:** a below-fold section scrolls into view and its `data-reveal`
  becomes `visible`.
- **Keyboard:** `.focus()` a project card link and assert the §23 interactive
  state — never only `:hover`.
- **CLS:** a `PerformanceObserver` on `layout-shift`, summing entries where
  `!hadRecentInput`, cumulative `< 0.1` after load on all five routes. §42's
  "no layout shift" — nothing enforces it today. Chromium-only, which is all
  Playwright runs.
- **Overflow:** no horizontal overflow at 320px on every route that gained a
  visual.
- `a11y.spec.ts` must keep passing **unmodified** — `aria-hidden` decorative
  SVGs do not add axe violations.

### 6.3 Extend existing specs

- `nojs.spec.ts`: add the hero/flow computed-visibility assertions above
  (its current `h1`-text assertions cannot detect §2.2 — that is the gap).

### 6.4 Test-first, per `AGENTS.md`

Write both spec files before the components and watch them fail. In
particular, observe the no-JS computed-opacity test failing against a
deliberately naive hidden-by-default implementation first — otherwise you
have not verified it detects the thing it exists to detect.

---

## 7. Constraints the existing guards already enforce

These are in `src/test/guards.test.ts`, scan `src/**`, and will fire on the new
files. **Do not add exemptions.** If a guard fires, the visual is wrong.

### 7.1 Colour literals

`productionFiles` = every `.ts`, `.tsx`, **and `.css`** under `src/`, excluding
only `src/styles/index.css`. `visuals.css` is scanned: no hex, no `rgb()`, no
`hsl()`. Use `var(--color-accent)` and the verified token utilities.

### 7.2 Forbidden visuals

`FORBIDDEN_VISUALS = /shadow-|drop-shadow|bg-gradient|rounded-full|rounded-pill|rounded-\[/`
applies to `.ts`/`.tsx`. Consequences for SVG work:

- no `filter="drop-shadow(...)"` — §6 bans filters anyway;
- no `rounded-full` / `rounded-pill` / `rounded-[…]` classNames — use the
  `<circle>` `r` attribute, which is not a Tailwind class;
- the regex matches the substring `shadow-`, so not even a **comment**
  containing `box-shadow:` in a `.tsx` file is safe.

### 7.3 Inline URLs

Only `src/config/links.ts` and `src/config/site.ts` may contain `https?://`.
Never a URL in a visual — §6 bans external SVG dependencies anyway.

---

## 8. Manual verification (cannot be automated)

Spec §38, §39, §43. State what you did in the commit message, per `AGENTS.md`.

1. **§43 without animation** — disable animations: does the site still look
   good? If no, the *design* is wrong, not the animation.
2. **§43 with animation** — does it make the concept clearer? If no, remove it.
3. **§43 after 30 seconds** — does anything become annoying? Watch the hero and
   the `build-test-learn` loop specifically.
4. **§43 reduced motion** — equally understandable?
5. **§43 mobile** — same idea at 375px? Deliberate composition, not a shrunk one.
6. **§38 browsers** — Chrome, Safari, Firefox, desktop and mobile. Especially
   `offset-path` for the particle and `stroke-dashoffset` rendering. Report
   honestly: a Safari difference you did not test is a difference you did not
   verify.
7. **§35 performance** — Lighthouse before/after. Today's build is ~351 KB JS /
   ~85 KB CSS; motion must not regress it meaningfully.
8. **§38 no layout shift** — confirm visually as well as by test.

---

## 9. Review gates — stop and ask

deepseek-4-flash cannot judge §43. Do not self-certify these. At each gate,
report what you built, what the tests prove, and what you could not verify —
then stop and wait for a human.

| Gate | After | Human must confirm |
| :--- | :--- | :--- |
| **A** | Phase 1 (hero) | Composition is balanced and asymmetric (§11); the 4-stage sequence reads as assembly; idle state genuinely still; **session-once is the desired semantics** (per-load replay is the alternative — flip by removing the script and timer) |
| **B** | Phase 2 (Flow) | **Confirm §2.1** — augmenting rather than replacing the `<ol>`; particle reads as knowledge moving, not a gimmick |
| **C** | Phase 4 (principles) | All seven metaphors are *meaningful*, not decorative (§2); the two §25 prohibitions honoured; simultaneous entry does not read as distracting (§26) |
| **D** | Phase 7 | Full §43 walkthrough; the nav underline from §5.6 stays or goes |

---

## 10. Definition of done

**The agent may tick these itself:**

- [ ] All specified visuals exist on their pages (`visuals.spec.ts`).
- [ ] Every visual's resting state is fully visible with JS disabled
      (computed-opacity tests, both motion modes).
- [ ] No `data-reveal` exists in prerendered or component markup — only ever
      applied by the hook.
- [ ] Every decorative visual is `aria-hidden="true"`, `focusable="false"`.
- [ ] Reduced motion: final state on first frame, `stroke-dashoffset: 0`,
      particle `display: none`, no infinite iteration.
- [ ] Hero plays once per session and never re-animates on SPA return.
- [ ] `ka:hero-played` script present in `index.html` **and**
      `scripts/prerender.tsx`.
- [ ] No new runtime dependency; §36 clean.
- [ ] No new colour token; no hex literal under `src/`.
- [ ] No layout shift (CLS `< 0.1`); no horizontal overflow at 320px.
- [ ] `npm run verify` green, with `a11y.spec.ts` and `nojs.spec.ts`
      unmodified in intent.
- [ ] The no-JS document still communicates every route's content.

**Requires a human — do not self-tick:**

- [ ] §42 "Meaningful visual metaphors".
- [ ] §42 "No excessive motion".
- [ ] §42 "No simultaneous distracting animations".
- [ ] §43, all four questions.
- [ ] §38 Safari and Firefox.
- [ ] §39 mobile compositions are deliberate, not shrunk.

**Explicitly out of scope (spec says defer — do not build):**

- [ ] §29 About page animation.
- [ ] §31 logo assembly.

---

## 11. Pitfalls

1. **Never hide content with a resting stylesheet rule.** The hidden state
   exists only as a hook-applied attribute that prerendering cannot emit.
   Getting this backwards ships an invisible site to no-JS readers and every
   crawler, and the existing suite will not notice. §2.2, §4.2.
2. **No `.js-motion`-style inline gate.** An inline script runs even when the
   bundle fails; gating hidden states on it leaves the document blank. The
   gate lives inside the hook. §4.2.
3. **Never flip a play/animate flag from React state on mount.** The
   prerendered content paints first, so the state flip hides it afterwards —
   a flash. The hero's decision is made pre-paint by the read-only script, and
   recorded post-completion by the component. §4.3.
4. **The inline script reads; the hero component writes.** If the script
   writes, a `/projects` landing consumes the session play and the visitor
   never sees the hero. If the component writes on mount, adding the class
   mid-sequence is a jump-cut. §4.3's table walks every case.
5. **Reveal = below the fold only.** Above-the-fold entry motion must be pure
   CSS keyframes (`fill-mode: backwards`), which cannot flash. §4.2, rule 6.
6. **`documentFor` and `index.html` must stay in sync.** Two copies of the hero
   script. Guard-tested on the `ka:hero-played` marker. §4.3.
7. **Do not replace the Knowledge Flow `<ol>`.** §2.1.
8. **Zero the animation delays in the existing reduced-motion reset.** Without
   it, staged sequences sit hidden for up to ~1.2s under reduced motion, and
   every reduced-motion test becomes flaky. §4.6.
9. **Do not build a second reduced-motion system.** Extend the existing block;
   add only what it cannot express. §4.6.
10. **`visuals.css` is scanned by the colour guard.** No hex, ever. §7.1.
11. **`pathLength={1}` for line-drawing** — not measured dash lengths. §4.5.
12. **`transform-box: fill-box` when scaling SVG shapes** — or the scale anchors
     to the canvas, not the shape. §4.5.
13. **`useIsomorphicLayoutEffect`, not `useLayoutEffect` directly.** Effects
     never run in the prerender either way (verified), but the alias keeps the
     build output quiet and the browser timing correct. §4.2.
14. **The `IntersectionObserver` stub must exist before any component test.**
     jsdom implements none (verified). §5.1.
15. **Do not build About or the logo.** §2.4.
16. **Do not build a generic SVG framework** (§9). Five components, not a
     `<Visual>` engine with props.
17. **Do not add exemptions to `guards.test.ts`.** If a guard fires on your
     visual, the visual is wrong.

---

## 12. First actions

```bash
git fetch origin && git checkout main && git pull
npm install
npm run verify          # must be green before you start
```

Then Phase 0 (§5.1). Write `src/test/visuals.test.ts` and
`tests/e2e/visuals.spec.ts` first, and watch them fail.
