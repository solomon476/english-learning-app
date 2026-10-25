import React, { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  Globe, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Target, 
  Search,
  Zap
} from 'lucide-react';
import type { Topic, Lesson, LearningProgress } from '../types';
import { sounds } from '../utils/soundEffects';

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
      {/* Mascot Hero Card with Wolfie */}
      <section className="hero-card" aria-labelledby="hero-heading" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'center' }}>
          <div className="hero-content">
            <div className="hero-tag" style={{ background: '#f0fdf4', borderColor: '#86efac' }}>
              <Sparkles size={14} color="#00a651" />
              <span style={{ color: '#007a3c' }}>Gamified Learning · Meet Wolfie! 🐾</span>
            </div>
            
            <h1 id="hero-heading" className="hero-title">
              Level Up Your Mind. <br />
              <span className="gradient-text">One Quest at a Time.</span>
            </h1>
            
            <p className="hero-desc">
              Explore bitesize, interactive lessons in English rhetoric, critical thinking, and networks. 
              Earn XP, test yourself on server-scored drills, and get personalized help from Wolfie, your grounded AI tutor!
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                id="hero-start-learning-btn"
                className="btn btn-primary"
                onClick={() => {
                  sounds.playPop();
                  if (topics[0]?.lessons[0]) {
                    onSelectLesson(topics[0].lessons[0]);
                  }
                }}
              >
                <Target size={18} />
                <span>Start Daily Quest (+50 XP)</span>
              </button>
              
              <button 
                id="hero-ask-tutor-btn"
                className="btn btn-secondary"
                onClick={() => {
                  sounds.playPop();
                  onOpenTutor();
                }}
              >
                <Brain size={18} color="#00a651" />
                <span>Chat with Wolfie</span>
              </button>
            </div>

            <div className="hero-features-bar">
              <div className="hero-feature-pill">
                <span>🎯</span>
                <span>Server-Scored Drills</span>
              </div>
              <div className="hero-feature-pill">
                <span>📚</span>
                <span>Verified Source Grounding</span>
              </div>
              <div className="hero-feature-pill">
                <span>✨</span>
                <span>Adaptive Analogy Engine</span>
              </div>
            </div>
          </div>

          {/* Wolfie Animated Mascot Showcase */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="mascot-speech-bubble" style={{ marginBottom: '1rem', maxWidth: '240px', fontSize: '0.85rem' }}>
              "Awoo! 🐾 Ready to level up your English & critical thinking skills today?"
            </div>
            <div 
              className="mascot-avatar-circle mascot-bob"
              style={{ width: '180px', height: '180px', border: '4px solid #00a651', boxShadow: '0 0 25px rgba(0, 166, 81, 0.25)', background: '#ffffff' }}
            >
              <img src="/mascot-welcome.jpg" alt="Wolfie the Solian Wolf Mascot" />
            </div>
            <span style={{ marginTop: '0.65rem', fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
              Wolfie · Your Study Companion
            </span>
          </div>
        </div>
      </section>

      {/* Active Resume Card */}
      {inProgressLesson && (
        <aside className="resume-banner" aria-label="Resume Learning">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #00a651', background: '#ffffff' }}>
              <img src="/mascot-tutor.jpg" alt="Wolfie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#007a3c', fontWeight: 800, letterSpacing: '0.05em' }}>
                Quest In Progress
              </span>
              <h4 style={{ margin: '0.15rem 0', color: '#0f172a' }}>
                {inProgressLesson.title}
              </h4>
              <span style={{ fontSize: '0.825rem', color: '#475569' }}>
                ⏱️ {inProgressLesson.estMinutes} mins remaining · Earn +50 XP
              </span>
            </div>
          </div>
          <button 
            id="resume-lesson-btn"
            className="btn btn-accent"
            onClick={() => {
              sounds.playPop();
              onSelectLesson(inProgressLesson!);
            }}
          >
            <span>Continue Quest</span>
            <ChevronRight size={18} />
          </button>
        </aside>
      )}

      {/* Search and Category Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                className={`btn btn-secondary ${isSelected ? 'active' : ''}`}
                style={{
                  fontSize: '0.825rem',
                  padding: '0.5rem 1rem',
                  background: isSelected ? '#f0fdf4' : '#ffffff',
                  borderColor: isSelected ? '#00a651' : '#cbd5e1',
                  color: isSelected ? '#007a3c' : '#475569',
                  fontWeight: isSelected ? 800 : 600
                }}
                onClick={() => {
                  sounds.playPop();
                  setSelectedCategory(cat);
                }}
              >
                {cat}
              </button>
            );
          })}
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
              padding: '0.6rem 0.85rem 0.6rem 2.25rem',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              color: '#0f172a',
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
                <div className="topic-icon-box" style={{ background: '#f0fdf4', borderColor: '#86efac', color: '#00a651' }}>
                  {getTopicIcon(topic.iconName)}
                </div>
                <span className="badge badge-status" style={{ fontWeight: 800 }}>
                  {topic.lessons.length} {topic.lessons.length === 1 ? 'Lesson' : 'Lessons'}
                </span>
              </div>

              <h3 style={{ color: '#0f172a' }}>{topic.name}</h3>
              <p style={{ marginTop: '0.45rem', fontSize: '0.875rem', color: '#475569' }}>
                {topic.description}
              </p>
            </div>

            <div className="topic-lessons-list">
              <span style={{ fontSize: '0.725rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, letterSpacing: '0.08em' }}>
                Curriculum Quests
              </span>
              {topic.lessons.map((lesson) => {
                const progress = progressMap[lesson.id];
                const isCompleted = progress?.status === 'completed';

                return (
                  <div
                    key={lesson.id}
                    id={`lesson-card-${lesson.slug}`}
                    className="lesson-chip-item"
                    onClick={() => {
                      sounds.playPop();
                      onSelectLesson(lesson);
                    }}
                    role="button"
                    tabIndex={0}
                    style={{ borderRadius: '14px', padding: '0.85rem 1rem' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                          {lesson.title}
                        </span>
                        {isCompleted && (
                          <CheckCircle size={15} color="#00a651" />
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
                        <span className={`badge badge-${lesson.level}`}>
                          {lesson.level}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} /> {lesson.estMinutes}m
                        </span>
                        <span style={{ color: '#b45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                          <Zap size={12} /> +50 XP
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} color="#94a3b8" />
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
