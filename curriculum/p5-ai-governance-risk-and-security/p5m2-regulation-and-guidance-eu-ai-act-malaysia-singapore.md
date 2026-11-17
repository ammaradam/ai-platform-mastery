# P5M2 · Regulation and guidance — EU AI Act, Malaysia, Singapore

**Pillar:** [AI governance, risk and security](README.md) · **Time:** ~6 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Explain the EU AI Act's risk-based structure and current timeline
- Summarise Malaysia's AIGE guidelines and Singapore's GenAI framework
- Know when a Malaysian company is affected by the EU AI Act

## Lesson

## EU AI Act (Regulation (EU) 2024/1689)
Risk-based:
- **Prohibited practices** (e.g. social scoring, certain manipulative or
  exploitative systems, untargeted facial-image scraping) — banned since
  February 2025.
- **High-risk systems** — Annex III use cases (e.g. employment, education,
  credit scoring, critical infrastructure, law enforcement) and AI in regulated
  products (Annex I). Obligations: risk management, data governance, technical
  documentation, logging, transparency, human oversight, accuracy/robustness,
  conformity assessment, registration.
- **Transparency obligations** (Article 50) — e.g. telling people they're
  interacting with AI, marking AI-generated content.
- **General-purpose AI (GPAI) models** — obligations for model providers since
  August 2025, extra duties for systemic-risk models.
**Timeline update:** the 2026 Digital Omnibus on AI postponed high-risk
obligations — to 2 December 2027 for Annex III systems and 2 August 2028 for
Annex I product-embedded systems. Regulation changes; always check the current
text before advising.
**Extraterritorial reach:** it applies to providers placing AI on the EU market
and to providers/deployers outside the EU when the system's **output is used in
the EU**.

## Malaysia — National Guidelines on AI Governance & Ethics (AIGE)
Launched by MOSTI on 20 September 2024. **Voluntary.** Seven principles
(fairness; reliability, safety and control; privacy and security;
inclusiveness; transparency; accountability; pursuit of human benefit and
happiness) with guidance for three stakeholder groups: end users, policymakers,
and developers/technology providers. Malaysia's PDPA still applies to personal
data. Watch the National AI Office and the National AI Action Plan 2026–2030
for what comes next.

## Singapore — Model AI Governance Framework for Generative AI (2024)
From IMDA and the AI Verify Foundation; voluntary; **nine dimensions**:
accountability, data, trusted development and deployment, incident reporting,
testing and assurance, security, content provenance, safety and alignment R&D,
and AI for public good. AI Verify offers testing tools — practical reference for
regional companies.

## How to use this as an engineer
You don't need to be a lawyer. You need to (1) classify the use case, (2) know
which obligations attach, and (3) implement them as platform controls with
evidence. Get legal to confirm classification.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| Optional | [EU AI Act — official text, Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) — EUR-Lex | law | 60 min | Articles 5, 6, 9-15 and 50. Use the explorer below to navigate. |
| **Required** | [EU AI Act Explorer](https://artificialintelligenceact.eu/) — Future of Life Institute | guide | 45 min | High-level summary and the high-risk requirements. |
| **Required** | [The AI Act Implementation Timeline — What Changes Under the AI Omnibus?](https://fpf.org/?p=250371) — Future of Privacy Forum | guide | 15 min | Current dates after the Omnibus. |
| **Required** | [National Guidelines on AI Governance and Ethics (AIGE)](https://mastic.mosti.gov.my/publication/the-national-guidelines-on-ai-governance-ethics/) — MOSTI Malaysia, 2024 | guideline | 60 min | The seven principles and Part C (developers and technology providers). |
| **Required** | [Model AI Governance Framework for Generative AI](https://aiverifyfoundation.sg/) — IMDA & AI Verify Foundation, 2024 | framework | 45 min | The nine dimensions; testing and assurance section. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** Under the EU AI Act, AI used for credit scoring of individuals is generally classified as...

- A) Out of scope
- B) High-risk (Annex III)
- C) Minimal risk
- D) Prohibited

**Q2.** After the 2026 Digital Omnibus, when do obligations for stand-alone Annex III high-risk systems apply?

- A) Never
- B) 2 December 2027
- C) 2 August 2030
- D) 2 August 2026

**Q3.** A Malaysian company's AI system scores job applicants in Germany for a client. Can the EU AI Act apply?

- A) Yes — it applies when the output is used in the EU
- B) Only for GPAI
- C) No, it's a Malaysian company
- D) Only if hosted in the EU

**Q4.** Malaysia's AIGE guidelines are...

- A) Voluntary national guidelines with seven principles
- B) A copy of the EU AI Act
- C) A binding AI law with fines
- D) Only for government agencies

**Q5.** Telling users they are chatting with an AI system relates to which EU AI Act provision?

- A) Conformity assessment
- B) Prohibited practices
- C) Transparency obligations (Article 50)
- D) GPAI systemic risk

**Q6.** How many dimensions are in Singapore's Model AI Governance Framework for Generative AI?

- A) Nine
- B) Seven
- C) Four
- D) Twelve

<details><summary>Answers and explanations</summary>

- **Q1: B** — Creditworthiness assessment is an Annex III high-risk use case.
- **Q2: B** — Postponed from 2 August 2026 to 2 December 2027; Annex I embedded systems moved to 2 August 2028.
- **Q3: A** — The Act has extraterritorial reach based on where outputs are used.
- **Q4: A** — AIGE is voluntary and principle-based, launched by MOSTI in September 2024.
- **Q5: C** — Article 50 sets transparency duties for certain AI systems.
- **Q6: A** — Nine dimensions, from accountability to AI for public good.

</details>

## Exercises

### Classify five use cases (core)

For 5 Pickles-like use cases (pricing, auction assistant, damage detection, fraud flagging, HR screening), classify under the EU AI Act (if outputs reached the EU) and list obligations.

**Deliverable:** Classification table with reasoning.

**Done when:**
- [ ] Each classification cites the relevant article or annex

### AIGE principles to controls (core)

For each of the 7 AIGE principles, define one concrete, testable platform control.

**Deliverable:** Table of 7 controls.

**Done when:**
- [ ] Each control has an evidence source (log, report, test)

## Reflection

- Which of your projects would change design if it had EU users?
