// Crew stats with gear and bonds applied. Used by combat and the crew screen.
import { PARTY } from '../data/battles.js';
import { GEAR } from '../data/shop.js';
import { state } from '../state.js';

export const BOND_HP = 10, BOND_ATK = 1;

export function ownsGear(id) { return (state.gear || []).includes(id); }

export function crewStats(key) {
  const base = PARTY[key];
  const bond = key === 'captain' ? 0 : (state.bonds?.[key] || 0);
  let atk = base.atk + bond * BOND_ATK, def = base.def, hp = base.hp + bond * BOND_HP;
  for (const g of GEAR) {
    if (!ownsGear(g.id) || (g.who !== key && g.who !== 'all')) continue;
    atk += g.atk || 0; def += g.def || 0;
  }
  return { ...base, atk, def, hp, sp: base.sp, bond };
}

export function startingGroove() {
  return GEAR.filter(g => g.groove && ownsGear(g.id)).reduce((s, g) => s + g.groove, 0);
}

// Extra beat-window width from gear like the Pocket metronome.
export function beatWindowBonus() {
  return GEAR.filter(g => g.window && ownsGear(g.id)).reduce((s, g) => s + g.window, 0);
}
