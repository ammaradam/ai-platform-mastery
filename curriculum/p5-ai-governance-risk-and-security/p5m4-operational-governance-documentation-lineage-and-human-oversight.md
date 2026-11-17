# P5M4 · Operational governance — documentation, lineage and human oversight

**Pillar:** [AI governance, risk and security](README.md) · **Time:** ~6 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Write model cards, datasheets and agent cards
- Design audit trails and lineage from data to decision
- Design meaningful human oversight

## Lesson

## Documentation artefacts
- **Model cards** (Mitchell et al., 2019) — intended use, out-of-scope use,
  training data summary, evaluation results disaggregated by relevant groups,
  ethical considerations, caveats.
- **Datasheets for datasets** (Gebru et al., 2018) — motivation, composition,
  collection, preprocessing, uses, distribution, maintenance.
- **Agent/system cards** — for LLM systems: purpose, model(s) and versions,
  tools and their permissions, data accessed, guardrails, eval results by slice,
  known limitations, owner, risk tier, escalation path.
Generate as much as possible **from the platform** (registry metadata, eval
runs) so cards don't rot.

## Lineage and audit trails
For any decision you should be able to answer: which model version, which
prompt version, which data/features, which tools were called with what
arguments, who approved the release, and what the user saw. Pieces: model
registry with lineage to data and code commit; versioned prompts; trace logs
with retention policy; release approvals recorded in CI.

## Human oversight that actually works
"Human in the loop" fails when reviewers rubber-stamp (**automation bias**).
Make it meaningful:
- Review only where it matters (risk-based sampling, low-confidence cases,
  consequential actions).
- Show the reviewer the evidence (sources, tool calls), not just the answer.
- Measure reviewer agreement and overturn rates; if overturns are ~0%, either
  the system is perfect or the review is theatre.
- Clear authority to stop or roll back the system.

## Incident management for AI
Define what counts as an AI incident (harmful output, data leak, major quality
regression), severity levels, who is paged, how to disable a feature (kill
switch / feature flag), and how incidents feed back into evals.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993) — Mitchell et al., 2019 | paper | 30 min | Card sections and disaggregated evaluation. |
| **Required** | [Datasheets for Datasets](https://arxiv.org/abs/1803.09010) — Gebru et al., 2018 | paper | 30 min | The question list — reuse it as a template. |
| Optional | [NIST AI RMF Playbook](https://airc.nist.gov/airmf-resources/playbook) — NIST | guide | 45 min | Suggested actions for Govern and Manage. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** What does "disaggregated evaluation" in a model card mean?

- A) Evaluating offline only
- B) Evaluating each layer
- C) Reporting results broken down by relevant groups or slices
- D) Removing outliers

**Q2.** Reviewers approve 99.9% of AI decisions without changes. What's the most likely concern?

- A) Latency
- B) Automation bias — review may be rubber-stamping
- C) Too many reviewers
- D) The model is perfect

**Q3.** Which is essential for an audit trail of an LLM decision?

- A) GPU type
- B) Developer name only
- C) Only the final answer
- D) Model version, prompt version, inputs, tool calls and release approval

**Q4.** How do you stop model and agent cards going stale?

- A) Store them in PDFs
- B) Annual review
- C) Generate them from platform metadata like the registry and eval runs
- D) Make them longer

**Q5.** What should an AI incident runbook include that a normal one might not?

- A) Retraining from scratch
- B) GPU restart
- C) Nothing extra
- D) A kill switch/feature flag and a step to add the failure to the eval suite

<details><summary>Answers and explanations</summary>

- **Q1: C** — Aggregate metrics can hide poor performance on specific groups.
- **Q2: B** — Near-zero overturns suggests oversight isn't meaningful; test it.
- **Q3: D** — You need to reconstruct how the output was produced and who approved the system.
- **Q4: C** — Automation keeps documentation in sync with reality.
- **Q5: D** — Disabling quickly and feeding incidents back into evals are AI-specific steps.

</details>

## Exercises

### Agent card (core)

Write an agent card for the auction assistant, generated from a YAML spec + eval results via a small script.

**Deliverable:** Template + generated card.

**Done when:**
- [ ] Includes tools, permissions, risk tier, eval slices and owner

### Lineage drill (core)

Pick one real prediction or agent response and reconstruct full lineage. Time it and list gaps.

**Deliverable:** Lineage report with time taken and gaps.

**Done when:**
- [ ] Gaps each have a proposed fix

## Reflection

- Could you answer an auditor's "why did the system say this?" within an hour today?
