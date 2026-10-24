-- Cloudflare D1 Curriculum Seed Data
INSERT OR IGNORE INTO topics (id, slug, name, description, category, icon_name, status) VALUES
('11111111-1111-1111-1111-111111111111', 'english-foundations', 'English Foundations & Nuance', 'Master clarity, active voice, rhetorical force, and high-impact vocabulary for powerful expression.', 'Language & Communication', 'book-open', 'published'),
('22222222-2222-2222-2222-222222222222', 'critical-thinking', 'Critical Thinking & Mental Models', 'Detect cognitive biases, evaluate evidence, dismantle fallacies, and reason from first principles.', 'Logic & Philosophy', 'brain', 'published'),
('33333333-3333-3333-3333-333333333333', 'how-the-internet-works', 'How the Internet & Networks Work', 'Demystify packets, IP routing, DNS, HTTP/3, and the physical backbone connecting our planet.', 'Technology & Systems', 'globe', 'published');

INSERT OR IGNORE INTO content_sources (id, title, publisher, url, license_notes) VALUES
('aaaa1111-aaaa-1111-aaaa-111111111111', 'The Elements of Style (Fourth Edition)', 'Strunk & White / Pearson', 'https://www.bartleby.com/141/', 'Academic Fair Use'),
('aaaa2222-aaaa-2222-aaaa-222222222222', 'Thinking, Fast and Slow', 'Daniel Kahneman / Farrar, Straus and Giroux', 'https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow', 'Citing research findings'),
('aaaa3333-aaaa-3333-aaaa-333333333333', 'RFC 9110: HTTP Semantics & RFC 1035: DNS Specification', 'Internet Engineering Task Force (IETF)', 'https://www.rfc-editor.org/rfc/rfc9110', 'Open Standards');

INSERT OR IGNORE INTO lessons (id, topic_id, slug, title, level, est_minutes, summary, position, status) VALUES
('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'active-voice-and-impact', 'Active Voice: The Engine of Clear Writing', 'beginner', 8, 'Learn how to invigorate your prose, eliminate ambiguity, and make your sentences hit with kinetic force.', 1, 'published');

INSERT OR IGNORE INTO lesson_sources (lesson_id, source_id) VALUES
('b1111111-1111-1111-1111-111111111111', 'aaaa1111-aaaa-1111-aaaa-111111111111');
