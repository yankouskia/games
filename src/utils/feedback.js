/**
 * Feedback overlays and celebration animations.
 */

import { el, delay } from './helpers.js';
import { playCorrect, playIncorrect, playCelebration } from './audio.js';

const PARTICLE_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d', '#c084fc', '#fb923c'];
const STAR_EMOJIS = ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '🥳'];

/**
 * Show a correct feedback overlay (green + checkmark).
 */
export async function showCorrect(durationMs = 3000) {
  playCorrect();
  const overlay = el('div', { className: 'feedback-overlay correct' },
    el('div', { className: 'feedback-icon' }, '✅')
  );
  document.body.appendChild(overlay);
  spawnParticles(overlay, 20);
  await delay(durationMs);
  overlay.remove();
}

/**
 * Show an incorrect feedback overlay (red + X).
 */
export async function showIncorrect(durationMs = 2500) {
  playIncorrect();
  const overlay = el('div', { className: 'feedback-overlay incorrect' },
    el('div', { className: 'feedback-icon' }, '❌')
  );
  document.body.appendChild(overlay);
  await delay(durationMs);
  overlay.remove();
}

/**
 * Show a level-complete celebration (fireworks/confetti).
 */
export async function showCelebration(durationMs = 4000) {
  playCelebration();
  const overlay = el('div', { className: 'feedback-overlay celebration' });
  document.body.appendChild(overlay);

  for (let wave = 0; wave < 3; wave++) {
    spawnStars(15);
    spawnParticles(overlay, 30);
    await delay(800);
  }

  await delay(durationMs - 2400);
  overlay.remove();
}

function spawnParticles(container, count) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const distance = 100 + Math.random() * 300;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 100;
    const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    const size = 8 + Math.random() * 16;

    const particle = el('div', {
      className: 'particle',
      style: {
        left: cx + 'px',
        top: cy + 'px',
        width: size + 'px',
        height: size + 'px',
        background: color,
        '--dx': dx + 'px',
        '--dy': dy + 'px',
        borderRadius: Math.random() > 0.5 ? '50%' : '4px',
      },
    });
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1600);
  }
}

function spawnStars(count) {
  for (let i = 0; i < count; i++) {
    const emoji = STAR_EMOJIS[Math.floor(Math.random() * STAR_EMOJIS.length)];
    const star = el('div', {
      className: 'star',
      style: {
        left: Math.random() * 100 + 'vw',
        top: '-60px',
        fontSize: (30 + Math.random() * 30) + 'px',
        animationDelay: (Math.random() * 1.5) + 's',
        animationDuration: (1.5 + Math.random() * 1.5) + 's',
      },
    }, emoji);
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 4000);
  }
}
