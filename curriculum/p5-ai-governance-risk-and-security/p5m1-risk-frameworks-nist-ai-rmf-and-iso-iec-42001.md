# P5M1 · Risk frameworks — NIST AI RMF and ISO/IEC 42001

**Pillar:** [AI governance, risk and security](README.md) · **Time:** ~6 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Explain the four NIST AI RMF functions and the GenAI Profile
- Explain what an AI management system (ISO/IEC 42001) is
- Design a risk-tiering scheme for an organisation

## Lesson

## NIST AI Risk Management Framework (AI RMF 1.0, 2023)
Voluntary US framework. Four functions:
- **Govern** — culture, policies, roles, accountability (cross-cutting).
- **Map** — understand context, intended use, stakeholders, risks.
- **Measure** — assess and track risks with metrics (evals live here).
- **Manage** — prioritise, respond to, and monitor risks.
It also describes characteristics of trustworthy AI: valid and reliable; safe;
secure and resilient; accountable and transparent; explainable and
interpretable; privacy-enhanced; fair with harmful bias managed.
The **Generative AI Profile (NIST AI 600-1, 2024)** applies the RMF to GenAI
and lists GenAI-specific risks such as confabulation, information integrity,
information security, harmful bias, data privacy and IP.

## ISO/IEC 42001:2023
The first international **management system** standard for AI — like ISO 27001
but for AI. It specifies requirements for establishing, implementing,
maintaining and continually improving an AI management system (AIMS):
policy, roles, risk assessment, AI impact assessment, controls (Annex A),
monitoring, internal audit, management review. It is **certifiable**, which is
why enterprises and vendors care.

## Risk tiering — the practical bridge
Not every use case needs the same controls. A tiering scheme uses criteria
like: impact on individuals' rights or finances, autonomy (advice vs action),
audience (internal vs public), reversibility, data sensitivity, and scale.
Example:
- **Tier 1 (low)** — internal productivity, human reviews all outputs.
  Controls: basic evals, logging.
- **Tier 2 (medium)** — customer-facing information (auction assistant).
  Adds: eval gate, guardrails, monitoring, incident process, agent card.
- **Tier 3 (high)** — decisions affecting people's money or rights (credit,
  hiring) or autonomous actions. Adds: human oversight, bias testing,
  independent review, sign-off, audit trail.
The platform's job: make Tier-2 controls the default golden path.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) — NIST | framework | 90 min | Core functions and trustworthy AI characteristics. |
| **Required** | [NIST AI 600-1: Generative AI Profile](https://doi.org/10.6028/NIST.AI.600-1) — NIST, 2024 | framework | 60 min | The list of GenAI risks and suggested actions. |
| **Required** | [ISO/IEC 42001:2023 — AI management systems](https://www.iso.org/standard/81230.html) — ISO | standard | 20 min | Scope and structure (full text is paid; read overview and a summary). |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** Which NIST AI RMF function is cross-cutting and covers policies, roles and accountability?

- A) Govern
- B) Measure
- C) Manage
- D) Map

**Q2.** Running evals and tracking risk metrics maps mainly to which function?

- A) Govern
- B) Map
- C) Measure
- D) Manage

**Q3.** What makes ISO/IEC 42001 different from the NIST AI RMF?

- A) It's a certifiable management-system standard
- B) It's only for the US
- C) It's legally binding in the EU
- D) It only covers GenAI

**Q4.** "Confabulation" in the NIST GenAI Profile refers to...

- A) Data poisoning
- B) Confidently stated false content (hallucination)
- C) Model theft
- D) Prompt injection

**Q5.** What is the main benefit of a risk-tiering scheme?

- A) Avoiding regulation
- B) Controls proportional to risk, so low-risk use cases aren't over-burdened
- C) Faster GPUs
- D) Fewer models

**Q6.** An agent that autonomously executes refunds to customers is most likely which tier in the example scheme?

- A) Exempt
- B) Tier 1
- C) Tier 2
- D) Tier 3

<details><summary>Answers and explanations</summary>

- **Q1: A** — Govern underpins the other three functions.
- **Q2: C** — Measure covers assessment and tracking of risks.
- **Q3: A** — 42001 specifies requirements for an AI management system that can be audited and certified.
- **Q4: B** — NIST uses confabulation for erroneous or false content presented confidently.
- **Q5: B** — Proportionality keeps governance credible and adoptable.
- **Q6: D** — Autonomous financial actions affecting people warrant the highest tier.

</details>

## Exercises

### Risk-tiering policy (core)

Write a one-page tiering policy for Pickles with criteria, 3 tiers and required controls per tier. Classify 5 real or planned use cases.

**Deliverable:** Policy + classification table.

**Done when:**
- [ ] Each tier's controls are concrete and testable

### Map controls to NIST functions (core)

List 15 controls your platform has or should have and map each to Govern/Map/Measure/Manage.

**Deliverable:** Mapping table (seed for the capstone control matrix).

**Done when:**
- [ ] At least 3 controls per function

## Reflection

- Which controls in your platform exist only on paper?
