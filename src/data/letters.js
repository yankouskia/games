/**
 * Russian uppercase letter SVG path data for tracing game.
 * Each letter has: char, path (SVG path data scaled to 300x300 viewBox),
 * and sample words with emoji.
 */

import { getUniqueWords } from './words.js';

/**
 * SVG path data for each Russian uppercase letter.
 * Paths are designed for a 300x300 viewBox with thick strokes.
 */
export const LETTER_PATHS = {
  'А': 'M 50 280 L 150 40 L 250 280 M 90 180 L 210 180',
  'Б': 'M 60 40 L 240 40 M 60 40 L 60 280 L 220 280 Q 260 280 260 240 L 260 200 Q 260 160 220 160 L 60 160',
  'В': 'M 60 40 L 60 280 M 60 40 L 200 40 Q 240 40 240 80 L 240 120 Q 240 160 200 160 L 60 160 M 60 160 L 210 160 Q 250 160 250 200 L 250 240 Q 250 280 210 280 L 60 280',
  'Г': 'M 60 40 L 240 40 M 60 40 L 60 280',
  'Д': 'M 30 280 L 30 300 M 270 280 L 270 300 M 30 280 L 270 280 L 230 280 L 230 80 L 70 80 L 70 280 M 70 80 L 100 40 L 200 40 L 230 80',
  'Е': 'M 240 40 L 60 40 L 60 280 L 240 280 M 60 160 L 200 160',
  'Ё': 'M 240 40 L 60 40 L 60 280 L 240 280 M 60 160 L 200 160 M 120 15 A 8 8 0 1 1 120 16 M 180 15 A 8 8 0 1 1 180 16',
  'Ж': 'M 150 40 L 150 280 M 50 40 L 150 160 L 50 280 M 250 40 L 150 160 L 250 280',
  'З': 'M 60 60 Q 60 40 100 40 L 200 40 Q 250 40 250 90 L 250 120 Q 250 160 200 160 M 200 160 Q 250 160 250 200 L 250 240 Q 250 280 200 280 L 100 280 Q 60 280 60 260',
  'И': 'M 60 40 L 60 280 M 60 280 L 240 40 M 240 40 L 240 280',
  'Й': 'M 60 60 L 60 280 M 60 280 L 240 60 M 240 60 L 240 280 M 100 30 Q 150 0 200 30',
  'К': 'M 60 40 L 60 280 M 240 40 L 60 160 L 240 280',
  'Л': 'M 40 280 L 120 40 L 240 40 L 240 280',
  'М': 'M 50 280 L 50 40 L 150 180 L 250 40 L 250 280',
  'Н': 'M 60 40 L 60 280 M 240 40 L 240 280 M 60 160 L 240 160',
  'О': 'M 150 40 Q 250 40 250 160 Q 250 280 150 280 Q 50 280 50 160 Q 50 40 150 40',
  'П': 'M 60 40 L 240 40 M 60 40 L 60 280 M 240 40 L 240 280',
  'Р': 'M 60 40 L 60 280 M 60 40 L 200 40 Q 250 40 250 90 L 250 120 Q 250 160 200 160 L 60 160',
  'С': 'M 240 60 Q 240 40 200 40 L 100 40 Q 50 40 50 90 L 50 230 Q 50 280 100 280 L 200 280 Q 240 280 240 260',
  'Т': 'M 50 40 L 250 40 M 150 40 L 150 280',
  'У': 'M 50 40 L 150 180 M 250 40 L 100 280',
  'Ф': 'M 150 40 L 150 280 M 150 100 Q 50 100 50 160 Q 50 220 150 220 M 150 100 Q 250 100 250 160 Q 250 220 150 220',
  'Х': 'M 50 40 L 250 280 M 250 40 L 50 280',
  'Ц': 'M 60 40 L 60 280 L 260 280 M 220 40 L 220 280 M 260 280 L 260 310',
  'Ч': 'M 60 40 L 60 160 L 240 160 M 240 40 L 240 280',
  'Ш': 'M 40 40 L 40 280 L 260 280 M 150 40 L 150 280 M 260 40 L 260 280',
  'Щ': 'M 30 40 L 30 280 L 270 280 M 110 40 L 110 280 M 200 40 L 200 280 M 270 280 L 270 310',
  'Ъ': 'M 60 40 L 120 40 L 120 280 L 220 280 Q 260 280 260 240 L 260 200 Q 260 160 220 160 L 120 160',
  'Ы': 'M 50 40 L 50 280 L 160 280 Q 200 280 200 240 L 200 200 Q 200 160 160 160 L 50 160 M 250 40 L 250 280',
  'Ь': 'M 60 40 L 60 280 L 200 280 Q 250 280 250 240 L 250 200 Q 250 160 200 160 L 60 160',
  'Э': 'M 60 60 Q 60 40 100 40 L 200 40 Q 250 40 250 90 L 250 230 Q 250 280 200 280 L 100 280 Q 60 280 60 260 M 130 160 L 250 160',
  'Ю': 'M 50 40 L 50 280 M 50 160 L 120 160 M 200 40 Q 270 40 270 160 Q 270 280 200 280 Q 130 280 130 160 Q 130 40 200 40',
  'Я': 'M 240 40 L 240 280 M 240 40 L 100 40 Q 60 40 60 80 L 60 120 Q 60 160 100 160 L 240 160 M 60 280 L 240 160',
};

/**
 * Get words grouped by their first letter.
 * Returns Map<string, Array<{word, emoji}>>
 */
export function getWordsByLetter() {
  const words = getUniqueWords();
  const map = new Map();

  for (const entry of words) {
    const firstLetter = entry.word.charAt(0);
    if (!LETTER_PATHS[firstLetter]) continue;
    if (!map.has(firstLetter)) map.set(firstLetter, []);
    map.get(firstLetter).push(entry);
  }

  return map;
}

/**
 * Get all available letters (those that have both paths and words).
 */
export function getAvailableLetters() {
  const wordsByLetter = getWordsByLetter();
  return [...wordsByLetter.keys()].sort();
}
