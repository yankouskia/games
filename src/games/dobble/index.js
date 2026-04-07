/**
 * Game 3: «Доббль — Флаги»
 * Ported from yankouskia/dobble — 2-player split-screen flag matching game.
 */

import { el } from '../../utils/helpers.js';
import { playTap, playCorrect, playIncorrect, playCelebration } from '../../utils/audio.js';

const FLAGS = [
  '🇫🇷','🇩🇪','🇬🇧','🇮🇹','🇪🇸','🇵🇹','🇧🇪','🇦🇹','🇨🇭','🇸🇪',
  '🇳🇴','🇩🇰','🇫🇮','🇵🇱','🇨🇿','🇭🇺','🇷🇴','🇬🇷','🇺🇦','🇷🇺',
  '🇹🇷','🇺🇸','🇨🇦','🇲🇽','🇧🇷','🇦🇷','🇯🇵','🇰🇷','🇨🇳','🇮🇳',
  '🇦🇺','🇳🇿','🇸🇬','🇹🇭','🇮🇱','🇸🇦','🇦🇪','🇿🇦','🇪🇬','🇮🇸',
  '🇮🇪','🇧🇬','🇭🇷','🇷🇸','🇬🇪','🇦🇲','🇲🇳','🇳🇵','🇵🇭','🇻🇳',
  '🇮🇩','🇲🇾','🇵🇰','🇧🇩','🇦🇫','🇮🇶','🇸🇾','🇾🇪'
];

const FLAG_INFO = [
  ['ФРАНЦИЯ','ПАРИЖ'],['ГЕРМАНИЯ','БЕРЛИН'],['ВЕЛИКОБРИТАНИЯ','ЛОНДОН'],['ИТАЛИЯ','РИМ'],
  ['ИСПАНИЯ','МАДРИД'],['ПОРТУГАЛИЯ','ЛИССАБОН'],['БЕЛЬГИЯ','БРЮССЕЛЬ'],['АВСТРИЯ','ВЕНА'],
  ['ШВЕЙЦАРИЯ','БЕРН'],['ШВЕЦИЯ','СТОКГОЛЬМ'],
  ['НОРВЕГИЯ','ОСЛО'],['ДАНИЯ','КОПЕНГАГЕН'],['ФИНЛЯНДИЯ','ХЕЛЬСИНКИ'],['ПОЛЬША','ВАРШАВА'],
  ['ЧЕХИЯ','ПРАГА'],['ВЕНГРИЯ','БУДАПЕШТ'],['РУМЫНИЯ','БУХАРЕСТ'],['ГРЕЦИЯ','АФИНЫ'],
  ['УКРАИНА','КИЕВ'],['РОССИЯ','МОСКВА'],
  ['ТУРЦИЯ','АНКАРА'],['США','ВАШИНГТОН'],['КАНАДА','ОТТАВА'],['МЕКСИКА','МЕХИКО'],
  ['БРАЗИЛИЯ','БРАЗИЛИА'],['АРГЕНТИНА','БУЭНОС-АЙРЕС'],['ЯПОНИЯ','ТОКИО'],['ЮЖНАЯ КОРЕЯ','СЕУЛ'],
  ['КИТАЙ','ПЕКИН'],['ИНДИЯ','НЬЮ-ДЕЛИ'],
  ['АВСТРАЛИЯ','КАНБЕРРА'],['НОВАЯ ЗЕЛАНДИЯ','ВЕЛЛИНГТОН'],['СИНГАПУР','СИНГАПУР'],
  ['ТАИЛАНД','БАНГКОК'],['ИЗРАИЛЬ','ИЕРУСАЛИМ'],['САУДОВСКАЯ АРАВИЯ','ЭР-РИЯД'],
  ['ОАЭ','АБУ-ДАБИ'],['ЮАР','ПРЕТОРИЯ'],['ЕГИПЕТ','КАИР'],['ИСЛАНДИЯ','РЕЙКЬЯВИК'],
  ['ИРЛАНДИЯ','ДУБЛИН'],['БОЛГАРИЯ','СОФИЯ'],['ХОРВАТИЯ','ЗАГРЕБ'],['СЕРБИЯ','БЕЛГРАД'],
  ['ГРУЗИЯ','ТБИЛИСИ'],['АРМЕНИЯ','ЕРЕВАН'],['МОНГОЛИЯ','УЛАН-БАТОР'],['НЕПАЛ','КАТМАНДУ'],
  ['ФИЛИППИНЫ','МАНИЛА'],['ВЬЕТНАМ','ХАНОЙ'],
  ['ИНДОНЕЗИЯ','ДЖАКАРТА'],['МАЛАЙЗИЯ','КУАЛА-ЛУМПУР'],['ПАКИСТАН','ИСЛАМАБАД'],
  ['БАНГЛАДЕШ','ДАККА'],['АФГАНИСТАН','КАБУЛ'],['ИРАК','БАГДАД'],['СИРИЯ','ДАМАСК'],
  ['ЙЕМЕН','САНА']
];

function generateDeck(n) {
  const cards = [];
  cards.push(Array.from({ length: n + 1 }, (_, i) => i));
  for (let i = 0; i < n; i++) {
    const card = [0];
    for (let j = 0; j < n; j++) card.push(n + 1 + i * n + j);
    cards.push(card);
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const card = [i + 1];
      for (let k = 0; k < n; k++) card.push(n + 1 + k * n + ((i * k + j) % n));
      cards.push(card);
    }
  }
  return cards;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.random() * i + 1 | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DECK = generateDeck(7);
let scores, currentPair, pairs, locked;
let container = null;
let onBack = null;

export function startDobble(appContainer, backCallback) {
  container = appContainer;
  onBack = backCallback;
  showDobbleStart();
}

function showDobbleStart() {
  container.innerHTML = '';

  const backBtn = el('button', { className: 'back-btn', onClick: () => onBack() }, '←');

  const screen = el('div', {
    className: 'screen',
    style: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      gap: '20px',
    },
  },
    el('h1', { style: { fontSize: '2.5em', textShadow: '3px 3px 6px rgba(0,0,0,.3)', color: '#fff' } }, '🃏 ДОББЛЬ'),
    el('p', { style: { fontSize: '1.1em', color: '#fff', opacity: '0.9', textAlign: 'center', padding: '0 20px', textTransform: 'uppercase' } },
      'НАЙДИ ОДИНАКОВЫЙ ФЛАГ НА ДВУХ КАРТАХ БЫСТРЕЕ СОПЕРНИКА!'
    ),
    el('div', { style: { fontSize: '2.5em' } }, '🇫🇷 🇯🇵 🇧🇷 🇦🇺'),
    el('button', {
      className: 'game-button',
      style: { background: '#ff6b6b', color: '#fff', padding: '18px 50px', fontSize: '1.3em', borderRadius: '50px' },
      onClick: () => { playTap(); startDobbleGame(); },
    }, 'НАЧАТЬ ИГРУ'),
    el('p', { style: { fontSize: '0.85em', color: '#fff', opacity: '0.6', maxWidth: '320px', textAlign: 'center', textTransform: 'uppercase' } },
      'ПОЛОЖИТЕ ТЕЛЕФОН НА СТОЛ МЕЖДУ ДВУМЯ ИГРОКАМИ'
    ),
  );

  container.appendChild(screen);
  container.appendChild(backBtn);
}

function startDobbleGame() {
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

  const gameScreen = el('div', {
    style: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', position: 'absolute', inset: '0' },
  });

  const [i1, i2] = pairs[currentPair];

  // Top player (rotated 180°)
  const topHalf = el('div', { className: 'dobble-player-half dobble-top' });
  const topScore = el('div', { className: 'dobble-score-bar' },
    el('span', { className: 'dobble-score-name' }, `ИГРОК 1: ${scores[0]}`),
    el('span', { className: 'dobble-score-name' }, `${currentPair + 1}/${pairs.length}`),
  );
  const topCard = el('div', { className: 'dobble-card-area' });
  topHalf.appendChild(topScore);
  topHalf.appendChild(topCard);

  // Divider
  const divider = el('div', { className: 'dobble-divider' });

  // Bottom player
  const botHalf = el('div', { className: 'dobble-player-half dobble-bottom' });
  const botScore = el('div', { className: 'dobble-score-bar' },
    el('span', { className: 'dobble-score-name' }, `ИГРОК 2: ${scores[1]}`),
    el('span', { className: 'dobble-score-name' }, `${currentPair + 1}/${pairs.length}`),
  );
  const botCard = el('div', { className: 'dobble-card-area' });
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

function renderCard(cardEl, cardSymbols, player) {
  const rect = cardEl.getBoundingClientRect();
  const W = rect.width || 300, H = rect.height || 300;
  const centerX = W / 2, centerY = H / 2, cardR = Math.min(W, H) / 2;
  const shuffledSyms = shuffle([...cardSymbols]);
  const sizeOptions = [82, 72, 86, 68, 80, 74, 84, 70];
  const placed = [];

  shuffledSyms.forEach((sym, i) => {
    const fontSize = sizeOptions[i % sizeOptions.length];
    const hitR = fontSize * 0.55;
    let px, py, ok, attempts = 0;
    do {
      const angle = Math.random() * Math.PI * 2;
      const maxDist = cardR - hitR - 6;
      const dist = Math.sqrt(Math.random()) * maxDist;
      px = centerX + dist * Math.cos(angle);
      py = centerY + dist * Math.sin(angle);
      ok = !placed.some(p => Math.hypot(p.x - px, p.y - py) < (p.r + hitR + 4));
      attempts++;
    } while (!ok && attempts < 200);
    placed.push({ x: px, y: py, r: hitR });

    const rot = (Math.random() * 50 - 25) | 0;
    const btn = document.createElement('button');
    btn.className = 'dobble-flag-btn';
    btn.textContent = FLAGS[sym];
    btn.style.fontSize = fontSize + 'px';
    btn.style.width = (hitR * 2) + 'px';
    btn.style.height = (hitR * 2) + 'px';
    btn.style.left = (px - hitR) + 'px';
    btn.style.top = (py - hitR) + 'px';
    btn.style.transform = `rotate(${rot}deg)`;
    btn.style.setProperty('--rot', rot + 'deg');
    btn.addEventListener('click', () => handleTap(player, sym, btn));
    cardEl.appendChild(btn);
  });
}

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
    btn.classList.add('dobble-correct');

    // Show green overlay with country info
    const info = FLAG_INFO[sym];
    const overlay = el('div', { className: 'dobble-green-overlay' },
      el('div', { className: 'dobble-overlay-top' }, `${info[0]} — ${info[1]}`),
      el('div', { className: 'dobble-overlay-flag' }, FLAGS[sym]),
      el('div', { className: 'dobble-overlay-bottom' }, `${info[0]} — ${info[1]}`),
    );
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
      currentPair++;
      showRound();
    }, 2000);
  } else {
    playIncorrect();
    btn.classList.add('dobble-wrong');
    setTimeout(() => btn.classList.remove('dobble-wrong'), 400);
  }
}

function endGame() {
  playCelebration();
  container.innerHTML = '';

  const backBtn = el('button', { className: 'back-btn', onClick: () => onBack() }, '←');

  const w = scores[0] > scores[1] ? '🏆 ИГРОК 1 ПОБЕДИЛ!'
    : scores[1] > scores[0] ? '🏆 ИГРОК 2 ПОБЕДИЛ!'
    : '🤝 НИЧЬЯ!';

  // High scores
  const hs = JSON.parse(localStorage.getItem('dobble-hs') || '[]');
  const best = Math.max(scores[0], scores[1]);
  hs.push({ s: best, d: new Date().toLocaleDateString('ru') });
  hs.sort((a, b) => b.s - a.s);
  if (hs.length > 5) hs.length = 5;
  localStorage.setItem('dobble-hs', JSON.stringify(hs));

  const screen = el('div', {
    className: 'screen',
    style: { background: 'linear-gradient(135deg, #667eea, #764ba2)', gap: '16px' },
  },
    el('h1', { style: { fontSize: '2.2em', color: '#fff', textTransform: 'uppercase', textAlign: 'center' } }, w),
    el('div', { style: { fontSize: '1.5em', color: '#fff', textTransform: 'uppercase' } },
      `ИГРОК 1: ${scores[0]} — ИГРОК 2: ${scores[1]}`
    ),
    el('div', { style: { fontSize: '1em', color: '#fff', opacity: '0.7', textTransform: 'uppercase' } },
      `РЕКОРД: ${hs[0].s} ОЧКОВ (${hs[0].d})`
    ),
    el('button', {
      className: 'game-button',
      style: { background: '#ff6b6b', color: '#fff', fontSize: '1.2em', borderRadius: '50px' },
      onClick: () => { playTap(); startDobbleGame(); },
    }, 'ИГРАТЬ СНОВА'),
    el('button', {
      className: 'game-button',
      style: { background: '#4d96ff', color: '#fff', fontSize: '1em', borderRadius: '50px' },
      onClick: () => onBack(),
    }, 'МЕНЮ'),
  );

  container.appendChild(screen);
  container.appendChild(backBtn);
}
