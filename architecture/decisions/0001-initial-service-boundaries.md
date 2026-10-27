# ADR 0001 — Initial Fiction Airline service boundaries

**Status:** Proposed — analysis not yet completed

## Context
The README describes Booking, Flight Search, Inventory Management, Payment Processing, and Notification services, plus a shared Reservation Database. Chapter 4 requires validating service boundaries against business cohesion and coordination cost, rather than accepting the diagram as a final deployment plan.

## Decision
**Pending.** No service boundaries are approved by this ADR yet.

## Alternatives to evaluate
1. Modular monolith with explicit domain modules.
2. Coarse-grained booking-oriented services with a limited number of external integrations.
3. Finer-grained independently deployable services matching documented C4 containers.

## Evidence required
Event Storming outputs, bounded-context map, data ownership, consistency/failure analysis, implementation inventory, team/deployment assumptions, and Reviewer critique.

## Consequences
No implementation changes are authorized. Once evidence is complete, replace this placeholder with the proposed decision and obtain human review.
