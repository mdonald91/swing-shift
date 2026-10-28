// Records kept across every save slot: endings you've reached, songs you've heard, and how many times
// you've finished the record. Used by the endings gallery, the jukebox and New Game+.
import { TRACKS } from '../data/music.js';

const KEY = 'swingshift.meta';
let cache = null;

export function meta() {
  if (cache) return cache;
  try { cache = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { cache = {}; }
  cache.heard ||= {}; cache.endings ||= {}; cache.clears ||= 0;
  return cache;
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(meta())); } catch (e) {} }

// a jukebox track counts as found the first time it plays anywhere
export function markHeard(mood) {
  const name = mood === 'brushes_ballad' || mood === 'brushes_bop' ? 'brushes' : mood;
  if (!TRACKS[name] || meta().heard[name]) return;
  meta().heard[name] = Date.now(); save();
}
export const heard = name => !!meta().heard[name];

export function markEnding(id, captain) {
  const m = meta();
  if (!m.endings[id]) m.endings[id] = { at: Date.now(), by: captain || '' };
  m.clears++;
  save();
}
export const seenEnding = id => !!meta().endings[id];

// saves made before 1.0 already hold endings and songs: copy them in when a save is loaded
export function backfill(state) {
  const f = state.flags || {}, m = meta();
  let changed = false;
  for (const id of ['encore', 'halftime', 'duet', 'lastcall', 'solo']) {
    if (f['ending_' + id] && !m.endings[id]) { m.endings[id] = { at: state.savedAt || Date.now(), by: state.player?.name || '' }; changed = true; }
  }
  const visited = { station: 'cygnus_arrived', vesta: 'courier_done', targon: 'targon_arrived', nyx: 'nyx_arrived', titan: 'nocturne_done',
    nocturne: 'nocturne_done', lockdown: 'lock_arrived', helix: 'metronome_done', bluenote: 'bn_arrived', lastset: 'lastset_done',
    tense: 'velvet_done', battle: 'velvet_done', victory: 'velvet_done', brushes: 'song_done', finale: 'act1_done' };
  for (const [k, fl] of Object.entries(visited)) if (f[fl] && !m.heard[k]) { m.heard[k] = Date.now(); changed = true; }
  if (changed) save();
}
