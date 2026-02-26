/**
 * Game 1: «Соедини» — Match the Word to the Picture
 *
 * Drag-to-connect: child presses on a word or image, drags a line
 * to the matching item, and releases to complete the connection.
 */

import { el, shuffle, pickRandom, getCenter, delay } from '../../utils/helpers.js';
import { showCorrect, showIncorrect, showCelebration } from '../../utils/feedback.js';
import { getUniqueWords } from '../../data/words.js';

const PAIRS_PER_LEVEL = 5;
const allWords = getUniqueWords();

let state = {
  pairs: [],
  matched: new Set(),
  busy: false,
};

let container = null;
let svgEl = null;
let connectArea = null;
let onBack = null;

// Drag state
let dragFrom = null;       // { type, id, element }
let dragLine = null;       // SVG line element (temp)
let itemElements = [];     // All interactive item elements with metadata

export function startConnect(appContainer, backCallback) {
  container = appContainer;
  onBack = backCallback;
  loadLevel();
}

function loadLevel() {
  const selected = pickRandom(allWords, PAIRS_PER_LEVEL);
  state = {
    pairs: selected.map((w, i) => ({ ...w, id: i })),
    matched: new Set(),
    busy: false,
  };
  dragFrom = null;
  dragLine = null;
  itemElements = [];
  render();
}

function render() {
  container.innerHTML = '';

  const backBtn = el('button', {
    className: 'back-btn',
    onClick: () => onBack(),
  }, '←');

  const screen = el('div', { className: 'screen connect-screen' });
  connectArea = el('div', { className: 'connect-area' });

  svgEl = el('svg', { className: 'connect-svg' });
  connectArea.appendChild(svgEl);

  // Left column: words (shuffled)
  const shuffledWords = shuffle([...state.pairs]);
  const leftCol = el('div', { className: 'connect-column' });
  for (const pair of shuffledWords) {
    const item = el('div', {
      className: 'connect-item',
      'data-type': 'word',
      'data-id': String(pair.id),
    },
      el('span', { className: 'connect-word' }, pair.word)
    );
    leftCol.appendChild(item);
    itemElements.push({ element: item, type: 'word', id: pair.id });
  }

  // Right column: emoji (different shuffle)
  const shuffledEmojis = shuffle([...state.pairs]);
  const rightCol = el('div', { className: 'connect-column' });
  for (const pair of shuffledEmojis) {
    const item = el('div', {
      className: 'connect-item',
      'data-type': 'emoji',
      'data-id': String(pair.id),
    },
      el('span', { className: 'connect-emoji' }, pair.emoji)
    );
    rightCol.appendChild(item);
    itemElements.push({ element: item, type: 'emoji', id: pair.id });
  }

  connectArea.appendChild(leftCol);
  connectArea.appendChild(rightCol);
  screen.appendChild(connectArea);
  container.appendChild(screen);
  container.appendChild(backBtn);

  // Set up drag handlers on the connect area
  setupDragHandlers();
}

/**
 * Find which item (if any) is at the given page coordinates.
 */
function findItemAt(pageX, pageY) {
  for (const entry of itemElements) {
    const rect = entry.element.getBoundingClientRect();
    // Generous hit area (+12px padding)
    const pad = 12;
    if (
      pageX >= rect.left - pad &&
      pageX <= rect.right + pad &&
      pageY >= rect.top - pad &&
      pageY <= rect.bottom + pad
    ) {
      return entry;
    }
  }
  return null;
}

/**
 * Get pointer position relative to connectArea.
 */
function getPointerPos(e) {
  const touch = e.touches ? e.touches[0] : e;
  const rect = connectArea.getBoundingClientRect();
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
    pageX: touch.clientX,
    pageY: touch.clientY,
  };
}

/**
 * Set up touch/mouse drag handlers for drawing lines.
 */
function setupDragHandlers() {
  function onStart(e) {
    if (state.busy) return;
    const pos = getPointerPos(e);
    const item = findItemAt(pos.pageX, pos.pageY);
    if (!item || state.matched.has(item.id)) return;

    e.preventDefault();
    dragFrom = item;
    dragFrom.element.classList.add('selected');

    // Create temp line
    const fromCenter = getCenter(item.element, connectArea);
    dragLine = el('line', {
      className: 'connect-line temp',
      x1: fromCenter.x,
      y1: fromCenter.y,
      x2: pos.x,
      y2: pos.y,
      stroke: '#ffd700',
    });
    svgEl.appendChild(dragLine);
  }

  function onMove(e) {
    if (!dragFrom || !dragLine) return;
    e.preventDefault();
    const pos = getPointerPos(e);
    dragLine.setAttribute('x2', pos.x);
    dragLine.setAttribute('y2', pos.y);

    // Highlight item under pointer
    const itemUnder = findItemAt(pos.pageX, pos.pageY);
    for (const entry of itemElements) {
      if (entry === dragFrom) continue;
      if (entry === itemUnder && !state.matched.has(entry.id) && entry.type !== dragFrom.type) {
        entry.element.classList.add('hover');
      } else {
        entry.element.classList.remove('hover');
      }
    }
  }

  async function onEnd(e) {
    if (!dragFrom || !dragLine) return;
    e.preventDefault();

    // Determine where finger was released
    let releaseX, releaseY;
    if (e.changedTouches) {
      releaseX = e.changedTouches[0].clientX;
      releaseY = e.changedTouches[0].clientY;
    } else {
      releaseX = e.clientX;
      releaseY = e.clientY;
    }

    const target = findItemAt(releaseX, releaseY);

    // Remove temp line
    dragLine.remove();
    dragLine = null;
    dragFrom.element.classList.remove('selected');

    // Clear all hover states
    for (const entry of itemElements) {
      entry.element.classList.remove('hover');
    }

    // Valid drop?
    if (target && target !== dragFrom && target.type !== dragFrom.type && !state.matched.has(target.id)) {
      state.busy = true;
      const isCorrect = target.id === dragFrom.id;

      if (isCorrect) {
        // Draw permanent line
        const fromCenter = getCenter(dragFrom.element, connectArea);
        const toCenter = getCenter(target.element, connectArea);
        const permLine = el('line', {
          className: 'connect-line correct',
          x1: fromCenter.x,
          y1: fromCenter.y,
          x2: toCenter.x,
          y2: toCenter.y,
          stroke: '#4caf50',
        });
        svgEl.appendChild(permLine);

        state.matched.add(target.id);
        dragFrom.element.classList.add('matched');
        target.element.classList.add('matched');

        await showCorrect(1500);

        if (state.matched.size === state.pairs.length) {
          await showCelebration(4000);
          loadLevel();
          return;
        }
      } else {
        await showIncorrect(2000);
      }

      state.busy = false;
    }

    dragFrom = null;
  }

  // Mouse events
  connectArea.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  // Touch events
  connectArea.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd, { passive: false });
  window.addEventListener('touchcancel', onEnd, { passive: false });
}
