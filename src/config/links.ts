/**
 * Centralized external URLs. Every external link in the site imports from
 * here; no URL is inlined anywhere else (plan §5.1, PRD §26).
 *
 * Verified against the live KnowledgeAssembly GitHub org. Note the three
 * distinct strings: the GitHub org is `KnowledgeAssembly`, the repo is
 * `knowledgeassemble.org`, and the brand is `KnowledgeAssemble`.
 */
export const LINKS = {
  // Verified against github.com/KnowledgeAssembly — see plan §10 Q1 (resolved).
  githubOrg: 'https://github.com/KnowledgeAssembly',
  githubRepo: 'https://github.com/KnowledgeAssembly/knowledgeassemble.org', // this repo

  // OpenEdu flagship. Repo is the canonical artifact; the Pages site is its
  // published demo. Note the hyphen: the org has several similarly named
  // repos (open-edu, open-edu-interactive, openedu-library, open-edu-pipeline).
  openedu: 'https://github.com/KnowledgeAssembly/open-edu',
  openeduSite: 'https://knowledgeassembly.github.io/open-edu/',
} as const;
