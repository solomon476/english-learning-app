import React from 'react';
import { BookOpen, BookMarked, Award, User, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface MobileNavProps {
  activeView: 'catalog' | 'lesson' | 'quiz' | 'profile' | 'admin' | 'blueprint';
  onNavigate: (view: 'catalog' | 'lesson' | 'quiz' | 'profile' | 'admin' | 'blueprint') => void;
  onOpenTutor: () => void;
  hasActiveLesson: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeView,
  onNavigate,
  onOpenTutor,
  hasActiveLesson
}) => {
  const handleNavClick = (view: 'catalog' | 'lesson' | 'quiz' | 'profile' | 'admin' | 'blueprint') => {
    sounds.playPop();
    onNavigate(view);
  };

  const handleTutorClick = () => {
    sounds.playPop();
    onOpenTutor();
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <button
        id="mobile-nav-catalog-btn"
        className={`mobile-nav-item ${activeView === 'catalog' ? 'active' : ''}`}
        onClick={() => handleNavClick('catalog')}
      >
        <div className="mobile-nav-icon-wrap">
          <BookOpen size={20} />
        </div>
        <span>Topics</span>
      </button>

      <button
        id="mobile-nav-lesson-btn"
        className={`mobile-nav-item ${activeView === 'lesson' ? 'active' : ''} ${!hasActiveLesson ? 'disabled' : ''}`}
        onClick={() => {
          if (hasActiveLesson) handleNavClick('lesson');
        }}
        disabled={!hasActiveLesson}
        title={hasActiveLesson ? 'Current Lesson' : 'Select a lesson first'}
      >
        <div className="mobile-nav-icon-wrap">
          <BookMarked size={20} />
        </div>
        <span>Lesson</span>
      </button>

      {/* Center Wolfie Tutor Highlight Button */}
      <button
        id="mobile-nav-wolfie-btn"
        className="mobile-nav-item mobile-nav-tutor-highlight"
        onClick={handleTutorClick}
        aria-label="Ask Wolfie AI Tutor"
      >
        <div className="mobile-nav-wolfie-avatar mascot-bob">
          <img src="/mascot-tutor.jpg" alt="Wolfie" />
          <span className="wolfie-indicator-dot"></span>
        </div>
        <span className="wolfie-text-label">Ask Wolfie</span>
      </button>

      <button
        id="mobile-nav-quiz-btn"
        className={`mobile-nav-item ${activeView === 'quiz' ? 'active' : ''}`}
        onClick={() => handleNavClick('quiz')}
      >
        <div className="mobile-nav-icon-wrap">
          <Award size={20} />
        </div>
        <span>Quiz</span>
      </button>

      <button
        id="mobile-nav-profile-btn"
        className={`mobile-nav-item ${activeView === 'profile' ? 'active' : ''}`}
        onClick={() => handleNavClick('profile')}
      >
        <div className="mobile-nav-icon-wrap">
          <User size={20} />
        </div>
        <span>Journey</span>
      </button>
    </nav>
  );
};
