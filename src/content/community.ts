import type { CommunityTrack } from '../types';

/**
 * The five participation tracks. Taglines are verbatim from PRD §14; the
 * contribution lists follow the audience breakdown in plan §3.1.
 */
export const communityTracks: CommunityTrack[] = [
  {
    id: 'educators',
    role: 'Educators',
    tagline: 'Help us understand how people teach and learn.',
    contributions: ['Pedagogical models', 'Classroom utility', 'Interactive learning workflows'],
    suggestedAction: 'Share how you teach',
  },
  {
    id: 'developers',
    role: 'Developers',
    tagline: 'Build tools, engines, integrations, and infrastructure.',
    contributions: ['Parsing engines', 'AST protocols', 'Render engines and integrations'],
    suggestedAction: 'Contribute code',
  },
  {
    id: 'researchers',
    role: 'Researchers',
    tagline: 'Explore questions around learning, knowledge, accessibility, and technology.',
    contributions: ['Accessibility research', 'Cognitive load', 'Learning telemetry'],
    suggestedAction: 'Share findings',
  },
  {
    id: 'families-and-learners',
    role: 'Families and learners',
    tagline: 'Try things, share experiences, and help us understand what actually works.',
    contributions: ['User testing', 'Lived experience feedback', 'Clarity audits'],
    suggestedAction: 'Try things and report back',
  },
  {
    id: 'contributors',
    role: 'Contributors',
    tagline: 'Improve documentation, translations, examples, design, testing, and open-source projects.',
    contributions: ['Documentation', 'Translation', 'Code review and design polish'],
    suggestedAction: 'Open a pull request',
  },
];
