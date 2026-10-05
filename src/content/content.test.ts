import { describe, expect, it } from 'vitest';
import { projects } from './projects';
import { principles } from './principles';
import { communityTracks } from './community';

describe('principles content', () => {
  it('has exactly seven items', () => {
    expect(principles).toHaveLength(7);
  });

  it('numbers run 01–07 with no gaps or duplicates', () => {
    expect(principles.map((principle) => principle.number)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
    ]);
  });

  it('has unique ids', () => {
    expect(new Set(principles.map((principle) => principle.id)).size).toBe(principles.length);
  });
});

describe('community content', () => {
  it('has exactly five tracks', () => {
    expect(communityTracks).toHaveLength(5);
  });

  it('has unique ids', () => {
    expect(new Set(communityTracks.map((track) => track.id)).size).toBe(communityTracks.length);
  });
});

describe('projects content', () => {
  it('marks OpenEdu as the flagship', () => {
    expect(projects.find((project) => project.id === 'openedu')?.isFlagship).toBe(true);
  });

  it('has exactly one flagship project', () => {
    expect(projects.filter((project) => project.isFlagship)).toHaveLength(1);
  });

  it('has unique ids', () => {
    expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length);
  });
});
