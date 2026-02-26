/**
 * Audio system — background music + sound effects using Web Audio API.
 * No external files needed — all generated programmatically.
 */

let audioCtx = null;
let musicGain = null;
let sfxGain = null;
let musicPlaying = false;
let muted = false;
let musicNodes = [];

/** Ensure AudioContext is created (must be after user gesture). */
function ensureCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    musicGain = audioCtx.createGain();
    musicGain.gain.value = 0.15;
    musicGain.connect(audioCtx.destination);
    sfxGain = audioCtx.createGain();
    sfxGain.gain.value = 0.3;
    sfxGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/** Set mute state. */
export function setMuted(m) {
  muted = m;
  if (musicGain) musicGain.gain.value = m ? 0 : 0.15;
  if (sfxGain) sfxGain.gain.value = m ? 0 : 0.3;
}

export function isMuted() { return muted; }

/** Toggle mute and return new state. */
export function toggleMute() {
  setMuted(!muted);
  return muted;
}

// ========================
// BACKGROUND MUSIC
// ========================

/** Simple looping children's melody using oscillators. */
export function startMusic() {
  ensureCtx();
  if (musicPlaying) return;
  musicPlaying = true;
  playMelodyLoop();
}

export function stopMusic() {
  musicPlaying = false;
  musicNodes.forEach(n => { try { n.stop(); } catch(e) {} });
  musicNodes = [];
}

/** A cheerful children's melody — plays in a loop. */
function playMelodyLoop() {
  if (!musicPlaying) return;

  // C major pentatonic melody — cheerful and simple
  const notes = [
    // "Twinkle twinkle" inspired pattern
    { freq: 523, dur: 0.3 },  // C5
    { freq: 523, dur: 0.3 },  // C5
    { freq: 784, dur: 0.3 },  // G5
    { freq: 784, dur: 0.3 },  // G5
    { freq: 880, dur: 0.3 },  // A5
    { freq: 880, dur: 0.3 },  // A5
    { freq: 784, dur: 0.6 },  // G5
    { freq: 0, dur: 0.1 },    // rest
    { freq: 698, dur: 0.3 },  // F5
    { freq: 698, dur: 0.3 },  // F5
    { freq: 659, dur: 0.3 },  // E5
    { freq: 659, dur: 0.3 },  // E5
    { freq: 587, dur: 0.3 },  // D5
    { freq: 587, dur: 0.3 },  // D5
    { freq: 523, dur: 0.6 },  // C5
    { freq: 0, dur: 0.2 },    // rest

    // Second phrase
    { freq: 784, dur: 0.3 },  // G5
    { freq: 784, dur: 0.3 },  // G5
    { freq: 698, dur: 0.3 },  // F5
    { freq: 698, dur: 0.3 },  // F5
    { freq: 659, dur: 0.3 },  // E5
    { freq: 659, dur: 0.3 },  // E5
    { freq: 587, dur: 0.6 },  // D5
    { freq: 0, dur: 0.1 },    // rest
    { freq: 784, dur: 0.3 },  // G5
    { freq: 784, dur: 0.3 },  // G5
    { freq: 698, dur: 0.3 },  // F5
    { freq: 698, dur: 0.3 },  // F5
    { freq: 659, dur: 0.3 },  // E5
    { freq: 659, dur: 0.3 },  // E5
    { freq: 587, dur: 0.6 },  // D5
    { freq: 0, dur: 0.3 },    // rest
  ];

  let time = audioCtx.currentTime + 0.1;
  for (const note of notes) {
    if (note.freq > 0) {
      // Main tone (sine — soft for kids)
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = note.freq;
      const env = audioCtx.createGain();
      env.gain.setValueAtTime(0.5, time);
      env.gain.exponentialRampToValueAtTime(0.01, time + note.dur - 0.02);
      osc.connect(env);
      env.connect(musicGain);
      osc.start(time);
      osc.stop(time + note.dur);
      musicNodes.push(osc);

      // Harmony (triangle, octave lower, quiet)
      const osc2 = audioCtx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = note.freq / 2;
      const env2 = audioCtx.createGain();
      env2.gain.setValueAtTime(0.2, time);
      env2.gain.exponentialRampToValueAtTime(0.01, time + note.dur - 0.02);
      osc2.connect(env2);
      env2.connect(musicGain);
      osc2.start(time);
      osc2.stop(time + note.dur);
      musicNodes.push(osc2);
    }
    time += note.dur;
  }

  // Schedule next loop
  const totalDuration = notes.reduce((s, n) => s + n.dur, 0);
  setTimeout(() => {
    musicNodes = musicNodes.filter(n => {
      try { n.stop(); } catch(e) {}
      return false;
    });
    playMelodyLoop();
  }, totalDuration * 1000);
}

// ========================
// SOUND EFFECTS
// ========================

/** Play a tap/click sound. */
export function playTap() {
  ensureCtx();
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 800;
  const env = audioCtx.createGain();
  env.gain.setValueAtTime(0.4, audioCtx.currentTime);
  env.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
  osc.connect(env);
  env.connect(sfxGain);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

/** Play a success/correct sound — rising cheerful chime. */
export function playCorrect() {
  ensureCtx();
  const t = audioCtx.currentTime;
  const freqs = [523, 659, 784, 1047]; // C E G C (major chord arpeggio)

  freqs.forEach((f, i) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;
    const env = audioCtx.createGain();
    env.gain.setValueAtTime(0, t + i * 0.1);
    env.gain.linearRampToValueAtTime(0.5, t + i * 0.1 + 0.02);
    env.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.3);
    osc.connect(env);
    env.connect(sfxGain);
    osc.start(t + i * 0.1);
    osc.stop(t + i * 0.1 + 0.35);
  });
}

/** Play an incorrect/wrong sound — descending sad tone. */
export function playIncorrect() {
  ensureCtx();
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.linearRampToValueAtTime(200, t + 0.3);
  const env = audioCtx.createGain();
  env.gain.setValueAtTime(0.25, t);
  env.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
  osc.connect(env);
  env.connect(sfxGain);
  osc.start(t);
  osc.stop(t + 0.4);
}

/** Play celebration fanfare — big joyful sound. */
export function playCelebration() {
  ensureCtx();
  const t = audioCtx.currentTime;
  // Fanfare: C-E-G-C ascending fast, then sustained chord
  const notes = [
    { f: 523, t: 0, d: 0.15 },
    { f: 659, t: 0.12, d: 0.15 },
    { f: 784, t: 0.24, d: 0.15 },
    { f: 1047, t: 0.36, d: 0.6 },
    // Sustained chord
    { f: 523, t: 0.5, d: 0.8 },
    { f: 659, t: 0.5, d: 0.8 },
    { f: 784, t: 0.5, d: 0.8 },
  ];

  notes.forEach(n => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = n.f;
    const env = audioCtx.createGain();
    env.gain.setValueAtTime(0, t + n.t);
    env.gain.linearRampToValueAtTime(0.4, t + n.t + 0.02);
    env.gain.exponentialRampToValueAtTime(0.01, t + n.t + n.d);
    osc.connect(env);
    env.connect(sfxGain);
    osc.start(t + n.t);
    osc.stop(t + n.t + n.d + 0.05);
  });
}

/** Play a swoosh sound (for drag start). */
export function playSwoosh() {
  ensureCtx();
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
  const env = audioCtx.createGain();
  env.gain.setValueAtTime(0.2, t);
  env.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
  osc.connect(env);
  env.connect(sfxGain);
  osc.start(t);
  osc.stop(t + 0.2);
}

/** Play a pop/bubble sound. */
export function playPop() {
  ensureCtx();
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, t);
  osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
  osc.frequency.exponentialRampToValueAtTime(400, t + 0.12);
  const env = audioCtx.createGain();
  env.gain.setValueAtTime(0.35, t);
  env.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
  osc.connect(env);
  env.connect(sfxGain);
  osc.start(t);
  osc.stop(t + 0.2);
}
