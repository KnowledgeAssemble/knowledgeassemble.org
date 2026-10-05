import type { PrincipleItem } from '../../types';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import PrincipleVisual from '../visuals/PrincipleVisual';

type PrincipleCardProps = {
  principle: PrincipleItem;
};

/**
 * Detailed principle breakdown. Renders `number` ("01"–"07") only — the
 * `sectionNumber` ("13.x") is PRD traceability metadata and must never reach
 * the UI (plan §5.2).
 */
export default function PrincipleCard({ principle }: PrincipleCardProps) {
  const revealRef = useRevealOnScroll<HTMLDivElement>();

  return (
    <article className="group flex h-full flex-col rounded-panel border border-rule bg-surface p-6">
      <span className="font-mono text-label-md text-accent">{principle.number}</span>
      <div ref={revealRef} className="mt-3 h-12 w-12">
        <PrincipleVisual
          principleId={principle.id}
          className="vis-principle h-12 w-12 transition-transform duration-200 group-hover:-translate-y-0.5"
        />
      </div>
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
