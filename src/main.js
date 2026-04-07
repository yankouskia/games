/**
 * Main entry point for Kids Learning Platform.
 */

import { renderMenu } from './components/menu.js';
import { startConnect } from './games/connect/index.js';
import { startTrace } from './games/trace/index.js';
import { startDobble } from './games/dobble/index.js';
import { startCompare } from './games/compare/index.js';
import { startAddition } from './games/addition/index.js';
import { startMusic, stopMusic, toggleMute, isMuted } from './utils/audio.js';

const app = document.getElementById('app');
let muteBtn = null;

function createMuteBtn() {
  if (muteBtn) muteBtn.remove();
  muteBtn = document.createElement('button');
  muteBtn.className = 'mute-btn';
  muteBtn.textContent = isMuted() ? '🔇' : '🔊';
  muteBtn.addEventListener('click', () => {
    const nowMuted = toggleMute();
    muteBtn.textContent = nowMuted ? '🔇' : '🔊';
    if (nowMuted) stopMusic();
    else startMusic();
  });
  document.body.appendChild(muteBtn);
}

function showMenu() {
  startMusic();
  createMuteBtn();
  renderMenu(app, {
    onSelectGame: (gameId) => {
      switch (gameId) {
        case 'connect':
          startConnect(app, showMenu);
          break;
        case 'trace':
          startTrace(app, showMenu);
          break;
        case 'dobble':
          startDobble(app, showMenu);
          break;
        case 'compare':
          startCompare(app, showMenu);
          break;
        case 'addition':
          startAddition(app, showMenu);
          break;
      }
      createMuteBtn(); // Re-attach after screen change
    },
  });
}

// Start after first user interaction (required for AudioContext)
document.addEventListener('click', function initAudio() {
  startMusic();
  document.removeEventListener('click', initAudio);
}, { once: true });

showMenu();
