/// <reference types="node" />
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProjectVisual from '../components/visuals/ProjectVisual';
import PrincipleVisual from '../components/visuals/PrincipleVisual';

const ROOT = process.cwd();
const VISUALS_DIR = join(ROOT, 'src', 'components', 'visuals');
const VISUALS_CSS = join(ROOT, 'src', 'styles', 'visuals.css');

const read = (file: string) => readFileSync(file, 'utf8');
const visualFiles = readdirSync(VISUALS_DIR).filter((file) => file.endsWith('.tsx'));

const BANNED_SVG = [
  '<filter',
  '<feGaussianBlur',
  '<image',
  '<foreignObject',
  'linearGradient',
  'radialGradient',
  '@font-face',
];

describe('hero replay', () => {
  it('does not persist the hero across sessions', () => {
    // The hero plays on every hard page load and is suppressed on SPA return by
    // a DOM-only class. A sessionStorage gate would freeze it after the first
    // visit in a session, which is the bug this guard exists to prevent.
    expect(read(join(ROOT, 'index.html'))).not.toContain('sessionStorage');
    expect(read(join(ROOT, 'scripts', 'prerender.tsx'))).not.toContain('sessionStorage');
    expect(read(join(ROOT, 'src', 'components', 'visuals', 'KnowledgeAssembly.tsx'))).not.toContain(
      'sessionStorage',
    );
  });
});

describe('reveal fail-safe', () => {
  it('never renders data-reveal in a visual component', () => {
    for (const file of visualFiles) {
      expect(read(join(VISUALS_DIR, file)), file).not.toContain('data-reveal');
    }
  });
});

describe('visual colour and geometry (spec §6, §7)', () => {
  it('uses no colour literal in the visual components', () => {
    for (const file of visualFiles) {
      const contents = read(join(VISUALS_DIR, file));
      expect(/#[0-9a-fA-F]{3,8}\b/.test(contents), file).toBe(false);
      expect(/\brgba?\(/.test(contents), file).toBe(false);
      expect(/\bhsla?\(/.test(contents), file).toBe(false);
    }
  });

  it('uses no banned SVG construct in the components or the stylesheet', () => {
    for (const file of [...visualFiles.map((f) => join(VISUALS_DIR, f)), VISUALS_CSS]) {
      const contents = read(file);
      for (const banned of BANNED_SVG) {
        expect(contents.includes(banned), `${file} contains ${banned}`).toBe(false);
      }
    }
  });
});

describe('no continuous motion (spec §13, §21, §28)', () => {
  it('has no infinite animation in the visuals or stylesheet', () => {
    for (const file of [...visualFiles.map((f) => join(VISUALS_DIR, f)), VISUALS_CSS]) {
      expect(/\binfinite\b/.test(read(file)), file).toBe(false);
    }
  });
});

describe('decorative accessibility (spec §34)', () => {
  it('marks every visual decorative and non-focusable', () => {
    for (const file of visualFiles) {
      const contents = read(join(VISUALS_DIR, file));
      expect(contents, file).toContain('aria-hidden');
      expect(contents, file).toContain('focusable');
      expect(contents, file).not.toContain('tabIndex');
    }
  });
});

describe('size budget (spec §35)', () => {
  it('keeps each visual under 20 KB and the set under 150 KB', () => {
    let total = 0;
    for (const file of visualFiles) {
      const size = statSync(join(VISUALS_DIR, file)).size;
      expect(size, file).toBeLessThan(20 * 1024);
      total += size;
    }
    expect(total).toBeLessThan(150 * 1024);
  });
});

describe('no animation dependency (spec §36)', () => {
  it('adds no animation library', () => {
    const pkg = JSON.parse(read(join(ROOT, 'package.json'))) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const banned of ['framer-motion', 'gsap', 'lottie', 'three', 'rive']) {
      expect(deps[banned], banned).toBeUndefined();
    }
  });
});

describe('unknown ids', () => {
  it('ProjectVisual and PrincipleVisual return null', () => {
    const project = render(<ProjectVisual projectId="nope" />);
    expect(project.container.firstChild).toBeNull();
    const principle = render(<PrincipleVisual principleId="nope" />);
    expect(principle.container.firstChild).toBeNull();
  });
});
