import { LINKS } from '../config/links';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import type { PageMeta } from '../types';
import { communityTracks } from '../content/community';
import Button from '../components/common/Button';
import Section from '../components/common/Section';
import PageContainer from '../components/layout/PageContainer';
import CommunityCard from '../components/sections/CommunityCard';
import CommunityAssembly from '../components/visuals/CommunityAssembly';

export const meta: PageMeta = {
  title: 'Community — KnowledgeAssemble',
  description:
    "KnowledgeAssemble is an open project. You don't need to be a developer to contribute — educators, researchers, families, and contributors are welcome.",
  canonicalPath: '/community',
};

const channels = [
  {
    label: 'GitHub Issues',
    description: 'Report a problem, ask a question, or suggest an improvement.',
  },
  {
    label: 'Discussions',
    description: 'Talk through an idea before it becomes a change.',
  },
  {
    label: 'RFC pull requests',
    description: 'Propose a design or specification change in the open.',
  },
] as const;

export default function CommunityPage() {
  useDocumentMeta(meta);

  return (
    <>
      <section className="pt-16 pb-10 sm:pt-20 sm:pb-12">
        <PageContainer>
          <div className="max-w-3xl">
            <h1 className="text-display-lg-mobile text-ink sm:text-display-lg">Build with us.</h1>
            <p className="mt-5 text-body-lg text-ink-secondary">
              KnowledgeAssemble is an open project. You don't need to be a developer to contribute.
            </p>
          </div>
        </PageContainer>
      </section>

      <Section
        eyebrow="Ways to take part"
        title="Five ways to contribute"
        contentClassName="mt-10"
      >
        <CommunityAssembly className="mb-10" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communityTracks.map((track) => (
            <CommunityCard key={track.id} track={track} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Contribution channels"
        title="Direct, honest pathways"
        lede="Work happens in the open on GitHub. Start wherever your experience fits."
        bordered
      >
        <div className="rounded-panel border border-rule bg-surface p-6 sm:p-8">
          <dl className="flex flex-col divide-y divide-rule">
            {channels.map((channel) => (
              <div key={channel.label} className="flex flex-col gap-1 py-5 first:pt-0 last:pb-0">
                <dt className="font-mono text-label-md uppercase tracking-wider text-accent">
                  {channel.label}
                </dt>
                <dd className="text-body-md text-ink-secondary">{channel.description}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 border-t border-rule pt-6">
            <Button href={LINKS.githubOrg}>Find us on GitHub</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
