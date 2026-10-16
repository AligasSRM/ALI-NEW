# ALI & ALEX — Approved Visual Options Register

**Project:** ALI-NEW  
**Status:** APPROVED AS DESIGN DIRECTIONS · NOT YET IMPLEMENTED / NOT LOCKED  
**Owner and final decision:** Ali  
**Engineering coordination:** Alex  
**Recorded:** 2026-10-16

## Purpose

Preserve the two visual directions Ali explicitly liked so they can be revisited and built later without treating preview images as completed product UI. These are approved reference options, not a claim that either design is fully implemented, tested, or production-ready.

## Option 1 — ALI-NEW Engineering Control Panel

**Decision:** Keep the current control-panel concept as the preferred starting point for the project workspace.

- Existing source: [control-panel/index.html](../../control-panel/index.html)
- GitHub file: https://github.com/AligasSRM/ALI-NEW/blob/main/control-panel/index.html
- Visual direction: deep navy background (`#080D19`) with violet (`#C8BDFF`), sky-blue (`#8CCBFF`), emerald (`#70E2BE`), gold (`#FFD16F`), and coral (`#FF8298`) accents; clear cards, status indicators, expandable build tree, repository map, tool policy, and responsive navigation.
- Intended use: track project phases, file/repository map, decisions, evidence, risks, acceptance gates, and handover notes.
- Current reality: standalone HTML/CSS/JavaScript prototype. It is not yet connected to live GitHub data, a database, authentication, or automated project status.
- Source-level follow-up: the previously observed literal `\\n` text artifact was corrected on 2026-10-17. A dedicated A0 Stage Detail area now records scope, evidence links, acceptance checks, and unverified browser checks. Before GREEN, run HTML/JavaScript validation and test navigation, buttons, filtering, expandable sections, keyboard focus, accessibility, and desktop/mobile behavior; document actual results and remaining limitations.

## Option 2 — ALI-NEW Video Platform UI

**Decision:** Keep the dark premium video-platform concept shown in the conversation as the preferred visual direction to develop later.

- Visual direction: dark navy base, teal and coral accents, modern responsive video cards/thumbnails, prominent search, clear navigation, and a polished viewing experience.
- Reference inspiration: the user-approved general layout direction inspired by established video platforms. Use it as structural inspiration only; do not copy another site's branding or proprietary assets.
- Planned screens to specify before implementation:
  1. Home / discovery
  2. Video watch page
  3. Search and categories
  4. Creator profile and verification state
  5. Sign-in/account flows
  6. Upload and pre-publication moderation states
  7. Responsive mobile and desktop layouts
- Current reality: a visual concept only; no complete screen specification or working video product has been verified.
- Preservation note: the preview image displayed in the conversation is not currently stored as a project asset in this repository. Recreate or save an approved reference screenshot/design file into the repository when available; do not claim the exact image itself is archived yet.

## Shared rules

- Treat both options as **approved visual directions**. Final implementation details can be refined with Ali's approval.
- Do not delete or replace the existing control-panel prototype when developing the video platform.
- Keep the control panel and end-user video platform as separate interfaces with different purposes.
- Prefer free/no-card tools and portable, replaceable technology choices.
- Do not mark either item GREEN until the relevant acceptance checks have actually passed with recorded evidence.
- Major scope, architecture, provider, or cost decisions require an impact review and Ali's approval.

## Next steps (not yet completed)

1. Verify the control-panel source changes and run browser acceptance checks; source-level checks alone do not qualify it as GREEN.
2. Create a saved visual reference/screen specification for the video platform.
3. Review the primary journeys and responsive layouts with Ali.
4. Only then implement the product UI and connect real services in planned stages.
