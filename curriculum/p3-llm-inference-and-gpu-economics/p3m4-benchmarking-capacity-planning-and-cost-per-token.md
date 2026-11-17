# P3M4 · Benchmarking, capacity planning and cost per token

**Pillar:** [LLM inference and GPU economics](README.md) · **Time:** ~8 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Benchmark an LLM endpoint correctly under realistic load
- Convert throughput into cost per million tokens
- Find the break-even between self-hosting and an API

## Lesson

## Benchmark correctly
- Use a **realistic distribution** of input and output lengths from real or
  representative traffic, not one fixed prompt.
- Sweep **concurrency** (1, 2, 4 … 64+) and plot throughput vs latency
  percentiles (p50/p95/p99 TTFT and TPOT). The curve's knee is your operating
  point.
- Measure **goodput**: throughput where requests meet the SLO.
- Warm up first; separate cold-start from steady state.
- Tools: vLLM's benchmark scripts, NVIDIA GenAI-Perf, LLMPerf.

## Cost per million tokens
`cost per 1M tokens = (GPU hourly cost) / (tokens per second × 3600) × 1,000,000`

Example: a GPU at $4/hour sustaining 2,000 output tokens/s at your SLO:
4 / (2,000 × 3,600) × 1,000,000 ≈ **$0.56 per 1M output tokens** — at 100%
utilisation. At 25% average utilisation, effective cost is 4× higher
(~$2.22). **Utilisation is the whole game.** APIs charge per token so you pay
nothing when idle; self-hosting charges per hour.

## Break-even thinking
Self-hosting wins when traffic is high and steady, data must stay in your
environment, or you need a fine-tuned/custom model. APIs win for spiky or low
traffic, frontier-quality needs, and small teams (ops cost is real: on-call,
upgrades, security patching). Include engineer time in the model.

## Capacity planning
Required replicas ≈ peak tokens/s ÷ per-replica goodput, plus headroom (N+1
for failure, ~30% for spikes). Scale on queue depth / in-flight requests.
Consider autoscaling lag: model loading can take minutes — keep a warm minimum
or use faster loading (cached weights on local NVMe).

## Gateway layer
An AI gateway (APIM in your Foundry platform; LiteLLM or Envoy-based gateways
elsewhere) centralises auth, quotas, token metering per team, routing,
fallback between providers and caching — essential for chargeback.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [vLLM documentation — Benchmarking](https://docs.vllm.ai/) — vLLM | docs | 30 min | Benchmark serving script and its metrics. |
| Optional | [LLMPerf](https://github.com/ray-project/llmperf) — Ray Project | tool | 20 min | Load-testing method and metrics definitions. |
| **Required** | [LLM Inference Performance Engineering: Best Practices (revisit)](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices) — Databricks / MosaicML | blog | 15 min | Latency vs throughput trade-off and hardware comparisons. |
| **Required** | [Azure API Management — AI gateway capabilities](https://learn.microsoft.com/en-us/azure/api-management/genai-gateway-capabilities) — Microsoft Learn | docs | 25 min | Token limits, token metrics, semantic caching, load balancing. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** A GPU costs $2/hour and sustains 1,000 tokens/s at your SLO. Cost per 1M tokens at full utilisation?

- A) ~$56
- B) ~$0.06
- C) ~$5.60
- D) ~$0.56

**Q2.** The same deployment runs at 20% average utilisation. Effective cost per 1M tokens becomes...

- A) About 5× higher
- B) Lower
- C) About 20% higher
- D) Unchanged

**Q3.** Why benchmark across a concurrency sweep instead of one load level?

- A) To warm the cache
- B) Because tools require it
- C) To find the knee where latency rises sharply as throughput saturates
- D) To test networking

**Q4.** What is goodput?

- A) Throughput of requests that meet the latency SLO
- B) Throughput including failed requests
- C) Peak FLOPs
- D) Token accuracy

**Q5.** Which scenario most favours a managed API over self-hosting?

- A) Strict data residency on-prem
- B) Custom architecture
- C) High, steady traffic with a fine-tuned model
- D) Spiky, low-volume traffic needing frontier quality

**Q6.** What is a key role of an AI gateway for platform teams?

- A) Replacing evals
- B) Storing weights
- C) Central auth, quotas, per-team token metering, routing and fallback
- D) Training models

<details><summary>Answers and explanations</summary>

- **Q1: D** — 2 / (1,000 × 3,600) × 1,000,000 ≈ $0.56.
- **Q2: A** — You pay for the idle hours too; cost scales with 1/utilisation.
- **Q3: C** — The throughput-latency curve shows the best operating point.
- **Q4: A** — Raw throughput can hide SLO violations.
- **Q5: D** — Per-token pricing avoids paying for idle GPUs; frontier models may not be self-hostable.
- **Q6: C** — Gateways make shared LLM capacity governable and chargeable.

</details>

## Exercises

### Load test your vLLM endpoint (core)

Sweep concurrency 1-64 with a realistic length distribution; plot throughput vs p95 TTFT and p95 TPOT; mark the SLO-compliant operating point.

**Deliverable:** Charts + operating point.

**Done when:**
- [ ] Length distribution documented and justified

### Cost model (core)

Build a spreadsheet computing cost per 1M tokens vs utilisation (10-100%) for your measured goodput, and compare to 2 API prices. Add engineer time.

**Deliverable:** Spreadsheet + break-even chart.

**Done when:**
- [ ] Break-even utilisation clearly marked

## Reflection

- What utilisation would the auction assistant realistically have across a week?
