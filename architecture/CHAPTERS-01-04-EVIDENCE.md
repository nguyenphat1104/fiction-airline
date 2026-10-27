# Fiction Airline Platoon — Chapters 1–4 Evidence Matrix

**Evidence date:** 2026-10-28  
**Scope:** Educational proof of concept; evidence is graded by strength.  
**Repository:** `nguyenphat1104/fiction-airline`  
**Governance branch:** `feature/platoon-chapter-04` (PR #2, not merged).  
**Prototype artifact:** `fiction-airline-platoon-poc-001.zip` (local downloadable artifact, **not in GitHub**).

## Evidence legend
- **Verified code:** inspected concrete source and ran tests.
- **Documented:** GitHub instructions, plans, or ADR; not proof of working software.
- **Gap:** needs implementation, measurement, or independent verification.

| Chapter / concept | Source evidence | Verification | Status | Remaining proof |
|---|---|---|---|---|
| **1 — Learning by doing** | POC `domain.mjs:6-43`, `server.mjs:5-26`, `test/domain.test.mjs` | Node tests **4/4 passed** on 2026-10-28 | **Verified local code** | Independently deployed services and coordination-cost measurement |
| **1 — Architectural decisions** | `architecture/decisions/0001-initial-service-boundaries.md` | ADR explicitly **Proposed**, decision pending | **Documented** | Complete analysis and human decision |
| **2 — Operating model** | `platoon/agents/domain.md`, `platoon/commander.md`, other role files | Responsibilities documented | **Documented** | Independent agent execution, task traces and measured handoffs |
| **2 — Planning/Execution governance** | `platoon/OPERATING-MODES.md` | Human approval gate documented | **Documented** | Actual approval-to-delivery workflow verification |
| **3 — API design** | POC `server.mjs:12-18` | Search, booking, mock payment and booking retrieval endpoints implemented | **Verified local code** | Full SEED(S) specifications and independently owned services |
| **3 — Domain invariants** | POC `domain.mjs:16-39`, `test/domain.test.mjs` | Validation, idempotency, mock decline and no overselling tested | **Verified local code** | Persistence, hold expiration and real payment integration |
| **4 — Boundary hypotheses** | ADR 0001; POC `domain.mjs:6-43` | Flight, booking, payment are separate behaviors in one process | **Code + proposal** | DDD context map, Event Storming, accepted ADR |
| **4 — Avoid premature splitting** | POC `server.mjs:5-8`, `domain.mjs:6-43` | Single Node process, in-memory state | **Verified local code** | Explicit alternative boundary comparison |

## Reproducible verification
Extract the prototype ZIP and run:

```bash
cd platoon-poc
npm test
npm run dev
```

**Observed 2026-10-28:** `node --test` reported 4 tests, 4 passes, 0 failures. Test cases: seeded search; reservation/idempotency/mock payment; no overselling; invalid passenger and idempotency conflict. This is **local**, not CI, evidence.

## Critical qualifications
1. Existing GitHub `src/App.tsx` and `server.ts` implement the Architectura AI/C4 tool, not the reservation POC. The POC is a **separate ZIP** and has not been committed to the repository.
2. The POC is a **single-process modular prototype**, not independently deployable microservices.
3. Agent roles are documented instructions; **independent multi-agent coding has not been demonstrated**. One assistant implemented the POC across roles.
4. Payment is simulated; no real card processing, provider integration, or stored card details.
5. Data is in memory and resets on restart.
6. ADR 0001 remains Proposed.

## Next evidence milestones (not authorized for execution by this document)
1. Add the POC under `platoon-poc/` via reviewed PR without replacing the C4 tool.
2. Add CI and link test results to a specific commit.
3. Have independent agents implement an approved small feature in tracked branches/PRs.
4. Complete SEED(S) worksheets, Event Storming, context map and boundary alternatives.
5. Record handoffs, review cycles, integration conflicts, failures and human interventions.

**Conclusion:** Chapters 1–4 informed the design; prototype behavior is verified locally. Independently executing agents and production-style microservices remain **unproven**.
