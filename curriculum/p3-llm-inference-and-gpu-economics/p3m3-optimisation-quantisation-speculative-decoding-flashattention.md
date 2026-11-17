# P3M3 · Optimisation: quantisation, speculative decoding, FlashAttention

**Pillar:** [LLM inference and GPU economics](README.md) · **Time:** ~8 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Choose a quantisation scheme and measure its quality cost
- Explain speculative decoding and when it helps
- Explain FlashAttention's IO-aware idea

## Lesson

## Quantisation
Store weights (and sometimes activations or KV cache) in fewer bits.
- **Weight-only INT8/INT4**: shrinks memory and speeds memory-bound decode.
  Methods: **GPTQ** (approximate second-order, layer-wise), **AWQ**
  (activation-aware: protect the small fraction of salient weights).
- **FP8**: on newer GPUs (e.g. H100), FP8 weights/activations with hardware
  support; good quality/speed trade-off.
- **KV cache quantisation**: more concurrent sequences.
Rule: quantisation is a **quality** change, so it must pass your evals
(Pillar 4), not just perplexity. Quality loss is often uneven, check your
languages (e.g. BM/Manglish) and tasks separately.

## Speculative decoding
A small **draft** model proposes k tokens; the large **target** model verifies
them in one forward pass. Accepted tokens are kept; on the first mismatch the
target's token is used. The sampling scheme guarantees the output distribution
equals the target model's, **no quality loss**, just speed. Helps most when
the draft's acceptance rate is high and you're latency-bound at low batch
sizes; gains shrink at high batch where you're compute-bound. Variants: n-gram
/ prompt lookup, Medusa heads, EAGLE.

## FlashAttention
Standard attention materialises the full N×N attention matrix in slow GPU HBM.
**FlashAttention** tiles the computation so blocks stay in fast on-chip SRAM,
using an online softmax, exact attention with far fewer memory reads/writes.
The lesson generalises: on GPUs, **moving data is often the cost, not maths**.

## Other levers
Smaller/distilled models, shorter prompts, output length limits, structured
output, routing easy requests to a small model, caching full responses for
repeated questions. Often the cheapest optimisation is not in the GPU at all.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135) — Dao et al., 2022 | paper | 45 min | Introduction and the IO-complexity argument. |
| **Required** | [Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192) — Leviathan et al., 2022 | paper | 40 min | Why the output distribution is preserved. |
| Optional | [GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers](https://arxiv.org/abs/2210.17323) — Frantar et al., 2022 | paper | 40 min | Abstract, method overview, results tables. |
| **Required** | [AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration](https://arxiv.org/abs/2306.00978) — Lin et al., 2023 | paper | 40 min | The salient-weights insight. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** Speculative decoding (with proper rejection sampling) affects output quality how?

- A) Raises it
- B) Preserves the target model's output distribution exactly
- C) Lowers it slightly
- D) Depends on temperature only

**Q2.** When does speculative decoding help least?

- A) Predictable outputs like code
- B) Low batch, latency-bound serving
- C) High batch sizes where serving is already compute-bound
- D) High acceptance rates

**Q3.** AWQ's key insight is...

- A) All weights matter equally
- B) A small fraction of salient weights (identified via activations) should be protected
- C) Quantise activations only
- D) Use FP32 for KV cache

**Q4.** FlashAttention speeds up attention mainly by...

- A) Reducing reads/writes to HBM by tiling in on-chip SRAM
- B) Using INT4
- C) Approximating attention
- D) Skipping layers

**Q5.** You quantise to INT4 and perplexity barely changes. What should you do before shipping?

- A) Ship it
- B) Run task-level evals, including per-language slices
- C) Increase temperature
- D) Retrain

**Q6.** Why does weight-only quantisation speed up decode?

- A) Fewer layers
- B) Better tokeniser
- C) Fewer bytes to read per step in a memory-bound phase
- D) Shorter prompts

<details><summary>Answers and explanations</summary>

- **Q1: B** — Verification by the target guarantees identical distribution; it's a pure speed optimisation.
- **Q2: C** — Extra verification compute competes with an already full GPU.
- **Q3: B** — Activation-aware scaling protects important channels.
- **Q4: A** — It's exact attention made IO-aware.
- **Q5: B** — Perplexity hides uneven task and language regressions.
- **Q6: C** — Decode is bandwidth-bound; smaller weights mean faster reads.

</details>

## Exercises

### Quantisation quality vs speed (core)

Serve the same model in FP16 (or BF16) and an AWQ/GPTQ INT4 variant. Measure TPOT, throughput and quality on a 50-item eval set with BM and English items.

**Deliverable:** Comparison table + recommendation.

**Done when:**
- [ ] Quality reported per language slice

### Speculative decoding trial (stretch)

Enable speculative decoding (draft model or n-gram) in vLLM and measure speed-up at batch 1 and batch 32.

**Deliverable:** Results + explanation of the difference.

**Done when:**
- [ ] Explains the batch-size effect correctly

## Reflection

- Which optimisation would you try first for the auction assistant and why?
