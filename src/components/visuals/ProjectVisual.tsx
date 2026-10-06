type ProjectVisualProps = {
  projectId: string;
  className?: string;
};

const svgProps = {
  viewBox: '0 0 160 56',
  width: 160,
  height: 56,
  fill: 'none',
  'aria-hidden': true,
  focusable: false,
} as const;

/**
 * Small project illustrations (spec §19–§23), keyed by the ids in
 * `src/content/projects.ts`. Decorative (`aria-hidden`); the card copy carries
 * the meaning. Returns null for an unknown id, so adding a project to the
 * content file cannot break the build.
 */
export default function ProjectVisual({ projectId, className = '' }: ProjectVisualProps) {
  if (projectId === 'openedu') {
    return (
      <svg {...svgProps} className={className}>
        <g className="stroke-rule" strokeWidth={1.5}>
          <line x1="30" y1="28" x2="54" y2="28" />
          <line x1="70" y1="28" x2="92" y2="28" />
          <line x1="116" y1="28" x2="134" y2="28" />
        </g>
        <g strokeWidth={1.5} className="stroke-ink-tertiary fill-surface">
          <rect x="14" y="20" width="16" height="16" rx="2" />
          <rect x="54" y="20" width="16" height="16" rx="2" />
          <rect x="134" y="20" width="16" height="16" rx="2" />
        </g>
        <polygon
          points="104,14 116,28 104,42 92,28"
          strokeWidth={1.5}
          className="stroke-accent fill-surface"
        />
      </svg>
    );
  }

  if (projectId === 'knowledge-systems') {
    return (
      <svg {...svgProps} className={className}>
        <g className="stroke-rule" strokeWidth={1.5}>
          <line x1="30" y1="16" x2="70" y2="16" />
          <line x1="30" y1="16" x2="30" y2="40" />
          <line x1="30" y1="40" x2="70" y2="40" />
          <line x1="70" y1="16" x2="70" y2="40" />
          <line x1="70" y1="40" x2="118" y2="40" />
        </g>
        <g strokeWidth={1.5} className="stroke-ink-tertiary fill-surface">
          <circle cx="30" cy="16" r="6" />
          <circle cx="70" cy="16" r="6" />
          <circle cx="30" cy="40" r="6" />
          <circle cx="70" cy="40" r="6" />
          <circle cx="118" cy="40" r="6" className="stroke-accent" />
        </g>
      </svg>
    );
  }

  if (projectId === 'experiments') {
    return (
      <svg {...svgProps} className={className}>
        <path
          d="M 36 28 L 70 28 M 70 28 L 104 14 M 70 28 L 104 42"
          strokeWidth={1.5}
          className="stroke-rule"
        />
        <g strokeWidth={1.5} className="stroke-ink-tertiary fill-surface">
          <circle cx="30" cy="28" r="7" />
          <circle cx="110" cy="14" r="6" />
          <circle cx="110" cy="42" r="6" />
          <circle cx="70" cy="28" r="5" className="stroke-accent" />
        </g>
      </svg>
    );
  }

  return null;
}
