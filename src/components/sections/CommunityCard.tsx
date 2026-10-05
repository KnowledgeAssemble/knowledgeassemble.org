import type { CommunityTrack } from '../../types';

type CommunityCardProps = {
  track: CommunityTrack;
};

/**
 * Community track card (plan §2.4, §3.1): role, tagline, concrete ways to
 * contribute, and a suggested first action.
 */
export default function CommunityCard({ track }: CommunityCardProps) {
  return (
    <article className="flex h-full flex-col rounded-panel border border-rule bg-surface p-6">
      <h3 className="text-headline-sm text-ink">{track.role}</h3>
      <p className="mt-2 text-body-md text-ink-secondary">{track.tagline}</p>

      <ul className="mt-5 flex flex-col gap-2">
        {track.contributions.map((contribution) => (
          <li key={contribution} className="flex gap-2 text-body-sm text-ink-secondary">
            <span aria-hidden="true" className="text-ink-tertiary">
              —
            </span>
            <span>{contribution}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-rule pt-4 font-mono text-label-sm uppercase tracking-wider text-verified">
        {track.suggestedAction}
      </p>
    </article>
  );
}
