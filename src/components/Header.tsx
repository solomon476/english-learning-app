import React from 'react';
import { BookOpen, Brain, Flame, Shield, User, FileText } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeView: 'catalog' | 'lesson' | 'quiz' | 'profile' | 'admin' | 'blueprint';
  onNavigate: (view: 'catalog' | 'lesson' | 'quiz' | 'profile' | 'admin' | 'blueprint') => void;
  userProfile: UserProfile | null;
  onOpenTutor: () => void;
  hasActiveLesson: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  userProfile,
  onOpenTutor,
  hasActiveLesson
}) => {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        {/* Brand Identity */}
        <div 
          className="brand-wrapper" 
          onClick={() => onNavigate('catalog')}
          role="button"
          tabIndex={0}
          id="nav-brand-logo"
        >
          <div className="brand-logo-crest">
            <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
              <path d="M14 46 L20 22 L28 32 L36 14 L44 30 L50 22 L48 46 Z" fill="url(#crestGrad)" />
              <defs>
                <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-text-container">
            <span className="brand-title">Solian Wolves</span>
            <span className="brand-subtitle">Learning Platform</span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="nav-links" aria-label="Main Navigation">
          <button
            id="nav-catalog-btn"
            className={`nav-btn ${activeView === 'catalog' ? 'active' : ''}`}
            onClick={() => onNavigate('catalog')}
          >
            <BookOpen size={16} />
            <span>Topics</span>
          </button>

          {hasActiveLesson && (
            <button
              id="nav-lesson-btn"
              className={`nav-btn ${activeView === 'lesson' ? 'active' : ''}`}
              onClick={() => onNavigate('lesson')}
            >
              <span>Current Lesson</span>
            </button>
          )}

          <button
            id="nav-quiz-btn"
            className={`nav-btn ${activeView === 'quiz' ? 'active' : ''}`}
            onClick={() => onNavigate('quiz')}
          >
            <span>Practice Quiz</span>
          </button>

          <button
            id="nav-profile-btn"
            className={`nav-btn ${activeView === 'profile' ? 'active' : ''}`}
            onClick={() => onNavigate('profile')}
          >
            <User size={16} />
            <span>Progress & Privacy</span>
          </button>

          <button
            id="nav-admin-btn"
            className={`nav-btn ${activeView === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            <Shield size={16} />
            <span>Editorial Admin</span>
          </button>

          <button
            id="nav-blueprint-btn"
            className={`nav-btn ${activeView === 'blueprint' ? 'active' : ''}`}
            onClick={() => onNavigate('blueprint')}
          >
            <FileText size={16} />
            <span>Blueprint V1.0</span>
          </button>
        </nav>

        {/* User Status Badges & Tutor Trigger */}
        <div className="header-actions">
          {userProfile && (
            <div className="streak-badge" title="Consecutive daily learning streak">
              <Flame size={15} />
              <span>{userProfile.streakDays}d Streak</span>
            </div>
          )}

          <button
            id="header-open-tutor-btn"
            className="btn btn-primary"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem' }}
            onClick={onOpenTutor}
          >
            <Brain size={15} />
            <span>AI Tutor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
