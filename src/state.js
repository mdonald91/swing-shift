// Game state, save slots and settings. Saves live in this browser's local storage.
import { backfill } from './systems/meta.js';
const SLOT_KEY = 'swingshift.slot.';
const SETTINGS_KEY = 'swingshift.settings';
export const SLOT_COUNT = 3;

export const settings = {
  music: 0.8, sfx: 0.8, suno: true, textSpeed: 1,
  calibration: 0,        // ms to shift the beat by, for phone speakers and Bluetooth delay
  rhythm: 'normal',      // 'normal' | 'relaxed' (wider timing) | 'auto' (the band taps for you)
  textSize: 0,           // 0 normal, 1 large, 2 largest
  reduceShake: false,
  tutorials: true,
  autosave: true
};

export const state = blank();

function blank() {
  return {
    slot: 0,
    player: null,          // appearance + name + temperament from the New Game screen
    location: 'ship',
    pos: null,             // { px, py } in world pixels
    flags: {},
    bounties: {},          // id -> 'active' | 'done'
    chits: 480,
    items: { noodle: 2 },
    gear: [],              // ids from data/shop.js GEAR
    rep: { office: 0, docks: 0, helix: 0 },
    bonds: { rook: 0, tam: 0, brushes: 0, rhea: 0, lyra: 0 },
    party: ['rook', 'tam', 'brushes'],   // who fights alongside the captain (up to 3)
    levels: {},            // crew key -> { lv, xp }
    skills: {},            // crew key -> skills picked from the tree, by tier
    scrap: 0,              // salvage from machines, for Tam's workshop
    job: null,             // the odd job you've taken: { id, picked }
    jobsDone: 0,
    jamStyle: 'bigband',
    squads: null,
    ngp: 0,                // New Game+ cycle: 0 on a first playthrough          // Blue Note: the crew split into two teams { split, active: 'a'|'b', a: {members, loc, pos, face}, b: {...} }
    playtime: 0,
    savedAt: 0
  };
}

export function newGame(slot, player) {
  Object.assign(state, blank(), { slot, player });
}

// New Game+: start the record again with the same captain, keeping the crew's levels, skills, gear and bonds.
// The story, chits, items and standing all start fresh. Enemies grow to meet you (see systems/party.js ngpScale).
export function newGamePlus(slot, from) {
  const b = blank();
  Object.assign(state, b, {
    slot, player: from.player,
    levels: JSON.parse(JSON.stringify(from.levels || {})),
    skills: JSON.parse(JSON.stringify(from.skills || {})),
    gear: [...(from.gear || [])],
    bonds: { ...b.bonds, ...(from.bonds || {}) },
    ngp: (from.ngp || 0) + 1
  });
  // they already know how to fight
  for (const t of ['controls', 'battle', 'rhythm', 'types']) state.flags['tut_' + t] = true;
}

// Change faction standing, e.g. addRep({ docks: 1 }). Returns a short description of the change.
export function addRep(changes) {
  const out = [];
  for (const [k, v] of Object.entries(changes)) { state.rep[k] = (state.rep[k] || 0) + v; out.push([k, v]); }
  return out;
}

export function flag(name) { return !!state.flags[name]; }
export function setFlag(name, v = true) { state.flags[name] = v; }

export function saveGame(slot = state.slot) {
  state.savedAt = Date.now();
  state.slot = slot;
  try {
    localStorage.setItem(SLOT_KEY + slot, JSON.stringify(state));
    return true;
  } catch (e) { return false; }
}

export function loadGame(slot) {
  const data = readSlot(slot);
  if (!data) return false;
  const b = blank();
  Object.assign(state, b, data, { slot });
  state.rep = { ...b.rep, ...(data.rep || {}) };
  state.bonds = { ...b.bonds, ...(data.bonds || {}) };
  state.items = { ...(data.items || b.items) };
  state.party = Array.isArray(data.party) && data.party.length ? data.party : b.party;
  state.levels = { ...(data.levels || {}) };
  state.skills = { ...(data.skills || {}) };
  state.scrap = data.scrap || 0;
  state.job = data.job || null;
  state.jobsDone = data.jobsDone || 0;
  state.jamStyle = data.jamStyle || 'bigband';
  state.squads = data.squads || null;
  state.ngp = data.ngp || 0;
  // saves from before levels existed: start the crew at a level that fits how far they've got
  if (!data.levels) {
    const f = state.flags;
    const lv = f.courier_done ? 8 : f.ghost_done ? 6 : f.velvet_done ? 4 : 1;
    for (const k of ['captain', 'rook', 'tam', 'brushes', 'rhea']) state.levels[k] = { lv, xp: 0 };
  }
  // players from before 0.9 already know how to fight: skip the basic tutorials
  if (state.flags.velvet_done) for (const t of ['controls', 'battle', 'rhythm', 'types']) state.flags['tut_' + t] ??= true;
  // saves from before reputation existed
  if (state.flags.velvet_done && !state.flags.rep_init) { state.rep.office += 2; state.flags.rep_init = true; }
  backfill(state);
  return true;
}

export function readSlot(slot) {
  try {
    const raw = localStorage.getItem(SLOT_KEY + slot);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

export function allSlots() {
  return Array.from({ length: SLOT_COUNT }, (_, i) => readSlot(i));
}

export function latestSlot() {
  let best = -1, t = 0;
  allSlots().forEach((s, i) => { if (s && s.savedAt >= t) { t = s.savedAt; best = i; } });
  return best;
}

export function loadSettings() {
  try { Object.assign(settings, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')); } catch (e) {}
  settings.calibration = Math.max(-250, Math.min(400, +settings.calibration || 0));
  if (!['normal', 'relaxed', 'auto'].includes(settings.rhythm)) settings.rhythm = 'normal';
}
export function saveSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {}
}

export function formatTime(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
}
