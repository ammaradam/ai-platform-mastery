# P5 · AI governance, risk and security

**Your current level:** Partial

## Goal

Turn governance frameworks and regulation into concrete platform controls: risk tiers, documentation, audit trails, human oversight and LLM security - mapped to NIST, ISO/IEC 42001, the EU AI Act and Malaysian/Singapore guidance.

## Why this matters for you

Regulated enterprises (PETRONAS, banks, GLCs) hire people who can translate "responsible AI" into controls engineers can implement and auditors can verify.

## Modules

Total: ~26 hours

| Module | Hours | Quiz | Exercises |
|---|---|---|---|
| [P5M1 · Risk frameworks: NIST AI RMF and ISO/IEC 42001](p5m1-risk-frameworks-nist-ai-rmf-and-iso-iec-42001.md) | 6 | 6 Qs | 2 |
| [P5M2 · Regulation and guidance: EU AI Act, Malaysia, Singapore](p5m2-regulation-and-guidance-eu-ai-act-malaysia-singapore.md) | 6 | 6 Qs | 2 |
| [P5M3 · LLM and agent security](p5m3-llm-and-agent-security.md) | 8 | 6 Qs | 2 |
| [P5M4 · Operational governance: documentation, lineage and human oversight](p5m4-operational-governance-documentation-lineage-and-human-oversight.md) | 6 | 5 Qs | 2 |

## Capstone: Governance-by-design pack for your agent platform

Produce the governance pack for the Foundry + AKS agent platform: risk-tiering policy, control matrix mapped to frameworks, model/agent card template, threat model, and the automated controls the platform enforces.

**Deliverables**

- [ ] Risk-tiering policy (1 page) with criteria and required controls per tier
- [ ] Control matrix mapping each control to NIST AI RMF function, ISO 42001 area and AIGE principle
- [ ] Agent card for the auction assistant
- [ ] Threat model using OWASP LLM Top 10 with mitigations and owners
- [ ] List of controls enforced automatically by the platform, with evidence

**Graded on**

- Every control is testable and has an owner and evidence source
- Higher tiers add controls; low-risk use cases are not over-burdened
- Threat model covers indirect prompt injection via tools
