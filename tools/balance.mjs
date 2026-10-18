// Balance check: simulates fights many times with a simple "just attack" party and mixed timing.
// Run with:  node tools/balance.mjs
// Reports how often the party wins at a given level, how many rounds it takes and how much HP is left.
import { ENCOUNTERS } from '../src/data/battles.js';
import { state } from '../src/state.js';
import { crewStats } from '../src/systems/party.js';

const STUN = .35;   // how often the party stuns the Mantis mid-drill
const SMART = process.argv.includes('--smart');   // players who switch attackers to match the Mantis's weak spot
const TIMING = [[1.5, .3], [1.2, .4], [1.0, .2], [.85, .1]];   // perfect, good, late, miss
const timing = () => { let r = Math.random(); for (const [m, p] of TIMING) { if ((r -= p) <= 0) return m; } return 1; };
const rnd = (a, b) => a + Math.random() * (b - a);

function fight(encId, lv, crew) {
  state.levels = Object.fromEntries(['captain', ...crew].map(k => [k, { lv, xp: 0 }]));
  state.gear = []; state.bonds = {}; state.player ||= { temp: 0 };
  const party = ['captain', ...crew].map(k => { const s = crewStats(k); return { ...s, max: s.hp, ko: false }; });
  const enc = ENCOUNTERS[encId];
  const foes = enc.enemies.map(e => ({ ...e, max: e.hp, ko: false }));
  // the Iron Mantis: stances shift its weak spot and its attacks (see ui/battle.js)
  const ST = { guard: [['shock'], ['shot', 'blunt'], 8, 'strike'], strike: [['blunt'], ['shock'], 0, 'drill'], drill: [['shot'], [], -4, 'guard'] };
  const stance = (e, n) => { const [w, r, d] = ST[n]; e.stance = n; e.weakTo = w; e.resists = r; e.def = Math.max(0, e.base + d); e.left = 2; e.spin = 0; };
  foes.filter(e => e.ai === 'mantis').forEach(e => { e.base = e.def; stance(e, 'guard'); });
  const alive = a => a.filter(u => !u.ko);
  const hitParty = (e, mult) => { const t = alive(party); const p = t[Math.floor(Math.random() * t.length)]; p.hp -= Math.max(1, Math.round(e.atk * mult * rnd(.9, 1.1) - p.def)); if (p.hp <= 0) { p.hp = 0; p.ko = true; } };
  let round = 0, duet = 0;
  while (alive(party).length && alive(foes).length && round < 60) {
    round++;
    for (const p of alive(party)) {
      const t = alive(foes); if (!t.length) break;
      const e = t.reduce((a, b) => (a.boss ? b : a.hp < b.hp ? a : b));   // finish off minions first
      const type = p.attack.type, typeMult = (e.weakTo || []).includes(type) ? 1.5 : (e.resists || []).includes(type) ? .6 : 1;
      e.hp -= Math.max(1, Math.round(p.atk * timing() * typeMult * rnd(.9, 1.1) - e.def));
      if (e.hp <= 0) { e.hp = 0; e.ko = true; }
    }
    const duo = alive(foes).filter(e => e.ai === 'duet');
    let skipDuet = false;
    if (duo.length === 2 && ++duet % 3 === 0) { alive(party).forEach(() => alive(party).length && hitParty({ atk: (duo[0].atk + duo[1].atk) / 2 }, .9)); skipDuet = true; }
    for (const e of alive(foes)) {
      if (!alive(party).length) break;
      if (skipDuet && e.ai === 'duet') continue;
      if (e.ai === 'velvet' && e.hp < e.max * .45 && !e.h) { e.h = 1; e.hp += 60; continue; }
      if (e.ai === 'warden' && e.hp < e.max * .5 && !e.o) { e.o = 1; e.atk += 5; continue; }
      if (e.ai === 'duet' && e.role === 'sable' && !e.s) { const v = foes.find(x => x.role === 'vox'); if (v && !v.ko && v.hp < v.max * .45) { e.s = 1; v.hp += 60; continue; } }
      if (e.ai === 'duet' && duo.length < 2 && !e.solo) { e.solo = 1; e.atk = Math.round(e.atk * 1.3); }
      if (e.ai === 'mantis') {
        if (e.hp < e.max * .5 && !e.hurt) { e.hurt = 1; e.atk += 4; }
        if (e.stance === 'guard') hitParty(e, .85);
        else if (e.stance === 'strike') { hitParty(e, .78); if (alive(party).length) hitParty(e, .78); }
        else if (!e.spin) e.spin = 1;
        else { e.spin = 0; if (Math.random() > STUN) alive(party).forEach(() => alive(party).length && hitParty(e, .95)); }
        if (--e.left <= 0) { const n = ST[e.stance][3]; stance(e, n); if (e.hurt) e.left = n === 'drill' ? 2 : 1; }
        continue;
      }
      const aoe = (e.ai === 'velvet' && Math.random() < .35) ? .62 : (e.ai === 'warden' && Math.random() < .3) ? .55 : 0;
      if (aoe) alive(party).forEach(() => alive(party).length && hitParty(e, aoe));
      else hitParty(e, e.ai === 'warden' ? 1.15 : e.role === 'vox' ? 1.1 : 1);
    }
  }
  const won = !alive(foes).length;
  return { won, round, hpLeft: party.reduce((s, p) => s + p.hp, 0) / party.reduce((s, p) => s + p.max, 0) };
}

const plan = [
  ['smugglers', [1, 2], ['rook', 'tam', 'brushes']],
  ['loader', [1, 2], ['rook', 'tam', 'brushes']],
  ['velvet', [1, 2, 3, 4], ['rook', 'tam', 'brushes']],
  ['alley', [3, 4, 5], ['rook', 'tam', 'brushes']],
  ['drones', [3, 4, 5], ['rhea', 'tam', 'brushes']],
  ['maint', [4, 5, 6], ['rhea', 'tam', 'brushes']],
  ['warden', [3, 4, 5, 6], ['rhea', 'tam', 'brushes']],
  ['scavs', [5, 6, 7], ['rook', 'rhea', 'tam']],
  ['jumpers', [6, 7, 8], ['rook', 'rhea', 'tam']],
  ['duet', [5, 6, 7, 8], ['rook', 'rhea', 'tam']],
  ['rockrats', [7, 8, 9], ['rook', 'rhea', 'tam']],
  ['minebots', [8, 9, 10], ['rook', 'rhea', 'tam']],
  ['crawler', [8, 9, 10], ['rook', 'rhea', 'tam']],
  ['mantis', [8, 9, 10, 11, 12], ['rook', 'rhea', 'tam']]
];
const N = 600;
console.log('fight       lvl  win%  rounds  HP left');
for (const [id, lvs, crew] of plan) for (const lv of lvs) {
  let w = 0, r = 0, h = 0;
  for (let i = 0; i < N; i++) { const o = fight(id, lv, crew); w += o.won; r += o.round; h += o.won ? o.hpLeft : 0; }
  console.log(`${id.padEnd(11)} ${String(lv).padStart(3)}  ${String(Math.round(w / N * 100)).padStart(4)}  ${(r / N).toFixed(1).padStart(6)}  ${w ? Math.round(h / w * 100) + '%' : '-'}`);
}
