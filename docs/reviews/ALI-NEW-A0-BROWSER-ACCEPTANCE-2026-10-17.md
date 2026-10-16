# ALI-NEW — A0 Browser Acceptance Evidence

**Recorded:** 2026-10-17  
**Scope:** ALI-NEW only; static control-panel and design-preview browser behavior  
**Status:** 🟡 Partial acceptance evidence recorded; A0 is not certified GREEN  
**Owner / final decision:** Ali  
**Engineering record:** Alex

## 1. Evidence source

- Earlier browser run: [TinyFish run report](https://agent.tinyfish.ai/runs/b3716518-8499-4c40-8940-19fe7d1379ae)
- Follow-up control-panel acceptance run: [TinyFish run report](https://agent.tinyfish.ai/runs/860e86b4-bf6b-4e9c-8593-a37d14afaa77)
- Follow-up design-preview acceptance run: [TinyFish run report](https://agent.tinyfish.ai/runs/05fef65a-ca41-41c3-843b-6fc6c4346870)
- Control panel: https://aligassrm.github.io/ALI-NEW/control-panel/
- Design preview: https://aligassrm.github.io/ALI-NEW/design-preview/
- Repository: https://github.com/AligasSRM/ALI-NEW

The earlier run is retained as historical evidence. The two follow-up runs below provide more specific acceptance results and supersede earlier broad statements where they identify a limitation or failure. This note does not claim a full security, accessibility, or production audit.

## 2. Follow-up browser acceptance runs (2026-10-17)

### Control panel — run `860e86b4-bf6b-4e9c-8593-a37d14afaa77`

**Passed:** page load/title; desktop rendering spot-check; all 7 navigation targets and active states; expand/collapse of A0 and A11; `security` search and clearing; build-tree shortcut; build specification link; visible keyboard focus on the tested input.

**Open / not verified:** the browser run did not find `aria-expanded` on the tree-row buttons when inspecting the DOM, raising a screen-reader state concern. A narrow mobile viewport could not be emulated. No complete accessibility audit was performed.

### Design preview — run `05fef65a-ca41-41c3-843b-6fc6c4346870`

**Passed:** page title and age-notice presentation; declining access shows the closed screen; returning restores the notice; continuing reveals the demo; navigation chips change active state; matching search, no-match state, and clearing behave as observed; clicking a sample card opens the sample watch page; sign-in and registration labels and prototype warnings are present; empty form submissions are blocked by native required-field validation without entering data.

**Open / failed spot-check:** a distinct visible keyboard-focus indicator was not clearly observed on the tested registration controls. This is an accessibility follow-up, not a claim that all keyboard navigation fails. Mobile viewport emulation was not performed.

**Safety boundary:** no personal data, email, username, or password was entered. The age gate is a visual demo, not legally sufficient age verification; authentication, registration, and playback remain unconnected.

## 3. Earlier browser checks recorded as passed

### Control panel
- Page loaded.
- Project build tree expanded across the A0–A12 levels (13 levels).
- Search for the term security returned matching content.
- Navigation interactions worked.
- Evidence links were present.

### Design preview
- Page loaded.
- The demo age-gate interaction worked.
- Search filtering worked.
- Navigation chips changed the displayed state.
- Demo cards and buttons were clickable.

### Safety boundary observed during the run
- No settings were changed.
- No credentials were entered.

## 4. What these results do and do not establish

**Established within the recorded test scope:** the listed static-page loading and UI interactions behaved as expected in that browser run.

**Not established:** real authentication, account creation, persistence, backend/API integration, video upload or playback, legally sufficient age assurance, production readiness, comprehensive responsive behavior, or comprehensive accessibility/security.

The design-preview sign-in and registration screens are demos. Do not enter real passwords or sensitive personal data. The browser test did not establish a real account or login flow.

## 5. Remaining A0 verification

Keep A0 **YELLOW** until the following are checked and recorded with evidence:
1. Keyboard-only navigation and visible focus.
2. Contrast and semantic/accessibility checks.
3. Desktop and mobile viewport behavior.
4. HTML and JavaScript validation.
5. Full link destination review and console/runtime errors.
6. Security headers/hosting configuration and a broader secret scan, including relevant Git history.

The earlier repository review dated 2026-10-16 contains source-level findings and limitations. Where it says browser interaction checks were not run, this later browser evidence supersedes that statement only for the interactions explicitly listed above; all other untested areas remain unverified.

## 6. Repository and deployment note

GitHub repository metadata was checked on 2026-10-17 and reported the repository as **public**. The Pages URLs above were the targets in the browser report. Recheck the repository and deployment settings before any visibility or hosting change.

## 7. Final status

- Control-panel tested interactions: **PASS within the recorded scope**, with `aria-expanded` follow-up open.
- Design-preview tested interactions: **PASS within the recorded scope**, with visible-focus follow-up open.
- Overall A0 milestone: **YELLOW** — accessibility, security, responsive, validation, and additional acceptance checks remain open.
- Production readiness: **NOT ESTABLISHED**.
- No code, repository settings, credentials, or deployment configuration were changed as part of writing this evidence record.
