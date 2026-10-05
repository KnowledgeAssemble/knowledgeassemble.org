import type { PrincipleItem } from '../types';

/**
 * The seven guiding principles. `number` ("01"–"07") is what renders;
 * `sectionNumber` ("13.x") is PRD traceability only and must never reach the
 * UI (plan §5.2, §3.1). Copy is verbatim from PRD §13.
 */
export const principles: PrincipleItem[] = [
  {
    id: 'open-by-default',
    number: '01',
    sectionNumber: '13.1',
    title: 'Open by default',
    summary:
      'Prefer open-source software, open standards, open formats, and publicly understandable systems.',
    body: [],
  },
  {
    id: 'knowledge-should-be-portable',
    number: '02',
    sectionNumber: '13.2',
    title: 'Knowledge should be portable',
    summary:
      'Knowledge should not depend unnecessarily on the application that happens to display it.',
    body: [],
  },
  {
    id: 'composable-over-monolithic',
    number: '03',
    sectionNumber: '13.3',
    title: 'Composable over monolithic',
    summary: 'Prefer systems that can be combined, replaced, extended, and reused.',
    body: [],
  },
  {
    id: 'experience-matters',
    number: '04',
    sectionNumber: '13.4',
    title: 'Experience matters',
    summary:
      'Knowledge is more than stored information. People understand through interaction, exploration, context, and experience.',
    body: [],
  },
  {
    id: 'accessibility-is-foundational',
    number: '05',
    sectionNumber: '13.5',
    title: 'Accessibility is foundational',
    summary:
      'Accessibility should influence architecture, interaction, content, and visual design from the beginning.',
    body: [],
  },
  {
    id: 'human-judgment-matters',
    number: '06',
    sectionNumber: '13.6',
    title: 'Human judgment matters',
    summary:
      'AI can assist with creation, discovery, and exploration, but people remain responsible for meaning, context, and judgment.',
    body: [],
  },
  {
    id: 'build-test-learn',
    number: '07',
    sectionNumber: '13.7',
    title: 'Build, test, learn',
    summary: 'Ideas should be tested through real use rather than protected by elaborate speculation.',
    body: [],
  },
];
