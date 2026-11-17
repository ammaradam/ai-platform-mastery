# P4M1 · Eval fundamentals and error analysis

**Pillar:** [Evals and observability for LLM and agent systems](README.md) · **Time:** ~8 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Define evals, graders and the three eval levels
- Run error analysis (open coding → axial coding → failure taxonomy)
- Choose metrics from observed failures, not from a generic list

## Lesson

## What an eval is
An eval is a test for an AI system: an **input/task**, the system's
**output** (or full transcript), and **grading logic**. Graders come in three
kinds: **code-based** (assertions, regex, schema checks, exact match, unit
tests on generated code), **model-based** (LLM-as-judge), and **human**.
Prefer code where possible: cheap, fast, deterministic.

## Three levels (Hamel Husain's framing)
1. **Unit tests / assertions** — run on every change; cheap.
2. **Human and model evaluation** — on sampled traces; periodic.
3. **A/B testing** — real users; for significant changes.

## Error analysis is the core skill
Before writing any metric, **look at your data**:
1. Collect 50–100+ real or realistic traces.
2. **Open coding** — read each, write free-text notes on what went wrong.
   Focus on the first upstream failure in a trace.
3. **Axial coding** — group notes into a small set of failure categories
   (e.g. "wrong auction date", "ignores lot condition", "replies in English to
   a BM question", "hallucinated fee").
4. Count them. Fix the obvious ones directly (prompt or code); build evals
   for the persistent, important ones.
5. Repeat as the product changes.
Generic metrics like "helpfulness 1–5" or off-the-shelf "faithfulness" scores
rarely track what actually breaks in *your* product.

## Datasets
- Start from real traces; add **synthetic inputs** by varying dimensions
  (persona × feature × scenario) — generate inputs, not expected outputs.
- Keep provenance and version datasets like code.
- Separate **capability evals** (can it do hard new things — expected pass
  rate lower) from **regression evals** (it used to work — expected ~100%).

## Binary beats scales
Pass/fail judgments with a written critique are more reliable and actionable
than 1–5 scales, where nobody agrees what a "3" means.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/) — Hamel Husain | blog | 40 min | The three levels of evals and "look at your data". |
| **Required** | [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — Anthropic Engineering | blog | 30 min | Tasks, trials, transcripts, outcomes, graders; capability vs regression evals. |
| **Required** | [What We Learned from a Year of Building with LLMs](https://applied-llms.org/) — Yan, Bischof, Frye, Husain, Liu, Shankar | guide | 60 min | Tactical section on evaluation and monitoring. |
| Optional | [AI Engineering (Ch. 3-4 — Evaluation)](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) — Chip Huyen, O'Reilly 2025 | book | 120 min | Evaluation methodology and evaluating AI systems. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** What should you do before choosing eval metrics for a new LLM feature?

- A) Pick standard metrics like BLEU
- B) Use a public benchmark
- C) Ask the model to evaluate itself
- D) Run error analysis on real traces to find actual failure modes

**Q2.** In error analysis, "axial coding" means...

- A) Grouping notes into a small set of failure categories
- B) Training a classifier
- C) Writing free-text notes per trace
- D) Labelling with 1-5 scores

**Q3.** Which grader type should you prefer when it can do the job?

- A) User surveys
- B) LLM-as-judge
- C) Human
- D) Code-based assertion

**Q4.** When generating synthetic eval data, what should the LLM generate?

- A) Only refusals
- B) Only scores
- C) Both inputs and expected outputs
- D) Realistic user inputs across dimensions; outputs come from your system

**Q5.** A regression eval suite should have an expected pass rate of...

- A) Doesn't matter
- B) ~0%
- C) ~50%
- D) ~100% — these used to work

**Q6.** Why are binary pass/fail judgments usually preferred over 1-5 scales?

- A) LLMs can't output numbers
- B) They're shorter
- C) They're more consistent and actionable; scale points are ambiguous
- D) Regulators require them

**Q7.** During open coding, what should you focus on in a multi-step trace?

- A) Token count
- B) The last error
- C) Latency
- D) The first upstream failure

<details><summary>Answers and explanations</summary>

- **Q1: D** — Metrics should come from observed failures in your product.
- **Q2: A** — Open coding produces notes; axial coding clusters them into a taxonomy.
- **Q3: D** — Code-based checks are cheap, fast and deterministic.
- **Q4: D** — Generating expected outputs bakes in the model's own errors.
- **Q5: D** — Regression evals protect existing behaviour; capability evals measure progress on hard tasks.
- **Q6: C** — Different evaluators read "3 vs 4" differently; binary + critique is clearer.
- **Q7: D** — Downstream errors often cascade from the first failure.

</details>

## Exercises

### Error analysis on 100 traces (core)

Collect 100 traces from the auction assistant (or a public agent you build). Open-code each, axial-code into 5-10 categories, and count.

**Deliverable:** Spreadsheet of notes + failure taxonomy with counts.

**Done when:**
- [ ] Categories are specific to the product, not generic
- [ ] Top 3 failures each have an example trace

### Simple trace viewer (core)

Build a tiny web or Streamlit viewer that shows a trace and lets you add a pass/fail + note, saved to a file.

**Deliverable:** Viewer code.

**Done when:**
- [ ] Reviewing a trace takes under 30 seconds

### First assertions (core)

Turn the 3 most common deterministic failures into code assertions and run them over all traces.

**Deliverable:** Assertion module + pass rates.

**Done when:**
- [ ] Each assertion links to a failure category

## Reflection

- What surprised you most in the traces compared to your expectations?
