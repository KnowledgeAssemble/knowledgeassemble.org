import type { PageMeta } from '../types';

export const siteName = 'KnowledgeAssemble';

/**
 * Deployed origin.
 *
 * Intentionally empty: `knowledgeassemble.org` is not registered yet
 * (plan §10 Q3), and no tag may point at an unregistered host. While this is
 * empty, `useDocumentMeta` emits title, description, and OpenGraph/Twitter
 * title/description, but **not** canonical or `og:url`. Set this to the
 * deployed origin (e.g. the Vercel production URL, then the custom domain) to
 * turn on absolute canonical and `og:url` everywhere in one place.
 */
export const siteUrl = '';

/** Default metadata; the homepage re-exports this. PRD §27. */
export const defaultMeta: PageMeta = {
  title: 'KnowledgeAssemble — Open Systems for Knowledge',
  description:
    'KnowledgeAssemble builds open-source tools and systems for creating, connecting, exploring, and sharing knowledge.',
  canonicalPath: '/',
};
