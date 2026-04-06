/**
 * Game 2: «Напиши букву» — Trace the Letter
 */

import { el, delay } from '../../utils/helpers.js';
import { showCorrect, showIncorrect } from '../../utils/feedback.js';
import { LETTER_PATHS, getWordsByLetter, getAvailableLetters } from '../../data/letters.js';
import { playTap, playPop } from '../../utils/audio.js';

const ACCURACY_THRESHOLD = 0.55;
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

export function startTrace(appContainer, backCallback) {
  container = appContainer;
  onBack = backCallback;
  practicedLetters.clear();
  loadLevel();
}

function loadLevel() {
  const letters = getAvailableLetters();
  const unpracticed = letters.filter(l => !practicedLetters.has(l));
  const pool = unpracticed.length > 0 ? unpracticed : letters;
  currentLetter = pool[Math.floor(Math.random() * pool.length)];

  const wordsByLetter = getWordsByLetter();
  const words = wordsByLetter.get(currentLetter) || [];
  currentWord = words[Math.floor(Math.random() * words.length)];

  render();
}

/** Select a specific letter (from progress bar click). */
function selectLetter(letter) {
  if (busy) return;
  playTap();
  currentLetter = letter;

  const wordsByLetter = getWordsByLetter();
  const words = wordsByLetter.get(currentLetter) || [];
  currentWord = words[Math.floor(Math.random() * words.length)];

  render();
}

function render() {
  container.innerHTML = '';
  busy = false;

  const backBtn = el('button', {
    className: 'back-btn',
    onClick: () => onBack(),
  }, '←');

  const screen = el('div', { className: 'screen trace-screen' });

  // Header
  const wordText = currentWord.word;
  const firstLetterSpan = el('span', { className: 'first-letter' }, wordText[0]);
  const restSpan = document.createTextNode(wordText.slice(1));
  const wordHint = el('div', { className: 'trace-word-hint' }, firstLetterSpan, restSpan);

  const header = el('div', { className: 'trace-header' },
    el('div', { className: 'trace-emoji-display' }, currentWord.emoji),
    wordHint,
  );

  // Canvas container
  const canvasContainer = el('div', { className: 'trace-canvas-container' });

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

  const canvas = document.createElement('canvas');
  canvas.className = 'trace-canvas';
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  canvasContainer.appendChild(canvas);

  setupCanvas(canvas, canvasContainer);

  // Buttons
  const checkBtn = el('button', {
    className: 'game-button trace-btn-check',
    onClick: () => { playTap(); checkAccuracy(); },
  }, '👀 ПРОВЕРИТЬ');

  const clearBtn = el('button', {
    className: 'game-button trace-btn-clear',
    onClick: () => { playPop(); clearCanvas(); },
  }, '🗑️ ОЧИСТИТЬ');

  const buttons = el('div', { className: 'trace-buttons' }, checkBtn, clearBtn);

  // Clickable progress — tap any letter to practice it
  const allLetters = getAvailableLetters();
  const progress = el('div', { className: 'trace-progress' },
    ...allLetters.map(letter => {
      let cls = 'trace-progress-letter';
      if (letter === currentLetter) cls += ' current';
      else if (practicedLetters.has(letter)) cls += ' practiced';
      return el('div', {
        className: cls,
        onClick: () => selectLetter(letter),
      }, letter);
    })
  );

  screen.appendChild(header);
  screen.appendChild(canvasContainer);
  screen.appendChild(buttons);
  screen.appendChild(progress);

  container.appendChild(screen);
  container.appendChild(backBtn);
}

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
    return {
      x: (touch.clientX - rect.left) / rect.width * CANVAS_SIZE,
      y: (touch.clientY - rect.top) / rect.height * CANVAS_SIZE,
    };
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

function clearCanvas() {
  if (!drawCtx || busy) return;
  drawCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

async function checkAccuracy() {
  if (!drawCanvas || !drawCtx || busy) return;
  busy = true;

  const refCanvas = document.createElement('canvas');
  refCanvas.width = CANVAS_SIZE;
  refCanvas.height = CANVAS_SIZE;
  const refCtx = refCanvas.getContext('2d');

  const pathData = LETTER_PATHS[currentLetter];
  if (pathData) {
    refCtx.strokeStyle = '#000';
    refCtx.lineWidth = 28;
    refCtx.lineCap = 'round';
    refCtx.lineJoin = 'round';
    const path2d = new Path2D(pathData);
    refCtx.stroke(path2d);
  }

  const refData = refCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;
  const drawData = drawCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;

  let refPixels = 0;
  let overlapPixels = 0;
  let drawnPixels = 0;

  for (let i = 3; i < refData.length; i += 4) {
    const isRef = refData[i] > 50;
    const isDrawn = drawData[i] > 50;
    if (isRef) refPixels++;
    if (isDrawn) drawnPixels++;
    if (isRef && isDrawn) overlapPixels++;
  }

  const coverage = refPixels > 0 ? overlapPixels / refPixels : 0;
  const precision = drawnPixels > 0 ? overlapPixels / drawnPixels : 0;
  const accuracy = (coverage + precision > 0) ? 2 * coverage * precision / (coverage + precision) : 0;
  console.log(`Coverage: ${(coverage * 100).toFixed(1)}%, Precision: ${(precision * 100).toFixed(1)}%, F1: ${(accuracy * 100).toFixed(1)}%`);

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
