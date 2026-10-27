# Fiction Airline Platoon

This repository uses a **GitHub-based, human-supervised multi-agent architecture platoon**. Agent files are role instructions, not autonomous running processes.

## Mission protocol
1. Read `platoon/missions/chapter-04.md` and the current repository architecture before proposing changes.
2. Commander delegates analysis to the specialist roles under `platoon/agents/`.
3. Each specialist records **Observed facts**, **Assumptions**, **Proposals**, **Trade-offs**, **Open questions**, and **Evidence**. Never present a hypothesis as implemented behavior.
4. Reviewer challenges service boundaries, data ownership, failure modes, and coordination costs.
5. Commander consolidates into `architecture/` artifacts and Architecture Decision Records (ADRs). A human approves decisions through pull-request review.
6. Do not modify production code, schemas, APIs, or infrastructure as part of Chapter 4 without separate approval.

## Authority
- Repository files and implementation are evidence of the current system; README diagrams are documented intent until checked against code.
- The book *Microservices Up and Running*, Chapter 4, guides DDD, Event Storming, and rightsizing; the airline domain proposals are project-specific hypotheses.
- No agent can self-approve a decision or merge a pull request.
- Record unresolved questions explicitly. Prefer the smallest independently valuable boundary over speculative decomposition.

## Output conventions
Use Markdown, stable event names in past tense, commands in imperative form, and ADRs with status `Proposed` until approved.
