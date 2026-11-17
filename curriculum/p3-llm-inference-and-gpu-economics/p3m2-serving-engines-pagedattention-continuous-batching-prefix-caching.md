# P3M2 · Serving engines: PagedAttention, continuous batching, prefix caching

**Pillar:** [LLM inference and GPU economics](README.md) · **Time:** ~8 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Explain continuous (iteration-level) batching vs static batching
- Explain how PagedAttention reduces KV cache waste
- Know when prefix caching and chunked prefill help

## Lesson

## Static vs continuous batching
**Static batching** waits for a batch, runs it until the longest sequence
finishes; short requests wait and GPU slots sit idle. **Continuous batching**
(introduced by Orca as iteration-level scheduling) re-forms the batch at every
decode step: finished sequences leave, new ones join. Large throughput gains on
real traffic with mixed output lengths.

## PagedAttention (vLLM)
Naively, each request reserves a contiguous KV region sized for its maximum
length → internal and external fragmentation; the vLLM paper reports large
waste in prior systems. **PagedAttention** splits KV cache into fixed-size
**blocks** (like OS memory pages) mapped through a block table, allocated on
demand. Near-zero waste → more concurrent sequences → higher throughput. Blocks
can also be **shared** (copy-on-write) for parallel sampling and common
prefixes.

## Prefix caching
Many requests share a prefix (system prompt, few-shot examples, a long
document). Caching the KV for that prefix skips its prefill. SGLang's
**RadixAttention** keeps prefixes in a radix tree for automatic reuse; vLLM
supports automatic prefix caching. Big win for agents with long, stable system
prompts and tool definitions, order your prompt so stable parts come first.

## Chunked prefill and disaggregation
A long prefill can stall everyone's decode steps (latency spikes). **Chunked
prefill** splits prompts into chunks interleaved with decode. **Prefill/decode
disaggregation** runs the two phases on different GPU pools because they have
different bottlenecks.

## The landscape
vLLM (most common open-source server), SGLang, TensorRT-LLM (NVIDIA-optimised),
Hugging Face TGI, plus managed endpoints. On Kubernetes: KServe or plain
Deployments, ideally scaled on queue/KV metrics.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180) — Kwon et al., SOSP 2023 | paper | 60 min | Sections on KV fragmentation, block tables and sharing. |
| **Required** | [vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention](https://blog.vllm.ai/2023/06/20/vllm.html) — vLLM team blog | blog | 15 min | Visual explanation of PagedAttention. |
| **Required** | [How continuous batching enables 23x throughput in LLM inference](https://www.anyscale.com/blog/continuous-batching-llm-inference) — Anyscale | blog | 20 min | Static vs continuous batching diagrams. |
| Optional | [Orca: A Distributed Serving System for Transformer-Based Generative Models](https://www.usenix.org/conference/osdi22/presentation/yu) — Yu et al., OSDI 2022 | paper | 45 min | Iteration-level scheduling. |
| Optional | [SGLang: Efficient Execution of Structured Language Model Programs](https://arxiv.org/abs/2312.07104) — Zheng et al., 2023 | paper | 45 min | RadixAttention and prefix reuse. |
| **Required** | [vLLM documentation](https://docs.vllm.ai/) — vLLM | docs | 45 min | Serving, automatic prefix caching, chunked prefill flags. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** What is the main advantage of continuous batching over static batching?

- A) Lower precision
- B) No KV cache needed
- C) Finished sequences leave and new ones join every step, so GPU slots aren't wasted
- D) Smaller models

**Q2.** PagedAttention primarily solves...

- A) Slow tokenisation
- B) Network latency
- C) Quantisation error
- D) KV cache memory fragmentation and over-reservation

**Q3.** An agent sends the same 6,000-token system prompt and tool definitions with every request. Which feature helps most?

- A) Speculative decoding
- B) INT4 quantisation
- C) Prefix caching
- D) Larger batch timeout

**Q4.** Users see latency spikes whenever someone submits a very long document. What helps?

- A) Lower temperature
- B) Chunked prefill
- C) Static batching
- D) Removing the KV cache

**Q5.** To maximise prefix cache hits, how should prompts be structured?

- A) Put user input first
- B) Order doesn't matter
- C) Randomise order
- D) Put stable content (system prompt, tools, docs) first and variable content last

**Q6.** Why might you disaggregate prefill and decode onto different GPU pools?

- A) Prefill needs no GPU
- B) Decode needs CPUs
- C) Licensing
- D) They have different bottlenecks (compute vs memory bandwidth)

<details><summary>Answers and explanations</summary>

- **Q1: C** — Iteration-level scheduling keeps the batch full with mixed output lengths.
- **Q2: D** — Fixed-size blocks allocated on demand avoid reserving max-length contiguous memory.
- **Q3: C** — Caching the shared prefix KV skips repeated prefill.
- **Q4: B** — Chunking the prefill lets decode steps continue between chunks.
- **Q5: D** — Caching works on shared prefixes, so the stable part must be at the start.
- **Q6: D** — Separating them lets each pool be sized and tuned for its bottleneck.

</details>

## Exercises

### First vLLM deployment (core)

Serve a small open model (e.g. Qwen 1.5-3B class) with vLLM's OpenAI-compatible server on a GPU (Azure ML compute or AKS). Call it from Python.

**Deliverable:** Run script + notes on startup flags used.

**Done when:**
- [ ] Can explain every flag set (max-model-len, gpu-memory-utilization, etc.)

### Prefix caching experiment (core)

Benchmark 200 requests sharing a 4k-token prefix with prefix caching on vs off. Measure TTFT.

**Deliverable:** Results table + chart.

**Done when:**
- [ ] Clear TTFT difference explained using prefill cost

## Reflection

- How would you restructure the auction assistant's prompt to maximise cache hits?
