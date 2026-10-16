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

## 7. Playwright CI and live Pages parity check (2026-10-17)

### Local-source Playwright run

- Workflow run: https://github.com/AligasSRM/ALI-NEW/actions/runs/38982161340
- Commit tested: `8913ef32179e50c80e375dd6739c75051c6d41a2`
- Job: `Browser acceptance (Chromium)` — completed with conclusion `success`.
- Result: **9 passed (4.7s)**.
- Artifact: [ali-new-playwright-report](https://api.github.com/repos/AligasSRM/ALI-NEW/actions/artifacts/12081895427) (expires 2026-10-23).
- Passing coverage: tree ARIA state in the checked-out repository source; build-tree search/clear; age-notice decline/return; preview card search/no-results; demo-only login/registration with empty forms blocked; horizontal overflow at 360, 390, 768, and 1280 px.

### Read-only deployed Pages check

- Control panel loaded at https://aligassrm.github.io/ALI-NEW/control-panel/ and design preview loaded at https://aligassrm.github.io/ALI-NEW/design-preview/.
- A read-only live browser check reported the A1 “Product definition” button had no `aria-expanded` attribute before or after toggling, and reported no visible runtime/console errors.
- The current main-branch `control-panel/index.html` source blob inspected during this review is `847a33c0380fd03b255d05afc2bc06bdd399f53d`; it does include `aria-expanded="false"` on the A1 tree row. This mismatch is evidence of a deployed/source parity issue or an inconsistent live-browser observation and must be resolved with a repeatable direct check. Do not claim Pages deployment is verified GREEN.
- The deployed page's stage-detail copy still says browser acceptance is pending, which is stale relative to the passing CI run.
- The available GitHub connector did not expose a readable Pages build-status/configuration response during this review. Therefore the exact Pages build source and last successful deployment SHA remain **unverified**.

### Change made to the source to support the next deployment check

Commit: `b893cb052255e69fcdc11559a3ca59cab72875e4`

- Added a visible `:focus-visible` outline to buttons, links, inputs, selects, and textareas.
- Updated the A0 stage-detail copy to reflect the 9/9 local Playwright result and explicitly keep live deployment parity/accessibility checks open.
- This commit does not, by itself, prove that GitHub Pages has deployed the change. Re-fetch and re-test the live URLs after deployment.

### Next checks

1. Confirm whether the new commit is served by both Pages URLs; compare visible stage-detail copy and the A1 button's `aria-expanded` state against the current source.
2. Add automated live-URL smoke tests so a future Pages/source mismatch fails visibly.
3. Add keyboard-only focus assertions, navigation-link destination checks, browser-console capture, and standards-based HTML/JavaScript validation.
4. Keep A0 **YELLOW** until deployed parity and the remaining acceptance gates are evidenced.

## 8. Latest Playwright and deployment verification (2026-10-17)

- Playwright Acceptance run #10: https://github.com/AligasSRM/ALI-NEW/actions/runs/38983084948 — **17 passed (6.6s)** on commit `ae2477df2fd924e28d2982044cd51d51ba95b03d`.
- Coverage included control-panel tree ARIA state, search/clear, navigation targets, no uncaught page errors, visible keyboard focus on both pages, age-gate decline/return and continue flows, demo-only login/registration safeguards, and viewport checks at 360, 390, 768, and 1280 px.
- Pages deployment run #3: https://github.com/AligasSRM/ALI-NEW/actions/runs/38983085161 — **success** on the same commit. The deployment job fetched `/ALI-NEW/control-panel/` and verified the stage status marker and `aria-expanded="false"` in the published HTML.
- Playwright report artifact: https://github.com/AligasSRM/ALI-NEW/actions/runs/38983084948/artifacts/12081348435 (expires 2026-10-23).
- CI maintenance note: the deployment workflow previously asserted the stale literal `9/9`; it has now been changed to assert the stable A0 YELLOW stage marker instead, so the check does not become brittle as the suite grows. The ARIA marker assertion remains.
- This confirms a successful deployment workflow and its configured live-HTML smoke check. It does **not** establish a full accessibility/security audit or production readiness. A0 remains **YELLOW** until remaining gates are completed.

## 9. Final status

- Control-panel tested interactions: **PASS within the recorded scope**, with `aria-expanded` follow-up open.
- Design-preview tested interactions: **PASS within the recorded scope**, with visible-focus follow-up open.
- Overall A0 milestone: **YELLOW** — accessibility, security, responsive, validation, and additional acceptance checks remain open.
- Production readiness: **NOT ESTABLISHED**.
- This record was updated after the Playwright and deployment verification runs. Latest CI evidence is documented in Section 8; no credentials or hosting settings were changed.
