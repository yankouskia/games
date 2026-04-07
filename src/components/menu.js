/**
 * Game Selection Menu Screen.
 */

import { el } from '../utils/helpers.js';
import { playTap } from '../utils/audio.js';

export function renderMenu(container, callbacks) {
  container.innerHTML = '';

  const games = [
    {
      id: 'connect',
      icon: '🔗',
      title: 'СОЕДИНИ',
      description: 'СОЕДИНИ СЛОВО С КАРТИНКОЙ',
    },
    {
      id: 'trace',
      icon: '✏️',
      title: 'НАПИШИ БУКВУ',
      description: 'ОБВЕДИ БУКВУ ПО ТОЧКАМ',
    },
    {
      id: 'dobble',
      icon: '🃏',
      title: 'ДОББЛЬ ФЛАГИ',
      description: 'НАЙДИ ОДИНАКОВЫЙ ФЛАГ!',
    },
    {
      id: 'compare',
      icon: '🔢',
      title: 'СРАВНЕНИЕ',
      description: 'НАЖМИ НА БОЛЬШЕЕ ЧИСЛО!',
    },
    {
      id: 'addition',
      icon: '➕',
      title: 'СЛОЖЕНИЕ',
      description: 'КТО БЫСТРЕЕ ПОСЧИТАЕТ?',
    },
    {
      id: 'dobble-cars',
      icon: '🚗',
      title: 'ДОББЛЬ МАШИНЫ',
      description: 'НАЙДИ ОДИНАКОВЫЙ ЗНАЧОК!',
    },
  ];

  const title = el('h1', { className: 'menu-title' }, '🎮 ИГРЫ ДЛЯ ДЕТЕЙ 🎮');

  const cards = el('div', { className: 'menu-cards' },
    ...games.map(game =>
      el('div', {
        className: 'game-card',
        onClick: () => { playTap(); callbacks.onSelectGame(game.id); },
      },
        el('div', { className: 'card-icon' }, game.icon),
        el('div', { className: 'card-title' }, game.title),
        el('div', { className: 'card-description' }, game.description),
      )
    )
  );

  const screen = el('div', { className: 'screen menu-screen' }, title, cards);
  container.appendChild(screen);
}
