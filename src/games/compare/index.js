/**
 * Game: «Сравнение для ребёнка» — Which number is bigger?
 * Round-based: 30 seconds, +1 correct / -1 wrong, 2-6 circles scattered.
 */

import { el, delay } from '../../utils/helpers.js';
import { playCorrect, playIncorrect, playTap, playCelebration } from '../../utils/audio.js';

const ROUND_SECONDS = 30;
const CIRCLE_R = 56; // radius in px (all circles same size)

let container = null;
let onBack = null;
let busy = false;
let numbers = [];
let score = 0;
let timeLeft = 0;
let timerInterval = null;

export function startCompare(appContainer, backCallback) {
  container = appContainer;
  onBack = backCallback;
  showStart();
}

/* ─── Start ─────────────────────────────────────── */
function showStart() {
  stopTimer();
  container.innerHTML = '';
  const backBtn = el('button', { className: 'back-btn', onClick: () => { playTap(); onBack(); } }, '←');
  const screen = el('div', {
    className: 'screen',
    style: { background: 'linear-gradient(135deg, #4a3f8f, #6b5fcf)', gap: '24px' },
  },
    el('h1', { style: { fontSize: '2.2em', color: '#fff', textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,.3)' } }, '🔢 БОЛЬШЕ'),
    el('p', { style: { fontSize: '1.1em', color: '#fff', opacity: '0.9', textAlign: 'center', padding: '0 20px', textTransform: 'uppercase' } },
      'НАЖМИ НА НАИБОЛЬШЕЕ ЧИСЛО!'
    ),
    el('p', { style: { fontSize: '1em', color: '#fff', opacity: '0.7', textAlign: 'center', textTransform: 'uppercase' } },
      `⏱ ${ROUND_SECONDS} СЕК · +1 ✓ · -1 ✗`
    ),
    el('button', {
      className: 'game-button',
      style: { background: '#ff6b6b', color: '#fff', padding: '18px 50px', fontSize: '1.3em', borderRadius: '50px' },
      onClick: () => { playTap(); startRound(); },
    }, 'НАЧАТЬ'),
  );
  container.appendChild(screen);
  container.appendChild(backBtn);
}

/* ─── Round ──────────────────────────────────────── */
function startRound() {
  score = 0;
  timeLeft = ROUND_SECONDS;
  nextQuestion();
  startTimer();
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    const bar = container.querySelector('.compare-timer-fill');
    const label = container.querySelector('.compare-timer-label');
    if (bar) bar.style.width = (timeLeft / ROUND_SECONDS * 100) + '%';
    if (label) label.textContent = timeLeft;
    if (timeLeft <= 0) { stopTimer(); showResult(); }
  }, 1000);
}

function randomNum() {
  return Math.floor(Math.random() * 199) - 99; // -99 to 99
}

function nextQuestion() {
  busy = false;
  const count = 2 + Math.floor(Math.random() * 5); // 2–6
  numbers = [];
  while (numbers.length < count) {
    const n = randomNum();
    if (!numbers.includes(n)) numbers.push(n);
  }
  render();
}

/* ─── Answer ─────────────────────────────────────── */
async function handlePick(idx, circleEl) {
  if (busy) return;
  busy = true;
  playTap();

  const maxVal = Math.max(...numbers);
  const correct = numbers[idx] === maxVal;

  if (correct) { score++; playCorrect(); }
  else { score = Math.max(0, score - 1); playIncorrect(); }

  const circles = container.querySelectorAll('.compare-circle');
  circles.forEach((c, i) => {
    if (numbers[i] === maxVal) c.classList.add('correct');
    else if (i === idx) c.classList.add('incorrect');
    else c.classList.add('dim');
  });

  const scoreEl = container.querySelector('.compare-score-val');
  if (scoreEl) scoreEl.textContent = score;

  await delay(700);
  if (timeLeft > 0) nextQuestion();
}

/* ─── Render ─────────────────────────────────────── */
function render() {
  container.innerHTML = '';

  const backBtn = el('button', { className: 'back-btn', onClick: () => { playTap(); stopTimer(); onBack(); } }, '←');
  const screen = el('div', { className: 'screen compare-screen' });

  // Top bar
  const topBar = el('div', { className: 'compare-topbar' },
    el('div', { className: 'compare-score' },
      el('span', { className: 'compare-score-label' }, '⭐ '),
      el('span', { className: 'compare-score-val' }, String(score)),
    ),
    el('div', { className: 'compare-timer' },
      el('div', { className: 'compare-timer-track' },
        el('div', { className: 'compare-timer-fill', style: { width: (timeLeft / ROUND_SECONDS * 100) + '%' } }),
      ),
      el('div', { className: 'compare-timer-label' }, String(timeLeft)),
    ),
  );

  const title = el('div', { className: 'compare-title' }, 'НАЖМИ НА НАИБОЛЬШЕЕ');

  // Scatter arena — fills remaining space
  const arena = el('div', { className: 'compare-arena' });

  screen.appendChild(topBar);
  screen.appendChild(title);
  screen.appendChild(arena);
  container.appendChild(screen);
  container.appendChild(backBtn);

  // Place circles after layout so we know arena size
  requestAnimationFrame(() => {
    const W = arena.clientWidth;
    const H = arena.clientHeight;
    const D = CIRCLE_R * 2;
    const pad = CIRCLE_R + 4;
    const placed = [];

    numbers.forEach((num, i) => {
      let cx, cy, ok, attempts = 0;
      do {
        cx = pad + Math.random() * (W - pad * 2);
        cy = pad + Math.random() * (H - pad * 2);
        ok = !placed.some(p => Math.hypot(p.x - cx, p.y - cy) < D + 8);
        attempts++;
      } while (!ok && attempts < 400);
      placed.push({ x: cx, y: cy });

      const circle = document.createElement('div');
      circle.className = 'compare-circle';
      circle.textContent = String(num);
      circle.style.left = (cx - CIRCLE_R) + 'px';
      circle.style.top = (cy - CIRCLE_R) + 'px';
      circle.addEventListener('click', () => handlePick(i, circle));
      arena.appendChild(circle);
    });
  });
}

/* ─── Result ─────────────────────────────────────── */
function showResult() {
  playCelebration();
  container.innerHTML = '';

  const backBtn = el('button', { className: 'back-btn', onClick: () => { playTap(); onBack(); } }, '←');
  const prev = parseInt(localStorage.getItem('compare-best') || '0');
  const isNewRecord = score > prev;
  if (isNewRecord) localStorage.setItem('compare-best', String(score));
  const bestScore = Math.max(score, prev);

  const screen = el('div', {
    className: 'screen',
    style: { background: 'linear-gradient(135deg, #4a3f8f, #6b5fcf)', gap: '20px' },
  },
    el('div', { style: { fontSize: '3.5em' } }, isNewRecord ? '🏆' : '⭐'),
    el('h1', { style: { fontSize: '2.4em', color: '#fff', textAlign: 'center', textShadow: '0 2px 12px rgba(0,0,0,.3)' } }, `${score} ОЧКОВ`),
    isNewRecord
      ? el('div', { style: { fontSize: '1.2em', color: '#ffd700', fontWeight: 900, textTransform: 'uppercase', textShadow: '0 0 20px rgba(255,215,0,0.7)', letterSpacing: '2px' } }, '🌟 НОВЫЙ РЕКОРД!')
      : el('div', { style: { fontSize: '1em', color: '#fff', opacity: '0.65', textTransform: 'uppercase' } }, `РЕКОРД: ${bestScore} ОЧКОВ`),
    el('button', {
      className: 'game-button',
      style: { background: '#ff6b6b', color: '#fff', fontSize: '1.2em', borderRadius: '50px', padding: '16px 44px' },
      onClick: () => { playTap(); startRound(); },
    }, 'ЕЩЁ РАЗ 🔁'),
    el('button', {
      className: 'game-button',
      style: { background: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: '1em', borderRadius: '50px' },
      onClick: () => { playTap(); showStart(); },
    }, '← МЕНЮ'),
  );

  container.appendChild(screen);
  container.appendChild(backBtn);
}
