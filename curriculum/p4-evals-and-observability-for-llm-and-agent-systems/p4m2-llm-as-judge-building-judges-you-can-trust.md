# P4M2 · LLM-as-judge — building judges you can trust

**Pillar:** [Evals and observability for LLM and agent systems](README.md) · **Time:** ~8 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Know the documented biases of LLM judges
- Build a judge with critique shadowing and measure agreement
- Report judge quality with TPR/TNR and correct the observed pass rate

## Lesson

## Why judges need validation
An LLM judge is itself a model making predictions. Zheng et al. (MT-Bench /
Chatbot Arena) showed strong judges can agree with humans at levels similar
to human-human agreement — but also documented biases:
- **Position bias** — favouring the first (or second) answer in pairwise
  comparisons. Mitigate by swapping order and requiring consistency.
- **Verbosity bias** — preferring longer answers.
- **Self-enhancement bias** — favouring outputs from the same model family.
- Limited ability to grade maths/reasoning it can't do itself.

## Critique shadowing (Hamel Husain)
1. Find the **principal domain expert** (one person whose judgment defines
   "good").
2. Build a diverse dataset of real and synthetic interactions.
3. The expert gives **pass/fail + a written critique** for each.
4. Fix obvious errors in the product first.
5. Build the judge prompt using expert critiques as few-shot examples.
6. Measure agreement with the expert on held-out data; iterate the prompt.
7. Use error analysis to create narrower, specialised judges where needed.

## Measure the judge like a classifier
Treat expert labels as ground truth. Split into train (few-shot examples),
dev (iterate), and test (final report). Report:
- **TPR** (true positive rate) — of truly passing outputs, how many the judge
  passes.
- **TNR** (true negative rate) — of truly failing outputs, how many the judge
  fails.
Raw accuracy hides problems when classes are imbalanced (e.g. 90% pass).

## Correcting the pass rate
With known TPR and TNR, the observed judge pass rate p_obs can be corrected:
`p_true ≈ (p_obs + TNR − 1) / (TPR + TNR − 1)`.
Example: TPR 0.9, TNR 0.8, observed 0.75 → (0.75 + 0.8 − 1)/(0.9 + 0.8 − 1)
= 0.55/0.7 ≈ 0.79.

## Criteria drift
Shankar et al. ("Who Validates the Validators?") found people's evaluation
criteria change as they grade outputs — you discover what "good" means by
looking. So judge building is iterative, and criteria must be re-checked when
the product changes.

## Practical rules
One judge per failure mode, binary output, ask for reasoning before the
verdict, use a strong model, pin the judge model version, and re-validate after
any judge-prompt or model change.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [Using LLM-as-a-Judge For Evaluation: A Complete Guide](https://hamel.dev/blog/posts/llm-judge/) — Hamel Husain | blog | 45 min | Critique shadowing steps and measuring agreement. |
| **Required** | [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685) — Zheng et al., NeurIPS 2023 | paper | 45 min | Section on judge biases and agreement with humans. |
| **Required** | [Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences](https://arxiv.org/abs/2404.12272) — Shankar et al., 2024 | paper | 40 min | Criteria drift. |
| Optional | [Evaluating the Effectiveness of LLM-Evaluators (aka LLM-as-Judge)](https://eugeneyan.com/writing/llm-evaluators/) — Eugene Yan | blog | 60 min | Survey of judge techniques and when they work. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** In pairwise judging, the judge prefers whichever answer is shown first. This is...

- A) Verbosity bias
- B) Self-enhancement bias
- C) Criteria drift
- D) Position bias

**Q2.** Your test set has 90% passing outputs. Why is raw judge accuracy misleading?

- A) A judge that always says pass gets 90% accuracy while catching zero failures
- B) Accuracy can't be computed
- C) It isn't
- D) It ignores latency

**Q3.** TPR = 0.9, TNR = 0.8, observed judge pass rate = 0.75. Corrected true pass rate?

- A) ~0.55
- B) ~0.68
- C) ~0.94
- D) ~0.79

**Q4.** What is criteria drift?

- A) The judge model changes version
- B) Human evaluation criteria evolve as people look at more outputs
- C) Scores trend upward
- D) Data drift in inputs

**Q5.** In critique shadowing, what does the domain expert provide?

- A) 1-5 scores
- B) Only rewrites
- C) Prompts
- D) Pass/fail decisions with written critiques

**Q6.** Which practice improves judge reliability?

- A) Hiding reasoning
- B) One mega-judge scoring 10 dimensions
- C) One narrow judge per failure mode with binary output
- D) Changing the judge model often

**Q7.** Why keep a separate test split of expert labels when tuning the judge prompt?

- A) To avoid overfitting the prompt to examples you iterated on
- B) To save tokens
- C) Regulations
- D) For latency

<details><summary>Answers and explanations</summary>

- **Q1: D** — Mitigate by swapping order and only counting consistent verdicts.
- **Q2: A** — Report TPR and TNR so failure detection is visible.
- **Q3: D** — (0.75 + 0.8 − 1) / (0.9 + 0.8 − 1) = 0.55 / 0.7 ≈ 0.79.
- **Q4: B** — Shankar et al. found graders refine what they consider good while grading.
- **Q5: D** — Critiques become few-shot examples for the judge.
- **Q6: C** — Narrow binary judges are easier to validate and debug.
- **Q7: A** — Same logic as ML — report on data you didn't tune against.

</details>

## Exercises

### Calibrated judge for your top failure (core)

Label 120 outputs pass/fail with critiques for your top failure mode. Split train/dev/test. Build a judge, iterate on dev, report TPR/TNR on test.

**Deliverable:** Judge prompt + labelled data + agreement report.

**Done when:**
- [ ] TPR and TNR reported on held-out test
- [ ] Corrected pass rate computed

### Bias probe (stretch)

Measure position bias by running pairwise comparisons in both orders on 50 pairs; report consistency rate.

**Deliverable:** Results table.

**Done when:**
- [ ] Inconsistent cases analysed

## Reflection

- Where did your own criteria change while labelling?
