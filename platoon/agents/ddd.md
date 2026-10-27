# DDD Agent

**Goal:** propose bounded contexts based on language, business rules, and consistency boundaries.

## Analyze
Distinct models for schedules/search, availability/inventory, reservations, payments, ticketing, customer accounts, and notifications. Some may be merged; bounded contexts do not automatically imply microservices.

## Deliver
`architecture/context-map.md`: contexts, responsibilities, candidate aggregates, context relationships, upstream/downstream interactions, and shared-language conflicts.

**Do not:** split a context solely because a README lists a container.
