/**
 * Game 1: «Соедини» — Match the Word to the Picture
 * Drag-to-connect interaction with sound effects.
 */

import { el, shuffle, pickRandom, getCenter, delay } from '../../utils/helpers.js';
import { showCorrect, showIncorrect, showCelebration } from '../../utils/feedback.js';
import { getUniqueWords } from '../../data/words.js';
import { playSwoosh, playPop } from '../../utils/audio.js';

const PAIRS_PER_LEVEL = 5;
const allWords = getUniqueWords();

let state = { pairs: [], matched: new Set(), busy: false };
let container = null;
let svgEl = null;
let connectArea = null;
let onBack = null;
let dragFrom = null;
let dragLine = null;
let itemElements = [];

export function startConnect(appContainer, backCallback) {
  container = appContainer;
  onBack = backCallback;
  loadLevel();
}

function loadLevel() {
  const selected = pickRandom(allWords, PAIRS_PER_LEVEL);
  state = { pairs: selected.map((w, i) => ({ ...w, id: i })), matched: new Set(), busy: false };
  dragFrom = null;
  dragLine = null;
  itemElements = [];
  render();
}

function render() {
  container.innerHTML = '';

  const backBtn = el('button', { className: 'back-btn', onClick: () => onBack() }, '←');
  const screen = el('div', { className: 'screen connect-screen' });
  connectArea = el('div', { className: 'connect-area' });
  svgEl = el('svg', { className: 'connect-svg' });
  connectArea.appendChild(svgEl);

  const shuffledWords = shuffle([...state.pairs]);
  const leftCol = el('div', { className: 'connect-column' });
  for (const pair of shuffledWords) {
    const item = el('div', { className: 'connect-item', 'data-type': 'word', 'data-id': String(pair.id) },
      el('span', { className: 'connect-word' }, pair.word)
    );
    leftCol.appendChild(item);
    itemElements.push({ element: item, type: 'word', id: pair.id });
  }

  const shuffledEmojis = shuffle([...state.pairs]);
  const rightCol = el('div', { className: 'connect-column' });
  for (const pair of shuffledEmojis) {
    const item = el('div', { className: 'connect-item', 'data-type': 'emoji', 'data-id': String(pair.id) },
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
  setupDragHandlers();
}

function findItemAt(pageX, pageY) {
  for (const entry of itemElements) {
    const rect = entry.element.getBoundingClientRect();
    const pad = 12;
    if (pageX >= rect.left - pad && pageX <= rect.right + pad &&
        pageY >= rect.top - pad && pageY <= rect.bottom + pad) {
      return entry;
    }
  }
  return null;
}

function getPointerPos(e) {
  const touch = e.touches ? e.touches[0] : e;
  const rect = connectArea.getBoundingClientRect();
  return { x: touch.clientX - rect.left, y: touch.clientY - rect.top, pageX: touch.clientX, pageY: touch.clientY };
}

function setupDragHandlers() {
  function onStart(e) {
    if (state.busy) return;
    const pos = getPointerPos(e);
    const item = findItemAt(pos.pageX, pos.pageY);
    if (!item || state.matched.has(item.id)) return;
    e.preventDefault();
    playSwoosh();
    dragFrom = item;
    dragFrom.element.classList.add('selected');
    const fromCenter = getCenter(item.element, connectArea);
    dragLine = el('line', {
      className: 'connect-line temp', x1: fromCenter.x, y1: fromCenter.y, x2: pos.x, y2: pos.y, stroke: '#ffd700',
    });
    svgEl.appendChild(dragLine);
  }

  function onMove(e) {
    if (!dragFrom || !dragLine) return;
    e.preventDefault();
    const pos = getPointerPos(e);
    dragLine.setAttribute('x2', pos.x);
    dragLine.setAttribute('y2', pos.y);
    const itemUnder = findItemAt(pos.pageX, pos.pageY);
    for (const entry of itemElements) {
      if (entry === dragFrom) continue;
      entry.element.classList.toggle('hover',
        entry === itemUnder && !state.matched.has(entry.id) && entry.type !== dragFrom.type);
    }
  }

  async function onEnd(e) {
    if (!dragFrom || !dragLine) return;
    e.preventDefault();
    let rx, ry;
    if (e.changedTouches) { rx = e.changedTouches[0].clientX; ry = e.changedTouches[0].clientY; }
    else { rx = e.clientX; ry = e.clientY; }

    const target = findItemAt(rx, ry);
    dragLine.remove();
    dragLine = null;
    dragFrom.element.classList.remove('selected');
    for (const entry of itemElements) entry.element.classList.remove('hover');

    if (target && target !== dragFrom && target.type !== dragFrom.type && !state.matched.has(target.id)) {
      state.busy = true;
      if (target.id === dragFrom.id) {
        playPop();
        const fromCenter = getCenter(dragFrom.element, connectArea);
        const toCenter = getCenter(target.element, connectArea);
        svgEl.appendChild(el('line', {
          className: 'connect-line correct', x1: fromCenter.x, y1: fromCenter.y, x2: toCenter.x, y2: toCenter.y, stroke: '#4caf50',
        }));
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

  connectArea.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  connectArea.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd, { passive: false });
  window.addEventListener('touchcancel', onEnd, { passive: false });
}
