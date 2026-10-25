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
  X
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

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ padding: '0.75rem 1.25rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#b45309' }}>
                <Flame size={18} />
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{userProfile.streakDays}</span>
              </div>
              <span style={{ fontSize: '0.725rem', color: '#b45309', textTransform: 'uppercase', fontWeight: 700 }}>Daily Streak</span>
            </div>

            <div style={{ padding: '0.75rem 1.25rem', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#007a3c' }}>
                <CheckCircle size={18} />
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{completedLessonsCount}</span>
              </div>
              <span style={{ fontSize: '0.725rem', color: '#007a3c', textTransform: 'uppercase', fontWeight: 700 }}>Completed</span>
            </div>

            <div style={{ padding: '0.75rem 1.25rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#1d4ed8' }}>
                <Award size={18} />
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{avgScore}%</span>
              </div>
              <span style={{ fontSize: '0.725rem', color: '#1d4ed8', textTransform: 'uppercase', fontWeight: 700 }}>Avg Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.75rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sliders size={20} color="#00a651" />
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Learning Preferences & Adaptive Framing</h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
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
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.75rem', background: '#ffffff' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0f172a' }}>Enrolled Curriculum Milestones</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {topics.map((t) => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <div>
                <strong style={{ color: '#0f172a' }}>{t.name}</strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.category} · {t.lessons.length} lessons</div>
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
