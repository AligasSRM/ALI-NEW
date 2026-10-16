# ALI-NEW — Technical Decision Record (TDR)

> **Template.** Complete for significant architecture, tooling, provider, data, deployment, or integration decisions. A record documents a decision; it does not itself authorize paid, destructive, or production actions.

## Record identity
- Decision ID:
- Title:
- Date / status: PROPOSED / ACCEPTED / REJECTED / SUPERSEDED
- Owner / final approval:
- Scope / affected sections:
- Related files, issues, commits, and evidence:

## 1. Requirement and context
- User/product need:
- Constraints (budget, no-card, geography, devices, accessibility, policy):
- Acceptance criteria:
- What is verified versus assumed:

## 2. Options considered
| Option | Benefits | Costs / free-tier limits | Risks / lock-in | Fit |
|---|---|---|---|---|
| | | | | |

## 3. Decision and rationale
- Selected option (provisional unless explicitly approved):
- Why it fits the requirement:
- Why alternatives were not selected:
- What would cause us to reconsider:
- Is this reversible? YES / PARTLY / NO — explain:

## 4. Dependency and portability review
- Provider-specific code/configuration boundaries:
- Data formats and export availability:
- Data ownership, retention, deletion, and migration:
- Required permissions and data sent to the provider:
- Names/assumptions that must not leak into core domain files:
- Replacement candidates and estimated migration scope (no unsupported estimates):

## 5. Exit, migration, and rollback
- Trigger to replace or leave:
- Export/backup procedure:
- Migration steps and compatibility checks:
- Rollback steps:
- Potential downtime/data loss and mitigations:
- Approval needed before execution:

## 6. Cost and availability
- Free/no-card status verified on:
- Usage quotas, limits, and regional availability:
- Conditions that could introduce charges:
- Paid activation or card required? If yes, remain blocked until Ali explicitly approves.

## 7. Verification plan and evidence
| Check | Expected result | Actual result | Evidence | PASS / FAIL / NOT RUN |
|---|---|---|---|---|
| | | | | |

## 8. Decision lifecycle
- Review trigger/date:
- Current status: PLANNED / YELLOW / ORANGE / GREEN / LOCKED / SUPERSEDED
- Reopen conditions:
- Superseded by (if applicable):
- Ali's approval and date:

**Mandatory rule:** No provider is permanent merely because it was selected. GREEN applies only to the tested scope and exact evidence/commit. Re-evaluate when needs, cost, availability, security, maintenance, or better alternatives change. Do not over-engineer abstractions; implement the smallest practical boundary that supports a credible replacement.
