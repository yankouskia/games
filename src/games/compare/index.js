/**
 * Game: «Сравнение для ребёнка» — Which number is bigger?
 */

import { el, delay } from '../../utils/helpers.js';
import { playCorrect, playIncorrect, playTap } from '../../utils/audio.js';

let container = null;
let onBack = null;
let busy = false;
let leftNum = 0;
let rightNum = 0;

export function startCompare(appContainer, backCallback) {
  container = appContainer;
  onBack = backCallback;
  busy = false;
  loadRound();
}

function randomNum() {
  return Math.floor(Math.random() * 199) - 99; // -99 to 99
}

function loadRound() {
  busy = false;
  leftNum = randomNum();
  do {
    rightNum = randomNum();
  } while (rightNum === leftNum);
  render();
}

async function handlePick(picked) {
  if (busy) return;
  busy = true;
  playTap();

  const leftCircle = container.querySelector('.compare-circle.left');
  const rightCircle = container.querySelector('.compare-circle.right');

  const pickedIsLeft = picked === 'left';
  const correct = pickedIsLeft ? leftNum > rightNum : rightNum > leftNum;

  if (correct) {
    playCorrect();
    leftCircle.classList.add(pickedIsLeft ? 'correct' : 'dim');
    rightCircle.classList.add(pickedIsLeft ? 'dim' : 'correct');
  } else {
    playIncorrect();
    leftCircle.classList.add(pickedIsLeft ? 'incorrect' : 'correct-other');
    rightCircle.classList.add(pickedIsLeft ? 'correct-other' : 'incorrect');
  }

  await delay(1200);
  loadRound();
}

function render() {
  container.innerHTML = '';

  const backBtn = el('button', {
    className: 'back-btn',
    onClick: () => { playTap(); onBack(); },
  }, '←');

  const screen = el('div', { className: 'screen compare-screen' });

  const title = el('div', { className: 'compare-title' }, 'НАЖМИ НА БОЛЬШЕЕ ЧИСЛО');

  const arena = el('div', { className: 'compare-arena' });

  const leftCircle = el('div', {
    className: 'compare-circle left',
    onClick: () => handlePick('left'),
  }, String(leftNum));

  const vsLabel = el('div', { className: 'compare-vs' }, 'VS');

  const rightCircle = el('div', {
    className: 'compare-circle right',
    onClick: () => handlePick('right'),
  }, String(rightNum));

  arena.appendChild(leftCircle);
  arena.appendChild(vsLabel);
  arena.appendChild(rightCircle);

  screen.appendChild(title);
  screen.appendChild(arena);

  container.appendChild(screen);
  container.appendChild(backBtn);
}
