/**
 * Centralized external URLs. Every external link in the site imports from
 * here; no URL is inlined anywhere else (plan §5.1, PRD §26).
 *
 * Verified against the live KnowledgeAssemble GitHub org. Note the two
 * distinct strings: the org and brand are both `KnowledgeAssemble`, and the
 * repo is `knowledgeassemble.org`.
 */
export const LINKS = {
  // Verified against github.com/KnowledgeAssemble — see plan §10 Q1 (resolved).
  githubOrg: 'https://github.com/KnowledgeAssemble',
  githubRepo: 'https://github.com/KnowledgeAssemble/knowledgeassemble.org', // this repo

  // OpenEdu flagship. Repo is the canonical artifact; the Pages site is its
  // published demo. Note the hyphen: the org has several similarly named
  // repos (open-edu, open-edu-interactive, openedu-library, open-edu-pipeline).
  openedu: 'https://github.com/KnowledgeAssemble/open-edu',
  openeduSite: 'https://knowledgeassemble.github.io/open-edu/',
} as const;
