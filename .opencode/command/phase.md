---
description: Implement a single KnowledgeAssemble V1 phase, then audit it against the Definition of Done. Use when a numbered phase (1-11) should be built. Optionally pass a phase number, e.g. /phase 3.
agent: orchestrator
---

Implement and verify **Phase $ARGUMENTS** of the KnowledgeAssemble V1 site.

Follow `AGENTS.md` and `docs/IMPLEMENTATION_PLAN.md` §7. Do not work from memory
of the plan — read the phase section first.

## Sequence

1. **Preconditions.** Read plan §7 for this phase and §10 for anything that
   blocks it. If a blocking open question is unresolved, stop and report it.
   Do not invent an answer to an organizational question.

2. **Delegate implementation.** Call the `phase-builder` subagent with the
   phase number and scope. It writes code and reports verification output.

3. **Delegate audit.** Call the `phase-auditor` subagent with the phase number
   and `phase-builder`'s report. It independently re-checks §7/§8 rather than
   trusting the report.

4. **Report.** Present the auditor's findings grouped as BLOCKER / REGRESSION /
   NOTE, with the verification commands that were actually run. State plainly
   what is not done.

## Rules

- One `phase-builder` at a time. Phases share `src/styles/index.css` and the
  routing shell; parallel writes conflict.
- Do not commit unless the user asks. The builder is denied commit/push; that
  is intentional.
- If the auditor finds a BLOCKER, re-dispatch `phase-builder` to fix it and
  re-audit. Do not mark the phase done on a failed audit.
- Never report a phase complete on the strength of the builder's own summary.
  The audit is the gate.
- If a design question can only be answered by looking at a `screen.png`,
  surface it. The subagents have no image input.
