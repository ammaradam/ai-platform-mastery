# P1M3 · Testing, CI/CD and release strategies for ML

**Pillar:** [Production ML lifecycle](README.md) · **Time:** ~8 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Use the ML Test Score rubric to assess production readiness
- Explain MLOps maturity levels and continuous training
- Choose between shadow, canary, A/B and blue-green releases for a model

## Lesson

## The ML Test Score
Breck et al. (Google) proposed 28 tests in four groups — **data**, **model
development**, **infrastructure**, and **monitoring** — with a final score taken
as the *minimum* of the four group scores. Using the minimum is deliberate: a
system is only as ready as its weakest area. Examples: feature expectations are
captured in a schema; model staleness impact is known; the full pipeline is
integration-tested; models can be rolled back; training and serving features are
checked for skew.

## MLOps maturity (Google's levels)
- **Level 0** — manual, notebook-driven, rare releases, no monitoring.
- **Level 1** — automated *training pipeline* with continuous training (CT),
  data and model validation inside the pipeline, a model registry.
- **Level 2** — CI/CD *of the pipeline itself*: pipeline code is tested, built
  and deployed automatically.
Key distinction: in ML you deploy a **pipeline that produces models**, not just a
model.

## Release strategies
- **Shadow** — new model receives a copy of live traffic; predictions are logged
  but not used. Zero user risk; validates latency, errors and prediction
  distribution. Cannot measure business impact.
- **Canary** — a small percentage of real traffic uses the new model; expand if
  healthy. Real impact on a few users; fast rollback.
- **A/B test** — randomised split to measure causal business impact with
  statistical power. Slow; needs enough traffic.
- **Blue-green** — two full environments; switch all traffic at once; instant
  rollback but no gradual exposure.
- **Interleaving / bandits** — common for ranking; out of scope here.

## Release gates
A gate is an automated check that blocks promotion: schema checks, offline
metric thresholds vs the champion, slice-level checks (no segment regresses by
more than X), latency and size budgets, and — for LLM systems — eval scores
(Pillar 4). Gates must compare against the **current champion**, not a fixed
number, or the bar slowly drifts down.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction](https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/) — Breck et al., Google 2017 | paper | 45 min | Memorise the four groups and how the final score is computed. |
| **Required** | [MLOps: Continuous delivery and automation pipelines in machine learning](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning) — Google Cloud Architecture Center | guide | 40 min | The differences between levels 0, 1 and 2. |
| Optional | [MLOps maturity model](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/mlops-maturity-model) — Microsoft Azure Architecture Center | guide | 20 min | Compare with Google's levels; place Pickles on both. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** How is the final ML Test Score computed?

- A) Sum of all 28 tests
- B) Minimum of the four group scores
- C) Maximum of the four group scores
- D) Average of the four group scores

**Q2.** What distinguishes Google MLOps Level 1 from Level 0?

- A) Using Kubernetes
- B) Using GPUs
- C) A/B testing
- D) An automated training pipeline with continuous training and validation

**Q3.** You want to verify a new model's latency and prediction distribution on live traffic with zero user impact. Which strategy?

- A) Canary
- B) Blue-green
- C) Shadow deployment
- D) A/B test

**Q4.** You need causal evidence that a new pricing model increases sell-through rate. Which strategy?

- A) A/B test with enough traffic for statistical power
- B) Offline backtest only
- C) Blue-green
- D) Shadow

**Q5.** Why should release gates compare against the current champion rather than a fixed threshold?

- A) Regulators require it
- B) It's faster
- C) Fixed thresholds let quality drift down over successive releases
- D) Champions never change

**Q6.** In mature MLOps, what is actually deployed to production?

- A) Only notebooks
- B) Only the feature store
- C) The training pipeline that produces models, plus the serving model
- D) Only the model file

<details><summary>Answers and explanations</summary>

- **Q1: B** — Taking the minimum means your weakest area defines readiness.
- **Q2: D** — Level 1 automates the training pipeline so models are retrained and validated automatically.
- **Q3: C** — Shadow mode mirrors traffic and logs predictions without serving them.
- **Q4: A** — Only a randomised experiment gives causal business impact.
- **Q5: C** — Relative gates prevent regressions; absolute gates only prevent disasters.
- **Q6: C** — Level 2 treats the pipeline itself as software that is built, tested and deployed.

</details>

## Exercises

### Champion-challenger gate (core)

Implement a CI step that loads the registered champion and a candidate, evaluates both on the same holdout, and fails if the candidate regresses overall or on any key slice by more than a set margin.

**Deliverable:** Script + CI config + a failing run screenshot.

**Done when:**
- [ ] Slice-level checks, not just global metric
- [ ] Gate reads thresholds from config, not code

### Release strategy decision record (core)

Write an ADR choosing a release strategy for the next Beacon model, covering risk, traffic, rollback and measurement.

**Deliverable:** ADR (max 1 page).

**Done when:**
- [ ] Considers at least 3 strategies with explicit trade-offs

## Reflection

- What is your current ML Test Score minimum group, honestly?
