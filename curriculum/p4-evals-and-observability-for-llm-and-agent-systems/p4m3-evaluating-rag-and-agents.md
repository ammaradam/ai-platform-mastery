# P4M3 · Evaluating RAG and agents

**Pillar:** [Evals and observability for LLM and agent systems](README.md) · **Time:** ~10 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Evaluate retrieval and generation separately in RAG
- Evaluate agents on outcome, trajectory and tool use
- Handle non-determinism with multiple trials (pass@k, pass^k)

## Lesson

## RAG: split the problem
- **Retrieval** — did we fetch the right context? Metrics: recall@k,
  precision@k, MRR/nDCG against labelled relevant documents.
- **Generation** — given the context, is the answer **faithful/grounded**
  (claims supported by context) and **relevant/correct**?
Frameworks like RAGAS compute reference-free metrics (faithfulness, answer
relevance, context precision/recall) — useful starting points, but validate
them against your own labels before trusting them.

## Agents: transcript vs outcome
Anthropic's framing: the **transcript** is what the agent said and did; the
**outcome** is the final state of the environment (was the booking made? does
the code pass tests?). Grade outcomes where possible; grade transcripts for
process requirements (did it ask for confirmation before a payment? did it call
the right tool with valid arguments?).

## What to evaluate in agents
- **Task success** — outcome-based.
- **Tool use** — correct tool selection, valid arguments, handling errors.
- **Trajectory** — efficiency (steps, tokens, cost), loops, unnecessary calls.
- **Policy adherence** — e.g. τ-bench tests agents interacting with simulated
  users under domain policies (retail, airline).
- **Safety** — refuses out-of-policy actions; resists prompt injection from
  tool outputs.

## Non-determinism
Run each task multiple times (**trials**).
- **pass@k** — probability at least one of k attempts succeeds (capability).
- **pass^k** — probability *all* k attempts succeed (reliability). τ-bench
  showed pass^k drops sharply as k grows — agents that "can" do a task often
  can't do it consistently. For production, reliability is what users feel.

## Benchmarks vs product evals
Public benchmarks (SWE-bench, τ-bench, GAIA) tell you about models; they don't
tell you about *your* product. Use them to shortlist models, then rely on your
own evals.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) — Anthropic Engineering | blog | 30 min | Workflows vs agents; the evaluator-optimizer pattern. |
| **Required** | [Demystifying evals for AI agents (agent-specific sections)](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — Anthropic Engineering | blog | 30 min | Agent-type-specific strategies; transcripts vs outcomes. |
| **Required** | [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045) — Yao et al., 2024 | paper | 40 min | pass^k and policy-following evaluation. |
| Optional | [RAGAS: Automated Evaluation of Retrieval Augmented Generation](https://arxiv.org/abs/2309.15217) — Es et al., 2023 | paper | 30 min | Faithfulness and relevance metrics definitions. |
| Optional | [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770) — Jimenez et al., 2023 | paper | 30 min | Outcome-based grading via tests. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** A RAG answer is wrong. What should you check first to localise the failure?

- A) Token count
- B) The UI
- C) Whether the retrieved context contained the needed information
- D) The temperature

**Q2.** "The agent's final environment state" is called the...

- A) Rubric
- B) Trajectory
- C) Outcome
- D) Transcript

**Q3.** An agent succeeds on a task in 3 of 5 runs. Which metric captures how often it succeeds on every run?

- A) pass^k
- B) Recall@k
- C) pass@k
- D) BLEU

**Q4.** Why does τ-bench emphasise pass^k?

- A) It's cheaper
- B) pass@k is undefined
- C) Regulators require it
- D) Agents that can solve a task often fail to solve it consistently

**Q5.** Which is a transcript-level requirement rather than an outcome?

- A) Agent asked user to confirm before charging the card
- B) Tests pass
- C) Booking exists in DB
- D) File was created

**Q6.** How should you use public benchmarks like SWE-bench for a product decision?

- A) Ignore them
- B) Only for marketing
- C) To shortlist models, then evaluate on your own product evals
- D) As the final acceptance test

<details><summary>Answers and explanations</summary>

- **Q1: C** — Separate retrieval failures from generation failures.
- **Q2: C** — Outcome = final state; transcript = what the agent said and did.
- **Q3: A** — pass^k measures consistent success across k trials.
- **Q4: D** — Reliability drops sharply with k, which users experience directly.
- **Q5: A** — Process constraints are graded from the transcript.
- **Q6: C** — Benchmarks measure models, not your product's tasks.

</details>

## Exercises

### Retrieval eval set (core)

For a RAG system over Pickles help/FAQ docs (or public docs), label 50 questions with relevant chunks. Compute recall@5 and MRR for two retrieval configs.

**Deliverable:** Labelled set + comparison.

**Done when:**
- [ ] Labels created before looking at retrieval results

### Agent trials harness (core)

Write a harness that runs each agent task 5 times, grades outcomes with code, and reports pass@1, pass@5 and pass^5.

**Deliverable:** Harness code + report on 20 tasks.

**Done when:**
- [ ] Environment reset between trials

### Injection resilience test (stretch)

Add 10 tasks where a tool result contains an injected instruction; grade whether the agent follows it.

**Deliverable:** Test cases + results.

**Done when:**
- [ ] Each case has a clear pass/fail criterion

## Reflection

- Which of your agent's behaviours would users notice most if it became inconsistent?
