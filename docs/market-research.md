# Solian Wolves Learning Platform — Market Research & Competitor Analysis

**Planning baseline:** 24 October 2026 · Version 1.0  
**Status:** Validated baseline for Lean Prototype & Pilot

---

## 1. Executive Summary

Solian Wolves Learning is designed to bridge structured, trustworthy lesson libraries with controlled, conversational AI exploration. Unlike pure content repositories or open-ended chat interfaces, our core value proposition is **retention and comprehension**: moving seamlessly between curated reading, interactive practice, server-validated quizzes, and bounded AI tutoring.

---

## 2. Competitor Benchmarking Matrix

| Platform | Core Strength | Key Vulnerability / Gap | Solian Wolves Implication |
| :--- | :--- | :--- | :--- |
| **Khan Academy / Khanmigo** | Curated, trustworthy educational content with guided Socratic tutoring. | AI tutor can feel separated from self-directed exploration; subscription costs for Khanmigo. | Pair trusted lesson modules directly with an in-context AI tutor anchored to verified sources. |
| **Duolingo** | Habit loops, micro-lessons, gamification, and bite-sized practice. | Superficial concept depth; learners struggle to transfer grammar rules to complex reasoning. | Emphasize manageable chunking and positive feedback loops without sacrificing deep conceptual explanations. |
| **Brilliant** | Problem-centered, interactive first-principles learning in STEM. | High subscription barrier; limited conversational flexibility when a learner gets stuck. | Implement "Learn by doing" with interactive checkpoints and multi-level explanations (simple analogies to rigorous breakdowns). |
| **ChatGPT Study Mode** | Highly adaptive explanations, follow-up inquiry, and dynamic quizzes. | Factual hallucinations, lack of curriculum permanence, ungrounded sources, and distracting open-endedness. | Constrain the AI tutor to verified curricula, enforce server-side source grounding, and provide explicit progress state. |

---

## 3. Four-Stream Research Methodology

### Workstream A — Desk Research
* **Scope:** Deep-dive into onboarding funnels, mobile usability, pricing structures, and privacy disclosures of major learning apps.
* **Key Finding:** Free tiers with opaque AI limits create user distrust. Clear quotas and deterministic progress tracking drive higher user satisfaction.

### Workstream B — User Discovery
* **Target:** 10–15 diverse learners (curious beginners, skill builders, independent self-learners).
* **Key Insights:**
  1. *Friction is fatal:* Users abandon platforms that require credit cards or complex setup before showing lesson value.
  2. *Trust requires citation:* Users want to know *why* an answer is correct and where it originates.
  3. *Varied cognitive loads:* Explanations must adapt (e.g., "Explain like I'm 12" vs. "Technical deep-dive").

### Workstream C — Prototype Validation
* **Target:** 5–8 user testing sessions with high-fidelity interactive wireframes.
* **Criteria:** Can users discover a topic, read a section, answer a practice question, ask a follow-up to the AI tutor, and resume progress within 3 minutes?

### Workstream D — Technical & Cost Modeling
* **Target:** Token budget evaluation, latency benchmarking, and PostgreSQL schema feasibility.
* **Findings:** Unbounded LLM calls quickly inflate monthly operational costs. Introducing bounded sessions, token caps (1,500 output tokens max), and cached prompt templates keeps per-user pilot costs under $0.05/month.
