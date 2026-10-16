# ALI & ALEX Control Center 2.1 — Visual Design Baseline

- **Record date:** 2026-10-16
- **Recorded/updated:** 2026-10-17
- **Owner and final approval:** Ali
- **Engineering coordination:** Alex
- **Status:** Visual direction accepted as the working baseline; engineering and operational approval are still pending.
- **Scope:** This file records the engineering control-panel UI only. It does not replace the end-user platform Figma baseline.

## Source of truth

- Primary implementation/mockup: [`control-panel/index.html`](../../control-panel/index.html)
- End-user platform design baseline (separate scope): [ALI-NEW approved design baseline](./ALI-NEW-APPROVED-DESIGN-BASELINE-2026-10-16.md)
- Repository review record: [ALI-NEW repository review](../reviews/ALI-NEW-REPOSITORY-REVIEW-AND-SNAPSHOT-2026-10-16.md)

The current `control-panel/index.html` is the single maintained HTML source for this control-panel prototype. Do not create or maintain duplicate HTML snapshots for it. Make approved changes in the primary file and document material decisions here.

## Accepted visual direction — Stage Detail Card 1.8, palette B

The accepted direction is a high-contrast, cinematic engineering workspace with a deep navy base and clear violet, sky-blue, emerald, gold, and coral accents.

| Token | Value | Intended use |
|---|---|---|
| Navy | `#080D19` | Main application background |
| Violet | `#C8BDFF` | Primary highlight / selected state |
| Sky blue | `#8CCBFF` | Informational accents and evidence links |
| Emerald | `#70E2BE` | Verified-success indicators only |
| Gold | `#FFD16F` | Attention, pending gates, and cautions |
| Coral | `#FF8298` | Blockers, failures, and destructive-risk cues |

Use color with text labels and icons; color alone must never communicate status. Maintain readable contrast, visible keyboard focus, and responsive layouts. This palette belongs to the control center and must not silently replace the separate end-user Figma palette.

## Information architecture

The existing prototype presents these areas or concepts. Their presence in a static mockup does not prove a live integration:

1. **Overview / dashboard:** project summary, current status, and next action.
2. **Build tree A0–A12:** 13 planned stages with navigation/selection.
3. **Stage Detail card:** stage purpose, evidence, tests, acceptance gate, revision history, and next step.
4. **Metrics:** summary figures; currently illustrative/static unless independently wired and verified.
5. **Repository map:** suggested project paths and documentation locations.
6. **Status and release gates:** PLANNED, YELLOW, ORANGE, GREEN, LOCKED, and RED.
7. **Tools and provider policy:** tool choices and constraints.
8. **Closeout / handover:** evidence, completion conditions, and next action.
9. **Decision records:** links to technical decisions, which must resolve to real repository files.

The Evidence Center, test/quality view, risk/blocker view, decision/change log, and handover may be refined into dedicated sections during later planning. Do not describe them as fully implemented unless verified in the actual UI.

## Status semantics

- **PLANNED:** not started; no implementation evidence claimed.
- **YELLOW:** incomplete, unverified, or requiring review.
- **ORANGE:** integration or cross-component work in progress.
- **GREEN:** acceptance criteria passed and supported by inspectable test evidence.
- **LOCKED:** accepted and closed; reopen only for a documented technical reason or explicit owner decision.
- **RED:** failed, blocked, or unsafe to proceed.

A visual badge or static metric is not proof of runtime status. Never mark a stage, integration, or release GREEN from mock data, source appearance, or an unexecuted test plan.

## Stage Detail card acceptance criteria

- The selected stage and its status are explicit.
- Purpose/scope, evidence links, tests, acceptance gate, revision history, and next action are visible and scannable.
- Evidence links point to real files, commits, test output, or deployment checks.
- Missing evidence is labeled as missing; sample/demo data is clearly identified.
- Failure and blocked states are distinct from pending and success.
- Layout remains usable on phone and desktop; keyboard focus and text contrast remain visible.
- No secrets, tokens, personal credentials, or sensitive environment values are rendered.
- Destructive actions, provider changes, or production operations require explicit approval and an impact review.

## Implementation and verification boundaries

The repository review found the control panel to be a static prototype, not a verified live integration with GitHub, a database, authentication, or automated project status. Treat all displayed metrics and status values as illustrative until wired to a real source and tested.

The review also identified:
- the literal `\\n` text artifact was corrected in the primary HTML source; source text was re-fetched and checked after the A0 update;
- the former `docs/decisions/` link pointed to a location not present in the inspected tree. It now points to the existing `PROJECT-BUILD-TREE.md` policy file. The URL target was checked in source, but browser navigation has not been exercised.
- the Stage Detail area now lists the A0 acceptance gate, real repository evidence links, source checks, and browser checks still pending.
- the control-panel palette in `control-panel/index.html` now uses the accepted navy/violet/sky-blue/emerald/gold/coral tokens. The separate end-user video-platform file was not changed.

No browser/device, accessibility, security, automated JavaScript, or deployment verification is implied by this visual baseline.

## Change control

1. Inspect the primary file and current repository state before editing.
2. Keep the existing source as the only maintained version; no duplicate backup HTML files.
3. Make the smallest justified change and preserve unrelated behavior.
4. Verify the changed source and links; run browser/device checks where available.
5. Record the change, evidence, unresolved issues, and status honestly.
6. Ali retains final decision authority. This baseline records visual direction, not blanket approval for production deployment.

## Approval history

- **2026-10-16 — Visual direction accepted:** Stage Detail Card 1.8 and palette B accepted as the working visual reference.
- **2026-10-17 — Repository source policy clarified:** maintain the primary file; do not keep duplicate backup HTML snapshots. The older snapshot files are not authoritative.
- **2026-10-17 — A0 source alignment:** primary control-panel palette and evidence links updated; Stage Detail and acceptance/evidence status added. Source-level checks passed after re-fetch; browser/device and automated validation remain pending.
