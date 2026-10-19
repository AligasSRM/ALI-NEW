# Section 20 — Project Handover: Open-Ended CORE Hierarchy
**Project:** ALI-NEW  
**Recorded:** 2026-10-18  
**Purpose:** Durable continuation map for the A/B/C+ hierarchy migration. Read this before making further changes.

## 1. Authority and scope
- Owner and final decision-maker: Ali.
- Engineering coordination: Alex.
- Scope is limited to `AligasSRM/ALI-NEW`.
- Do not open or change other projects as part of this task.
- No merge to `main`, no production deployment, and no broadening scope without Ali's explicit direction.
- Inspect current branch, files, CI, and evidence before every follow-up change. Do not claim GREEN without passing evidence.

## 2. Current GitHub checkpoint
- Pull request: https://github.com/AligasSRM/ALI-NEW/pull/8
- Title: `feat(core): migrate to an open-ended A/B/C+ hierarchy`
- State at recording: OPEN, DRAFT, NOT MERGED.
- Base branch: `main`; working branch: `feat/open-ended-core-tree`.
- Latest PR head commit observed: `8184bc4457cd92f834c08b24232a751f74212168`.
- PR base SHA observed: `3a12d85812a54d966c7238a05b3cda1245ff2fa2`.
- Do not treat the PR merge-ref SHA as the branch head.
- Latest known PR has 7 changed files before this handover note is added.

## 3. Accepted logical model
- **A** = the 13 top-level logical project sections, `A0` through `A12`.
- **B** = direct resource/file entries under an A section.
- **C and deeper (D…Z, as needed)** = tasks, incidents, checks, evidence, or future nested records under a parent.
- The hierarchy is open-ended; do not impose a fixed maximum depth at C.
- Identifiers are local to their parent. The complete canonical path is the identity, e.g. `A0/B3/C0/M0`; repeated local numbers under different parents are allowed.
- A/B/C are logical routing labels, not actual repository directories. Do not move or rename physical files just to match logical IDs.
- Preserve historical B labels/mappings in notes where applicable.
- Resolver behavior should prefer exact physical-path matches, then validate the complete parent chain. Ambiguous, missing, partial-only, or unapproved repository routes must resolve to `UNKNOWN`.
- Deeper task/evidence nodes may be logical and need not have a physical file path. A planned B resource without a real path must not falsely imply that a file exists.

## 4. Files changed in the migration
1. `core/registry.json`
2. `core/registry.schema.json`
3. `core/route-resolver.mjs`
4. `scripts/validate-core-registry.mjs`
5. `tests/core-route-resolver.test.mjs`
6. `core/incidents.html`
7. `docs/architecture/OPEN-ENDED-CORE-HIERARCHY.md`

This handover document is an additional durable checkpoint on the same feature branch.

## 5. Implementation checkpoint
- Registry schema version was raised to `2.0.0`.
- Schema accepts one uppercase Latin level letter A–Z, with IDs starting with their level letter and full `parentId` paths.
- The 13 A roots remain.
- Existing mapped physical resources were reorganized in the logical registry as direct B children; this did not move or rename physical repository files.
- Current reported count: 38 mapped physical resources, including the new architecture document. Revalidate this count after adding this handover file.
- Incident UI displays the full hierarchy path rather than assuming exactly A→B→C.
- Resolver tests cover exact paths, unknown routes, unapproved repositories, partial matches, free-text-only records, duplicate routes, and a deeper C→M chain.
- Registry status remains `PARTIALLY_VERIFIED`. Do not upgrade it to `VERIFIED` or `GREEN` without further evidence.

## 6. Verification evidence — exact known state
Workflow: https://github.com/AligasSRM/ALI-NEW/actions/runs/39136362931  
Run ID: `39136362931`  
Browser job ID: `117701565501`

**Passed steps:**
- Secret scan (Gitleaks): no leaks found in the scanned PR commit range.
- Dependency install/audit: 4 packages audited, 0 vulnerabilities reported in that run.
- A0 HTML/inline JavaScript/control-panel invariants.
- CORE inventory snapshot validation.
- CORE registry hierarchy and tracked-file coverage.
- Evidence-only CORE route resolver tests.
- Playwright Chromium installation.

**Failed step:**
- `Run browser acceptance tests` failed. The run reported **9 passed and 4 failed**.
- The four failing tests are in `tests/ali-new-a0.spec.ts`:
  1. `loads the Ali Tree and drills from A to B to real C file paths`
  2. `incident console routes exact paths and exposes no write action`
  3. `incident console correlates mocked run, commit paths, and failed step metadata`
  4. `planned sections do not pretend files exist`
- Observed assertion example: locator `.tree-select` expected count 1 but received 0. The test also contains legacy A/B/C assumptions. Treat this as a confirmed browser-acceptance failure; do not assume the root cause without reviewing the affected test, current UI, and full trace/artifact.
- Failure evidence artifact: https://github.com/AligasSRM/ALI-NEW/actions/runs/39136362931/artifacts/12139941111
- Therefore the PR is **not fully validated** and the migration is not GREEN.

## 7. Status board
- **GREEN for narrow checks only:** registry/schema validation, tracked-file coverage, resolver unit tests, A0 static invariants, and the reported secret scan.
- **YELLOW:** hierarchy migration and PR review; browser acceptance has known failures to diagnose.
- **PARTIALLY_VERIFIED:** registry status.
- **LOCKED / DO NOT CHANGE:** the accepted open-ended A/B/C+ design, preservation of A0–A12 roots, physical file locations, and no automatic merge/deploy.
- **NOT DONE:** browser acceptance recovery, final regression review, PR merge decision, production readiness.

## 8. Next phase — ordered plan
1. Re-fetch PR #8, branch head, workflow runs, and current changed-file list before editing; this note may cause a new CI run.
2. Inspect the four failed Playwright tests and their assertions against the current tree and incident UI. Read the relevant test file and failure trace/artifact; distinguish outdated test assumptions from genuine UI regressions.
3. Update only the tests/UI behavior required to make the agreed open-ended hierarchy consistent. Preserve the “no fake files” and “no write action” invariants.
4. Re-run targeted tests first, then the full relevant Playwright acceptance and registry/resolver checks.
5. Confirm the new workflow run's final status, not an in-progress result. Record run IDs and evidence here.
6. Review the complete PR diff for scope, accidental physical path changes, security/privacy issues, and documentation consistency.
7. Keep the PR open and unmerged until Ali explicitly approves merging. Do not deploy production as part of this phase.

## 9. Rules for future continuation
- Start from this handover, but verify live GitHub state before relying on it.
- Never repeat a failed diagnostic attempt without changing the hypothesis or inspecting new evidence; after three failed attempts, stop and consult official docs/issues.
- Do not invent files, routes, successful tests, credentials, or provider status.
- Keep secrets out of docs, code, screenshots, and commit messages.
- Do not mark a section GREEN just because the code exists or a workflow partially passed.
- Any future change must state: target, reason, evidence, files affected, tests, risks, and rollback/next step.
