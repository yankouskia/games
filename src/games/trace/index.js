/**
 * Game 2: «Напиши букву» — Trace the Letter
 */

import { el } from '../../utils/helpers.js';
import { showCorrect, showIncorrect } from '../../utils/feedback.js';
import { LETTER_PATHS, getWordsByLetter, getAvailableLetters } from '../../data/letters.js';
import { playTap, playPop } from '../../utils/audio.js';

const ACCURACY_THRESHOLD = 0.55;
const CANVAS_SIZE = 300;
const AUTO_CHECK_DELAY = 1300;

let container = null;
let onBack = null;
let drawCanvas = null;
let drawCtx = null;
let isDrawing = false;
let practicedLetters = new Set();
let currentLetter = null;
let currentWord = null;
let busy = false;
let drawHue = 0;
let strokePixels = 0;
let checkTimer = null;

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
  clearTimeout(checkTimer);
  container.innerHTML = '';
  busy = false;
  drawHue = Math.random() * 360 | 0;
  strokePixels = 0;

  const backBtn = el('button', {
    className: 'back-btn',
    onClick: () => { clearTimeout(checkTimer); onBack(); },
  }, '←');

  const screen = el('div', { className: 'screen trace-screen' });

  // ── Top bar: stars ──
  const starsTotal = getAvailableLetters().length;
  const topBar = el('div', { className: 'trace-topbar' },
    el('div', { className: 'trace-stars' },
      '⭐ ',
      el('span', { className: 'trace-stars-count' }, `${practicedLetters.size}`),
      el('span', { style: { opacity: '0.45', fontSize: '0.85em' } }, ` / ${starsTotal}`),
    ),
  );

  // ── Word hint ──
  const wordText = currentWord.word;
  const wordHint = el('div', { className: 'trace-word-hint' },
    el('div', { className: 'trace-emoji-display' }, currentWord.emoji),
    el('div', { className: 'trace-word-text' },
      el('span', { className: 'first-letter' }, wordText[0]),
      document.createTextNode(wordText.slice(1)),
    ),
  );

  // ── Instruction ──
  const instruction = el('div', { className: 'trace-instruction' }, 'ОБВЕДИ БУКВУ');

  // ── Canvas ──
  const pathData = LETTER_PATHS[currentLetter] || '';
  const svgNS = 'http://www.w3.org/2000/svg';

  const templateSvg = document.createElementNS(svgNS, 'svg');
  templateSvg.setAttribute('class', 'trace-template-svg');
  templateSvg.setAttribute('viewBox', '0 0 300 300');
  templateSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  templateSvg.innerHTML =
    `<defs>
      <filter id="trace-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path class="trace-template-glow" d="${pathData}"/>
    <path class="trace-template-path" d="${pathData}"/>`;

  const canvas = document.createElement('canvas');
  canvas.className = 'trace-canvas';
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  const canvasContainer = el('div', { className: 'trace-canvas-container' });
  canvasContainer.appendChild(templateSvg);
  canvasContainer.appendChild(canvas);

  setupCanvas(canvas, canvasContainer);

  // ── Clear button ──
  const clearBtn = el('button', {
    className: 'game-button trace-btn-clear',
    onClick: () => { playPop(); clearCanvas(); },
  }, '🗑️ СТЕРЕТЬ');

  // ── Progress chips ──
  const allLetters = getAvailableLetters();
  const progress = el('div', { className: 'trace-progress' },
    ...allLetters.map(letter => {
      let cls = 'trace-chip';
      if (letter === currentLetter) cls += ' current';
      else if (practicedLetters.has(letter)) cls += ' done';
      return el('div', { className: cls, onClick: () => selectLetter(letter) }, letter);
    })
  );

  screen.appendChild(topBar);
  screen.appendChild(wordHint);
  screen.appendChild(instruction);
  screen.appendChild(canvasContainer);
  screen.appendChild(clearBtn);
  screen.appendChild(progress);

  container.appendChild(screen);
  container.appendChild(backBtn);
}

function setupCanvas(canvas, canvasContainer) {
  drawCanvas = canvas;
  drawCtx = canvas.getContext('2d');
  drawCtx.lineWidth = 20;
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
    clearTimeout(checkTimer);
    isDrawing = true;
    const pos = getPos(e);
    drawCtx.beginPath();
    drawCtx.moveTo(pos.x, pos.y);
  }

  function moveDraw(e) {
    if (!isDrawing || busy) return;
    e.preventDefault();
    const pos = getPos(e);
    drawHue = (drawHue + 2) % 360;
    drawCtx.strokeStyle = `hsl(${drawHue}, 100%, 65%)`;
    drawCtx.lineTo(pos.x, pos.y);
    drawCtx.stroke();
    drawCtx.beginPath();
    drawCtx.moveTo(pos.x, pos.y);
    strokePixels++;
  }

  function endDraw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    isDrawing = false;
    if (strokePixels > 60) {
      clearTimeout(checkTimer);
      checkTimer = setTimeout(() => checkAccuracy(), AUTO_CHECK_DELAY);
    }
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
  clearTimeout(checkTimer);
  strokePixels = 0;
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
    refCtx.stroke(new Path2D(pathData));
  }

  const refData = refCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;
  const drawData = drawCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;

  let refPixels = 0, overlapPixels = 0, drawnPixels = 0;
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
