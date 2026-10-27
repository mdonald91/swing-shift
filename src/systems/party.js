// Crew stats with levels, gear and bonds applied. Used by combat and the crew screen.
import { PARTY, ROSTER, GROWTH, MAX_LEVEL, xpToNext, CAPTAIN_SKILLS, TREES, TIERS } from '../data/battles.js';
import { temperament } from '../data/appearance.js';
import { GEAR } from '../data/shop.js';
import { state, settings } from '../state.js';

export const BOND_HP = 10, BOND_ATK = 1;
export const CREW_KEYS = ['captain', 'rook', 'tam', 'brushes', 'rhea', 'lyra'];

export function ownsGear(id) { return (state.gear || []).includes(id); }

export function level(key) { return state.levels?.[key]?.lv || 1; }

export function crewStats(key) {
  const base = PARTY[key], g = GROWTH[key], lv = level(key), up = lv - 1;
  const bond = key === 'captain' ? 0 : (state.bonds?.[key] || 0);
  let atk = Math.round(base.atk + g.atk * up) + bond * BOND_ATK;
  let def = Math.round(base.def + g.def * up);
  const hp = Math.round(base.hp + g.hp * up) + bond * BOND_HP;
  const sp = Math.round(base.sp + g.sp * up);
  for (const gear of GEAR) {
    if (!ownsGear(gear.id) || (gear.who !== key && gear.who !== 'all')) continue;
    atk += gear.atk || 0; def += gear.def || 0;
  }
  return { ...base, atk, def, hp, sp, bond, lv, skills: knownSkills(key) };
}

// Starting skills plus everything picked from the skill tree.
export function knownSkills(key) {
  const start = key === 'captain' ? CAPTAIN_SKILLS[temperament(state.player)] : PARTY[key].skills;
  return [...start, ...(state.skills?.[key] || []).filter(Boolean)];
}

// Tiers the crew member has reached but not yet picked a skill for.
export function pendingPicks(key) {
  const picked = state.skills?.[key] || [];
  return TIERS.filter((lv, i) => level(key) >= lv && !picked[i]).length;
}

export function learn(key, tier, skill) {
  state.skills ||= {};
  const list = state.skills[key] ||= [];
  if (!TREES[key][tier].includes(skill) || level(key) < TIERS[tier]) return false;
  list[tier] = skill;
  return true;
}

// Adds XP and returns how many levels were gained.
export function addXp(key, amount) {
  state.levels ||= {};
  const L = state.levels[key] ||= { lv: 1, xp: 0 };
  let gained = 0;
  L.xp += Math.round(amount);
  while (L.lv < MAX_LEVEL && L.xp >= xpToNext(L.lv)) { L.xp -= xpToNext(L.lv); L.lv++; gained++; }
  if (L.lv >= MAX_LEVEL) L.xp = 0;
  return gained;
}

export function partyAverageLevel() {
  const keys = ['captain', ...activeParty()];
  return keys.reduce((s, k) => s + level(k), 0) / keys.length;
}

export function startingGroove() {
  return GEAR.filter(g => g.groove && ownsGear(g.id)).reduce((s, g) => s + g.groove, 0);
}

// Extra beat-window width from gear like the Pocket metronome.
export function beatWindowBonus() {
  return GEAR.filter(g => g.window && ownsGear(g.id)).reduce((s, g) => s + g.window, 0);
}

// Perfect-hit window in beats: base width, plus gear, wider still in Relaxed rhythm mode.
export function rhythmWindow(base = .2) {
  return (base + beatWindowBonus()) * (settings.rhythm === 'relaxed' ? 1.6 : 1);
}
export const autoRhythm = () => settings.rhythm === 'auto';

// Crew who are aboard right now.
export function available(id) {
  const r = ROSTER.find(x => x.id === id);
  return !!r && (!r.needs || !!state.flags[r.needs]);
}

// The three who fight alongside the captain, topped up if someone has left.
// While the crew is split into two teams, a fight only uses the team you're playing.
export function squad() { return state.squads?.split ? state.squads[state.squads.active] : null; }
export function captainFights() { return !squad() || state.squads.active === 'a'; }

export function activeParty() {
  const sq = squad();
  if (sq) return sq.members.filter(available);
  const picked = (state.party || []).filter(available).slice(0, 3);
  for (const r of ROSTER) { if (picked.length >= 3) break; if (!picked.includes(r.id) && available(r.id)) picked.push(r.id); }
  return picked;
}
