import { Link } from 'react-router-dom';
import { LINKS } from '../config/links';
import { projects } from '../content/projects';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Section from '../components/common/Section';
import PageContainer from '../components/layout/PageContainer';
import KnowledgeFlow from '../components/sections/KnowledgeFlow';
import ProjectCard from '../components/sections/ProjectCard';

const tenets = [
  {
    number: '01',
    title: 'Open',
    copy: 'Build in the open and prefer open technologies, formats, and knowledge.',
  },
  {
    number: '02',
    title: 'Composable',
    copy: 'Build small systems that can work together rather than one giant platform.',
  },
  {
    number: '03',
    title: 'Accessible',
    copy: 'Accessibility should be part of the foundation, not an afterthought.',
  },
  {
    number: '04',
    title: 'Human + AI',
    copy: 'Use AI to amplify human ability without making AI the purpose of the experience.',
  },
] as const;

const participantSegments = ['Educators', 'Developers', 'Researchers', 'Families', 'Contributors'];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-16 pb-14 sm:pt-24 sm:pb-20">
        <PageContainer>
          <div className="flex max-w-3xl flex-col items-start gap-8">
            <h1 className="text-display-lg-mobile text-ink sm:text-display-lg">
              Building open systems for assembling knowledge.
            </h1>
            <p className="text-body-lg text-ink-secondary">
              KnowledgeAssemble is an open-source organization exploring better ways to create,
              connect, explore, and share knowledge through software, educational tools, and
              experimental learning systems.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button to="/projects" withArrow>
                Explore projects
              </Button>
              <Button href={LINKS.githubOrg} variant="outline">
                GitHub
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Concept */}
      <Section
        eyebrow="Concept"
        title="Knowledge should be able to move."
        lede="Knowledge is often trapped inside platforms, formats, applications, and institutional silos. We explore systems that make knowledge more portable, composable, accessible, and useful."
        bordered
      >
        <KnowledgeFlow />
      </Section>

      {/* What we're building */}
      <Section
        eyebrow="Assemblies and tools"
        title="What we're building"
        contentClassName="mt-10 grid gap-6 md:grid-cols-3"
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            ctaLabel={project.id === 'experiments' ? "See what we're exploring" : undefined}
          />
        ))}
      </Section>

      {/* How we work */}
      <Section
        eyebrow="Principles"
        title="How we work"
        bordered
        action={
          <Link
            to="/principles"
            className="focus-ring inline-flex min-h-11 items-center rounded-control text-body-md font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Read our principles →
          </Link>
        }
        contentClassName="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {tenets.map((tenet) => (
          <article key={tenet.number} className="rounded-panel border border-rule bg-surface p-6">
            <span className="font-mono text-label-md text-accent">{tenet.number}</span>
            <h3 className="mt-3 text-headline-sm text-ink">{tenet.title}</h3>
            <p className="mt-2 text-body-sm text-ink-secondary">{tenet.copy}</p>
          </article>
        ))}
      </Section>

      {/* Community */}
      <Section
        eyebrow="Participation"
        title="Knowledge is built by many people."
        lede="KnowledgeAssemble is for people who create, teach, research, build, learn, and experiment."
      >
        <div className="flex flex-col gap-8 rounded-panel border border-rule bg-surface p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-2" aria-label="Who this is for">
            {participantSegments.map((segment) => (
              <li key={segment}>
                <Badge className="px-3 py-1">{segment}</Badge>
              </li>
            ))}
          </ul>
          <Button to="/community" withArrow className="shrink-0">
            Join the community
          </Button>
        </div>
      </Section>

      {/* Open source */}
      <Section
        eyebrow="Open source"
        title="Open source, by default."
        lede="We believe the systems that help people create and explore knowledge should be understandable, reusable, and shareable."
        bordered
      >
        <Button href={LINKS.githubOrg} variant="outline">
          Explore GitHub
        </Button>
      </Section>
    </>
  );
}
