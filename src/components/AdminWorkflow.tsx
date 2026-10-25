import React, { useState } from 'react';
import { Shield, Globe, Archive, Clock } from 'lucide-react';
import { Topic, PublishingStatus } from '../types';
import { ApiService } from '../services/api';

interface AdminWorkflowProps {
  topics: Topic[];
  onRefreshTopics: () => void;
}

export const AdminWorkflow: React.FC<AdminWorkflowProps> = ({
  topics,
  onRefreshTopics
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const selectedTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  const handleStatusChange = async (lessonId: string, newStatus: PublishingStatus) => {
    await ApiService.updateLessonStatus(lessonId, newStatus);
    onRefreshTopics();
    setActionSuccess(`Lesson status transitioned to '${newStatus}'.`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="admin-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Admin Header */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f0fdf4', border: '1px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} color="#00a651" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#007a3c', fontWeight: 700, letterSpacing: '0.08em' }}>
              Content Administration & Provenance (FR-10)
            </span>
            <h1 style={{ fontSize: '1.75rem', margin: '0.15rem 0', color: '#0f172a' }}>Editorial Publishing Pipeline</h1>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>
              Lifecycle: <code>draft</code> ➔ <code>review</code> ➔ <code>published</code> ➔ <code>archived</code>
            </p>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div style={{ padding: '0.85rem 1.25rem', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', color: '#007a3c', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {actionSuccess}
        </div>
      )}

      {/* Topic Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {topics.map((t) => (
          <button
            key={t.id}
            className={`btn ${selectedTopicId === t.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.825rem', padding: '0.45rem 0.9rem' }}
            onClick={() => setSelectedTopicId(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Selected Topic Lessons Table */}
      {selectedTopic && (
        <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto', background: '#ffffff' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0f172a' }}>
            Curriculum Registry: {selectedTopic.name}
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Lesson Title</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Level</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Version</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Sources</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedTopic.lessons.map((lesson) => (
                <tr key={lesson.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600, color: '#0f172a' }}>
                    {lesson.title}
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className={`badge badge-${lesson.level}`}>{lesson.level}</span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: '#64748b' }}>
                    v{lesson.version}.0
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className="badge badge-status" style={{ textTransform: 'capitalize' }}>
                      {lesson.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: '#007a3c' }}>
                    {lesson.sources.length} cited
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        onClick={() => handleStatusChange(lesson.id, 'review')}
                        title="Move to review"
                      >
                        <Clock size={12} />
                        <span>Review</span>
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        onClick={() => handleStatusChange(lesson.id, 'published')}
                        title="Publish to catalog"
                      >
                        <Globe size={12} />
                        <span>Publish</span>
                      </button>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#ef4444' }}
                        onClick={() => handleStatusChange(lesson.id, 'archived')}
                        title="Archive lesson"
                      >
                        <Archive size={12} />
                        <span>Archive</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
