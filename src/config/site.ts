import type { PageMeta } from '../types';

export const siteName = 'KnowledgeAssemble';

/**
 * Deployed origin — the apex, no trailing slash.
 *
 * `knowledgeassemble.org` is registered and live on Vercel (2026-10-05). The
 * apex is canonical; `www` does not resolve, and if it is ever added it must
 * 301 to the apex rather than be treated as a second canonical host.
 *
 * With this set, `useDocumentMeta` emits absolute canonical and `og:url` for
 * every route. It is the single place to change the origin.
 */
export const siteUrl = 'https://knowledgeassemble.org';

/** Default metadata; the homepage re-exports this. PRD §27. */
export const defaultMeta: PageMeta = {
  title: 'KnowledgeAssemble — Open Systems for Knowledge',
  description:
    'KnowledgeAssemble builds open-source tools and systems for creating, connecting, exploring, and sharing knowledge.',
  canonicalPath: '/',
};
