import { useEffect } from 'react';

// Stages finish at ~1600ms; add a small buffer before recording the play.
const HERO_SEQUENCE_MS = 1700;

/**
 * Homepage hero visual — Knowledge Assembly (spec §10–§14).
 *
 * Purely decorative: the surrounding h1 and lede carry the meaning, so the SVG
 * is `aria-hidden`. The resting CSS state is the final assembled state; the
 * assembly is pure CSS keyframes gated by `[data-hero-seq]`, so it plays from
 * the first paint and never depends on JavaScript (spec §40). Two deliberate
 * compositions — vertical on mobile, asymmetric on desktop (spec §39).
 */
export default function KnowledgeAssembly() {
  // The component is the only writer of the session flag, and it writes only
  // after the sequence completes. The read-only head script applies the class
  // before paint on later loads; clicking the class on mid-sequence would be a
  // jump-cut, so it is never written on mount.
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

  return (
    <>
      {/* Mobile: a vertical convergence, not a shrunk desktop graph. */}
      <svg
        viewBox="0 0 168 300"
        width="168"
        height="300"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="mx-auto block h-auto w-full max-w-[200px] md:hidden"
      >
        <g className="stroke-rule" strokeWidth={1.5}>
          <line x1="44" y1="40" x2="84" y2="244" pathLength={1} data-hero-seq="2" className="vis-line" />
          <line x1="112" y1="56" x2="84" y2="244" pathLength={1} data-hero-seq="2" className="vis-line" />
          <line x1="44" y1="112" x2="84" y2="244" pathLength={1} data-hero-seq="2" className="vis-line" />
          <line x1="112" y1="132" x2="84" y2="244" pathLength={1} data-hero-seq="2" className="vis-line" />
          <line x1="78" y1="180" x2="84" y2="244" pathLength={1} data-hero-seq="2" className="vis-line" />
          <line x1="44" y1="40" x2="44" y2="112" pathLength={1} data-hero-seq="2" className="vis-line" />
        </g>
        <g strokeWidth={1.5} className="stroke-ink-tertiary fill-surface">
          <circle cx="44" cy="40" r="8" data-hero-seq="1" />
          <circle cx="112" cy="56" r="7" data-hero-seq="1" />
          <g data-hero-seq="3">
            <circle cx="44" cy="112" r="8" data-hero-seq="1" />
          </g>
          <g data-hero-seq="3">
            <circle cx="112" cy="132" r="7" data-hero-seq="1" />
          </g>
          <circle cx="78" cy="180" r="7" data-hero-seq="1" />
        </g>
        <circle
          cx="84"
          cy="244"
          r="16"
          strokeWidth={1.5}
          data-hero-seq="4"
          className="stroke-accent fill-surface"
        />
        <circle cx="84" cy="244" r="4" data-hero-seq="4" className="fill-accent" />
      </svg>

      {/* Desktop: asymmetric, varied radii and angles (spec §11). */}
      <svg
        viewBox="0 0 320 240"
        width="320"
        height="240"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="hidden h-auto w-full max-w-[360px] md:block"
      >
        <g className="stroke-rule" strokeWidth={1.5}>
          <line x1="46" y1="44" x2="158" y2="104" pathLength={1} data-hero-seq="2" className="vis-line" />
          <line x1="132" y1="22" x2="158" y2="104" pathLength={1} data-hero-seq="2" className="vis-line" />
          <line x1="246" y1="62" x2="158" y2="104" pathLength={1} data-hero-seq="2" className="vis-line" />
          <line x1="70" y1="158" x2="158" y2="104" pathLength={1} data-hero-seq="2" className="vis-line" />
          <line x1="238" y1="176" x2="158" y2="104" pathLength={1} data-hero-seq="2" className="vis-line" />
          <line x1="46" y1="44" x2="70" y2="158" pathLength={1} data-hero-seq="2" className="vis-line" />
          <line x1="246" y1="62" x2="238" y2="176" pathLength={1} data-hero-seq="2" className="vis-line" />
        </g>
        <g strokeWidth={1.5} className="stroke-ink-tertiary fill-surface">
          <circle cx="46" cy="44" r="9" data-hero-seq="1" />
          <circle cx="132" cy="22" r="7" data-hero-seq="1" />
          <g data-hero-seq="3">
            <circle cx="246" cy="62" r="9" data-hero-seq="1" />
          </g>
          <g data-hero-seq="3">
            <circle cx="70" cy="158" r="8" data-hero-seq="1" />
          </g>
          <circle cx="238" cy="176" r="7" data-hero-seq="1" />
        </g>
        <circle
          cx="158"
          cy="104"
          r="16"
          strokeWidth={1.5}
          data-hero-seq="4"
          className="stroke-accent fill-surface"
        />
        <circle cx="158" cy="104" r="4" data-hero-seq="4" className="fill-accent" />
      </svg>
    </>
  );
}
