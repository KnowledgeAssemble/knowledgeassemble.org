import { describe, expect, it } from 'vitest';
import { prerenderEntries, routes } from '../routes';

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
});
