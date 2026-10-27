# Fiction Airline — Platoon POC-001

A **working educational reservation prototype** built alongside (not replacing) the existing Architectura AI/C4 application. Demonstrates the implementation work packages assigned to the Flight, Booking, Payment, Frontend, Integration, and QA agent roles. **This code was integrated by one assistant acting across the defined roles; independent parallel agent execution has not yet been demonstrated.**

## Run

Requires Node.js 20+; no npm dependencies, credentials, or real payment providers.

```bash
cd platoon-poc
npm run dev
# open http://localhost:3100
```

Run tests: `npm test`. State is in memory and resets when the server restarts. Sample flights are dated **2026-11-15**; search SGN → HAN.

## Endpoints

- `GET /api/flights?origin=SGN&destination=HAN&date=2026-11-15`
- `POST /api/bookings` with `{"flightId":"FA101","passenger":{"name":"Alex Nguyen","email":"alex@example.com"},"idempotencyKey":"unique-1"}`
- `POST /api/bookings/BK0001/payments` with `{"scenario":"success"}` or `{"scenario":"decline"}`
- `GET /api/bookings/BK0001`

Error responses are JSON `{ "error": "..." }` with appropriate HTTP status.

## Chapter 1–4 learning evidence

| Chapter | Demonstration | Limitation |
|---|---|---|
| 1: Toward a Microservices Architecture | Explicit ownership and simple API interactions; documented coordination trade-offs | No independent deployments yet |
| 2: Designing a Microservices Operating Model | Named agent roles and handoff workflow in `platoon/` | Human-supervised roles, not autonomous multi-agent execution |
| 3: Designing Microservices | Flight/Booking/Payment responsibilities, contract and tests | No full SEED(S) service specification yet |
| 4: Rightsizing Your Microservices | Three cohesive domain modules in one deployable process, avoiding premature distributed complexity | Boundaries remain hypotheses to evaluate with Event Storming/DDD |

## Next proof step
Have separate agents independently implement changes on distinct PR branches against the shared contract, then record handoffs, merge conflicts, review findings, and tests. This POC demonstrates a working prototype and a **role-based workflow**, not a proven multi-agent performance improvement.
