# P1 · Production ML lifecycle

**Your current level:** Strong

## Goal

Explain, design and defend an end-to-end production ML system at staff level: where technical debt hides, how data and model contracts stop silent failures, how releases are gated, and how drift is caught before the business notices.

## Why this matters for you

You already do most of this at Pickles. The goal here is to close the gap between "I've done it" and "I can teach it, name the failure modes, and cite the literature". Use the test-out quiz to skip modules you already own.

## Modules

Total: ~28 hours

| Module | Hours | Quiz | Exercises |
|---|---|---|---|
| [P1M1 · ML systems and hidden technical debt](p1m1-ml-systems-and-hidden-technical-debt.md) | 6 | 6 Qs | 2 |
| [P1M2 · Data contracts, training-serving skew and feature stores](p1m2-data-contracts-training-serving-skew-and-feature-stores.md) | 8 | 6 Qs | 3 |
| [P1M3 · Testing, CI/CD and release strategies for ML](p1m3-testing-ci-cd-and-release-strategies-for-ml.md) | 8 | 6 Qs | 2 |
| [P1M4 · Monitoring, drift and incident response for ML](p1m4-monitoring-drift-and-incident-response-for-ml.md) | 6 | 6 Qs | 3 |

## Capstone: Production-readiness review of Beacon or Atlas

Score one of your real pricing models against the ML Test Score rubric and write a 2-page production-readiness review with a prioritised fix list.

**Deliverables**

- [ ] ML Test Score sheet (all 28 tests, scored 0 / 0.5 / 1) with evidence links
- [ ] 2-page review - top 5 risks, each with blast radius and fix cost
- [ ] One fix actually implemented (e.g. a skew check or a release gate)

**Graded on**

- Every score backed by evidence (code, dashboard, runbook), not memory
- Risks ranked by business impact, not by how interesting they are
- The implemented fix has a test proving it catches the failure
