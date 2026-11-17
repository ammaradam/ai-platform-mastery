# P6M1 · Technical writing: design docs, ADRs and posts

**Pillar:** [Public proof and technical leadership](README.md) · **Time:** ~6 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Write design docs that get decisions made
- Write ADRs that future engineers can trust
- Write public posts that teach one thing with evidence

## Lesson

## Design docs
Google-style design docs capture context and scope, goals and **non-goals**,
the proposed design, **alternatives considered**, and cross-cutting concerns
(security, privacy, cost, observability). Their main value is surfacing
disagreement early and recording *why*. Keep them as short as the decision
allows; a doc nobody reads didn't help.

## ADRs
Michael Nygard's Architecture Decision Record: **Title, Status, Context,
Decision, Consequences**. One decision per record, immutable once accepted
(supersede, don't edit). You already use ADRs, make "Consequences" honest,
including the downsides you accept.

## Public posts
What works for practitioner writing:
- **One idea per post**, with evidence from real work (numbers, diagrams,
  code).
- **Write what you just learned**: "TIL"-style posts are valuable and quick.
- Show the failure, not only the success.
- Title says the takeaway.
- Never invent results; anonymise company data.
Simon Willison's advice: write about things you've done and learned; a short
post published beats a long one in drafts.

## Your pipeline
Every module's exercises produce material. Convert each pillar capstone into a
post on ammaradam.dev, then a short LinkedIn version linking to it.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/) — Malte Ubl | blog | 20 min | Sections of a design doc and when not to write one. |
| **Required** | [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) — Michael Nygard, 2011 | blog | 10 min | The ADR format. |
| **Required** | [What to blog about](https://simonwillison.net/2022/Nov/6/what-to-blog-about/) — Simon Willison | blog | 10 min | TILs and writing about projects. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** Which section of a design doc most prevents scope creep?

- A) Background
- B) Appendix
- C) Timeline
- D) Non-goals

**Q2.** An accepted ADR turns out to be wrong. What do you do?

- A) Edit it
- B) Ignore it
- C) Delete it
- D) Write a new ADR that supersedes it and mark the old one superseded

**Q3.** Which is the best structure for a practitioner blog post?

- A) One idea, backed by evidence from real work
- B) A summary of the news
- C) A list of 10 generic lessons
- D) A product announcement

**Q4.** The five sections of a Nygard ADR are Title, Status, Context, Decision and...

- A) Timeline
- B) Owner
- C) Budget
- D) Consequences

<details><summary>Answers and explanations</summary>

- **Q1: D** — Explicit non-goals stop reviewers expanding the scope.
- **Q2: D** — ADRs are an immutable log of decisions.
- **Q3: A** — Specific, evidence-backed posts build credibility.
- **Q4: D** — Consequences record the trade-offs you accept.

</details>

## Exercises

### Post from p1 or p4 (core)

Turn one completed exercise into a post (800-1,200 words) with one diagram. Publish on ammaradam.dev.

**Deliverable:** Published post URL.

**Done when:**
- [ ] Title states the takeaway
- [ ] Contains at least one real number or artefact

### ADR backlog (core)

Write ADRs for 3 decisions you already made on the agent platform (e.g. self-hosted agents over hosted agents, APIM as gateway, one Foundry resource per workload per environment).

**Deliverable:** 3 ADRs in a docs/adr folder.

**Done when:**
- [ ] Each lists rejected alternatives and accepted downsides

## Reflection

- What have you learned this month that 100 engineers would want to know?
