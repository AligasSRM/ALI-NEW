# ALI-NEW — Project Build Tree
**Version:** 1.0  
**Date:** 2026-10-16  
**Owner / final decision:** Ali  
**Engineering & coordination:** Alex  
**Repository:** https://github.com/AligasSRM/ALI-NEW  
**Status:** YELLOW — planning and control-panel prototype; not production-ready.  
**Change policy:** OPEN TO CHANGE — the levels, section count, repository count, tools, architecture, and priorities are proposals that may be revised for a better, newer, safer, or more maintainable solution. Nothing is immutable merely because it appears in this tree.

## 1. Purpose and rules
This tree is the source of truth for building ALI-NEW from zero to a verified release. The levels below are a proposed baseline, not a claim that every feature is already implemented. Each section must follow: inspect → specify → implement → test → review/security → evidence → GREEN → LOCK. No section is GREEN without repeatable evidence. Never copy code, files, configuration, or architecture from another project without Ali's explicit approval. Free-first; no paid activation, card, or upgrade without explicit approval. No secrets in repository files.

## 2. Changeability is a permanent rule (OPEN TO CHANGE)
The A0–A12 numbering is a starting map, not a hard limit. A13, A14, A15, or later levels may be added whenever evidence, product needs, newer technology, security, maintainability, or cost/availability make that the better choice. Sections may be split, merged, renamed, reordered, or removed only after impact analysis and an explicit record of the reason. Repository count is also changeable: start with one primary repository, but create another when a documented technical, security, ownership, deployment, or operational reason justifies it. Do not create or avoid repositories merely to satisfy a fixed number.


## 3A. Technology and provider neutrality (mandatory gate)
The project and its data are the durable assets; tools, builders, hosts, databases, AI services, and other providers are replaceable means—not permanent project identity.
1. Define the requirement and acceptance tests before choosing a tool. Compare suitable alternatives, including free/no-card options where practical.
2. For each significant dependency, record its purpose, alternatives, rationale, free-tier limits/costs, geographic availability, permissions/data exposure, lock-in risks, export path, replacement path, and rollback.
3. Keep provider-specific code/configuration at explicit integration boundaries. Use portable data formats and clear interfaces where proportionate; avoid both unnecessary coupling and needless abstraction.
4. Keep provider names out of generic domain names, core contracts, and unrelated files unless technically necessary. Centralize provider-specific details in the relevant adapter/configuration/docs.
5. Before replacing/removing a dependency, inventory references, credentials/configuration names (never reveal secret values), data, jobs, workflows, and downstream consumers; plan migration and rollback; obtain required approval; test the new path and search for stale references.
6. GREEN certifies tested behavior within a stated scope and commit, not permanent approval of a provider. Re-evaluate when requirements, pricing, limits, availability, security, maintainability, or alternatives materially change.
7. Do not over-engineer portability. Choose the smallest boundary that makes a realistic future replacement manageable.
8. Never start paid activation, upgrade, or card-required service without Ali's explicit approval.

**Required decision gate:** a significant dependency cannot move beyond PLANNED/YELLOW until the decision record covers the requirement, alternatives, trade-offs, exit plan, and verification criteria.

## 3. Project levels (A0–A12 baseline)
- **A0 — Project Control Panel & identity (FIRST):** project title, browser tab title, visual system, navigation, progress/status, section tree, evidence links, responsive layout, accessibility basics. Deliverable: `control-panel/index.html` prototype. Gate: visual review on desktop/mobile and interaction checks.
- **A1 — Product definition:** problem, audiences, value, scope, exclusions, terminology, acceptance criteria, unresolved questions.
- **A2 — Product UX/UI:** user journeys, page inventory, wireframes, design tokens, RTL Arabic and English behavior, responsive/accessibility rules.
- **A3 — Architecture & boundaries:** domain model, trust boundaries, data flows, API contracts, threat model, provider-neutral interfaces, exit/migration plans.
- **A4 — Repository & developer workflow:** source layout, naming, contribution rules, formatting/linting, tests, branch/PR strategy, CI baseline.
- **A5 — Identity & creator verification:** account lifecycle, authentication, session policy, recovery, creator verification, abuse controls; no real credentials committed.
- **A6 — Core video product:** upload pipeline, media metadata, playback, captions, language metadata, processing states, failure/retry behavior.
- **A7 — Moderation & safety:** pre-publication review, reporting, appeals, policy decisions, audit trail, age/privacy safeguards.
- **A8 — Discovery & community:** search, categories, creator pages, follows/saves, recommendations only after safety and privacy review.
- **A9 — Admin & operations:** least-privilege roles, approvals, incident handling, audit logs, support tools, operational runbooks.
- **A10 — Data & integrations:** schema/migrations, retention/export/deletion, backup/restore, provider-neutral adapters, integration contract tests.
- **A11 — Security, privacy & quality:** threat-model review, dependency/SBOM checks where feasible, secrets scan, authorization tests, accessibility, performance, regression and recovery tests.
- **A12 — Release & maintenance:** staging/live gates, deployment rollback, monitoring, documentation, ownership, release checklist, post-release review. Production release remains blocked until all required gates pass.

## 4. A0 sections (first milestone)
- **A0.1 — Identity:** visible product name “ALI-NEW”; subtitle “Ali & Alex Engineering Control Panel”; browser title “ALI-NEW | Engineering Control Panel”.
- **A0.2 — Visual system:** dark navy background, clear cards, teal/coral status accents, readable typography, consistent spacing; avoid decorative clutter.
- **A0.3 — Main layout:** sidebar navigation + main workspace; compact top bar with project name and current status.
- **A0.4 — Overview:** project purpose, current milestone, next action, evidence/links.
- **A0.5 — Build tree:** expandable A0–A12 hierarchy with section IDs and one-line scope.
- **A0.6 — Status model:** PLANNED, YELLOW, ORANGE, GREEN, LOCKED, RED with text labels (not color alone).
- **A0.7 — Section detail:** objective, files, dependencies, acceptance checks, risks, evidence, decision log.
- **A0.8 — Repository map:** distinguish control-panel source, project documentation, future application source, tests and evidence. Do not split into many repositories prematurely.
- **A0.9 — Responsive & accessible:** desktop-first engineering workspace that remains usable on mobile; keyboard focus, contrast, semantic controls, Arabic RTL support.
- **A0.10 — Verification:** check links, navigation, tree interactions, mobile viewport, console/errors, and document known limitations before marking GREEN.

## 5. Proposed repository layout (single repository initially)
```text
ALI-NEW/
├── README.md
├── IDEAS-ALI-ALEX.md
├── ALI-ALEX-MASTER-PROJECT-PROMPT.md
├── PROJECT-BUILD-TREE.md
├── PROJECT-STATUS.md
├── docs/
│   ├── product/
│   ├── ux/
│   ├── architecture/
│   ├── security/
│   ├── decisions/
│   └── operations/
├── control-panel/
│   ├── index.html
│   ├── assets/
│   └── README.md
├── app/                 # create after A1–A4 design gates; no application code yet
├── tests/               # add alongside the first testable behavior
└── evidence/
    ├── A0/
    └── releases/
```

This is a planned structure, not a claim that every directory already exists. Create directories only when they contain useful files. Keep one repository until a concrete security, ownership, deployment, or scaling reason justifies a split.

## 6. Repository strategy
1. **ALI-NEW (primary/private):** source of truth for product docs, control-panel prototype, future app, tests, and evidence.
2. **Optional public documentation repository:** only if Ali later explicitly wants a public methodology or public-facing docs; not needed now.
3. **Optional deployment mirror:** only if a selected host requires it and its cost/exit plan is reviewed.
Do not create extra repositories yet. No legacy project repository is a source for ALI-NEW code.

## 7. Status definitions
- **PLANNED:** not started.
- **YELLOW:** being designed or built; not verified.
- **ORANGE:** integration or external dependency remains unverified.
- **GREEN:** acceptance criteria passed with evidence.
- **LOCKED:** accepted and frozen; reopen only for a documented technical reason or Ali's decision.
- **RED:** blocking defect, unsafe condition, or failed gate.

## 8. Completion gate for every section
1. Scope and acceptance criteria written.
2. Existing files and dependencies inspected before edits.
3. Implementation matches approved scope; no unrelated changes.
4. Relevant automated/manual tests run and results recorded.
5. Security, privacy, accessibility and failure modes reviewed as applicable.
6. Evidence links and changed-file list recorded.
7. Remaining risks and rollback/exit path documented.
8. Ali's approval obtained for major, sensitive, paid, destructive, or production actions.

## 9. Required closeout note and GREEN certificate
- The repository contains `README.md`, `IDEAS-ALI-ALEX.md`, and `ALI-ALEX-MASTER-PROJECT-PROMPT.md`.
- The build tree and A0 prototype have been saved and fetched back from GitHub; this verifies file persistence only, not full browser behavior or production readiness.
- No evidence currently establishes a complete application, production deployment, or production readiness.
- The control panel is a static front-end prototype. It is not yet connected to GitHub data, persistent storage, authentication, or live project telemetry.

## 10. Current verified baseline
- The repository contains `README.md`, `IDEAS-ALI-ALEX.md`, `ALI-ALEX-MASTER-PROJECT-PROMPT.md`, this build tree, and the control-panel prototype.
- The tree and prototype were saved and fetched back from GitHub. This verifies file persistence, not browser behavior or production readiness.
- No evidence currently establishes a complete application, production deployment, or production readiness.
- The control panel is a static front-end prototype. It is not connected to GitHub data, persistent storage, authentication, or live project telemetry.

## 11. Next actions
1. Review the A0 visual prototype on desktop and mobile.
2. Record visual and usability fixes; do not add backend functionality yet.
3. Agree A0 acceptance criteria and verify the prototype.
4. Lock A0 only after evidence is captured.
5. Proceed to A1 product definition, then A2–A4 before creating the main application implementation.


## 12. Repository / section closeout record (mandatory)
Before any repository, level, or section can be closed, create or update a durable closeout note. The note must record:
- Scope and exact files/repositories inspected.
- Baseline observed before work.
- What existed and what was missing.
- What changed, what was intentionally not changed, and why.
- Defects, blockers, confusing behavior, failed attempts, and how they were resolved (or why they remain open).
- Commands/tests/checks actually run, with results and evidence links.
- Security/privacy/dependency/compatibility review as relevant.
- Remaining risks, known limitations, rollback/reopen conditions, and future improvements.
- Final file list and commit references.
- Status decision and reviewer/approval.

A closeout note is not a substitute for tests. A section is GREEN only if its acceptance criteria pass and evidence is linked. If any required criterion is untested or fails, keep it YELLOW/ORANGE or mark RED as appropriate.

## 13. GREEN certification (evidence-based)
Only issue a GREEN certificate after all required acceptance checks pass. The certificate must name the exact repository, branch, commit SHA, section/scope, test environment, tests and results, evidence links, known limitations, and approval date. It certifies only the stated scope and commit—not the entire product or future commits. A later change invalidates the old certificate for the changed scope until regression checks are repeated. GREEN is not a claim of absolute security or compatibility with every possible system.

Suggested certificate file: `evidence/A0/GREEN-CERTIFICATE.md` (create only after A0 passes). Suggested closeout file: `evidence/A0/CLOSEOUT-NOTE.md` (maintain throughout work). These are planned paths; they do not exist until created.

## 14. Section record template
For each section, maintain:
- ID and title
- Status and changeability
- Goal and exclusions
- Exact files/repositories in scope
- Dependencies and impact of change
- Baseline / existing state
- Planned changes
- Acceptance criteria
- Tests and results
- Evidence links
- Blockers and lessons learned
- What was not done and why
- Remaining risks / rollback
- Closeout note and certificate link if GREEN
