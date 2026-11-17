# P1M4 · Monitoring, drift and incident response for ML

**Pillar:** [Production ML lifecycle](README.md) · **Time:** ~6 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Distinguish data drift, prediction drift and concept drift
- Choose drift metrics and alert thresholds that avoid alert fatigue
- Write SLOs and a runbook for an ML service

## Lesson

## Kinds of change
- **Data (covariate) drift**: P(X) changes: input distribution shifts (more
  flood-damaged cars after a storm).
- **Prediction drift**: the distribution of model outputs shifts. Often the
  earliest signal you can see.
- **Concept drift**: P(Y|X) changes: the relationship itself changes (same car,
  different price because the market moved). Only detectable with labels or
  proxies.
- **Label shift**: P(Y) changes.

## Metrics
- **PSI** (Population Stability Index): common in finance; rough guide: <0.1 no
  significant change, 0.1–0.25 moderate, >0.25 significant.
- **KS test**, **Wasserstein distance**, **Jensen-Shannon divergence** for
  numeric features; **chi-squared** for categoricals.
- Caution: with large samples, statistical tests flag tiny, irrelevant shifts as
  "significant". Prefer effect-size metrics with thresholds tuned on history.

## What to monitor (in priority order)
1. **Service health**: latency, errors, throughput (standard SRE).
2. **Data quality**: nulls, schema, ranges, freshness (cheapest, catches most
   incidents).
3. **Prediction distribution**: drift in outputs.
4. **Model quality**: once labels arrive (for auctions: when the hammer price
   is known), compute real error by segment.
5. **Business KPIs**: sell-through, margin.

## SLOs and incidents
An SLO is a target on a user-visible indicator (e.g. 99.5% of pricing requests
return in <300 ms; weekly MAPE on settled auctions < X%). The **error budget**
is the allowed failure; spending it fast triggers action. Your public-holiday
pricing incident is a classic: a calendar effect the model had not seen → good
postmortem material. Postmortems are **blameless** and end with owned, dated
actions.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [Data drift: ML in production guide](https://www.evidentlyai.com/ml-in-production/data-drift) — Evidently AI | guide | 30 min | Drift types and why statistical tests over-alert at scale. |
| **Required** | [Site Reliability Engineering: Ch. 4: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) — Google SRE book | book | 40 min | SLIs, SLOs, error budgets. |
| Optional | [SRE book: Ch. 15: Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) — Google SRE book | book | 25 min | Blameless postmortems. |
| Optional | [Designing Machine Learning Systems (Ch. 8)](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/) — Chip Huyen, O'Reilly 2022 | book | 60 min | Distribution shifts and monitoring. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** After a flood, many more water-damaged cars enter auction, but the price for a given car condition is unchanged. This is...

- A) Training-serving skew
- B) Data (covariate) drift
- C) Concept drift
- D) Label leakage

**Q2.** Market prices for EVs fall sharply while EV listings look the same as before. This is...

- A) Prediction drift only
- B) Data quality issue
- C) Concept drift
- D) Covariate drift

**Q3.** Why do KS tests often over-alert on large production datasets?

- A) They are biased
- B) They need labels
- C) They only work for categories
- D) With large samples, tiny irrelevant differences become statistically significant

**Q4.** A PSI of 0.3 on a key feature usually indicates...

- A) Significant shift worth investigating
- B) No change
- C) A bug in PSI
- D) Moderate change

**Q5.** Which monitoring layer typically catches the most ML incidents most cheaply?

- A) Quarterly model reviews
- B) Data quality checks (nulls, schema, freshness)
- C) Concept drift detection
- D) Business KPIs

**Q6.** What is an error budget?

- A) The allowed amount of unreliability implied by an SLO
- B) Monthly cloud budget
- C) Number of bugs allowed
- D) Money for incidents

<details><summary>Answers and explanations</summary>

- **Q1: B** — Input distribution P(X) changed; the relationship P(Y|X) did not.
- **Q2: C** — The relationship between features and target changed.
- **Q3: D** — Significance grows with sample size; use effect-size metrics and tuned thresholds.
- **Q4: A** — Common rule of thumb, above 0.25 is a significant shift.
- **Q5: B** — Most incidents are broken pipelines, not subtle drift.
- **Q6: A** — 1 minus the SLO target; spending it fast triggers reliability work.

</details>

## Exercises

### Drift dashboard on PriceCatcher (core)

Use Evidently (or your own code) on two time windows of PriceCatcher data; compute PSI and Wasserstein for key columns and tune thresholds on historical windows to cut false alarms.

**Deliverable:** Notebook + chosen thresholds with justification.

**Done when:**
- [ ] Thresholds justified by historical false-alarm rate

### SLOs and runbook for Beacon (core)

Define 3 SLOs (latency, availability, quality) and write a runbook for "prediction distribution shifted".

**Deliverable:** SLO doc + runbook with first 15 minutes of actions.

**Done when:**
- [ ] Each SLO has an SLI, target, window and owner

### Rewrite the public-holiday postmortem (stretch)

Rewrite your holiday pricing incident as a blameless postmortem using the SRE format.

**Deliverable:** Postmortem doc (reusable as an interview story).

**Done when:**
- [ ] Timeline, root cause, contributing factors, owned actions with dates

## Reflection

- Which of your monitors has ever woken someone up for nothing? Why?
