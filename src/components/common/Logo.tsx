type LogoProps = {
  size?: number;
  className?: string;
};

/**
 * The Assembly Blocks mark: three connected modular blocks representing
 * knowledge assembly (plan §2.4). Radius is 0.25rem in the design system;
 * stroke uses currentColor so the mark inherits its context.
 *
 * Decorative next to the brand wordmark, so it is aria-hidden by default.
 */
export default function Logo({ size = 24, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="1.5" y="1.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="18.5" y="1.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="18.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.5 13.5V16H16v2.5M24.5 13.5V16H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
