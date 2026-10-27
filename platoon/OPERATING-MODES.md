# Platoon Operating Modes

**Status:** Adopted for educational Fiction Airline Platoon workflow.

## Principle
Every new feature or change request enters **Planning Mode** by default. A request to analyze, discuss, or plan is **not** authorization to implement. The human product owner explicitly approves a scoped plan before Execution Mode can begin.

## Planning Mode (default)
**Allowed:** read repository code and documentation, clarify requirements, map business rules and boundaries, compare alternatives, identify risks, draft architecture/API/test plans, estimate effort, and report findings. Planning artifacts may be committed **only when the human explicitly requests recording the plan in GitHub**; otherwise respond in chat without modifying repository files.

**Not allowed:** modifying application code, changing deployment settings, merging PRs, provisioning infrastructure, using live payment credentials, or starting implementation.

### Planning roles
- **Commander:** create a mission proposal, delegate analysis, consolidate recommendations and dependencies.
- **Domain:** clarify user stories, invariants, edge cases and acceptance criteria.
- **DDD/Boundaries:** analyze bounded contexts, service ownership and coordination costs.
- **Contracts:** propose APIs, events and data ownership.
- **Frontend/Backend specialists:** inspect implementation impact and feasibility.
- **Security:** evaluate sensitive-data exposure and external integration risks.
- **QA:** propose verification scenarios and exit criteria.
- **Reviewer:** independently critique the plan and unresolved assumptions.

### Required planning output
1. Request summary and scope / non-goals.
2. Observed current-system facts vs assumptions.
3. Options and recommended approach with trade-offs.
4. Agent work packages, owners, dependencies and sequencing.
5. Contracts, affected modules, data and security implications.
6. Tests, acceptance criteria, risks and rollback approach.
7. Human decision request: **Approve**, **Revise**, or **Reject**.

## Approval gate
Execution requires an explicit instruction from the human product owner approving a specific plan or clearly defined scope. Silence, agreement with the concept, and requests for analysis do not count as approval. Record approved scope and changes to it. Any material expansion of scope returns to Planning Mode for renewed approval.

## Execution Mode (approved scope only)
- **Commander:** allocate tasks, coordinate agent handoffs, track progress and blockers.
- **Implementers:** work on separate branches/workspaces, adhere to agreed contracts, and produce testable changes.
- **Integration:** combine approved work through PRs and resolve contract mismatches.
- **QA:** run automated tests and relevant manual smoke tests; report failures honestly.
- **Reviewer:** check correctness, architecture decisions, security and scope.
- **Commander:** deliver a completion report with evidence, limitations, changed files, test results and open items.

No agent may self-approve its own scope expansion or claim that independent agents ran when a single assistant simulated the roles. No merge to main or deployment without separate authorization.

## Example: credit-card payment request
Default: Planning Mode. Inspect existing mock payment, propose provider sandbox/hosted checkout, PCI-scope reduction, webhook verification, idempotency, booking/payment state transitions and tests. Present plan and await explicit approval. Do not collect or store raw card data.

## Learning evidence (Chapters 1–4)
Track decision records, role ownership, handoff count, coordination conflicts, integration failures, test results and human interventions. Compare with a single-agent baseline when possible; do not equate role descriptions with independently running agents.
