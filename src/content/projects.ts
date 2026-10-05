import type { ProjectItem } from '../types';
import { LINKS } from '../config/links';

/**
 * Project data. Copy is verbatim from PRD §7 and §12; OpenEdu facts are the
 * verified ones recorded in plan §11.3. Do not add metrics, versions, or
 * adoption claims that do not exist.
 */
export const projects: ProjectItem[] = [
  {
    id: 'openedu',
    name: 'OpenEdu',
    tagline: 'An open framework for creating accessible, interactive learning experiences.',
    description:
      'An open runtime for educational experiences that separates content from delivery platforms.',
    status: 'Active',
    categories: ['Education', 'Open Source', 'Interactive Learning'],
    externalUrl: LINKS.openedu,
    isFlagship: true,
  },
  {
    id: 'knowledge-systems',
    name: 'Knowledge Systems',
    tagline: 'Tools, formats, and engines for structuring, connecting, and exploring knowledge.',
    description:
      'Tools and infrastructure for making knowledge structured, portable, and interactive.',
    status: 'Exploring',
    categories: ['Structured Knowledge', 'Portable Formats', 'Interactive Systems'],
  },
  {
    id: 'experiments',
    name: 'Experiments',
    tagline: 'Prototypes and explorations for discovering better ways to work with knowledge.',
    description: 'Small explorations, prototypes, and ideas around knowledge and learning.',
    status: 'Ongoing',
    categories: ['Prototypes', 'Canvas'],
  },
];

export const flagshipProject = projects.find((project) => project.isFlagship);
