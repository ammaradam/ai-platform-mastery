# P1M1 · ML systems and hidden technical debt

**Pillar:** [Production ML lifecycle](README.md) · **Time:** ~6 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Name the main forms of ML technical debt and spot them in a real system
- Explain why ML code is a small fraction of a production ML system
- Apply the most important Rules of ML to a new project

## Lesson

## The core idea
In 2015 Google's *Hidden Technical Debt in Machine Learning Systems* made one
picture famous: a tiny box labelled "ML code" surrounded by much bigger boxes —
configuration, data collection, feature extraction, data verification, serving
infrastructure, monitoring, process management. The point: **most of the cost
and risk of an ML system lives outside the model.**

## Debt patterns you must be able to name
- **Entanglement (CACE)** — *Changing Anything Changes Everything*. Features
  interact, so adding, removing or rescaling one input can shift the whole
  model's behaviour. You cannot make isolated improvements.
- **Correction cascades** — model B is trained on model A's output to "fix"
  a new case. Now improving A can break B.
- **Undeclared consumers** — other systems silently read your predictions or
  log files. You change the model; their behaviour changes; nobody knows why.
- **Unstable data dependencies** — an input signal owned by another team
  changes meaning or distribution without notice.
- **Underutilised data dependencies** — features that add almost nothing but
  still add breakage risk (legacy, bundled, epsilon features).
- **Feedback loops** — direct (the model picks the data it learns from, like a
  recommender) and hidden (two systems influence each other through the world).
  Pricing models are especially prone: your predicted price shifts seller
  behaviour, which shifts future prices.
- **Glue code and pipeline jungles** — large amounts of code exist only to
  move data in and out of generic packages; pipelines grow by accretion.
- **Dead experimental codepaths** and **configuration debt** — configuration
  often outgrows code and is rarely tested.

## Rules of ML worth memorising
From Martin Zinkevich's *Rules of Machine Learning* (Google):
- Rule #1: Don't be afraid to launch a product without ML.
- Rule #4: Keep the first model simple and get the infrastructure right.
- Rule #5: Test the infrastructure independently from the ML.
- Rule #29: The best way to make sure you train like you serve is to save the
  set of features used at serving time and pipe them to a log for training.
- Rule #32: Re-use code between your training pipeline and serving pipeline.

## How a staff engineer uses this
When you review a system, walk the "boxes" around the ML code and ask, for each:
*who owns it, how is it tested, what happens when it silently changes?* That
question list is your review template for the capstone.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html) — Sculley et al., NeurIPS 2015 | paper | 45 min | Sections 2-8. Make a one-line definition for every debt type. |
| **Required** | [Rules of Machine Learning](https://developers.google.com/machine-learning/guides/rules-of-ml) — Martin Zinkevich, Google | guide | 60 min | Phases I and II; note which rules Beacon already follows. |
| Optional | [Designing Machine Learning Systems (Ch. 1-2)](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/) — Chip Huyen, O'Reilly 2022 | book | 90 min | How ML systems differ from traditional software. |
| Optional | [Operationalizing Machine Learning: An Interview Study](https://arxiv.org/abs/2209.09125) — Shankar et al., 2022 | paper | 40 min | The "three Vs" (velocity, validation, versioning) and pain points. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** A team adds a new feature to a pricing model and accuracy on one vehicle segment drops while others improve. Which debt pattern best explains this?

- A) Dead experimental codepaths
- B) CACE / entanglement
- C) Glue code
- D) Undeclared consumers

**Q2.** Model B is trained on Model A's output to handle a new region. What risk does this create?

- A) Correction cascade — improving A can degrade B
- B) Training-serving skew
- C) Config debt
- D) Label leakage

**Q3.** Your pricing predictions are being read directly from a log table by the finance team's dashboard without your knowledge. This is an example of...

- A) Pipeline jungle
- B) Undeclared consumer
- C) Unstable data dependency
- D) Feedback loop

**Q4.** According to Rules of ML, what is the best way to ensure you train like you serve?

- A) Retrain daily
- B) Freeze the feature list
- C) Log the features used at serving time and use them for training
- D) Use the same model architecture

**Q5.** Why are pricing models particularly exposed to hidden feedback loops?

- A) They retrain too often
- B) They use LightGBM
- C) They use tabular data
- D) Predicted prices influence seller and buyer behaviour, which becomes future training data

**Q6.** Which statement best captures the central message of the Sculley et al. paper?

- A) Testing ML is impossible
- B) Feature stores eliminate debt
- C) ML code is a small part of a real system; most risk sits in surrounding infrastructure
- D) Deep learning reduces debt

<details><summary>Answers and explanations</summary>

- **Q1: B** — Changing one input shifts learned interactions across the whole model, so improvements are not isolated.
- **Q2: A** — Stacking a corrective model on another creates a dependency where upstream improvements break downstream behaviour.
- **Q3: B** — Anyone consuming your outputs without a contract is an undeclared consumer; your changes silently change their results.
- **Q4: C** — Rule
- **Q5: D** — The model's outputs change the world that generates its future labels.
- **Q6: C** — The famous diagram shows ML code as a small box among much larger infrastructure components.

</details>

## Exercises

### Debt audit of Beacon (core)

Draw Beacon's full system (all boxes around the model). For each box list owner, test coverage and what happens if it silently changes.

**Deliverable:** One diagram + a table of at least 8 debt items mapped to Sculley's categories.

**Done when:**
- [ ] Every item names a concrete component, not a generic risk
- [ ] At least one feedback loop identified and explained

### Rules of ML scorecard (stretch)

Score your current platform against Rules

**Deliverable:** Scorecard table + 3 short proposals.

**Done when:**
- [ ] Each proposal states effort in days and the failure it prevents

## Reflection

- Which debt type has actually cost you a production incident? What would have caught it earlier?
