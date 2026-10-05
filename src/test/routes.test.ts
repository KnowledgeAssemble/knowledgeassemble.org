import { describe, expect, it } from 'vitest';
import {
  allPrerenderEntries,
  notFoundPrerenderEntry,
  prerenderEntries,
  routes,
} from '../routes';

const CANONICAL = ['/', '/about', '/community', '/principles', '/projects'];

describe('route table and prerender entries stay in sync', () => {
  it('prerenders exactly the five canonical routes', () => {
    expect(prerenderEntries.map((entry) => entry.path).sort()).toEqual(CANONICAL);
  });

  it('matches the leaf paths of the route table', () => {
    const root = routes[0];
    const children = root && 'children' in root ? (root.children ?? []) : [];
    const leafPaths = children
      .map((child) => child.path)
      .filter((path): path is string => Boolean(path) && path !== '*')
      .sort();

    expect(leafPaths).toEqual(prerenderEntries.map((entry) => entry.path).sort());
  });

  it('gives every prerendered entry a canonical path that equals its route', () => {
    for (const entry of prerenderEntries) {
      expect(entry.meta.canonicalPath, entry.path).toBe(entry.path);
    }
  });

  it('writes each canonical route to its own directory index', () => {
    const outFiles = prerenderEntries.map((entry) => entry.outFile).sort();
    expect(outFiles).toEqual([
      'about/index.html',
      'community/index.html',
      'index.html',
      'principles/index.html',
      'projects/index.html',
    ]);
  });
});

describe('the not-found entry', () => {
  it('renders the client catch-all route so there is one 404 component', () => {
    // `/404` has no matching child path, so it resolves through `*` and renders
    // NotFoundPage. If that ever stops being true the static 404 would silently
    // render the wrong document.
    const leafPaths = (routes[0]?.children ?? []).map((child) => child.path);
    expect(leafPaths).toContain('*');
    expect(leafPaths).not.toContain(notFoundPrerenderEntry.path);
  });

  it('writes to dist/404.html, which is what the host serves', () => {
    expect(notFoundPrerenderEntry.outFile).toBe('404.html');
    expect(allPrerenderEntries).toContain(notFoundPrerenderEntry);
  });

  it('is noindex and claims no canonical', () => {
    expect(notFoundPrerenderEntry.meta.noIndex).toBe(true);
    expect(notFoundPrerenderEntry.meta.canonicalPath).toBe('');
  });

  it('is not part of the canonical route set', () => {
    // It must never reach sitemap.xml.
    expect(prerenderEntries).not.toContain(notFoundPrerenderEntry);
    expect(allPrerenderEntries).toHaveLength(CANONICAL.length + 1);
  });
});