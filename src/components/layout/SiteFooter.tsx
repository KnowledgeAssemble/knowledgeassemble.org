import { Link } from 'react-router-dom';
import { LINKS } from '../../config/links';
import Logo from '../common/Logo';
import ExternalLink from '../common/ExternalLink';
import PageContainer from './PageContainer';

const footerLinks = [
  { to: '/projects', label: 'Projects' },
  { to: '/principles', label: 'Principles' },
  { to: '/community', label: 'Community' },
  { to: '/about', label: 'About' },
] as const;

/**
 * Architectural footer. Names the license (plan Phase 4 / DoD) and omits the
 * Contact link, since no real contact destination exists (plan §10 Q7).
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-surface-subtle">
      <PageContainer>
        <div className="flex flex-col gap-10 py-12 md:py-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex max-w-md flex-col gap-3">
              <Link
                to="/"
                className="focus-ring inline-flex min-h-11 items-center gap-2.5 rounded-control text-ink"
              >
                <Logo size={32} className="text-accent" />
                <span className="text-headline-sm">KnowledgeAssemble</span>
              </Link>
              <p className="text-body-md text-ink-secondary">Open systems for knowledge.</p>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-1 sm:flex sm:gap-6">
              {footerLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="focus-ring inline-flex min-h-11 items-center rounded-control text-body-md text-ink-secondary transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
              <ExternalLink href={LINKS.githubOrg} className="text-body-md">
                GitHub
              </ExternalLink>
            </nav>
          </div>

          <div className="border-t border-rule pt-6">
            <p className="text-body-sm text-ink-tertiary">
              © 2026 KnowledgeAssemble. Released under the MIT License.
            </p>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
