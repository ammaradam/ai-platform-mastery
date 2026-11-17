# P2M3 · GPUs, scheduling and multi-tenancy on Kubernetes

**Pillar:** [Platform engineering and Kubernetes for AI](README.md) · **Time:** ~10 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Explain how GPUs are exposed to Kubernetes and shared
- Design quotas and fair-share scheduling for multiple teams
- Choose between MIG, time-slicing and dedicated GPUs

## Lesson

## How GPUs reach a Pod
GPUs are **extended resources** advertised by a **device plugin** (e.g.
`nvidia.com/gpu`). Pods request them in `limits`; GPUs are not overcommitted —
a requested GPU is exclusively assigned by default. The **NVIDIA GPU Operator**
installs and manages the drivers, container toolkit, device plugin, DCGM
monitoring and MIG manager as Kubernetes-managed components.

## Sharing a GPU
- **MIG (Multi-Instance GPU)** — on supported data-centre GPUs (e.g. A100,
  H100), hardware-partitions one GPU into isolated instances with dedicated
  memory and compute. Strong isolation; fixed profiles.
- **Time-slicing** — multiple Pods share a GPU by taking turns. No memory
  isolation; one tenant can OOM others. Fine for dev, notebooks, light
  inference.
- **MPS** — concurrent processes share a GPU with better utilisation than
  time-slicing; limited isolation.
- **Dedicated** — whole GPUs for training or large LLM serving.

## Multi-tenancy
Soft multi-tenancy (trusted internal teams) usually means one namespace per
team or workload with: **ResourceQuota** (including GPU counts),
**LimitRange**, **RBAC**, **NetworkPolicy**, and separate node pools via
**taints/tolerations** and node affinity for GPU nodes. Hard multi-tenancy
(untrusted tenants) usually needs separate clusters or strong sandboxing.

## Batch and fair-share
The default scheduler places Pods one at a time; distributed training needs
**gang scheduling** (all workers or none). **Kueue** adds job queueing, quotas
per queue, borrowing between teams, and preemption on top of the standard
scheduler. Volcano is an alternative batch scheduler.

## Cost
GPUs dominate AI platform cost. Track utilisation via DCGM metrics; idle
reserved GPUs are the biggest waste. Scale-to-zero for spiky inference, spot
nodes for fault-tolerant training.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [Kubernetes docs — Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/) — Kubernetes | docs | 15 min | Device plugins and how GPUs are requested. |
| **Required** | [NVIDIA GPU Operator documentation](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html) — NVIDIA | docs | 45 min | Components it manages; MIG and time-slicing configuration pages. |
| **Required** | [Kueue documentation — Overview](https://kueue.sigs.k8s.io/docs/overview/) — Kubernetes SIG Scheduling | docs | 30 min | ClusterQueues, LocalQueues, cohorts and borrowing. |
| **Required** | [Kubernetes docs — Multi-tenancy](https://kubernetes.io/docs/concepts/security/multi-tenancy/) — Kubernetes | docs | 30 min | Soft vs hard multi-tenancy and isolation controls. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** How does Kubernetes learn that a node has GPUs?

- A) The scheduler detects them
- B) kube-proxy reports them
- C) A device plugin advertises them as extended resources
- D) etcd scans hardware

**Q2.** Two teams share an A100 for inference and need memory isolation so one can't OOM the other. Best option?

- A) MIG
- B) Time-slicing
- C) BestEffort pods
- D) Higher limits

**Q3.** A distributed training job needs all 8 workers to start together or not at all. What capability is needed?

- A) Gang scheduling (e.g. via Kueue or Volcano)
- B) Pod disruption budgets
- C) Node affinity
- D) HPA

**Q4.** Which object caps the number of GPUs a team namespace can request?

- A) LimitRange
- B) NetworkPolicy
- C) ResourceQuota
- D) PriorityClass

**Q5.** How do you keep non-GPU workloads off expensive GPU nodes?

- A) Set CPU limits
- B) Use a Service
- C) Taint GPU nodes and give tolerations only to GPU workloads
- D) Use a ConfigMap

**Q6.** For untrusted external tenants, what's usually required?

- A) Just quotas
- B) Hard multi-tenancy — separate clusters or strong sandboxing
- C) Just RBAC
- D) Namespaces are enough

<details><summary>Answers and explanations</summary>

- **Q1: C** — Device plugins register extended resources like nvidia.com/gpu with the kubelet.
- **Q2: A** — MIG provides hardware-isolated memory and compute; time-slicing does not isolate memory.
- **Q3: A** — Gang scheduling avoids partial starts that hold GPUs idle.
- **Q4: C** — ResourceQuota can limit extended resources such as requests.nvidia.com/gpu.
- **Q5: C** — Taints repel Pods without matching tolerations.
- **Q6: B** — Namespaces provide soft isolation suitable for trusted internal teams.

</details>

## Exercises

### Multi-tenant namespaces (core)

Create two team namespaces with ResourceQuota (incl. GPU count), LimitRange, RBAC and a default-deny NetworkPolicy. Prove isolation.

**Deliverable:** Manifests + test script showing cross-namespace traffic and over-quota requests are blocked.

**Done when:**
- [ ] Over-quota pod is rejected with a clear message

### Kueue fair share (stretch)

Install Kueue on kind with fake GPU resources; create two ClusterQueues in a cohort with borrowing; show preemption when the owner team returns.

**Deliverable:** Manifests + recording or logs of borrowing and preemption.

**Done when:**
- [ ] Borrowed capacity is reclaimed when the lending queue gets work

### GPU sharing decision matrix (core)

For 5 workloads (notebooks, CV batch scoring, LLM chat serving, fine-tuning, eval jobs) choose dedicated / MIG / time-slicing and justify.

**Deliverable:** Decision table.

**Done when:**
- [ ] Each choice addresses isolation, utilisation and cost

## Reflection

- What would your GPU utilisation be if you measured it honestly today?
