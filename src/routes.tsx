import type { RouteObject } from 'react-router-dom';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import type { PageMeta } from './types';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';
import SkipLink from './components/layout/SkipLink';
import HomePage, { meta as homeMeta } from './pages/HomePage';
import ProjectsPage, { meta as projectsMeta } from './pages/ProjectsPage';
import PrinciplesPage, { meta as principlesMeta } from './pages/PrinciplesPage';
import CommunityPage, { meta as communityMeta } from './pages/CommunityPage';
import AboutPage, { meta as aboutMeta } from './pages/AboutPage';
import NotFoundPage, { meta as notFoundMeta } from './pages/NotFoundPage';

function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <SkipLink />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: '/', Component: HomePage },
      { path: '/projects', Component: ProjectsPage },
      { path: '/principles', Component: PrinciplesPage },
      { path: '/community', Component: CommunityPage },
      { path: '/about', Component: AboutPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
];

export interface PrerenderEntry {
  /** Path handed to the static handler. */
  path: string;
  /** File this entry writes, relative to `dist/`. */
  outFile: string;
  meta: PageMeta;
}

/** The five canonical routes, in the exact order they appear in the sitemap. */
export const prerenderEntries: PrerenderEntry[] = [
  { path: '/', outFile: 'index.html', meta: homeMeta },
  { path: '/projects', outFile: 'projects/index.html', meta: projectsMeta },
  { path: '/principles', outFile: 'principles/index.html', meta: principlesMeta },
  { path: '/community', outFile: 'community/index.html', meta: communityMeta },
  { path: '/about', outFile: 'about/index.html', meta: aboutMeta },
];

/**
 * The not-found route, prerendered to `dist/404.html` so the host can serve a
 * real document for an unknown URL. `path` resolves through the `*` route, so
 * this renders `NotFoundPage` — the same component the client router uses — and
 * there is no second copy of the copy to keep in sync.
 */
export const notFoundPrerenderEntry: PrerenderEntry = {
  path: '/404',
  outFile: '404.html',
  meta: notFoundMeta,
};

/** Everything `scripts/prerender.tsx` writes. */
export const allPrerenderEntries: PrerenderEntry[] = [
  ...prerenderEntries,
  notFoundPrerenderEntry,
];
