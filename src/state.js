// Game state, save slots and settings. Saves live in this browser's local storage.
const SLOT_KEY = 'swingshift.slot.';
const SETTINGS_KEY = 'swingshift.settings';
export const SLOT_COUNT = 3;

export const settings = { music: 0.8, sfx: 0.8, suno: true, textSpeed: 1 };

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
    bonds: { rook: 0, tam: 0, brushes: 0, rhea: 0 },
    party: ['rook', 'tam', 'brushes'],   // who fights alongside the captain (up to 3)
    playtime: 0,
    savedAt: 0
  };
}

export function newGame(slot, player) {
  Object.assign(state, blank(), { slot, player });
}

// Change faction standing, e.g. addRep({ docks: 1 }). Returns a short description of the change.
export function addRep(changes) {
  const out = [];
  for (const [k, v] of Object.entries(changes)) { state.rep[k] = (state.rep[k] || 0) + v; out.push([k, v]); }
  return out;
}

export function flag(name) { return !!state.flags[name]; }
export function setFlag(name, v = true) { state.flags[name] = v; }

export function saveGame() {
  state.savedAt = Date.now();
  try {
    localStorage.setItem(SLOT_KEY + state.slot, JSON.stringify(state));
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
  // saves from before reputation existed
  if (state.flags.velvet_done && !state.flags.rep_init) { state.rep.office += 2; state.flags.rep_init = true; }
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
}
export function saveSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {}
}

export function formatTime(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
}
