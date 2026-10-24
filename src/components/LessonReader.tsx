import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Lightbulb, 
  Brain, 
  HelpCircle, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { Lesson, ComplexityLevel } from '../types';

interface LessonReaderProps {
  lesson: Lesson;
  onBack: () => void;
  onStartQuiz: () => void;
  onAskTutor: (sectionHeading: string) => void;
}

export const LessonReader: React.FC<LessonReaderProps> = ({
  lesson,
  onBack,
  onStartQuiz,
  onAskTutor
}) => {
  const [complexity, setComplexity] = useState<ComplexityLevel>('beginner');
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);

  const activeSection = lesson.sections[activeSectionIndex] || lesson.sections[0];

  const getSectionBody = () => {
    switch (complexity) {
      case 'beginner':
        return activeSection.bodyAnalogy || activeSection.bodyStandard;
      case 'advanced':
        return activeSection.bodyAdvanced || activeSection.bodyStandard;
      case 'intermediate':
      default:
        return activeSection.bodyStandard;
    }
  };

  return (
    <div className="reader-wrapper">
      {/* Top Breadcrumb & Return Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button 
          id="reader-back-btn"
          className="btn btn-ghost" 
          onClick={onBack}
          style={{ paddingLeft: 0 }}
        >
          <ArrowLeft size={16} />
          <span>Back to Curriculum Catalog</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`badge badge-${lesson.level}`}>
            {lesson.level} Level
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} /> {lesson.estMinutes} mins reading
          </span>
        </div>
      </div>

      <div className="reader-container">
        {/* Main Content Area */}
        <main className="reader-main" role="main">
          <header>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--brand-cyan)', fontWeight: 700, letterSpacing: '0.08em' }}>
              Lesson {lesson.position} of Module
            </span>
            <h1 style={{ fontSize: '2rem', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
              {lesson.title}
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#94a3b8' }}>
              {lesson.summary}
            </p>
          </header>

          {/* Adaptive Complexity Switcher (FR-08) */}
          <div className="glass-card" style={{ padding: '0.75rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Adaptive Explanation Lens:
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Toggle level to adjust vocabulary and cognitive framing
              </span>
            </div>

            <div className="complexity-switcher" role="radiogroup" aria-label="Complexity Filter">
              <button
                id="lens-beginner-btn"
                className={`complexity-btn ${complexity === 'beginner' ? 'active' : ''}`}
                onClick={() => setComplexity('beginner')}
                role="radio"
                aria-checked={complexity === 'beginner'}
              >
                <span>🌱 Intuitive Analogy</span>
              </button>
              <button
                id="lens-intermediate-btn"
                className={`complexity-btn ${complexity === 'intermediate' ? 'active' : ''}`}
                onClick={() => setComplexity('intermediate')}
                role="radio"
                aria-checked={complexity === 'intermediate'}
              >
                <span>📘 Standard Breakdown</span>
              </button>
              <button
                id="lens-advanced-btn"
                className={`complexity-btn ${complexity === 'advanced' ? 'active' : ''}`}
                onClick={() => setComplexity('advanced')}
                role="radio"
                aria-checked={complexity === 'advanced'}
              >
                <span>🔬 Advanced First-Principles</span>
              </button>
            </div>
          </div>

          {/* Section Section Tabs if multiple sections */}
          {lesson.sections.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              {lesson.sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  className={`btn btn-ghost ${activeSectionIndex === idx ? 'active' : ''}`}
                  style={{
                    fontSize: '0.85rem',
                    color: activeSectionIndex === idx ? 'var(--brand-cyan)' : 'var(--text-secondary)',
                    borderBottom: activeSectionIndex === idx ? '2px solid var(--brand-cyan)' : 'none',
                    borderRadius: 0,
                    padding: '0.4rem 0.75rem'
                  }}
                  onClick={() => setActiveSectionIndex(idx)}
                >
                  Section {idx + 1}: {sec.heading.substring(0, 24)}...
                </button>
              ))}
            </div>
          )}

          {/* Section Body */}
          <article className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <h2>{activeSection.heading}</h2>
              <button
                id="section-ask-tutor-btn"
                className="btn btn-secondary"
                style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}
                onClick={() => onAskTutor(activeSection.heading)}
                title="Ask the AI Tutor to unpack this section"
              >
                <Brain size={14} color="#38bdf8" />
                <span>Ask Tutor About This</span>
              </button>
            </div>

            <div className="section-body">
              {getSectionBody()}
            </div>

            {/* Key Takeaway Gold Box */}
            <div className="takeaway-box">
              <div className="takeaway-icon">
                <Lightbulb size={24} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: '#f59e0b', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                  Core Takeaway
                </strong>
                <p style={{ color: '#fef3c7', fontSize: '0.95rem', margin: 0 }}>
                  {activeSection.keyTakeaway}
                </p>
              </div>
            </div>
          </article>

          {/* Assessment Call-To-Action */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(56, 189, 248, 0.1) 100%)' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Ready to test your comprehension?</h3>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                Complete the server-validated practice drill to cement these ideas and boost your learning streak.
              </p>
            </div>
            <button
              id="lesson-start-quiz-btn"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
              onClick={onStartQuiz}
            >
              <CheckCircle2 size={18} />
              <span>Take Lesson Quiz</span>
            </button>
          </div>
        </main>

        {/* Sidebar: Verified Sources & Citations (FR-06) */}
        <aside className="reader-sidebar" aria-label="Curriculum Sources">
          <div className="sources-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
              <ShieldCheck size={18} color="#10b981" />
              <h4 style={{ fontSize: '0.95rem', color: '#ffffff' }}>Verified Sources & Grounding</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Solian Wolves curriculum strictly references peer-reviewed or authoritative primary texts:
            </p>

            {lesson.sources.map((src) => (
              <div key={src.id} className="source-item">
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>
                  {src.title}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Publisher: {src.publisher}
                </span>
                <span style={{ fontSize: '0.725rem', color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ExternalLink size={11} /> {src.licenseNotes}
                </span>
              </div>
            ))}

            <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
              <strong>Zero-Hallucination Guarantee:</strong> The in-context AI tutor uses these exact source documents to answer questions.
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="glass-card" style={{ marginTop: '1.25rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
              <HelpCircle size={16} color="#38bdf8" />
              <h4 style={{ fontSize: '0.9rem' }}>Need an Analogy?</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              If any sentence feels dense, the AI tutor can re-frame it using sports, architecture, or everyday concepts.
            </p>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.8rem', padding: '0.45rem' }}
              onClick={() => onAskTutor("Explain this using a simple everyday analogy")}
            >
              <Brain size={14} />
              <span>Ask Tutor for Analogy</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
