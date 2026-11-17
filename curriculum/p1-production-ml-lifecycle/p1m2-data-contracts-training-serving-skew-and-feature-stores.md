# P1M2 · Data contracts, training-serving skew and feature stores

**Pillar:** [Production ML lifecycle](README.md) · **Time:** ~8 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Define training-serving skew and its three root causes
- Design a data contract and decide where it is enforced
- Explain point-in-time correctness and why feature stores exist

## Lesson

## Training-serving skew
Skew is any difference between what the model saw in training and what it sees
in production. Three root causes:
1. **Code skew** — features computed by different code paths (a Spark job for
   training, a Python function at serving).
2. **Data skew** — the serving data distribution differs from training
   (often a symptom of a pipeline bug, not real-world drift).
3. **Time skew / leakage** — training rows used information that would not have
   been available at prediction time.

## Point-in-time correctness
When you join features to labels for training, each feature value must be the
value **as of the label's timestamp**, never later. Getting this wrong is label
leakage: offline metrics look great, production performance collapses. A
point-in-time (as-of) join is the fix; feature stores automate it.

## Feature stores
A feature store gives you: one feature definition used for both training and
serving; an **offline store** (history, for training via point-in-time joins);
an **online store** (latest values, low latency, for serving); and
materialisation jobs that keep them consistent. Uber's Michelangelo popularised
this; Feast is the main open-source option. A feature store is worth it when
several models share features or need low-latency online lookups — not for a
single batch model.

## Data contracts
A data contract is an explicit, versioned agreement between a data producer and
consumers: schema, types, nullability, allowed ranges, semantics, freshness SLA,
and an owner. The key design question is **where it is enforced**:
- at the producer (best — bad data never lands),
- at ingestion into your pipeline (good — fail fast),
- at training/serving time (last line of defence).
Contracts should fail loudly in CI and in pipelines, and changes should go
through versioning (additive changes are safe; renames and type changes are
breaking).

## Contract propagation
Your MLOps-Toolbox idea of propagating contracts from data → features → model →
API is exactly the staff-level move: the model signature becomes a contract that
serving validates against, so a schema change upstream fails a build, not a
customer request.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [Meet Michelangelo: Uber's Machine Learning Platform](https://www.uber.com/blog/michelangelo-machine-learning-platform/) — Uber Engineering, 2017 | blog | 25 min | The feature store section and why shared features matter. |
| **Required** | [Feast documentation — Concepts](https://docs.feast.dev/) — Feast | docs | 45 min | Offline vs online store, materialisation, point-in-time joins. |
| Optional | [Designing Machine Learning Systems (Ch. 4-5, 7)](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/) — Chip Huyen, O'Reilly 2022 | book | 120 min | Data leakage section in Ch. 5 is essential. |
| **Required** | [Rules of Machine Learning (Rules](https://developers.google.com/machine-learning/guides/rules-of-ml) — Martin Zinkevich, Google | guide | 20 min | Training-serving skew rules. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** Offline AUC is 0.95 but production performance is much worse. Training data was built by joining each auction to the latest available vehicle condition score. What is the most likely cause?

- A) Class imbalance
- B) Underfitting
- C) Point-in-time leakage — features came from after the label timestamp
- D) Concept drift

**Q2.** Which is NOT one of the three main root causes of training-serving skew?

- A) Using future information in training
- B) Different code paths for feature computation
- C) Different data distributions caused by pipeline bugs
- D) Using too many trees

**Q3.** When is a feature store most clearly justified?

- A) Any model using SQL
- B) A single nightly batch model
- C) Several models share features and some need low-latency online lookups
- D) When using deep learning

**Q4.** What is the main purpose of the online store?

- A) Store full feature history for training
- B) Version models
- C) Serve latest feature values with low latency at inference time
- D) Run point-in-time joins

**Q5.** Which data contract change is generally safe (non-breaking)?

- A) Removing a column
- B) Changing a column from int to string
- C) Renaming a column
- D) Adding a new nullable column

**Q6.** Where is the best place to enforce a data contract?

- A) In the dashboard
- B) Nowhere — monitor instead
- C) Only in the model
- D) At the producer, before data lands

<details><summary>Answers and explanations</summary>

- **Q1: C** — Joining to the latest value leaks future information; an as-of join on the label timestamp is required.
- **Q2: D** — Model complexity is unrelated to skew; skew is about mismatch between training and serving inputs.
- **Q3: C** — Feature stores pay off through reuse and consistent online/offline serving.
- **Q4: C** — The offline store holds history; the online store holds fresh values for serving.
- **Q5: D** — Additive, optional changes don't break existing consumers.
- **Q6: D** — Producer-side enforcement stops bad data entering the system; downstream checks are fallbacks.

</details>

## Exercises

### Point-in-time join from scratch (core)

Using pandas merge_asof, build a training set where each label row gets feature values as of its timestamp. Then deliberately build the leaky version and compare offline metrics.

**Deliverable:** Notebook showing both joins and the metric gap.

**Done when:**
- [ ] Leaky version shows inflated offline metrics
- [ ] Correct version uses only past feature values (assert it)

### Write a data contract (core)

Write a versioned contract (YAML or Pydantic/pandera) for Beacon's input table and enforce it in a pipeline step and in CI.

**Deliverable:** Contract file + failing test showing a breaking change is caught.

**Done when:**
- [ ] Includes owner, freshness SLA, ranges and nullability
- [ ] CI fails on a type change

### Feast quickstart with your data (stretch)

Run Feast locally with one Beacon feature view; retrieve historical features and materialise to the online store.

**Deliverable:** Repo folder with feature definitions and a short README.

**Done when:**
- [ ] Same feature definition serves both training and online retrieval

## Reflection

- Where in your pipelines would a silent upstream schema change hurt most today?
