import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LINKS } from '../../config/links';
import Logo from '../common/Logo';
import Button from '../common/Button';
import ExternalLink from '../common/ExternalLink';
import { CloseIcon, MenuIcon } from '../common/icons';
import PageContainer from './PageContainer';

const navItems = [
  { to: '/projects', label: 'Projects' },
  { to: '/principles', label: 'Principles' },
  { to: '/community', label: 'Community' },
  { to: '/about', label: 'About' },
] as const;

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
  `focus-ring inline-flex min-h-11 items-center rounded-control px-3 text-body-md transition-colors ${
    isActive ? 'text-accent' : 'text-ink-secondary hover:text-ink'
  }`;

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `focus-ring inline-flex min-h-11 items-center rounded-control px-3 text-body-md transition-colors ${
    isActive ? 'text-accent' : 'text-ink-secondary hover:text-ink'
  }`;

/**
 * Quiet, responsive site header (plan §4.4, §6.1). The mobile disclosure is
 * removed from the DOM when closed, moves focus into the panel on open, traps
 * Tab, closes on Escape, and returns focus to the toggle.
 */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close the drawer when the route changes (e.g. after tapping a link).
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Focus management and focus trap while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));

    getFocusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const closeDrawer = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-canvas">
      <PageContainer>
        <div className="flex min-h-16 items-center justify-between gap-4 py-2">
          <Link
            to="/"
            className="focus-ring inline-flex min-h-11 items-center gap-2.5 rounded-control text-ink"
          >
            <Logo size={24} className="text-accent" />
            <span className="text-headline-sm">KnowledgeAssemble</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <nav aria-label="Primary" className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={desktopLinkClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <Button href={LINKS.githubOrg} variant="outline" className="ml-2">
              GitHub
            </Button>
          </div>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => (open ? closeDrawer() : setOpen(true))}
            className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-control border border-rule-interactive text-ink md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </PageContainer>

      {open ? (
        <div id="site-mobile-menu" ref={panelRef} className="border-t border-rule md:hidden">
          <PageContainer>
            <nav aria-label="Mobile" className="flex flex-col py-2">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={mobileLinkClass}>
                  {item.label}
                </NavLink>
              ))}
              <ExternalLink href={LINKS.githubOrg} className="mt-1 px-3">
                GitHub
              </ExternalLink>
            </nav>
          </PageContainer>
        </div>
      ) : null}
    </header>
  );
}
