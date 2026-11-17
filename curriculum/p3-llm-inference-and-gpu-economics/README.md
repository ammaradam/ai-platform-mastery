# P3 · LLM inference and GPU economics

**Your current level:** Gap

## Goal

Reason from first principles about LLM serving performance and cost: why decode is memory-bound, how KV cache and batching shape throughput, which optimisations to apply, and how to size and price a deployment.

## Why this matters for you

This is the scarcest platform skill. Anyone can call an API; few can tell a CFO what self-hosting will cost per million tokens and defend the number.

## Modules

Total: ~32 hours

| Module | Hours | Quiz | Exercises |
|---|---|---|---|
| [P3M1 · Transformer inference arithmetic](p3m1-transformer-inference-arithmetic.md) | 8 | 7 Qs | 2 |
| [P3M2 · Serving engines: PagedAttention, continuous batching, prefix caching](p3m2-serving-engines-pagedattention-continuous-batching-prefix-caching.md) | 8 | 6 Qs | 2 |
| [P3M3 · Optimisation: quantisation, speculative decoding, FlashAttention](p3m3-optimisation-quantisation-speculative-decoding-flashattention.md) | 8 | 6 Qs | 2 |
| [P3M4 · Benchmarking, capacity planning and cost per token](p3m4-benchmarking-capacity-planning-and-cost-per-token.md) | 8 | 6 Qs | 2 |

## Capstone: Self-hosting vs API cost study

Deploy an open-weights model with vLLM on a single GPU, benchmark it under realistic load, and produce a cost model comparing self-hosting vs a managed API for a Pickles use case (e.g. the auction assistant).

**Deliverables**

- [ ] Benchmark results - TTFT, TPOT/ITL, throughput vs concurrency, at 2 quantisation levels
- [ ] Cost model spreadsheet (cost per 1M tokens vs utilisation)
- [ ] 2-page recommendation with break-even traffic level

**Graded on**

- Benchmark uses a realistic prompt/output length distribution, not one fixed prompt
- Cost model makes utilisation explicit and shows sensitivity
- Recommendation states when the decision would flip
