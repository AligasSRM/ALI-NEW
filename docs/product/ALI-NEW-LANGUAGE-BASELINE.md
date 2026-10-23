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

**Not implemented / not accepted yet.** The source snapshot inspected during the language audit contains English-only main and design-preview document metadata, a few separate Arabic RTL utility pages, and no verified end-to-end language switcher or complete locale resource set. The existing product screen map explicitly says language selection and translated content require a later acceptance pass. The language inventory does not close that gap by itself.

Do not advertise any locale as fully supported until the acceptance gate below is satisfied. Do not infer translation completeness from the presence of a locale code, a translated page title, or `lang`/`dir` attributes alone.

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
- Design preview: `design-preview/index.html` — currently declares `lang="en"`; this is not proof of multilingual support.
- Registry: `core/language-registry.json` — canonical locale inventory and direction metadata.

**Conclusion:** language scope is now explicitly recorded, while runtime localization, translation coverage, automated acceptance, and visual review remain open work. Do not mark the language gate GREEN until evidence proves completion.

## 7. Verification record — 2026-10-24

**Tested commit:** `53c35bf5591e73dc2fbb2fd6f809462fcb3dd726` (before this verification record was appended).  
**Pull request:** [#17](https://github.com/AligasSRM/ALI-NEW/pull/17), open Draft; not merged.

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

**Required follow-up:** reconcile the two added paths with the existing canonical registry and inventory snapshot in a separately reviewed, scope-safe change, then rerun the workflow. Until that succeeds, CI is not green. This record is evidence of the current outcome, not closure of the multilingual acceptance gate.

**Current language-gate status: OPEN / NOT ACCEPTED.** Runtime translations, language switching, per-locale browser tests, and visual/accessibility review remain unimplemented or unverified.
