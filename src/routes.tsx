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
import NotFoundPage from './pages/NotFoundPage';

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
  path: string;
  meta: PageMeta;
}

/** The five canonical routes, in the exact order they appear in the sitemap. */
export const prerenderEntries: PrerenderEntry[] = [
  { path: '/', meta: homeMeta },
  { path: '/projects', meta: projectsMeta },
  { path: '/principles', meta: principlesMeta },
  { path: '/community', meta: communityMeta },
  { path: '/about', meta: aboutMeta },
];
