// Music and sound. A small generative jazz combo (walking bass, ride, piano, muted horn)
// plays by default; your own Suno tracks from data/music.js take over when present.
import { settings } from '../state.js';
import { TRACKS } from '../data/music.js';

const A = { ctx: null, master: null, gen: null, music: null, sfx: null, noise: null, step: 0, nextT: 0, mel: 69, comp: [] };
const Clock = { bpm: 76, swing: .66, origin: performance.now() / 1000 };
const suno = { el: null, mood: null, missing: {}, playing: false };

const now = () => A.ctx ? A.ctx.currentTime : performance.now() / 1000;
const mf = m => 440 * Math.pow(2, (m - 69) / 12);
const pick = a => a[Math.floor(Math.random() * a.length)];
const fold = (n, lo, hi) => { while (n < lo) n += 12; while (n > hi) n -= 12; return n; };

const NOTE = { C: 36, Db: 37, D: 38, Eb: 39, E: 40, F: 41, Gb: 42, G: 43, Ab: 44, A: 45, Bb: 46, B: 47 };
const QUAL = {
  maj7: { t: [0, 4, 7, 11], v: [4, 11, 14, 7] },
  m7: { t: [0, 3, 7, 10], v: [3, 10, 14, 7] },
  dom7: { t: [0, 4, 7, 10], v: [4, 10, 14, 21] },
  b9: { t: [0, 4, 7, 10], v: [4, 10, 13, 7] }
};
const ch = (n, q) => ({ root: NOTE[n], q: QUAL[q] });
const MOODS = {
  title: { bpm: 168, swing: .66, prog: [ch('G', 'm7'), ch('C', 'dom7'), ch('F', 'maj7'), ch('D', 'b9'), ch('G', 'm7'), ch('C', 'dom7'), ch('A', 'm7'), ch('D', 'b9')], ride: 1, horn: 1, comp: 1, kick: .25 },
  ship: { bpm: 76, swing: .6, prog: [ch('Eb', 'maj7'), ch('C', 'm7'), ch('F', 'm7'), ch('Bb', 'dom7')], brush: 1, arp: 1, half: 1 },
  tense: { bpm: 100, swing: .62, prog: [ch('D', 'm7'), ch('D', 'm7'), ch('Eb', 'maj7'), ch('D', 'm7')], ride: 1, brush: 1, comp: 1, kick: .2, half: 1 },
  battle: { bpm: 192, swing: .62, prog: [ch('D', 'm7'), ch('D', 'm7'), ch('Eb', 'm7'), ch('Eb', 'm7'), ch('D', 'm7'), ch('D', 'm7'), ch('A', 'b9'), ch('A', 'b9')], ride: 1, horn: 1, comp: 1, stabs: 1, kick: .5, busy: 1 },
  victory: { bpm: 150, swing: .66, prog: [ch('F', 'maj7'), ch('D', 'dom7'), ch('G', 'm7'), ch('C', 'dom7')], ride: 1, horn: 1, comp: 1, kick: .3, always: 1 }
};
let mood = MOODS.title, moodName = 'title';

function osc(type, f, t, dur, g, o = {}) {
  const c = A.ctx, os = c.createOscillator(), e = c.createGain(), atk = o.attack || .008;
  os.type = type; os.frequency.setValueAtTime(f, t);
  if (o.glideTo) os.frequency.exponentialRampToValueAtTime(o.glideTo, t + dur);
  let node = os;
  if (o.cut) { const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = o.cut; fl.Q.value = o.q || 1; os.connect(fl); node = fl; }
  if (o.vib) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = 5.2; lg.gain.value = o.vib; l.connect(lg); lg.connect(os.detune); l.start(t); l.stop(t + dur + .1); }
  node.connect(e); e.connect(o.dest || A.gen);
  e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + atk);
  e.gain.exponentialRampToValueAtTime(.0005, t + Math.max(dur, atk + .01));
  os.start(t); os.stop(t + dur + .06);
}
function noise(t, dur, g, o = {}) {
  const c = A.ctx, s = c.createBufferSource(), fl = c.createBiquadFilter(), e = c.createGain(), atk = o.attack || .002;
  s.buffer = A.noise; fl.type = o.type || 'bandpass'; fl.frequency.value = o.f || 3000; fl.Q.value = o.q || 1;
  s.connect(fl); fl.connect(e); e.connect(o.dest || A.gen);
  e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + atk);
  e.gain.exponentialRampToValueAtTime(.0005, t + Math.max(dur, atk + .01));
  s.start(t, Math.random() * .5); s.stop(t + dur + .06);
}
const rhodes = (n, t, dur, g) => { osc('sine', mf(n), t, dur, g, { attack: .006 }); osc('sine', mf(n) * 2, t, dur * .5, g * .22, { attack: .004 }); };
const COMP_PATTERNS = [[0, 3], [1, 4], [3, 6], [0, 5], [2, 5, 7], [3, 7]];

function playStep(s, t, bd) {
  const m = mood, sib = s % 8, beat = sib >> 1, off = s & 1, bar = s >> 3;
  const c = m.prog[bar % m.prog.length], nx = m.prog[(bar + 1) % m.prog.length];
  if (m.ride && [0, 2, 3, 4, 6, 7].includes(sib)) noise(t, off ? .12 : .3, off ? .05 : .085, { type: 'highpass', f: 7200, q: .7 });
  if (!off && (beat === 1 || beat === 3) && (m.ride || m.brush)) noise(t, .05, .07, { type: 'highpass', f: 9000 });
  if (m.brush && !off) noise(t, bd * .8, .035, { f: 3200, q: .6, attack: bd * .25 });
  if (m.brush && off && Math.random() < .4) noise(t, .09, .03, { f: 2400, q: .8 });
  if (m.kick && !off && (m.busy || beat === 0 || Math.random() < .3)) osc('sine', 95, t, .18, m.kick * .5, { glideTo: 42 });
  if (m.ride && off && Math.random() < (m.busy ? .3 : .13)) noise(t, .08, .07, { f: 1900, q: 1.2 });
  if (!off && !(m.half && beat % 2)) {
    let n;
    if (beat === 0) n = c.root;
    else if (beat === 3 || (m.half && beat === 2)) n = nx.root + (Math.random() < .5 ? 1 : -1);
    else n = c.root + pick(c.q.t.slice(1));
    n = fold(n, 31, 50);
    const d = bd * (m.half ? 1.9 : .95);
    osc('triangle', mf(n), t, d, .42, { cut: 900, attack: .01 });
    osc('sine', mf(n), t, d, .22, { attack: .01 });
  }
  const voicing = c.q.v.map(iv => fold(c.root + iv, 52, 66));
  if (m.comp) {
    if (sib === 0) A.comp = pick(COMP_PATTERNS);
    if (A.comp.includes(sib)) voicing.forEach(n => rhodes(n, t, off ? .35 : .6, .06));
  }
  if (m.arp) {
    if (sib === 0) voicing.forEach(n => rhodes(n, t, bd * 4, .05));
    rhodes(voicing[s % 4] + 12, t, bd * 1.2, .045);
  }
  if (m.stabs && sib === 0 && bar % 2 === 0) voicing.forEach(n => osc('sawtooth', mf(n), t, .24, .04, { cut: 2400 }));
  if (m.stabs && sib === 3 && bar % 4 === 1) voicing.forEach(n => osc('sawtooth', mf(n), t, .18, .035, { cut: 2200 }));
  if (m.horn && (m.always || bar % 8 >= 4) && Math.random() < (off ? .55 : .75)) {
    const pool = [];
    for (const iv of c.q.t) for (const k of [12, 24, 36, 48]) { const n = c.root + iv + k; if (n >= 62 && n <= 81) pool.push(n); }
    if (off) pool.push(A.mel + 1, A.mel - 1, A.mel + 2, A.mel - 2);
    let near = pool.filter(n => n !== A.mel && Math.abs(n - A.mel) <= 5);
    if (!near.length) near = pool;
    const n = pick(near); A.mel = n;
    let dur = off ? bd * (1 - Clock.swing) * 1.1 : bd * Clock.swing * 1.1;
    if (bar % 8 === 7 && sib === 6) dur = bd * 2;
    osc('sawtooth', mf(n), t, dur, .055, { cut: 1700, q: 2, vib: 9, attack: .03 });
    osc('square', mf(n), t, dur, .012, { cut: 1200, attack: .03 });
  }
}

setInterval(() => {
  if (!A.ctx) return;
  if (A.ctx.currentTime - A.nextT > .6) resetClock();
  const bd = 60 / Clock.bpm;
  while (A.nextT < A.ctx.currentTime + .15) {
    try { playStep(A.step, A.nextT, bd); } catch (e) {}
    A.step++;
    const bi = A.step >> 1, off = A.step & 1;
    A.nextT = Clock.origin + bi * bd + (off ? Clock.swing * bd : 0);
  }
}, 25);

function resetClock() { Clock.origin = now() + .12; A.step = 0; A.nextT = Clock.origin; }

function applyVolumes() {
  if (!A.ctx) return;
  const t = A.ctx.currentTime;
  A.music.gain.setTargetAtTime(settings.music * .6, t, .05);
  A.sfx.gain.setTargetAtTime(settings.sfx * .8, t, .05);
  A.gen.gain.setTargetAtTime(suno.playing ? 0 : 1, t, .3);
  if (suno.el) suno.el.volume = Math.min(1, settings.music);
}

function stopSuno() {
  if (suno.el) { suno.el.pause(); suno.el.src = ''; suno.el = null; }
  suno.playing = false; suno.mood = null;
}

function trySuno(name) {
  const tr = TRACKS[name];
  if (!settings.suno || !tr || suno.missing[name]) { stopSuno(); applyVolumes(); return; }
  if (suno.mood === name && suno.el) return;
  stopSuno();
  const el = new window.Audio();
  el.loop = true; el.preload = 'auto'; el.src = tr.file;
  suno.el = el; suno.mood = name;
  el.addEventListener('canplay', () => {
    if (suno.el !== el) return;
    el.volume = Math.min(1, settings.music);
    el.play().then(() => {
      suno.playing = true;
      Clock.bpm = tr.bpm || Clock.bpm; resetClock();
      applyVolumes();
    }).catch(() => {});
  }, { once: true });
  el.addEventListener('error', () => {
    suno.missing[name] = true;
    if (suno.el === el) { suno.el = null; suno.mood = null; suno.playing = false; applyVolumes(); }
  }, { once: true });
}

export const Audio = {
  get started() { return !!A.ctx; },
  init() {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    try { A.ctx = new C(); } catch (e) { return; }
    const comp = A.ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4;
    A.master = A.ctx.createGain(); A.master.gain.value = .9;
    A.music = A.ctx.createGain(); A.gen = A.ctx.createGain(); A.sfx = A.ctx.createGain();
    A.gen.connect(A.music); A.music.connect(A.master); A.sfx.connect(A.master);
    A.master.connect(comp); comp.connect(A.ctx.destination);
    const len = A.ctx.sampleRate, b = A.ctx.createBuffer(1, len, len), d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    A.noise = b;
    applyVolumes();
    Audio.setMood(moodName, true);
  },
  setMood(name, force) {
    if (!MOODS[name]) return;
    if (name === moodName && !force && A.ctx) return;
    moodName = name; mood = MOODS[name];
    Clock.bpm = mood.bpm; Clock.swing = mood.swing; resetClock();
    if (A.ctx) trySuno(name);
  },
  get mood() { return moodName; },
  isSuno(name) { return !!(suno.playing && suno.mood === name); },
  sunoMissing(name) { return !!suno.missing[name]; },
  // Where we are in the music, in beats. Allows for speaker/Bluetooth delay so taps line up with what you hear.
  beatPos() { const lag = A.ctx ? (A.ctx.outputLatency || A.ctx.baseLatency || 0) : 0; return (now() - lag - Clock.origin) * Clock.bpm / 60; },
  volumes() { applyVolumes(); if (!settings.suno) stopSuno(); else if (A.ctx) trySuno(moodName); },
  sfx(name, arg) {
    if (!A.ctx) return;
    const t = now(), d = A.sfx;
    try {
      switch (name) {
        case 'tick': osc('square', 1400, t, .04, .04, { dest: d }); break;
        case 'move': osc('square', 900, t, .03, .025, { dest: d }); break;
        case 'blip': osc('square', arg || 400, t, .03, .02, { dest: d, cut: 1600 }); break;
        case 'confirm': [0, 7].forEach((iv, i) => osc('sine', mf(76 + iv), t + i * .07, .25, .12, { dest: d })); break;
        case 'back': osc('triangle', mf(64), t, .12, .1, { dest: d, glideTo: mf(57) }); break;
        case 'save': [0, 4, 7, 12].forEach((iv, i) => osc('sine', mf(72 + iv), t + i * .06, .4, .11, { dest: d })); break;
        case 'cymbal': noise(t, 1.6, .25, { type: 'highpass', f: 5000, dest: d }); break;
        case 'bump': osc('sine', 120, t, .08, .12, { dest: d, glideTo: 70 }); break;
        case 'bang': noise(t, .25, .6, { type: 'lowpass', f: 2600, dest: d }); osc('sine', 170, t, .2, .6, { glideTo: 40, dest: d }); break;
        case 'ping': osc('sine', 2400, t, .3, .12, { glideTo: 900, dest: d }); noise(t, .1, .3, { type: 'lowpass', f: 2000, dest: d }); break;
        case 'clank': [520, 1310, 2090].forEach(f => osc('square', f, t, .35, .07, { dest: d, cut: 4000 })); noise(t, .08, .3, { f: 3000, dest: d }); break;
        case 'zap': osc('sawtooth', 1800, t, .3, .12, { glideTo: 120, dest: d, cut: 3000 }); break;
        case 'tok': noise(t, .06, .5, { f: 1800, q: 3, dest: d }); osc('triangle', 600, t, .08, .2, { dest: d }); break;
        case 'heal': [0, 4, 7, 12].forEach((iv, i) => osc('sine', mf(72 + iv), t + i * .06, .4, .12, { dest: d })); break;
        case 'hurt': osc('square', 220, t, .18, .14, { glideTo: 90, dest: d, cut: 1200 }); noise(t, .12, .3, { type: 'lowpass', f: 900, dest: d }); break;
        case 'perfect': osc('sine', mf(88), t, .25, .14, { dest: d }); osc('sine', mf(95), t + .05, .3, .11, { dest: d }); break;
        case 'clam': osc('sawtooth', mf(50), t, .25, .08, { dest: d, cut: 900, glideTo: mf(48) }); break;
        case 'scratch': noise(t, .4, .5, { f: 600, q: 4, dest: d }); osc('sawtooth', 300, t, .35, .12, { glideTo: 60, dest: d, cut: 1500 }); break;
        case 'countin': for (let i = 0; i < 4; i++) { noise(t + i * .4, .05, .5, { f: 4500, q: 3, dest: d }); osc('square', 1900, t + i * .4, .03, .06, { dest: d }); } break;
      }
    } catch (e) {}
  }
};
