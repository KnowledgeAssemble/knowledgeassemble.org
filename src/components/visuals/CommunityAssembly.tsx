import type { CSSProperties } from 'react';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

type CommunityAssemblyProps = {
  className?: string;
};

const contributors = [
  { cy: 36, d: 0 },
  { cy: 72, d: 100 },
  { cy: 108, d: 200 },
  { cy: 144, d: 300 },
  { cy: 180, d: 400 },
] as const;

/**
 * Contributors assembling knowledge (spec §27–§28). Decorative: the five track
 * labels already exist in the page copy, so they are deliberately not repeated
 * into the SVG. On reveal the contributor nodes pop in sequence, their lines
 * draw toward the centre, and the central node resolves.
 */
export default function CommunityAssembly({ className = '' }: CommunityAssemblyProps) {
  const ref = useRevealOnScroll<HTMLDivElement>();

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 320 216"
        width="320"
        height="216"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="h-auto w-full"
      >
        <g strokeWidth={1.5}>
          {contributors.map(({ cy }, i) => (
            <line
              key={cy}
              x1="40"
              y1={cy}
              x2="256"
              y2="108"
              pathLength={1}
              className="vis-draw stroke-ink-tertiary"
              style={{ '--draw': `${200 + i * 100}ms` } as CSSProperties}
            />
          ))}
        </g>
        <g strokeWidth={1.5} className="fill-surface">
          {contributors.map(({ cy, d }) => (
            <circle
              key={cy}
              cx="40"
              cy={cy}
              r="8"
              className="vis-node stroke-ink-tertiary"
              style={{ '--d': `${d}ms` } as CSSProperties}
            />
          ))}
        </g>
        <circle
          cx="256"
          cy="108"
          r="18"
          strokeWidth={1.5}
          className="vis-resolve stroke-accent fill-surface"
          style={{ '--resolve': '1500ms' } as CSSProperties}
        />
        <circle
          cx="256"
          cy="108"
          r="5"
          className="vis-resolve fill-accent"
          style={{ '--resolve': '1600ms' } as CSSProperties}
        />
      </svg>
    </div>
  );
}
