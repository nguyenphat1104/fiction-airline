# Architecture Platoon

**Purpose:** support Fiction Airline's microservice design, starting with Chapter 4 of *Microservices Up and Running*.

This is a GitHub-first, manual orchestration workflow. It does **not** automatically invoke multiple LLMs. A human or coding assistant assumes each role in turn and commits the outputs for review.

## Roles
- [Commander](commander.md): coordinates and integrates.
- [Domain](agents/domain.md): airline capabilities and invariants.
- [DDD](agents/ddd.md): bounded contexts and aggregates.
- [Event Storming](agents/event-storming.md): commands, events, and unhappy paths.
- [Boundaries](agents/boundaries.md): cohesion, coupling, and sizing.
- [Contracts](agents/contracts.md): candidate API and event ownership.
- [Reviewer](agents/reviewer.md): independent architecture critique.

## Run mission 001
1. Read [Chapter 4 mission](missions/chapter-04.md).
2. Compare the README and `fiction-airline-reservation.dsl` with actual code; document discrepancies.
3. Execute roles in this order: Domain → Event Storming → DDD → Boundaries → Contracts → Reviewer → Commander.
4. Write outputs to `architecture/`, using the templates and acceptance criteria in the mission.
5. Open a PR; require human review before changing any ADR status to Accepted.

**Important:** candidate services are hypotheses; this mission must not silently change the running app.
