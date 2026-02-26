/**
 * Main entry point for Kids Learning Platform.
 * Routes between menu and individual games.
 */

import { renderMenu } from './components/menu.js';
import { startConnect } from './games/connect/index.js';
import { startTrace } from './games/trace/index.js';

const app = document.getElementById('app');

/** Navigate to the main menu. */
function showMenu() {
  renderMenu(app, {
    onSelectGame: (gameId) => {
      switch (gameId) {
        case 'connect':
          startConnect(app, showMenu);
          break;
        case 'trace':
          startTrace(app, showMenu);
          break;
        default:
          console.warn('Unknown game:', gameId);
      }
    },
  });
}

// Start the app
showMenu();
