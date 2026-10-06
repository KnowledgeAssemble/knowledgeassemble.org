import type { CSSProperties } from 'react';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

type KnowledgeFlowDiagramProps = {
  className?: string;
};

const PATH = 'M 40 56 L 128 24 L 216 52 L 304 20 L 392 48 L 448 28';

// Six stages across the width. The last is the destination and resolves; the
// four in between are "lit" by the token as it passes.
const nodes = [
  { x: 40, y: 56, d: 0, activate: false, resolve: false },
  { x: 128, y: 24, d: 120, activate: true, resolve: false },
  { x: 216, y: 52, d: 240, activate: true, resolve: false },
  { x: 304, y: 20, d: 360, activate: true, resolve: false },
  { x: 392, y: 48, d: 480, activate: true, resolve: false },
  { x: 448, y: 28, d: 600, activate: false, resolve: true },
];

/**
 * Decorative companion to `sections/KnowledgeFlow.tsx`, not a replacement: the
 * semantic `<ol>` remains the accessible, crawlable truth (spec §34). This SVG
 * assembles the same six-stage path and, on reveal, pops the nodes, draws the
 * line, and lights each stage in sequence with an activation wave that resolves
 * at the final stage (spec §15–§18). It is `aria-hidden`.
 */
export default function KnowledgeFlowDiagram({ className = '' }: KnowledgeFlowDiagramProps) {
  const ref = useRevealOnScroll<HTMLDivElement>();

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 480 80"
        width="480"
        height="80"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="h-auto w-full"
      >
        <path
          d={PATH}
          pathLength={1}
          strokeWidth={1.5}
          strokeLinecap="round"
          className="vis-draw stroke-accent"
          style={{ '--draw': '200ms' } as CSSProperties}
        />
        {nodes.map((n) => {
          const isDestination = n.resolve;
          const isSource = n.d === 0;
          const style: CSSProperties = isDestination
            ? ({ '--resolve': '2400ms' } as CSSProperties)
            : ({ '--d': `${n.d}ms`, '--wave': `${1050 + n.d * 2.5}ms` } as CSSProperties);
          return (
            <circle
              key={n.x}
              cx={n.x}
              cy={n.y}
              r={isDestination ? 6 : 5}
              strokeWidth={1.5}
              className={
                isDestination
                  ? 'vis-resolve fill-verified-subtle stroke-verified'
                  : `vis-node${n.activate ? ' vis-activate' : ''} fill-surface ${
                      isSource ? 'stroke-accent' : 'stroke-ink-tertiary'
                    }`
              }
              style={style}
            />
          );
        })}
      </svg>
    </div>
  );
}
