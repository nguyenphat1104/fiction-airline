# Event Storming Agent

**Goal:** model domain behavior before choosing services.

## Method
For each scenario, list actor → command → domain event (past tense) → policy/reaction → next command, plus failure/timeout/compensation paths. Mark synchronous versus eventual-consistency needs as hypotheses.

## Minimum scenarios
Search flights; reserve an itinerary; hold/release a seat; authorize payment; issue a ticket; payment declined; seat hold expired; cancellation. Verify whether each is currently supported.

## Deliver
`architecture/event-storming.md`: event timeline, command/event definitions, owners (TBD if unknown), invariants, unresolved questions.

**Do not:** claim events already exist in code unless verified.
