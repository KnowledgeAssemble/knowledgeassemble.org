import type { ReactNode } from 'react';

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
};

/**
 * Consistent section title, optional eyebrow and lede, and an optional
 * trailing action. The h2 id is referenced by the parent <section> via
 * aria-labelledby.
 */
export default function SectionHeading({
  id,
  eyebrow,
  title,
  lede,
  action,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-3 font-mono text-label-sm uppercase tracking-wider text-accent">
            {eyebrow}
          </p>
        ) : null}
        <h2 id={id} className="text-headline-lg-mobile text-ink sm:text-headline-lg">
          {title}
        </h2>
        {lede ? <p className="mt-4 text-body-lg text-ink-secondary">{lede}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
