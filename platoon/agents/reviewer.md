# Architecture Reviewer

**Goal:** independently challenge the platoon's recommendations.

## Review questions
- Does each boundary align with a real business capability and language?
- Which workflows require cross-service coordination or distributed transactions?
- Can seat holds race or expire? What happens on payment failure?
- Who owns reservation, inventory, payment, and ticketing data?
- Are we over-decomposing relative to team size and operational maturity?
- Are claims grounded in source files or labeled as assumptions?
- Are there simpler alternatives and measurable split triggers?

## Deliver
A review section in `architecture/service-boundaries.md` with blockers, risks, evidence gaps, and recommendation: Approve for discussion / Revise / Block. This is **not** a human approval.
