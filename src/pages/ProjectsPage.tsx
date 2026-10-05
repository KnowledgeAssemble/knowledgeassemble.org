import { LINKS } from '../config/links';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import type { PageMeta } from '../types';
import { flagshipProject, projects } from '../content/projects';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ExternalLink from '../components/common/ExternalLink';
import Section from '../components/common/Section';
import PageContainer from '../components/layout/PageContainer';
import ProjectCard from '../components/sections/ProjectCard';

const architecture = [
  {
    label: 'Runtime',
    value:
      'An open runtime for educational experiences that separates content from delivery platforms.',
  },
  {
    label: 'Packages',
    value:
      'Learning packages are Markdown and JSON, validated and rendered through a configurable runtime, and distributed as .oep files.',
  },
  {
    label: 'Accessibility',
    value: 'Accessibility and telemetry are built into the runtime.',
  },
] as const;

const umbrellaTree = `KnowledgeAssemble
│
├── OpenEdu
│
├── Knowledge Tools
│
└── Experiments`;

export const meta: PageMeta = {
  title: 'Projects — KnowledgeAssemble',
  description:
    'KnowledgeAssemble projects explore different parts of the knowledge ecosystem — from learning systems to interactive tools and experimental ideas.',
  canonicalPath: '/projects',
};

export default function ProjectsPage() {
  useDocumentMeta(meta);

  const otherProjects = projects.filter((project) => !project.isFlagship);

  return (
    <>
      {/* Page header */}
      <section className="pt-16 pb-10 sm:pt-20 sm:pb-12">
        <PageContainer>
          <div className="max-w-3xl">
            <h1 className="text-display-lg-mobile text-ink sm:text-display-lg">Projects</h1>
            <p className="mt-5 text-body-lg text-ink-secondary">
              KnowledgeAssemble projects explore different parts of the knowledge ecosystem — from
              learning systems to interactive tools and experimental ideas.
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Flagship: OpenEdu */}
      {flagshipProject ? (
        <Section
          eyebrow="Flagship project"
          title={flagshipProject.name}
          contentClassName="mt-10"
        >
          <div className="rounded-panel border border-rule bg-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="verified">{flagshipProject.status}</Badge>
              {flagshipProject.categories.map((category) => (
                <Badge key={category}>{category}</Badge>
              ))}
            </div>

            <p className="mt-6 max-w-3xl text-body-lg text-ink-secondary">
              {flagshipProject.description}
            </p>

            <dl className="mt-8 flex flex-col gap-5 border-t border-rule pt-6">
              {architecture.map((item) => (
                <div key={item.label} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                  <dt className="w-32 shrink-0 font-mono text-label-md uppercase tracking-wider text-ink-tertiary">
                    {item.label}
                  </dt>
                  <dd className="text-body-md text-ink-secondary">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-rule pt-6">
              <ExternalLink href={LINKS.openedu} className="text-body-md">
                OpenEdu repository
              </ExternalLink>
              <ExternalLink href={LINKS.openeduSite} className="text-body-md">
                Live demo
              </ExternalLink>
            </div>
          </div>
        </Section>
      ) : null}

      {/* Other projects. `hideCta` because these cards are already on the page
          their internal CTA points at — a "Learn more" link to /projects here
          would go nowhere. */}
      <Section
        eyebrow="Also underway"
        title="Knowledge Systems and Experiments"
        bordered
        contentClassName="mt-10 grid gap-6 md:grid-cols-2"
      >
        {otherProjects.map((project) => (
          <ProjectCard key={project.id} project={project} hideCta />
        ))}
      </Section>

      {/* Umbrella hierarchy */}
      <Section
        eyebrow="Structure"
        title="How the umbrella fits together"
        lede="KnowledgeAssemble is the organization. OpenEdu is its first major project, with room for knowledge tools and experiments alongside it."
        bordered
      >
        {/* ASCII tree on tablet and up */}
        <div className="hidden rounded-panel border border-rule bg-surface-subtle p-6 md:block">
          <pre className="font-mono text-code-md text-ink-secondary">{umbrellaTree}</pre>
        </div>

        {/* Nested cards below tablet, so the tree stays legible at 320px */}
        <div className="rounded-panel border border-rule bg-surface p-6 md:hidden">
          <p className="font-mono text-label-sm uppercase tracking-wider text-ink-tertiary">
            Organization
          </p>
          <p className="mt-1 text-headline-sm text-ink">KnowledgeAssemble</p>
          <ul className="mt-4 flex flex-col gap-2 border-l border-rule pl-4">
            <li className="text-body-md text-ink-secondary">OpenEdu</li>
            <li className="text-body-md text-ink-secondary">Knowledge Tools</li>
            <li className="text-body-md text-ink-secondary">Experiments</li>
          </ul>
        </div>
      </Section>

      {/* Explore */}
      <Section
        title="Explore the work"
        lede="The canonical artifacts live on GitHub, where the projects are developed in the open."
        bordered
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href={LINKS.openedu}>Explore OpenEdu</Button>
          <Button href={LINKS.githubOrg} variant="outline">
            KnowledgeAssemble on GitHub
          </Button>
        </div>
      </Section>
    </>
  );
}
