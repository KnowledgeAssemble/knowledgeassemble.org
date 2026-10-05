/// <reference types="node" />
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = join(process.cwd(), 'src');

function collect(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collect(full));
    else if (/\.(ts|tsx|css)$/.test(entry.name)) files.push(full);
  }
  return files;
}

// Guards enforce constraints on shipped source, not on the tests themselves.
const productionFiles = collect(SRC).filter(
  (file) =>
    !/\.test\.(ts|tsx)$/.test(file) && relative(SRC, file) !== join('test', 'setup.ts'),
);

const read = (file: string) => readFileSync(file, 'utf8');
const label = (file: string) => relative(process.cwd(), file);
const codeFiles = productionFiles.filter((file) => /\.(ts|tsx)$/.test(file));

// ---------------------------------------------------------------------------
// Predicates are pure and exported-by-convention so each one can be unit-tested
// against synthetic input. A guard that is only ever exercised against the
// current source tree cannot be proven to catch the thing it exists to catch.
// ---------------------------------------------------------------------------

/**
 * Reference syntax (`href="#anchor"`, `url(#id)`) is stripped before colour
 * detection. Anchor names are written by humans, and some are valid hex:
 * `href="#decade"` matches `/#[0-9a-f]{3,8}/` while being perfectly correct
 * markup. Scanning the raw file would fail the build on valid code.
 */
function withoutReferences(contents: string): string {
  return contents
    .replace(/href\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^\s>]+)/g, '')
    .replace(/url\([^)]*\)/g, '')
    .replace(/\bid\s*=\s*(?:"[^"]*"|'[^']*')/g, '');
}

function hasColourLiteral(contents: string): boolean {
  const scannable = withoutReferences(contents);
  return /#[0-9a-fA-F]{3,8}\b/.test(scannable) || /\brgba?\(/.test(scannable) || /\bhsla?\(/.test(scannable);
}

// `focus-ring` (our outline-based utility) has no trailing dash, so it does not
// match. Tailwind ring utilities (ring-2, ring-[...], focus:ring-*) do.
function usesRingUtility(contents: string): boolean {
  return /\bring-/.test(contents);
}

// `rounded-[...]` is matched by the forbidden pattern as well as the allowlist
// check, because an arbitrary value is exactly how a circular avatar sneaks
// past a named-token allowlist.
const FORBIDDEN_VISUALS = /shadow-|drop-shadow|bg-gradient|rounded-full|rounded-pill|rounded-\[/;

function usesForbiddenVisual(contents: string): boolean {
  return FORBIDDEN_VISUALS.test(contents);
}

const ALLOWED_RADII = new Set(['rounded-control', 'rounded-panel']);
// Matches named radii and arbitrary values: `rounded-panel`, `rounded-[50%]`.
const RADIUS_PATTERN = /rounded-(?:\[[^\]]*\]|[a-z]+)/g;

function disallowedRadii(contents: string): string[] {
  return (contents.match(RADIUS_PATTERN) ?? []).filter((match) => !ALLOWED_RADII.has(match));
}

function hasInlineUrl(contents: string): boolean {
  return /https?:\/\//.test(contents);
}

// ---------------------------------------------------------------------------
// The predicates are checked against synthetic input first. Without these, a
// gap in a regex is invisible until real code happens to hit it.
// ---------------------------------------------------------------------------

describe('guard predicates', () => {
  describe('hasColourLiteral', () => {
    it('detects hex, rgb(), and hsl() colour values', () => {
      expect(hasColourLiteral('bg-[#164E63]')).toBe(true);
      expect(hasColourLiteral('color: #fff')).toBe(true);
      expect(hasColourLiteral('rgba(0,0,0,.5)')).toBe(true);
      expect(hasColourLiteral('hsl(200 50% 50%)')).toBe(true);
    });

    it('ignores hex-shaped anchor references in href attributes', () => {
      expect(hasColourLiteral('<a href="#decade">old</a>')).toBe(false);
      expect(hasColourLiteral("<a href='#facade'>old</a>")).toBe(false);
      expect(hasColourLiteral("<a href={'#added'}>old</a>")).toBe(false);
    });

    it('ignores hex-shaped ids and url() references', () => {
      expect(hasColourLiteral('<div id="cafe" />')).toBe(false);
      expect(hasColourLiteral('background: url(#gradient)')).toBe(false);
    });

    it('does not become blind to colour hiding next to a reference', () => {
      expect(hasColourLiteral('<a href="#decade">x</a>; color: #164E63')).toBe(true);
    });
  });

  describe('usesForbiddenVisual', () => {
    it('detects shadows, gradients, pill, full, and arbitrary radii', () => {
      expect(usesForbiddenVisual('shadow-md')).toBe(true);
      expect(usesForbiddenVisual('drop-shadow-sm')).toBe(true);
      expect(usesForbiddenVisual('bg-gradient-to-r')).toBe(true);
      expect(usesForbiddenVisual('rounded-full')).toBe(true);
      expect(usesForbiddenVisual('rounded-pill')).toBe(true);
      expect(usesForbiddenVisual('rounded-[50%]')).toBe(true);
      expect(usesForbiddenVisual('rounded-[9999px]')).toBe(true);
    });

    it('allows the two named radius tokens and no shadows', () => {
      expect(usesForbiddenVisual('rounded-control')).toBe(false);
      expect(usesForbiddenVisual('rounded-panel')).toBe(false);
      expect(usesForbiddenVisual('rounded-control rounded-panel')).toBe(false);
    });
  });

  describe('disallowedRadii', () => {
    it('returns only radii outside the allowlist', () => {
      expect(disallowedRadii('rounded-control rounded-panel')).toEqual([]);
      expect(disallowedRadii('rounded-[50%]')).toEqual(['rounded-[50%]']);
      expect(disallowedRadii('rounded-full')).toEqual(['rounded-full']);
      expect(disallowedRadii('focus:rounded-lg')).toEqual(['rounded-lg']);
    });
  });

  describe('usesRingUtility', () => {
    it('flags Tailwind ring utilities but not our outline utility', () => {
      expect(usesRingUtility('ring-2')).toBe(true);
      expect(usesRingUtility('focus:ring-accent')).toBe(true);
      expect(usesRingUtility('ring-[#164E63]')).toBe(true);
      expect(usesRingUtility('focus-ring')).toBe(false);
    });
  });

  describe('hasInlineUrl', () => {
    it('detects http(s) URLs', () => {
      expect(hasInlineUrl('https://example.test')).toBe(true);
      expect(hasInlineUrl('see http://example.test for more')).toBe(true);
    });

    it('ignores relative paths and anchors', () => {
      expect(hasInlineUrl('/projects')).toBe(false);
      expect(hasInlineUrl('#main-content')).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// The same predicates applied to shipped source.
// ---------------------------------------------------------------------------

describe('colour discipline (AGENTS.md, implementation plan §2.2)', () => {
  it('keeps hex, rgb(), and hsl() literals out of src except index.css', () => {
    const offenders = productionFiles.filter((file) => {
      if (label(file) === join('src', 'styles', 'index.css')) return false;
      return hasColourLiteral(read(file));
    });
    expect(offenders.map(label)).toEqual([]);
  });
});

describe('focus rings (AGENTS.md)', () => {
  it('uses outline, never ring-* utilities', () => {
    const offenders = codeFiles.filter((file) => usesRingUtility(read(file)));
    expect(offenders.map(label)).toEqual([]);
  });
});

describe('visual constraints (AGENTS.md)', () => {
  it('uses no shadows, gradients, pill or full radii', () => {
    const offenders = codeFiles.filter((file) => usesForbiddenVisual(read(file)));
    expect(offenders.map(label)).toEqual([]);
  });

  it('uses only rounded-control and rounded-panel', () => {
    const offenders: string[] = [];
    for (const file of codeFiles) {
      for (const match of disallowedRadii(read(file))) {
        offenders.push(`${label(file)}: ${match}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('external URLs (implementation plan §11, Phase 11)', () => {
  it('are centralized in the config layer', () => {
    // External destinations live in links.ts; the site's own origin lives in
    // site.ts (§5.1: LINKS deliberately holds no self-link).
    const allowed = new Set([join('src', 'config', 'links.ts'), join('src', 'config', 'site.ts')]);
    const offenders = codeFiles.filter(
      (file) => !allowed.has(label(file)) && hasInlineUrl(read(file)),
    );
    expect(offenders.map(label)).toEqual([]);
  });
});

describe('reduced motion (implementation plan §6.1)', () => {
  it('resets motion globally in styles/index.css', () => {
    const css = read(join(SRC, 'styles', 'index.css'));
    expect(css).toContain('prefers-reduced-motion: reduce');
    expect(css).toContain('scroll-behavior: auto');
  });
});

describe('static metadata fallbacks (implementation plan §4.3)', () => {
  const html = () => read(join(process.cwd(), 'index.html'));

  it('declares favicon, theme-color, and an absolute og:image', () => {
    const contents = html();
    expect(contents).toContain('rel="icon"');
    expect(contents).toContain('name="theme-color"');
    expect(contents).toMatch(
      /property="og:image" content="https:\/\/knowledgeassemble\.org\/og-image\.png"/,
    );
  });

  it('emits no static canonical, since Vercel serves index.html for every route', () => {
    expect(html()).not.toContain('rel="canonical"');
  });
});

describe('crawlable surface (AGENTS.md, Vercel rewrite)', () => {
  const ROUTES = ['/', '/projects', '/principles', '/community', '/about'];

  it('lists exactly the canonical routes in sitemap.xml, on the live origin', () => {
    const sitemap = read(join(process.cwd(), 'public', 'sitemap.xml'));
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    expect(locations).toHaveLength(ROUTES.length);
    for (const [i, route] of ROUTES.entries()) {
      expect(locations[i]).toBe(`https://knowledgeassemble.org${route}`);
    }
    expect(new Set(locations).size, 'no duplicate URLs').toBe(ROUTES.length);
  });

  it('excludes the not-found route, which is noindex', () => {
    const sitemap = read(join(process.cwd(), 'public', 'sitemap.xml'));
    expect(sitemap).not.toContain('404');
  });

  it('points robots.txt at the sitemap', () => {
    const robots = read(join(process.cwd(), 'public', 'robots.txt'));
    expect(robots).toMatch(/^Sitemap: https:\/\/knowledgeassemble\.org\/sitemap\.xml$/m);
  });

  it('agrees with the canonical paths the pages declare', () => {
    // A sitemap that drifts from the runtime canonical tags would tell crawlers
    // one thing and the pages another.
    const sitemap = read(join(process.cwd(), 'public', 'sitemap.xml'));
    const sources = [
      ...readdirSync(join(SRC, 'pages')).map((file) => read(join(SRC, 'pages', file))),
      // The homepage's canonicalPath lives in site.ts, not in a page module.
      read(join(SRC, 'config', 'site.ts')),
    ];
    const paths = sources
      .flatMap((contents) => [...contents.matchAll(/canonicalPath: '([^']+)'/g)].map((m) => m[1]))
      // The not-found route declares '' so it emits no canonical at all.
      .filter(Boolean)
      .sort();

    const listed = [...sitemap.matchAll(/<loc>https:\/\/knowledgeassemble\.org([^<]*)<\/loc>/g)]
      .map((m) => m[1])
      .sort();

    expect(listed).toEqual(paths);
  });
});
