import { describe, expect, it } from 'vitest';
import { defaultMeta, siteName, siteUrl } from './site';

describe('site config', () => {
  it('keeps siteUrl empty or a valid absolute origin', () => {
    const isEmpty = siteUrl === '';
    const isAbsoluteOrigin = /^https:\/\/[^/]+$/.test(siteUrl);
    expect(isEmpty || isAbsoluteOrigin).toBe(true);
  });

  it('never points siteUrl at the unregistered domain', () => {
    expect(siteUrl).not.toContain('knowledgeassemble.org');
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
