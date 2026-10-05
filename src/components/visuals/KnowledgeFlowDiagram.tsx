import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

type KnowledgeFlowDiagramProps = {
  className?: string;
};

/**
 * Decorative companion to `sections/KnowledgeFlow.tsx`, not a replacement: the
 * semantic `<ol>` remains the accessible, crawlable truth (spec §34). This SVG
 * draws the same six-stage path and, on reveal, draws the line and sends one
 * particle along it (spec §15–§18). It is `aria-hidden`.
 */
export default function KnowledgeFlowDiagram({ className = '' }: KnowledgeFlowDiagramProps) {
  const ref = useRevealOnScroll<HTMLDivElement>();

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 320 120"
        width="320"
        height="120"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="h-auto w-full"
      >
        <path
          d="M 24 84 L 78 48 L 132 78 L 186 44 L 240 76 L 296 44"
          pathLength={1}
          strokeWidth={1.5}
          strokeLinecap="round"
          className="vis-draw stroke-accent"
        />
        <g strokeWidth={1.5}>
          <circle cx="24" cy="84" r="5" className="fill-surface stroke-ink-tertiary" />
          <circle cx="78" cy="48" r="5" className="fill-surface stroke-ink-tertiary" />
          <circle cx="132" cy="78" r="5" className="fill-surface stroke-ink-tertiary" />
          <circle cx="186" cy="44" r="5" className="fill-surface stroke-ink-tertiary" />
          <circle cx="240" cy="76" r="5" className="fill-surface stroke-ink-tertiary" />
          <circle cx="296" cy="44" r="6" className="fill-verified-subtle stroke-verified" />
        </g>
        <circle className="vis-particle fill-accent" cx="24" cy="84" r="3" />
      </svg>
    </div>
  );
}
