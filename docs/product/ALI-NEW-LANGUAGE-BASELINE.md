# ALI-NEW — Language Scope Baseline

**Status:** Scope locked; implementation and acceptance remain open  
**Repository:** `AligasSRM/ALI-NEW`  
**Canonical inventory:** `core/language-registry.json`  
**Decision boundary:** This document locks the requested locale scope. It does not certify translated UI, language switching, or release readiness.

## 1. Locked language scope

ALI-NEW's planned product locale scope is the 25 locales recorded in `core/language-registry.json`:

Arabic (`ar`), English (`en`), Spanish (`es`), French (`fr`), Portuguese (`pt`), German (`de`), Italian (`it`), Dutch (`nl`), Polish (`pl`), Ukrainian (`uk`), Russian (`ru`), Turkish (`tr`), Persian (`fa`), Urdu (`ur`), Hindi (`hi`), Bengali (`bn`), Chinese Simplified (`zh-CN`), Chinese Traditional (`zh-TW`), Japanese (`ja`), Korean (`ko`), Indonesian (`id`), Malay (`ms`), Vietnamese (`vi`), Thai (`th`), and Swahili (`sw`).

This is a product scope decision, not a statement that these locales are already implemented. The locale inventory is the single source of truth for locale codes and base writing direction. Any addition, removal, or code change requires an explicit product decision and a matching registry/documentation update.

## 2. Direction and language metadata

- Arabic (`ar`), Persian (`fa`), and Urdu (`ur`) are marked RTL.
- All other in-scope locales are marked LTR.
- The active document must set a correct `html lang` and `dir` value for the selected locale.
- Mixed-direction identifiers, URLs, code, email addresses, and numbers must remain legible using appropriate bidi isolation rather than forcing the whole page into the wrong direction.
- Chinese variants must remain distinct (`zh-CN` and `zh-TW`); do not collapse them into a single locale.

## 3. Current implementation status

**Preview-level switching is implemented; product-wide multilingual acceptance remains OPEN / NOT ACCEPTED.** The `design-preview/index.html` prototype contains locale dictionaries and a language selector for the 25 scoped locales. The selector updates representative UI strings, `html lang`, `dir`, and the saved preview preference. A Playwright test exercises all 25 choices and checks representative strings plus Arabic restoration after reload.

This is evidence of the design-preview implementation only. It does not prove that every user-facing string on every product screen is translated, that translations have been reviewed by native speakers, or that all locales pass responsive, accessibility, and RTL/LTR review. Do not advertise any locale as fully supported based only on this preview or its current automated checks.

## 4. Required implementation and acceptance gate

For **each of the 25 locales**, acceptance evidence must cover:

1. **Translation resources:** every user-facing string on every in-scope screen, including navigation, buttons, labels, form validation, empty states, errors, notices, age-gate copy, accessibility names, and status messages.
2. **No silent fallback:** missing translation keys are detected by automated validation; fallback behavior is explicit and must not conceal incomplete locale coverage.
3. **Language switching:** the language selector updates all visible strings, `html lang`, writing direction, and persisted preference consistently; keyboard and screen-reader users can operate it.
4. **RTL/LTR:** Arabic, Persian, and Urdu are tested as RTL. Mixed-direction text, forms, controls, icons, alignment, overflow, and navigation are reviewed.
5. **Locale quality:** native-language review, diacritics and special glyphs, font coverage, long strings, pluralization, dates, numbers, and locale-specific formatting are checked where relevant.
6. **Responsive and accessibility coverage:** each locale is tested at supported mobile and desktop viewport sizes, with keyboard navigation, visible focus, semantic controls, and screen-reader labels.
7. **Regression automation:** automated tests assert locale registry integrity, translation-key completeness, correct language/direction metadata, successful language switching, and representative flows for every locale.
8. **Evidence and disposition:** record the tested commit, test commands/results, visual review evidence, unresolved defects, and explicit pass/fail status for each locale.

A locale passes only when all applicable criteria pass. Any missing translation, incorrect direction, broken interaction, or absent test evidence keeps multilingual acceptance open.

## 5. Release and governance rules

- The locale scope is fixed at 25 entries unless the product owner explicitly changes it.
- `default_locale` remains unset in the registry until a separate explicit decision selects the product default.
- Scope approval does not authorize release, deployment, merge, or a claim of production readiness.
- This baseline does not close A0, start A1, change branch protection, or authorize changes in any other repository.
- Implementation should be proposed in a scoped branch and reviewed before merge. No direct write to `main` is part of this baseline.

## 6. Evidence references

- Screen map: `docs/design/VIDEO-PLATFORM-SCREEN-MAP.md` — states that Arabic RTL and English LTR are planned and that language selection/translated content need a later acceptance pass.
- Product definition: `docs/product/ALI-NEW-A1-PRODUCT-DEFINITION.md` — remains a draft and leaves launch languages unresolved.
- Design preview: `design-preview/index.html` — implements preview-level locale switching; automated coverage is in `tests/ali-new-a0.spec.ts`. This is not proof of product-wide multilingual acceptance.
- Registry: `core/language-registry.json` — canonical locale inventory and direction metadata.

**Conclusion:** language scope is now explicitly recorded, while runtime localization, translation coverage, automated acceptance, and visual review remain open work. Do not mark the language gate GREEN until evidence proves completion.

## 7. Verification record — 2026-10-24

**Tested commit:** `53c35bf5591e73dc2fbb2fd6f809462fcb3dd726` (before this verification record was appended).  
**Pull request:** [#17](https://github.com/AligasSRM/ALI-NEW/pull/17), merged on 2026-10-24. The pre-merge verification evidence is recorded below; it must not be described as a post-merge workflow run.

### Checks completed

- **PASS — JSON parse:** `core/language-registry.json` parses successfully.
- **PASS — locale count:** exactly 25 locale entries and 25 unique locale codes.
- **PASS — direction metadata:** every direction is either `rtl` or `ltr`; RTL entries are exactly `ar`, `fa`, and `ur`.
- **PASS — default locale safety:** `default_locale` is null; no default was invented.
- **PASS — documentation coverage scan:** the baseline includes requirements for translation completeness, language switching, RTL/LTR, responsive/accessibility checks, regression automation, and explicit open/not-implemented status.
- **PASS — CORE Diagnostic Loop (Read-only):** GitHub Actions run `40041306474` completed successfully.
- **FAIL — Playwright Acceptance workflow:** GitHub Actions run `40041306543` failed at `Validate CORE inventory snapshot`; the browser acceptance steps were skipped.

### Failure analysis and disposition

The Playwright workflow did not fail a language-switching or browser localization test. It failed earlier because the canonical tracked-file inventory does not yet account for the two files added by this PR: `core/language-registry.json` and `docs/product/ALI-NEW-LANGUAGE-BASELINE.md`. The validator reported both as missing from `core/inventory.snapshot.json`. As a result, browser acceptance was not executed and cannot be reported as passing.

**Disposition of this historical failure:** the inventory snapshot and canonical registry were subsequently reconciled on the PR branch. The two new paths are explicitly recorded as `UNMAPPED`, without inventing hierarchy routes. A later run on commit `edeee5b0f09a4cc0b059c9252543efd521e6526e` passed CORE and Playwright acceptance (runs `40041636400` and `40041636410`). The failure above remains in the record as historical evidence, not the current CI status.

**Current language-gate status: OPEN / NOT ACCEPTED.** Runtime translations, language switching, per-locale browser tests, and visual/accessibility review remain unimplemented or unverified.


## 8. Workflow trust-boundary hardening — 2026-10-24

The CORE diagnostic workflow was updated to separate pull-request diagnostics from trusted issue/manual diagnostics:
- Pull-request diagnostic job permissions are limited to `contents: read` and `actions: read`; it has no `issues: write` permission and does not post issue comments.
- The issue/manual diagnostic job alone receives `issues: write`, and checks out the repository default branch so write-capable diagnostic code is not taken from a pull-request branch.
- Final acceptance must be based on workflow results for the current head commit after this change. Earlier green runs do not certify a later commit.


## 9. Post-merge status reconciliation — 2026-10-24

- **PR #17 status:** merged and closed. Merge commit: `0ccd8b6098cdf6d4679aa37bb9c95f7fc0d16e11`.
- **Pre-merge CI evidence:** CORE Diagnostic Loop run [#134](https://github.com/AligasSRM/ALI-NEW/actions/runs/40084191930) and Playwright Acceptance run [#212](https://github.com/AligasSRM/ALI-NEW/actions/runs/40084191903) passed on PR head commit `ccca0e89a76805e569e526b9743ab50286e039f8`.
- **Evidence limitation:** a check for workflow runs associated with the merge commit returned no PR-triggered runs. Therefore, these pre-merge green runs are not represented as post-merge CI evidence.
- **Workflow implementation verified on `main`:** PR diagnostics have `contents: read` and `actions: read`; `issues: write` is limited to the trusted issue/manual job, which checks out the repository default branch.
- **Scope and gate status unchanged:** the 25-locale scope is locked, but product-wide multilingual acceptance remains `OPEN / NOT ACCEPTED`. A0 remains `YELLOW / OPEN`; A1 remains `PLANNED`. This record does not authorize a release, close A0, or start A1.
