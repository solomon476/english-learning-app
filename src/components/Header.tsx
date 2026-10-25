import React, { useState } from 'react';
import { BookOpen, Brain, Flame, Shield, User, FileText, Volume2, VolumeX, Sparkles } from 'lucide-react';
import type { UserProfile } from '../types';
import { sounds } from '../utils/soundEffects';

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
  const [soundOn, setSoundOn] = useState<boolean>(sounds.isEnabled());

  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setSoundOn(newState);
    if (newState) sounds.playPop();
  };

  const handleNavClick = (view: 'catalog' | 'lesson' | 'quiz' | 'profile' | 'admin' | 'blueprint') => {
    sounds.playPop();
    onNavigate(view);
  };

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        {/* Brand Identity with Mascot Emblem */}
        <div 
          className="brand-wrapper" 
          onClick={() => handleNavClick('catalog')}
          role="button"
          tabIndex={0}
          id="nav-brand-logo"
        >
          <div className="brand-logo-crest" style={{ overflow: 'hidden', padding: 0 }}>
            <img 
              src="/mascot-welcome.jpg" 
              alt="Wolfie Mascot" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div className="brand-text-container">
            <span className="brand-title" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Solian Wolves <span style={{ fontSize: '0.85rem' }}>🐾</span>
            </span>
            <span className="brand-subtitle">Learn with Wolfie</span>
          </div>
        </div>

        {/* Primary Navigation (Desktop) */}
        <nav className="nav-links desktop-nav" aria-label="Main Navigation">
          <button
            id="nav-catalog-btn"
            className={`nav-btn ${activeView === 'catalog' ? 'active' : ''}`}
            onClick={() => handleNavClick('catalog')}
          >
            <BookOpen size={16} />
            <span>Topics</span>
          </button>

          {hasActiveLesson && (
            <button
              id="nav-lesson-btn"
              className={`nav-btn ${activeView === 'lesson' ? 'active' : ''}`}
              onClick={() => handleNavClick('lesson')}
            >
              <span>Current Lesson</span>
            </button>
          )}

          <button
            id="nav-quiz-btn"
            className={`nav-btn ${activeView === 'quiz' ? 'active' : ''}`}
            onClick={() => handleNavClick('quiz')}
          >
            <span>Practice Quiz</span>
          </button>

          <button
            id="nav-profile-btn"
            className={`nav-btn ${activeView === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('profile')}
          >
            <User size={16} />
            <span>My Journey</span>
          </button>

          <button
            id="nav-admin-btn"
            className={`nav-btn ${activeView === 'admin' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin')}
          >
            <Shield size={16} />
            <span>Admin</span>
          </button>

          <button
            id="nav-blueprint-btn"
            className={`nav-btn ${activeView === 'blueprint' ? 'active' : ''}`}
            onClick={() => handleNavClick('blueprint')}
          >
            <FileText size={16} />
            <span>Blueprint</span>
          </button>
        </nav>

        {/* Gamified Status Counters (Streak, Gems & Audio) */}
        <div className="header-actions">
          {/* Gems Counter */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              padding: '0.35rem 0.75rem', 
              background: '#f0fdf4', 
              border: '1px solid #86efac', 
              borderRadius: '20px', 
              fontSize: '0.825rem', 
              fontWeight: 800, 
              color: '#007a3c' 
            }}
            title="Learning Gems Earned"
          >
            <span>💎</span>
            <span>{userProfile ? userProfile.totalCompletedLessons * 15 : 0}</span>
          </div>

          {/* Daily Streak Flame with Animation */}
          {userProfile && (
            <div className="streak-badge" title="Consecutive daily learning streak">
              <span className="flame-wiggle">🔥</span>
              <span>{userProfile.streakDays}d Streak</span>
            </div>
          )}

          {/* Sound Mute Toggle */}
          <button
            id="audio-toggle-btn"
            className="btn-ghost"
            style={{ padding: '0.4rem', color: soundOn ? '#00a651' : '#64748b' }}
            onClick={handleToggleSound}
            title={soundOn ? 'Sound Effects Enabled (Click to Mute)' : 'Sound Effects Muted (Click to Enable)'}
            aria-label="Toggle Sound Effects"
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* AI Tutor 3D Button (Desktop only) */}
          <button
            id="header-open-tutor-btn"
            className="btn btn-primary desktop-tutor-btn"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
            onClick={() => {
              sounds.playPop();
              onOpenTutor();
            }}
          >
            <Brain size={16} />
            <span>Ask Wolfie</span>
          </button>
        </div>
      </div>
    </header>
  );
};
