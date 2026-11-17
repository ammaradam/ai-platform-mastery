# P4M4 · Observability, online evals and eval-gated CI/CD

**Pillar:** [Evals and observability for LLM and agent systems](README.md) · **Time:** ~8 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Instrument LLM and agent calls with OpenTelemetry GenAI conventions
- Run online evals and guardrails on production traffic
- Gate releases (prompts, models, configs) on eval results

## Lesson

## Tracing
An LLM app trace is a tree of spans: request → retrieval → LLM call(s) → tool
calls → response. OpenTelemetry's **GenAI semantic conventions** (still in
development status — check the current version) standardise attributes like
`gen_ai.operation.name`, `gen_ai.request.model`, `gen_ai.provider.name`, token
usage, and agent/tool spans. Using the standard means any backend (Application
Insights, Langfuse, Phoenix, Datadog…) can read your traces, and you avoid
vendor lock-in. Capture prompts and completions only where privacy rules allow
— the conventions say instrumentations must let you turn that off.

## What to measure in production
- Ops: latency (TTFT, total), errors, tokens and **cost per request/team**.
- Quality: online evals on a sample (cheap assertions on 100%, LLM judges on a
  sample), user feedback (thumbs, edits, retries, abandonment).
- Safety: guardrail triggers, PII detection, injection attempts.

## Offline ↔ online loop
Production traces → sampled for review → error analysis → new eval cases →
offline suite grows → release gate gets stronger. This flywheel is the single
most valuable thing an AI platform can provide.

## Eval-gated CI/CD
Treat prompts, model versions, retrieval configs and tool definitions as
**versioned artifacts**. Any change triggers:
1. Fast assertions (seconds) on every commit.
2. Full offline suite (minutes) on PRs — compare to **champion**; fail if any
   critical slice regresses beyond a threshold, with confidence intervals for
   small sets.
3. Shadow or canary in production with online evals before full rollout.
This is the LLM version of your champion-challenger gate (p1m3).

## Guardrails
Input and output checks around the model (topic filters, PII, injection
detectors, schema validation). They're part of the system — so evaluate their
false-positive and false-negative rates too.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [OpenTelemetry — Semantic conventions for generative AI systems](https://opentelemetry.io/docs/specs/semconv/gen-ai/) — OpenTelemetry | docs | 40 min | Spans for inference, agents and tools; the stability/transition note. |
| **Required** | [A Field Guide to Rapidly Improving AI Products](https://hamel.dev/blog/posts/field-guide/) — Hamel Husain | blog | 40 min | Data viewers, error analysis loop, empowering domain experts. |
| Optional | [Langfuse documentation — Tracing and evaluation](https://langfuse.com/docs) — Langfuse | docs | 30 min | An open-source example of trace + eval tooling. |
| Optional | [Azure AI Foundry — Observability and evaluation](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/observability) — Microsoft Learn | docs | 30 min | Map concepts to your current Foundry platform. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** Why use OpenTelemetry GenAI semantic conventions rather than custom attributes?

- A) They're faster
- B) They're mandatory
- C) They replace evals
- D) Standard attributes let any compatible backend read traces and avoid lock-in

**Q2.** What's a sensible online eval strategy for cost control?

- A) Cheap assertions on all traffic, LLM judges on a sample
- B) Human review of all traffic
- C) LLM judge on 100% of traffic
- D) No online evals

**Q3.** Which artifacts should trigger the eval suite when changed?

- A) Prompts, model versions, retrieval config and tool definitions
- B) Only datasets
- C) Only code
- D) Only model weights

**Q4.** Your eval set for a slice has 30 cases and the pass rate dropped 3 points. What's the right reaction?

- A) Delete the slice
- B) Consider confidence intervals — with 30 cases, 3 points may be noise
- C) Block immediately
- D) Ignore all small slices

**Q5.** What closes the offline-online loop?

- A) Dashboards alone
- B) Retraining weekly
- C) Sampling production traces into error analysis and turning findings into new eval cases
- D) Increasing temperature

**Q6.** GenAI conventions say instrumentations capturing prompt/completion content must...

- A) Allow it to be turned off
- B) Always capture it
- C) Encrypt it with RSA
- D) Send it to OpenAI

<details><summary>Answers and explanations</summary>

- **Q1: D** — Shared conventions make telemetry portable across tools.
- **Q2: A** — Tier evals by cost.
- **Q3: A** — Any of these change behaviour and should be versioned and gated.
- **Q4: B** — Small samples need statistical care; set thresholds accordingly or grow the slice.
- **Q5: C** — Production failures become regression tests.
- **Q6: A** — Content capture can expose sensitive data, so it must be optional.

</details>

## Exercises

### Instrument the agent (core)

Add OTel GenAI spans to an agent (MAF, PydanticAI or plain SDK). Export to Application Insights or Langfuse. Build a cost-per-request view.

**Deliverable:** Code + screenshot of a trace tree and cost chart.

**Done when:**
- [ ] Uses standard gen_ai.* attributes
- [ ] Tool calls appear as child spans

### Eval-gated PR workflow (core)

Create a GitHub Actions workflow that runs assertions + judge suite on PRs touching prompts/, compares to the champion results file, and fails on regression.

**Deliverable:** Workflow + a demo PR that gets blocked.

**Done when:**
- [ ] Gate output shows per-slice deltas

## Reflection

- What would your Foundry platform need to offer this to every team by default?
