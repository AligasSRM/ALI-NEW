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
- **A0 — Project Control Panel & identity (FIRST):** project title, browser tab title, visual system, navigation, progress/status, section tree, evidence links, responsive layout, accessibility basics. Deliverable: root `index.html` prototype (current source; the former `control-panel/index.html` path is historical). Gate: visual review on desktop/mobile and interaction checks.
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
├── index.html             # Current Ali Tree engineering control-panel prototype
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

## 15. Default work sequence, stage gates, and session checkpoint

**Policy ID:** ALI-NEW-WORK-SEQUENCE-001  
**Policy version:** 1.0  
**Owner / final decision:** Ali  
**Engineering coordination:** Alex  
**Scope:** ALI-NEW repository only  
**Policy status:** Approved default working policy  
**Last reviewed:** 2026-10-17

### 15.1 One canonical source

This file, `PROJECT-BUILD-TREE.md`, is the single canonical source for the engineering stage order and the default work sequence. Read it first whenever work resumes. Do not create a second parallel sequence document. Keep the README linked to this file. Git history records prior revisions; do not preserve confusing duplicate “current” documents in the working tree.

The A0–A12 identifiers refer only to engineering/project stages. User-facing screens have a separate UX journey and must not reuse A0–A12 as screen IDs. The separate screen map remains `docs/design/VIDEO-PLATFORM-SCREEN-MAP.md`.

### 15.2 Non-negotiable sequence rules

1. **Resume the recorded stage first.** At the start of every session, read this file, inspect current repository state and recent history, then continue from the checkpoint below.
2. **One active stage at a time.** Do not begin the next stage just because it is easier or more interesting.
3. **Code is not completion.** A stage passes only when its acceptance criteria are checked and evidence is recorded.
4. **No silent stage skipping.** If a technical dependency requires narrowly scoped work from a later stage, document the reason, exact scope/files, risks, test plan, and return point. This does not mark that later stage complete.
5. **No fake GREEN.** GREEN applies only to the scope actually tested with evidence. Untested behaviour stays YELLOW; a blocker or failed safety gate is RED; integration work not fully accepted remains ORANGE.
6. **Inspect before editing.** Review relevant files, history, dependencies, approved designs, tests, and impact before every change.
7. **Preserve recoverability.** Verify a recoverable snapshot before risky changes. Do not delete, replace, redesign, deploy, or switch providers without a documented reason and the required approval.
8. **Free-first.** Do not require paid plans, payment cards, or paid activation without Ali's explicit approval.
9. **Evidence and handover.** Record inspected scope, changes, tests/results, open issues, commit SHA, and the exact next action.

### 15.3 Stage status definitions

- **PLANNED:** not started.
- **YELLOW:** in progress, or evidence/acceptance is incomplete.
- **ORANGE:** integration work is underway but not fully accepted.
- **GREEN:** acceptance criteria passed with reproducible evidence for the stated scope.
- **RED:** blocked or a critical acceptance/safety gate failed.
- **LOCKED:** accepted and closed; reopen only for a documented technical reason or approved change.

### 15.4 Stage transition gate

Before moving to the next stage, confirm and record:
- [ ] The current stage's scope and exclusions are clear.
- [ ] Acceptance criteria are checked against the actual implementation.
- [ ] Relevant desktop/mobile and interaction tests were run where applicable.
- [ ] Accessibility, security, privacy, regression, and integration checks were addressed as relevant to the stage.
- [ ] Evidence links, known limitations, unresolved blockers, and commit SHA are recorded.
- [ ] The closeout note states what passed, what did not, and the next exact action.

If a criterion fails or evidence is missing, keep the stage open and solve the gap. Do not label it GREEN to move forward.

### 15.5 Separate user-facing screen journey

Track user-facing screens in the UX screen map, not as engineering-stage IDs. Current journey checklist:
1. Age gate.
2. Homepage and discovery.
3. Navigation, categories, and video menu.
4. Video watch/detail page.
5. Sign-in and registration.
6. Account recovery.
7. User profile and settings.
8. Creator profile.
9. Upload and moderation.

This list is a UX journey checklist, not a claim that those screens are implemented or accepted.

### 15.6 Current checkpoint — resume here

- **Active stage:** A0 — Project Control Panel & identity.
- **Status:** YELLOW — browser acceptance now passes after responsive defects were found and corrected; remaining standards/security/closeout gates are being verified.
- **Source work completed 2026-10-17:** aligned `control-panel/index.html` to the accepted design baseline; corrected stale acceptance copy; set explicit `type="button"` on all 22 control-panel buttons; constrained mobile navigation overflow; and stacked narrow detail grids to eliminate real horizontal overflow at 360px and 768px. No duplicate HTML backups were created.
- **Verified current code baseline:** commit `7d97fae46ffe988fdfd6ca937e4498c64dff9e37`; local Playwright **18/18 passed** (run [#25](https://github.com/AligasSRM/ALI-NEW/actions/runs/38985108730)); deployed Pages smoke **11/11 passed** (run [#12](https://github.com/AligasSRM/ALI-NEW/actions/runs/38985140923)); Pages deployment verification succeeded (run [#18](https://github.com/AligasSRM/ALI-NEW/actions/runs/38985108729)); Pages build/deployment succeeded (run [#36](https://github.com/AligasSRM/ALI-NEW/actions/runs/38985108135)).
- **Root-cause note:** earlier automated runs exposed real horizontal overflow at 360px (mobile navigation contributed to document width) and at 768px (the two-column detail grid's intrinsic minimum width). Responsive rules now constrain the mobile app/nav and stack the bottom detail grid below 900px; subsequent local acceptance passed at 360, 390, 768, and 1280px.
- **Next action:** run the new Nu HTML Checker + inline JavaScript/static invariants, redacted full-history secret scan, and deployed response-header capture; review their results and then finish the A0 closeout note and GREEN certificate only if all required gates pass.
- **Hold point:** do not start A1 or another stage until A0 passes its acceptance gate, unless a narrowly scoped technical dependency is documented under §15.2.
- **After each session:** update this checkpoint in this same file, record evidence and commit SHA, and state the exact next action. Do not create another competing checkpoint page.

## 16. Permanent A/B/C engineering index policy — approved by Ali (2026-10-17)

**Policy ID:** ALI-NEW-ABC-INDEX-001  
**Status:** APPROVED — mandatory working convention  
**Scope:** ALI-NEW repository only  
**Owner / final decision:** Ali  
**Engineering coordination:** Alex

This section is the authoritative rule for locating implementation files, defects, tests, and evidence. It supplements the A0–A12 build sequence and does not replace it.

### 16.1 Stable stage IDs

1. Keep the existing stage identifiers **A0 through A12** and their meanings as the fixed working baseline.
2. Do not casually rename, renumber, reorder, or replace these identifiers. Any exceptional change requires Ali's explicit decision and a documented impact review; no change is implied by this policy.
3. The A0–A12 identifiers represent engineering stages, not physical repository folders and not user-facing screen IDs.

### 16.2 Required nested identifiers

- **A** = an existing engineering stage, e.g. `A0`, `A1`, … `A12`.
- **B** = a numbered section within that stage, assigned sequentially from `B0` for the first section, then `B1`, `B2`, and so on as needed.
- **C** = a numbered file entry within a B section, assigned sequentially from `C0`, then `C1`, `C2`, and so on as needed.
- Full locator format: `A0 / B3 / C1`.
- Every physical repository file in the scope of the current inventory must have one canonical C identifier in the index. A file used by other stages may be linked as a cross-reference; do not create duplicate identities for the same file.
- The index maps identifiers to the **real repository path**, branch/commit context where relevant, purpose, status, and evidence. IDs are organizational labels only.

### 16.3 Preserve repository structure

Do not rename, move, duplicate, or create files/directories merely to fit the A/B/C index. Keep the actual source tree intact unless a separate, reviewed implementation task explicitly requires a change. Do not invent paths for files that do not exist. Record missing required artifacts as missing/planned, not as existing files.

### 16.4 Defect and evidence tracking

Every defect or test finding must record, where applicable:
1. Full A/B/C locator and exact repository path.
2. Short description and expected versus actual behavior.
3. Evidence: test output, report, commit, deployment URL, or reproducible steps.
4. Status: PLANNED, YELLOW, ORANGE, GREEN, LOCKED, or RED, using the definitions in this document.
5. Root cause only after it is evidenced; otherwise label it “under investigation”.
6. Fix commit/change reference and the exact retest result before closure.
7. Related defects, dependencies, limitations, and reopen conditions.

A defect is not GREEN merely because a code change was made. GREEN requires a passing relevant retest and inspectable evidence. If evidence is incomplete, keep the item open.

### 16.5 Mandatory working sequence

For every stage, work through: **inventory → assign B sections → map existing files to C IDs → identify missing items and defects → define acceptance criteria → implement only after review → test → record evidence → close out**.

Work on one active stage at a time. Inventory or cross-reference preparation for later stages does not authorize implementation of those stages before the current stage gate passes. The A/B/C index is the single agreed locating convention for this project; do not revert to ad-hoc naming schemes or start a competing index.

### 16.6 Session checkpoint — 2026-10-17

- **Session action:** paused at Ali's request; resume next work session from this checkpoint.
- **Active stage:** A0 — Project Control Panel & identity.
- **Status:** YELLOW — A0 inventory/index draft prepared in the conversation; the formal stage closeout and GREEN certificate have **not** been issued.
- **A0 inventory:** initial proposed B sections cover the control-panel source, design baseline, build-tree/status rules, interaction tests/configuration, static validation, CI/live workflows, browser acceptance evidence, repository review, closeout templates, and project metadata/docs.
- **A1 and A2:** preliminary file references identified only. No implementation work started and no stage was marked complete.
- **Repository changes in this session:** this policy/checkpoint addition only. No application source, file names, directory structure, or other repositories are to be changed as part of the indexing policy.
- **Next exact action:** resume with A0; verify the current main-branch commit and pending acceptance gates, refine the A0 B/C index against the actual file tree, resolve or explicitly carry forward outstanding findings, then prepare the closeout record. Do not mark A0 GREEN until its gates pass. Proceed to A1 only after A0 is formally accepted and closed.


## 17. شجرة علي — فهرس A/B/C الفعلي (2026-10-17)

**الاسم المعروض:** شجرة علي · Ali Tree  
**المستودع الأساسي:** [AligasSRM/ALI-NEW](https://github.com/AligasSRM/ALI-NEW)  
**واجهة الفهرس:** [index.html](https://github.com/AligasSRM/ALI-NEW/blob/main/index.html)  
**حالة التغيير:** مقترح على فرع مراجعة؛ لا يُعد معتمداً على main قبل المراجعة والدمج.  
**قاعدة أساسية:** A/B/C معرّفات تنظيمية فقط. لا تُنشأ مجلدات بهذه الأسماء، ولا تُنقل أو تُعاد تسمية الملفات، ولا يُختلق مسار لملف غير موجود.

### 17.1 ما أثبته جرد المستودع

جرد شجرة GitHub الفعلية على `main` أظهر **25 ملفاً** في 2026-10-17. الفهرس الحالي يعطي كل ملف هوية C واحدة فقط، ويشير إلى مساره الحقيقي. الرقم ليس تقديراً ولا عدد ملفات مستقبلية. الأقسام التي لم تُبنَ بعد تظهر كمخططة دون ادعاء وجود ملفات لها.

### 17.2 A0 — الجرد والتحكم بالمشروع

#### A0 / B0 — واجهة شجرة علي
| C ID | المسار الحقيقي | الغرض |
|---|---|---|
| C0 | `index.html` | واجهة الفهرس التفاعلي |

#### A0 / B1 — الحوكمة ووثائق المشروع
| C ID | المسار الحقيقي | الغرض |
|---|---|---|
| C0 | `PROJECT-BUILD-TREE.md` | المرجع الهندسي الرئيسي |
| C1 | `README.md` | مدخل المستودع ونقطة الاستئناف |
| C2 | `ALI-ALEX-MASTER-PROJECT-PROMPT.md` | تعليمات الهندسة الرئيسية |
| C3 | `IDEAS-ALI-ALEX.md` | سجل الأفكار |
| C4 | `docs/decisions/README.md` | فهرس قرارات المشروع |

#### A0 / B2 — اختبارات A0 والتحقق والأدلة
| C ID | المسار الحقيقي | الغرض |
|---|---|---|
| C0 | `tests/ali-new-a0.spec.ts` | اختبارات قبول لوحة التحكم |
| C1 | `tests/live-pages.spec.ts` | اختبارات صفحات النشر الحية |
| C2 | `scripts/validate-a0.mjs` | التحقق الثابت من المصدر |
| C3 | `package.json` | أوامر المشروع والاعتماديات |
| C4 | `playwright.config.ts` | إعدادات Playwright |
| C5 | `docs/reviews/ALI-NEW-A0-BROWSER-ACCEPTANCE-2026-10-17.md` | أدلة قبول المتصفح |
| C6 | `docs/reviews/ALI-NEW-A0-STATIC-SOURCE-VALIDATION-2026-10-17.md` | أدلة التحقق الثابت |
| C7 | `docs/reviews/ALI-NEW-REPOSITORY-REVIEW-AND-SNAPSHOT-2026-10-16.md` | مراجعة المستودع ولقطة الأساس |

#### A0 / B3 — سير العمل الآلي
| C ID | المسار الحقيقي | الغرض |
|---|---|---|
| C0 | `.github/workflows/pages-deploy.yml` | بناء ونشر GitHub Pages |
| C1 | `.github/workflows/pages-live-smoke.yml` | اختبار صفحات النشر الحية |
| C2 | `.github/workflows/playwright.yml` | تشغيل اختبارات Playwright |

#### A0 / B4 — قوالب الإغلاق والتوثيق
| C ID | المسار الحقيقي | الغرض |
|---|---|---|
| C0 | `docs/templates/GREEN-CERTIFICATE-TEMPLATE.md` | قالب شهادة GREEN |
| C1 | `docs/templates/SECTION-CLOSEOUT-NOTE-TEMPLATE.md` | قالب إغلاق القسم |
| C2 | `docs/templates/TECHNICAL-DECISION-RECORD-TEMPLATE.md` | قالب القرار التقني |

#### A0 / B5 — مرجع تصميم لوحة التحكم
| C ID | المسار الحقيقي | الغرض |
|---|---|---|
| C0 | `docs/design/CONTROL-PANEL-DESIGN-BASELINE.md` | خط أساس تصميم لوحة التحكم |

### 17.3 A1 — تعريف المنتج
- **A1 / B0 — متطلبات المنتج:** قسم تنظيمي مخطط؛ لا يوجد ملف مخصص لهذا القسم في شجرة المستودع الحالية.

### 17.4 A2 — تجربة المستخدم والتصميم

#### A2 / B0 — خط أساس التصميم
| C ID | المسار الحقيقي | الغرض |
|---|---|---|
| C0 | `docs/design/ALI-NEW-APPROVED-DESIGN-BASELINE-2026-10-16.md` | خط أساس التصميم المعتمد |

#### A2 / B1 — خرائط وتجارب الواجهة
| C ID | المسار الحقيقي | الغرض |
|---|---|---|
| C0 | `docs/design/VIDEO-PLATFORM-SCREEN-MAP.md` | خريطة الشاشات ورحلة المستخدم |
| C1 | `docs/design/DESIGN-OPTIONS-ALI-ALEX.md` | خيارات التصميم المسجلة |
| C2 | `design-preview/index.html` | معاينة تصميم الواجهة |

### 17.5 A3–A12 — أقسام مخططة
لكل مرحلة من A3 إلى A12 يوجد حالياً قسم B0 تنظيمي واحد في واجهة الفهرس لتسهيل التوسعة. هذه الأقسام **ليست دليلاً على وجود تنفيذ أو ملفات**؛ وتظهر رسالة «لا توجد ملفات مخصصة بعد» إلى أن يُجرى جرد فعلي وتُسجّل المسارات الحقيقية. لا نُنشئ ملفات لمجرد ملء أرقام C.

### 17.6 قواعد الصيانة
1. قبل أي تعديل، أعد جرد شجرة GitHub من الفرع والـcommit المستهدفين.
2. لا تعِد استخدام C ID نفسه لملفين، ولا تمنح الملف نفسه أكثر من هوية C أساسية.
3. عند إضافة ملف جديد مستقبلاً، حدّث هذا السجل وواجهة شجرة علي معاً، ثم اختبر تطابق عدد الملفات والمسارات.
4. الروابط من الواجهة يجب أن تفتح المسار الحقيقي للملف على GitHub، لا صفحة وهمية ولا ملفاً غير موجود.
5. حالة القسم مستقلة عن وجود الملف: وجود الملف لا يعني GREEN، ووجود قسم مخطط لا يعني أنه نُفّذ.
6. لا تُدمج التغييرات إلى `main` ولا تعتمد نشرها إلا بعد مراجعة التغييرات وتشغيل اختبارات A0 المطلوبة.


## 18. Mandatory session-resume contract — Ali's standing instruction (2026-10-19)

At every resumed work session:
1. Start at [Ali-Control](https://github.com/AligasSRM/Ali-Control) and read its control index and work/scope rules.
2. For ALI-NEW, read the latest checkpoint/review notes first: [Repository Review & Snapshot](docs/reviews/ALI-NEW-REPOSITORY-REVIEW-AND-SNAPSHOT-2026-10-16.md), then the latest applicable stage evidence such as [A0 Browser Acceptance Evidence](docs/reviews/ALI-NEW-A0-BROWSER-ACCEPTANCE-2026-10-17.md).
3. State the exact last stopping point, what was completed, open blockers/decisions, current evidence, and the next safe action.
4. Read this Project Build Tree and the relevant stage roadmap after the checkpoint notes; inspect source files only after those steps.
5. Keep ALI-NEW notes and evidence in ALI-NEW. Do not copy CORE notes into this repository or infer that another project's status applies here.
6. After meaningful work and before pausing, update the relevant checkpoint with date, result, branch/commit, tests/evidence, unresolved items, and one exact next action. Read the saved file back to verify it. If not verified, say so.
7. No GREEN without evidence. Do not merge, deploy, delete, change providers/permissions, spend money/credits, or broaden scope without the required approval.

This is a session-driven procedure; it does not claim background work happens while no session is active.

## 19. Current checkpoint — 2026-10-22

- **Active stage:** A0 — Ali Tree control panel and canonical inventory.
- **Status:** YELLOW — implementation fixes are staged for review; this is not a GREEN certificate or a production-readiness claim.
- **Working branch:** `fix/a0-inventory-and-docs`.
- **Implementation baseline before this checkpoint note:** `48256490e6ad188c8938c810bb42c8a4461be13c`.
- **Changes prepared on the branch:** dashboard phase/file counts derive from `core/registry.json`; summary containers use labeled groups; the B2 browser assertion derives its expected count from the registry; current design/build references point to root `index.html`; the session-resume contract points to `Ali-Control`; inventory validation cross-checks the snapshot, canonical registry, and tracked Git paths; the snapshot records 37 tracked files with 37 canonical mappings; and registry-derived labels are rendered through DOM `textContent` rather than HTML parsing, with a regression test for injected markup.
- **Verification state:** PR #11 head `8584ec55ec852ff8cb057a087ac22a1bde98481a` passed [Playwright acceptance run #39694835149](https://github.com/AligasSRM/ALI-NEW/actions/runs/39694835149) and [CORE diagnostic run #39694835183](https://github.com/AligasSRM/ALI-NEW/actions/runs/39694835183): 13/13 browser tests, source invariants, 0 HTML errors/warnings on both pages, secret-history scan, 37/37 inventory mappings, registry coverage, and 11/11 route-resolver tests. Subsequent commits add DOM-safe registry rendering and a regression test for injected markup; those changes require a fresh CI result on the current head before being accepted. No merge or deployment has been performed.
- **Open gates:** run the branch CI; review HTML/accessibility/security results; reconcile overlapping open PRs #7 (registry-derived B2 test count) and #10 (session-resume control reference) before merging; review PR #8 separately because it proposes a broader registry schema migration; complete A0 closeout only when all required evidence is available.
- **Next exact action:** inspect the fresh CI result for the DOM-injection regression test and confirm the HTML checker remains warning-free; then review the rendered UI on desktop/mobile, reconcile overlapping draft PRs #7 and #10, and review PR #8 separately. Keep A0 YELLOW until owner visual acceptance, broader security/accessibility review, and formal closeout are complete; do not merge without Ali's explicit approval.

