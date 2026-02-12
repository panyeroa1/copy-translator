/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useSettings, useUI } from '../lib/state';
import { AVAILABLE_LANGUAGES } from '../lib/constants';

export default function Header() {
  const { toggleSidebar } = useUI();
  const { language1, language2, setLanguage2 } = useSettings();

  return (
    <header>
      <div className="header-left">
        <div className="language-controls">
          <div className="language-group">
            <span className="label">Staff:</span>
            <span className="value">{language1}</span>
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
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="header-right">
        <button
          className="settings-button"
          onClick={toggleSidebar}
          aria-label="Settings"
          title="Settings"
        >
          <span className="icon">tune</span>
        </button>
      </div>
    </header>
  );
}