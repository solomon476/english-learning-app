import React, { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  Globe, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  Target, 
  Search 
} from 'lucide-react';
import { Topic, Lesson, LearningProgress } from '../types';

interface TopicCatalogProps {
  topics: Topic[];
  progressMap: Record<string, LearningProgress>;
  onSelectLesson: (lesson: Lesson) => void;
  onOpenTutor: () => void;
}

export const TopicCatalog: React.FC<TopicCatalogProps> = ({
  topics,
  progressMap,
  onSelectLesson,
  onOpenTutor
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Language & Communication', 'Logic & Philosophy', 'Technology & Systems'];

  const filteredTopics = topics.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lessons.some((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Find in-progress lesson for Resume Card
  const inProgressLessonEntry = Object.values(progressMap).find((p) => p.status === 'in_progress');
  let inProgressLesson: Lesson | null = null;
  if (inProgressLessonEntry) {
    for (const t of topics) {
      const match = t.lessons.find((l) => l.id === inProgressLessonEntry.lessonId);
      if (match) {
        inProgressLesson = match;
        break;
      }
    }
  }

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'book-open':
        return <BookOpen size={24} />;
      case 'brain':
        return <Brain size={24} />;
      case 'globe':
        return <Globe size={24} />;
      default:
        return <BookOpen size={24} />;
    }
  };

  return (
    <div className="catalog-wrapper">
      {/* Hero Visual Card */}
      <section className="hero-card" aria-labelledby="hero-heading">
        <img 
          src="/hero-wolf.jpg" 
          alt="Solian Wolves Constellation" 
          className="hero-background-art" 
        />
        <div className="hero-content">
          <div className="hero-tag">
            <Sparkles size={14} />
            <span>Curated Curriculum · Bounded AI Exploration</span>
          </div>
          <h1 id="hero-heading" className="hero-title">
            Master Unfamiliar Ideas. <br />
            <span className="gradient-text">Retain Lifelong Knowledge.</span>
          </h1>
          <p className="hero-desc">
            Explore trusted lessons across English syntax, critical mental models, and computer networks. 
            Reinforce comprehension through multi-level analogies, server-verified quizzes, and an AI tutor 
            grounded strictly in cited curricula.
          </p>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button 
              id="hero-start-learning-btn"
              className="btn btn-primary"
              onClick={() => {
                if (topics[0]?.lessons[0]) {
                  onSelectLesson(topics[0].lessons[0]);
                }
              }}
            >
              <Target size={16} />
              <span>Start Learning Journey</span>
            </button>
            <button 
              id="hero-ask-tutor-btn"
              className="btn btn-secondary"
              onClick={onOpenTutor}
            >
              <Brain size={16} />
              <span>Consult Grounded AI Tutor</span>
            </button>
          </div>

          <div className="hero-features-bar">
            <div className="hero-feature-pill">
              <ShieldCheck size={15} />
              <span>Server-Scored Assessments</span>
            </div>
            <div className="hero-feature-pill">
              <CheckCircle size={15} />
              <span>Zero Hallucinated Citations</span>
            </div>
            <div className="hero-feature-pill">
              <Sparkles size={15} />
              <span>Adaptive Analogy Engine</span>
            </div>
          </div>
        </div>
      </section>

      {/* Active Resume Card (FR-04) */}
      {inProgressLesson && (
        <aside className="resume-banner" aria-label="Resume Learning">
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.05em' }}>
              Resume Learning
            </span>
            <h4 style={{ margin: '0.15rem 0', color: '#ffffff' }}>
              {inProgressLesson.title}
            </h4>
            <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
              Estimated remaining time: {inProgressLesson.estMinutes} mins
            </span>
          </div>
          <button 
            id="resume-lesson-btn"
            className="btn btn-accent"
            onClick={() => onSelectLesson(inProgressLesson!)}
          >
            <span>Continue Lesson</span>
            <ChevronRight size={16} />
          </button>
        </aside>
      )}

      {/* Search and Category Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-secondary ${selectedCategory === cat ? 'active' : ''}`}
              style={{
                fontSize: '0.825rem',
                padding: '0.45rem 0.9rem',
                background: selectedCategory === cat ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: selectedCategory === cat ? 'var(--brand-cyan)' : 'var(--border-subtle)',
                color: selectedCategory === cat ? 'var(--brand-cyan)' : 'var(--text-secondary)'
              }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            id="topic-search-input"
            type="text"
            placeholder="Search topics, lessons, concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.85rem 0.5rem 2.25rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid-3" role="list">
        {filteredTopics.map((topic) => (
          <article key={topic.id} className="glass-card topic-card" role="listitem">
            <div>
              <div className="topic-header">
                <div className="topic-icon-box">
                  {getTopicIcon(topic.iconName)}
                </div>
                <span className="badge badge-status">
                  {topic.lessons.length} {topic.lessons.length === 1 ? 'Lesson' : 'Lessons'}
                </span>
              </div>

              <h3>{topic.name}</h3>
              <p style={{ marginTop: '0.45rem', fontSize: '0.875rem' }}>
                {topic.description}
              </p>
            </div>

            <div className="topic-lessons-list">
              <span style={{ fontSize: '0.725rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em' }}>
                Curriculum Modules
              </span>
              {topic.lessons.map((lesson) => {
                const progress = progressMap[lesson.id];
                const isCompleted = progress?.status === 'completed';

                return (
                  <div
                    key={lesson.id}
                    id={`lesson-card-${lesson.slug}`}
                    className="lesson-chip-item"
                    onClick={() => onSelectLesson(lesson)}
                    role="button"
                    tabIndex={0}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>
                          {lesson.title}
                        </span>
                        {isCompleted && (
                          <CheckCircle size={14} color="#10b981" />
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                        <span className={`badge badge-${lesson.level}`}>
                          {lesson.level}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} /> {lesson.estMinutes}m
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#64748b" />
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
