type PrincipleVisualProps = {
  principleId: string;
  className?: string;
};

const svgProps = {
  viewBox: '0 0 48 48',
  width: 48,
  height: 48,
  fill: 'none',
  'aria-hidden': true,
  focusable: false,
} as const;

/**
 * Seven principle illustrations (spec §24–§26), keyed by the ids in
 * `src/content/principles.ts`. Decorative (`aria-hidden`); the card title and
 * summary carry the meaning. Returns null for an unknown id.
 *
 * The two §25 prohibitions are honoured: accessibility is abstract geometry, and
 * human/machine is a symmetric relationship, never a hierarchy.
 */
export default function PrincipleVisual({ principleId, className = '' }: PrincipleVisualProps) {
  const shared = { ...svgProps, className } as const;

  if (principleId === 'open-by-default') {
    return (
      <svg {...shared}>
        <path d="M10 14 V38 H38 V14" strokeWidth={1.5} className="stroke-accent" />
        <line x1="24" y1="14" x2="24" y2="38" strokeWidth={1.5} className="stroke-ink-tertiary" />
      </svg>
    );
  }

  if (principleId === 'knowledge-should-be-portable') {
    return (
      <svg {...shared}>
        <g strokeWidth={1.5} className="stroke-ink-tertiary fill-surface">
          <rect x="7" y="16" width="12" height="16" rx="2" />
          <rect x="29" y="16" width="12" height="16" rx="2" />
        </g>
        <line x1="19" y1="24" x2="29" y2="24" strokeWidth={1.5} className="stroke-accent" />
      </svg>
    );
  }

  if (principleId === 'composable-over-monolithic') {
    return (
      <svg {...shared}>
        <g strokeWidth={1.5} className="stroke-ink-tertiary fill-surface">
          <rect x="7" y="8" width="10" height="10" rx="2" />
          <rect x="19" y="8" width="10" height="10" rx="2" />
          <rect x="31" y="8" width="10" height="10" rx="2" />
        </g>
        <line x1="24" y1="18" x2="24" y2="28" strokeWidth={1.5} className="stroke-accent" />
        <rect
          x="15"
          y="28"
          width="18"
          height="12"
          rx="2"
          strokeWidth={1.5}
          className="stroke-accent fill-surface"
        />
      </svg>
    );
  }

  if (principleId === 'experience-matters') {
    return (
      <svg {...shared}>
        <circle cx="10" cy="24" r="4" className="fill-accent" />
        <circle cx="24" cy="24" r="4" strokeWidth={1.5} className="stroke-ink-tertiary" />
        <polygon
          points="38,16 45,24 38,32 31,24"
          strokeWidth={1.5}
          className="stroke-accent fill-surface"
        />
        <line x1="15" y1="24" x2="19" y2="24" strokeWidth={1.5} className="stroke-ink-tertiary" />
        <line x1="29" y1="24" x2="31" y2="24" strokeWidth={1.5} className="stroke-ink-tertiary" />
      </svg>
    );
  }

  if (principleId === 'accessibility-is-foundational') {
    return (
      <svg {...shared}>
        <g strokeWidth={1.5} className="stroke-ink-tertiary">
          <line x1="8" y1="14" x2="26" y2="24" />
          <line x1="8" y1="24" x2="26" y2="24" />
          <line x1="8" y1="34" x2="26" y2="24" />
        </g>
        <path
          d="M26 14 V34 H40"
          strokeWidth={1.5}
          strokeLinecap="round"
          className="stroke-accent"
        />
      </svg>
    );
  }

  if (principleId === 'human-judgment-matters') {
    return (
      <svg {...shared}>
        <g strokeWidth={1.5} className="stroke-ink-tertiary fill-surface">
          <circle cx="12" cy="18" r="6" />
          <circle cx="36" cy="18" r="6" />
        </g>
        <line x1="18" y1="18" x2="30" y2="18" strokeWidth={1.5} className="stroke-accent" />
        <line x1="30" y1="15" x2="30" y2="21" strokeWidth={1.5} className="stroke-accent" />
        <line x1="18" y1="15" x2="18" y2="21" strokeWidth={1.5} className="stroke-accent" />
        <path d="M24 24 V32" strokeWidth={1.5} className="stroke-accent" />
        <rect
          x="15"
          y="32"
          width="18"
          height="8"
          rx="2"
          strokeWidth={1.5}
          className="stroke-accent fill-surface"
        />
      </svg>
    );
  }

  if (principleId === 'build-test-learn') {
    return (
      <svg {...shared}>
        <circle cx="24" cy="24" r="12" strokeWidth={1.5} className="stroke-accent" />
        <polyline points="30,10 36,12 34,18" strokeWidth={1.5} className="stroke-accent" />
        <polyline points="38,30 34,36 28,34" strokeWidth={1.5} className="stroke-accent" />
        <polyline points="10,30 12,36 18,34" strokeWidth={1.5} className="stroke-accent" />
      </svg>
    );
  }

  return null;
}
