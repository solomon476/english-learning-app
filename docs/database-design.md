# Solian Wolves Learning Platform — Database Design

**Engine:** PostgreSQL 15+ (with UUIDv4, RLS, and JSONB support)  
**Baseline Date:** 24 October 2026

---

## 1. Schema ER Diagram & Relationships

```
PROFILES (1) ───< LEARNING_PROGRESS (N)
PROFILES (1) ───< QUIZ_ATTEMPTS (N) ───< QUIZ_RESPONSES (N)
PROFILES (1) ───< TUTOR_SESSIONS (N) ───< TUTOR_MESSAGES (N)
PROFILES (1) ───< AI_USAGE (N)

TOPICS (1) ───< LESSONS (N)
LESSONS (1) ───< LESSON_SECTIONS (N)
LESSONS (1) ───< QUIZZES (1..N) ───< QUESTIONS (N)
LESSONS (M) ───< LESSON_SOURCES >─── (N) CONTENT_SOURCES
```

---

## 2. Table Specifications

### 2.1 Content Management Tables
- **`topics`**: Learning verticals (e.g., `english-foundations`, `critical-thinking`, `computer-networks`).
  - `id (uuid, PK)`, `slug (varchar, UNIQUE)`, `name (varchar)`, `description (text)`, `icon_name (varchar)`, `status (varchar DEFAULT 'published')`, `created_at (timestamptz)`
- **`lessons`**: Sequential and standalone learning modules.
  - `id (uuid, PK)`, `topic_id (uuid, FK)`, `slug (varchar, UNIQUE)`, `title (varchar)`, `level (varchar)`, `est_minutes (int)`, `summary (text)`, `status (varchar)`, `version (int)`, `created_at (timestamptz)`
- **`lesson_sections`**: Granular content blocks with headings, body markdown, and analogy toggles.
  - `id (uuid, PK)`, `lesson_id (uuid, FK)`, `position (int)`, `heading (varchar)`, `body_standard (text)`, `body_analogy (text)`, `body_advanced (text)`
- **`content_sources`**: External academic, literary, or technical citation sources.
  - `id (uuid, PK)`, `title (varchar)`, `publisher (varchar)`, `url (text)`, `license_notes (text)`, `accessed_at (timestamptz)`
- **`lesson_sources`**: Many-to-many junction connecting lessons to citations.

### 2.2 Assessment Tables
- **`quizzes`**: Assessment container tied to lessons.
  - `id (uuid, PK)`, `lesson_id (uuid, FK)`, `title (varchar)`, `status (varchar)`
- **`questions`**: Individual assessment questions with server-guarded keys.
  - `id (uuid, PK)`, `quiz_id (uuid, FK)`, `type (varchar: 'multiple_choice' | 'true_false' | 'fill_in')`, `prompt (text)`, `options_json (jsonb)`, `answer_key_json (jsonb, PRIVATE)`, `explanation (text)`
- **`quiz_attempts`**: Submitted user sessions and calculated scores.
  - `id (uuid, PK)`, `user_id (uuid, FK)`, `quiz_id (uuid, FK)`, `score (decimal)`, `total_points (int)`, `passed (boolean)`, `submitted_at (timestamptz)`
- **`quiz_responses`**: Granular per-question submitted answer and correctness.

### 2.3 User Progress & Tutor Tables
- **`profiles`**: User metadata, preferred learning complexity, streak counts.
- **`learning_progress`**: High-water mark per lesson (`not_started`, `in_progress`, `completed`).
- **`tutor_sessions` & `tutor_messages`**: Bounded conversational history with retention expiry.
- **`ai_usage`**: Explicit metering of input/output tokens and cost estimates per request.
