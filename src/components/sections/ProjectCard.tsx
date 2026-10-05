import { Link } from 'react-router-dom';
import type { ProjectItem, ProjectStatus } from '../../types';
import Badge from '../common/Badge';
import ExternalLink from '../common/ExternalLink';
import { ArrowRight } from '../common/icons';

type ProjectCardProps = {
  project: ProjectItem;
  ctaLabel?: string;
  /**
   * Suppress the call to action. Set this when the card is rendered on the page
   * the CTA would point at — a "Learn more" link to `/projects` shown on
   * `/projects` is a dead end.
   */
  hideCta?: boolean;
};

const statusVariant: Record<ProjectStatus, 'neutral' | 'verified'> = {
  Active: 'verified',
  Exploring: 'neutral',
  Ongoing: 'neutral',
};

/**
 * Standardized project presentation (plan §2.4, §3.1). The card itself is not
 * interactive; a single link carries the action, so there is no nested
 * interactive content.
 */
export default function ProjectCard({ project, ctaLabel, hideCta = false }: ProjectCardProps) {
  // One label for both cases. It previously fell back to a generic "Learn more",
  // which told a screen-reader user nothing about where the link went.
  const ctaText = ctaLabel ?? `Explore ${project.name}`;
  const externalUrl = project.externalUrl;

  return (
    <article className="flex h-full flex-col justify-between rounded-panel border border-rule bg-surface p-6 transition-colors hover:border-rule-interactive">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
          {project.version ? (
            <span className="font-mono text-label-sm text-ink-tertiary">{project.version}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-headline-sm text-ink">{project.name}</h3>
          <p className="text-body-md text-ink-secondary">{project.tagline}</p>
        </div>

        <ul className="flex flex-wrap gap-2" aria-label={`${project.name} categories`}>
          {project.categories.map((category) => (
            <li key={category}>
              <Badge>{category}</Badge>
            </li>
          ))}
        </ul>
      </div>

      {hideCta ? null : (
        <div className="mt-6 border-t border-rule pt-5">
          {externalUrl ? (
            <ExternalLink href={externalUrl} className="text-body-md">
              {ctaText}
            </ExternalLink>
          ) : (
            <Link
              to="/projects"
              className="focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-control text-body-md font-medium text-accent transition-colors hover:text-accent-hover"
            >
              <span>{ctaText}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </article>
  );
}
