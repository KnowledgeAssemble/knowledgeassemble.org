import type { ReactNode } from 'react';

type BadgeVariant = 'neutral' | 'verified' | 'spec';

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

/**
 * JetBrains Mono technical pills (DESIGN.md §Technical Badges & Chips).
 * Radius is 4px — never a pill/stadium shape.
 */
const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'border border-rule bg-surface-subtle text-ink-secondary',
  verified: 'border border-verified bg-verified-subtle text-verified',
  spec: 'border border-rule text-ink-secondary',
};

export default function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-control px-2 py-0.5 font-mono text-label-sm ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
