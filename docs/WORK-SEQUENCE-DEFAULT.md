# ALI-NEW — Default Work Sequence & Stage Gate Policy
**Document ID:** ALI-NEW-WORK-SEQUENCE-001  
**Version:** 1.0  
**Owner / final decision:** Ali  
**Engineering coordination:** Alex  
**Scope:** ALI-NEW repository only  
**Policy status:** APPROVED BY ALI — default working policy  
**Current active stage:** A0 — Project Control Panel & identity  
**Current stage state:** YELLOW — implementation and acceptance evidence not yet complete  
**Last reviewed:** 2026-10-17

## 1. Purpose

This is the first page to open whenever work resumes on ALI-NEW. It records the default stage order, current stopping point, acceptance gates, and the rules for moving between stages. It is intended to prevent parallel, untracked work and accidental scope expansion.

This sequence governs engineering/project stages and follows the existing canonical `PROJECT-BUILD-TREE.md`. It is a project-specific workflow informed by established practices in information architecture, user-centred design, iterative delivery, accessibility, and software quality; it is not a universal industry-mandated numbering system. The user-facing screen journey is tracked separately in `docs/design/VIDEO-PLATFORM-SCREEN-MAP.md` and must not reuse A0–A12 as screen IDs.

## 2. Non-negotiable working rules

1. **Resume the active stage first.** At the start of every work session, read this page, inspect the current repository state, and continue from the recorded active stage.
2. **One active stage at a time.** Do not start a later stage just because it is easier or more interesting.
3. **A stage is not complete because code was written.** It is complete only when its acceptance criteria have been checked and evidence is recorded.
4. **No silent stage skipping.** If a technical dependency requires work from a later stage early, record the reason, exact scope, affected files, risk, test plan, and return point. This is a controlled dependency task, not a declaration that the later stage is complete.
5. **No fake GREEN.** GREEN applies only to the specific scope tested with evidence. Unknown or untested behaviour remains YELLOW; a blocker or failed safety gate is RED; verified integration work that is not fully accepted remains ORANGE.
6. **Inspect before changing.** Re-read the relevant files, Git status/history, dependencies, design references, and existing tests before each change.
7. **Preserve working material.** Make or verify a recoverable snapshot before risky edits. Do not delete, replace, redesign, deploy, or switch providers without a documented reason and the required approval.
8. **Design source of truth.** The approved Figma baseline remains authoritative for visual design. Change it only for a clear technical/usability reason and with Ali's approval.
9. **Free-first constraint.** Do not require a paid plan, payment card, or paid activation without Ali's explicit approval. Prefer exportable, replaceable tools and document provider lock-in.
10. **Evidence and handover.** Every session records what was inspected, what changed, what was tested, results, open issues, commit SHA, and the exact next action.

## 3. Default engineering stage order A0–A12

The canonical engineering sequence is the one already recorded in [PROJECT-BUILD-TREE.md](../PROJECT-BUILD-TREE.md). Preserve its meaning and order unless a documented change is reviewed and explicitly approved by Ali.

| Stage | Default scope | Minimum exit gate |
|---|---|---|
| **A0** | Project Control Panel & identity — first milestone | Project identity, visual system, navigation, progress/status, build tree, evidence links, responsive layout and accessibility basics reviewed; links/tree interactions tested on desktop/mobile; known limitations recorded. |
| **A1** | Product definition | Problem, audiences, value, scope/exclusions, terminology, acceptance criteria and unresolved questions documented and approved. |
| **A2** | Product UX/UI | User journeys, page inventory, wireframes/design baseline, design tokens, Arabic RTL/English LTR, responsive behaviour and accessibility requirements reviewed. |
| **A3** | Architecture & boundaries | Domain model, trust boundaries, data flows, API contracts, threat model, provider-neutral interfaces and exit/migration plans reviewed. |
| **A4** | Repository & developer workflow | Source layout, naming, contribution rules, formatting/linting, tests, branch/PR strategy and CI baseline documented and checked. |
| **A5** | Identity & creator verification | Account lifecycle, authentication, sessions, recovery, creator verification and abuse controls designed and tested within scope; no real credentials committed. |
| **A6** | Core video product | Upload pipeline, media metadata, playback, captions/language metadata, processing states and failure/retry behaviour implemented and tested as scoped. |
| **A7** | Moderation & safety | Pre-publication review, reporting, appeals, policy decisions, audit trail and age/privacy safeguards reviewed; unapproved content is not public. |
| **A8** | Discovery & community | Search, categories, creator pages, follows/saves and any recommendations pass usability, safety and privacy review. |
| **A9** | Admin & operations | Least-privilege roles, approvals, incident handling, audit logs, support tools and operational runbooks verified. |
| **A10** | Data & integrations | Schema/migrations, retention/export/deletion, backup/restore, provider-neutral adapters and integration contract tests checked. |
| **A11** | Security, privacy & quality | Threat-model review, dependency/secrets checks where feasible, authorization tests, accessibility, performance, regression and recovery tests recorded. |
| **A12** | Release & maintenance | Staging/live gates, deployment rollback, monitoring, documentation, ownership, release checklist and post-release review completed; release remains blocked until required gates pass. |

### Important distinction: project stages vs. user-facing screens

Do **not** label the homepage, age gate, video menu, watch page, sign-in, or registration as A0–A12. Those are screens and user journeys, documented in the [Video Platform Screen Map](https://github.com/AligasSRM/ALI-NEW/blob/main/docs/design/VIDEO-PLATFORM-SCREEN-MAP.md) and approved Figma frames. They are designed and implemented under the relevant project stages (especially A2 for UX/UI and later implementation stages).

The user-facing journey may be reviewed in this order:
1. Age gate / access notice.
2. Homepage / discovery.
3. Navigation, categories and video menu.
4. Video watch page.
5. Sign-in and registration.
6. Account recovery.
7. User account/profile and settings.
8. Creator profile.
9. Upload and moderation workflow.

This is a screen-flow checklist, not a competing A0–A12 stage numbering system.

### Current stage clarification

A0 is the active stage because the existing canonical project build tree explicitly defines **Project Control Panel & identity** as the first milestone. The control panel is a standalone prototype and has not yet passed its full interaction, accessibility, and desktop/mobile acceptance checks. Therefore, A0 is **YELLOW, not GREEN**.

Do not begin A1 as a full stage until A0 passes its exit gate. If a genuine technical dependency requires a limited piece of A1 or another stage, use the dependency exception protocol below, document the reason and return point, and do not mark that later stage complete.

## 4. Stage gate checklist

Before marking any stage GREEN, confirm all applicable items:

- [ ] Baseline: relevant source files, current commit, dependencies, design references and existing behaviour inspected.
- [ ] Scope: intended behaviour, exclusions, impacted files and acceptance criteria written down.
- [ ] Preservation: a recoverable backup/snapshot exists where the change could damage existing work.
- [ ] Implementation: only approved, stage-relevant changes were made.
- [ ] Functionality: each in-scope interaction was actually tested; no mock is described as a live service.
- [ ] Visual: compared against the approved Figma frame at relevant desktop and mobile sizes.
- [ ] Accessibility: semantic labels, keyboard use, visible focus, contrast and errors checked as applicable.
- [ ] Localization: Arabic RTL and English LTR checked when language support is in scope.
- [ ] Quality: relevant HTML/CSS/JS validation, automated tests, console/network checks, and regression tests run where available.
- [ ] Security/privacy: relevant permissions, data handling, secrets, input validation and provider constraints reviewed.
- [ ] Evidence: test cases, actual results, screenshots/logs where useful, remaining defects and commit SHA recorded.
- [ ] Handover: status, next action, blocker/exception and owner recorded.

A checklist item that is not applicable must be marked N/A with a short reason. An item that cannot be tested is not silently passed; record it as a blocker or limitation and keep the stage YELLOW/ORANGE as appropriate.

## 5. Allowed stage states

- **PLANNED:** not started.
- **YELLOW:** being inspected, designed, implemented, or awaiting acceptance evidence.
- **ORANGE:** integration is in progress or not yet verified.
- **GREEN:** this stage's agreed acceptance gate passed with evidence.
- **RED:** blocking failure, unsafe condition, or failed required gate.
- **LOCKED:** accepted and closed; reopen only for a documented technical, security, legal, or approved scope reason.

A stage may be GREEN while the overall product is not production-ready. Stage status must never be used to imply that unrelated or future features are complete.

## 6. Dependency exception protocol

When the active stage genuinely depends on work associated with another stage:

1. Explain the dependency and why waiting would prevent safe progress.
2. Identify the smallest required scope and exact files/systems affected.
3. Record risk, rollback/snapshot plan, test plan, and approval needed.
4. Perform only the dependency work; do not expand into the full later stage.
5. Test and document the dependency result.
6. Return to the previously active stage and keep its gate open until its own criteria pass.

No exception silently changes the default order.

## 7. Session start and stop protocol

### At session start
1. Open this policy first.
2. Confirm the active stage and last known commit against GitHub.
3. Read the latest handover/review and relevant files.
4. Confirm no newer commit or changed baseline invalidates the previous plan.
5. State the exact task and acceptance test before editing.

### At session stop
1. Record changes and files affected.
2. Record tests actually run and results; distinguish not-run from failed.
3. Update stage status only when evidence supports it.
4. Record blockers, decisions, dependencies, commit URL/SHA, and the single next action.
5. Leave the repository in a recoverable state.

## 8. Current project checkpoint

- **Repository:** https://github.com/AligasSRM/ALI-NEW
- **Approved design baseline:** [Figma baseline record](https://github.com/AligasSRM/ALI-NEW/blob/main/docs/design/ALI-NEW-APPROVED-DESIGN-BASELINE-2026-10-16.md)
- **Screen map:** [Video Platform Screen Map & UX Specification](https://github.com/AligasSRM/ALI-NEW/blob/main/docs/design/VIDEO-PLATFORM-SCREEN-MAP.md)
- **Latest verified baseline commit before this policy update:** [a9f8ae1](https://github.com/AligasSRM/ALI-NEW/commit/a9f8ae135b0ac1c2acb78f29b83bb9c56c50d5ac)
- **Active stage:** A0 — Project Control Panel & identity.
- **A0 status:** YELLOW — control-panel interaction/browser acceptance tests remain incomplete.
- **Next action:** inspect the current control-panel prototype against the A0 scope in `PROJECT-BUILD-TREE.md`; write an A0 gap list and test plan before changing it.
- **Scope boundary:** ALI-NEW only. Do not modify X4Kiss or any other repository under this policy task.

## 9. Change control for this policy

This document is the default operating policy. Do not renumber stages or change the active stage merely for convenience. A change requires a short decision record stating the reason, impact on completed/in-progress work, revised sequence if any, and Ali's approval. Preserve the prior policy version in Git history; do not rewrite history.

## 10. Reference principles

This project-specific engineering sequence is informed by established, complementary practices rather than a single universal stage-numbering standard:

- [Figma Resource Library — Information Architecture](https://www.figma.com/resource-library/what-is-information-architecture/)
- [Figma Resource Library — Website Redesign](https://www.figma.com/resource-library/website-redesign/)
- [Nielsen Norman Group — Discovery Phase](https://www.nngroup.com/articles/discovery-phase/)
- [web.dev — Learn Responsive Design](https://web.dev/learn/design/)
- [W3C Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)

These references inform planning and quality gates; they do not certify ALI-NEW or replace project-specific validation.
