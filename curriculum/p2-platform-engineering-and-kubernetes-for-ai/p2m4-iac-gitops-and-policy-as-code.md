# P2M4 · IaC, GitOps and policy as code

**Pillar:** [Platform engineering and Kubernetes for AI](README.md) · **Time:** ~10 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Structure Terraform for multiple environments and teams
- Run GitOps with Argo CD and explain pull-based reconciliation
- Enforce guardrails with policy as code (Kyverno or OPA Gatekeeper)

## Lesson

## Terraform structure
- **Modules** are reusable building blocks (e.g. a "foundry-workload" module).
- **Root modules** per environment/workload compose modules.
- **Remote state** with locking; one state per blast-radius unit (don't put all
  environments in one state).
- Pin provider and module versions; run `plan` in CI and require review on
  `apply`.
- Detect **drift** (resources changed outside Terraform) with scheduled plans.

## GitOps
GitOps (OpenGitOps principles): desired state is **declarative**, **versioned
and immutable** in git, **pulled automatically** by agents, and **continuously
reconciled**. Argo CD runs in the cluster, watches git, and syncs manifests -
the same control-loop idea as Kubernetes itself. Benefits: audit trail,
rollback via git revert, no CI system holding cluster-admin credentials.
Typical split: Terraform for cloud resources (clusters, networks, identities),
GitOps for in-cluster resources.

## Policy as code
Admission controllers enforce rules at the API server:
- **Kyverno**: policies written as Kubernetes YAML; validate, mutate,
  generate, verify images.
- **OPA Gatekeeper**: policies in Rego via ConstraintTemplates.
Example AI-platform guardrails: no containers without resource limits; GPU
pods only in approved namespaces; images only from your registry and signed;
no public LoadBalancers; required labels for cost allocation (team, model).
Also run the same policies in CI (shift-left) so developers see failures
before deploying.

## Secrets and identity
Prefer workload identity (Azure Workload Identity, IRSA on AWS) over static
secrets. You already used workload identity federation for Foundry agents -
that's the pattern.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [Terraform docs: Modules](https://developer.hashicorp.com/terraform/language/modules) — HashiCorp | docs | 30 min | Module composition and versioning. |
| **Required** | [OpenGitOps principles](https://opengitops.dev/) — CNCF OpenGitOps | docs | 10 min | The four principles. |
| **Required** | [Argo CD documentation: Core concepts](https://argo-cd.readthedocs.io/en/stable/core_concepts/) — Argo Project | docs | 30 min | Applications, sync, health and the app-of-apps pattern. |
| **Required** | [Kyverno documentation](https://kyverno.io/docs/) — Kyverno | docs | 45 min | Validate and mutate policies; testing policies with the CLI. |
| Optional | [OPA Gatekeeper documentation](https://open-policy-agent.github.io/gatekeeper/website/docs/) — Open Policy Agent | docs | 30 min | ConstraintTemplates and Rego basics. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** Which is a core GitOps principle?

- A) Manual kubectl in emergencies is normal
- B) Desired state is pulled from git and continuously reconciled
- C) CI pushes changes to the cluster with admin credentials
- D) State lives in the cluster only

**Q2.** Why split Terraform state by environment or workload?

- A) To avoid modules
- B) Faster typing
- C) Terraform requires it
- D) To limit blast radius and lock contention

**Q3.** A policy rejects any Pod without CPU and memory limits. Where is it enforced in-cluster?

- A) Admission control in the API server
- B) Scheduler
- C) kubelet
- D) CNI plugin

**Q4.** What language does OPA Gatekeeper use for policies?

- A) Rego
- B) YAML only
- C) Python
- D) HCL

**Q5.** Someone changed a resource in the Azure portal. How do you detect it?

- A) Check etcd
- B) Argo CD reports it automatically for all Azure resources
- C) You can't
- D) Scheduled terraform plan shows drift

**Q6.** What's the best way for pods to access cloud services?

- A) Static keys in env vars
- B) Workload identity federation
- C) Keys in the image
- D) Shared admin service principal

<details><summary>Answers and explanations</summary>

- **Q1: B** — GitOps uses pull-based agents that reconcile from versioned declarative state.
- **Q2: D** — Smaller states reduce the damage of a bad apply and contention between teams.
- **Q3: A** — Kyverno and Gatekeeper run as admission webhooks.
- **Q4: A** — Gatekeeper ConstraintTemplates embed Rego; Kyverno uses YAML.
- **Q5: D** — A plan compares real infrastructure with code and reveals drift.
- **Q6: B** — Short-lived federated tokens avoid static secret sprawl.

</details>

## Exercises

### GitOps bootstrap (core)

Use Terraform to create a cluster (kind via a provider, or AKS), install Argo CD, and use app-of-apps to deploy the two tenant namespaces from p2m3.

**Deliverable:** Repo with infra/ and gitops/ folders.

**Done when:**
- [ ] Deleting a namespace manually is restored by Argo CD

### Five AI-platform policies (core)

Write Kyverno (or Gatekeeper) policies for limits required, GPU only in approved namespaces, approved registries only, required cost labels, no public LoadBalancer. Test them in CI with the CLI.

**Deliverable:** Policies + test cases (pass and fail manifests).

**Done when:**
- [ ] Each policy has at least one passing and one failing test

## Reflection

- Which manual step in your current infra still lives in someone's head?
