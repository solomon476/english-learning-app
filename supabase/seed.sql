-- Solian Wolves Learning Platform: Seed Data
-- High-yield topics, structured lessons, sections, quizzes, questions, and sources.

-- Insert Topics
INSERT INTO topics (id, slug, name, description, category, icon_name, status) VALUES
('11111111-1111-1111-1111-111111111111', 'english-foundations', 'English Foundations & Nuance', 'Master clarity, active voice, rhetorical force, and high-impact vocabulary for powerful expression.', 'Language & Communication', 'book-open', 'published'),
('22222222-2222-2222-2222-222222222222', 'critical-thinking', 'Critical Thinking & Mental Models', 'Detect cognitive biases, evaluate evidence, dismantle fallacies, and reason from first principles.', 'Logic & Philosophy', 'brain', 'published'),
('33333333-3333-3333-3333-333333333333', 'how-the-internet-works', 'How the Internet & Networks Work', 'Demystify packets, IP routing, DNS, HTTP/3, and the physical backbone connecting our planet.', 'Technology & Systems', 'globe', 'published')
ON CONFLICT (id) DO NOTHING;

-- Insert Content Sources
INSERT INTO content_sources (id, title, publisher, url, license_notes) VALUES
('aaaa1111-aaaa-1111-aaaa-111111111111', 'The Elements of Style (Fourth Edition)', 'Strunk & White / Pearson', 'https://www.bartleby.com/141/', 'Academic Fair Use'),
('aaaa2222-aaaa-2222-aaaa-222222222222', 'Thinking, Fast and Slow', 'Daniel Kahneman / Farrar, Straus and Giroux', 'https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow', 'Citing research findings'),
('aaaa3333-aaaa-3333-aaaa-333333333333', 'RFC 9110: HTTP Semantics & RFC 1035: DNS Specification', 'Internet Engineering Task Force (IETF)', 'https://www.rfc-editor.org/rfc/rfc9110', 'Open Standards')
ON CONFLICT (id) DO NOTHING;

-- Insert Lessons for English Foundations
INSERT INTO lessons (id, topic_id, slug, title, level, est_minutes, summary, position, status) VALUES
('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'active-voice-and-impact', 'Active Voice: The Engine of Clear Writing', 'beginner', 8, 'Learn how to invigorate your prose, eliminate ambiguity, and make your sentences hit with kinetic force.', 1, 'published'),
('b2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'subtle-connotations-and-tone', 'Connotations: The Hidden Emotional Subtext', 'intermediate', 12, 'Explore how synonyms carry wildly different emotional gravity, cultural weight, and diplomatic nuances.', 2, 'published')
ON CONFLICT (id) DO NOTHING;

-- Connect Sources to Lesson 1
INSERT INTO lesson_sources (lesson_id, source_id) VALUES
('b1111111-1111-1111-1111-111111111111', 'aaaa1111-aaaa-1111-aaaa-111111111111')
ON CONFLICT DO NOTHING;

-- Insert Sections for Lesson 1
INSERT INTO lesson_sections (id, lesson_id, position, heading, body_standard, body_analogy, body_advanced, key_takeaway) VALUES
('c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 1, 
'Who is Doing What? The Anatomy of an Action',
'Every sentence tells a mini-story about an action. When writing in the active voice, the subject of your sentence is the actor—the entity physically or logically performing the verb. 

For example:
• Active: "The engineer repaired the underwater cable." (Actor: Engineer -> Action: Repaired -> Target: Cable)
• Passive: "The underwater cable was repaired by the engineer."

In the active sentence, the energy flows straight from the actor to the object. It is crisp, vigorous, and direct.',
'Imagine a movie camera tracking a football game. Active voice points the lens directly at the striker kicking the ball. Passive voice points the lens at the ball floating through the air, and only reveals the kicker as an afterthought.',
'From a syntactic perspective, active voice aligns the grammatical subject with the semantic "Agent" (Theta-role assigner). This minimizes working memory overhead during sentence parsing, resulting in 20-30% faster reading comprehension under eye-tracking benchmarks.',
'Lead with the actor doing the action whenever clarity and kinetic energy are your goals.'),

('c2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 2,
'When Passive Voice is Actually Justified',
'Passive voice gets an undeserved bad reputation as something to "never use". In reality, skilled writers deploy the passive deliberately when:
1. The actor is completely unknown: "The ancient parchment was discovered in 1892."
2. The recipient or result is the true focus of importance: "The vaccine was approved by regulators yesterday."
3. Diplomatic de-escalation: "A mistake was made in the ledger" rather than pointing an accusatory finger.

The secret is intentionality: use active voice as your default, and switch to passive only when the receiver deserves the spotlight.',
'Think of a hospital report. If a doctor successfully treats a patient, the headline is "Patient Cured of Rare Virus". The cured patient is the hero of the headline, not the chemical syringe.',
'Discourse analysis demonstrates that passive voice functions as an information packaging strategy, moving known (thematic) information to the front of the clause while reserving the end-weight position for new focus information.',
'Default to active voice, but deliberately choose passive voice when the victim, recipient, or consequence matters more than the actor.');

-- Insert Quiz for Lesson 1
INSERT INTO quizzes (id, lesson_id, title, pass_threshold_percent, status) VALUES
('q1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Active Voice Mastery & Sentence Force', 75, 'published')
ON CONFLICT (id) DO NOTHING;

-- Insert Questions for Quiz 1
INSERT INTO questions (id, quiz_id, position, type, prompt, options_json, answer_key_json, explanation) VALUES
('ques-001', 'q1111111-1111-1111-1111-111111111111', 1, 'multiple_choice',
'Which of the following sentences is written in the ACTIVE voice?',
'[
  {"id": "opt-a", "text": "The critical security vulnerability was patched by our lead developer at midnight."},
  {"id": "opt-b", "text": "Our lead developer patched the critical security vulnerability at midnight."},
  {"id": "opt-c", "text": "A patch was applied to the system by the security team."},
  {"id": "opt-d", "text": "The system was restored after the incident."}
]'::jsonb,
'{"correctOptionId": "opt-b"}'::jsonb,
'Option B puts the actor ("Our lead developer") in the subject position directly executing the verb ("patched"). The other options bury the actor behind prepositional phrases or omit it entirely.'),

('ques-002', 'q1111111-1111-1111-1111-111111111111', 2, 'multiple_choice',
'In which scenario is deliberate PASSIVE voice the most effective editorial choice?',
'[
  {"id": "opt-a", "text": "In a fast-paced thriller novel describing a duel between two swordfighters."},
  {"id": "opt-b", "text": "In a corporate marketing email urging a customer to claim their discount."},
  {"id": "opt-c", "text": "In a crime report where the perpetrator is currently unidentified (e.g., ''The museum was burgled during the storm'')."},
  {"id": "opt-d", "text": "In a speech rallying a soccer team to score a victory."}
]'::jsonb,
'{"correctOptionId": "opt-c"}'::jsonb,
'When the actor is completely unknown or the victim/target is the primary concern, passive voice accurately reflects the informational reality without clumsy placeholders.')
ON CONFLICT (id) DO NOTHING;
