# P2 · Platform engineering and Kubernetes for AI

**Your current level:** Partial

## Goal

Design an internal AI platform as a product: golden paths, team boundaries, multi-tenant Kubernetes with GPU scheduling, and infrastructure delivered through IaC, GitOps and policy-as-code.

## Why this matters for you

Global platform roles assume deep Kubernetes and IaC. You are Azure-native and have designed AKS-based platforms; this pillar makes you fluent below the managed-service layer.

## Modules

Total: ~38 hours

| Module | Hours | Quiz | Exercises |
|---|---|---|---|
| [P2M1 · Platform as a product, golden paths and team topologies](p2m1-platform-as-a-product-golden-paths-and-team-topologies.md) | 6 | 6 Qs | 2 |
| [P2M2 · Kubernetes internals for platform engineers](p2m2-kubernetes-internals-for-platform-engineers.md) | 12 | 6 Qs | 3 |
| [P2M3 · GPUs, scheduling and multi-tenancy on Kubernetes](p2m3-gpus-scheduling-and-multi-tenancy-on-kubernetes.md) | 10 | 6 Qs | 3 |
| [P2M4 · IaC, GitOps and policy as code](p2m4-iac-gitops-and-policy-as-code.md) | 10 | 6 Qs | 2 |

## Capstone: Reference AI platform on Kubernetes

Build a small multi-tenant AI platform on a local or AKS cluster: GitOps-managed, with GPU (or simulated) quotas per team, policy guardrails and a golden-path template that ships a model service end to end.

**Deliverables**

- [ ] Terraform for the cluster + Argo CD bootstrap
- [ ] Two tenant namespaces with quotas, network policies and RBAC
- [ ] A golden-path template (repo template) that deploys a model service with metrics
- [ ] Policy-as-code rules that block at least 3 unsafe patterns
- [ ] Architecture doc with ADRs for 3 key decisions

**Graded on**

- A new team can ship a model service from template in under 30 minutes
- Policies are tested (a violating manifest is rejected in CI and in-cluster)
- Everything reproducible from git; no manual kubectl changes
