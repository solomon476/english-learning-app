# Solian Wolves Learning Platform — API Specification

**Base URL:** `/api/v1`  
**Standard Response Format:** JSON with UTC timestamps and standard error objects.

---

## 1. Public Content Endpoints

### `GET /api/v1/topics`
* **Access:** Public
* **Description:** Retrieves all published learning verticals with lesson counts.
* **Response (200):**
  ```json
  [
    {
      "id": "e30129bc-69a4-49c8-97cb-2ef8d61f5c6b",
      "slug": "english-foundations",
      "name": "English Foundations & Nuance",
      "description": "Master high-impact vocabulary, sentence architecture, and persuasive rhetoric.",
      "icon": "book-open",
      "lessonCount": 4
    }
  ]
  ```

### `GET /api/v1/topics/:slug`
* **Access:** Public
* **Description:** Returns topic metadata and nested list of published lessons with status.

### `GET /api/v1/lessons/:slug`
* **Access:** Public
* **Description:** Returns full lesson content, multi-level explanations, and associated sources.

### `GET /api/v1/lessons/:id/quizzes`
* **Access:** Public
* **Description:** Returns quiz metadata and questions. **Answer keys are excluded.**

---

## 2. Assessment & Progress Endpoints

### `POST /api/v1/quizzes/:id/attempts`
* **Access:** Authenticated
* **Payload:**
  ```json
  {
    "responses": [
      { "questionId": "q-101", "selectedOptionId": "opt-b" },
      { "questionId": "q-102", "selectedOptionId": "opt-a" }
    ]
  }
  ```
* **Processing:**
  1. Validates question IDs against the quiz.
  2. Compares against server-side `answer_key_json`.
  3. Computes score and feedback per item.
  4. Records `quiz_attempts` and `quiz_responses`.
  5. Updates `learning_progress` to mark the lesson completed if passing threshold is met.
* **Response (200):**
  ```json
  {
    "attemptId": "att-4592",
    "score": 100,
    "totalPoints": 2,
    "passed": true,
    "breakdown": [
      {
        "questionId": "q-101",
        "isCorrect": true,
        "correctOptionId": "opt-b",
        "explanation": "Active voice places the agent performing the action before the verb."
      }
    ]
  }
  ```

### `GET /api/v1/me/progress`
* **Access:** Authenticated
* **Description:** Returns user's active lessons, completion percentages, streak count, and last active timestamp.

### `PUT /api/v1/me/progress/:lessonId`
* **Access:** Authenticated
* **Payload:**
  ```json
  {
    "status": "in_progress",
    "lastSectionId": "sec-03"
  }
  ```

---

## 3. AI Tutor Endpoints

### `POST /api/v1/tutor/sessions/:id/messages`
* **Access:** Authenticated (Rate limited: 20 queries/hr in free tier)
* **Payload:**
  ```json
  {
    "message": "Can you explain the difference between active and passive voice using a sports analogy?",
    "mode": "explain",
    "level": "beginner",
    "context": {
      "lessonId": "les-101",
      "topicSlug": "english-foundations"
    }
  }
  ```
* **Response (200):**
  ```json
  {
    "messageId": "msg-9921",
    "answer": "In sports: Active voice is 'The striker kicked the ball into the net' (the player takes action). Passive voice is 'The ball was kicked into the net by the striker' (the action happens to the ball).",
    "mode": "explain",
    "sources": [
      {
        "title": "Elements of Style: Active vs Passive Voice",
        "url": "https://curriculum.solianwolves.org/english/active-voice",
        "publisher": "Solian Wolves Editorial"
      }
    ],
    "followUpSuggestions": [
      "When is passive voice actually preferable in formal writing?",
      "Can we do a quick practice drill to test my identification?"
    ],
    "usage": {
      "inputTokens": 412,
      "outputTokens": 98,
      "costEstimate": 0.0004
    }
  }
  ```

---

## 4. Account & Privacy Endpoints

### `DELETE /api/v1/me/data`
* **Access:** Authenticated
* **Description:** Permanently wipes learning progress, quiz attempts, tutor sessions, and profile data in compliance with Kenya DPA 2019.
