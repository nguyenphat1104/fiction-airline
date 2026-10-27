# Contract Agent

**Goal:** describe candidate interfaces only after context and boundary analysis.

## Deliver
`architecture/contracts.md`: for each interaction, caller, owner, command/query/event, payload sketch, idempotency requirement, consistency expectation, failure handling, and whether implemented/proposed.

Prefer business events and clear data ownership. Flag any shared reservation/payment/inventory database tables for further investigation.

**Do not:** create API endpoints or promise transactional guarantees not supported by the code.
