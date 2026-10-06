import { LINKS } from '../config/links';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import type { PageMeta } from '../types';
import { about } from '../content/about';
import Button from '../components/common/Button';
import Section from '../components/common/Section';
import PageContainer from '../components/layout/PageContainer';

export const meta: PageMeta = {
  title: 'About — KnowledgeAssemble',
  description:
    'We are exploring what it could look like if knowledge were easier to create, connect, explore, and share, starting with OpenEdu in education.',
  canonicalPath: '/about',
};

const umbrellaTree = `KnowledgeAssemble
│
├── OpenEdu
│
├── Knowledge Tools
│
└── Experiments`;

export default function AboutPage() {
  useDocumentMeta(meta);

  return (
    <>
      <section className="pt-16 pb-10 sm:pt-20 sm:pb-12">
        <PageContainer>
          <div className="max-w-3xl">
            <h1 className="text-display-lg-mobile text-ink sm:text-display-lg">
              About KnowledgeAssemble
            </h1>
            <p className="mt-5 text-body-lg text-ink">{about.premise}</p>
          </div>
        </PageContainer>
      </section>

      <Section
        eyebrow="The decoupling thesis"
        title="Knowledge is often locked to the software that presents it"
        bordered
      >
        <div className="flex max-w-3xl flex-col gap-5">
          {about.context.map((paragraph) => (
            <p key={paragraph} className="text-body-lg text-ink-secondary">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="First exploration"
        title="OpenEdu"
        lede={about.openedu}
      >
        <div className="rounded-panel border border-rule bg-surface p-6 sm:p-8">
          <p className="max-w-3xl text-body-md text-ink-secondary">
            OpenEdu is an open runtime for educational experiences that separates content from
            delivery platforms. Learning packages are Markdown and JSON, validated and rendered
            through a configurable runtime.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button href={LINKS.openedu}>Explore OpenEdu</Button>
            <Button href={LINKS.openeduDocs} variant="outline">
              Documentation
            </Button>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Umbrella relationship"
        title="One organization, several projects"
        lede="KnowledgeAssemble hosts OpenEdu alongside knowledge tools and experiments, and is structured to hold future protocols and projects."
        bordered
      >
        <div className="hidden rounded-panel border border-rule bg-surface-subtle p-6 md:block">
          <pre className="font-mono text-code-md text-ink-secondary">{umbrellaTree}</pre>
        </div>
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

      <Section
        eyebrow="Stewardship"
        title="Open systems, kept in the open"
        bordered
      >
        <div className="max-w-3xl">
          <p className="text-body-lg text-ink-secondary">{about.stewardship}</p>
        </div>
      </Section>
    </>
  );
}
