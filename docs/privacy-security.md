# Solian Wolves Learning Platform — Privacy & Security Specification

**Regulatory Anchor:** Kenya Data Protection Act 2019 · Office of the Data Protection Commissioner (ODPC) Guidance on Children's Data  
**Baseline Date:** 24 October 2026

---

## 1. Data Minimization Principles

1. **Zero Unnecessary Profiling:**
   - Registration requires only a username/email and password.
   - Precise geolocation, phone numbers, and full dates of birth are not collected.
2. **Age-Appropriate Safeguards:**
   - Designed for general learners including teenagers. Content is family-safe and strictly educational.
   - Social messaging and unrestricted user-to-user communications are explicitly omitted from MVP scope to prevent child exploitation risks.
3. **Session Retention Policy:**
   - AI tutor message history expires and is purged after 30 days unless explicitly saved to user notes.
   - Deleted accounts result in complete cascading purge of `learning_progress`, `quiz_attempts`, and `tutor_sessions`.

---

## 2. Security Architecture

1. **No Client Secrets:**
   - AI API keys (e.g. OpenAI, Anthropic, or DeepMind API keys) are kept strictly in backend environment variables, never bundled into client Vite code.
2. **Server-Side Quiz Verification:**
   - Question answer keys are never delivered to the client during assessment. The client receives only `questionId`, `prompt`, `type`, and `options`. Scoring happens strictly on the backend.
3. **OWASP Top 10 Protections:**
   - Output HTML sanitization to prevent Stored XSS.
   - Content Security Policy (CSP) blocking unauthorized scripts.
   - Rate limiting on public and AI endpoints to thwart token exhaustion denial-of-service attacks.
