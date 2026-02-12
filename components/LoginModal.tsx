import React, { useState } from 'react';
import { loginOrRegisterStaff, createSession } from '../lib/supabase';
import { useSettings } from '../lib/state';

interface LoginModalProps {
  onLoginSuccess: () => void;
}

export default function LoginModal({ onLoginSuccess }: LoginModalProps) {
  const [staffId, setStaffId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setSessionId, language1, language2 } = useSettings();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Login/Register User
      const user = await loginOrRegisterStaff(staffId.toUpperCase());
      if (!user) {
        throw new Error('Failed to login.');
      }
      setUser(user);

      // 2. Create Session immediately
      const sessionId = await createSession(user.id, language1, language2);
      if (sessionId) {
        setSessionId(sessionId);
      }

      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        <h2>Dual Translator</h2>
        <p className="subtitle">Please enter your Staff ID (e.g., SI1234)</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="SIxxxx"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="login-input"
            autoFocus
          />
          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Start Session'}
          </button>
        </form>
      </div>

      <style>{`
        .login-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .login-card {
          background: #1e1e1e;
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 90%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .login-card h2 {
          margin-bottom: 0.5rem;
          color: white;
        }
        .subtitle {
          color: #aaa;
          margin-bottom: 2rem;
        }
        .login-input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #333;
          background: #2a2a2a;
          color: white;
          font-family: inherit;
          font-size: 1.2rem;
          text-align: center;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .login-input:focus {
          border-color: var(--primary);
          outline: none;
        }
        .login-button {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: var(--primary, #007bff);
          color: white;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .error-text {
          color: #ff4d4d;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
