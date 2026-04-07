/**
 * Game: «Доббль — Машины» — 2-player split-screen car logo matching
 */

import { el } from '../../utils/helpers.js';
import { playTap, playCorrect, playIncorrect, playCelebration } from '../../utils/audio.js';
import { CAR_BRANDS, generateDobbleDeck } from '../../data/car-logos.js';

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DECK = generateDobbleDeck();

let scores, currentPair, pairs, locked;
let container = null;
let onBack = null;

export function startDobbleCars(appContainer, backCallback) {
  container = appContainer;
  onBack = backCallback;
  showStart();
}

/* ─── Start screen ────────────────────────────────── */
function showStart() {
  container.innerHTML = '';
  const backBtn = el('button', { className: 'back-btn', onClick: () => onBack() }, '←');

  const screen = el('div', {
    className: 'screen',
    style: { background: 'linear-gradient(135deg, #0f0f1a, #1a1a3a)', gap: '20px' },
  },
    el('div', { style: { fontSize: '3em' } }, '🚗'),
    el('h1', { style: { fontSize: '2.2em', color: '#fff', textAlign: 'center', textShadow: '0 0 30px rgba(255,200,0,0.5)', letterSpacing: '2px' } }, 'ДОББЛЬ\nМАШИНЫ'),
    el('p', { style: { fontSize: '1em', color: 'rgba(255,255,255,0.75)', textAlign: 'center', padding: '0 20px', textTransform: 'uppercase', lineHeight: 1.6 } },
      'НАЙДИ ОДИНАКОВЫЙ ЗНАЧОК МАРКИ НА ДВУХ КАРТАХ БЫСТРЕЕ СОПЕРНИКА!'
    ),
    el('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '320px' } },
      ...shuffle([...CAR_BRANDS]).slice(0, 8).map(b =>
        el('div', { style: { width: '48px', height: '48px', borderRadius: '12px', background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' } },
          Object.assign(document.createElement('div'), { innerHTML: b.svg, style: 'width:36px;height:36px;display:flex;align-items:center;justify-content:center;' })
        )
      )
    ),
    el('button', {
      className: 'game-button',
      style: { background: '#FFD700', color: '#111', padding: '18px 50px', fontSize: '1.3em', borderRadius: '50px', fontWeight: 900, boxShadow: '0 4px 20px rgba(255,215,0,0.4)' },
      onClick: () => { playTap(); startGame(); },
    }, '🏁 НАЧАТЬ'),
    el('p', { style: { fontSize: '0.8em', color: 'rgba(255,255,255,0.4)', textAlign: 'center', textTransform: 'uppercase' } },
      'ПОЛОЖИТЕ ТЕЛЕФОН НА СТОЛ МЕЖДУ ИГРОКАМИ'
    ),
  );

  container.appendChild(screen);
  container.appendChild(backBtn);
}

/* ─── Game ─────────────────────────────────────────── */
function startGame() {
  scores = [0, 0];
  currentPair = 0;
  const deck = shuffle([...Array(57).keys()]);
  pairs = [];
  for (let i = 0; i + 1 < deck.length; i += 2) pairs.push([deck[i], deck[i + 1]]);
  showRound();
}

function showRound() {
  if (currentPair >= pairs.length) { endGame(); return; }
  locked = false;
  container.innerHTML = '';

  const backBtn = el('button', { className: 'back-btn', onClick: () => onBack() }, '←');
  const gameScreen = el('div', { style: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', position: 'absolute', inset: '0' } });

  const [i1, i2] = pairs[currentPair];

  // Top (player 1, rotated)
  const topHalf = el('div', { className: 'dcars-half dcars-top' });
  const topScore = el('div', { className: 'dcars-score-bar' },
    el('span', { className: 'dcars-score-name' }, `🏆 ИГРОК 1: ${scores[0]}`),
    el('span', { className: 'dcars-round' }, `${currentPair + 1}/${pairs.length}`),
  );
  const topCard = el('div', { className: 'dcars-card' });
  topHalf.appendChild(topScore);
  topHalf.appendChild(topCard);

  // Divider
  const divider = el('div', { className: 'dcars-divider' },
    el('div', { className: 'dcars-divider-icon' }, '🚗'),
  );

  // Bottom (player 2)
  const botHalf = el('div', { className: 'dcars-half dcars-bottom' });
  const botScore = el('div', { className: 'dcars-score-bar' },
    el('span', { className: 'dcars-score-name' }, `🏆 ИГРОК 2: ${scores[1]}`),
    el('span', { className: 'dcars-round' }, `${currentPair + 1}/${pairs.length}`),
  );
  const botCard = el('div', { className: 'dcars-card' });
  botHalf.appendChild(botScore);
  botHalf.appendChild(botCard);

  gameScreen.appendChild(topHalf);
  gameScreen.appendChild(divider);
  gameScreen.appendChild(botHalf);
  container.appendChild(gameScreen);
  container.appendChild(backBtn);

  renderCard(topCard, DECK[i1], 0);
  renderCard(botCard, DECK[i2], 1);
}

/* ─── Card rendering (scattered logos) ────────────── */
function renderCard(cardEl, symbols, player) {
  const rect = cardEl.getBoundingClientRect();
  const W = rect.width || 320;
  const H = rect.height || 320;
  const cx = W / 2, cy = H / 2;
  const cardR = Math.min(W, H) / 2 - 4;
  const shuffled = shuffle([...symbols]);
  const sizes = [46, 38, 50, 34, 44, 40, 48, 36];
  const placed = [];

  shuffled.forEach((sym, i) => {
    const brand = CAR_BRANDS[sym];
    if (!brand) return;
    const size = sizes[i % sizes.length];
    const hitR = size * 0.62;
    let px, py, ok, attempts = 0;
    do {
      const angle = Math.random() * Math.PI * 2;
      const maxDist = cardR - hitR - 4;
      const dist = Math.sqrt(Math.random()) * maxDist;
      px = cx + dist * Math.cos(angle);
      py = cy + dist * Math.sin(angle);
      ok = !placed.some(p => Math.hypot(p.x - px, p.y - py) < p.r + hitR + 6);
      attempts++;
    } while (!ok && attempts < 300);
    placed.push({ x: px, y: py, r: hitR });

    const rot = ((Math.random() * 40) - 20) | 0;
    const btn = document.createElement('button');
    btn.className = 'dcars-logo-btn';
    btn.style.cssText = `
      left:${px - hitR}px; top:${py - hitR}px;
      width:${hitR * 2}px; height:${hitR * 2}px;
      background:${brand.color};
      transform:rotate(${rot}deg);
      --rot:${rot}deg;
    `;
    btn.innerHTML = brand.svg;
    btn.title = brand.name;
    btn.addEventListener('click', () => handleTap(player, sym, btn));
    cardEl.appendChild(btn);
  });
}

/* ─── Match logic ──────────────────────────────────── */
function findMatch(c1, c2) {
  const s = new Set(c1);
  return c2.find(x => s.has(x));
}

function handleTap(player, sym, btn) {
  if (locked) return;
  const [i1, i2] = pairs[currentPair];
  const match = findMatch(DECK[i1], DECK[i2]);

  if (sym === match) {
    locked = true;
    scores[player]++;
    playCorrect();
    btn.classList.add('dcars-correct');

    const brand = CAR_BRANDS[sym];
    const overlay = el('div', { className: 'dcars-green-overlay' },
      el('div', { className: `dcars-overlay-inner ${player === 0 ? 'dcars-overlay-top' : 'dcars-overlay-bottom'}` },
        el('div', { style: { width: '80px', height: '80px', borderRadius: '20px', background: brand.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' } },
          Object.assign(document.createElement('div'), { innerHTML: brand.svg, style: 'width:64px;height:64px;' })
        ),
        el('div', { className: 'dcars-overlay-name' }, brand.name),
        el('div', { className: 'dcars-overlay-player' }, `ИГРОК ${player + 1} +1 🏆`),
      ),
    );
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
      currentPair++;
      showRound();
    }, 2200);
  } else {
    playIncorrect();
    btn.classList.add('dcars-wrong');
    setTimeout(() => btn.classList.remove('dcars-wrong'), 500);

    // Wrong brand tooltip
    const brand = CAR_BRANDS[sym];
    const halves = container.querySelectorAll('.dcars-half');
    const half = halves[player];
    if (half) {
      const isTop = player === 0;
      const tip = el('div', { className: `dcars-wrong-tip ${isTop ? 'dcars-tip-top' : ''}` },
        el('div', { style: { width: '56px', height: '56px', borderRadius: '14px', background: brand.color, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
          Object.assign(document.createElement('div'), { innerHTML: brand.svg, style: 'width:44px;height:44px;' })
        ),
        el('div', { className: 'dcars-tip-name' }, brand.name),
        el('div', { className: 'dcars-tip-hint' }, '❌ НЕ ТА!'),
      );
      half.appendChild(tip);
      setTimeout(() => tip.remove(), 1800);
    }
  }
}

/* ─── End ──────────────────────────────────────────── */
function endGame() {
  playCelebration();
  container.innerHTML = '';

  const backBtn = el('button', { className: 'back-btn', onClick: () => onBack() }, '←');

  const w = scores[0] > scores[1] ? '🏆 ИГРОК 1 ПОБЕДИЛ!'
    : scores[1] > scores[0] ? '🏆 ИГРОК 2 ПОБЕДИЛ!'
    : '🤝 НИЧЬЯ!';

  const hs = JSON.parse(localStorage.getItem('dcars-hs') || '[]');
  const best = Math.max(scores[0], scores[1]);
  hs.push({ s: best, d: new Date().toLocaleDateString('ru') });
  hs.sort((a, b) => b.s - a.s);
  if (hs.length > 5) hs.length = 5;
  localStorage.setItem('dcars-hs', JSON.stringify(hs));

  const screen = el('div', {
    className: 'screen',
    style: { background: 'linear-gradient(135deg, #0f0f1a, #1a1a3a)', gap: '16px' },
  },
    el('div', { style: { fontSize: '3em' } }, '🏁'),
    el('h1', { style: { fontSize: '2em', color: '#FFD700', textAlign: 'center', textShadow: '0 0 30px rgba(255,215,0,0.5)', textTransform: 'uppercase' } }, w),
    el('div', { style: { display: 'flex', gap: '24px', fontSize: '1.2em', color: '#fff', fontWeight: 900 } },
      el('span', {}, `ИГРОК 1: ${scores[0]}`),
      el('span', { style: { color: '#FFD700' } }, '—'),
      el('span', {}, `ИГРОК 2: ${scores[1]}`),
    ),
    el('div', { style: { fontSize: '0.85em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' } },
      `РЕКОРД: ${hs[0].s} ОЧКОВ`
    ),
    el('button', {
      className: 'game-button',
      style: { background: '#FFD700', color: '#111', fontSize: '1.2em', borderRadius: '50px', fontWeight: 900 },
      onClick: () => { playTap(); startGame(); },
    }, '🔁 ИГРАТЬ СНОВА'),
    el('button', {
      className: 'game-button',
      style: { background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '1em', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)' },
      onClick: () => { playTap(); onBack(); },
    }, '← МЕНЮ'),
  );

  container.appendChild(screen);
  container.appendChild(backBtn);
}
