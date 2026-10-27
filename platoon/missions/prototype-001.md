# Mission 002 — Agent-built Fiction Airline prototype

**Status:** Ready for implementation  
**Project type:** Educational prototype applying Chapters 1–4 of *Microservices Up and Running*  
**Delivery method:** GitHub-based, human-supervised coding agents using separate branches/PRs.

## Ground truth
The current repository's actual `src/App.tsx` and `server.ts` implement an **AI architecture/C4 design tool** (Architectura AI), despite the README describing an airline reservation system. Do not claim a working reservation app already exists. Preserve the existing tool unless a separate replacement is explicitly approved.

## Goal
Build a runnable, minimal Fiction Airline reservation prototype with one end-to-end journey:
Search sample flights → select flight → enter passenger → create reservation → simulate payment → show confirmation.

## Prototype scope
- Seeded flight data; no live airline or GDS integration.
- Simple passenger name/email; no authentication for first iteration.
- Mock payment only; never collect real card data.
- Deterministic success and decline scenarios.
- Prevent overselling with an explicit, testable inventory rule.
- Prefer in-memory persistence for the first demo, with clear reset behavior.
- A minimal set of independently understandable backend modules; service extraction is a learning exercise, not a requirement to maximize deployments.

## Agent work packages
1. **Commander:** create issues, dependencies, integration plan, PR review checklist.
2. **Frontend Agent:** responsive search/results/checkout/confirmation screens; consumes documented HTTP API.
3. **Flight Agent:** seeded flight catalog and search/availability endpoint with tests.
4. **Booking Agent:** reservation creation, passenger validation, booking status, inventory coordination; tests.
5. **Payment Agent:** mock authorization endpoint and deterministic declined-payment handling; tests.
6. **Integration Agent:** connect API routes and frontend; local run instructions, environment examples, smoke test.
7. **QA Agent:** happy path, unavailable seat, invalid passenger, payment decline, repeat request/idempotency tests.

## API contract to agree before parallel coding (proposal)
- `GET /api/flights?origin=...&destination=...&date=...`
- `POST /api/bookings` with `flightId`, `passenger`, `idempotencyKey`
- `POST /api/bookings/:id/payments` with `scenario: "success" | "decline"`
- `GET /api/bookings/:id`
All responses are JSON. Specify error formats and booking state transitions in `prototype/contracts.md` before implementation.

## Definition of done
- [ ] `npm install && npm run dev` launches a usable prototype locally.
- [ ] A customer completes the full happy path without external credentials.
- [ ] Payment decline and seat unavailability are visible and recoverable.
- [ ] Backend tests pass and the UI can be smoke-tested.
- [ ] README accurately distinguishes the new reservation prototype from existing architecture tooling.
- [ ] At least one ADR explains chosen boundaries and why they suit Chapters 1–4.
- [ ] Each work package has a PR reviewed before merge.

## Safety and integration rules
Do not commit secrets, use real payment details, or overwrite the existing architecture tool without approval. Parallel agents must coordinate shared files through the Commander; integrate changes serially after contract review.

## Suggested order
Commander + API contract → Flight + Booking + Payment backend → Frontend → Integration → QA → demo.
