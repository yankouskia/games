/**
 * Game: «Сложение» — 2-player split-screen addition game
 * Each player sees a sum and 3 answer options.
 * +1 correct / -1 wrong. 90 seconds per round.
 */

import { el } from '../../utils/helpers.js';
import { playTap, playCorrect, playIncorrect, playCelebration } from '../../utils/audio.js';

const ROUND_SECONDS = 90;

let container = null;
let onBack = null;
let scores = [0, 0];
let questions = [null, null]; // current question per player
let timeLeft = 0;
let timerInterval = null;
let locked = [false, false];

export function startAddition(appContainer, backCallback) {
  container = appContainer;
  onBack = backCallback;
  showStart();
}

/* ─── Start screen ─────────────────────────────────────── */
function showStart() {
  stopTimer();
  container.innerHTML = '';

  const backBtn = el('button', { className: 'back-btn', onClick: () => { playTap(); onBack(); } }, '←');

  const screen = el('div', {
    className: 'screen',
    style: { background: 'linear-gradient(135deg, #ff6b9d 0%, #c44dff 50%, #4d79ff 100%)', gap: '22px' },
  },
    el('div', { style: { fontSize: '3.5em', lineHeight: 1 } }, '➕'),
    el('h1', { style: { fontSize: '2.2em', color: '#fff', textAlign: 'center', textShadow: '0 3px 12px rgba(0,0,0,.3)', letterSpacing: '2px' } }, 'СЛОЖЕНИЕ'),
    el('p', { style: { fontSize: '1em', color: '#fff', opacity: '0.9', textAlign: 'center', padding: '0 24px', textTransform: 'uppercase', lineHeight: 1.5 } },
      'ДВА ИГРОКА · КАЖДЫЙ НА СВОЕЙ ПОЛОВИНЕ\nНАЙДИ ПРАВИЛЬНЫЙ ОТВЕТ БЫСТРЕЕ!'
    ),
    el('div', { style: { display: 'flex', gap: '12px', fontSize: '1em', color: '#fff', opacity: '0.75', textTransform: 'uppercase' } },
      el('span', {}, `⏱ ${ROUND_SECONDS} СЕК`),
      el('span', {}, '·'),
      el('span', {}, '+1 ✓'),
      el('span', {}, '·'),
      el('span', {}, '-1 ✗'),
    ),
    el('button', {
      className: 'game-button',
      style: { background: '#fff', color: '#c44dff', padding: '18px 52px', fontSize: '1.3em', borderRadius: '50px', fontWeight: 900 },
      onClick: () => { playTap(); startRound(); },
    }, 'НАЧАТЬ'),
    el('p', { style: { fontSize: '0.8em', color: '#fff', opacity: '0.55', textAlign: 'center', textTransform: 'uppercase' } },
      'ПОЛОЖИТЕ ТЕЛЕФОН НА СТОЛ МЕЖДУ ИГРОКАМИ'
    ),
  );

  container.appendChild(screen);
  container.appendChild(backBtn);
}

/* ─── Round ─────────────────────────────────────────────── */
function startRound() {
  scores = [0, 0];
  timeLeft = ROUND_SECONDS;
  locked = [false, false];
  questions[0] = makeQuestion();
  questions[1] = makeQuestion();
  renderGame();
  startTimer();
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI();
    if (timeLeft <= 0) { stopTimer(); showResult(); }
  }, 1000);
}

function updateTimerUI() {
  const fills = container.querySelectorAll('.addition-timer-fill');
  const labels = container.querySelectorAll('.addition-timer-label');
  const pct = (timeLeft / ROUND_SECONDS * 100) + '%';
  fills.forEach(f => { f.style.width = pct; });
  labels.forEach(l => { l.textContent = timeLeft; });
}

/* ─── Question generation ───────────────────────────────── */
function makeQuestion() {
  const a = Math.floor(Math.random() * 6); // 0–5
  const b = Math.floor(Math.random() * 6); // 0–5
  const answer = a + b;
  const wrong = makeWrongAnswers(answer);
  const choices = shuffle([answer, ...wrong]);
  return { a, b, answer, choices };
}

function makeWrongAnswers(correct) {
  const pool = new Set();
  while (pool.size < 2) {
    const delta = (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 1);
    const w = correct + delta;
    if (w > 0 && w !== correct) pool.add(w);
  }
  return [...pool];
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Render ────────────────────────────────────────────── */
function renderGame() {
  container.innerHTML = '';
  const backBtn = el('button', { className: 'back-btn', onClick: () => { playTap(); stopTimer(); onBack(); } }, '←');

  const gameScreen = el('div', { style: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', position: 'absolute', inset: '0' } });

  // top half (player 1, rotated)
  const topHalf = el('div', { className: 'addition-half addition-top' });
  buildPlayerHalf(topHalf, 0);

  // divider with timer
  const divider = el('div', { className: 'addition-divider' },
    el('div', { className: 'addition-timer-wrap' },
      el('div', { className: 'addition-timer-track' },
        el('div', { className: 'addition-timer-fill', style: { width: (timeLeft / ROUND_SECONDS * 100) + '%' } }),
      ),
      el('span', { className: 'addition-timer-label' }, String(timeLeft)),
    ),
  );

  // bottom half (player 2)
  const botHalf = el('div', { className: 'addition-half addition-bottom' });
  buildPlayerHalf(botHalf, 1);

  gameScreen.appendChild(topHalf);
  gameScreen.appendChild(divider);
  gameScreen.appendChild(botHalf);
  container.appendChild(gameScreen);
  container.appendChild(backBtn);
}

function buildPlayerHalf(halfEl, player) {
  const q = questions[player];
  const colors = [
    ['#ff6b9d', '#ff9ebf'], // player 0 — pink
    ['#4d79ff', '#7fa0ff'], // player 1 — blue
  ];
  const [c1, c2] = colors[player];

  halfEl.style.background = `linear-gradient(160deg, ${c1}22 0%, ${c2}11 100%)`;

  const scoreBar = el('div', { className: 'addition-score-bar' },
    el('span', { className: 'addition-player-name', style: { color: c1 } }, `ИГРОК ${player + 1}`),
    el('span', { className: 'addition-score-val' }, String(scores[player])),
  );

  const equation = el('div', { className: 'addition-equation' },
    el('span', { className: 'addition-num' }, String(q.a)),
    el('span', { className: 'addition-op' }, '+'),
    el('span', { className: 'addition-num' }, String(q.b)),
    el('span', { className: 'addition-op' }, '='),
    el('span', { className: 'addition-unknown' }, '?'),
  );

  const choices = el('div', { className: 'addition-choices' },
    ...q.choices.map(val =>
      el('button', {
        className: 'addition-choice',
        style: { '--player-color': c1 },
        onClick: () => handleAnswer(player, val, halfEl),
      }, String(val))
    )
  );

  halfEl.appendChild(scoreBar);
  halfEl.appendChild(equation);
  halfEl.appendChild(choices);
}

/* ─── Answer handling ───────────────────────────────────── */
function handleAnswer(player, val, halfEl) {
  if (locked[player] || timeLeft <= 0) return;
  locked[player] = true;
  playTap();

  const q = questions[player];
  const correct = val === q.answer;

  if (correct) {
    scores[player]++;
    playCorrect();
    flashHalf(halfEl, true, player);
  } else {
    scores[player] = Math.max(0, scores[player] - 1);
    playIncorrect();
    flashHalf(halfEl, false, player);
  }
}

function flashHalf(halfEl, correct, player) {
  const overlay = document.createElement('div');
  overlay.className = `addition-flash ${correct ? 'addition-flash-correct' : 'addition-flash-wrong'}`;

  const isTop = player === 0;
  if (isTop) overlay.style.transform = 'rotate(180deg)';

  overlay.innerHTML = correct
    ? `<div class="addition-flash-icon">✅</div><div class="addition-flash-text">ВЕРНО!</div>`
    : `<div class="addition-flash-icon">❌</div><div class="addition-flash-text">НЕ ТО!</div><div class="addition-flash-answer">Ответ: ${questions[player].answer}</div>`;

  halfEl.appendChild(overlay);

  const delay = correct ? 600 : 1200;
  setTimeout(() => {
    overlay.remove();
    questions[player] = makeQuestion();
    locked[player] = false;
    // rebuild this half
    halfEl.innerHTML = '';
    buildPlayerHalf(halfEl, player);
    // update score bars
    updateScoreBars();
  }, delay);
}

function updateScoreBars() {
  const bars = container.querySelectorAll('.addition-score-val');
  bars.forEach((bar, i) => { bar.textContent = String(scores[i]); });
}

/* ─── Result ─────────────────────────────────────────────── */
function showResult() {
  playCelebration();
  container.innerHTML = '';

  const backBtn = el('button', { className: 'back-btn', onClick: () => { playTap(); onBack(); } }, '←');

  const winner = scores[0] > scores[1] ? '🏆 ИГРОК 1 ПОБЕДИЛ!'
    : scores[1] > scores[0] ? '🏆 ИГРОК 2 ПОБЕДИЛ!'
    : '🤝 НИЧЬЯ!';

  const screen = el('div', {
    className: 'screen',
    style: { background: 'linear-gradient(135deg, #ff6b9d, #c44dff, #4d79ff)', gap: '18px' },
  },
    el('div', { style: { fontSize: '4em' } }, scores[0] > scores[1] ? '🎉' : scores[1] > scores[0] ? '🎉' : '🤝'),
    el('h1', { style: { fontSize: '1.9em', color: '#fff', textAlign: 'center', textShadow: '0 2px 12px rgba(0,0,0,.3)', textTransform: 'uppercase' } }, winner),
    el('div', { className: 'addition-result-scores' },
      el('div', { className: 'addition-result-player', style: { '--c': '#ff9ebf' } },
        el('div', { className: 'addition-result-label' }, '👤 ИГРОК 1'),
        el('div', { className: 'addition-result-num' }, String(scores[0])),
      ),
      el('div', { style: { color: '#fff', fontSize: '1.8em', alignSelf: 'center', opacity: 0.6 } }, '—'),
      el('div', { className: 'addition-result-player', style: { '--c': '#7fa0ff' } },
        el('div', { className: 'addition-result-label' }, '👤 ИГРОК 2'),
        el('div', { className: 'addition-result-num' }, String(scores[1])),
      ),
    ),
    el('button', {
      className: 'game-button',
      style: { background: '#fff', color: '#c44dff', fontSize: '1.2em', borderRadius: '50px', fontWeight: 900 },
      onClick: () => { playTap(); startRound(); },
    }, 'ЕЩЁ РАЗ'),
    el('button', {
      className: 'game-button',
      style: { background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '1em', borderRadius: '50px' },
      onClick: () => { playTap(); onBack(); },
    }, '← МЕНЮ'),
  );

  container.appendChild(screen);
  container.appendChild(backBtn);
}
