# P3M1 · Transformer inference arithmetic

**Pillar:** [LLM inference and GPU economics](README.md) · **Time:** ~8 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Explain prefill vs decode and why decode is memory-bandwidth bound
- Estimate KV cache size for a model and context length
- Estimate memory and latency lower bounds from first principles

## Lesson

## Two phases
- **Prefill** — process the whole prompt in parallel. Large matrix-matrix
  multiplies → **compute-bound**. Dominates **time to first token (TTFT)**.
- **Decode** — generate one token at a time per sequence. Each step must read
  all model weights from GPU memory to produce just one token per sequence →
  **memory-bandwidth-bound** at small batch sizes. Dominates **time per output
  token (TPOT)**, a.k.a. inter-token latency.

## The key back-of-envelope
At batch size 1, a decode step reads every weight once. A 7B model in FP16 is
~14 GB. On a GPU with ~2 TB/s memory bandwidth, the floor is roughly
14 GB / 2 TB/s ≈ 7 ms per token, no matter how many FLOPs the GPU has.
**Batching** amortises that weight read across many sequences, which is why
throughput rises with batch size until compute becomes the limit.

## Arithmetic intensity
FLOPs per byte moved. Each GPU has a ratio (peak FLOPs / bandwidth). Below it
you're memory-bound; above it, compute-bound. Decode at small batch is far
below; prefill is above.

## KV cache
To avoid recomputing attention over past tokens, each layer stores keys and
values for every token. Size per token:

`2 (K and V) × layers × kv_heads × head_dim × bytes_per_value`

Example (Llama-2-7B-like: 32 layers, 32 KV heads, head_dim 128, FP16 = 2 bytes):
2 × 32 × 32 × 128 × 2 = 524,288 bytes ≈ **0.5 MB per token**. A 4,096-token
sequence ≈ 2 GB. KV cache — not weights — usually limits how many concurrent
requests you can serve. **Grouped-query attention (GQA)** cuts KV heads (e.g.
8 instead of 32), shrinking the cache 4×.

## Memory budget
GPU memory = weights + KV cache + activations/overhead. Weights: params ×
bytes (FP16 = 2, INT8 = 1, INT4 = 0.5). A 70B model in FP16 (~140 GB) doesn't
fit on one 80 GB GPU → tensor parallelism across GPUs, or quantisation.

## Metrics vocabulary
TTFT, TPOT/ITL, end-to-end latency = TTFT + TPOT × (output tokens − 1),
throughput (tokens/s across all users), goodput (throughput that meets the
latency SLO).

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [Transformer Inference Arithmetic](https://kipp.ly/transformer-inference-arithmetic/) — kipply | blog | 60 min | KV cache sizing, memory vs compute bound, the latency calculations. |
| **Required** | [LLM Inference Performance Engineering: Best Practices](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices) — Databricks / MosaicML | blog | 30 min | TTFT/TPOT definitions, memory bandwidth utilisation, batch-size trade-offs. |
| Optional | [Large Transformer Model Inference Optimization](https://lilianweng.github.io/posts/2023-01-10-inference-optimization/) — Lilian Weng | blog | 60 min | Survey of optimisation methods; good map for p3m3. |
| Optional | [AI Engineering (Ch. 9 — Inference Optimization)](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) — Chip Huyen, O'Reilly 2025 | book | 90 min | Practitioner framing of latency, throughput and cost. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** Why is decode memory-bandwidth bound at small batch sizes?

- A) Every step reads all weights to produce one token per sequence, so little compute per byte moved
- B) Tokenisation is slow
- C) The KV cache is on CPU
- D) Attention is quadratic

**Q2.** Which phase dominates time to first token?

- A) Prefill
- B) Decode
- C) Sampling
- D) Detokenisation

**Q3.** KV cache per token for 32 layers, 8 KV heads, head_dim 128, FP16?

- A) ~32 KB
- B) ~2 MB
- C) ~512 KB
- D) ~128 KB

**Q4.** A 7B FP16 model on a GPU with 2 TB/s bandwidth at batch size 1. Approximate floor on time per output token?

- A) ~70 ms
- B) ~0.7 ms
- C) ~7 ms
- D) ~700 ms

**Q5.** What usually limits the number of concurrent sequences on a GPU during serving?

- A) KV cache memory
- B) Tokeniser speed
- C) CPU cores
- D) Disk

**Q6.** Why does batching increase throughput during decode?

- A) It shortens prompts
- B) It skips layers
- C) It amortises the weight read across many sequences
- D) It reduces model size

**Q7.** End-to-end latency for a response of N output tokens is approximately...

- A) TTFT + TPOT × (N − 1)
- B) TPOT only
- C) TTFT × N
- D) TTFT / N

<details><summary>Answers and explanations</summary>

- **Q1: A** — Low arithmetic intensity — the weight read dominates.
- **Q2: A** — Prefill processes the whole prompt before the first token can be emitted.
- **Q3: D** — 2 × 32 × 8 × 128 × 2 bytes = 131,072 bytes ≈ 128 KB (GQA shrinks it 4× vs 32 heads).
- **Q4: C** — ~14 GB of weights / 2 TB/s ≈ 7 ms.
- **Q5: A** — Each active sequence holds KV cache proportional to its length.
- **Q6: C** — One weight read serves the whole batch, raising arithmetic intensity.
- **Q7: A** — First token after prefill, then one decode step per remaining token.

</details>

## Exercises

### Inference calculator (core)

Write a Python script that takes model config (params, layers, kv_heads, head_dim, dtype), GPU (memory, bandwidth, FLOPs) and workload (prompt and output lengths) and outputs weight memory, KV per token, max concurrent sequences, and TPOT floor.

**Deliverable:** Script + results for 3 models on 2 GPUs.

**Done when:**
- [ ] Numbers within 20% of published references or measured values

### Explain it to a manager (core)

Write a 1-page explainer of "why our LLM gets slower and more expensive with longer conversations" using KV cache.

**Deliverable:** Explainer with one diagram (also a LinkedIn post candidate).

**Done when:**
- [ ] No jargon without definition; includes one number

## Reflection

- Which latency metric matters most for the auction assistant, and why?
