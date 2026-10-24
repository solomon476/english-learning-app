# Solian Wolves Learning Platform — Product Requirements Document (PRD)

**Document Owner:** Solian Wolves Product & Engineering  
**Planning Baseline:** 24 October 2026 · Version 1.0  
**Status:** Approved for MVP Implementation & Pilot Validation

---

## 1. Product Vision & Goals

- **Vision:** Make it effortless for anyone to explore unfamiliar subjects, master challenging concepts, practice with feedback, and develop a lasting habit of inquiry.
- **Primary Objective:** Knowledge retention and active application over passive content scrolling.
- **Identity:** Autonomous Solian Wolves product, distinct from SomoBloom school-management workflows.

---

## 2. Target User Personas

| Persona | Core Need | Platform Capability |
| :--- | :--- | :--- |
| **Curious Beginner** | Lower cognitive barrier for new concepts | Multi-level explanations ("Analogies", "Foundations"), glossary tooltips |
| **Independent Explorer** | Follow curiosity rabbit-holes safely | In-context AI Tutor with 4 modes (Explain, Explore, Practice, Go Deeper) |
| **Skill Builder** | Hands-on application and validation | Server-scored quizzes, immediate feedback, problem breakdowns |
| **Returning Learner** | Seamless continuity across sessions | Persisted lesson checkpoints, resume cards, progress tracking |
| **Content Editor** | Reliable editorial quality & citation | Review workflow, source provenance, draft/publish lifecycle |

---

## 3. Functional Requirements Register

| ID | Feature | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-01** | Browse Topics | **Must (MVP)** | Users can browse published curated topics and select lessons across multiple difficulty levels. |
| **FR-02** | Read Lessons | **Must (MVP)** | Structured sections, key takeaways, diagrams, real-world examples, and verified source citations. |
| **FR-03** | Take Quizzes | **Must (MVP)** | Questions presented without answer keys; responses evaluated server-side with rich explanatory feedback. |
| **FR-04** | Track Progress | **Must (MVP)** | Authenticated session records section completion, quiz scores, and recent activity with resume links. |
| **FR-05** | Ask AI Tutor | **Must (Beta)** | Learners interact via bounded modes with prompt-injection defense and rate-limiting. |
| **FR-06** | Grounded Citations | **Must (Beta)** | AI responses cite actual retrieved curriculum sources, without inventing URLs or references. |
| **FR-07** | Explore Related Topics | **Should** | Lesson endings and tutor turns recommend natural adjacent learning pathways. |
| **FR-08** | Adaptive Complexity | **Should** | One-click toggling between "Beginner / Analogy", "Standard", and "In-Depth / Advanced" views. |
| **FR-09** | Profile & Privacy | **Must (MVP)** | Minimal data collection, full data export/deletion trigger compliant with Kenya DPA 2019. |
| **FR-10** | Content Administration | **Must** | Authoritative editorial pipeline (`draft` -> `review` -> `published` -> `archived`). |
| **FR-11** | PWA Support | **Later** | Service worker caching for offline lesson reading. |
| **FR-12** | Monetization & Tiers | **Later** | Optional subscription quotas for high-volume AI usage. |

---

## 4. Quality & Non-Functional Requirements

- **Performance:** Largest Contentful Paint (LCP) $\le 2.0$s on mobile 4G.
- **Accessibility:** Full WCAG 2.2 AA compliance: keyboard navigation, ARIA landmarks, $\ge 4.5:1$ contrast ratio.
- **Reliability:** Idempotent quiz submissions; zero progress data loss on client disconnects.
- **Security:** Strict separation of client state and answer keys; server-side token quota enforcement; CSP headers.
