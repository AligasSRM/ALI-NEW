# ALI-NEW

AliNew — Building a secure, scalable, multilingual video platform with verified creators, content moderation, and a free-first development approach.

## Start here — required before every work session

**[Open the canonical Project Build Tree & Work Sequence](PROJECT-BUILD-TREE.md)**

This is the single canonical source for the engineering A0–A12 sequence, one-active-stage rule, acceptance gates, exception handling, and current checkpoint. Read it before every work session. Do not maintain a parallel sequence document. User-facing screen order is tracked separately in the UX screen map.

### Current checkpoint

- **Active stage:** A0 — Project Control Panel & identity
- **Status:** YELLOW — current responsive/browser acceptance passes; standards/security and formal closeout checks are being completed.
- **Latest browser evidence:** [A0 Browser Acceptance Evidence (2026-10-17)](docs/reviews/ALI-NEW-A0-BROWSER-ACCEPTANCE-2026-10-17.md) · [local Playwright run #25](https://github.com/AligasSRM/ALI-NEW/actions/runs/38985108730) · [live Pages smoke run #12](https://github.com/AligasSRM/ALI-NEW/actions/runs/38985140923) · [Pages deployment run #18](https://github.com/AligasSRM/ALI-NEW/actions/runs/38985108729)
- **Next action:** complete the automated Nu HTML validation, redacted history secret scan, deployed response-header review, and A0 closeout evidence before considering GREEN.
- **Rule:** do not start A1 or another stage until the control-panel A0 passes its acceptance gate, unless a documented technical dependency requires a narrowly scoped, recorded exception.

## Project references

- [Approved Design Baseline](docs/design/ALI-NEW-APPROVED-DESIGN-BASELINE-2026-10-16.md)
- [Video Platform Screen Map & UX Specification](docs/design/VIDEO-PLATFORM-SCREEN-MAP.md)
- [Latest A0 Browser Acceptance Evidence (2026-10-17)](docs/reviews/ALI-NEW-A0-BROWSER-ACCEPTANCE-2026-10-17.md)
- [A0 Static Source Validation Record (2026-10-17)](docs/reviews/ALI-NEW-A0-STATIC-SOURCE-VALIDATION-2026-10-17.md)
- [Repository Review & Snapshot Record (2026-10-16; earlier source review)](docs/reviews/ALI-NEW-REPOSITORY-REVIEW-AND-SNAPSHOT-2026-10-16.md)

## Working boundaries

- Scope this sequence to **ALI-NEW only**.
- Preserve approved Figma designs and recoverable backups.
- Do not claim a feature is working without actual test evidence.
- Do not deploy, delete, switch providers, or introduce paid requirements without the required review and Ali's approval.
