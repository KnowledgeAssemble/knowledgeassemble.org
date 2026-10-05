import type { PrincipleItem } from '../../types';

type PrincipleCardProps = {
  principle: PrincipleItem;
};

/**
 * Detailed principle breakdown. Renders `number` ("01"–"07") only — the
 * `sectionNumber` ("13.x") is PRD traceability metadata and must never reach
 * the UI (plan §5.2).
 */
export default function PrincipleCard({ principle }: PrincipleCardProps) {
  return (
    <article className="flex h-full flex-col rounded-panel border border-rule bg-surface p-6">
      <span className="font-mono text-label-md text-accent">{principle.number}</span>
      <h3 className="mt-3 text-headline-sm text-ink">{principle.title}</h3>
      <p className="mt-3 text-body-md text-ink-secondary">{principle.summary}</p>
      {principle.body.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3">
          {principle.body.map((paragraph) => (
            <p key={paragraph} className="text-body-md text-ink-secondary">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
    </article>
  );
}
