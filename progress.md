# Progress — AI Platform Mastery

Coach scorecard. Levels 1–5: 1 = can use it · 3 = can design it for a company · 5 = could write the definitive talk/paper on it.

## Current levels

| Domain | Baseline (2026-11-18) | Staff target |
|---|---|---|
| A · Platform architecture | 2 | 3 |
| B · Data & features | 2.5 | 3 |
| C · Training infra | 2.5 | 3 |
| D · Serving & inference | 2 | 3 |
| E · LLMOps & agents | 2.5 | 3 → spike to 4–5 |
| F · Evals & release gating (×2 weight) | 2 | 3 → spike to 4–5 |
| G · Reliability & observability | 2 | 3 |
| H · Governance & security | 1.75 | 3 |
| I · Economics | 2 | 3 |
| J · Influence | 2.5 | 3 |

**Overall:** 2.2 — solid senior operator, not yet Staff-level designer.

## Top 3 gaps
1. **F — Evals & release gating** (judge calibration, golden sets, CI gates)
2. **H — LLM security** (prompt injection on untrusted inputs)
3. **G/D — Production diagnosis** (SLOs with SLI/target/window, output-distribution monitoring, per-stage latency tracing)

## Strategy
Get every domain to 3, then spike **F + E** to 4–5 (rare, in demand, builds on the agent platform).

## Spaced-repetition queue (missed in diagnostic)
- [ ] Point-in-time (as-of) join — what it is, why feature stores exist
- [ ] GPU low utilisation causes: idle allocation, data-loader starvation, oversized nodes
- [ ] Multi-tenant platform mechanisms: tenancy + chargeback, RBAC/managed identity, golden-path templates
- [ ] Latency spike diagnosis: per-stage tracing, cold starts, worker concurrency saturation
- [ ] Why an LLM gateway: cost attribution/quotas, key mgmt, fallback routing, PII redaction, logging for evals
- [ ] Eval rigour: golden set + slices, multiple runs, CI threshold gate, then online A/B
- [ ] LLM-as-judge calibration: human labels, Cohen's κ, position/verbosity/self-preference bias
- [ ] SLO anatomy: SLI + target + window; label delay
- [ ] Prediction-distribution monitoring (same-day, label-free)
- [ ] Prediction log for audit: request ID, model version, feature snapshot → data snapshot + git commit
- [ ] Prompt injection mitigations: untrusted data delimiting, least-privilege tools, human approval, classifier, schema validation
- [ ] Unit cost per prediction: idle capacity, shared infra, amortised training

## Public proof (monthly check)
- Existing: LinkedIn posts, PyCon MY talk, MLOps-Toolbox (own OSS library)
- Gap: consistent public shipping

## Session log
- **2026-11-18 — Diagnostic.** Baseline set. Homework: write one Beacon SLO (SLI + target + window). Next: deep dive F — eval gate for a Foundry agent prompt change.
