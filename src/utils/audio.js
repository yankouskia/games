/**
 * Audio system — background music + sound effects using Web Audio API.
 * Music box / glockenspiel style — soft and pleasant for children.
 */

let audioCtx = null;
let musicGain = null;
let sfxGain = null;
let musicPlaying = false;
let muted = false;
let musicTimeout = null;

function ensureCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    musicGain = audioCtx.createGain();
    musicGain.gain.value = 0.12;
    musicGain.connect(audioCtx.destination);
    sfxGain = audioCtx.createGain();
    sfxGain.gain.value = 0.25;
    sfxGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

export function setMuted(m) {
  muted = m;
  if (musicGain) musicGain.gain.value = m ? 0 : 0.12;
  if (sfxGain) sfxGain.gain.value = m ? 0 : 0.25;
}
export function isMuted() { return muted; }
export function toggleMute() { setMuted(!muted); return muted; }

// ========================
// MUSIC BOX INSTRUMENT
// ========================

/**
 * Play a single "music box" note — sine + soft overtones with fast decay.
 * Sounds like a glockenspiel / celesta.
 */
function playMusicBoxNote(freq, time, duration, gain = 1.0) {
  const partials = [
    { ratio: 1, amp: 1.0 },      // fundamental
    { ratio: 2, amp: 0.4 },      // octave
    { ratio: 3, amp: 0.1 },      // 12th
    { ratio: 4.2, amp: 0.08 },   // inharmonic shimmer
  ];

  for (const p of partials) {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq * p.ratio;

    const env = audioCtx.createGain();
    const vol = gain * p.amp * 0.3;
    env.gain.setValueAtTime(vol, time);
    env.gain.exponentialRampToValueAtTime(vol * 0.6, time + 0.05);
    env.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.9);

    osc.connect(env);
    env.connect(musicGain);
    osc.start(time);
    osc.stop(time + duration);
  }
}

// ========================
// BACKGROUND MELODIES
// ========================

// Note frequencies (octave 4 and 5)
const N = {
  C4: 262, D4: 294, E4: 330, F4: 349, G4: 392, A4: 440, B4: 494,
  C5: 523, D5: 587, E5: 659, F5: 698, G5: 784, A5: 880, B5: 988,
  C6: 1047,
  R: 0, // rest
};

// Multiple melodies to rotate through
const MELODIES = [
  // Melody 1: Gentle lullaby-like (original, but music-box style)
  {
    tempo: 130, // ms per note
    notes: [
      // "Twinkle Twinkle" in music box
      [N.C5,2],[N.C5,2],[N.G5,2],[N.G5,2],[N.A5,2],[N.A5,2],[N.G5,4],
      [N.R,1],
      [N.F5,2],[N.F5,2],[N.E5,2],[N.E5,2],[N.D5,2],[N.D5,2],[N.C5,4],
      [N.R,2],
      [N.G5,2],[N.G5,2],[N.F5,2],[N.F5,2],[N.E5,2],[N.E5,2],[N.D5,4],
      [N.R,1],
      [N.G5,2],[N.G5,2],[N.F5,2],[N.F5,2],[N.E5,2],[N.E5,2],[N.D5,4],
      [N.R,2],
      [N.C5,2],[N.C5,2],[N.G5,2],[N.G5,2],[N.A5,2],[N.A5,2],[N.G5,4],
      [N.R,1],
      [N.F5,2],[N.F5,2],[N.E5,2],[N.E5,2],[N.D5,2],[N.D5,2],[N.C5,4],
      [N.R,4],
    ],
  },
  // Melody 2: "В лесу родилась ёлочка" (In the Forest a Christmas Tree was Born)
  {
    tempo: 160,
    notes: [
      [N.C5,2],[N.A4,2],[N.A4,3],[N.G4,1],[N.A4,2],[N.F4,2],[N.C5,2],[N.C5,2],
      [N.D5,2],[N.B4,2],[N.B4,4],[N.R,2],
      [N.B4,2],[N.G4,2],[N.G4,3],[N.F4,1],[N.G4,2],[N.E4,2],[N.B4,2],[N.B4,2],
      [N.C5,2],[N.A4,2],[N.A4,4],[N.R,4],
    ],
  },
  // Melody 3: Simple ascending/descending pentatonic pattern — dreamy
  {
    tempo: 180,
    notes: [
      [N.C5,2],[N.E5,2],[N.G5,2],[N.A5,2],[N.G5,3],[N.R,1],
      [N.E5,2],[N.G5,2],[N.C6,2],[N.A5,2],[N.G5,3],[N.R,1],
      [N.A5,2],[N.G5,2],[N.E5,2],[N.C5,2],[N.D5,3],[N.R,1],
      [N.E5,2],[N.D5,2],[N.C5,2],[N.E5,2],[N.C5,4],[N.R,3],
      // Repeat with variation
      [N.G5,2],[N.A5,2],[N.C6,2],[N.A5,2],[N.G5,3],[N.R,1],
      [N.E5,2],[N.C5,2],[N.D5,2],[N.E5,2],[N.C5,4],[N.R,4],
    ],
  },
  // Melody 4: "Жили у бабуси" (Baa Baa / folk tune)
  {
    tempo: 150,
    notes: [
      [N.E5,2],[N.E5,2],[N.D5,2],[N.D5,2],[N.C5,2],[N.D5,2],[N.E5,4],
      [N.R,1],
      [N.D5,2],[N.D5,2],[N.E5,2],[N.D5,2],[N.C5,4],[N.R,2],
      [N.E5,2],[N.E5,2],[N.D5,2],[N.D5,2],[N.C5,2],[N.D5,2],[N.E5,4],
      [N.R,1],
      [N.D5,2],[N.E5,2],[N.D5,2],[N.C5,4],[N.R,4],
    ],
  },
];

let currentMelody = 0;

export function startMusic() {
  ensureCtx();
  if (musicPlaying) return;
  musicPlaying = true;
  currentMelody = Math.floor(Math.random() * MELODIES.length);
  scheduleMelody();
}

export function stopMusic() {
  musicPlaying = false;
  if (musicTimeout) { clearTimeout(musicTimeout); musicTimeout = null; }
}

function scheduleMelody() {
  if (!musicPlaying) return;

  const melody = MELODIES[currentMelody];
  let time = audioCtx.currentTime + 0.1;

  for (const [freq, beats] of melody.notes) {
    const dur = (melody.tempo / 1000) * beats;
    if (freq > 0) {
      playMusicBoxNote(freq, time, dur * 1.5); // notes ring longer than gap
    }
    time += dur;
  }

  const totalDuration = melody.notes.reduce((s, [, b]) => s + (melody.tempo / 1000) * b, 0);

  // Pause between melodies, then play next
  musicTimeout = setTimeout(() => {
    currentMelody = (currentMelody + 1) % MELODIES.length;
    scheduleMelody();
  }, (totalDuration + 2) * 1000); // 2s gap between melodies
}

// ========================
// SOUND EFFECTS
// ========================

/** Soft tap — music box single note. */
export function playTap() {
  ensureCtx();
  playNote(880, 0.08, 'sine', 0.2);
}

/** Correct answer — rising major arpeggio, music-box style. */
export function playCorrect() {
  ensureCtx();
  const t = audioCtx.currentTime;
  const chord = [523, 659, 784, 1047]; // C E G C
  chord.forEach((f, i) => {
    playMusicBoxSfx(f, t + i * 0.08, 0.5, 0.4);
  });
}

/** Incorrect — two soft low notes. */
export function playIncorrect() {
  ensureCtx();
  const t = audioCtx.currentTime;
  playNote(300, 0.2, 'triangle', 0.2, t);
  playNote(250, 0.3, 'triangle', 0.15, t + 0.15);
}

/** Celebration — big ascending sparkle. */
export function playCelebration() {
  ensureCtx();
  const t = audioCtx.currentTime;
  const notes = [523, 587, 659, 784, 880, 988, 1047, 1175, 1319];
  notes.forEach((f, i) => {
    playMusicBoxSfx(f, t + i * 0.06, 0.8, 0.3);
  });
  // Final chord
  [1047, 1319, 1568].forEach(f => {
    playMusicBoxSfx(f, t + 0.6, 1.2, 0.25);
  });
}

/** Swoosh — gentle whoosh. */
export function playSwoosh() {
  ensureCtx();
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(700, t + 0.08);
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.15);
  const env = audioCtx.createGain();
  env.gain.setValueAtTime(0.1, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc.connect(env);
  env.connect(sfxGain);
  osc.start(t);
  osc.stop(t + 0.2);
}

/** Pop — bubbly. */
export function playPop() {
  ensureCtx();
  const t = audioCtx.currentTime;
  playNote(800, 0.06, 'sine', 0.3, t);
  playNote(1200, 0.1, 'sine', 0.15, t + 0.03);
}

// ========================
// HELPERS
// ========================

/** Simple single-note helper. */
function playNote(freq, duration, type = 'sine', volume = 0.2, startTime = null) {
  const t = startTime ?? audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const env = audioCtx.createGain();
  env.gain.setValueAtTime(volume, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(env);
  env.connect(sfxGain);
  osc.start(t);
  osc.stop(t + duration + 0.01);
}

/** Music-box style note for SFX — brighter with shimmer. */
function playMusicBoxSfx(freq, time, duration, gain) {
  const partials = [
    { ratio: 1, amp: 1.0 },
    { ratio: 2, amp: 0.35 },
    { ratio: 4.1, amp: 0.06 }, // shimmer
  ];
  for (const p of partials) {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq * p.ratio;
    const env = audioCtx.createGain();
    const vol = gain * p.amp;
    env.gain.setValueAtTime(vol, time);
    env.gain.exponentialRampToValueAtTime(vol * 0.5, time + 0.03);
    env.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(env);
    env.connect(sfxGain);
    osc.start(time);
    osc.stop(time + duration + 0.01);
  }
}
