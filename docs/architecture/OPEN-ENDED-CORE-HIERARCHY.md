# ALI & ALEX CORE — Open-Ended Hierarchy v2

**Status:** YELLOW — implementation under validation  
**Scope:** ALI-NEW only  
**Owner / final decision:** Ali  
**Engineering:** Alex

## Canonical model

- **A**: top-level project section. The current 13 A sections are retained; adding more is allowed.
- **B**: a directly mapped file or resource under an A section.
- **C and deeper levels**: tasks, issues, test cases, evidence, or nested details attached to a specific parent.
- **No fixed maximum depth.** The schema accepts uppercase single-letter levels A–Z. The canonical parent route determines the nesting; a later letter such as M may be used for a deeper level without requiring a hard-coded A/B/C-only engine.
- IDs are local to their parent. Canonical identity is the full route, such as `A0/B3`, `A0/B3/C0`, or `A0/B3/C0/M0`.
- Physical repository paths remain unchanged. A/B/C are logical routing identities, not folders to create.
- The resolver routes only exact changed paths from one approved repository. Missing, duplicate, or malformed routes return UNKNOWN.

## Migration choices

Existing file/resource records were moved to direct B children of their existing A root. The former B grouping label is retained in notes for traceability. No repository files were moved or renamed. Task nodes are added only when a real task is identified; no synthetic backlog is created by this migration.

## Validation gates

1. Check every parent route exists before its child.
2. Reject duplicate canonical routes and duplicate physical path mappings.
3. Validate exact GitHub URLs and repository registration.
4. Check local path existence and tracked-file coverage.
5. Exercise exact routing, unknown paths, partial matches, unapproved repositories, duplicate routes, and deeper levels.
6. Keep registry status PARTIALLY_VERIFIED until the validator and tests are actually run against the checked-out repository.

## Extending the tree

Add a node with a one-letter uppercase `level`, an `id` whose prefix matches that level, and `parentId` equal to the full canonical route of its parent. Add a physical `path` only when the node represents a real mapped resource. Do not invent paths or claim GREEN without evidence.
