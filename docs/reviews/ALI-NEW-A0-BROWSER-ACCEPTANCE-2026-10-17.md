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


## 10. Responsive defect correction and latest acceptance — 2026-10-17

The following later runs supersede the earlier viewport failures and older 9/9 or 17/17 totals only for the exact commit and tests listed here.

- **Code commit tested:** `7d97fae46ffe988fdfd6ca937e4498c64dff9e37`.
- **Local Playwright Acceptance run #25:** https://github.com/AligasSRM/ALI-NEW/actions/runs/38985108730 — **18 passed (8.0s)**.
- **Deployed Pages smoke run #12:** https://github.com/AligasSRM/ALI-NEW/actions/runs/38985140923 — **11 passed (9.9s)**.
- **GitHub Pages deployment run #18:** https://github.com/AligasSRM/ALI-NEW/actions/runs/38985108729 — success.
- **Pages build/deployment run #36:** https://github.com/AligasSRM/ALI-NEW/actions/runs/38985108135 — success.
- Coverage includes control-panel title/stage evidence; tree disclosure and synchronized ARIA state; all navigation targets; search/clear; explicit button types and safe in-page/external-link attributes; visible keyboard focus; no uncaught page errors; and 360, 390, 768, and 1280px viewport checks. The live suite covers the corresponding published-page interactions.
- Earlier runs exposed horizontal overflow at 360px and 768px. The recorded root causes were an unconstrained mobile navigation/content width and intrinsic minimum width in the two-column detail grid. The source now constrains the mobile app/navigation and stacks detail grids at widths up to 900px. The subsequent local and live suites passed at all tested widths.
- No real credentials were entered and no authentication or backend integration was added.

**Status remains YELLOW** until standards-based HTML validation, full-history secret scanning, deployed response-header review, broader semantic/contrast accessibility review, and final A0 closeout are recorded. These passing browser tests do not certify the end-user platform or production readiness.

## 11. Independent verification addendum — 2026-10-24

This addendum supersedes the earlier open-item wording only for HTML validation and historical secret scanning. It does not close A0.

### Verified evidence

- **Source CI:** [Playwright Acceptance run 40029504909](https://github.com/AligasSRM/ALI-NEW/actions/runs/40029504909) completed successfully on the PR #14 change set. The job confirms the full-history secret scan passed; A0 source invariants and inline JavaScript syntax passed; Nu HTML Checker returned 0 errors and 0 warnings for `index.html` and `design-preview/index.html`; CORE inventory and registry validation passed; route-resolver tests passed; and Playwright passed **14/14** tests.
- **Live HTML validation:** the external [Nu HTML Checker report for the root panel](https://validator.w3.org/nu/?doc=https%3A%2F%2Faligassrm.github.io%2FALI-NEW%2F&out=json) returned `messages: []` on 2026-10-24. The [legacy-route report](https://validator.w3.org/nu/?doc=https%3A%2F%2Faligassrm.github.io%2FALI-NEW%2Fcontrol-panel%2F&out=json) also returned `messages: []`; an independent live fetch confirmed that `/ALI-NEW/control-panel/` resolves to the canonical root page.
- **Response-header review:** the independent [SecurityHeaders scan of the root page](https://securityheaders.com/?q=https%3A%2F%2Faligassrm.github.io%2FALI-NEW%2F&followRedirects=on) reported grade **D** at 2026-10-23 22:06:50 UTC. It found `Strict-Transport-Security`, but reported these headers missing: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. The legacy-route scan reported the same missing-header set.
- **CSS contrast spot-check:** selected foreground/background pairs from the current source tokens were calculated and exceeded WCAG AA's 4.5:1 normal-text threshold (including `#F3F5FF` on `#080D19` = 17.85:1, `#AAB5CC` on `#10182A` = 8.59:1, and `#71839e` on `#10182A` = 4.59:1). This is a limited static spot-check, **not** a complete contrast or semantic-accessibility audit.

### Remaining gates and decision

- **A0 remains YELLOW / OPEN.** Passing HTML and historical-secret checks are now evidenced; they must not continue to be listed as unverified.
- The response-header finding is documented, not silently waived. No hosting, Pages, permission, or protection settings were changed. Addressing server response headers may require a separately authorized hosting/configuration decision; static HTML cannot supply every missing response header.
- A broader semantic/accessibility review and the owner's desktop/mobile visual acceptance are still outstanding.
- No GREEN certificate is issued and A1 is not started. Reassess only after the remaining gates are resolved with evidence and the required owner acceptance is recorded.

## 12. Page-level security mitigation — 2026-10-24

A source-level mitigation was added on the existing PR #15 branch; it has **not** been merged or verified on the live Pages deployment.

- Kept the current inline control-panel JavaScript in place to avoid adding an unregistered file to the CORE inventory.
- Added a page-level CSP meta policy: `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, same-origin resources/connections, and restricted form actions. `script-src 'self' 'unsafe-inline'` is required by the existing inline script, so this is limited defense-in-depth and does not prevent all inline-script injection. Inline styles also remain allowed because the current design uses an inline style block and style attributes.
- Added `strict-origin-when-cross-origin` as the document referrer policy.
- Extended `scripts/validate-a0.mjs` to assert the policies are present; the existing inline JavaScript syntax check remains active.

**Important limitation:** these meta policies are defense-in-depth, not HTTP response headers. They do not clear the SecurityHeaders finding and do not replace `X-Frame-Options`, `X-Content-Type-Options: nosniff`, or `Permissions-Policy`; CSP `frame-ancestors` also cannot be enforced through a CSP meta element. The live SecurityHeaders grade therefore remains unverified after this source change and must not be described as fixed. GitHub Pages does not provide arbitrary per-site response-header configuration through repository HTML. No hosting, DNS, Pages, protection, or permission settings were changed.

A0 remains **YELLOW / OPEN** until the source checks pass, the change is deployed and checked live, the remaining response-header risk is resolved through an explicitly authorized supported hosting path or documented risk decision, and accessibility/owner-acceptance gates are complete.
## 8. Post-merge CI verification (2026-10-24)

The semantic translation-ID refactor was merged as commit `e7dfa9242032b8af2f77c456a0e2b1dd5a206973`. The following GitHub Actions runs for that commit completed successfully:

- [Deployed Pages smoke tests — run 40086667806](https://github.com/AligasSRM/ALI-NEW/actions/runs/40086667806)
- [CORE Diagnostic Loop — run 40086650117](https://github.com/AligasSRM/ALI-NEW/actions/runs/40086650117); the `validate` job passed, while `diagnose_pull_request` and `diagnose_trusted` were skipped.
- [Playwright Acceptance — run 40086649999](https://github.com/AligasSRM/ALI-NEW/actions/runs/40086649999)
- [GitHub Pages deployment — run 40086649902](https://github.com/AligasSRM/ALI-NEW/actions/runs/40086649902)
- [Pages build and deployment — run 40086649619](https://github.com/AligasSRM/ALI-NEW/actions/runs/40086649619)

These are successful workflow results, not a substitute for the outstanding acceptance gates below. They do not establish that the missing HTTP response headers have been fixed, that a comprehensive accessibility audit has passed, or that the owner has accepted desktop/mobile visuals.

## 9. Current A0 closeout blockers (reconfirmed 2026-10-24)

1. **HTTP security response headers:** the previously recorded SecurityHeaders grade D and missing response headers remain unresolved until a fresh live scan demonstrates otherwise. HTML meta directives are not equivalent to HTTP response headers. Standard GitHub Pages static hosting does not provide a per-repository setting for arbitrary response headers; do not add an ignored `_headers` file and claim remediation.
2. **Accessibility:** add repeatable keyboard-focus and responsive-overflow regression checks, then run them in CI. These checks cover only the stated behaviors and are not a comprehensive WCAG audit.
3. **Owner visual acceptance:** record Ali's actual desktop and mobile review/decision. Engineering cannot self-certify owner acceptance.
4. **Final evidence:** after the changes and live deployment, repeat the relevant Actions and live-page/header checks and record exact commit/run IDs.

A0 remains **YELLOW / OPEN** until these gates are evidenced. No release or next phase is authorized by this record.
