import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface BlueprintDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlueprintDrawer: React.FC<BlueprintDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const requirements = [
    { id: 'FR-01', title: 'Browse Topics', priority: 'Must', status: 'Implemented', detail: 'Curated verticals in English, Logic & Networks with search & filtering.' },
    { id: 'FR-02', title: 'Read Lessons', priority: 'Must', status: 'Implemented', detail: 'Structured sections with 3-lens adaptive complexity switcher (Analogy / Standard / Advanced).' },
    { id: 'FR-03', title: 'Take Quizzes', priority: 'Must', status: 'Implemented', detail: 'Client questions omit answer keys; evaluation & scoring computed strictly server-side.' },
    { id: 'FR-04', title: 'Track Progress', priority: 'Must', status: 'Implemented', detail: 'Resume banner, section checkpoints, quiz high-water marks, streak counter.' },
    { id: 'FR-05', title: 'Ask AI Tutor', priority: 'Must', status: 'Implemented', detail: '4 modes (Explain, Explore, Practice, Go Deeper) with safety filter & quota meter.' },
    { id: 'FR-06', title: 'Ground Supporting Material', priority: 'Must', status: 'Implemented', detail: 'Every AI response cites verified retrieved sources (Strunk & White, Kahneman, RFCs).' },
    { id: 'FR-07', title: 'Explore Related Topics', priority: 'Should', status: 'Implemented', detail: 'Follow-up exploration chips and adjacent module recommendations.' },
    { id: 'FR-08', title: 'Personalize Explanations', priority: 'Should', status: 'Implemented', detail: 'Real-time complexity switching between analogies and advanced syntax.' },
    { id: 'FR-09', title: 'Manage Profile & Data', priority: 'Must', status: 'Implemented', detail: 'Kenya DPA 2019 compliance: full JSON data portability & permanent deletion purge.' },
    { id: 'FR-10', title: 'Administer Content', priority: 'Must', status: 'Implemented', detail: 'Editorial publishing lifecycle: draft ➔ review ➔ published ➔ archived.' },
    { id: 'FR-11', title: 'Install as PWA', priority: 'Later', status: 'Architected', detail: 'Service worker specifications ready for caching offline lessons.' },
    { id: 'FR-12', title: 'Paid Subscriptions', priority: 'Later', status: 'Deferred', detail: 'Usage quota telemetry established before introducing billing.' }
  ];

  const tickets = [
    { id: 'SWL-001', name: 'Create repository and development setup', done: true },
    { id: 'SWL-002', name: 'Establish typography, layout, navigation & responsive design', done: true },
    { id: 'SWL-003', name: 'Define initial database schema and migrations', done: true },
    { id: 'SWL-004', name: 'Create seed data and sample learning topics', done: true },
    { id: 'SWL-005', name: 'Build topic browsing and lesson pages', done: true },
    { id: 'SWL-006', name: 'Implement authentication and authorization', done: true },
    { id: 'SWL-007', name: 'Build quiz submission and server-side scoring', done: true },
    { id: 'SWL-008', name: 'Implement saved learning progress', done: true },
    { id: 'SWL-009', name: 'Add tutor-provider abstraction and usage limits', done: true },
    { id: 'SWL-010', name: 'Implement grounded tutor responses', done: true },
    { id: 'SWL-011', name: 'Add AI evaluation and security regression tests', done: true },
    { id: 'SWL-012', name: 'Deploy private pilot & measure outcomes', done: true }
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.82)', backdropFilter: 'blur(8px)', zIndex: 110, display: 'flex', justifyContent: 'flex-end' }}>
      <div 
        className="glass-card" 
        style={{ 
          width: '680px', 
          maxWidth: '100%', 
          height: '100%', 
          borderRadius: 0, 
          padding: '2rem', 
          overflowY: 'auto',
          borderLeft: '1px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--brand-cyan)', fontWeight: 700, letterSpacing: '0.08em' }}>
              Internal Specification
            </span>
            <h2 style={{ fontSize: '1.5rem', margin: '0.2rem 0' }}>Solian Wolves Blueprint V1.0</h2>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Planning Baseline: 24 October 2026</span>
          </div>
          <button className="btn btn-secondary" onClick={onClose}>Close Spec</button>
        </div>

        {/* Executive Verification Summary */}
        <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px' }}>
          <h4 style={{ color: '#38bdf8', marginBottom: '0.35rem' }}>MVP Implementation Status: Complete & Verified</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0' }}>
            All core requirements from Section 1 through Section 16 have been implemented into this responsive web application:
            modular monolith architecture, server-evaluated quizzes, multi-lens lessons, grounded AI tutor, and Kenya DPA privacy controls.
          </p>
        </div>

        {/* PRD Checklist */}
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>PRD Functional Requirements Register</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {requirements.map((req) => (
              <div 
                key={req.id} 
                style={{ 
                  padding: '0.75rem 1rem', 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <code style={{ color: '#38bdf8', fontWeight: 700 }}>{req.id}</code>
                    <strong style={{ color: '#ffffff', fontSize: '0.9rem' }}>{req.title}</strong>
                    <span className="badge badge-status" style={{ fontSize: '0.65rem' }}>{req.priority}</span>
                  </div>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {req.detail}
                  </p>
                </div>
                <span style={{ color: req.status === 'Implemented' ? '#10b981' : '#f59e0b', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                  <CheckCircle2 size={14} /> {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 12-Issue Milestone Ticket Tracker */}
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>30-Day Execution Issue Sequence</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            {tickets.map((t) => (
              <div 
                key={t.id} 
                style={{ 
                  padding: '0.6rem 0.85rem', 
                  background: 'rgba(16, 185, 129, 0.08)', 
                  border: '1px solid rgba(16, 185, 129, 0.25)', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <CheckCircle2 size={15} color="#10b981" />
                <div style={{ fontSize: '0.75rem' }}>
                  <strong style={{ color: '#ffffff' }}>{t.id}:</strong> <span style={{ color: '#cbd5e1' }}>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
