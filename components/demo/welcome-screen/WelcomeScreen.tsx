/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef } from 'react';
import './WelcomeScreen.css';
import { useLogStore, useSettings } from '../../../lib/state';

const WelcomeScreen: React.FC = () => {
  const turns = useLogStore(state => state.turns);
  const { language1 } = useSettings();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter for agent turns to show translations
  const agentTurns = turns.filter(turn => turn.role === 'agent');

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [agentTurns.length, turns.at(-1)?.text]);

  if (agentTurns.length === 0) {
    return (
      <div className="welcome-screen empty">
        <div className="welcome-content">
          <p className="placeholder-text">Waiting for conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-screen">
      <div className="welcome-content" ref={scrollRef}>
        <div className="translation-list">
          {agentTurns.map((turn, index) => {
            const isLast = index === agentTurns.length - 1;
            const showCursor = isLast && !turn.isFinal;

            // Parse language tag: [LANG:Dutch] Text...
            const match = turn.text.match(/^\[LANG:(.+?)\]\s*(.*)/s);
            let displayRole = 'visitor-color';
            let displayText = turn.text;

            if (match) {
              const detectedLang = match[1].trim();
              displayText = match[2];
              // The user wants to color code *who spoke*. 
              // Typically, you show the *result* of the translation.
              // Let's assume:
              // - Green for Staff Output (Target was Staff Lang)
              // - Blue for Visitor Output (Target was Visitor Lang)

              // User said: "make the difference in color for the home staff and the visitor"
              // If language1 is Dutch.
              // If tag is [LANG:Dutch], it is a glip to Dutch.
              if (detectedLang.toLowerCase() === language1.toLowerCase()) {
                displayRole = 'staff-color';
              } else {
                displayRole = 'visitor-color';
              }
            } else {
              // Fallback if tag is missing (e.g. initial partials)
              // Attempt to guess or just default.
            }

            return (
              <div key={index} className={`translation-item ${displayRole}`}>
                <p className="transcript-text">
                  {displayText}
                  {showCursor && <span className="cursor"></span>}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
