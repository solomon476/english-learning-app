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
  AlertTriangle 
} from 'lucide-react';
import { UserProfile, LearningProgress, ComplexityLevel, Topic } from '../types';
import { ApiService } from '../services/api';

interface ProfileProgressProps {
  userProfile: UserProfile;
  progressMap: Record<string, LearningProgress>;
  topics: Topic[];
  onUpdateLevel: (level: ComplexityLevel) => void;
  onRefreshData: () => void;
}

export const ProfileProgress: React.FC<ProfileProgressProps> = ({
  userProfile,
  progressMap,
  topics,
  onUpdateLevel,
  onRefreshData
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const completedLessonsCount = Object.values(progressMap).filter((p) => p.status === 'completed').length;
  
  // Calculate average quiz score
  const quizScores = Object.values(progressMap)
    .map((p) => p.highestQuizScore)
    .filter((s) => s > 0);
  const avgScore = quizScores.length > 0 
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) 
    : 0;

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
      {/* Profile Overview Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--brand-indigo), var(--brand-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={32} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--brand-cyan)', fontWeight: 700, letterSpacing: '0.08em' }}>
                Solian Wolves Learner Identity
              </span>
              <h1 style={{ fontSize: '1.75rem', margin: '0.15rem 0' }}>{userProfile.displayName}</h1>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{userProfile.email}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: 'var(--brand-gold)' }}>
                <Flame size={18} />
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{userProfile.streakDays}</span>
              </div>
              <span style={{ fontSize: '0.725rem', color: '#fcd34d', textTransform: 'uppercase', fontWeight: 600 }}>Daily Streak</span>
            </div>

            <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: 'var(--color-success)' }}>
                <CheckCircle size={18} />
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{completedLessonsCount}</span>
              </div>
              <span style={{ fontSize: '0.725rem', color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 600 }}>Completed</span>
            </div>

            <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#a5b4fc' }}>
                <Award size={18} />
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{avgScore}%</span>
              </div>
              <span style={{ fontSize: '0.725rem', color: '#c7d2fe', textTransform: 'uppercase', fontWeight: 600 }}>Avg Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sliders size={20} color="#38bdf8" />
          <h2 style={{ fontSize: '1.25rem' }}>Learning Preferences & Adaptive Framing</h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
          Set your preferred default explanation lens for lesson rendering and tutor interactions.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {(['beginner', 'intermediate', 'advanced'] as ComplexityLevel[]).map((lvl) => (
            <button
              key={lvl}
              id={`pref-level-${lvl}`}
              className={`btn ${userProfile.preferredLevel === lvl ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onUpdateLevel(lvl)}
              style={{ textTransform: 'capitalize' }}
            >
              <span>{lvl === 'beginner' ? '🌱 Beginner (Analogy Focus)' : lvl === 'intermediate' ? '📘 Intermediate (Standard Curriculum)' : '🔬 Advanced (First-Principles)'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Curriculum Milestones */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Enrolled Curriculum Milestones</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {topics.map((t) => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
              <div>
                <strong style={{ color: '#ffffff' }}>{t.name}</strong>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.category} · {t.lessons.length} lessons</div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {t.lessons.map((les) => {
                  const isDone = progressMap[les.id]?.status === 'completed';
                  return (
                    <span 
                      key={les.id} 
                      className={`badge ${isDone ? 'badge-beginner' : 'badge-status'}`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {les.title.substring(0, 15)}... {isDone ? '✓' : '○'}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kenya DPA 2019 Privacy & Data Center (FR-09) */}
      <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Clock size={20} color="#10b981" />
          <h2 style={{ fontSize: '1.25rem' }}>Privacy & Data Sovereignty Center</h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
          In accordance with the <strong>Kenya Data Protection Act 2019 (DPA)</strong> and the ODPC Children's Data Protection Guidelines, Solian Wolves enforces strict data minimization:
        </p>

        <ul style={{ paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
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
            style={{ color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)' }}
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={16} />
            <span>Permanently Delete All Data</span>
          </button>
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem', border: '1px solid rgba(244, 63, 94, 0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f43f5e', marginBottom: '1rem' }}>
              <AlertTriangle size={28} />
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Confirm Data Eradication</h3>
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
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
                style={{ background: '#f43f5e', color: '#ffffff' }}
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
