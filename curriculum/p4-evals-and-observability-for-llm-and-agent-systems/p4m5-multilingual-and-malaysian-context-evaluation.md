# P4M5 · Multilingual and Malaysian-context evaluation

**Pillar:** [Evals and observability for LLM and agent systems](README.md) · **Time:** ~8 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Know the main SEA and Malay benchmarks and their limits
- Design evals for code-switching (BM, Manglish, Mandarin mixes)
- Avoid common pitfalls of translated benchmarks

## Lesson

## Why this is its own module
Most eval knowledge is English-first. Malaysian users code-switch within a
sentence ("Boleh check tak bila auction start, I nak bid lori tu"), use
Manglish particles (lah, kan, meh), and mix scripts. Models can look fine on
English benchmarks and fail here — and few people in the world can evaluate it
well. This is your differentiator.

## Benchmarks to know
- **SEA-HELM** (AI Singapore) — holistic SEA evaluation with five pillars: NLP
  classics, LLM-specifics, SEA linguistics, SEA culture, and safety; public
  leaderboard and open code.
- **MalayMMLU** (Universiti Malaya × YTL AI Labs, EMNLP Findings 2024) — 24k+
  multiple-choice questions across Malaysian school-curriculum subjects.
- **MyCulture** (Universiti Malaya) — Malaysian culture knowledge with an
  open-ended format to reduce MCQ shortcuts.
Limits: MCQ benchmarks test knowledge, not conversational behaviour;
contamination risk; little coverage of colloquial code-switching.

## Pitfalls of translated benchmarks
Machine-translated English sets carry **translationese**, lose cultural
context (wrong holidays, names, prices in USD), and miss code-switching.
Prefer native-authored items; if you translate, have native speakers review
and localise.

## Designing code-switching evals
Define dimensions and sample across them:
- **Language mix** — pure BM, pure English, BM-English mix, Manglish, with
  Mandarin/Cantonese/Tamil terms.
- **Register** — formal (customer complaint letter) vs casual (WhatsApp).
- **Task** — Q&A, instruction following, extraction, refusal.
Failure modes to check: **language fidelity** (replies in the user's language or
mix?), comprehension of particles/slang, cultural correctness (local
institutions, holidays, currency RM), and safety that still holds in BM (some
guardrails are weaker in non-English).

## Judges in other languages
LLM judges may be less reliable in BM/Manglish. Validate the judge **per
language slice** with native-speaker labels and report TPR/TNR per slice.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [SEA-HELM: Southeast Asian Holistic Evaluation of Language Models](https://arxiv.org/abs/2502.14301) — Susanto et al., AI Singapore, 2025 | paper | 45 min | The five pillars and how cultural tasks are built. |
| **Required** | [MalayMMLU: A Multitask Benchmark for the Low-Resource Malay Language](https://aclanthology.org/2024.findings-emnlp.36/) — Poh et al., Findings of EMNLP 2024 | paper | 40 min | Construction, subjects, and what it does not cover. |
| Optional | [MyCulture: Exploring Malaysia's Diverse Culture under Low-Resource Language Constraints](https://arxiv.org/abs/2508.05429) — Hew et al., Universiti Malaya, 2025 | paper | 30 min | Open-ended format to reduce MCQ shortcuts. |
| Optional | [SEA-HELM code and leaderboard](https://github.com/aisingapore/SEA-HELM) — AI Singapore | tool | 30 min | How tasks and prompts are structured; reuse for your own suite. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** Which is NOT one of SEA-HELM's five pillars?

- A) Safety
- B) SEA Culture
- C) Code generation
- D) SEA Linguistics

**Q2.** What does MalayMMLU mainly measure?

- A) Knowledge across Malaysian curriculum subjects via multiple choice
- B) Conversational code-switching
- C) Agent tool use
- D) Speech recognition

**Q3.** A main risk of machine-translating an English benchmark into BM is...

- A) Models refuse BM
- B) Translationese and loss of local cultural context
- C) BM has no grammar
- D) It's too expensive

**Q4.** A user writes in Manglish and the assistant replies in formal English. Which failure is this?

- A) Latency
- B) Hallucination
- C) Retrieval failure
- D) Language fidelity

**Q5.** You validated your judge on English data with TPR 0.92. What should you do before using it on BM traces?

- A) Translate traces to English
- B) Validate it separately on native-labelled BM data
- C) Raise the threshold
- D) Nothing

**Q6.** Why is safety evaluation in BM important even if English safety evals pass?

- A) Guardrails and refusals can be weaker in non-English languages
- B) Only for regulators
- C) It isn't
- D) BM is banned

<details><summary>Answers and explanations</summary>

- **Q1: C** — The pillars are NLP Classics, LLM-specifics, SEA Linguistics, SEA Culture and Safety.
- **Q2: A** — It's an MCQ knowledge benchmark, not a conversational one.
- **Q3: B** — Translated items often don't reflect how Malaysians actually write.
- **Q4: D** — The reply doesn't match the user's language or register.
- **Q5: B** — Judge reliability varies by language; measure per slice.
- **Q6: A** — Safety behaviour does not reliably transfer across languages.

</details>

## Exercises

### Malaysian code-switching eval set v0 (core)

Write 60 native-authored test inputs across language mix × register × task, with pass criteria. Run 2 models and report per-slice results.

**Deliverable:** Dataset (CSV/JSONL) + results table — the seed for your eval startup.

**Done when:**
- [ ] At least 4 language-mix slices with 10+ items each
- [ ] Cultural items reviewed by someone other than you

### Judge validation per language (stretch)

Validate a language-fidelity judge on BM, English and Manglish slices separately; report TPR/TNR per slice.

**Deliverable:** Agreement report.

**Done when:**
- [ ] Shows where the judge is weakest

## Reflection

- Which Malaysian failure mode do global vendors most underestimate?
