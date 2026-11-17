# Full curriculum

> Generated from `content/*.yaml` by `scripts/build.py`. Edit the YAML, not this file.

**6 pillars · 25 modules · ~190 hours · 96 readings · 144 quiz questions · 56 exercises · 6 capstones**

Recommended order: P1 → P4 → P3 → P2 → P5 (P6 runs in parallel throughout).

## [P1 · Production ML lifecycle](curriculum/p1-production-ml-lifecycle/README.md) — Strong

Explain, design and defend an end-to-end production ML system at staff level: where technical debt hides, how data and model contracts stop silent failures, how releases are gated, and how drift is caught before the business notices.

- **[P1M1](curriculum/p1-production-ml-lifecycle/p1m1-ml-systems-and-hidden-technical-debt.md) ML systems and hidden technical debt** (~6 h)
  - Name the main forms of ML technical debt and spot them in a real system
  - Explain why ML code is a small fraction of a production ML system
  - Apply the most important Rules of ML to a new project
- **[P1M2](curriculum/p1-production-ml-lifecycle/p1m2-data-contracts-training-serving-skew-and-feature-stores.md) Data contracts, training-serving skew and feature stores** (~8 h)
  - Define training-serving skew and its three root causes
  - Design a data contract and decide where it is enforced
  - Explain point-in-time correctness and why feature stores exist
- **[P1M3](curriculum/p1-production-ml-lifecycle/p1m3-testing-ci-cd-and-release-strategies-for-ml.md) Testing, CI/CD and release strategies for ML** (~8 h)
  - Use the ML Test Score rubric to assess production readiness
  - Explain MLOps maturity levels and continuous training
  - Choose between shadow, canary, A/B and blue-green releases for a model
- **[P1M4](curriculum/p1-production-ml-lifecycle/p1m4-monitoring-drift-and-incident-response-for-ml.md) Monitoring, drift and incident response for ML** (~6 h)
  - Distinguish data drift, prediction drift and concept drift
  - Choose drift metrics and alert thresholds that avoid alert fatigue
  - Write SLOs and a runbook for an ML service

**Capstone:** Production-readiness review of Beacon or Atlas

## [P4 · Evals and observability for LLM and agent systems](curriculum/p4-evals-and-observability-for-llm-and-agent-systems/README.md) — Gap

Build evaluation systems that tell you, with evidence, whether an LLM or agent is good enough to ship, from error analysis and calibrated LLM judges to agent trajectory evals, production tracing and eval-gated releases, including for Malaysian language mixes.

- **[P4M1](curriculum/p4-evals-and-observability-for-llm-and-agent-systems/p4m1-eval-fundamentals-and-error-analysis.md) Eval fundamentals and error analysis** (~8 h)
  - Define evals, graders and the three eval levels
  - Run error analysis (open coding → axial coding → failure taxonomy)
  - Choose metrics from observed failures, not from a generic list
- **[P4M2](curriculum/p4-evals-and-observability-for-llm-and-agent-systems/p4m2-llm-as-judge-building-judges-you-can-trust.md) LLM-as-judge: building judges you can trust** (~8 h)
  - Know the documented biases of LLM judges
  - Build a judge with critique shadowing and measure agreement
  - Report judge quality with TPR/TNR and correct the observed pass rate
- **[P4M3](curriculum/p4-evals-and-observability-for-llm-and-agent-systems/p4m3-evaluating-rag-and-agents.md) Evaluating RAG and agents** (~10 h)
  - Evaluate retrieval and generation separately in RAG
  - Evaluate agents on outcome, trajectory and tool use
  - Handle non-determinism with multiple trials (pass@k, pass^k)
- **[P4M4](curriculum/p4-evals-and-observability-for-llm-and-agent-systems/p4m4-observability-online-evals-and-eval-gated-ci-cd.md) Observability, online evals and eval-gated CI/CD** (~8 h)
  - Instrument LLM and agent calls with OpenTelemetry GenAI conventions
  - Run online evals and guardrails on production traffic
  - Gate releases (prompts, models, configs) on eval results
- **[P4M5](curriculum/p4-evals-and-observability-for-llm-and-agent-systems/p4m5-multilingual-and-malaysian-context-evaluation.md) Multilingual and Malaysian-context evaluation** (~8 h)
  - Know the main SEA and Malay benchmarks and their limits
  - Design evals for code-switching (BM, Manglish, Mandarin mixes)
  - Avoid common pitfalls of translated benchmarks

**Capstone:** Eval-gated release for a real agent

## [P3 · LLM inference and GPU economics](curriculum/p3-llm-inference-and-gpu-economics/README.md) — Gap

Reason from first principles about LLM serving performance and cost: why decode is memory-bound, how KV cache and batching shape throughput, which optimisations to apply, and how to size and price a deployment.

- **[P3M1](curriculum/p3-llm-inference-and-gpu-economics/p3m1-transformer-inference-arithmetic.md) Transformer inference arithmetic** (~8 h)
  - Explain prefill vs decode and why decode is memory-bandwidth bound
  - Estimate KV cache size for a model and context length
  - Estimate memory and latency lower bounds from first principles
- **[P3M2](curriculum/p3-llm-inference-and-gpu-economics/p3m2-serving-engines-pagedattention-continuous-batching-prefix-caching.md) Serving engines: PagedAttention, continuous batching, prefix caching** (~8 h)
  - Explain continuous (iteration-level) batching vs static batching
  - Explain how PagedAttention reduces KV cache waste
  - Know when prefix caching and chunked prefill help
- **[P3M3](curriculum/p3-llm-inference-and-gpu-economics/p3m3-optimisation-quantisation-speculative-decoding-flashattention.md) Optimisation: quantisation, speculative decoding, FlashAttention** (~8 h)
  - Choose a quantisation scheme and measure its quality cost
  - Explain speculative decoding and when it helps
  - Explain FlashAttention's IO-aware idea
- **[P3M4](curriculum/p3-llm-inference-and-gpu-economics/p3m4-benchmarking-capacity-planning-and-cost-per-token.md) Benchmarking, capacity planning and cost per token** (~8 h)
  - Benchmark an LLM endpoint correctly under realistic load
  - Convert throughput into cost per million tokens
  - Find the break-even between self-hosting and an API

**Capstone:** Self-hosting vs API cost study

## [P2 · Platform engineering and Kubernetes for AI](curriculum/p2-platform-engineering-and-kubernetes-for-ai/README.md) — Partial

Design an internal AI platform as a product: golden paths, team boundaries, multi-tenant Kubernetes with GPU scheduling, and infrastructure delivered through IaC, GitOps and policy-as-code.

- **[P2M1](curriculum/p2-platform-engineering-and-kubernetes-for-ai/p2m1-platform-as-a-product-golden-paths-and-team-topologies.md) Platform as a product, golden paths and team topologies** (~6 h)
  - Define an internal developer platform and its value
  - Apply Team Topologies to an AI/ML organisation
  - Design a golden path and measure platform success
- **[P2M2](curriculum/p2-platform-engineering-and-kubernetes-for-ai/p2m2-kubernetes-internals-for-platform-engineers.md) Kubernetes internals for platform engineers** (~12 h)
  - Explain the control loop, controllers and the operator pattern
  - Trace what happens from kubectl apply to a running pod
  - Configure requests, limits, QoS and autoscaling correctly
- **[P2M3](curriculum/p2-platform-engineering-and-kubernetes-for-ai/p2m3-gpus-scheduling-and-multi-tenancy-on-kubernetes.md) GPUs, scheduling and multi-tenancy on Kubernetes** (~10 h)
  - Explain how GPUs are exposed to Kubernetes and shared
  - Design quotas and fair-share scheduling for multiple teams
  - Choose between MIG, time-slicing and dedicated GPUs
- **[P2M4](curriculum/p2-platform-engineering-and-kubernetes-for-ai/p2m4-iac-gitops-and-policy-as-code.md) IaC, GitOps and policy as code** (~10 h)
  - Structure Terraform for multiple environments and teams
  - Run GitOps with Argo CD and explain pull-based reconciliation
  - Enforce guardrails with policy as code (Kyverno or OPA Gatekeeper)

**Capstone:** Reference AI platform on Kubernetes

## [P5 · AI governance, risk and security](curriculum/p5-ai-governance-risk-and-security/README.md) — Partial

Turn governance frameworks and regulation into concrete platform controls: risk tiers, documentation, audit trails, human oversight and LLM security - mapped to NIST, ISO/IEC 42001, the EU AI Act and Malaysian/Singapore guidance.

- **[P5M1](curriculum/p5-ai-governance-risk-and-security/p5m1-risk-frameworks-nist-ai-rmf-and-iso-iec-42001.md) Risk frameworks: NIST AI RMF and ISO/IEC 42001** (~6 h)
  - Explain the four NIST AI RMF functions and the GenAI Profile
  - Explain what an AI management system (ISO/IEC 42001) is
  - Design a risk-tiering scheme for an organisation
- **[P5M2](curriculum/p5-ai-governance-risk-and-security/p5m2-regulation-and-guidance-eu-ai-act-malaysia-singapore.md) Regulation and guidance: EU AI Act, Malaysia, Singapore** (~6 h)
  - Explain the EU AI Act's risk-based structure and current timeline
  - Summarise Malaysia's AIGE guidelines and Singapore's GenAI framework
  - Know when a Malaysian company is affected by the EU AI Act
- **[P5M3](curriculum/p5-ai-governance-risk-and-security/p5m3-llm-and-agent-security.md) LLM and agent security** (~8 h)
  - Explain the OWASP Top 10 for LLM Applications
  - Explain direct and indirect prompt injection and realistic defences
  - Threat-model an agent with tools
- **[P5M4](curriculum/p5-ai-governance-risk-and-security/p5m4-operational-governance-documentation-lineage-and-human-oversight.md) Operational governance: documentation, lineage and human oversight** (~6 h)
  - Write model cards, datasheets and agent cards
  - Design audit trails and lineage from data to decision
  - Design meaningful human oversight

**Capstone:** Governance-by-design pack for your agent platform

## [P6 · Public proof and technical leadership](curriculum/p6-public-proof-and-technical-leadership/README.md) — Gap

Become known for your expertise: write design docs and public posts that people share, give talks, maintain open source, and operate at staff level, leading without authority.

- **[P6M1](curriculum/p6-public-proof-and-technical-leadership/p6m1-technical-writing-design-docs-adrs-and-posts.md) Technical writing: design docs, ADRs and posts** (~6 h)
  - Write design docs that get decisions made
  - Write ADRs that future engineers can trust
  - Write public posts that teach one thing with evidence
- **[P6M2](curriculum/p6-public-proof-and-technical-leadership/p6m2-talks-and-conferences.md) Talks and conferences** (~6 h)
  - Write a talk proposal (CFP) that gets accepted
  - Structure a 25-minute technical talk
  - Build a talk pipeline from meetups to international conferences
- **[P6M3](curriculum/p6-public-proof-and-technical-leadership/p6m3-open-source-as-proof-of-skill.md) Open source as proof of skill** (~6 h)
  - Make MLOps-Toolbox easy to adopt
  - Make a first upstream contribution successfully
  - Build visibility through useful, small, finished things
- **[P6M4](curriculum/p6-public-proof-and-technical-leadership/p6m4-staff-level-leadership-without-authority.md) Staff-level leadership without authority** (~6 h)
  - Describe staff engineer archetypes and pick yours
  - Use writing, sponsorship and influence to lead across teams
  - Decide between the staff IC and manager tracks with evidence

**Capstone:** Public body of work
