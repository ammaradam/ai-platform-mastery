# P2M1 · Platform as a product, golden paths and team topologies

**Pillar:** [Platform engineering and Kubernetes for AI](README.md) · **Time:** ~6 h · **Pass mark:** 80% on the quiz

## Learning objectives

- Define an internal developer platform and its value
- Apply Team Topologies to an AI/ML organisation
- Design a golden path and measure platform success

## Lesson

## What a platform is
The CNCF Platforms white paper defines a platform as a collection of
capabilities, documentation and tools that support developing, deploying and
operating products, offered as **self-service** and run **as a product** for
internal users. The test of a platform is not the tech; it is whether teams
choose to use it.

## Team Topologies in one page
Four team types:
- **Stream-aligned**: owns a slice of business value end to end (e.g. the
  pricing data science team).
- **Platform**: provides internal services that reduce stream-aligned teams'
  cognitive load (your role).
- **Enabling**: temporarily helps teams adopt new capabilities (coaching DS on
  MLOps practices).
- **Complicated-subsystem**: owns a part needing deep specialist knowledge
  (e.g. a CV damage-detection model or an inference engine).
Three interaction modes: **collaboration**, **X-as-a-service**,
**facilitating**. A healthy platform moves from collaboration to
X-as-a-service as it matures. The guiding metric is **cognitive load** on
stream-aligned teams.

## Golden paths
Spotify defines the Golden Path as "the opinionated and supported path" to
build something. Key properties: optional (not mandated), opinionated,
documented, supported, and kept short through templates and automation. For AI:
a template that gives a new model project CI, tests, registry, deployment,
monitoring and eval hooks on day one.

## Measuring a platform
- Adoption (voluntary usage rate), time-to-first-deploy for a new team.
- DORA metrics: deployment frequency, lead time for changes, change failure
  rate, time to restore service.
- Developer satisfaction surveys; support ticket volume.
Your "two weeks to two days" release story is a lead-time improvement, say it
in DORA language.

## Readings

| | Reading | Type | Time | Focus on |
|---|---|---|---|---|
| **Required** | [CNCF Platforms White Paper](https://tag-app-delivery.cncf.io/whitepapers/platforms/) — CNCF TAG App Delivery, Platforms WG | whitepaper | 45 min | Attributes of successful platforms and how to measure them. |
| **Required** | [How We Use Golden Paths to Solve Fragmentation in Our Software Ecosystem](https://engineering.atspotify.com/2020/8/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem) — Spotify Engineering, 2020 | blog | 15 min | Why golden paths are opinionated but optional. |
| **Required** | [Team Topologies](https://teamtopologies.com/book) — Matthew Skelton & Manuel Pais | book | 300 min | Chapters on team types, interaction modes and cognitive load. |
| Optional | [CNCF Platform Engineering Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/) — CNCF TAG App Delivery | whitepaper | 30 min | Place your Pickles platform on each dimension. |

## Quiz

Answer without notes first. Answers are in the collapsible section below.

**Q1.** In Team Topologies, a team that coaches data scientists to adopt MLOps practices and then steps away is a...

- A) Complicated-subsystem team
- B) Enabling team
- C) Platform team
- D) Stream-aligned team

**Q2.** What is the primary thing a platform team should reduce for stream-aligned teams?

- A) Cloud cost
- B) Headcount
- C) Cognitive load
- D) Number of models

**Q3.** Which property is essential to Spotify's definition of a golden path?

- A) Mandatory for all teams
- B) Opinionated and supported, but optional
- C) Built only in Backstage
- D) No documentation needed

**Q4.** "Releases went from two weeks to two days" improves which DORA metric most directly?

- A) Lead time for changes
- B) Availability
- C) Time to restore service
- D) Change failure rate

**Q5.** A mature platform's main interaction mode with stream-aligned teams should be...

- A) X-as-a-service
- B) None
- C) Permanent collaboration
- D) Facilitating

**Q6.** Which is the strongest signal of platform success?

- A) Voluntary adoption and time-to-first-deploy
- B) Number of features built
- C) Lines of Terraform
- D) Number of clusters

<details><summary>Answers and explanations</summary>

- **Q1: B** — Enabling teams help others acquire capabilities temporarily.
- **Q2: C** — Team Topologies centres platform value on lowering cognitive load.
- **Q3: B** — Golden paths guide rather than force; they are supported and documented.
- **Q4: A** — Lead time measures commit-to-production time.
- **Q5: A** — Collaboration is for discovery; mature capabilities are consumed as a service.
- **Q6: A** — Platforms are products; adoption and user outcomes matter.

</details>

## Exercises

### Map Pickles with Team Topologies (core)

Draw your AI/ML org, Architecture team and Infra team as Team Topologies types with interaction modes. Identify one interaction that should change.

**Deliverable:** Diagram + half-page recommendation.

**Done when:**
- [ ] Each team labelled with type and interaction mode

### Golden path spec for a model service (core)

Write the golden path for "ship a new pricing model", steps, template contents, what is automated, what is optional.

**Deliverable:** Golden path doc (max 2 pages).

**Done when:**
- [ ] Includes a time-to-first-deploy target and how you'd measure it

## Reflection

- Which part of your platform do data scientists avoid, and why?
