# Ali Tree — Central GitHub Control Architecture Study

**Owner / final decision:** Ali  
**Engineering / coordination:** Alex  
**Repository:** `AligasSRM/ALI-NEW`  
**Branch reviewed:** `main`  
**Study status:** YELLOW — architecture proposal; no live control integrations are implemented by this document.  
**Scope rule:** Resolve the central-control design before starting unrelated projects or creating another repository.

## 1. Executive decision

Build one central control plane, called **Ali Tree**, as the visible navigation and inspection surface. It should become the authoritative index and coordinator for the GitHub repositories Ali chooses to connect.

The existing `index.html` is a static interactive prototype. It is not yet a live controller: it does not query GitHub, maintain a durable incident queue, discover real repository contents automatically, dispatch verified tasks, or observe live test results. The existing tree contains manually authored mappings, and at least one inventory count needs reconciliation before it can be treated as authoritative.

**Recommended order:** define the data model and control rules → make the tree accurate against GitHub → connect read-only GitHub data → add evidence-based issue triage → only later consider controlled write actions.

Do not create a new repository for this work. Keep the design, source, tests, and evidence inside `ALI-NEW` until a documented technical reason proves a split is necessary.

## 2. Intended system model

```text
Ali (owner / approval authority)
             |
             v
Ali Tree — central control plane
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

## 2A. Required user experience — CORE is the front door

The required default experience is **CORE first**, not a file browser first. Ali opens the CORE dashboard and submits a command, question, error report, or task there. CORE then gathers repository evidence, identifies the likely location, and presents a traceable route. The dashboard is the primary workspace; Ali Tree is the hierarchical inspection view controlled by CORE.

Important platform boundary: an ordinary GitHub Pages website cannot automatically appear on top of every GitHub page or intercept every action inside GitHub.com. The practical first implementation is to make the CORE dashboard the saved starting page/bookmark and provide verified deep links into GitHub. If Ali later requires a persistent overlay or command interception inside GitHub.com, that is a separate browser-extension or GitHub-App integration and must be designed and permission-reviewed separately. Do not claim this behavior exists until implemented and tested.

### Screen 1 — CORE dashboard (first page)
Show:
- command / problem intake at the top;
- current task queue and approvals waiting for Ali;
- red/yellow/orange/green status with text labels;
- repository inventory and sync health;
- recent errors and CI failures with evidence links;
- the next recommended action, why it was chosen, and confidence;
- a prominent link to Ali Tree.

### Screen 2 — A phase page
Clicking an A item opens a dedicated phase view. It lists its B sections vertically, ordered by stable numeric ID (A0.1, A0.2 … or B0, B1, B2 … as the chosen naming convention specifies). Each row shows title, status, unresolved issues, and evidence count. Provide breadcrumb navigation back to CORE and the A list.

### Screen 3 — B section page
Clicking B0 opens a dedicated section view listing C resources vertically in ascending order: C0, C1, C2 … Each item shows its actual path, repository, branch/commit, resource type, status, and last verification. Missing, stale, or unmapped paths must be clearly flagged.

### Screen 4 — C resource / file detail
Clicking C opens the actual GitHub file or a CORE detail view with a verified deep link. The detail view shows the exact repository/path/ref, last inspected commit, connected incidents, related tests, recent changes, and actions allowed by current permissions. It must never substitute a similarly named file silently.

### Screen 5 — Incident / command detail
Every request gets a traceable record with original input, interpreted intent, repository scope, evidence collected, suspected A/B/C location, confidence, proposed next step, approval requirement, execution status, test result, and closure note.

### Navigation and ordering contract
- The vertical lists are numbered and sorted by numeric ID, not alphabetical string order (so C2 appears before C10).
- Each click opens the next hierarchy level as a distinct page/view, with breadcrumbs and a clear Back action.
- The same hierarchy and status are available from the CORE dashboard and Ali Tree; these are two views of one registry, not two manually maintained sources.
- Include search across repository, branch, path, A/B/C ID, incident, commit, and status.
- Include filters for RED, YELLOW, ORANGE, pending approval, failed checks, stale mapping, and unmapped resources.
- Provide a “show me the evidence” route for every diagnosis.
- Keep CORE visible as the stable home link on every screen.

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


## 14. Mandatory operating rule — CORE directs Alex; Alex does not start by searching blindly

This is a core product requirement, not an optional convenience.

**Primary flow:** Ali or a connected, verified source submits a command or incident to CORE. CORE is the first triage authority and must assemble the available evidence, determine the best-supported destination, and issue Alex a bounded investigation/fix task. Alex follows that route, validates the diagnosis locally against the actual code and surrounding dependencies, then reports back to CORE with evidence. CORE records the outcome and updates the registry.

### Required route format

Every routed task should include, when evidence supports it:

- **Repository:** exact `owner/repository` and repository URL.
- **Branch / commit:** exact branch and commit SHA that were inspected.
- **Hierarchy:** stable route such as `A1 → B2 → C5`.
- **Actual target:** exact file path, workflow, issue, test, or service identifier and a verified deep link.
- **Observed symptom:** the exact failure or report, not a paraphrase that loses key details.
- **Evidence:** failing workflow/run/job/step, log excerpt, changed paths, test result, or other source reference.
- **Diagnosis level:** confirmed, likely, or unknown, with confidence and explanation.
- **Alex's bounded task:** what to inspect or change, what must remain untouched, and acceptance criteria.
- **Approval gate:** whether the task is read-only or requires Ali's explicit approval before a write, permission change, deletion, or deployment.
- **Return report:** files inspected/changed, diff/commit/PR link, tests run and results, remaining risks, and evidence URLs.

### Routing behavior

1. CORE checks the incident source and repository registry first.
2. CORE correlates the error with the exact run/commit, changed files, test ownership, dependencies, and A/B/C mapping.
3. CORE returns the best-supported route. Example: `Repository A1 → Section B2 → Resource C5 → src/path/to/file`. This example is illustrative; actual routes must come from verified registry data.
4. Alex opens the supplied target and verifies that the file and failure context match before making changes. If they do not match, Alex reports the discrepancy to CORE and asks it to re-triage; Alex does not silently switch to a guessed file.
5. If the evidence is insufficient, CORE must return **UNKNOWN — targeted investigation required**, list the missing evidence, and prescribe the smallest next diagnostic action. Only then should Alex perform that bounded investigation.
6. CORE records Alex's findings and uses the new evidence to update the route if necessary.
7. No repair is considered complete until the relevant tests and acceptance criteria are checked and the evidence is attached to the incident.

### Role separation

- **CORE:** intake, repository inventory, evidence collection/correlation, routing, priority, policy checks, approval state, audit trail, status updates.
- **Alex:** execute the assigned bounded investigation or approved repair, validate the exact target, run relevant tests, report evidence and limitations.
- **Ali:** final decision-maker for sensitive, destructive, permission-changing, provider-changing, paid, and production actions.

CORE must not rely on an LLM guess as the sole source of a file location. It should use repository facts, test ownership metadata, workflow logs, commit diffs, dependency maps, and recorded prior incidents. A language model may explain or rank candidates, but each candidate must be tied to inspectable evidence.

### Acceptance tests for this rule

- A known failing test routes to its mapped file/section with a source link and exact commit.
- A failure caused by a recently changed dependency includes that dependency as a candidate with evidence, not an unsupported assertion.
- An ambiguous failure returns UNKNOWN and requests a bounded diagnostic step rather than inventing A/B/C IDs.
- A stale or missing C path is flagged; it is never silently replaced by a similarly named file.
- Alex's final report updates the same incident and registry record rather than creating an unlinked parallel status.
- Write operations remain disabled until separately approved and tested.

**Status:** requirement specified in the architecture document; routing automation is not implemented yet. Do not mark this requirement GREEN until the acceptance tests pass against the actual GitHub integration.


## 15. Mandatory permanent ID and addressing convention — A / B / C

This convention is mandatory for CORE, Ali Tree, Alex task routing, repository onboarding, incident records, documentation, and future connected repositories. It is part of the project's operating contract.

### Hierarchy and meaning

- **A = top-level project/repository domain.** Example: `A13` may identify a newly onboarded repository/domain only after checking the registry and reserving the next available stable ID. Do not assume the example number is available.
- **B = section within an A parent.** Example: `A13 → B5` identifies section B5 belonging to A13. B IDs are unique within their parent A scope; the complete address is always the parent path plus the local ID.
- **C = file/resource within a B parent.** Example: `A13 → B5 → C3` identifies resource C3 in that exact section. C can represent a real file, workflow, test, issue, pull request, commit, service, or evidence resource; its type must be explicit.
- Further hierarchy levels, if ever required, must be proposed and documented before use. Do not silently overload A/B/C meanings.

### Stable addressing requirements

1. Every registered node has a stable ID, level, parent ID, display name, resource type, and lifecycle status.
2. Every real resource also has its canonical repository name/ID, branch or immutable commit ref as appropriate, exact path or external resource ID, and verified deep link.
3. The human-friendly route is hierarchical: `A13 → B5 → C3`. The machine record must resolve that route to exactly one canonical target.
4. The same local ID (for example B1) may exist under different parent A nodes; therefore the **full hierarchical address**, not the local number alone, is the unambiguous identifier.
5. Reserve IDs centrally before adding nodes. Check for collisions and never silently renumber existing nodes when inserting a new item.
6. Sort IDs numerically, not lexicographically: C2 precedes C10. Keep display order separate from stable identity.
7. When a resource is renamed or moved, preserve its stable ID and update the canonical path with an audit record. If it is deleted, mark its record retired/deleted and do not recycle its ID for a different resource.
8. Planned nodes must be labelled PLANNED and must not claim a real file exists until verified. Unmapped discovered resources must be labelled UNMAPPED until assigned.
9. Every repository onboarding, new section, new file/resource, move, retirement, and mapping correction must update the same registry and be reflected in CORE and Ali Tree. Do not maintain separate hand-edited conflicting ID lists.
10. Every routed task and incident must carry the full hierarchical address when known, plus repository/path/commit evidence. If mapping is missing or ambiguous, CORE must report UNKNOWN/UNMAPPED and investigate rather than guess.

### Required command and response pattern

Example request: “CORE, direct Alex to A13, section B5, resource C3.”

CORE resolves the complete address and returns a task card containing:
- canonical repository and URL;
- A/B/C IDs and their names;
- exact target path and verified deep link;
- branch and inspected commit;
- incident evidence and diagnosis confidence;
- permitted action, approval gate, and acceptance criteria.

Alex must open and validate the exact target before acting. If the path, branch, commit, or mapping disagrees with the task card, Alex stops and returns the mismatch to CORE for re-resolution. Alex must not silently choose a similarly named resource.

### Acceptance tests

- Creating a repository/domain checks the registry and reserves a non-colliding A ID.
- Adding a section or resource reserves a B/C ID under the correct parent.
- Two different A parents may each have B1, but their full paths resolve to different records unambiguously.
- Numeric sorting places C2 before C10.
- Renames and moves preserve the ID and create an audit event.
- Deleted IDs are not reassigned to unrelated resources.
- A task using A/B/C IDs resolves to the exact repository and resource, or explicitly returns UNKNOWN/UNMAPPED.
- CORE and Ali Tree display the same registry state and no conflicting duplicate mappings.

**Status:** the convention is specified here as a mandatory architecture rule. The live registry, ID allocator, and automated route resolver still need implementation and tests; this document alone does not make those functions live.


## 16. Build checkpoint — registry contract created

The first implementation artifact for the central registry now exists at `core/registry.schema.json` on `main`.

- Initial schema contract was created in commit `b3e6aaf6839bd4848538a16ffa8d9aecf6a5a28d`; it was then corrected to keep repository keys (`R-ALI-NEW`) separate from A/B/C hierarchy IDs and to support explicit `UNMAPPED` resources.
- **Implemented:** `core/registry.json` is seeded from the actual GitHub tree and the prior Ali Tree mapping. The current registry contains 13 A phases, 21 B sections, and 34 C resources, with zero unclassified tracked files at the last passing validator run. Repository identity uses a separate `R-...` key so it cannot collide with A/B/C node IDs.
- **Implemented:** `index.html` now loads the Ali Tree from `./core/registry.json`; the embedded hard-coded `aliTree` array was removed. A browser test checks the registry-derived counts and verifies the old embedded array is absent.
- **Implemented:** `scripts/validate-core-inventory.mjs` checks the historical inventory snapshot. `scripts/validate-core-registry.mjs` checks hierarchy parent references, unique full routes, exact GitHub links, local path existence, and complete tracked-file coverage. Both validators run in GitHub Actions.
- **Implemented:** `core/route-resolver.mjs` only routes exact changed paths to a unique approved-repository C node. It returns `UNKNOWN — targeted investigation required` for missing, unapproved, duplicate, or partially unmapped evidence. Unit tests cover exact match, unknown path, unapproved repository, partial match, and refusal to guess from free text.
- **Implemented:** `core/incidents.html` provides a read-only incident console. It can read a numeric GitHub Actions run ID from the public ALI-NEW repository, retrieve the run's commit and changed-file list, inspect job/step metadata for steps reported as failed, combine this with manually supplied exact paths, and display verified A/B/C links. It does not write to GitHub and does not claim changed files prove the root cause; fetching/redacting full log excerpts is still outstanding.
- **Verified evidence:** [Playwright acceptance run `39048064816`](https://github.com/AligasSRM/ALI-NEW/actions/runs/39048064816), [Pages deployment `39048064690`](https://github.com/AligasSRM/ALI-NEW/actions/runs/39048064690), and [deployed smoke tests `39048098809`](https://github.com/AligasSRM/ALI-NEW/actions/runs/39048098809) all passed on commit `fadbbc1e62753eca2fcaab5abbf7ffeb0b38c6c7`. Browser acceptance reported 13 passed; inventory, registry, route-resolver, and incident-console checks passed.
- **Still not implemented:** fetching and redacting full workflow log excerpts, durable incident history, live synchronization across other approved repositories, automated ID allocation, authentication/approval enforcement, and independently enforced security controls. Registry status remains `PARTIALLY_VERIFIED`; this is not a production-ready autonomous repair brain.
- **Next build step:** investigate safe retrieval of failed-step logs without exposing secrets, then add a bounded evidence record that separates run metadata, changed paths, failed step names, log excerpts, and verified route. Do not automatically repair or write to repositories; return `UNKNOWN` whenever evidence cannot uniquely support a route.
