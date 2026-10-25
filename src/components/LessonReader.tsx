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
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} /> {lesson.estMinutes} mins reading
          </span>
          <span style={{ fontSize: '0.8rem', color: '#fcd34d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Zap size={13} /> +50 XP
          </span>
        </div>
      </div>

      <div className="reader-container">
        {/* Main Content Area */}
        <main className="reader-main" role="main">
          <header>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--brand-cyan)', fontWeight: 800, letterSpacing: '0.08em' }}>
              Quest Module {lesson.position}
            </span>
            <h1 style={{ fontSize: '2.1rem', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
              {lesson.title}
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#94a3b8' }}>
              {lesson.summary}
            </p>
          </header>

          {/* Adaptive Complexity Switcher Lens (FR-08) */}
          <div className="glass-card" style={{ padding: '0.85rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Wolfie's Adaptive Lens:
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
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
                    color: activeSectionIndex === idx ? 'var(--brand-cyan)' : 'var(--text-secondary)',
                    borderBottom: activeSectionIndex === idx ? '2px solid var(--brand-cyan)' : 'none',
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
          <article className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <h2>{activeSection.heading}</h2>
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
                <Brain size={15} color="#38bdf8" />
                <span>Ask Wolfie</span>
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
                <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: '#f59e0b', letterSpacing: '0.06em', marginBottom: '0.2rem', fontWeight: 800 }}>
                  Wolfie's Golden Rule
                </strong>
                <p style={{ color: '#fef3c7', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                  {activeSection.keyTakeaway}
                </p>
              </div>
            </div>
          </article>

          {/* Assessment Call-To-Action with 3D Button */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.12) 100%)' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>Ready to test your comprehension? 🎯</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>
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
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="mascot-avatar-circle" style={{ width: '56px', height: '56px', border: '2px solid #38bdf8' }}>
              <img src="/mascot-welcome.jpg" alt="Wolfie" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800 }}>Wolfie Tip:</span>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                Switching to "Intuitive Analogy" helps your brain visualize the scene before diving into formal grammar!
              </p>
            </div>
          </div>

          <div className="sources-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
              <ShieldCheck size={18} color="#10b981" />
              <h4 style={{ fontSize: '0.95rem', color: '#ffffff' }}>Verified Sources & Grounding</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Solian Wolves curriculum strictly references peer-reviewed and authoritative primary texts:
            </p>

            {lesson.sources.map((src) => (
              <div key={src.id} className="source-item">
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
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

            <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', fontSize: '0.75rem', color: '#94a3b8' }}>
              <strong>Zero-Hallucination Guarantee:</strong> Wolfie answers inquiries using these exact validated sources.
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="glass-card" style={{ marginTop: '1.25rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
              <HelpCircle size={16} color="#38bdf8" />
              <h4 style={{ fontSize: '0.9rem' }}>Need an Analogy?</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
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
              <Brain size={15} />
              <span>Ask Wolfie for Analogy</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
