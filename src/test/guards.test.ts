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

describe('colour discipline (AGENTS.md, implementation plan §2.2)', () => {
  it('keeps hex, rgb(), and hsl() literals out of src except index.css', () => {
    const offenders = productionFiles.filter((file) => {
      if (label(file) === join('src', 'styles', 'index.css')) return false;
      const contents = read(file);
      return (
        /#[0-9a-fA-F]{3,8}\b/.test(contents) ||
        /\brgba?\(/.test(contents) ||
        /\bhsla?\(/.test(contents)
      );
    });
    expect(offenders.map(label)).toEqual([]);
  });
});

describe('focus rings (AGENTS.md)', () => {
  it('uses outline, never ring-* utilities', () => {
    // `focus-ring` (our outline-based utility) has no trailing dash, so it does
    // not match. Tailwind ring utilities (ring-2, ring-[...], focus:ring-*) do.
    const offenders = codeFiles.filter((file) => /\bring-/.test(read(file)));
    expect(offenders.map(label)).toEqual([]);
  });
});

describe('visual constraints (AGENTS.md)', () => {
  it('uses no shadows, gradients, pill or full radii', () => {
    const forbidden = /shadow-|drop-shadow|bg-gradient|rounded-full|rounded-pill/;
    const offenders = codeFiles.filter((file) => forbidden.test(read(file)));
    expect(offenders.map(label)).toEqual([]);
  });

  it('uses only rounded-control and rounded-panel', () => {
    const allowed = new Set(['rounded-control', 'rounded-panel']);
    const offenders: string[] = [];
    for (const file of codeFiles) {
      for (const match of read(file).match(/rounded-[a-z]+/g) ?? []) {
        if (!allowed.has(match)) offenders.push(`${label(file)}: ${match}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('external URLs (implementation plan §11, Phase 11)', () => {
  it('are centralized in src/config/links.ts', () => {
    const linksFile = join('src', 'config', 'links.ts');
    const offenders = codeFiles.filter(
      (file) => label(file) !== linksFile && /https?:\/\//.test(read(file)),
    );
    expect(offenders.map(label)).toEqual([]);
  });
});
