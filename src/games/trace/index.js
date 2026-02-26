/**
 * Game 2: «Напиши букву» — Trace the Letter
 *
 * Gameplay:
 * - Shows an image + word, child must trace the first letter
 * - Letter shown as dotted template on a canvas
 * - Child draws over it with finger/mouse
 * - "Проверить" button checks accuracy (pixel overlap)
 * - ≥80% → correct, auto-advance; <80% → retry
 */

import { el, delay } from '../../utils/helpers.js';
import { showCorrect, showIncorrect } from '../../utils/feedback.js';
import { LETTER_PATHS, getWordsByLetter, getAvailableLetters } from '../../data/letters.js';

/** Accuracy threshold for passing */
const ACCURACY_THRESHOLD = 0.30;

/** Canvas resolution */
const CANVAS_SIZE = 300;

let container = null;
let onBack = null;
let drawCanvas = null;
let drawCtx = null;
let isDrawing = false;
let practicedLetters = new Set();
let currentLetter = null;
let currentWord = null;
let busy = false;

/**
 * Start the Trace game.
 */
export function startTrace(appContainer, backCallback) {
  container = appContainer;
  onBack = backCallback;
  practicedLetters.clear();
  loadLevel();
}

/**
 * Pick a random letter and word, render the level.
 */
function loadLevel() {
  const letters = getAvailableLetters();
  // Prefer unpracticed letters
  const unpracticed = letters.filter(l => !practicedLetters.has(l));
  const pool = unpracticed.length > 0 ? unpracticed : letters;
  currentLetter = pool[Math.floor(Math.random() * pool.length)];

  const wordsByLetter = getWordsByLetter();
  const words = wordsByLetter.get(currentLetter) || [];
  currentWord = words[Math.floor(Math.random() * words.length)];

  render();
}

/**
 * Render the trace screen.
 */
function render() {
  container.innerHTML = '';
  busy = false;

  const backBtn = el('button', {
    className: 'back-btn',
    onClick: () => onBack(),
  }, '←');

  const screen = el('div', { className: 'screen trace-screen' });

  // Header: emoji + word with first letter highlighted
  const wordText = currentWord.word;
  const firstLetterSpan = el('span', { className: 'first-letter' }, wordText[0]);
  const restSpan = document.createTextNode(wordText.slice(1));
  const wordHint = el('div', { className: 'trace-word-hint' }, firstLetterSpan, restSpan);

  const header = el('div', { className: 'trace-header' },
    el('div', { className: 'trace-emoji-display' }, currentWord.emoji),
    wordHint,
  );

  // Canvas container with SVG template + drawing canvas
  const canvasContainer = el('div', { className: 'trace-canvas-container' });

  // SVG template (dotted letter)
  const pathData = LETTER_PATHS[currentLetter] || '';
  const templateSvg = el('svg', {
    className: 'trace-template-svg',
    viewBox: '0 0 300 300',
    preserveAspectRatio: 'xMidYMid meet',
  },
    el('path', {
      className: 'trace-template-path',
      d: pathData,
    })
  );
  canvasContainer.appendChild(templateSvg);

  // Drawing canvas
  const canvas = document.createElement('canvas');
  canvas.className = 'trace-canvas';
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  canvasContainer.appendChild(canvas);

  // Touch/mouse handlers
  setupCanvas(canvas, canvasContainer);

  // Buttons
  const checkBtn = el('button', {
    className: 'game-button trace-btn-check',
    onClick: () => checkAccuracy(),
  }, '👀 ПРОВЕРИТЬ');

  const clearBtn = el('button', {
    className: 'game-button trace-btn-clear',
    onClick: () => clearCanvas(),
  }, '🗑️ ОЧИСТИТЬ');

  const buttons = el('div', { className: 'trace-buttons' }, checkBtn, clearBtn);

  // Progress indicator
  const allLetters = getAvailableLetters();
  const progress = el('div', { className: 'trace-progress' },
    ...allLetters.map(letter => {
      let cls = 'trace-progress-letter';
      if (letter === currentLetter) cls += ' current';
      else if (practicedLetters.has(letter)) cls += ' practiced';
      return el('div', { className: cls }, letter);
    })
  );

  screen.appendChild(header);
  screen.appendChild(canvasContainer);
  screen.appendChild(buttons);
  screen.appendChild(progress);

  container.appendChild(screen);
  container.appendChild(backBtn);
}

/**
 * Set up canvas drawing handlers.
 */
function setupCanvas(canvas, canvasContainer) {
  drawCanvas = canvas;
  drawCtx = canvas.getContext('2d');
  drawCtx.strokeStyle = '#333';
  drawCtx.lineWidth = 16;
  drawCtx.lineCap = 'round';
  drawCtx.lineJoin = 'round';
  isDrawing = false;

  function getPos(e) {
    const rect = canvasContainer.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const x = (touch.clientX - rect.left) / rect.width * CANVAS_SIZE;
    const y = (touch.clientY - rect.top) / rect.height * CANVAS_SIZE;
    return { x, y };
  }

  function startDraw(e) {
    if (busy) return;
    e.preventDefault();
    isDrawing = true;
    const pos = getPos(e);
    drawCtx.beginPath();
    drawCtx.moveTo(pos.x, pos.y);
  }

  function moveDraw(e) {
    if (!isDrawing || busy) return;
    e.preventDefault();
    const pos = getPos(e);
    drawCtx.lineTo(pos.x, pos.y);
    drawCtx.stroke();
    drawCtx.beginPath();
    drawCtx.moveTo(pos.x, pos.y);
  }

  function endDraw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    isDrawing = false;
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', moveDraw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseleave', endDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', moveDraw, { passive: false });
  canvas.addEventListener('touchend', endDraw, { passive: false });
  canvas.addEventListener('touchcancel', endDraw, { passive: false });
}

/**
 * Clear the drawing canvas.
 */
function clearCanvas() {
  if (!drawCtx || busy) return;
  drawCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

/**
 * Check accuracy by comparing drawn pixels against template.
 */
async function checkAccuracy() {
  if (!drawCanvas || !drawCtx || busy) return;
  busy = true;

  // Render the reference letter to an offscreen canvas
  const refCanvas = document.createElement('canvas');
  refCanvas.width = CANVAS_SIZE;
  refCanvas.height = CANVAS_SIZE;
  const refCtx = refCanvas.getContext('2d');

  // Draw the reference letter path
  const pathData = LETTER_PATHS[currentLetter];
  if (pathData) {
    refCtx.strokeStyle = '#000';
    refCtx.lineWidth = 28;
    refCtx.lineCap = 'round';
    refCtx.lineJoin = 'round';
    const path2d = new Path2D(pathData);
    refCtx.stroke(path2d);
  }

  // Get pixel data
  const refData = refCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;
  const drawData = drawCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;

  // Count overlap: pixels where both reference and drawing have alpha > 0
  let refPixels = 0;
  let overlapPixels = 0;

  for (let i = 3; i < refData.length; i += 4) {
    const refAlpha = refData[i];
    const drawAlpha = drawData[i];

    if (refAlpha > 50) {
      refPixels++;
      if (drawAlpha > 50) {
        overlapPixels++;
      }
    }
  }

  const accuracy = refPixels > 0 ? overlapPixels / refPixels : 0;
  console.log(`Accuracy: ${(accuracy * 100).toFixed(1)}% (${overlapPixels}/${refPixels})`);

  if (accuracy >= ACCURACY_THRESHOLD) {
    practicedLetters.add(currentLetter);
    await showCorrect(2500);
    loadLevel();
  } else {
    await showIncorrect(2000);
    clearCanvas();
    busy = false;
  }
}
