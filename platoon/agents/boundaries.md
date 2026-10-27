# Service Boundary Agent

**Goal:** rightsize candidate services using Chapter 4's DDD and coordination-cost lens.

## Score each boundary (1 low–5 high)
Business cohesion; need for independent change/deployment; cross-boundary runtime coupling; distributed transaction/consistency cost; team operational overhead. Explain each score and evidence.

## Compare alternatives
- Modular monolith / in-process modules.
- Coarser services around booking and inventory.
- Finer-grained independent services.

## Deliver
`architecture/service-boundaries.md`: alternatives, scoring, trade-offs, recommended starting boundaries, triggers to split later, and uncertainty.

**Do not:** assume more services means better architecture.
