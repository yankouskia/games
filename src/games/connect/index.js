/**
 * Game 1: «Соедини» — Match the Word to the Picture
 *
 * Gameplay:
 * - Each level shows 4-6 word-image pairs
 * - Words on the left, images (emoji) on the right, shuffled
 * - Child taps a word then taps the matching image (or vice versa)
 * - A line is drawn between connected pairs
 * - Correct: green overlay + checkmark
 * - Incorrect: red overlay + X, connection reset
 * - All matched: celebration, auto-advance to next level
 */

import { el, shuffle, pickRandom, getCenter, delay } from '../../utils/helpers.js';
import { showCorrect, showIncorrect, showCelebration } from '../../utils/feedback.js';
import { getUniqueWords } from '../../data/words.js';

/** Number of pairs per level */
const PAIRS_PER_LEVEL = 5;

/** All available words (deduplicated) */
const allWords = getUniqueWords();

/** Current game state */
let state = {
  pairs: [],         // { word, emoji, id }
  matched: new Set(),
  selected: null,    // { type: 'word'|'emoji', id, element }
  busy: false,       // Prevent interaction during feedback
};

let container = null;
let svgEl = null;
let connectArea = null;
let onBack = null;

/**
 * Start the Connect game.
 * @param {HTMLElement} appContainer - #app element
 * @param {Function} backCallback - Called when back button pressed
 */
export function startConnect(appContainer, backCallback) {
  container = appContainer;
  onBack = backCallback;
  loadLevel();
}

/**
 * Generate and render a new level.
 */
function loadLevel() {
  // Pick random pairs
  const selected = pickRandom(allWords, PAIRS_PER_LEVEL);
  state = {
    pairs: selected.map((w, i) => ({ ...w, id: i })),
    matched: new Set(),
    selected: null,
    busy: false,
  };

  render();
}

/**
 * Render the current level.
 */
function render() {
  container.innerHTML = '';

  const backBtn = el('button', {
    className: 'back-btn',
    onClick: () => onBack(),
  }, '←');

  const screen = el('div', { className: 'screen connect-screen' });

  connectArea = el('div', { className: 'connect-area' });

  // SVG for lines
  svgEl = el('svg', { className: 'connect-svg' });
  connectArea.appendChild(svgEl);

  // Left column: words
  const shuffledWords = shuffle([...state.pairs]);
  const leftCol = el('div', { className: 'connect-column' });
  for (const pair of shuffledWords) {
    const item = el('div', {
      className: 'connect-item',
      'data-type': 'word',
      'data-id': pair.id,
      onClick: (e) => handleSelect('word', pair.id, e.currentTarget),
    },
      el('span', { className: 'connect-word' }, pair.word)
    );
    leftCol.appendChild(item);
  }

  // Right column: emoji (different shuffle)
  const shuffledEmojis = shuffle([...state.pairs]);
  const rightCol = el('div', { className: 'connect-column' });
  for (const pair of shuffledEmojis) {
    const item = el('div', {
      className: 'connect-item',
      'data-type': 'emoji',
      'data-id': pair.id,
      onClick: (e) => handleSelect('emoji', pair.id, e.currentTarget),
    },
      el('span', { className: 'connect-emoji' }, pair.emoji)
    );
    rightCol.appendChild(item);
  }

  connectArea.appendChild(leftCol);
  connectArea.appendChild(rightCol);
  screen.appendChild(connectArea);
  container.appendChild(screen);
  container.appendChild(backBtn);
}

/**
 * Handle tap on a word or emoji item.
 */
async function handleSelect(type, id, element) {
  if (state.busy) return;
  if (state.matched.has(id)) return;

  // If nothing selected yet, select this item
  if (!state.selected) {
    state.selected = { type, id, element };
    element.classList.add('selected');
    return;
  }

  // If same type selected, switch selection
  if (state.selected.type === type) {
    state.selected.element.classList.remove('selected');
    state.selected = { type, id, element };
    element.classList.add('selected');
    return;
  }

  // Different types selected — check match
  state.busy = true;
  state.selected.element.classList.remove('selected');

  const isCorrect = state.selected.id === id;

  if (isCorrect) {
    // Draw permanent line
    drawLine(state.selected, { type, id, element }, true);

    // Mark both as matched
    state.matched.add(id);
    const wordEl = type === 'word' ? element : state.selected.element;
    const emojiEl = type === 'emoji' ? element : state.selected.element;
    wordEl.classList.add('matched');
    emojiEl.classList.add('matched');

    await showCorrect(1500);

    // Check if level complete
    if (state.matched.size === state.pairs.length) {
      await showCelebration(4000);
      loadLevel();
      return;
    }
  } else {
    await showIncorrect(2000);
  }

  state.selected = null;
  state.busy = false;
}

/**
 * Draw an SVG line between two items.
 */
function drawLine(item1, item2, correct) {
  if (!svgEl || !connectArea) return;

  const el1 = item1.element;
  const el2 = item2.element;

  const pos1 = getCenter(el1, connectArea);
  const pos2 = getCenter(el2, connectArea);

  const line = el('line', {
    className: `connect-line ${correct ? 'correct' : 'temp'}`,
    x1: pos1.x,
    y1: pos1.y,
    x2: pos2.x,
    y2: pos2.y,
    stroke: correct ? '#4caf50' : '#ffd700',
  });

  svgEl.appendChild(line);
}
