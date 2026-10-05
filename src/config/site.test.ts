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
});
