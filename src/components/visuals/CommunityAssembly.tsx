import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

type CommunityAssemblyProps = {
  className?: string;
};

const contributors = [
  { cy: 36 },
  { cy: 72 },
  { cy: 108 },
  { cy: 144 },
  { cy: 180 },
] as const;

/**
 * Contributors assembling knowledge (spec §27–§28). Decorative: the five track
 * labels already exist in the page copy, so they are deliberately not repeated
 * into the SVG. Draws on reveal, then holds still.
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
        <g className="stroke-rule" strokeWidth={1.5}>
          {contributors.map(({ cy }) => (
            <line
              key={cy}
              x1="48"
              y1={cy}
              x2="240"
              y2="108"
              pathLength={1}
              className="vis-draw"
            />
          ))}
        </g>
        <g strokeWidth={1.5} className="stroke-ink-tertiary fill-surface">
          {contributors.map(({ cy }) => (
            <circle key={cy} cx="40" cy={cy} r="8" />
          ))}
        </g>
        <circle cx="256" cy="108" r="18" strokeWidth={1.5} className="stroke-accent fill-surface" />
        <circle cx="256" cy="108" r="5" className="fill-accent" />
      </svg>
    </div>
  );
}
