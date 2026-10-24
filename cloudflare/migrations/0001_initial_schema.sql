-- Cloudflare D1 Initial Schema Migration
-- Dialect: SQLite / Cloudflare D1 Relational Engine

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  email TEXT UNIQUE,
  preferred_level TEXT DEFAULT 'beginner' CHECK (preferred_level IN ('beginner', 'intermediate', 'advanced')),
  streak_days INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 2. Topics Table
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  icon_name TEXT DEFAULT 'book-open',
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- 3. Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  est_minutes INTEGER DEFAULT 10,
  summary TEXT NOT NULL,
  position INTEGER DEFAULT 1,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  version INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 4. Lesson Sections Table
CREATE TABLE IF NOT EXISTS lesson_sections (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  heading TEXT NOT NULL,
  body_standard TEXT NOT NULL,
  body_analogy TEXT,
  body_advanced TEXT,
  key_takeaway TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 5. Content Sources Table
CREATE TABLE IF NOT EXISTS content_sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  publisher TEXT NOT NULL,
  url TEXT NOT NULL,
  license_notes TEXT DEFAULT 'Educational Citation',
  accessed_at TEXT DEFAULT (datetime('now'))
);

-- 6. Lesson Sources Junction
CREATE TABLE IF NOT EXISTS lesson_sources (
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES content_sources(id) ON DELETE CASCADE,
  PRIMARY KEY (lesson_id, source_id)
);

-- 7. Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  pass_threshold_percent INTEGER DEFAULT 70,
  status TEXT DEFAULT 'published',
  created_at TEXT DEFAULT (datetime('now'))
);

-- 8. Questions Table (Answer keys are server-private!)
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  type TEXT DEFAULT 'multiple_choice',
  prompt TEXT NOT NULL,
  options_json TEXT NOT NULL, -- JSON string
  answer_key_json TEXT NOT NULL, -- PROTECTED: Server evaluated only
  explanation TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 9. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score REAL NOT NULL,
  total_points INTEGER NOT NULL,
  passed INTEGER NOT NULL DEFAULT 0,
  submitted_at TEXT DEFAULT (datetime('now'))
);

-- 10. Quiz Responses Table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  response_json TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 11. Learning Progress Table
CREATE TABLE IF NOT EXISTS learning_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  last_section_id TEXT,
  highest_quiz_score REAL DEFAULT 0,
  completed_at TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE (user_id, lesson_id)
);

-- 12. Tutor Sessions & Messages
CREATE TABLE IF NOT EXISTS tutor_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES lessons(id) ON DELETE SET NULL,
  mode TEXT DEFAULT 'explain',
  created_at TEXT DEFAULT (datetime('now')),
  retention_expires_at TEXT
);

CREATE TABLE IF NOT EXISTS tutor_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES tutor_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  sources_json TEXT DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now'))
);

-- 13. AI Usage & Audit Table
CREATE TABLE IF NOT EXISTS ai_usage (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  cost_estimate REAL DEFAULT 0.0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_d1_topics_slug ON topics(slug);
CREATE INDEX IF NOT EXISTS idx_d1_lessons_slug ON lessons(slug);
CREATE INDEX IF NOT EXISTS idx_d1_progress_user ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_d1_attempts_user ON quiz_attempts(user_id, quiz_id);
