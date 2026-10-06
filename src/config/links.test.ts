/// <reference types="node" />
import { describe, expect, it } from 'vitest';
import { LINKS } from './links';

const entries = Object.entries(LINKS);

describe('link registry', () => {
  it('exposes the five verified URLs', () => {
    expect(entries).toHaveLength(5);
  });

  it('are all well-formed https URLs', () => {
    for (const [key, url] of entries) {
      const parsed = new URL(url);
      expect(parsed.protocol, key).toBe('https:');
      expect(parsed.hostname, key).toBeTruthy();
    }
  });

  it('never point at the invented openedu.org domain', () => {
    for (const [key, url] of entries) {
      expect(url, key).not.toContain('openedu.org');
    }
  });

  // Network-dependent and therefore opt-in: a flaky outbound request must not
  // fail CI. Enable locally with RUN_NET_TESTS=1.
  const runNetwork = process.env.RUN_NET_TESTS === '1';
  const networkTest = runNetwork ? it : it.skip;

  networkTest('all current links resolve', async () => {
    for (const [key, url] of entries) {
      const response = await fetch(url, { method: 'GET', redirect: 'follow' });
      expect(response.status, `${key} (${url})`).toBeLessThan(400);
    }
  });
});
