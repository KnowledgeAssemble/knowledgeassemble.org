import Button from '../components/common/Button';
import PageContainer from '../components/layout/PageContainer';

export default function NotFoundPage() {
  return (
    <section className="py-24 sm:py-32">
      <PageContainer>
        <div className="max-w-xl">
          <h1 className="text-display-lg-mobile text-ink sm:text-display-lg">Page not found</h1>
          <p className="mt-5 text-body-lg text-ink-secondary">
            The page you requested does not exist or has moved.
          </p>
          <div className="mt-8">
            <Button to="/" withArrow>
              Return home
            </Button>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
