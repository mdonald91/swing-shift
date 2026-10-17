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
    playtime: 0,
    savedAt: 0
  };
}

export function newGame(slot, player) {
  Object.assign(state, blank(), { slot, player });
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
  Object.assign(state, blank(), data, { slot });
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
