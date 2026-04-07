/**
 * Game: «Сравнение для ребёнка» — Which number is bigger?
 * Round-based: 30 seconds, +1 correct / -1 wrong, 2-4 circles.
 */

import { el, delay } from '../../utils/helpers.js';
import { playCorrect, playIncorrect, playTap, playCelebration } from '../../utils/audio.js';

const ROUND_SECONDS = 30;

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
      'НАЖМИ НА НАИБОЛЬШЕЕ ЧИСЛО КАК МОЖНО БЫСТРЕЕ!'
    ),
    el('p', { style: { fontSize: '1em', color: '#fff', opacity: '0.7', textAlign: 'center', textTransform: 'uppercase' } },
      `⏱ ${ROUND_SECONDS} СЕКУНД · +1 ПРАВИЛЬНО · -1 ОШИБКА`
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
    if (timeLeft <= 0) {
      stopTimer();
      showResult();
    }
  }, 1000);
}

function randomNum() {
  return Math.floor(Math.random() * 19) + 1; // 1–19, nice for kids
}

function nextQuestion() {
  busy = false;
  const count = [2, 2, 3, 3, 4][Math.floor(Math.random() * 5)]; // 2 more likely
  numbers = [];
  while (numbers.length < count) {
    const n = randomNum();
    if (!numbers.includes(n)) numbers.push(n);
  }
  render();
}

async function handlePick(idx) {
  if (busy) return;
  busy = true;
  playTap();

  const maxVal = Math.max(...numbers);
  const correct = numbers[idx] === maxVal;

  if (correct) {
    score++;
    playCorrect();
  } else {
    score = Math.max(0, score - 1);
    playIncorrect();
  }

  // Flash feedback on circles
  const circles = container.querySelectorAll('.compare-circle');
  circles.forEach((c, i) => {
    if (numbers[i] === maxVal) c.classList.add('correct');
    else if (i === idx) c.classList.add('incorrect');
    else c.classList.add('dim');
  });

  // Update score display
  const scoreEl = container.querySelector('.compare-score-val');
  if (scoreEl) scoreEl.textContent = score;

  await delay(700);
  nextQuestion();
}

function render() {
  container.innerHTML = '';

  const backBtn = el('button', { className: 'back-btn', onClick: () => { playTap(); stopTimer(); onBack(); } }, '←');

  const screen = el('div', { className: 'screen compare-screen' });

  // Top bar: score + timer
  const topBar = el('div', { className: 'compare-topbar' },
    el('div', { className: 'compare-score' },
      el('span', { className: 'compare-score-label' }, '⭐ '),
      el('span', { className: 'compare-score-val' }, String(score)),
    ),
    el('div', { className: 'compare-timer' },
      el('div', { className: 'compare-timer-track' },
        el('div', {
          className: 'compare-timer-fill',
          style: { width: (timeLeft / ROUND_SECONDS * 100) + '%' },
        }),
      ),
      el('div', { className: 'compare-timer-label' }, String(timeLeft)),
    ),
  );

  const title = el('div', { className: 'compare-title' }, 'НАЖМИ НА НАИБОЛЬШЕЕ');

  const count = numbers.length;
  const arena = el('div', { className: `compare-arena compare-arena-${count}` });

  numbers.forEach((num, i) => {
    const circle = el('div', {
      className: 'compare-circle',
      onClick: () => handlePick(i),
    }, String(num));
    arena.appendChild(circle);
  });

  screen.appendChild(topBar);
  screen.appendChild(title);
  screen.appendChild(arena);

  container.appendChild(screen);
  container.appendChild(backBtn);
}

function showResult() {
  playCelebration();
  container.innerHTML = '';

  const backBtn = el('button', { className: 'back-btn', onClick: () => { playTap(); onBack(); } }, '←');

  // Save best
  const best = parseInt(localStorage.getItem('compare-best') || '0');
  if (score > best) localStorage.setItem('compare-best', String(score));
  const bestScore = Math.max(score, best);

  const screen = el('div', {
    className: 'screen',
    style: { background: 'linear-gradient(135deg, #4a3f8f, #6b5fcf)', gap: '20px' },
  },
    el('div', { style: { fontSize: '3em' } }, score >= best ? '🏆' : '⭐'),
    el('h1', { style: { fontSize: '2em', color: '#fff', textAlign: 'center' } }, `${score} ОЧКОВ`),
    el('div', { style: { fontSize: '1em', color: '#fff', opacity: '0.7', textTransform: 'uppercase' } },
      `РЕКОРД: ${bestScore}`
    ),
    el('button', {
      className: 'game-button',
      style: { background: '#ff6b6b', color: '#fff', fontSize: '1.2em', borderRadius: '50px' },
      onClick: () => { playTap(); startRound(); },
    }, 'ЕЩЁ РАЗ'),
    el('button', {
      className: 'game-button',
      style: { background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '1em', borderRadius: '50px' },
      onClick: () => { playTap(); showStart(); },
    }, 'МЕНЮ'),
  );

  container.appendChild(screen);
  container.appendChild(backBtn);
}
