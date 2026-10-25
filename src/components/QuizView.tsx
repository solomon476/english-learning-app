import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Award, 
  RotateCcw, 
  Send, 
  AlertCircle,
  HelpCircle,
  Zap,
  Sparkles
} from 'lucide-react';
import type { Quiz, QuizAttemptResult } from '../types';
import { ApiService } from '../services/api';
import { sounds } from '../utils/soundEffects';

interface QuizViewProps {
  quiz: Quiz;
  onBack: () => void;
  onCompleted: (result: QuizAttemptResult) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  quiz,
  onBack,
  onCompleted
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttemptResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (attemptResult) return;
    sounds.playPop();
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmit = async () => {
    const unansweredCount = quiz.questions.filter((q) => !selectedAnswers[q.id]).length;
    if (unansweredCount > 0) {
      sounds.playError();
      setErrorMessage(`Please answer all questions before submitting (${unansweredCount} remaining).`);
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await ApiService.submitQuizAttempt(quiz.id, selectedAnswers);
      setAttemptResult(result);
      onCompleted(result);

      if (result.passed) {
        // Play celebratory victory fanfare!
        sounds.playVictory();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.55 }
        });
      } else {
        sounds.playError();
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit quiz attempt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    sounds.playPop();
    setSelectedAnswers({});
    setAttemptResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="quiz-container">
      {/* Return navigation */}
      <button 
        id="quiz-back-btn"
        className="btn btn-ghost" 
        onClick={() => {
          sounds.playPop();
          onBack();
        }}
        style={{ paddingLeft: 0, marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Lesson</span>
      </button>

      {/* Quiz Header with Wolfie Mascot Guide */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="mascot-avatar-circle" style={{ width: '60px', height: '60px' }}>
              <img src="/mascot-tutor.jpg" alt="Wolfie with glasses" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--brand-cyan)', fontWeight: 800, letterSpacing: '0.08em' }}>
                Wolfie's Practice Drill
              </span>
              <h1 style={{ fontSize: '1.75rem', marginTop: '0.15rem', marginBottom: '0.2rem' }}>
                {quiz.title}
              </h1>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>
                Pass threshold: {quiz.passThresholdPercent}% · Evaluated server-side · Earn <strong>+100 XP</strong> & <strong>15 Gems 💎</strong>
              </p>
            </div>
          </div>

          <div style={{ padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Questions: </span>
            <strong style={{ color: '#ffffff' }}>{quiz.questions.length}</strong>
          </div>
        </div>
      </div>

      {/* Post-Submission Score Banner with Celebratory Wolfie */}
      {attemptResult && (
        <div 
          className="glass-card" 
          style={{ 
            padding: '2rem', 
            marginBottom: '1.75rem',
            border: attemptResult.passed ? '2px solid rgba(16, 185, 129, 0.6)' : '2px solid rgba(244, 63, 94, 0.6)',
            background: attemptResult.passed 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(14, 25, 48, 0.95) 100%)' 
              : 'linear-gradient(135deg, rgba(244, 63, 94, 0.18) 0%, rgba(14, 25, 48, 0.95) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {attemptResult.passed ? (
                <div 
                  className="mascot-avatar-circle mascot-bob"
                  style={{ width: '84px', height: '84px', border: '3px solid #10b981', boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)' }}
                >
                  <img src="/mascot-celebrate.jpg" alt="Wolfie celebrating with trophy" />
                </div>
              ) : (
                <div 
                  className="mascot-avatar-circle"
                  style={{ width: '84px', height: '84px', border: '3px solid #f43f5e' }}
                >
                  <img src="/mascot-welcome.jpg" alt="Wolfie encouraging" />
                </div>
              )}
              <div>
                <h2 style={{ fontSize: '1.65rem', marginBottom: '0.25rem', color: '#ffffff' }}>
                  {attemptResult.passed ? 'VICTORY! Quest Complete! 🏆' : 'Almost There! Try Again! 💪'}
                </h2>
                <p style={{ margin: '0 0 0.5rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                  Your Score: <strong>{attemptResult.score}%</strong> ({attemptResult.breakdown.filter((b) => b.isCorrect).length} / {attemptResult.totalPoints} correct)
                </p>
                {attemptResult.passed && (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span className="badge badge-beginner" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                      <Zap size={13} /> +100 XP
                    </span>
                    <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid #38bdf8' }}>
                      💎 +15 Gems Earned!
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                id="quiz-retry-btn"
                className="btn btn-secondary" 
                onClick={handleRetry}
              >
                <RotateCcw size={16} />
                <span>Retry Drill</span>
              </button>
              <button 
                id="quiz-return-catalog-btn"
                className="btn btn-primary" 
                onClick={() => {
                  sounds.playPop();
                  onBack();
                }}
              >
                <span>Continue Next Quest</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '12px', color: '#fecdd3', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {errorMessage}
        </div>
      )}

      {/* Question Cards with Duolingo-style Chunky Options */}
      <div className="questions-list">
        {quiz.questions.map((question, index) => {
          const feedback = attemptResult?.breakdown.find((b) => b.questionId === question.id);

          return (
            <article 
              key={question.id} 
              id={`quiz-question-${index + 1}`}
              className="glass-card question-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '0.06em' }}>
                  Question {index + 1} of {quiz.questions.length}
                </span>

                {feedback && (
                  feedback.isCorrect ? (
                    <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.825rem', fontWeight: 800 }}>
                      <CheckCircle2 size={16} /> Correct (+1)
                    </span>
                  ) : (
                    <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.825rem', fontWeight: 800 }}>
                      <XCircle size={16} /> Incorrect
                    </span>
                  )
                )}
              </div>

              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', lineHeight: 1.45 }}>
                {question.prompt}
              </h3>

              <div className="options-group" role="radiogroup">
                {question.options.map((option) => {
                  const isSelected = selectedAnswers[question.id] === option.id;
                  let optionClass = 'option-btn';

                  if (attemptResult && feedback) {
                    if (option.id === feedback.correctOptionId) {
                      optionClass += ' correct';
                    } else if (isSelected && !feedback.isCorrect) {
                      optionClass += ' incorrect';
                    }
                  } else if (isSelected) {
                    optionClass += ' selected';
                  }

                  return (
                    <button
                      key={option.id}
                      id={`opt-${question.id}-${option.id}`}
                      className={optionClass}
                      onClick={() => handleSelectOption(question.id, option.id)}
                      disabled={!!attemptResult}
                      role="radio"
                      aria-checked={isSelected}
                    >
                      <div 
                        style={{ 
                          width: '22px', 
                          height: '22px', 
                          borderRadius: '50%', 
                          border: isSelected ? '6px solid var(--brand-cyan)' : '2px solid rgba(255, 255, 255, 0.3)',
                          flexShrink: 0,
                          transition: 'all 0.15s ease'
                        }} 
                      />
                      <span style={{ fontWeight: 600 }}>{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Server-Side Explanation Callout */}
              {feedback && (
                <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', borderLeft: '4px solid var(--brand-cyan)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                    <HelpCircle size={16} color="#38bdf8" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                      Wolfie's Master Explanation
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#e2e8f0' }}>
                    {feedback.explanation}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Submission 3D Button */}
      {!attemptResult && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            id="quiz-submit-btn"
            className="btn btn-primary"
            style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem' }}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Send size={18} />
            <span>{isSubmitting ? 'Evaluating on Server...' : 'Check My Answers (+100 XP)'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
