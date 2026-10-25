import React, { useState } from 'react';
import { 
  User, 
  Flame, 
  Award, 
  Download, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Sliders, 
  AlertTriangle,
  Edit3,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { UserProfile, LearningProgress, ComplexityLevel, Topic } from '../types';
import type { AuthUser } from '../services/authService';
import { ApiService } from '../services/api';

interface ProfileProgressProps {
  userProfile: UserProfile;
  progressMap: Record<string, LearningProgress>;
  topics: Topic[];
  currentUser: AuthUser | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSignOut: () => void;
  onUpdateLevel: (level: ComplexityLevel) => void;
  onRefreshData: () => void;
}

export const ProfileProgress: React.FC<ProfileProgressProps> = ({
  userProfile,
  progressMap,
  topics,
  currentUser,
  onOpenAuth,
  onSignOut,
  onUpdateLevel,
  onRefreshData
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(userProfile.displayName || 'Learner');
  const [editedEmail, setEditedEmail] = useState<string>(userProfile.email || 'learner@solianwolves.org');

  const completedLessonsCount = Object.values(progressMap).filter((p) => p.status === 'completed').length;
  
  // Calculate average quiz score
  const quizScores = Object.values(progressMap)
    .map((p) => p.highestQuizScore)
    .filter((s) => s > 0);
  const avgScore = quizScores.length > 0 
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) 
    : 0;

  const handleSaveProfile = async () => {
    if (!editedName.trim()) return;
    await ApiService.updateUserProfile({
      displayName: editedName.trim(),
      email: editedEmail.trim()
    });
    setIsEditingName(false);
    onRefreshData();
  };

  const handleExportData = () => {
    const exportBundle = {
      profile: userProfile,
      progress: progressMap,
      exportedAt: new Date().toISOString(),
      compliance: 'Kenya Data Protection Act 2019 (DPA) Article 26 / Right to Data Portability'
    };
    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solian-wolves-data-export-${userProfile.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmPurge = async () => {
    setIsDeleting(true);
    try {
      await ApiService.purgeUserData();
      setShowDeleteModal(false);
      onRefreshData();
      alert('All learning progress, quiz attempts, and profile records have been permanently expunged.');
    } catch {
      alert('Failed to delete data. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="profile-wrapper" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Account Sync Status Banner */}
      {currentUser ? (
        <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#f0fdf4', border: '1px solid #86efac' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={20} color="#00a651" />
            <div>
              <strong style={{ display: 'block', fontSize: '0.925rem', color: '#007a3c' }}>Cloud Account Synced</strong>
              <span style={{ fontSize: '0.8rem', color: '#475569' }}>Signed in as <strong>{currentUser.email}</strong>. Streaks and quest milestones persist across all devices.</span>
            </div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }} onClick={onSignOut}>
            Sign Out
          </button>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#fffbeb', border: '1px solid #fde68a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={22} color="#d97706" />
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: '#92400e' }}>Guest Learner Mode</strong>
              <span style={{ fontSize: '0.825rem', color: '#78350f' }}>Your progress is stored locally on this device. Create an account to sync across devices!</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem' }} onClick={() => onOpenAuth('signup')}>
              Create Free Account
            </button>
            <button className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }} onClick={() => onOpenAuth('signin')}>
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.75rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #00b050, #00a651)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0, 166, 81, 0.25)' }}>
              <User size={32} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--brand-green-dark)', fontWeight: 700, letterSpacing: '0.08em' }}>
                Solian Wolves Learner Profile
              </span>
              
              {isEditingName ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={editedName} 
                      onChange={(e) => setEditedName(e.target.value)} 
                      placeholder="Your Name"
                      style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#0f172a', outline: 'none' }}
                    />
                    <button 
                      onClick={handleSaveProfile}
                      className="btn btn-primary" 
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                      title="Save Name"
                    >
                      <Check size={16} /> Save
                    </button>
                    <button 
                      onClick={() => setIsEditingName(false)}
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <input 
                    type="email" 
                    value={editedEmail} 
                    onChange={(e) => setEditedEmail(e.target.value)} 
                    placeholder="learner@solianwolves.org"
                    style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.825rem', color: '#475569', outline: 'none', maxWidth: '280px' }}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h1 style={{ fontSize: '1.75rem', margin: '0.15rem 0', color: '#0f172a' }}>
                    {userProfile.displayName || 'Learner'}
                  </h1>
                  <button 
                    onClick={() => {
                      setEditedName(userProfile.displayName || 'Learner');
                      setEditedEmail(userProfile.email || 'learner@solianwolves.org');
                      setIsEditingName(true);
                    }}
                    className="btn btn-ghost"
                    style={{ padding: '0.3rem', color: '#00a651' }}
                    title="Edit Name"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              )}
              
              {!isEditingName && (
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{userProfile.email || 'learner@solianwolves.org'}</span>
              )}
            </div>
          </div>

          <div className="profile-stats-grid">
            <div className="profile-stat-box stat-streak">
              <div className="stat-value-row text-gold">
                <Flame size={18} />
                <span className="stat-number">{userProfile.streakDays}</span>
              </div>
              <span className="stat-label text-gold">Daily Streak</span>
            </div>

            <div className="profile-stat-box stat-completed">
              <div className="stat-value-row text-green">
                <CheckCircle size={18} />
                <span className="stat-number">{completedLessonsCount}</span>
              </div>
              <span className="stat-label text-green">Completed</span>
            </div>

            <div className="profile-stat-box stat-score">
              <div className="stat-value-row text-blue">
                <Award size={18} />
                <span className="stat-number">{avgScore}%</span>
              </div>
              <span className="stat-label text-blue">Avg Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="glass-card profile-section-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Sliders size={20} color="#00a651" />
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Learning Preferences & Adaptive Framing</h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
          Set your preferred default explanation lens for lesson rendering and tutor interactions.
        </p>

        <div className="preference-buttons-group">
          {(['beginner', 'intermediate', 'advanced'] as ComplexityLevel[]).map((lvl) => (
            <button
              key={lvl}
              id={`pref-level-${lvl}`}
              className={`btn pref-choice-btn ${userProfile.preferredLevel === lvl ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onUpdateLevel(lvl)}
            >
              <span>{lvl === 'beginner' ? '🌱 Beginner (Analogy Focus)' : lvl === 'intermediate' ? '📘 Intermediate (Standard Curriculum)' : '🔬 Advanced (First-Principles)'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Curriculum Milestones */}
      <div className="glass-card profile-section-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0f172a' }}>Enrolled Curriculum Milestones</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {topics.map((t) => (
            <div key={t.id} className="milestone-item-row">
              <div className="milestone-topic-info">
                <strong style={{ color: '#0f172a', display: 'block', fontSize: '0.95rem' }}>{t.name}</strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.category} · {t.lessons.length} lessons</div>
              </div>
              <div className="milestone-badges-wrap">
                {t.lessons.map((les) => {
                  const isDone = progressMap[les.id]?.status === 'completed';
                  return (
                    <span 
                      key={les.id} 
                      className={`badge ${isDone ? 'badge-beginner' : 'badge-status'} milestone-badge`}
                    >
                      {les.title} {isDone ? '✓' : '○'}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kenya DPA 2019 Privacy & Data Center (FR-09) */}
      <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid #e2e8f0', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Clock size={20} color="#00a651" />
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Privacy & Data Sovereignty Center</h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
          In accordance with the <strong>Kenya Data Protection Act 2019 (DPA)</strong> and the ODPC Children's Data Protection Guidelines, Solian Wolves enforces strict data minimization:
        </p>

        <ul style={{ paddingLeft: '1.25rem', color: '#334155', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          <li><strong>Zero Location / PII Profiling:</strong> We do not track GPS coordinates, phone numbers, or third-party ad identifiers.</li>
          <li><strong>30-Day Conversation Purge:</strong> Unsaved AI tutor conversations are automatically deleted after 30 days.</li>
          <li><strong>Right of Access & Portability:</strong> Export your complete learning transcript and quiz attempts in machine-readable JSON format at any time.</li>
        </ul>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            id="export-data-btn"
            className="btn btn-secondary" 
            onClick={handleExportData}
          >
            <Download size={16} />
            <span>Export Personal Data (JSON)</span>
          </button>
          <button 
            id="delete-data-btn"
            className="btn btn-ghost" 
            style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={16} />
            <span>Permanently Delete All Data</span>
          </button>
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.4)', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444', marginBottom: '1rem' }}>
              <AlertTriangle size={28} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Confirm Data Eradication</h3>
            </div>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              This action will permanently erase your learning history, quiz results, streak count, and tutor sessions. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                id="confirm-purge-btn"
                className="btn" 
                style={{ background: '#ef4444', color: '#ffffff' }}
                onClick={handleConfirmPurge}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
