# Solian Wolves Learning Platform — Technical Architecture

**Planning Baseline:** 24 October 2026 · Version 1.0  
**Pattern:** Modular Monolith with Server-Enforced Boundaries

---

## 1. System Overview

```
 ┌──────────────────────────────────────────────────────────────┐
 │                     User Web Client (SPA)                   │
 │       React 19 + TypeScript + Vite + Responsive CSS         │
 └──────────────────────────────┬───────────────────────────────┘
                                │ HTTPS / REST / JSON
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │             Application & Gateway Services Layer             │
 │  - Input Validation & Rate Limiting                          │
 │  - Session / Auth Guard (Row Level Security & Tokens)        │
 │  - Server-Side Quiz Scoring Engine (Protected Answer Keys)   │
 │  - Progress State Reducer                                    │
 └──────────────┬───────────────────────────────┬───────────────┘
                │                               │
                ▼                               ▼
 ┌──────────────────────────────┐ ┌─────────────────────────────┐
 │    PostgreSQL (Supabase)     │ │     AI Tutor Boundary       │
 │  - Topics & Lessons Storage  │ │  - Quota & Token Metering   │
 │  - Verified Content Sources  │ │  - Source Retrieval Hook    │
 │  - User Progress & Attempts  │ │  - Provider Abstraction     │
 │  - Audit Logs & Usage Events │ │  - Output Validation Filter │
 └──────────────────────────────┘ └─────────────────────────────┘
```

---

## 2. Core Architectural Principles

1. **Answer Key Seclusion:**  
   Browser clients never receive correct answers or scoring keys before submission. All scoring happens server-side, returning an evaluated attempt with explanations.

2. **Provider-Agnostic Tutor Abstraction (`TutorProvider`):**  
   The core domain logic calls a decoupled `TutorProvider` interface with parameters:
   - `prompt`: Sanitized user query
   - `mode`: `'explain' | 'explore' | 'practice' | 'deep_dive'`
   - `level`: `'beginner' | 'intermediate' | 'advanced'`
   - `sources`: Array of validated retrieved curriculum items

3. **Source-Grounded Generation:**  
   AI responses must only reference content retrieved from the curated database. If no verified source exists for a specific claim, the system returns an empty sources array rather than hallucinating citations.

4. **Progress Continuity & Idempotency:**  
   Learning progress updates are idempotent, indexed by `(user_id, lesson_id)`, allowing seamless resume functionality across devices.
