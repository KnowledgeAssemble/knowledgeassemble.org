import { useEffect } from 'react';
import type { CSSProperties } from 'react';

// The sequence ends around 1950ms; add a small buffer before marking it played.
const HERO_SEQUENCE_MS = 2100;

/**
 * Homepage hero visual — Knowledge Assembly (spec §10–§14).
 *
 * Purely decorative: the surrounding h1 and lede carry the meaning, so the SVG
 * is `aria-hidden`. The resting CSS state is the final assembled state; the
 * assembly is pure CSS keyframes gated by `[data-hero-node]` /
 * `[data-hero-line]` / `[data-hero-resolve]`, so it plays from the first paint
 * and never depends on JavaScript (spec §40). Two deliberate compositions —
 * vertical on mobile, asymmetric on desktop (spec §39).
 */
export default function KnowledgeAssembly() {
  // Mark the document once the sequence has finished so an SPA return does not
  // replay the hero. Deliberately DOM-only — no persistent gate — so a hard
  // reload starts fresh and plays again. The class is added only after the
  // sequence, never on mount, so it can never jump-cut a half-finished assembly.
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains('hero-played')) return;

    const timer = window.setTimeout(() => {
      root.classList.add('hero-played');
    }, HERO_SEQUENCE_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const nodeStyle = (delay: number): CSSProperties =>
    ({ '--enter': `${delay}ms`, '--wave': `${delay + 900}ms` }) as CSSProperties;

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
        <g strokeWidth={1.5}>
          {[
            { x1: 44, y1: 40, x2: 84, y2: 244, d: 320 },
            { x1: 112, y1: 56, x2: 84, y2: 244, d: 400 },
            { x1: 44, y1: 112, x2: 84, y2: 244, d: 480 },
            { x1: 112, y1: 132, x2: 84, y2: 244, d: 560 },
            { x1: 78, y1: 180, x2: 84, y2: 244, d: 640 },
            { x1: 44, y1: 40, x2: 44, y2: 112, d: 720 },
          ].map((l) => (
            <line
              key={`${l.x1}-${l.y1}-${l.x2}-${l.y2}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              pathLength={1}
              data-hero-line
              className="vis-line stroke-ink-tertiary"
              style={{ '--draw': `${l.d}ms` } as CSSProperties}
            />
          ))}
        </g>
        <g strokeWidth={1.5} className="fill-surface">
          {[
            { cx: 44, cy: 40, r: 8, d: 0 },
            { cx: 112, cy: 56, r: 7, d: 90 },
            { cx: 44, cy: 112, r: 8, d: 180 },
            { cx: 112, cy: 132, r: 7, d: 270 },
            { cx: 78, cy: 180, r: 7, d: 360 },
          ].map((n) => (
            <circle
              key={`${n.cx}-${n.cy}`}
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              data-hero-node
              className="stroke-ink-tertiary"
              style={nodeStyle(n.d)}
            />
          ))}
        </g>
        <circle
          cx="84"
          cy="244"
          r="16"
          strokeWidth={1.5}
          data-hero-resolve
          className="stroke-accent fill-surface"
          style={{ '--resolve': '1450ms' } as CSSProperties}
        />
        <circle
          cx="84"
          cy="244"
          r="4"
          data-hero-resolve
          className="fill-accent"
          style={{ '--resolve': '1550ms' } as CSSProperties}
        />
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
        <g strokeWidth={1.5}>
          {[
            { x1: 46, y1: 44, x2: 158, y2: 104, d: 320 },
            { x1: 132, y1: 22, x2: 158, y2: 104, d: 400 },
            { x1: 246, y1: 62, x2: 158, y2: 104, d: 480 },
            { x1: 70, y1: 158, x2: 158, y2: 104, d: 560 },
            { x1: 238, y1: 176, x2: 158, y2: 104, d: 640 },
            { x1: 46, y1: 44, x2: 70, y2: 158, d: 720 },
            { x1: 246, y1: 62, x2: 238, y2: 176, d: 800 },
          ].map((l) => (
            <line
              key={`${l.x1}-${l.y1}-${l.x2}-${l.y2}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              pathLength={1}
              data-hero-line
              className="vis-line stroke-ink-tertiary"
              style={{ '--draw': `${l.d}ms` } as CSSProperties}
            />
          ))}
        </g>
        <g strokeWidth={1.5} className="fill-surface">
          {[
            { cx: 46, cy: 44, r: 9, d: 0 },
            { cx: 132, cy: 22, r: 7, d: 90 },
            { cx: 246, cy: 62, r: 9, d: 180 },
            { cx: 70, cy: 158, r: 8, d: 270 },
            { cx: 238, cy: 176, r: 7, d: 360 },
          ].map((n) => (
            <circle
              key={`${n.cx}-${n.cy}`}
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              data-hero-node
              className="stroke-ink-tertiary"
              style={nodeStyle(n.d)}
            />
          ))}
        </g>
        <circle
          cx="158"
          cy="104"
          r="16"
          strokeWidth={1.5}
          data-hero-resolve
          className="stroke-accent fill-surface"
          style={{ '--resolve': '1450ms' } as CSSProperties}
        />
        <circle
          cx="158"
          cy="104"
          r="4"
          data-hero-resolve
          className="fill-accent"
          style={{ '--resolve': '1550ms' } as CSSProperties}
        />
      </svg>
    </>
  );
}
