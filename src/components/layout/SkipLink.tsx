/**
 * Keyboard bypass link. Rendered first in DOM order so it is the first
 * focusable element; visually hidden until focused (plan §6.1).
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-control focus:border focus:border-rule-interactive focus:bg-surface focus:px-4 focus:text-body-md focus:font-medium focus:text-accent"
    >
      Skip to main content
    </a>
  );
}
