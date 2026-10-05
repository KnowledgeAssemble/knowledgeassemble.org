import { describe, expect, it } from 'vitest';
import { defaultMeta, siteName, siteUrl } from './site';

describe('site config', () => {
  it('uses the live apex origin', () => {
    expect(siteUrl).toBe('https://knowledgeassemble.org');
  });

  it('is an absolute origin with no path or trailing slash', () => {
    expect(siteUrl).toMatch(/^https:\/\/[^/]+$/);
  });

  it('never treats www as the canonical host', () => {
    expect(siteUrl).not.toContain('www.');
  });

  it('uses the PRD §27 homepage title and description verbatim', () => {
    expect(defaultMeta.title).toBe('KnowledgeAssemble — Open Systems for Knowledge');
    expect(defaultMeta.description).toBe(
      'KnowledgeAssemble builds open-source tools and systems for creating, connecting, exploring, and sharing knowledge.',
    );
  });

  it('names the site', () => {
    expect(siteName).toBe('KnowledgeAssemble');
  });

  it('joins origin and path into exactly one absolute URL', () => {
    // `useDocumentMeta` builds canonical as `${siteUrl}${canonicalPath}`. The
    // origin carries no trailing slash, so the homepage's path must supply
    // exactly one, or the tag emits `https://knowledgeassemble.org//`.
    for (const [path, expected] of [
      ['/', 'https://knowledgeassemble.org/'],
      ['/projects', 'https://knowledgeassemble.org/projects'],
    ] as const) {
      expect(`${siteUrl}${path}`).toBe(expected);
      expect(`${siteUrl}${path}`).not.toContain('org//');
    }
  });

  it('gives every route a leading-slash path', () => {
    expect(defaultMeta.canonicalPath.startsWith('/')).toBe(true);
  });
});
