# P4 · Evals and observability for LLM and agent systems

**Your current level:** Gap

## Goal

Build evaluation systems that tell you, with evidence, whether an LLM or agent is good enough to ship, from error analysis and calibrated LLM judges to agent trajectory evals, production tracing and eval-gated releases, including for Malaysian language mixes.

## Why this matters for you

Your biggest gap and the highest-demand skill. It also connects your platform work (release gates) with your Malaysian LLM evals startup idea.

## Modules

Total: ~42 hours

| Module | Hours | Quiz | Exercises |
|---|---|---|---|
| [P4M1 · Eval fundamentals and error analysis](p4m1-eval-fundamentals-and-error-analysis.md) | 8 | 7 Qs | 3 |
| [P4M2 · LLM-as-judge: building judges you can trust](p4m2-llm-as-judge-building-judges-you-can-trust.md) | 8 | 7 Qs | 2 |
| [P4M3 · Evaluating RAG and agents](p4m3-evaluating-rag-and-agents.md) | 10 | 6 Qs | 3 |
| [P4M4 · Observability, online evals and eval-gated CI/CD](p4m4-observability-online-evals-and-eval-gated-ci-cd.md) | 8 | 6 Qs | 2 |
| [P4M5 · Multilingual and Malaysian-context evaluation](p4m5-multilingual-and-malaysian-context-evaluation.md) | 8 | 6 Qs | 2 |

## Capstone: Eval-gated release for a real agent

Build a complete eval system for the auction assistant (or a public stand-in): labelled dataset from error analysis, code-based checks, a calibrated LLM judge, agent trajectory checks, OpenTelemetry tracing, and a CI gate that blocks a regression, with a BM/Manglish slice.

**Deliverables**

- [ ] Failure taxonomy from error analysis of at least 100 traces
- [ ] Eval dataset (at least 150 cases, including a BM/Manglish slice) with provenance
- [ ] LLM judge with measured agreement (TPR/TNR) against your own labels
- [ ] CI workflow that fails on regression vs the current champion
- [ ] OTel-instrumented app with traces visible in a backend
- [ ] Public write-up (blog post) of what you learned

**Graded on**

- Judge validated on a held-out labelled set, with agreement reported honestly
- Metrics tied to failure modes found in data, not generic "helpfulness"
- The gate demonstrably catches an injected regression
