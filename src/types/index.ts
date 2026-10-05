export type ProjectStatus = 'Active' | 'Exploring' | 'Ongoing';

export interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  version?: string;
  categories: string[];
  externalUrl?: string;
  isFlagship?: boolean;
}

export interface PrincipleItem {
  id: string;
  number: string; // "01".."07" — THIS is what renders
  sectionNumber: string; // "13.1" — PRD traceability only. NEVER rendered.
  title: string;
  summary: string;
  body: string[];
}

export interface CommunityTrack {
  id: string;
  role: string;
  tagline: string;
  contributions: string[];
  suggestedAction: string;
}

export interface PageMeta {
  title: string; // "Principles — KnowledgeAssemble"
  description: string; // 120–160 chars, from PRD copy
  canonicalPath: string; // "/principles" — resolved to absolute via site.siteUrl
}
