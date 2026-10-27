# Mission 001 — Chapter 4: Rightsizing Fiction Airline

**Status:** Ready for analysis — educational scope confirmed  
**Mission commander:** Platoon Commander  
**Source lens:** *Microservices Up and Running*, Chapter 4 — rightsizing microservices using Domain-Driven Design, Event Storming, and service-boundary analysis.

## Project constraints (confirmed)
- Fiction Airline is an **educational microservices project following the book**, not a production airline platform.
- Optimize for learning, clear boundaries, reproducible experiments, and manageable implementation complexity.
- Use simplified airline policies where needed, explicitly labeling them as educational assumptions.
- Prefer incremental extraction and comparison of alternatives over maximizing service count.
- Keep operational tooling minimal until a chapter or learning objective calls for it.

## Objective
Recommend an evidence-backed set of bounded contexts and initial deployable service boundaries for the Fiction Airline reservation domain. Minimize coordination costs and preserve business cohesion.

## Existing evidence to inspect
- `README.md` (documented product and C4 container intentions).
- `fiction-airline-reservation.dsl` (documented architecture).
- `src/`, `server.ts`, and any relevant source/config files (actual implementation).
- Existing tests, API contracts, and database definitions if present.

## Hypotheses to test — NOT decisions
- Flight search/schedules and seat inventory may have distinct ownership.
- Booking/reservation orchestration may need strong coordination with inventory and payments.
- Payment processing may need a separate external-provider boundary.
- Ticketing and notifications may be independent capabilities, or initially modules.
- README's shared Reservation Database may conflict with future independent data ownership.

## Ordered assignments
1. **Domain:** capability map, glossary, actors, business invariants.
2. **Event Storming:** happy/unhappy-path event timelines and missing rules.
3. **DDD:** bounded contexts, aggregates, context relationships.
4. **Boundaries:** compare modular, coarse, and fine-grained alternatives with a justified scoring rubric.
5. **Contracts:** sketch proposed commands, queries, events, and data ownership.
6. **Reviewer:** challenge evidence, coupling, consistency, complexity, and failure paths.
7. **Commander:** reconcile, produce proposed ADR(s), and request human review.

## Required deliverables
- `architecture/domain-map.md`
- `architecture/event-storming.md`
- `architecture/context-map.md`
- `architecture/service-boundaries.md`
- `architecture/contracts.md`
- `architecture/decisions/0001-initial-service-boundaries.md`

## Acceptance criteria
- [ ] Existing implementation is distinguished from README/C4 intentions and future proposals.
- [ ] At least booking-success, payment-failure, and seat-hold-expiry flows are examined.
- [ ] Business invariants and unresolved policy questions are explicit.
- [ ] Each proposed context has a single accountable data owner.
- [ ] At least two alternative boundary designs are compared.
- [ ] Coupling, consistency, team overhead, and split triggers are documented.
- [ ] Reviewer objections are recorded and addressed or escalated.
- [ ] ADR remains **Proposed** pending human approval.

## Out of scope
Service extraction, production code changes, database migrations, cloud deployment, or automatic agent execution.

## Kickoff questions for the product owner
1. **Answered:** educational microservices project following the book.
2. Are ticket issuance and refunds in the first release?
3. What is the expected team size and deployment/operations capacity?
4. What is the business rule for seat-hold duration and payment failures?
