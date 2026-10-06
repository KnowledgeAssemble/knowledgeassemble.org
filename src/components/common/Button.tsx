import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, NorthEastArrow } from './icons';

type ButtonVariant = 'primary' | 'outline' | 'ghost';

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  /** Internal route — renders a react-router Link. */
  to?: string;
  /** External URL — renders an anchor with a north-east arrow. */
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  /** Append a directional arrow to the label. */
  withArrow?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'border border-transparent bg-accent text-white hover:bg-accent-hover',
  outline:
    'border border-rule-interactive bg-surface text-ink hover:border-accent hover:text-accent',
  ghost: 'border border-transparent text-ink-secondary hover:bg-surface-subtle hover:text-ink',
};

/**
 * Primary, outline, and ghost controls. Minimum height is 44px per the
 * project touch-target standard (plan §6.3). Radii are 4px (rounded-control).
 */
export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  onClick,
  type = 'button',
  className = '',
  withArrow = false,
}: ButtonProps) {
  const classes = `group focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 py-2 text-body-md font-medium transition-colors duration-[var(--motion-micro)] ease-out ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {withArrow ? (
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-[var(--motion-micro)] ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1" />
      ) : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        <span>{children}</span>
        <NorthEastArrow className="h-4 w-4 shrink-0" />
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
