import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Mail, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { AuthService, AuthUser } from '../services/authService';
import { sounds } from '../utils/soundEffects';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      sounds.playError();
      return;
    }

    if (mode !== 'forgot' && (!password || password.length < 6)) {
      setErrorMsg('Password must be at least 6 characters long.');
      sounds.playError();
      return;
    }

    setIsLoading(true);
    sounds.playPop();

    try {
      if (mode === 'signup') {
        const user = await AuthService.signUp(email, password, displayName);
        sounds.playVictory();
        setSuccessMsg(`Welcome to the pack, ${user.displayName}! 🐾 Your account is active.`);
        setTimeout(() => {
          onSuccess(user);
          onClose();
        }, 1200);
      } else if (mode === 'signin') {
        const user = await AuthService.signIn(email, password);
        sounds.playVictory();
        setSuccessMsg(`Welcome back, ${user.displayName}! 🐾 Progress synced.`);
        setTimeout(() => {
          onSuccess(user);
          onClose();
        }, 1000);
      } else if (mode === 'forgot') {
        await AuthService.resetPassword(email);
        sounds.playVictory();
        setSuccessMsg('Password recovery instructions have been sent to your email.');
      }
    } catch (err: unknown) {
      sounds.playError();
      setErrorMsg(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="glass-card auth-modal-card" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        {/* Close Button */}
        <button 
          className="btn-ghost auth-modal-close-btn"
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          aria-label="Close authentication modal"
        >
          <X size={20} />
        </button>

        {/* Mascot Mascot Header */}
        <div className="auth-modal-header">
          <div className="mascot-avatar-circle auth-mascot-avatar mascot-bob">
            <img src="/mascot-welcome.jpg" alt="Wolfie Mascot" />
          </div>
          <div>
            <span className="auth-modal-tag">Solian Wolves Account</span>
            <h2 id="auth-modal-title" className="auth-modal-h2">
              {mode === 'signup' 
                ? 'Join the Pack' 
                : mode === 'forgot' 
                  ? 'Reset Password' 
                  : 'Welcome Back'}
            </h2>
            <p className="auth-modal-subtitle">
              {mode === 'signup' 
                ? 'Save your quests, streak flame, and test scores across all devices.' 
                : mode === 'forgot' 
                  ? 'Enter your email to receive recovery instructions.' 
                  : 'Log in to sync your progress and resume where you left off.'}
            </p>
          </div>
        </div>

        {/* Tabs: Sign In / Create Account */}
        {mode !== 'forgot' && (
          <div className="auth-tab-bar">
            <button
              className={`auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => {
                sounds.playPop();
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              type="button"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
            <button
              className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => {
                sounds.playPop();
                setMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              type="button"
            >
              <UserPlus size={16} />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Alert Notifications */}
        {errorMsg && (
          <div className="auth-alert-banner alert-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert-banner alert-success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form-fields">
          {mode === 'signup' && (
            <div className="auth-input-group">
              <label htmlFor="auth-name-input">Learner Name</label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-input-icon" />
                <input
                  id="auth-name-input"
                  type="text"
                  placeholder="e.g. Alex Kim"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="auth-text-input"
                  maxLength={50}
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label htmlFor="auth-email-input">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                id="auth-email-input"
                type="email"
                placeholder="learner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-text-input"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="auth-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="auth-password-input">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setMode('forgot');
                      setErrorMsg(null);
                    }}
                    className="auth-forgot-link"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="auth-input-wrapper">
                <KeyRound size={16} className="auth-input-icon" />
                <input
                  id="auth-password-input"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-text-input"
                />
              </div>
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Connecting to Pack...</span>
            ) : mode === 'signup' ? (
              <>
                <Sparkles size={18} />
                <span>Create Free Account</span>
              </>
            ) : mode === 'forgot' ? (
              <span>Send Recovery Link</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In to Learn</span>
              </>
            )}
          </button>
        </form>

        {/* Back to sign in if in forgot mode */}
        {mode === 'forgot' && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: '0.85rem', color: '#007a3c' }}
              onClick={() => {
                sounds.playPop();
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* Guest Learning Reassurance Footer */}
        <div className="auth-modal-footer">
          <div className="auth-privacy-pill">
            <ShieldCheck size={14} color="#00a651" />
            <span>Kenya DPA 2019 Compliant · Data Sovereignty & Zero Ad-Tracking</span>
          </div>
          <button
            type="button"
            className="auth-continue-guest-btn"
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
          >
            Continue browsing as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
