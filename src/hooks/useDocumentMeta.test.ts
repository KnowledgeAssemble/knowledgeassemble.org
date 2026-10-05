import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PageMeta } from '../types';
import { useDocumentMeta } from './useDocumentMeta';

const baseMeta: PageMeta = {
  title: 'Test — KnowledgeAssemble',
  description: 'A test description.',
  canonicalPath: '/test',
};

const metaContent = (selector: string): string | null =>
  document.head.querySelector(selector)?.getAttribute('content') ?? null;

describe('useDocumentMeta', () => {
  it('sets the title and description', () => {
    renderHook(() => useDocumentMeta(baseMeta));
    expect(document.title).toBe(baseMeta.title);
    expect(metaContent('meta[name="description"]')).toBe(baseMeta.description);
  });

  it('sets OpenGraph and Twitter tags', () => {
    renderHook(() => useDocumentMeta(baseMeta));
    expect(metaContent('meta[property="og:title"]')).toBe(baseMeta.title);
    expect(metaContent('meta[property="og:description"]')).toBe(baseMeta.description);
    expect(metaContent('meta[name="twitter:title"]')).toBe(baseMeta.title);
    expect(metaContent('meta[name="twitter:description"]')).toBe(baseMeta.description);
    expect(metaContent('meta[name="twitter:card"]')).toBe('summary_large_image');
  });

  it('suppresses canonical and og:url while siteUrl is empty', () => {
    renderHook(() => useDocumentMeta(baseMeta));
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();
  });

  it('restores the title and removes created tags on unmount', () => {
    document.title = 'Before';
    const { unmount } = renderHook(() => useDocumentMeta(baseMeta));
    expect(document.title).toBe(baseMeta.title);
    expect(document.head.querySelector('meta[name="description"]')).not.toBeNull();

    unmount();
    expect(document.title).toBe('Before');
    expect(document.head.querySelector('meta[name="description"]')).toBeNull();
  });

  it('emits a noindex robots tag when meta.noIndex is set', () => {
    renderHook(() => useDocumentMeta({ ...baseMeta, canonicalPath: '', noIndex: true }));
    expect(metaContent('meta[name="robots"]')).toBe('noindex');
  });

  it('removes the robots tag when navigating off a noindex route', () => {
    const noIndexMeta: PageMeta = { ...baseMeta, canonicalPath: '', noIndex: true };
    const { rerender } = renderHook(({ meta }: { meta: PageMeta }) => useDocumentMeta(meta), {
      initialProps: { meta: noIndexMeta },
    });
    expect(metaContent('meta[name="robots"]')).toBe('noindex');

    rerender({ meta: baseMeta });
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });

  it('emits absolute canonical and og:url when siteUrl is configured', async () => {
    vi.resetModules();
    vi.doMock('../config/site', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../config/site')>();
      return { ...actual, siteUrl: 'https://example.test' };
    });

    const { useDocumentMeta: hookWithSiteUrl } = await import('./useDocumentMeta');
    renderHook(() => hookWithSiteUrl(baseMeta));

    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://example.test/test',
    );
    expect(metaContent('meta[property="og:url"]')).toBe('https://example.test/test');

    vi.doUnmock('../config/site');
    vi.resetModules();
  });
});
