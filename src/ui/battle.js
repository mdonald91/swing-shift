// Turn-based combat with on-the-beat timing, plus the payday ledger afterwards.
import { SKILLS, ITEMS, ENCOUNTERS, ENEMIES, TYPES, TIERS, xpToNext, JAM_STYLES } from '../data/battles.js';
import { completeJob } from '../systems/jobs.js';
import { CREW } from '../data/crew.js';
import { BOUNTIES } from '../data/bounties.js';
import { backdrop } from '../art/backdrops.js';
import { playerPortrait, npcPortrait } from '../art/portrait.js';
import { state, setFlag, saveGame, addRep } from '../state.js';
import { crewStats, startingGroove, rhythmWindow, autoRhythm, pendingPicks, activeParty, addXp, available, level, partyAverageLevel, CREW_KEYS } from '../systems/party.js';
import { MAPS } from '../data/maps.js';
import { bus } from '../bus.js';
import { block, unblock } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { el, esc, sceneLayer, toast, travel } from './ui.js';
import { playCut } from './cutscene.js';
import { runDialogue } from './dialog.js';
import { Hud } from './hud.js';
import { tip } from './tips.js';

const RHY = {
  perfect: { mult: 1.5, g: 24, label: 'On the beat!' },
  good: { mult: 1.2, g: 13, label: 'In the pocket' },
  late: { mult: 1.0, g: 6, label: 'Laid back...' },
  miss: { mult: .85, g: 3, label: 'Clam!' }
};
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const living = arr => arr.filter(u => !u.ko);
const portraitOf = u => u.id === 'player' ? playerPortrait(state.player) : npcPortrait(u.id);

let B = null, R = null, root = null, raf = 0;

// The Iron Mantis's stances: each shifts its weak spot.
const STANCES = {
  guard: { label: 'Guard', weakTo: ['shock'], resists: ['shot', 'blunt'], def: 8, next: 'strike' },
  strike: { label: 'Strike', weakTo: ['blunt'], resists: ['shock'], def: 0, next: 'drill' },
  drill: { label: 'Drill', weakTo: ['shot'], resists: [], def: -4, next: 'guard' }
};

export function startBattle(id, { retry = false, flag = null, retreatTo = null } = {}) {
  const enc = ENCOUNTERS[id];
  if (!enc) return;
  if (!retry) block();
  cleanup();
  Audio.setMood('battle', true);
  const party = [
    { key: 'captain', id: 'player', name: state.player.name, ...crewStats('captain') },
    ...activeParty().map(k => ({ key: k, id: k, name: CREW[k].short, ...crewStats(k) }))
  ].map(u => ({ ...u, max: u.hp, spMax: u.sp, sp: Math.round(u.sp * .4), ko: false, guard: false }));
  // encounters marked "scale" grow with the crew (the rehearsal)
  const L = enc.scale ? partyAverageLevel() - 1 : 0;
  const enemies = enc.enemies.map((e, i) => ({
    ...e, key: 'e' + i, ko: false,
    hp: Math.round(e.hp * (1 + .2 * L)), atk: Math.round(e.atk + 1.3 * L), def: Math.round((e.def || 0) + .4 * L), xp: Math.round((e.xp || 15) * (1 + .3 * L))
  })).map(e => ({ ...e, max: e.hp }));
  for (const e of enemies) if (e.ai === 'sentinel') { e.shielded = true; e.summons = 0; }
  for (const e of enemies) if (e.ai === 'mantis') {
    e.baseDef = e.def - (state.flags.core_kept ? 3 : 0);
    setStance(e, 'guard');
  }
  // who stands with you (Track 07): old friends and choices change the fight before it starts
  const assists = [];
  let groove0 = startingGroove(), shield0 = 0;
  if (enc.assists) {
    const f = state.flags;
    if (f.cass_free) {
      const i = enemies.findIndex(e => !e.boss);
      if (i >= 0) { enemies.splice(i, 1); assists.push('Cass Marlowe steps out of the lift and lays the nearest collector out cold. "Hi, Rook. Miss me?"'); }
    }
    if (f.std_helix_bad) {
      enemies.push({ ...ENEMIES.helixguard, key: 'e' + enemies.length, ko: false, max: ENEMIES.helixguard.hp });
      assists.push("Hale's own guard steps in beside Crane. Helix remembers who crossed it.");
    }
    if (f.juno_protected) { enemies.forEach(e => { if (!e.boss) e.weak = 3; }); assists.push("Juno is in the tower's systems. The hunters' visors fizz: they hit softer for a while."); }
    const crane = enemies.find(e => e.ai === 'metronome');
    if (crane) {
      crane.count = crane.countMax = (f.proto_free || f.lyra_joined) ? 6 : 4;
      if (f.proto_free) assists.push('On every speaker in the tower, one wrong note. Lyra, somewhere in the network. Crane loses his count.');
      else if (f.lyra_joined) assists.push('Lyra hums a counter-rhythm under her breath. Crane frowns and starts his count again.');
    }
    if (f.proto_returned) { shield0 = 2; assists.push("Dr Sato's security patch boots on your comms: the crew takes less damage for 2 rounds."); }
    if (f.fifth_bar) { groove0 += 40; assists.push('Brushes hums the fifth bar. The whole band hears it. +40 Groove.'); }
    const bonded = party.filter(u => u.key !== 'captain' && (state.bonds[u.key] || 0) >= 2);
    bonded.forEach(u => { u.atk = Math.round(u.atk * 1.15); u.inspired = true; });
    if (bonded.length) assists.push(`${bonded.map(u => u.name).join(' and ')} ${bonded.length > 1 ? 'look' : 'looks'} at you and ${bonded.length > 1 ? 'nod' : 'nods'}. Inspired: they hit harder this fight.`);
  }
  enemies.forEach((e, i) => { e.key = 'e' + i; });
  B = { jam: JAM_STYLES[state.jamStyle] ? state.jamStyle : 'bigband', id, enc, party, enemies, groove: Math.min(100, groove0), assists, turn: 0, overclock: 0, shield: shield0, perfects: 0, ricochet: 0, wrench: 0, over: false, mode: 'busy', pending: null, xflag: flag, retreatTo };

  root = el(`<div class="bt" role="dialog" aria-label="Combat">
    <div class="bt-bg">${backdrop(enc.bg)}</div>
    <div class="bt-wrap">
      <header class="bt-hud">
        <span class="bt-tag">Combat <span class="jp">戦闘</span></span>
        <div class="metro" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <div class="groove"><span>Groove</span><div class="gbar"><i></i></div></div>
      </header>
      <div class="bt-row bt-enemies">${enemies.map(e => card(e, true)).join('')}</div>
      <div class="bt-mid">
        <p class="bt-log" aria-live="polite"></p>
        <div class="ring" hidden><i class="target"></i><i class="shrink"></i><span class="ring-label"></span></div>
      </div>
      <div class="bt-bottom">
        <div class="bt-cmd panel"></div>
        <div class="bt-row bt-party">${party.map(p => card(p, false)).join('')}</div>
      </div>
    </div>
    <div class="bt-jam" hidden><div class="bt-jam-panels"></div><p class="bt-jam-title">Jam<br>Session</p></div>
    <div class="bt-over" hidden></div>
  </div>`);
  sceneLayer().append(root);
  root.querySelectorAll('.bt-card').forEach(c => c.addEventListener('click', () => onCard(c.dataset.k)));
  root.addEventListener('pointerdown', e => rhythmPress(e.timeStamp));
  document.addEventListener('keydown', onKey);
  update();
  log(enc.intro || 'Here they come.');
  if (enemies.some(e => e.ai === 'mantis') && state.flags.core_kept) setTimeout(() => root && log('In the cargo bay, Kevin the tuning core hums the four bars backwards. The Mantis flinches: its armour sits a little looser.'), 1600);
  raf = requestAnimationFrame(frame);
  setTimeout(async () => {
    if (!root) return;
    await tip('battle', root);
    if (root && enemies.some(e => e.weakTo || e.resists)) await tip('types', root);
    for (const line of B.assists) { if (!root) return; log(line); Audio.sfx('confirm'); update(); await sleep(2300); }
    if (root && enemies.some(e => e.ai === 'metronome')) { await tip('metronome', root); log(`Crane starts counting: "${['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'][enemies.find(e => e.ai === 'metronome').count]}..."`); await sleep(1400); }
    if (root) nextActor();
  }, 900);
}

function cleanup() {
  cancelAnimationFrame(raf); raf = 0;
  document.removeEventListener('keydown', onKey);
  if (root) root.remove();
  root = null; R = null;
}

function onKey(e) {
  if ((e.key === ' ' || e.key === 'Enter') && R) { e.preventDefault(); rhythmPress(e.timeStamp); }
}

const $ = s => root.querySelector(s);
const cardOf = u => root && root.querySelector(`.bt-card[data-k="${u.key}"]`);
function log(t) { if (root) $('.bt-log').textContent = t; }
function cmd(html) { $('.bt-cmd').innerHTML = html; }
function clearMarks() { root.querySelectorAll('.bt-card').forEach(c => c.classList.remove('active', 'targetable', 'acting')); }

function card(u, enemy) {
  return `<button class="bt-card ${enemy ? 'enemy' : 'ally'} ${u.boss ? 'boss' : ''}" data-k="${u.key}" type="button" aria-label="${esc(u.name)}">
    <span class="bt-pt">${portraitOf(u)}</span>
    <span class="bt-info"><b class="bt-nm">${esc(u.name)}${enemy ? '' : ` <small class="bt-lv">Lv ${u.lv}</small>`}</b>
      ${enemy && (u.weakTo || u.resists) ? `<span class="bt-weak">${weakTags(u)}</span>` : ''}
      <span class="bt-stat"><span>HP</span><i class="bar hp"><i></i></i><em class="hpn"></em></span>
      ${enemy ? '' : '<span class="bt-stat"><span>SP</span><i class="bar sp"><i></i></i><em class="spn"></em></span>'}
      <span class="bt-tags"></span></span></button>`;
}

function weakTags(u) {
  return `${(u.weakTo || []).map(t => `<i class="w">${TYPES[t]}</i>`).join('')}${(u.resists || []).map(t => `<i class="r">${TYPES[t]}</i>`).join('')}`;
}

function setStance(e, name) {
  const st = STANCES[name];
  e.stance = name; e.weakTo = [...st.weakTo]; e.resists = [...st.resists];
  e.def = Math.max(0, e.baseDef + st.def);
  e.stanceLeft = 2; e.drillPending = false;
}

// After each of the Mantis's turns: count down, and shift stance when it's time.
async function mantisTick(e) {
  if (--e.stanceLeft > 0 || e.ko) return;
  const next = STANCES[e.stance].next;
  setStance(e, next);
  if (e.hp < e.max * .5) e.stanceLeft = next === 'drill' ? 2 : 1;      // hurt: it shifts faster (but drilling still takes a wind-up)
  pop(cardOf(e), STANCES[next].label.toUpperCase() + '!');
  Audio.sfx('clank');
  const say = {
    guard: 'The Mantis folds its scythes over its body. GUARD STANCE.',
    strike: 'The Mantis rises up on its back legs, scythes wide. STRIKE STANCE.',
    drill: 'The Mantis plants its feet and its tail drill starts to turn. DRILL STANCE.'
  }[next];
  const chart = state.flags.tg_chart ? ` Ferro's chart: weak to ${TYPES[STANCES[next].weakTo[0]]} now.` : '';
  log(say + chart);
  update();
  await sleep(1200);
}

function update() {
  if (!root) return;
  [...B.party, ...B.enemies].forEach(u => {
    const c = cardOf(u); if (!c) return;
    c.querySelector('.bar.hp i').style.width = (u.hp / u.max * 100) + '%';
    c.querySelector('.hpn').textContent = u.hp;
    if (u.spMax) { c.querySelector('.bar.sp i').style.width = (u.sp / u.spMax * 100) + '%'; c.querySelector('.spn').textContent = u.sp; }
    c.classList.toggle('ko', u.ko);
    c.classList.toggle('low', !u.ko && u.hp / u.max < .3);
    const tags = [];
    if (u.guard) tags.push('Guard'); if (u.stun) tags.push('Stunned'); if (u.tuning && !u.ko) tags.push('Tuning'); if (u.jammed > 0) tags.push('Jammed'); if (u.weak > 0) tags.push('Weakened');
    if (u.stance && !u.ko) tags.push(STANCES[u.stance].label + ' stance');
    if (u.drillPending && !u.ko) tags.push('Spinning up');
    if (u.shielded && !u.ko) tags.push('Shield up');
    if (u.ai === 'nocturne' && !u.ko && B.enemies.some(x => x.accomp && !x.ko)) tags.push('Accompanied');
    if (u.ai === 'metronome' && !u.ko) tags.push(u.count <= 1 ? 'Downbeat next!' : `Count-in ${u.count}`);
    if (u.inspired && !u.ko) tags.push('Inspired');
    if (u.spMax && B.overclock > 0 && !u.ko) tags.push('Overclocked');
    if (u.spMax && B.shield > 0 && !u.ko) tags.push('Shielded');
    c.querySelector('.bt-tags').innerHTML = tags.map(t => `<em>${t}</em>`).join('');
    const wk = c.querySelector('.bt-weak');
    if (wk && u.stance) wk.innerHTML = weakTags(u);
  });
  $('.gbar i').style.width = B.groove + '%';
  $('.groove').classList.toggle('full', B.groove >= 100);
}

/* ---------------- turns ---------------- */
function nextActor() {
  if (!root || checkEnd()) return;
  while (B.turn < B.party.length && B.party[B.turn].ko) B.turn++;
  if (B.turn >= B.party.length) { enemyPhase(); return; }
  const a = B.party[B.turn];
  a.guard = false; update();
  clearMarks(); cardOf(a).classList.add('active');
  B.mode = 'menu'; showMenu(a);
}

function showMenu(a) {
  log(`${a.name} takes the solo. What's the play?`);
  cmd(`<p class="bt-who">${esc(a.name)}</p>
    <button type="button" data-c="attack">${esc(a.attack.n)}</button>
    <button type="button" data-c="skills">Skill</button>
    <button type="button" data-c="items" ${Object.values(state.items).some(n => n > 0) ? '' : 'disabled'}>Item</button>
    <button type="button" data-c="guard">Defend <small>+6 SP</small></button>
    <button type="button" data-c="run">Run</button>
    ${B.groove >= 100 ? `<button type="button" class="jam" data-c="jam">Jam Session${B.jam !== 'bigband' ? ` <small>${esc(JAM_STYLES[B.jam].n)}</small>` : ''}</button>` : ''}`);
  $('.bt-cmd button')?.focus({ preventScroll: true });
  root.querySelectorAll('.bt-cmd [data-c]').forEach(b => b.addEventListener('click', () => { Audio.sfx('tick'); menuPick(a, b.dataset.c); }));
  if (B.groove >= 100) tip('jam', root);
}

function backButton(a) {
  return '<button type="button" class="back" data-back>Back</button>';
}
function wireBack(a) {
  root.querySelector('.bt-cmd [data-back]')?.addEventListener('click', () => { Audio.sfx('back'); B.mode = 'menu'; clearMarks(); cardOf(a).classList.add('active'); showMenu(a); });
}

function menuPick(a, c) {
  if (c === 'attack') choose(a, { kind: 'attack' }, 'enemy');
  else if (c === 'skills') {
    cmd(`<p class="bt-who">${esc(a.name)} · Skills</p>` + a.skills.map(k => {
      const s = SKILLS[k];
      return `<button type="button" data-s="${k}" ${a.sp < s.cost ? 'disabled' : ''}>${esc(s.n)} <small>${s.cost} SP${s.type ? ' · ' + TYPES[s.type] : ''}<span class="d"> · ${esc(s.d)}</span></small></button>`;
    }).join('') + backButton(a));
    root.querySelectorAll('.bt-cmd [data-s]').forEach(b => b.addEventListener('click', () => {
      Audio.sfx('tick'); const sk = SKILLS[b.dataset.s];
      choose(a, { kind: 'skill', sk }, sk.tgt);
    }));
    wireBack(a);
  } else if (c === 'items') {
    const anyDown = B.party.some(p => p.ko);
    cmd(`<p class="bt-who">Items</p>` + Object.entries(state.items).filter(([k, n]) => n > 0 && ITEMS[k]).map(([k, n]) =>
      `<button type="button" data-i="${k}" ${(ITEMS[k].tgt === 'downed' && !anyDown) || (ITEMS[k].tgt === 'none' && B.groove >= 100) ? 'disabled' : ''}>${esc(ITEMS[k].n)} ×${n} <small>${esc(ITEMS[k].d)}</small></button>`).join('') + backButton(a));
    root.querySelectorAll('.bt-cmd [data-i]').forEach(b => b.addEventListener('click', () => {
      Audio.sfx('tick'); choose(a, { kind: 'item', key: b.dataset.i }, ITEMS[b.dataset.i].tgt);
    }));
    wireBack(a);
  } else if (c === 'guard') {
    a.guard = true; a.sp = Math.min(a.spMax, a.sp + 6);
    log(`${a.name} lays out a bar and steadies their nerve.`); update(); endAction(300);
  } else if (c === 'run') {
    if (B.enc.noRun) { log(B.enc.noRun); Audio.sfx('back'); return; }
    Audio.sfx('back'); cleanup(); unblock();
    if (B.retreatTo) { travel(state.location, B.retreatTo); toast('You fall back the way you came. They are still out there.'); return; }
    backToWorld(); toast(B.enc.scale ? 'Rehearsal over. Brushes looks disappointed.' : 'You slip away. They will still be there.');
  } else if (c === 'jam') doJam(a);
}

function choose(a, act, tgt) {
  B.pending = { a, act };
  if (tgt === 'enemy' || tgt === 'ally' || tgt === 'living' || tgt === 'downed') {
    B.mode = 'target-' + tgt;
    clearMarks(); cardOf(a).classList.add('active');
    const pool = tgt === 'enemy' ? living(B.enemies) : tgt === 'living' ? living(B.party) : tgt === 'downed' ? B.party.filter(p => p.ko) : B.party;
    pool.forEach(u => cardOf(u).classList.add('targetable'));
    log(tgt === 'enemy' ? 'Pick a target.' : 'Pick a crewmate.');
    cmd(`<p class="bt-who">Choose a target</p>` + backButton(a));
    wireBack(a);
  } else run(a, act, null);
}

function onCard(k) {
  if (!B || !B.mode.startsWith('target-')) return;
  const u = [...B.party, ...B.enemies].find(x => x.key === k);
  if (!u) return;
  const m = B.mode;
  if (m === 'target-enemy' && (u.ko || !B.enemies.includes(u))) return;
  if (m === 'target-ally' && !B.party.includes(u)) return;
  if (m === 'target-living' && (!B.party.includes(u) || u.ko)) return;
  if (m === 'target-downed' && (!B.party.includes(u) || !u.ko)) return;
  run(B.pending.a, B.pending.act, u);
}

async function run(a, act, target) {
  B.mode = 'busy'; clearMarks(); cardOf(a).classList.add('active');
  if (act.kind === 'item') {
    const it = ITEMS[act.key];
    state.items[act.key]--;
    if (it.tgt === 'party') living(B.party).forEach((p, i) => setTimeout(() => healAlly(p, it.heal, false, `${a.name} shares a ${it.n}. Everyone feels braver.`), i * 120));
    else if (it.heal) healAlly(target, it.heal, false, `${a.name} hands ${target.name} a ${it.n}.`);
    else if (it.revive) healAlly(target, Math.round(target.max * it.revive), true, `${a.name} patches ${target.name} up. Back in the band.`);
    else if (it.sp) { target.sp = Math.min(target.spMax, target.sp + it.sp); pop(cardOf(target), '+' + it.sp + ' SP', 'num heal'); Audio.sfx('heal'); log(`${target.name} downs a ${it.n}. Wide awake.`); update(); }
    else if (it.dmg) {
      const power = it.dmg + 8 * partyAverageLevel();
      log(`${a.name} lobs a ${it.n}. Everything metal in the room lights up.`);
      living(B.enemies).forEach((e, i) => setTimeout(() => root && hitEnemy({ name: a.name, atk: power }, e, 1, 'KZZAK!', 'zap', { type: it.type, pierce: true }), i * 180));
    } else if (it.groove) {
      B.groove = Math.min(100, B.groove + it.groove); Audio.sfx('heal');
      log(`${a.name} cracks a ${it.n}. The whole band feels it.${B.groove >= 100 ? ' The Groove is full!' : ''}`); update();
    }
    cmd(''); endAction(600); return;
  }
  cmd('<p class="bt-who">Tap on the beat</p><p class="bt-hint">Tap anywhere, or press Space, as the ring closes.</p>');
  const q = await rhythm(act.kind === 'skill' && act.sk.wide);
  if (!root) return;
  const m = RHY[q].mult;
  B.groove = Math.min(100, B.groove + RHY[q].g);
  if (q === 'perfect') B.perfects++;
  let wait = 700;
  if (act.kind === 'attack') {
    if (a.key === 'tam') B.wrench++;
    hitEnemy(a, target, m, a.attack.word, a.attack.sfx, { type: a.attack.type });
  } else {
    a.sp -= act.sk.cost;
    wait += applySkill(a, act.sk, target, m);
  }
  update();
  endAction(wait);
}

function applySkill(a, sk, target, m) {
  const notes = [];
  // crew-wide effects
  if (sk.buff) { B.overclock = sk.buff + (m >= 1.5 ? 1 : 0); Audio.sfx('zap'); notes.push(`The crew hits harder for ${B.overclock} rounds`); }
  if (sk.shield) { B.shield = sk.shield + (m >= 1.5 ? 1 : 0); Audio.sfx('heal'); notes.push(`The crew takes less damage for ${B.shield} rounds`); }
  if (sk.groove) { B.groove = Math.min(100, B.groove + sk.groove); notes.push(B.groove >= 100 ? 'The Groove is full' : `+${sk.groove} Groove`); }
  if (sk.tgt === 'none' && sk.sp) living(B.party).forEach(p => { p.sp = Math.min(p.spMax, p.sp + sk.sp); });
  if (sk.reviveAll) B.party.filter(p => p.ko).forEach(p => healAlly(p, Math.round(p.max * sk.reviveAll), true));
  if (sk.tag === 'ricochet') B.ricochet++;

  // who gets hit, in order (multi-hit skills repeat; "random" picks a fresh enemy each time)
  let targets = sk.tgt === 'enemy' || sk.tgt === 'ally' ? [target]
    : sk.tgt === 'enemies' ? living(B.enemies)
    : sk.tgt === 'party' ? (sk.reviveAll ? B.party : living(B.party)) : [];
  const n = sk.multi || 1;
  if (sk.tgt === 'random') targets = Array.from({ length: n }, () => null);
  else if (n > 1) targets = targets.flatMap(t => Array.from({ length: n }, () => t));
  const gap = n > 1 ? 130 : 170;

  targets.forEach((t, i) => setTimeout(() => {
    if (!root) return;
    if (sk.tgt === 'random') t = pick(living(B.enemies)) || null;
    if (!t) return;
    if (B.enemies.includes(t)) {
      if (t.ko) return;
      if (sk.hit) {
        let mult = sk.hit * m;
        if (sk.exec && t.hp < t.max * .4) mult *= 2;
        hitEnemy(a, t, mult, sk.word || a.attack.word, sk.sfx || 'bang', { type: sk.type, pierce: sk.pierce });
      } else {
        if (sk.word) pop(cardOf(t), sk.word);
        if (sk.sfx) Audio.sfx(sk.sfx);
      }
      if (!t.ko) {
        const weakStun = (t.weakTo || []).includes('stun') ? 2 : 1;
        if (sk.stun && Math.random() < sk.stun * Math.min(m, 1.4) * (t.boss ? .5 : 1) * weakStun) {
          t.stun = true; notes.push(`${t.name} is stunned`);
          if (t.tuning && B.duetPending && !B.duetBroken) { B.duetBroken = true; notes.push('The duet loses the key'); pop(cardOf(t), 'OFF KEY'); }
        }
        if (sk.jam) { t.jammed = sk.jam; notes.push(`${t.name} takes extra damage`); }
        if (sk.weaken) { t.weak = sk.weaken; notes.push(`${t.name} is weakened`); }
      }
    } else {
      if (sk.heal) {
        const amt = sk.heal < 1 ? Math.round(t.max * sk.heal) : Math.round(sk.heal * Math.min(m, 1.3));
        healAlly(t, amt, sk.revive || sk.reviveAll);
      }
      if (sk.sp && !t.ko) t.sp = Math.min(t.spMax, t.sp + sk.sp);
    }
    update();
    if (i === targets.length - 1 && notes.length) log([...new Set(notes)].slice(0, 2).join('. ') + (notes.length > 2 ? '...' : '.'));
  }, i * gap));
  if (!targets.length && notes.length) { log(`${a.name}: ${notes.join('. ')}.`); update(); }
  return targets.length * gap;
}

function endAction(wait = 500) {
  setTimeout(() => {
    if (!root) return;
    update();
    if (checkEnd()) return;
    B.turn++;
    setTimeout(nextActor, 250);
  }, wait);
}

/* ---------------- rhythm ---------------- */
async function rhythm(wide) {
  await tip('rhythm', root);
  if (!root) return 'miss';
  return new Promise(res => {
    const target = Math.ceil(Audio.beatPos() + .8);
    R = { target, res, wide, armedAt: performance.now() + 140, done: false };
    const ring = $('.ring');
    ring.classList.remove('perfect');
    $('.ring-label').textContent = autoRhythm() ? 'Auto rhythm' : B.rubato ? 'Rubato! Tight timing' : 'Tap on the beat';
    ring.hidden = false;
  });
}
const perfectWindow = () => rhythmWindow(R.wide ? .28 : .2) * (B && B.rubato ? .6 : 1);
function rhythmPress(at) {
  if (!R || R.done || autoRhythm() || performance.now() < R.armedAt) return;
  const d = Math.abs(Audio.beatPos(at) - R.target);
  const p = perfectWindow();
  finishRhythm(d <= p ? 'perfect' : d <= p * 2 ? 'good' : 'miss');
}
function finishRhythm(q) {
  R.done = true;
  $('.ring-label').textContent = RHY[q].label;
  $('.ring .shrink').style.transform = 'scale(1)';
  if (q === 'perfect') { $('.ring').classList.add('perfect'); Audio.sfx('perfect'); }
  else if (q === 'miss') Audio.sfx('clam'); else Audio.sfx('tick');
  const r = R;
  setTimeout(() => { if (root) $('.ring').hidden = true; R = null; r.res(q); }, 380);
}

function frame() {
  if (!root) return;
  const bp = Audio.beatPos();
  const bi = ((Math.floor(bp) % 4) + 4) % 4;
  root.querySelectorAll('.metro i').forEach((d, i) => d.classList.toggle('on', i === bi));
  if (R && !R.done) {
    const left = R.target - bp;
    $('.ring .shrink').style.transform = `scale(${(1 + Math.max(0, left) * 1.7).toFixed(3)})`;
    if (autoRhythm() && left <= 0) finishRhythm('good');
    else if (left < -Math.max(.42, perfectWindow() * 2 + .04)) finishRhythm('late');
  }
  raf = requestAnimationFrame(frame);
}

/* ---------------- effects ---------------- */
function pop(c, text, cls = '') {
  if (!c) return;
  const p = document.createElement('span');
  p.className = 'bt-pop ' + cls; p.textContent = text;
  c.appendChild(p); setTimeout(() => p.remove(), 850);
}
function shake(c) { if (!c) return; c.classList.remove('hit'); void c.offsetWidth; c.classList.add('hit'); }

function hitEnemy(a, e, mult, word, snd, { type, pierce } = {}) {
  if (!e || e.ko) { e = living(B.enemies)[0]; if (!e) return; }
  const weak = type && (e.weakTo || []).includes(type), resist = type && (e.resists || []).includes(type);
  const typeMult = weak ? 1.5 : resist ? .6 : 1;
  let v = a.atk * mult * typeMult * rnd(.9, 1.1) * (B.overclock > 0 ? 1.3 : 1) * (e.jammed > 0 ? 1.25 : 1) - (pierce ? 0 : e.def);
  if (e.shielded) v *= .6;
  if (e.ai === 'nocturne' && B.enemies.some(x => x.accomp && !x.ko)) v *= .65;
  v = Math.max(1, Math.round(v));
  e.hp = Math.max(0, e.hp - v);
  const c = cardOf(e); pop(c, weak ? 'WEAK!' : resist ? 'RESIST' : word, weak ? 'weak' : resist ? 'resist' : ''); pop(c, '-' + v, 'num'); shake(c);
  if (weak) B.groove = Math.min(100, B.groove + 6);
  if (e.ai === 'metronome' && mult >= 1.5 && e.hp > 0 && !e.pushed && e.count < e.countMax) {
    e.pushed = true; e.count++;
    setTimeout(() => { if (!root) return; pop(c, 'OFF BEAT', 'weak'); log(`Right on the beat. Crane loses his place and counts again from ${e.count}.`); update(); }, 300);
  }
  Audio.sfx(snd);
  if (e.shielded && type === 'shock' && e.hp > 0) {
    e.shielded = false; e.shieldT = 3;
    setTimeout(() => { if (!root) return; pop(c, 'SHIELD DOWN', 'weak'); Audio.sfx('clam'); log(`The shock shorts out ${e.name}'s shield! Hit it with everything.`); update(); }, 250);
  }
  if (e.hp === 0) { e.ko = true; e.stun = false; e.jammed = 0; log(e.ai === 'velvet' ? 'Velvet hits the deck. Her hat lands a beat later.' : `${e.name} is down for the count.`); }
  else log(`${a.name} hits ${e.name} for ${v}.`);
  update();
}
function healAlly(p, amt, revive, msg) {
  if (p.ko && !revive) return;
  const wasKo = p.ko;
  p.ko = false; p.hp = Math.min(p.max, p.hp + amt);
  pop(cardOf(p), '+' + amt, 'num heal'); Audio.sfx('heal');
  log(msg || (wasKo ? `${p.name} is back on their feet.` : `${p.name} recovers ${amt} HP.`));
  update();
}
function hitParty(e, p, mult, word) {
  let v = e.atk * mult * rnd(.9, 1.1) * (e.weak > 0 ? .6 : 1) - p.def;
  if (p.guard) v /= 2;
  if (B.shield > 0) v *= .65;
  v = Math.max(1, Math.round(v));
  p.hp = Math.max(0, p.hp - v);
  const c = cardOf(p); pop(c, word); pop(c, '-' + v, 'num'); shake(c);
  Audio.sfx('hurt');
  if (p.hp === 0) { p.ko = true; p.guard = false; }
  update();
  return v;
}

async function doJam(a) {
  B.mode = 'busy'; cmd('<p class="bt-who">Big finish</p>');
  const band = living(B.party);
  $('.bt-jam-panels').style.gridTemplateColumns = `repeat(${B.party.length}, 1fr)`;
  $('.bt-jam-panels').innerHTML = B.party.map((u, i) => `<div class="jp p${i + 1}">${u.ko ? '' : portraitOf(u)}</div>`).join('');
  $('.bt-jam-title').innerHTML = B.jam && B.jam !== 'bigband' ? `${esc(JAM_STYLES[B.jam].n)}<br><small>Jam Session</small>` : 'Jam<br>Session';
  $('.bt-jam').hidden = false; Audio.sfx('cymbal');
  await sleep(1500);
  if (!root) return;
  $('.bt-jam').hidden = true;
  cmd('<p class="bt-who">Hit the one!</p>');
  const q = await rhythm(true);
  if (!root) return;
  const m = RHY[q].mult; if (q === 'perfect') B.perfects++;
  B.groove = 0;
  const st = JAM_STYLES[B.jam] || JAM_STYLES.bigband;
  const total = band.reduce((s, p) => s + p.atk, 0);
  const words = { halcyon: ['HALCYON', 'AAAH', 'RESOLVE'], bigband: ['BWAAP!', 'KA-POW!', 'SHA-BOOM!'], ballad: ['MMMM...', 'SIGH', 'LA-LA'], bebop: ['BE!', 'BOP!', 'SKID!', 'DOO!'], bossa: ['SWAY', 'CHA!', 'SAMBA'] }[B.jam] || ['BWAAP!'];
  let n = 0;
  if (st.hits) {
    for (let i = 0; i < st.hits; i++) setTimeout(() => { const t = pick(living(B.enemies)); if (t && root) hitEnemy({ name: 'The band', atk: total * st.hit }, t, m, pick(words), 'tok'); }, i * 120);
    n = st.hits;
  } else {
    living(B.enemies).forEach((e, i) => setTimeout(() => root && hitEnemy({ name: 'The band', atk: total * st.hit }, e, m, pick(words), 'bang'), i * 220));
    n = living(B.enemies).length;
  }
  if (st.heal) B.party.forEach((p, i) => setTimeout(() => root && healAlly(p, Math.round(p.max * st.heal), !!st.revive), 400 + i * 120));
  if (st.shield) B.shield = st.shield;
  if (st.weaken) living(B.enemies).forEach(e => { e.weak = Math.max(e.weak || 0, st.weaken); });
  const lines = {
    bigband: 'The whole crew lands it together. The press itself seems to applaud.',
    ballad: 'A slow, aching ballad. The enemies stagger. The crew stands up a little straighter.',
    bebop: 'A blur of bebop, every note a punch. Somewhere, a saxophone weeps with joy.',
    bossa: 'A lazy bossa nova. The enemies sway along without meaning to, and their guard drops.',
    halcyon: 'Four bars of question and one of answer. For a moment, everything in the room is in tune.'
  };
  setTimeout(() => {
    if (!root) return;
    if (st.groove) B.groove = Math.min(100, st.groove);
    log(lines[B.jam] || lines.bigband); update(); endAction(200);
  }, 700 + n * 140);
}

async function enemyPhase() {
  B.mode = 'busy'; clearMarks(); cmd('<p class="bt-who">Their solo</p>');
  B.rubato = 0;
  let duetDone = false;
  const duo = B.enemies.filter(e => e.ai === 'duet' && !e.ko);
  if (duo.length === 2) {
    B.duet = (B.duet || 0) + 1;
    if (B.duetPending) {
      B.duetPending = false; duo.forEach(e => { e.tuning = false; });
      if (B.duetBroken) { log('The harmony falls apart. Sable glares at Vox. Vox glares at the floor.'); Audio.sfx('clam'); update(); await sleep(900); }
      else {
        duetDone = true;
        duo.forEach(e => cardOf(e)?.classList.add('acting'));
        log('HARMONY. Sable and Vox hit the same note, and the whole tunnel shakes.');
        Audio.sfx('cymbal');
        const power = { atk: (duo[0].atk + duo[1].atk) / 2 };
        living(B.party).forEach((p, i) => setTimeout(() => root && hitParty(power, p, .9, 'HARMONY!'), i * 140));
        await sleep(1100);
      }
      B.duetBroken = false;
      if (!root) return;
      if (checkEnd()) return;
    } else if (B.duet % 3 === 2) {
      B.duetPending = true; duo.forEach(e => { e.tuning = true; pop(cardOf(e), 'TUNING'); });
      log('Sable and Vox start tuning up together. Stun either one before their next turn!');
      Audio.sfx('zap'); update(); await sleep(1100);
    }
  }
  for (const e of B.enemies) {
    if (!root) return;
    if (e.ko) continue;
    if (duetDone && e.ai === 'duet') continue;
    if (checkEnd()) return;
    await sleep(650);
    if (!root) return;
    if (e.stun) {
      e.stun = false;
      if (e.drillPending) { e.drillPending = false; log('The drill seizes mid-spin and grinds to a stop. The Mantis staggers.'); pop(cardOf(e), 'JAMMED'); Audio.sfx('clam'); }
      else log(`${e.name} is still seeing stars. Turn skipped.`);
      update();
      if (e.ai === 'mantis') await mantisTick(e);
      continue;
    }
    clearMarks(); cardOf(e).classList.add('acting');
    const targets = living(B.party); if (!targets.length) break;
    if (e.ai === 'duet') {
      const partner = B.enemies.find(x => x.ai === 'duet' && x !== e && !x.ko);
      if (!partner && !e.solo) { e.solo = true; e.atk = Math.round(e.atk * 1.3); pop(cardOf(e), 'SOLO!'); log(`${e.name} plays on alone, faster and angrier.`); await sleep(700); }
      if (e.role === 'sable' && partner && partner.hp < partner.max * .45 && !e.sang) {
        e.sang = true; partner.hp = Math.min(partner.max, partner.hp + 60);
        pop(cardOf(partner), '+60', 'num heal'); Audio.sfx('heal');
        log('Sable sings a low, sweet line. Vox shakes his head and stands back up straighter. +60 HP.');
      } else if (e.role === 'sable') {
        const p = pick(targets); const v = hitParty(e, p, 1, 'LA!');
        log(`Sable hits a note so high it hurts. ${p.name} takes ${v}.`);
      } else {
        const p = pick(targets); const v = hitParty(e, p, 1.1, 'BWOOM!');
        log(`Vox swings his bass like a club at ${p.name}. ${v} damage.`);
      }
    } else if (e.ai === 'metronome') {
      e.pushed = false;
      e.count--;
      const words = ['', 'One', 'Two', 'Three', 'Four', 'Five'];
      if (e.count <= 0) {
        pop(cardOf(e), 'DOWNBEAT!'); Audio.sfx('cymbal');
        log('DOWNBEAT. Crane fires on the one, and every shot lands at once.');
        targets.forEach((p, i) => setTimeout(() => root && hitParty(e, p, 1.2, 'BANG!'), i * 140));
        e.count = e.hp < e.max * .5 ? 3 : 4;
        await sleep(800);
      } else if (e.count === 1) {
        pop(cardOf(e), 'ONE...'); Audio.sfx('tick');
        const p = pick(targets); const v = hitParty(e, p, .8, 'TICK');
        log(`"One." Crane clips ${p.name} for ${v}. Defend now, or hit him on the beat to throw his count.`);
      } else if (Math.random() < .5) {
        const p = pick(targets); const v = hitParty(e, p, 1.05, 'TICK');
        log(`"${words[e.count]}." Crane's shot finds ${p.name}, perfectly on time. ${v} damage.`);
      } else {
        const a2 = pick(targets), b2 = pick(targets);
        hitParty(e, a2, .62, 'TICK'); await sleep(260); if (!root) return; if (!b2.ko) hitParty(e, b2, .62, 'TOCK');
        log(`"${words[e.count]}." Two shots, tick and tock, at ${a2.name}${b2 !== a2 ? ' and ' + b2.name : ' twice'}.`);
      }
    } else if (e.ai === 'nocturne') {
      B.nround = (B.nround || 0) + 1;
      const fallen = B.enemies.find(x => x.accomp && x.ko);
      if (e.hp < e.max * .5 && !e.encored && fallen) {
        e.encored = true; fallen.ko = false; fallen.hp = Math.round(fallen.max * .5);
        pop(cardOf(fallen), 'ENCORE!'); Audio.sfx('cymbal');
        log(`"ENCORE!" Nocturne snaps his fingers and the ${fallen.name} sits back up, still in tune.`); update();
        await sleep(1000); continue;
      }
      if (B.nround % 2 === 0) {
        B.rubato = 1; pop(cardOf(e), 'RUBATO'); Audio.sfx('scratch');
        log('Nocturne bends the tempo, rubato. Your next beats will be harder to land.'); update(); await sleep(900); if (!root) return;
      }
      const r = Math.random();
      if (r < .3 && B.groove > 0) {
        const p = pick(targets); const stolen = Math.min(B.groove, 30); B.groove -= stolen;
        const v = hitParty(e, p, .9, 'MINE!');
        log(`Nocturne lifts ${stolen} Groove straight out of the band and hits ${p.name} with it. ${v} damage.`);
      } else if (r < .6) {
        log('Nocturne plays a nocturne in B-flat minor. It is beautiful. It is also very, very loud.');
        targets.forEach((p, i) => setTimeout(() => root && hitParty(e, p, .58, 'LAAA!'), i * 150));
        await sleep(500);
      } else {
        const p = pick(targets); const v = hitParty(e, p, 1.15, 'SFORZANDO!');
        log(`Nocturne's cane-sword flashes at ${p.name}. ${v} damage.`);
      }
    } else if (e.ai === 'sentinel') {
      if (!e.shielded && --e.shieldT <= 0) {
        e.shielded = true; pop(cardOf(e), 'SHIELD UP'); Audio.sfx('heal');
        log('The Sentinel rebuilds its shield. You need another Shock hit to break it.'); update(); await sleep(900); if (!root) return;
      }
      if (e.hp < e.max * .5 && !e.overclocked) {
        e.overclocked = true; e.atk += 5;
        pop(cardOf(e), 'OVERCLOCK'); Audio.sfx('zap');
        log('The Sentinel diverts power from the dome heaters into itself. Frost creeps over the glass. It hits harder now.');
        await sleep(1000); if (!root) return;
      }
      const helpers = living(B.enemies).filter(x => x !== e);
      if (!helpers.length && e.summons < 2) {
        e.summons++;
        const ne = { ...ENEMIES.labdrone, hp: 170, key: 'e' + B.enemies.length, ko: false };
        const L = partyAverageLevel() - 12; if (L > 0) { ne.hp += 20 * L; ne.atk += L; }
        ne.max = ne.hp;
        B.enemies.push(ne);
        const cardEl = el(card(ne, true));
        $('.bt-enemies').append(cardEl);
        cardEl.addEventListener('click', () => onCard(ne.key));
        log('"REINFORCEMENT REQUESTED." A lab drone drops from the dome frame.'); Audio.sfx('clank'); update();
      } else if (Math.random() < .3) {
        log('CONTAINMENT PULSE. A ring of white light rolls across the snow.');
        targets.forEach((p, i) => setTimeout(() => root && hitParty(e, p, .55, 'FZZT!'), i * 150));
        await sleep(500);
      } else {
        const p = pick(targets); const v = hitParty(e, p, 1.1, 'ZWAP!');
        log(`The Sentinel's beam finds ${p.name}. ${v} damage.`);
      }
    } else if (e.ai === 'mantis') {
      if (e.hp < e.max * .5 && !e.hurt) {
        e.hurt = true; e.atk += 4;
        pop(cardOf(e), 'OVERDRIVE'); Audio.sfx('zap');
        log("The Mantis's safety limiter snaps off with a bang. It's faster now, and it shifts stance every round.");
        await sleep(1000); if (!root) return;
      }
      if (e.stance === 'guard') {
        const p = pick(targets); const v = hitParty(e, p, .85, 'CLANG!');
        log(`The Mantis shoves ${p.name} back with an armoured foreleg. ${v} damage.`);
      } else if (e.stance === 'strike') {
        const two = [...targets].sort(() => Math.random() - .5).slice(0, 2);
        log(`The Mantis sweeps both scythes: ${two.map(p => p.name).join(' and ')}!`);
        two.forEach((p, i) => setTimeout(() => root && hitParty(e, p, .78, 'SHING!'), i * 160));
        await sleep(400);
      } else if (!e.drillPending) {
        e.drillPending = true; pop(cardOf(e), 'SPINNING UP'); Audio.sfx('zap');
        log('The tail drill screams up to speed. Stun the Mantis before its next turn, or brace!');
      } else {
        e.drillPending = false;
        log('DRILL BURST. The Mantis drives its drill into the floor and the whole cavern bucks.');
        Audio.sfx('bang');
        targets.forEach((p, i) => setTimeout(() => root && hitParty(e, p, .95, 'KRRRAK!'), i * 150));
        await sleep(700);
      }
      update();
      await sleep(500); if (!root) return;
      await mantisTick(e);
    } else if (e.ai === 'warden') {
      if (e.hp < e.max * .5 && !e.overclocked) {
        e.overclocked = true; e.atk += 5;
        pop(cardOf(e), 'OVERCLOCK'); Audio.sfx('zap');
        log('The Warden reroutes the relay power into itself. Its eye burns white. It hits harder now.');
      } else if (Math.random() < .3) {
        log('LOCKDOWN PULSE. Every light on the station strobes at once.');
        targets.forEach((p, i) => setTimeout(() => root && hitParty(e, p, .55, 'KZZT!'), i * 150));
      } else {
        const p = pick(targets); const v = hitParty(e, p, 1.15, 'BZOW!');
        log(`The Warden's targeting laser finds ${p.name}. ${v} damage.`);
      }
    } else if (e.ai === 'velvet') {
      if (e.hp < e.max * .45 && !e.healed) {
        e.healed = true; e.hp = Math.min(e.max, e.hp + 60);
        pop(cardOf(e), '+60', 'num heal'); Audio.sfx('heal');
        log('Velvet straightens her hat. Confidence restored, +60 HP.');
      } else if (Math.random() < .35) {
        log('Velvet throws a fan of counterfeit chits. They are, somehow, razor sharp.');
        targets.forEach((p, i) => setTimeout(() => root && hitParty(e, p, .62, 'FWIP!'), i * 150));
      } else {
        const p = pick(targets); const v = hitParty(e, p, 1, 'BLAM!');
        log(`Velvet's silver derringer tags ${p.name} for ${v}.`);
      }
    } else if (e.ai === 'hacker' && Math.random() < .45) {
      const p = pick(targets); const drain = Math.min(p.sp, 8); p.sp -= drain;
      const v = hitParty(e, p, .6, 'GLITCH');
      log(`${e.name} spikes ${p.name}'s comms: ${v} damage and ${drain} SP drained.`);
    } else {
      const p = pick(targets); const v = hitParty(e, p, 1, e.word || 'POW!');
      log(`${e.name} ${e.verb || 'throws a haymaker at'} ${p.name}. ${v} damage.`);
    }
    await sleep(600);
  }
  if (!root) return;
  clearMarks();
  if (checkEnd()) return;
  B.enemies.forEach(e => { if (e.jammed > 0) e.jammed--; if (e.weak > 0) e.weak--; });
  if (B.overclock > 0) B.overclock--;
  if (B.shield > 0) B.shield--;
  B.party.forEach(p => { if (!p.ko) p.sp = Math.min(p.spMax, p.sp + 4); });
  B.turn = 0; update();
  await sleep(400);
  nextActor();
}

function checkEnd() {
  if (!B || B.over) return true;
  if (!living(B.enemies).length) {
    B.over = true; B.mode = 'busy'; cmd('');
    Audio.sfx('cymbal');
    setTimeout(async () => {
      const res = { ...B };
      // collect skirmish spoils now; bounty money comes in the ledger later
      const rw = res.enc.bounty ? {} : (res.enc.reward || {});
      if (res.enc.flag) setFlag(res.enc.flag);
      if (res.xflag) setFlag(res.xflag);
      if (rw.chits) state.chits += rw.chits;
      Object.entries(rw.items || {}).forEach(([k, n]) => { state.items[k] = (state.items[k] || 0) + n; });
      // salvage from anything mechanical (bosses give more)
      rw.scrap = res.enemies.filter(e => e.machine).reduce((s, e) => s + (e.boss ? 5 : e.max > 150 ? 2 : 1), 0);
      state.scrap = (state.scrap || 0) + rw.scrap;
      await showResults(res, rw);
      cleanup();
      if (res.enc.bounty) return finishBounty(res);
      unblock(); backToWorld();
      if (res.enc.after) setTimeout(() => runDialogue(res.enc.after), 600);
      if (res.enc.job) setTimeout(() => { const line = completeJob({ paidInFight: true }); if (line) toast(line); Hud.refresh(); bus.emit('dialog-closed'); }, 500);
    }, 1200);
    return true;
  }
  if (!living(B.party).length) {
    B.over = true; B.mode = 'busy'; cmd('');
    Audio.sfx('scratch'); Audio.setMood('ship');
    setTimeout(showDefeat, 700);
    return true;
  }
  return false;
}

function showDefeat() {
  if (!root) return;
  const o = $('.bt-over');
  o.innerHTML = `<div class="panel bt-over-box">
    <p class="eyebrow">Session over</p><h3>The band missed its cue.</h3>
    <p>${B.enc.scale ? 'Brushes calls it a learning experience. Nobody feels like they learned anything.' : B.enc.bounty ? "The job's still out there, and Tam is already blaming Rook's shoes." : 'You limp away. You can try them again any time.'}</p>
    <div class="bt-over-btns"><button class="btn primary" type="button" data-retry>Take it from the top</button><button class="btn ghost" type="button" data-leave>Back to the ship</button></div>
  </div>`;
  o.hidden = false;
  o.querySelector('[data-retry]').addEventListener('click', () => { Audio.sfx('confirm'); startBattle(B.id, { retry: true, flag: B.xflag, retreatTo: B.retreatTo }); });
  o.querySelector('[data-leave]').addEventListener('click', () => { Audio.sfx('back'); cleanup(); unblock(); travel('ship', 'lounge'); });
  if (!B.enc.bounty) {
    o.querySelector('[data-leave]').textContent = 'Retreat';
    o.querySelector('[data-leave]').replaceWith(o.querySelector('[data-leave]').cloneNode(true));
    o.querySelector('[data-leave]').addEventListener('click', () => { Audio.sfx('back'); cleanup(); unblock(); if (B.retreatTo) travel(state.location, B.retreatTo); else backToWorld(); });
  }
  o.querySelector('[data-retry]').focus({ preventScroll: true });
}

/* ---------------- victory: XP and level-ups ---------------- */
function showResults(res, rw) {
  return new Promise(resolve => {
    const total = Math.round(res.enemies.reduce((s, e) => s + (e.xp || 15), 0) * (res.enc.xpRate || 1));
    const inBattle = res.party.map(p => p.key);
    const rows = CREW_KEYS.filter(k => k === 'captain' || available(k)).map(k => {
      const share = inBattle.includes(k) ? total : Math.round(total / 2);
      const before = level(k), picksBefore = TIERS.filter(t => before >= t).length;
      const gained = addXp(k, share);
      const after = level(k), newPicks = TIERS.filter(t => after >= t).length - picksBefore;
      const L = state.levels[k];
      return { k, share, before, after, gained, newPicks, pct: L.lv >= 30 ? 100 : Math.round(L.xp / xpToNext(L.lv) * 100), bench: !inBattle.includes(k) };
    });
    const name = k => k === 'captain' ? state.player.name : CREW[k].short;
    const items = Object.entries(rw.items || {}).map(([k, n]) => `${ITEMS[k]?.n || k} ×${n}`);
    const ups = rows.filter(r => r.gained);
    if (ups.length) Audio.sfx('save');
    const o = el(`<div class="bt-results"><div class="panel bt-res-box">
      <p class="eyebrow">Victory</p>
      <h3>+${total} XP${rw.chits ? ` · ₡ ${rw.chits.toLocaleString('en-AU')}` : ''}${rw.scrap ? ` · ${rw.scrap} scrap` : ''}</h3>
      ${items.length ? `<p class="res-items">Found: ${esc(items.join(', '))}</p>` : ''}
      <ul class="res-list">${rows.map(r => `<li class="${r.gained ? 'up' : ''}">
        <b>${esc(name(r.k))}</b><span class="res-lv">Lv ${r.after}</span>
        <i class="bar xp"><i style="width:${r.pct}%"></i></i>
        <em>${r.gained ? `LEVEL UP${r.gained > 1 ? ' ×' + r.gained : ''}!` : `+${r.share} XP${r.bench ? ' (bench)' : ''}`}</em>
        ${r.newPicks ? '<small class="res-skill">New skill to learn: Menu, Crew</small>' : ''}
      </li>`).join('')}</ul>
      <button class="btn primary" type="button" data-ok>Continue</button>
    </div></div>`);
    root.append(o);
    const ok = o.querySelector('[data-ok]');
    ok.focus({ preventScroll: true });
    ok.addEventListener('click', async () => {
      Audio.sfx('confirm'); o.remove();
      if (rows.some(r => r.newPicks)) await tip('skills', root);
      resolve();
    });
    if (rows.some(r => r.newPicks)) setTimeout(() => toast('New skills to learn: Menu, Crew'), 400);
  });
}

function backToWorld() {
  Audio.setMood((MAPS[state.location] || MAPS.ship).music);
  Hud.refresh();
  bus.emit('dialog-closed');
}

/* ---------------- story fights: aftermath and payday ---------------- */
const AFTER = {
  velvet: { cut: 'victory', ending: 'ending', title: 'Track 01 · Counterfeit Swing' },
  ghost: { cut: 'k17_victory', choice: 'k17_choice', ending: 'k17_ending', title: 'Track 02 · Ghost Frequency' },
  courier: { cut: 'duet_victory', choice: 'case_choice', ending: 'courier_ending', title: 'Track 03 · The Missing Courier' },
  nocturne: { cut: 'nocturne_victory', choice: 'halcyon_choice', ending: 'nocturne_ending', title: 'Track 06 · Mister Nocturne' },
  proto: { cut: 'sentinel_victory', choice: 'proto_choice', ending: 'proto_ending', title: 'Track 05 · Runaway Prototype' },
  mantis: { cut: 'mantis_victory', choice: 'mantis_choice', ending: 'mantis_ending', title: 'Track 04 · Iron Mantis' },
  metronome: { cut: 'metronome_victory', choice: 'hale_choice', ending: 'conductor_ending', title: 'Track 07 · The Conductor' }
};

async function finishBounty(res) {
  res.id = res.enc.bounty;          // from here on, the bounty rather than the encounter
  const a = AFTER[res.id];
  await playCut(a.cut, { restoreMood: false });
  if (a.choice) await runDialogue(a.choice);
  showLedger(res);
}

function ledgerFor(res) {
  const b = BOUNTIES.find(x => x.id === res.id) || { name: 'Bounty', reward: 0 };
  const style = [`Style bonus: ${res.perfects} ${res.perfects === 1 ? 'hit' : 'hits'} on the beat`, res.perfects * 150];
  if (res.id === 'metronome') {
    const f = state.flags;
    return {
      outcome: 'Silas Crane delivered alive. The Hi-Hat is off the board.',
      extra: f.hale_ally ? 'Director Hale is aboard the Hi-Hat' : f.hale_office ? 'Director Hale is in Bounty Office custody' : 'Director Hale walked away',
      items: [
        ['Bounty: Silas Crane, the Metronome, alive (Bounty Office)', 48000],
        ...(f.hale_office ? [['Bounty Office bonus: Director Hale, in custody', 15000]] : []),
        ...(f.hale_ally ? [["Hale's down payment: the Blue Note docking codes", 0]] : []),
        ...(f.hale_free ? [["Hale's goodbye: she paid for her own lobby", 3600]] : []),
        style,
        ['Fuel to Cygnus, the long way round', -1800],
        ["Helix lobby (the glass, the fountain, the receptionist's nerves)", -3600],
        ["Collectors' hospital bills (the Office insists)", -2200]
      ]
    };
  }
  if (res.id === 'nocturne') {
    const f = state.flags;
    return {
      outcome: 'Mister Nocturne delivered alive. Forty-one instruments recovered.',
      extra: f.piano_sol ? 'The Halcyon went home to Old Sol' : f.piano_kept ? 'The Halcyon is aboard the Hi-Hat' : 'The Halcyon was sold',
      items: [
        [`Bounty: ${b.name}, alive`, b.reward],
        ...(f.piano_sold ? [['Sold the Halcyon to an anonymous collector', 20000]] : []),
        ...(f.piano_sol ? [["Old Sol insists on paying you. It's mostly coins.", 380]] : []),
        style,
        ['Fuel to Titan and back', -5400],
        ['Lyceum stage repairs (the trapdoor, the curtain, the chandelier)', -3100],
        ['Tickets you did not use', -240]
      ]
    };
  }
  if (res.id === 'proto') {
    const f = state.flags;
    return {
      outcome: f.proto_returned ? 'Prototype L-7 recovered for Nyx Applied Sciences.' : f.lyra_joined ? 'Prototype L-7 not recovered. She joined the Hi-Hat instead.' : 'Prototype L-7 not recovered. She is somewhere in the network, free.',
      extra: 'The Sentinel decommissioned',
      items: [
        ...(f.proto_returned ? [[`Bounty: ${b.name}, recovered`, b.reward]] : [['Nyx Applied Sciences: target not recovered', 0], ['Nyx search fee (for your trouble)', 4000]]),
        ...(f.lyra_joined ? [["A research grant Lyra 'found' in Nyx's accounts", 9000]] : []),
        ...(f.proto_free ? [["Lyra's goodbye present: she cleared your fuel bill", 4800]] : []),
        style,
        ['Fuel to Nyx and back', -4800],
        ['Cold-weather gear (rented, returned damp)', -600],
        ...(f.proto_returned ? [['Brushes is sad. Emergency noodles.', -45]] : [])
      ].filter(it => it[1] !== 0 || /not recovered/.test(it[0]))
    };
  }
  if (res.id === 'mantis') {
    const f = state.flags;
    return {
      outcome: f.mantis_spared ? 'Iron Mantis disabled and handed back to its builder.' : f.mantis_core ? 'Iron Mantis disabled; its control core logged as evidence.' : 'Iron Mantis disabled and scrapped.',
      extra: 'Dagny Ferro rescued',
      items: [
        [`Bounty: ${b.name}, disabled`, b.reward],
        ...(f.mantis_scrapped ? [['Your cut of the scrap, sold by the kilo', 6500]] : []),
        ...(f.mantis_core ? [['Bounty Office: evidence of the Conductor\'s signal', 5000]] : []),
        ...(f.mantis_spared ? [["Ferro's repair parts (you offered)", -2800]] : []),
        style,
        ['Fuel to Targon and back', -4400],
        ['Lift cable you definitely did not snap', -1200],
        ['Air filters (the dust gets everywhere)', -310]
      ]
    };
  }
  if (res.id === 'courier') {
    const f = state.flags;
    const core = f.core_office ? ['Bounty Office evidence reward', 3000]
      : f.core_helix ? ['Helix Salvage "finder\'s fee"', 5000]
      : f.core_sold ? ['Sold the tuning core to Kessler', 6000] : null;
    return {
      outcome: 'Wren Castillo found and returned home.',
      extra: f.core_kept ? 'Kept: Helix tuning core' : f.core_office ? 'Core logged as evidence' : f.core_helix ? 'Core handed to Helix' : 'Core sold',
      items: [
        [`Bounty: ${b.name}`, b.reward],
        ...(core ? [core] : []),
        style,
        ['Fuel to Vesta and back', -3600],
        ['Market stall you knocked over', -420],
        ['Noodles for the crew (Ada insisted)', 0]
      ].filter(it => it[1] !== 0)
    };
  }
  if (res.id === 'ghost') {
    const f = state.flags, prot = f.juno_protected;
    return {
      outcome: prot ? 'Survivor protected. Helix exposed.' : 'Data and survivor handed to Helix Salvage.',
      items: [
        prot ? ['Helix Salvage pays half (and hates you)', 12000] : [`Contract: ${b.name}`, b.reward],
        ...(prot ? [['Bounty Office whistleblower bonus', 9000]] : []),
        ...(f.cryo_found ? [['Four crew found alive in cryo', 2500]] : []),
        style,
        ['Fuel for the long jump past the belt', -5800],
        ['Drone damage repairs', -1900],
        ...(prot ? [] : [["Rhea's bar tab (she isn't speaking to you)", -300]])
      ],
      extra: 'Recovered: Relay log data'
    };
  }
  return {
    outcome: 'Velvet Moreau delivered alive.',
    items: [
      [`Bounty: ${b.name}, alive`, b.reward], style,
      [res.ricochet ? 'Warehouse roof (ricochet damage)' : 'Warehouse crate damage', res.ricochet ? -3850 : -920],
      ['Fuel, at Ganymede prices', -4120],
      ['Hull patch', -2460],
      ...(res.wrench ? [['Replacement wrench (bent)', -240]] : []),
      ['New drum brushes for Brushes', -115],
      ['Instant noodles, bulk', -89]
    ]
  };
}

function showLedger(res) {
  Audio.setMood('victory');
  const a = AFTER[res.id];
  const L = ledgerFor(res);
  if (state.flags.up_engine) L.items = L.items.map(([t, v]) => /^Fuel/.test(t) ? [t + ' (big engine: half price)', Math.round(v / 2)] : [t, v]);
  const net = L.items.reduce((s, i) => s + i[1], 0);
  state.chits += net;
  const fmt = n => Math.abs(n).toLocaleString('en-AU');
  const screen = el(`<div class="ledger">
    <div class="ledger-inner">
      <div class="receipt">
        <p class="eyebrow">Mission complete</p>
        <h2>${esc(a.title)}</h2>
        <p class="sub">Outcome: ${esc(L.outcome)}${L.extra ? ` · ${esc(L.extra)}` : ''}</p>
        ${L.items.map((it, i) => `<div class="lrow ${it[1] < 0 ? 'neg' : ''}" style="animation-delay:${i * .12}s"><span>${esc(it[0])}</span><span>${it[1] < 0 ? '−' : ''}₡ ${fmt(it[1])}</span></div>`).join('')}
        <div class="lrow total" style="animation-delay:${L.items.length * .12}s"><span>Take-home</span><span>₡ ${fmt(net)}</span></div>
      </div>
      <button class="btn primary big" type="button" data-home>Head home</button>
    </div>
  </div>`);
  sceneLayer().append(screen);
  screen.querySelector('[data-home]').focus({ preventScroll: true });
  screen.querySelector('[data-home]').addEventListener('click', () => {
    Audio.sfx('confirm');
    screen.remove();
    playCut(a.ending, { restoreMood: false }).then(() => {
      state.bounties[res.id] = 'done';
      setFlag(res.id + '_done');
      if (res.id === 'velvet' && !state.flags.rep_init) { addRep({ office: 2 }); setFlag('rep_init'); }
      unblock();
      travel('ship', 'lounge');
      const ok = saveGame();
      const label = { velvet: 'Track 01', ghost: 'Track 02', courier: 'Track 03', mantis: 'Track 04', proto: 'Track 05', nocturne: 'Track 06', metronome: 'Track 07' }[res.id] || 'Track';
      setTimeout(() => { toast(ok ? `${label} complete. Game saved.` : `${label} complete.`); Hud.refresh(); }, 800);
    });
  });
}
