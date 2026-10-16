# ALI-NEW — Video Platform Screen Map & UX Specification

**Version:** 0.1  
**Date:** 2026-10-16  
**Status:** YELLOW — initial flow recorded; visual prototype to be reviewed  
**Owner / final decision:** Ali  
**Engineering coordination:** Alex

## Goal

Design the end-user video platform separately from the engineering control panel. Preserve Ali's approved premium dark direction: midnight/navy foundation, teal highlights, coral accents, readable cards, responsive layouts, and a familiar video-platform navigation pattern. XHamster is a structural UX reference only; do not copy its logo, proprietary assets, exact branding, or protected page artwork.

## Primary user journey

1. **Age gate / access notice** — appears before restricted content. Provide a clear under-age exit path and a continue action. A UI confirmation is not, by itself, legally or technically robust age assurance. The actual assurance method, jurisdictional requirements, privacy impact, and hosting/platform rules must be reviewed before public launch.
2. **Home / discovery** — brand, search, categories/navigation, sign-in/register actions, video discovery cards, and clear empty/loading/error states.
3. **Authentication entry** — separate sign-in and registration screens with obvious cross-links, validation, password visibility control, and recovery link. These are visual prototypes only until connected to a real identity system.
4. **Registration** — collect only data justified by the approved account requirements; explain terms/privacy and show field errors. Creator verification is a separate workflow, not an automatic result of registration.
5. **Sign-in** — email/username and password fields, accessible errors, recovery path, and a safe return destination.
6. **User home/profile** — account summary, profile details, settings, saved content, creator status where applicable, and sign-out. Show only functions permitted by the user's role.
7. **Video watch page** — player area, title/metadata, creator identity/status, actions, captions/language options where supported, report action, and related content. No playback is claimed until a real media pipeline exists.
8. **Creator profile** — public profile, published/approved content, verification status, and report entry point.
9. **Upload & moderation (later stage)** — draft/upload state, processing, pre-publication review, outcome, and appeal route. Uploads must not appear public before required moderation approval.

## Navigation and screen inventory

- age-gate: access notice and age confirmation / exit
- home: discovery and primary navigation
- sign-in: login
- register: account creation
- account: user's private home/profile
- settings: account and privacy preferences
- watch: video viewing
- creator: creator profile
- upload-review: later-stage upload and moderation workflow

## Design tokens

- Background: midnight navy (#0b1220)
- Panels: deep blue (#111c2e, #16243a)
- Primary accent: teal (#5eead4)
- Secondary accent: coral (#fb8b78)
- Primary text: cool white (#eef4ff)
- Muted text: blue-gray (#9aabc3)
- Cards: rounded corners, restrained borders, strong text contrast
- Responsive behavior: mobile-first; compact horizontal navigation or menu on small screens; comfortable grids and search on desktop
- Languages: Arabic RTL and English LTR are planned; language selection and translated content need a later acceptance pass.

## Non-functional UX requirements

- Mobile and desktop layouts must both be checked.
- Keyboard focus and labels must be visible and usable.
- Error, loading, empty, and success states must be designed, not only happy paths.
- Never imply that a static prototype provides real authentication, age verification, moderation, or playback.
- Avoid collecting sensitive personal data unless the requirement and privacy basis are approved.
- Before public hosting, verify host/provider acceptable-use rules, content policy, jurisdictional requirements, and applicable age/privacy obligations.
- Keep tools/providers replaceable and document export/exit paths before adopting a significant dependency.

## Acceptance gates

### Design review
- Ali reviews the screen order and navigation.
- Color palette and responsive direction are approved.
- Each primary screen has a named purpose and visible way to continue/back.
- No external branding or assets are copied.

### Prototype review
- All prototype navigation paths work.
- Age-gate continue and exit are distinct and clear.
- Sign-in and registration can switch between each other.
- Form validation is visibly demonstrated but does not send data.
- Mobile and desktop layouts are inspected in a browser.
- Known limitations are documented.

### Implementation review (future)
- Real authentication, age assurance, moderation, and media playback are separately implemented and tested.
- Security/privacy and deployment policy gates pass before public release.

## Current boundary

This document records the agreed initial journey and design direction. It does not assert that any of these screens or backend capabilities are production-implemented. The HTML prototype, when created, is only a front-end navigation mock until verified against the gates above.
