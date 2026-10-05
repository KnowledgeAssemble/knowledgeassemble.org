import { ArrowRight } from '../common/icons';

type FlowStep = {
  index: string;
  name: string;
  note: string;
};

/**
 * The six conceptual stages, verbatim from PRD §6. The short notes describe
 * the stage; they are not product claims.
 */
const steps: FlowStep[] = [
  { index: '01', name: 'Ideas', note: 'Questions and intent' },
  { index: '02', name: 'Content', note: 'The raw material' },
  { index: '03', name: 'Structure', note: 'Shape and relationships' },
  { index: '04', name: 'Interaction', note: 'Active engagement' },
  { index: '05', name: 'Experience', note: 'Context and flow' },
  { index: '06', name: 'Understanding', note: 'Meaning made' },
];

/**
 * Static 6-step knowledge pipeline (plan §2.4). Reflows from six columns on
 * desktop to two on tablet to a single stack with visible directional
 * indicators on mobile (plan §6.4).
 */
export default function KnowledgeFlow() {
  return (
    <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={step.name} className="relative">
            <div
              className={`flex h-full flex-col justify-between rounded-panel border p-5 ${
                isLast ? 'border-verified bg-verified-subtle' : 'border-rule bg-surface'
              }`}
            >
              <div>
                <span
                  className={`font-mono text-label-sm ${
                    isLast ? 'text-verified' : 'text-ink-tertiary'
                  }`}
                >
                  {step.index}
                </span>
                <p className={`mt-2 text-headline-sm ${isLast ? 'text-verified' : 'text-ink'}`}>
                  {step.name}
                </p>
              </div>
              <p className="mt-3 text-body-sm text-ink-secondary">{step.note}</p>
            </div>
            {!isLast ? (
              <>
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-full z-10 -translate-x-1/2 -translate-y-1/2 text-ink-tertiary sm:hidden"
                >
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute left-full top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 text-ink-tertiary lg:block"
                >
                  <ArrowRight className="h-4 w-4" />
                </span>
              </>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
