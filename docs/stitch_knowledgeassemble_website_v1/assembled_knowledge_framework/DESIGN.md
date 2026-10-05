---
name: Assembled Knowledge Framework
colors:
  surface: '#f8f9ff'
  surface-dim: '#d8dadf'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3f9'
  surface-container: '#eceef3'
  surface-container-high: '#e6e8ed'
  surface-container-highest: '#e1e2e8'
  on-surface: '#191c20'
  on-surface-variant: '#41484c'
  inverse-surface: '#2e3135'
  inverse-on-surface: '#eff0f6'
  outline: '#71787d'
  outline-variant: '#c0c7cc'
  surface-tint: '#31647a'
  primary: '#003748'
  on-primary: '#ffffff'
  primary-container: '#164e63'
  on-primary-container: '#8dbed7'
  inverse-primary: '#9ccee6'
  secondary: '#3a6752'
  on-secondary: '#ffffff'
  secondary-container: '#bceed3'
  on-secondary-container: '#406d58'
  tertiary: '#2c333b'
  on-tertiary: '#ffffff'
  tertiary-container: '#424952'
  on-tertiary-container: '#b1b8c2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bee9ff'
  primary-fixed-dim: '#9ccee6'
  on-primary-fixed: '#001f2a'
  on-primary-fixed-variant: '#144c61'
  secondary-fixed: '#bceed3'
  secondary-fixed-dim: '#a1d1b8'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#224f3c'
  tertiary-fixed: '#dce3ee'
  tertiary-fixed-dim: '#c0c7d1'
  on-tertiary-fixed: '#151c24'
  on-tertiary-fixed-variant: '#404750'
  background: '#f8f9ff'
  on-background: '#191c20'
  surface-variant: '#e1e2e8'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses a restrained, quiet, intellectual, and technical ethos tailored for an open-source umbrella foundation stewarding open protocols and knowledge systems. It balances archival rigor with modern digital architecture. 

The aesthetic is grounded in humanist functionalism—clean structural forms, meticulous alignment, quiet surface hierarchies, and visible care for legibility. Rather than relying on transient design fads, decorative gradients, or artificial dimensionality, the system communicates credibility through unhurried whitespace, hairline division, and strict typographic order.

The emotional signature should evoke:
- **Quiet Authority:** Scholarly conviction without bureaucratic coldness.
- **Architectural Clarity:** Structures feel built from transparent, modular components that honor data integrity.
- **Human Warmth within Systematic Precision:** Tactile off-white paper tones balanced by precise, monospaced metadata and ink-like text weights.

## Colors

The palette is tuned around archival ink on pressed warm stock, accented with deep mineral tones.

### Palette Architecture
- **Canvas & Backgrounds:** Base canvas lives on `#FBFBF9` with secondary layered panels on `#F7F7F4` and active/raised surfaces on pure white `#FFFFFF`. These tones prevent glare while offering a warmer, more human backdrop than harsh industrial grays.
- **Text & Contrast:** Primary text is set in deep charcoal (`#1C1F23`), providing accessible contrast ratios exceeding WCAG AAA standards. Secondary text uses muted slate (`#545B64`), and tertiary/caption text rests at `#737A84`.
- **Structural Accents:** 
  - **Primary Accent (`#164E63`):** A deep petrol blue-green used for dominant interactive triggers, primary navigation indicators, and focused anchors.
  - **Secondary Accent (`#2D5A46`):** A forest mineral green reserved for operational status badges, verified protocol indicators, and secondary milestones.
- **Borders & Rules:** Hairline separators and card perimeters use `#E2E2DC` (with `#CECEC6` for interactive or hovered perimeters), strictly preserving structural outlines without visual weight.

Avoid high-saturation neon signifiers or color-field washes. State changes are communicated via ink shifts and tonal filling rather than radiant hues.

## Typography

The typography pairs the structural lucidity of **IBM Plex Sans** for primary text and hierarchy with the calculated precision of **JetBrains Mono** for technical telemetry, protocol hashes, metadata fields, and tags.

### Hierarchy & Composition Rules
- **Display and Headers:** Set tightly with subtle negative letter spacing to project deliberate authority. Never transform headings into all-caps.
- **Body & Longform:** Built with an accessible x-height and generous line height (`1.6x` body default) to ensure effortless scanning across documentation, specification whitepapers, and knowledge graphs.
- **Technical Monospace:** JetBrains Mono is strictly leveraged for metadata (timestamps, version tags, repository references, telemetry readouts, status pills). Monospace tokens use slight positive letter-spacing (`0.02em` to `0.04em`) to optimize readability at small dimensions.

## Layout & Spacing

The layout is grounded in a classic 12-column grid system with generous structural margins, reflecting traditional print layout frameworks translated to high-density web surfaces.

### Layout Philosophy
- **Grid Discipline:** Content follows a 12-column responsive layout on desktop viewports (max-width `1280px` centered), 6 columns on tablet, and single/dual-column flows on mobile.
- **Vertical Rhythm:** Rooted in strict 4px base increments, with layout sections organized around open intervals (`space-lg` to `space-xl`) to give complex schemas and technical texts adequate breathing space.
- **Structural Density:** While margins and article containers are generous, component internals (table rows, key-value trees, technical inspection drawers) maintain high information density without visual crowding.

## Elevation & Depth

This system intentionally rejects heavy drop shadows, blurred ambient lighting, and artificial 3D depths. Depth is achieved entirely through **low-contrast outlines** and **tonal layering**.

### Elevation Rules
- **Base Level (Canvas):** The root page sits on `#FBFBF9`.
- **Level 1 (Cards, Code Blocks, Inset Containers):** Containers use pure `#FFFFFF` or `#F7F7F4` backgrounds bordered by a precise 1px solid stroke in `#E2E2DC`.
- **Level 2 (Dropdowns, Floating Overlays, Modals):** Contained by a crisp `#CECEC6` hairline border and supported by an ultra-diffused, ambient micro-shadow (`0 4px 16px rgba(28, 31, 35, 0.04)`). The shadow functions purely to detach the overlay from underlying text rather than simulate physical altitude.
- **Separators:** All visual dividers between regions must be 1px solid hairline rules (`#E2E2DC`), aligned directly to the spatial grid.

## Shapes

The shape system adopts a **soft, architectural geometry** (`roundedness: 1`). 

- Default elements (buttons, text inputs, code boxes, badges) carry a subtle `0.25rem` (4px) corner radius.
- Cards, panels, and structural dialogs employ a `0.5rem` (8px) radius.
- Avoid round "pill" shapes and circular avatars for organizations. Shapes should feel machined, orderly, and architectural rather than playful or toy-like.

## Components

### Buttons
- **Primary:** Background in `#164E63`, text in `#FFFFFF`, with `0.25rem` radius. Padding: `0.5rem 1rem`. Font: IBM Plex Sans Medium. Hover state deepens tone to `#113B4B` without expanding dimensions.
- **Secondary / Outline:** Background in `#FFFFFF` or transparent, border 1px solid `#E2E2DC`, text in `#1C1F23`. Hover shifts border to `#164E63` and text to `#164E63`.
- **Tertiary / Ghost:** Text `#545B64`, no border, background transparent. Hover transitions to `#F7F7F4` with `#1C1F23` text.
- **Focus Rings:** Uncompromising 2px offset outline in `#164E63` for total keyboard accessibility.

### Technical Badges & Chips
- Set exclusively in **JetBrains Mono** (`label-sm`).
- Bordered by a 1px solid perimeter matching their categorical context.
- **Neutral Badges:** `#F7F7F4` background, `#E2E2DC` border, `#545B64` text.
- **Active Protocol / Verified:** `#F2F7F4` background, `#2D5A46` border, `#2D5A46` text.
- **Spec / Metadata:** Minimal hairline frame with no fill; clean technical stamp appearance.

### Cards & Assemblies
- Background in `#FFFFFF` over the `#FBFBF9` canvas.
- Perimeter set to 1px hairline `#E2E2DC`.
- Internal padding calibrated to `space-lg` (`1.5rem`).
- Header areas feature a hairline bottom rule separating title and version metadata from body content.

### Inputs & Form Fields
- Surface set to `#FFFFFF`, border 1px solid `#E2E2DC`, text `#1C1F23`.
- Labels rendered in IBM Plex Sans medium, with secondary helper text or field types denoted in JetBrains Mono.
- Active focus state: border immediately hardens to `#164E63` with no blurry glow.

### Checkboxes & Radios
- Box size: 16px square with 2px radius for checkboxes; 16px circle for radios.
- Unchecked: `#FFFFFF` surface with `#CECEC6` 1px border.
- Checked: `#164E63` solid fill with white structural glyph (check mark or inset dot).

### Metadata Trees & Data Lists
- Alternating or rule-divided lists using 1px `#E2E2DC` horizontal lines.
- Left column: Parameter/Key in `code-md` muted slate (`#545B64`).
- Right column: Value/Payload in `body-md` or `code-md` deep charcoal (`#1C1F23`).