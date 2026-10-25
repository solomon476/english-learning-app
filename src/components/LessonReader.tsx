import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Lightbulb, 
  Brain, 
  HelpCircle, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2,
  Zap
} from 'lucide-react';
import type { Lesson, ComplexityLevel } from '../types';
import { sounds } from '../utils/soundEffects';

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

  const handleComplexityChange = (lvl: ComplexityLevel) => {
    sounds.playPop();
    setComplexity(lvl);
  };

  return (
    <div className="reader-wrapper">
      {/* Top Breadcrumb & Return Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button 
          id="reader-back-btn"
          className="btn btn-ghost" 
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          style={{ paddingLeft: 0 }}
        >
          <ArrowLeft size={16} />
          <span>Back to Quests Catalog</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`badge badge-${lesson.level}`}>
            {lesson.level} Level
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} /> {lesson.estMinutes} mins reading
          </span>
          <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Zap size={13} /> +50 XP
          </span>
        </div>
      </div>

      <div className="reader-container">
        {/* Main Content Area */}
        <main className="reader-main" role="main">
          <header>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--brand-green-dark)', fontWeight: 800, letterSpacing: '0.08em' }}>
              Quest Module {lesson.position}
            </span>
            <h1 style={{ fontSize: '2.1rem', marginTop: '0.25rem', marginBottom: '0.75rem', color: '#0f172a' }}>
              {lesson.title}
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#475569' }}>
              {lesson.summary}
            </p>
          </header>

          {/* Adaptive Complexity Switcher Lens (FR-08) */}
          <div className="glass-card" style={{ padding: '0.85rem 1.25rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Wolfie's Adaptive Lens:
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Toggle explanation depth on the fly
              </span>
            </div>

            <div className="complexity-switcher" role="radiogroup" aria-label="Complexity Filter">
              <button
                id="lens-beginner-btn"
                className={`complexity-btn ${complexity === 'beginner' ? 'active' : ''}`}
                onClick={() => handleComplexityChange('beginner')}
                role="radio"
                aria-checked={complexity === 'beginner'}
              >
                <span>🌱 Intuitive Analogy</span>
              </button>
              <button
                id="lens-intermediate-btn"
                className={`complexity-btn ${complexity === 'intermediate' ? 'active' : ''}`}
                onClick={() => handleComplexityChange('intermediate')}
                role="radio"
                aria-checked={complexity === 'intermediate'}
              >
                <span>📘 Standard Breakdown</span>
              </button>
              <button
                id="lens-advanced-btn"
                className={`complexity-btn ${complexity === 'advanced' ? 'active' : ''}`}
                onClick={() => handleComplexityChange('advanced')}
                role="radio"
                aria-checked={complexity === 'advanced'}
              >
                <span>🔬 Advanced Syntax</span>
              </button>
            </div>
          </div>

          {/* Section Tabs */}
          {lesson.sections.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              {lesson.sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  className={`btn btn-ghost ${activeSectionIndex === idx ? 'active' : ''}`}
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: activeSectionIndex === idx ? '#007a3c' : 'var(--text-secondary)',
                    borderBottom: activeSectionIndex === idx ? '2px solid #00a651' : 'none',
                    borderRadius: 0,
                    padding: '0.4rem 0.75rem'
                  }}
                  onClick={() => {
                    sounds.playPop();
                    setActiveSectionIndex(idx);
                  }}
                >
                  Section {idx + 1}: {sec.heading.substring(0, 24)}...
                </button>
              ))}
            </div>
          )}

          {/* Section Body */}
          <article className="glass-card" style={{ padding: '2rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <h2 style={{ color: '#0f172a' }}>{activeSection.heading}</h2>
              <button
                id="section-ask-tutor-btn"
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.8rem' }}
                onClick={() => {
                  sounds.playPop();
                  onAskTutor(activeSection.heading);
                }}
                title="Ask Wolfie to unpack this section"
              >
                <Brain size={15} color="#00a651" />
                <span>Ask Wolfie</span>
              </button>
            </div>

            <div className="section-body">
              {getSectionBody()}
            </div>

            {/* Key Takeaway Box */}
            <div className="takeaway-box">
              <div className="takeaway-icon">
                <Lightbulb size={24} color="#d97706" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: '#b45309', letterSpacing: '0.06em', marginBottom: '0.2rem', fontWeight: 800 }}>
                  Wolfie's Golden Rule
                </strong>
                <p style={{ color: '#78350f', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                  {activeSection.keyTakeaway}
                </p>
              </div>
            </div>
          </article>

          {/* Assessment Call-To-Action with 3D Pure Green Button */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', border: '1px solid #86efac' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.25rem', color: '#0f172a' }}>Ready to test your comprehension? 🎯</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
                Complete the server-validated practice drill to cement these ideas, earn <strong>+100 XP</strong>, and win <strong>15 Gems 💎</strong>!
              </p>
            </div>
            <button
              id="lesson-start-quiz-btn"
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
              onClick={() => {
                sounds.playPop();
                onStartQuiz();
              }}
            >
              <CheckCircle2 size={18} />
              <span>Take Lesson Quiz</span>
            </button>
          </div>
        </main>

        {/* Sidebar: Verified Sources & Wolfie Mascot Tip */}
        <aside className="reader-sidebar" aria-label="Curriculum Sources">
          {/* Wolfie Interactive Tip Card */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', background: '#ffffff' }}>
            <div className="mascot-avatar-circle" style={{ width: '56px', height: '56px', border: '2px solid #00a651' }}>
              <img src="/mascot-welcome.jpg" alt="Wolfie" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#007a3c', fontWeight: 800 }}>Wolfie Tip:</span>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
                Switching to "Intuitive Analogy" helps your brain visualize the scene before diving into formal grammar!
              </p>
            </div>
          </div>

          <div className="sources-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
              <ShieldCheck size={18} color="#00a651" />
              <h4 style={{ fontSize: '0.95rem', color: '#0f172a' }}>Verified Sources & Grounding</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
              Solian Wolves curriculum strictly references peer-reviewed and authoritative primary texts:
            </p>

            {lesson.sources.map((src) => (
              <div key={src.id} className="source-item">
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  {src.title}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Publisher: {src.publisher}
                </span>
                <span style={{ fontSize: '0.725rem', color: '#007a3c', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ExternalLink size={11} /> {src.licenseNotes}
                </span>
              </div>
            ))}

            <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.75rem', color: '#475569' }}>
              <strong style={{ color: '#0f172a' }}>Zero-Hallucination Guarantee:</strong> Wolfie answers inquiries using these exact validated sources.
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="glass-card" style={{ marginTop: '1.25rem', padding: '1.25rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
              <HelpCircle size={16} color="#00a651" />
              <h4 style={{ fontSize: '0.9rem', color: '#0f172a' }}>Need an Analogy?</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
              If any sentence feels dense, Wolfie can re-frame it using sports, cooking, or video game analogies!
            </p>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.825rem', padding: '0.5rem' }}
              onClick={() => {
                sounds.playPop();
                onAskTutor("Explain this using a simple everyday analogy");
              }}
            >
              <Brain size={15} color="#00a651" />
              <span>Ask Wolfie for Analogy</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
