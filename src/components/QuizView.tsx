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
  HelpCircle
} from 'lucide-react';
import { Quiz, QuizAttemptResult } from '../types';
import { ApiService } from '../services/api';

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
    if (attemptResult) return; // Locked after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmit = async () => {
    // Check all questions answered
    const unansweredCount = quiz.questions.filter((q) => !selectedAnswers[q.id]).length;
    if (unansweredCount > 0) {
      setErrorMessage(`Please answer all questions before submitting (${unansweredCount} remaining).`);
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Call server validation endpoint (Section 6.5)
      const result = await ApiService.submitQuizAttempt(quiz.id, selectedAnswers);
      setAttemptResult(result);
      onCompleted(result);

      if (result.passed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit quiz attempt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
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
        onClick={onBack}
        style={{ paddingLeft: 0, marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Lesson</span>
      </button>

      {/* Quiz Header */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--brand-cyan)', fontWeight: 700, letterSpacing: '0.08em' }}>
              Comprehension Drill
            </span>
            <h1 style={{ fontSize: '1.75rem', marginTop: '0.2rem', marginBottom: '0.25rem' }}>
              {quiz.title}
            </h1>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Pass threshold: {quiz.passThresholdPercent}% · Evaluated server-side
            </p>
          </div>

          <div style={{ padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Questions: </span>
            <strong style={{ color: '#ffffff' }}>{quiz.questions.length}</strong>
          </div>
        </div>
      </div>

      {/* Post-Submission Score Banner */}
      {attemptResult && (
        <div 
          className="glass-card" 
          style={{ 
            padding: '1.75rem', 
            marginBottom: '1.75rem',
            border: attemptResult.passed ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
            background: attemptResult.passed 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(14, 25, 48, 0.9) 100%)' 
              : 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(14, 25, 48, 0.9) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {attemptResult.passed ? (
                <Award size={42} color="#10b981" />
              ) : (
                <AlertCircle size={42} color="#f43f5e" />
              )}
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>
                  {attemptResult.passed ? 'Assessment Passed! 🎉' : 'Assessment Incomplete'}
                </h2>
                <p style={{ margin: 0, color: '#cbd5e1' }}>
                  Your Score: <strong>{attemptResult.score}%</strong> ({attemptResult.breakdown.filter((b) => b.isCorrect).length} / {attemptResult.totalPoints} correct)
                </p>
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
                onClick={onBack}
              >
                <span>Continue Curriculum</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '10px', color: '#fecdd3', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {errorMessage}
        </div>
      )}

      {/* Question Cards */}
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
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                  Question {index + 1} of {quiz.questions.length}
                </span>

                {feedback && (
                  feedback.isCorrect ? (
                    <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 700 }}>
                      <CheckCircle2 size={16} /> Correct (+1)
                    </span>
                  ) : (
                    <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 700 }}>
                      <XCircle size={16} /> Incorrect
                    </span>
                  )
                )}
              </div>

              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', lineHeight: 1.4 }}>
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
                          width: '20px', 
                          height: '20px', 
                          borderRadius: '50%', 
                          border: isSelected ? '5px solid var(--brand-cyan)' : '2px solid rgba(255, 255, 255, 0.25)',
                          flexShrink: 0
                        }} 
                      />
                      <span>{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Server-Side Explanation Callout (Displayed ONLY after submission) */}
              {feedback && (
                <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', borderLeft: '3px solid var(--brand-cyan)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <HelpCircle size={15} color="#38bdf8" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                      Pedagogical Explanation
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#e2e8f0' }}>
                    {feedback.explanation}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Submission Bar */}
      {!attemptResult && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            id="quiz-submit-btn"
            className="btn btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Send size={18} />
            <span>{isSubmitting ? 'Evaluating Server-Side...' : 'Submit Answers for Scoring'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
