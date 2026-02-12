import { useUI, useSettings } from '../lib/state';
import { AVAILABLE_LANGUAGES } from '../lib/constants';
import LoginModal from './LoginModal';
import { useState } from 'react';

export default function Header() {
  const { toggleSidebar } = useUI();
  const { language1, language2, setLanguage2, user } = useSettings();
  const [showLogin, setShowLogin] = useState(!user);

  const getLangCode = (langName: string) => {
    const found = AVAILABLE_LANGUAGES.find(l => l.value === langName);
    return found ? found.code : langName.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header>
        <div className="header-left">
          <div className="language-controls">
            <div className="language-group">
              <span className="label">Staff:</span>
              <span className="value" title={language1}>{getLangCode(language1)}</span>
            </div>
            <span className="separator">↔</span>
            <div className="language-group">
              <span className="label">Guest:</span>
              <select
                value={language2}
                onChange={(e) => setLanguage2(e.target.value)}
                className="language-select"
                aria-label="Select Guest Language"
                title="Select Guest Language"
              >
                {AVAILABLE_LANGUAGES.filter(lang => lang.value !== language1).map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.code} - {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="header-right">
          {user ? (
            <span className="user-email">{user.id}</span>
          ) : (
            <button
              className="login-trigger-btn"
              onClick={() => setShowLogin(true)}
              style={{
                background: 'none',
                border: '1px solid var(--gray-600)',
                color: 'var(--text)',
                padding: '4px 12px',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Login
            </button>
          )}
          <button
            className="settings-button"
            onClick={toggleSidebar}
            aria-label="Settings"
            title="Settings"
          >
            <span className="material-symbols-outlined icon">tune</span>
          </button>
        </div>
      </header>
      {showLogin && !user && (
        <LoginModal onLoginSuccess={() => setShowLogin(false)} />
      )}
    </>
  );
}