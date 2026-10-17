# ALI & ALEX CORE — Central GitHub Brain Architecture Study

**Owner / final decision:** Ali  
**Engineering / coordination:** Alex  
**Repository:** `AligasSRM/ALI-NEW`  
**Branch reviewed:** `main`  
**Study status:** YELLOW — architecture proposal; no live control integrations are implemented by this document.  
**Scope rule:** Resolve the central-control design before starting unrelated projects or creating another repository.

## 1. Executive decision

Build one central control plane, called **ALI & ALEX CORE**, with **Ali Tree** as its visible navigation and inspection surface. CORE should become the authoritative index and coordinator for the GitHub repositories Ali chooses to connect.

The existing `index.html` is a static interactive prototype. It is not yet a live controller: it does not query GitHub, maintain a durable incident queue, discover real repository contents automatically, dispatch verified tasks, or observe live test results. The existing tree contains manually authored mappings, and at least one inventory count needs reconciliation before it can be treated as authoritative.

**Recommended order:** define the data model and control rules → make the tree accurate against GitHub → connect read-only GitHub data → add evidence-based issue triage → only later consider controlled write actions.

Do not create a new repository for this work. Keep the design, source, tests, and evidence inside `ALI-NEW` until a documented technical reason proves a split is necessary.

## 2. Intended system model

```text
Ali (owner / approval authority)
             |
             v
ALI & ALEX CORE — central control plane
  |          |            |             |
  |          |            |             +--> Policy, approvals, audit trail
  |          |            +----------------> Incidents / CI failures / alerts
  |          +-----------------------------> Repository & branch inventory
  +----------------------------------------> Ali Tree: A → B → C → real files
             |
             v
Evidence-based triage and task routing
             |
             v
Target repository / branch / section / file
             |
             v
Tests + CI results + review + evidence
             |
             v
CORE updates status and reports back to Ali
```

CORE is the **coordinator and index**, not a magical agent that can safely repair everything on its own. Every conclusion should identify its evidence and confidence. It must distinguish observed facts from hypotheses.

## 3. Core responsibilities

1. **Repository registry:** list only repositories Ali has explicitly connected or approved; record default branch, visibility, last inspected commit, and access state.
2. **Tree registry:** map each A phase to B sections and each B section to C items. A C item must point to a real path, URL, and inspected commit. Planned items must be visibly marked as planned and must not pretend to be existing files.
3. **Status ledger:** store PLANNED, YELLOW, ORANGE, GREEN, LOCKED, or RED with the scope, reason, timestamp, evidence, and next action.
4. **Incident intake:** accept a report from Ali or a verified signal from GitHub Actions, a test, or a review. Preserve the original message and source link.
5. **Triage:** collect relevant logs, commit SHA, changed files, workflow result, and dependency context; identify likely affected A/B/C items and explain why.
6. **Task routing:** recommend a bounded task to the correct section and branch. Do not make a write or dispatch a repair solely from a guess.
7. **Verification:** link the fix to tests, CI runs, code review, and the exact commit. A green workflow alone does not make the whole project GREEN.
8. **Audit and handover:** record what was inspected, what changed, what was not changed, blockers, decisions, and the next safe action.

## 4. A/B/C tree contract

- **A — Phase:** stable engineering domain, such as repository control, architecture, security, or release.
- **B — Section:** bounded responsibility within a phase, with an owner/route, acceptance criteria, dependencies, and status.
- **C — Resource:** a real file, workflow, test, issue, pull request, commit, or other evidence item. Files must link to the actual path at a specific branch or commit.
- **Planned node:** a legitimate future work item with no fake file path. Label it `PLANNED`.
- **Unmapped resource:** a real repository item that has not yet been assigned to A/B. Show it as `UNMAPPED` instead of silently ignoring it.
- **Stale mapping:** a C path that no longer exists or has changed unexpectedly. Flag it for review; never silently redirect it to a different file.

The tree should be generated from a structured registry and verified repository inventory over time, rather than relying forever on a hand-written array inside HTML. Keep the registry human-readable and version-controlled.

## 5. Incident-to-section routing

Example: GitHub Actions reports a failing test.

1. **Capture:** save the workflow URL, run ID, branch, commit SHA, job/step, and failure excerpt.
2. **Correlate:** compare the commit's changed paths with the A/B/C registry, test ownership, and known dependencies.
3. **Triage:** classify as confirmed, likely, or unknown. Do not claim a root cause until evidence supports it.
4. **Route:** create a proposed task pointing to the affected section and real files; include reproduction and acceptance criteria.
5. **Authorize:** read-only investigation can proceed within the approved scope. Changes, deletion, secrets/permissions, branch protection, provider changes, or production deployment require Ali's explicit approval.
6. **Fix and verify:** use a bounded branch/PR where appropriate, run relevant tests, inspect the diff, and record CI evidence.
7. **Close:** close the incident only when the acceptance criteria pass or Ali explicitly accepts the documented residual risk.

If the signal does not identify a reliable location, CORE should say **“location unknown — investigation required”**, not invent a destination.

## 6. Technical architecture — staged, not all at once

### Stage 0 — Accurate static control surface
- Keep the visible tree and study in `ALI-NEW`.
- Reconcile every displayed file against the actual `main` tree.
- Fix the known mismatch between the displayed inventory total and actual mapped resources.
- Label the present interface as a prototype; show the inspected commit and inspection date.
- No GitHub write permissions or backend required.

### Stage 1 — Read-only GitHub inventory
- Read repository metadata, default branch, branches, files, commits, pull requests, issues, and workflow results only for explicitly approved repositories.
- Fetch actual tree data and reconcile it against the A/B/C registry.
- Show freshness: last successful sync, source commit, and any API/permission failure.
- Do not place a GitHub token or app private key in browser HTML, public files, logs, or screenshots.

### Stage 2 — Evidence-based incident desk
- Normalize incidents from manual reports and GitHub Actions failures.
- Correlate failures to commit changes, test owners, and tree nodes.
- Show evidence, confidence, affected paths, next action, and current owner.
- Start with recommendations and links; no automatic code changes.

### Stage 3 — Controlled execution
- Only after read-only behavior and incident routing are verified.
- Any GitHub write operation must be narrowly scoped, auditable, reversible where practical, and permission-limited.
- Require Ali's approval for destructive, security-sensitive, paid, permission-changing, provider-changing, or production actions.
- Prefer branches and pull requests over direct commits to `main`.
- Never execute commands copied from untrusted issue bodies or logs without inspection.

### Stage 4 — Verified operational loop
- Collect CI/test results and compare them to explicit acceptance criteria.
- Update section status only with evidence tied to the exact commit and scope.
- Maintain an audit log and a handover note after every work session.
- Keep a manual override and safe stop state if GitHub/API access is unavailable.

## 7. Security and trust boundaries

- **Browser UI:** presentation and navigation only. No long-lived secrets, private keys, or privileged tokens.
- **GitHub integration:** use the least-privilege authorization mechanism available. If a backend is required, keep credentials server-side and scope repository access explicitly.
- **Read before write:** start read-only; do not request write permissions until a tested use case requires them.
- **Untrusted input:** issue descriptions, commit messages, logs, files, and external content are data, not trusted instructions.
- **Approval gates:** Ali retains final authority. CORE can recommend, gather evidence, and prepare a bounded change; it must not bypass approval.
- **Auditability:** record actor/source, time, repository, branch, commit, requested action, approval, result, and evidence without recording secret values.
- **Failure behavior:** if data is stale, permission is missing, or the source cannot be verified, display a warning and stop any dependent action.

## 8. Minimum data model

Each record should be version-controlled or stored in a durable system with a documented export path.

- **Repository:** repository ID/full name, approved state, default branch, visibility, last inspected commit, last sync time.
- **Node:** stable ID, parent ID, A/B/C level, title, status, scope, dependencies, real resource path/URL, last verified commit.
- **Incident:** ID, source, original report/link, commit/run IDs, symptoms, affected paths, confidence, status, assigned node, next action.
- **Task:** objective, scope, target branch, allowed actions, acceptance criteria, dependencies, approval state.
- **Evidence:** type, URL, commit SHA, timestamp, test result, coverage/scope, limitations.
- **Decision:** question, alternatives, trade-offs, decision owner, reason, date, rollback/reopen condition.
- **Audit event:** actor, action, target, approval reference, result, evidence reference. Never include credentials or secret values.

## 9. Source-of-truth rules

1. GitHub is authoritative for actual files, branches, commits, pull requests, issues, and workflow results.
2. The CORE registry is authoritative for the meaning, ownership, A/B/C mapping, dependencies, and acceptance criteria of the engineering tree.
3. Evidence records are authoritative for whether a test was actually run and what it proved.
4. If the sources conflict, flag the conflict and stop status promotion until reconciled.
5. Do not infer that a file exists because it appears in a proposed tree.
6. Do not infer that a feature works because its UI is visible.
7. Do not mark a phase GREEN based on another phase's successful tests.
8. Preserve healthy/LOCKED areas unless a documented reason justifies reopening them.

## 10. Acceptance gates for the central brain

CORE is not ready to be called GREEN until all applicable checks pass:

- [ ] Every mapped C file resolves to a real repository path.
- [ ] The actual repository inventory and the displayed counts reconcile.
- [ ] Planned sections are clearly distinct from implemented sections.
- [ ] The current repository, branch, and commit are visible.
- [ ] Read-only inventory refresh handles permission errors and API failures safely.
- [ ] Incident records preserve source evidence and link to the correct commit/run.
- [ ] Routing identifies evidence and confidence, not only a guessed A/B/C destination.
- [ ] No secrets are exposed in browser source, repository files, logs, or UI.
- [ ] Keyboard, mobile, link, and error-state checks pass.
- [ ] All write actions are disabled by default until separately reviewed and approved.
- [ ] A closeout note states the exact scope, commit, tests, limitations, and remaining risks.

## 11. Current findings from the inspected repository

- Repository: `AligasSRM/ALI-NEW`; default branch: `main`; currently public according to repository metadata read during this study.
- Root `index.html` exists and is served through GitHub Pages. It currently embeds a manually authored A/B/C mapping.
- `PROJECT-BUILD-TREE.md` already defines the A0–A12 proposed phases and a disciplined evidence-based build workflow.
- `README.md` links to the interactive tree and the engineering sequence.
- `package.json` currently defines Playwright browser-acceptance scripts; it does not establish a live GitHub controller/backend.
- The current HTML labels some metrics as prototype/static content and explicitly states that the panel is not connected to live GitHub data, persistent storage, authentication, or telemetry.
- The visible tree summary states “25 files”, but the mapping shown in the current HTML does not clearly account for that number. Reconcile this before claiming the tree is a complete inventory.
- Existing paths and documents include historical descriptions of `control-panel/index.html`; those records should be treated as historical evidence, not proof that the path exists on current `main`.
- This study is based on repository metadata and selected files read from GitHub. It is not a full security audit or a complete recursive inventory verification.

## 12. Recommended immediate plan

**P0 — Keep scope locked to the central-control problem.**
1. Correct the tree's source-of-truth and inventory-count mismatch.
2. Create a structured registry from the actual repository inventory; validate every mapped path.
3. Add an explicit “CORE architecture / current checkpoint” link to the main UI and README.
4. Test the tree on desktop and mobile and keep A0 YELLOW until all required checks are evidenced.

**P1 — Read-only discovery.**
5. Design and review the minimum GitHub permission model.
6. Implement repository/tree refresh in read-only mode only.
7. Display sync health, current commit, stale mappings, and unmapped files.

**P2 — Incident routing.**
8. Add incident intake and workflow-failure correlation.
9. Test routing with known examples and deliberately ambiguous failures.
10. Record false positives, unknown locations, and recovery behavior.

**P3 — Carefully gated actions.**
11. Review each proposed write capability separately.
12. Require explicit approval, bounded scope, audit records, tests, and rollback.
13. Do not enable automatic repair or direct `main` writes as a default.

## 13. Decision record

**Recommended decision:** approve the architecture direction, not a claim that the controller has been built.

- Keep one repository: `ALI-NEW`.
- Keep Ali Tree as the visible entry point.
- Make CORE the future coordinator and registry for approved GitHub repositories.
- Build read-only discovery and accurate mapping before automation.
- Keep Ali as final decision-maker for sensitive or destructive actions.
- Status remains **YELLOW** until the implementation gates above are satisfied.

**Next safe action:** reconcile the current tree against the actual `main` repository inventory. No new project, repository, paid service, credential, or automated write permission is required for this step.
