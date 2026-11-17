# P2M2 · Kubernetes internals for platform engineers

**Pillar:** [Platform engineering and Kubernetes for AI](README.md) · **Time:** ~12 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Explain the control loop, controllers and the operator pattern
- Trace what happens from kubectl apply to a running pod
- Configure requests, limits, QoS and autoscaling correctly

## Lesson

## The control loop
Kubernetes is a set of **controllers** that continuously compare **desired
state** (objects stored in etcd via the API server) to **actual state** and act
to close the gap. This is level-triggered reconciliation, not one-off scripts.

## kubectl apply to running pod
1. `kubectl` sends the object to the **API server** (authn → authz/RBAC →
   admission controllers, including mutating and validating webhooks).
2. Object persisted in **etcd**.
3. The Deployment controller creates a ReplicaSet; the ReplicaSet controller
   creates Pods.
4. The **scheduler** picks a node for each unscheduled Pod (filtering, then
   scoring), writes the binding.
5. The **kubelet** on that node sees the Pod, asks the container runtime (via
   CRI) to pull images and start containers, sets up networking (CNI) and volumes
   (CSI), and reports status.

## Operators and CRDs
A **CustomResourceDefinition** adds a new API type; an **operator** is a custom
controller that reconciles it using domain knowledge (e.g. KServe's
InferenceService, the NVIDIA GPU Operator). This is how ML platforms extend
Kubernetes.

## Resources and QoS
- **Requests** are what the scheduler reserves; **limits** cap usage.
- CPU over limit → throttled. Memory over limit → **OOMKilled**.
- QoS classes: **Guaranteed** (requests = limits for all containers),
  **Burstable**, **BestEffort** (none set; evicted first).

## Autoscaling
- **HPA** scales replicas on metrics (CPU, custom metrics like queue depth).
- **VPA** adjusts requests.
- **Cluster Autoscaler / Karpenter** add or remove nodes when pods can't schedule.
- **KEDA** scales on event sources and can scale to zero.
For LLM serving, CPU is a poor scaling signal — use queue length, in-flight
requests or KV-cache utilisation (Pillar 3).

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [Kubernetes docs — Controllers](https://kubernetes.io/docs/concepts/architecture/controller/) — Kubernetes | docs | 15 min | Control loops and desired vs actual state. |
| **Required** | [Kubernetes docs — Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) — Kubernetes | docs | 15 min | CRDs and custom controllers. |
| **Required** | [Kubernetes docs — Resource management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) — Kubernetes | docs | 30 min | Requests, limits and what happens when they're exceeded. |
| Optional | [Kubernetes The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) — Kelsey Hightower | tutorial | 480 min | Build a cluster by hand once; you'll never forget the components. |
| Optional | [KEDA documentation](https://keda.sh/docs/) — KEDA | docs | 30 min | Event-driven autoscaling and scale-to-zero. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** Which component decides which node an unscheduled Pod runs on?

- A) etcd
- B) kubelet
- C) kube-scheduler
- D) API server

**Q2.** A container exceeds its memory limit. What happens?

- A) It is OOMKilled
- B) It is throttled
- C) Nothing
- D) It is moved to another node

**Q3.** Pods with requests equal to limits for every container get which QoS class?

- A) BestEffort
- B) Guaranteed
- C) Critical
- D) Burstable

**Q4.** What is an operator?

- A) A Helm chart
- B) A node type
- C) A human on call
- D) A custom controller that reconciles a custom resource using domain logic

**Q5.** Where are admission webhooks applied?

- A) In the container runtime
- B) In the kubelet
- C) In the scheduler
- D) In the API server request path, before persistence

**Q6.** Why is CPU utilisation a poor HPA signal for LLM inference pods?

- A) The bottleneck is GPU memory/queueing, so CPU doesn't track load
- B) It's too expensive
- C) HPA can't read CPU
- D) LLMs don't use CPU

<details><summary>Answers and explanations</summary>

- **Q1: C** — The scheduler filters and scores nodes and binds the Pod.
- **Q2: A** — Memory is incompressible; exceeding the limit kills the container. CPU is throttled instead.
- **Q3: B** — Guaranteed requires requests == limits for CPU and memory in all containers.
- **Q4: D** — Operators extend the control-loop pattern to new resource types.
- **Q5: D** — Mutating and validating admission run in the API server before objects are stored.
- **Q6: A** — Scale on queue depth, in-flight requests or KV-cache usage instead.

</details>

## Exercises

### Trace a deployment (core)

On kind or minikube, deploy an app and use kubectl get events, describe and API server audit logs to write the full timeline from apply to Running.

**Deliverable:** Annotated timeline.

**Done when:**
- [ ] Names every component involved in order

### Break it on purpose (core)

Trigger OOMKilled, CPU throttling, an unschedulable Pod and an image pull failure. Diagnose each from kubectl output only.

**Deliverable:** Short troubleshooting guide with symptoms → cause → fix.

**Done when:**
- [ ] Four distinct failure modes diagnosed

### Write a tiny operator (stretch)

Using kopf (Python) or kubebuilder, write an operator for a ModelEndpoint CRD that creates a Deployment + Service.

**Deliverable:** Repo folder with CRD, controller and demo.

**Done when:**
- [ ] Deleting or editing the Deployment is reconciled back to desired state

## Reflection

- Which Kubernetes concept do you still treat as magic?
