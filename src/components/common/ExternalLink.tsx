import type { ReactNode } from 'react';

type ExternalLinkProps = {
  href: string;
  children?: ReactNode;
  className?: string;
  /** Use when the link has no visible text; supplies the accessible name. */
  label?: string;
};

/**
 * An external link that opens in a new tab, with the north-east arrow glyph
 * marked decorative and a visible-text label. `rel="noopener noreferrer"` is
 * required for target="_blank".
 */
export default function ExternalLink({
  href,
  children,
  className = '',
  label,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-control font-medium text-accent transition-colors hover:text-accent-hover ${className}`}
    >
      {children ? <span>{children}</span> : null}
      <svg
        viewBox="0 0 16 16"
        width="16"
        height="16"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="h-4 w-4 shrink-0"
      >
        <path
          d="M5 11 11 5M6.5 5H11v4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
