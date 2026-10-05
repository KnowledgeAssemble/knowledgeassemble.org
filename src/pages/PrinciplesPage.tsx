import { principles } from '../content/principles';
import Section from '../components/common/Section';
import PageContainer from '../components/layout/PageContainer';
import PrincipleCard from '../components/sections/PrincipleCard';

export default function PrinciplesPage() {
  return (
    <>
      <section className="pt-16 pb-10 sm:pt-20 sm:pb-12">
        <PageContainer>
          <div className="max-w-3xl">
            <h1 className="text-display-lg-mobile text-ink sm:text-display-lg">Principles</h1>
            <p className="mt-5 text-body-lg text-ink-secondary">
              KnowledgeAssemble is guided by a small set of principles. They describe how we think
              about technology, knowledge, and the people who use it.
            </p>
          </div>
        </PageContainer>
      </section>

      <Section
        title="Seven guiding principles"
        contentClassName="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {principles.map((principle) => (
          <PrincipleCard key={principle.id} principle={principle} />
        ))}
      </Section>
    </>
  );
}
