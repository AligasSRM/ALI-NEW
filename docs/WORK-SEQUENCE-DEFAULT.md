# ALI-NEW — Default Work Sequence & Stage Gate Policy
**Document ID:** ALI-NEW-WORK-SEQUENCE-001  
**Version:** 1.0  
**Owner / final decision:** Ali  
**Engineering coordination:** Alex  
**Scope:** ALI-NEW repository only  
**Policy status:** APPROVED BY ALI — default working policy  
**Current active stage:** A0 — Homepage  
**Current stage state:** YELLOW — implementation and acceptance evidence not yet complete  
**Last reviewed:** 2026-10-17

## 1. Purpose

This is the first page to open whenever work resumes on ALI-NEW. It records the default stage order, current stopping point, acceptance gates, and the rules for moving between stages. It is intended to prevent parallel, untracked work and accidental scope expansion.

This sequence is a project-specific workflow based on established practices in information architecture, user-centred design, iterative delivery, accessibility, and software quality. It is not claimed to be a single universal industry-mandated numbering system.

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

## 3. Default stage order A0–A12

The order below is the default project sequence. The stage names describe the agreed plan; they do not assert that the functionality already exists. Detailed acceptance criteria must be refined against the current implementation and approved Figma frames before each stage is executed.

| Stage | Default scope | Minimum exit gate |
|---|---|---|
| **A0** | Homepage and baseline shell | Compare with approved desktop/mobile Figma; verify navigation/search/category/card behaviour that is in scope; check responsive layout, keyboard/focus, visible states, and console/errors; record gaps. |
| **A1** | Age gate / access notice | Confirm continue and exit are distinct, clear, and correctly routed; test desktop/mobile and accessible interaction; state plainly that self-declaration is not identity verification. Any real age-assurance mechanism is a separate legal, privacy, and technical decision. |
| **A2** | Primary navigation, video menu, categories and discovery paths | Every visible navigation path has a defined destination; menu open/close and mobile behaviour work; active/focus states are usable; no dead or misleading links. |
| **A3** | Video detail / watch page | Layout matches approved design; player state is honest (demo vs real playback); metadata, creator, related content and report actions have defined behaviour; error/loading/empty states are covered. |
| **A4** | Sign-in interface and flow | Field labels, validation, password visibility, error states and return navigation work; no credentials are logged or falsely claimed to be stored; real authentication remains unclaimed until integrated and tested. |
| **A5** | Registration interface and flow | Required fields and privacy/terms explanations are justified; validation and cross-links work; account creation is not confused with creator identity verification. |
| **A6** | Account recovery | Recovery entry and states are clear; responses do not unnecessarily disclose whether an account exists; real recovery is not claimed until a secure identity provider/backend flow is implemented and tested. |
| **A7** | User account/profile | Profile and account actions respect role and privacy boundaries; save/sign-out states are accurate; persistence is verified if claimed. |
| **A8** | Settings, language and privacy preferences | Settings have defined behaviour; Arabic RTL and English LTR are checked for the implemented scope; preference persistence and privacy effects are tested if claimed. |
| **A9** | Creator profile | Public profile and published/approved content states are clear; creator status is evidence-backed; reporting and empty/error states are usable. |
| **A10** | Upload and media processing flow | File/type/size rules are defined; progress, failure, retry and processing states are tested; upload security and storage limits are documented; content is not public prematurely. |
| **A11** | Moderation, reporting and appeals | Review outcomes and appeal/report paths are defined; unapproved content remains non-public; permissions and audit trail are tested before production claims. |
| **A12** | End-to-end acceptance, regression, accessibility, security and release readiness | All in-scope journeys pass on desktop/mobile; RTL/LTR and keyboard/accessibility checks are recorded; regression/security/privacy checks and known limitations are documented; no release claim without evidence and explicit approval. |

### Stage-order clarification

A0 is the current active stage because work has begun on the homepage prototype and the approved design baseline is recorded. The prior review established that implementation testing is still incomplete. Therefore, A0 is **not yet certified GREEN**.

The default next stage is A1 only after A0's exit gate passes. A2 must not be started simply because it is listed next; it starts after A1 is accepted, unless a documented dependency exception is approved.

Some technical foundations may be required earlier than their apparent stage—for example, defining an identity contract before a sign-in UI can be accurately wired. Such work must be limited to the dependency, documented, tested, and then returned to the recorded active stage.

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
- **Active stage:** A0 — Homepage.
- **A0 status:** YELLOW — implementation/browser acceptance tests remain incomplete.
- **Next action:** inspect current homepage code against the approved desktop/mobile Figma frames; write an A0 gap list and test plan before changing the homepage.
- **Scope boundary:** ALI-NEW only. Do not modify X4Kiss or any other repository under this policy task.

## 9. Change control for this policy

This document is the default operating policy. Do not renumber stages or change the active stage merely for convenience. A change requires a short decision record stating the reason, impact on completed/in-progress work, revised sequence if any, and Ali's approval. Preserve the prior policy version in Git history; do not rewrite history.

## 10. Reference principles

This project-specific sequence is informed by established, complementary practices rather than a single universal stage-numbering standard:

- [Figma Resource Library — Information Architecture](https://www.figma.com/resource-library/what-is-information-architecture/)
- [Figma Resource Library — Website Redesign](https://www.figma.com/resource-library/website-redesign/)
- [Nielsen Norman Group — Discovery Phase](https://www.nngroup.com/articles/discovery-phase/)
- [web.dev — Learn Responsive Design](https://web.dev/learn/design/)
- [W3C Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)

These references inform planning and quality gates; they do not certify ALI-NEW or replace project-specific validation.
