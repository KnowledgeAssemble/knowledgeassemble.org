/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The static shell is the §4.2 no-JS mitigation for PRD §22 ("do not make
 * accessibility dependent on JavaScript"). Without JavaScript there is no app, so
 * the shell plus the noscript message are the entire document.
 *
 * It must live inside <noscript>. The shell has no layout rules of its own — the
 * real header and footer get theirs from Tailwind utilities on the React
 * components — so rendering it in the body paints bare block markup in the
 * top-left corner until React hydrates, in production as well as dev. An earlier
 * revision shipped it in the body and tried to hide that with a duplicated
 * critical-CSS block; the fix is to not paint it at all.
 *
 * The browser-side half of this contract is asserted in tests/e2e/routes.spec.ts
 * ("renders landmarks with JavaScript disabled"). These are the static checks.
 */
const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');

/** Comments explain the shell; they must not count as rendering it. */
const stripComments = (markup: string): string => markup.replace(/<!--[\s\S]*?-->/g, '');

/** Parsed from the comment-stripped document so prose cannot match. */
const markup = stripComments(html);

const noscript = (): string => markup.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? '';
const rootDiv = (): string => html.match(/<div id="root">([\s\S]*?)<\/div>/)?.[1] ?? '';
const body = (): string => markup.slice(markup.indexOf('<body>'));

describe('static shell is scoped to no-JS visitors', () => {
  it('leaves #root empty so nothing paints before hydration', () => {
    expect(rootDiv().trim(), '#root must ship empty; React owns its contents').toBe('');
  });

  it('places the shell inside <noscript>, not in the body', () => {
    const outside = body().replace(noscript(), '').replace(/<\/?noscript>/g, '');
    for (const landmark of ['<header', '<main', '<nav', '<footer']) {
      expect(noscript(), `${landmark} missing from the noscript shell`).toContain(landmark);
      expect(outside, `${landmark} rendered when JavaScript is enabled`).not.toContain(landmark);
    }
  });

  it('gives no-JS visitors a document with one h1 and the required landmarks', () => {
    const shell = noscript();
    expect(shell.match(/<h1/g) ?? []).toHaveLength(1);
    for (const landmark of ['<header', '<main id="main-content"', '<footer']) {
      expect(shell).toContain(landmark);
    }
  });

  it('keeps the skip-link target reachable without JavaScript', () => {
    // The React SkipLink points at #main-content; with JS off the noscript shell
    // has to supply it or the link is dead.
    expect(noscript()).toContain('id="main-content"');
  });

  it('explains the JavaScript requirement and points at GitHub', () => {
    expect(noscript()).toMatch(/need[s]? JavaScript enabled/i);
    expect(noscript()).toContain('https://github.com/KnowledgeAssembly');
  });

  it('links every primary route so no-JS navigation still works', () => {
    for (const route of ['/', '/projects', '/principles', '/community', '/about']) {
      expect(noscript()).toContain(`href="${route}"`);
    }
  });

  it('does not duplicate per-route content into the document', () => {
    // Plan §4.2 point 2: route content is not duplicated into index.html, to
    // avoid a second source of truth that drifts. Landmarks only.
    expect(noscript()).not.toMatch(/\b13\.\d\b/);
    expect(noscript().match(/<h1[^>]*>[^<]+<\/h1>/)?.[0]).toBe('<h1>KnowledgeAssemble</h1>');
  });
});