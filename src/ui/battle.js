// Turn-based combat with on-the-beat timing, plus the payday ledger afterwards.
import { SKILLS, ITEMS, ENCOUNTERS, TYPES, TIERS, xpToNext } from '../data/battles.js';
import { CREW } from '../data/crew.js';
import { BOUNTIES } from '../data/bounties.js';
import { backdrop } from '../art/backdrops.js';
import { playerPortrait, npcPortrait } from '../art/portrait.js';
import { state, setFlag, saveGame, addRep } from '../state.js';
import { crewStats, startingGroove, beatWindowBonus, activeParty, addXp, available, level, partyAverageLevel, CREW_KEYS } from '../systems/party.js';
import { MAPS } from '../data/maps.js';
import { bus } from '../bus.js';
import { block, unblock } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { el, esc, sceneLayer, toast, travel } from './ui.js';
import { playCut } from './cutscene.js';
import { runDialogue } from './dialog.js';
import { Hud } from './hud.js';

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

export function startBattle(id, { retry = false } = {}) {
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
  B = { id, enc, party, enemies, groove: Math.min(100, startingGroove()), turn: 0, overclock: 0, shield: 0, perfects: 0, ricochet: 0, wrench: 0, over: false, mode: 'busy', pending: null };

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
  root.addEventListener('pointerdown', () => rhythmPress());
  document.addEventListener('keydown', onKey);
  update();
  log(enc.intro || 'Here they come.');
  raf = requestAnimationFrame(frame);
  setTimeout(nextActor, 900);
}

function cleanup() {
  cancelAnimationFrame(raf); raf = 0;
  document.removeEventListener('keydown', onKey);
  if (root) root.remove();
  root = null; R = null;
}

function onKey(e) {
  if ((e.key === ' ' || e.key === 'Enter') && R) { e.preventDefault(); rhythmPress(); }
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
      ${enemy && (u.weakTo || u.resists) ? `<span class="bt-weak">${(u.weakTo || []).map(t => `<i class="w">${TYPES[t]}</i>`).join('')}${(u.resists || []).map(t => `<i class="r">${TYPES[t]}</i>`).join('')}</span>` : ''}
      <span class="bt-stat"><span>HP</span><i class="bar hp"><i></i></i><em class="hpn"></em></span>
      ${enemy ? '' : '<span class="bt-stat"><span>SP</span><i class="bar sp"><i></i></i><em class="spn"></em></span>'}
      <span class="bt-tags"></span></span></button>`;
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
    if (u.spMax && B.overclock > 0 && !u.ko) tags.push('Overclocked');
    if (u.spMax && B.shield > 0 && !u.ko) tags.push('Shielded');
    c.querySelector('.bt-tags').innerHTML = tags.map(t => `<em>${t}</em>`).join('');
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
    ${B.groove >= 100 ? '<button type="button" class="jam" data-c="jam">Jam Session</button>' : ''}`);
  $('.bt-cmd button')?.focus({ preventScroll: true });
  root.querySelectorAll('.bt-cmd [data-c]').forEach(b => b.addEventListener('click', () => { Audio.sfx('tick'); menuPick(a, b.dataset.c); }));
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
      `<button type="button" data-i="${k}" ${ITEMS[k].tgt === 'downed' && !anyDown ? 'disabled' : ''}>${esc(ITEMS[k].n)} ×${n} <small>${esc(ITEMS[k].d)}</small></button>`).join('') + backButton(a));
    root.querySelectorAll('.bt-cmd [data-i]').forEach(b => b.addEventListener('click', () => {
      Audio.sfx('tick'); choose(a, { kind: 'item', key: b.dataset.i }, ITEMS[b.dataset.i].tgt);
    }));
    wireBack(a);
  } else if (c === 'guard') {
    a.guard = true; a.sp = Math.min(a.spMax, a.sp + 6);
    log(`${a.name} lays out a bar and steadies their nerve.`); update(); endAction(300);
  } else if (c === 'run') {
    if (B.enc.noRun) { log(B.enc.noRun); Audio.sfx('back'); return; }
    Audio.sfx('back'); cleanup(); unblock(); backToWorld(); toast(B.enc.scale ? 'Rehearsal over. Brushes looks disappointed.' : 'You slip away. They will still be there.');
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
function rhythm(wide) {
  return new Promise(res => {
    const target = Math.ceil(Audio.beatPos() + .8);
    R = { target, res, wide, armedAt: performance.now() + 140, done: false };
    const ring = $('.ring');
    ring.classList.remove('perfect');
    $('.ring-label').textContent = 'Tap on the beat';
    ring.hidden = false;
  });
}
function rhythmPress() {
  if (!R || R.done || performance.now() < R.armedAt) return;
  const d = Math.abs(Audio.beatPos() - R.target);
  const p = (R.wide ? .28 : .2) + beatWindowBonus();
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
    if (left < -.42) finishRhythm('late');
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
  v = Math.max(1, Math.round(v));
  e.hp = Math.max(0, e.hp - v);
  const c = cardOf(e); pop(c, weak ? 'WEAK!' : resist ? 'RESIST' : word, weak ? 'weak' : resist ? 'resist' : ''); pop(c, '-' + v, 'num'); shake(c);
  if (weak) B.groove = Math.min(100, B.groove + 6);
  Audio.sfx(snd);
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
  $('.bt-jam').hidden = false; Audio.sfx('cymbal');
  await sleep(1500);
  if (!root) return;
  $('.bt-jam').hidden = true;
  cmd('<p class="bt-who">Hit the one!</p>');
  const q = await rhythm(true);
  if (!root) return;
  const m = RHY[q].mult; if (q === 'perfect') B.perfects++;
  B.groove = 0;
  const power = band.reduce((s, p) => s + p.atk, 0) * .7;
  living(B.enemies).forEach((e, i) => setTimeout(() => hitEnemy({ name: 'The band', atk: power }, e, m, pick(['BWAAP!', 'KA-POW!', 'SHA-BOOM!']), 'bang'), i * 220));
  setTimeout(() => { if (root) { log('The whole crew lands it together. The press itself seems to applaud.'); endAction(200); } }, 900);
}

async function enemyPhase() {
  B.mode = 'busy'; clearMarks(); cmd('<p class="bt-who">Their solo</p>');
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
    if (e.stun) { e.stun = false; log(`${e.name} is still seeing stars. Turn skipped.`); update(); continue; }
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
      if (rw.chits) state.chits += rw.chits;
      Object.entries(rw.items || {}).forEach(([k, n]) => { state.items[k] = (state.items[k] || 0) + n; });
      await showResults(res, rw);
      cleanup();
      if (res.enc.bounty) return finishBounty(res);
      unblock(); backToWorld();
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
  o.querySelector('[data-retry]').addEventListener('click', () => { Audio.sfx('confirm'); startBattle(B.id, { retry: true }); });
  o.querySelector('[data-leave]').addEventListener('click', () => { Audio.sfx('back'); cleanup(); unblock(); travel('ship', 'lounge'); });
  if (!B.enc.bounty) {
    o.querySelector('[data-leave]').textContent = 'Retreat';
    o.querySelector('[data-leave]').replaceWith(o.querySelector('[data-leave]').cloneNode(true));
    o.querySelector('[data-leave]').addEventListener('click', () => { Audio.sfx('back'); cleanup(); unblock(); backToWorld(); });
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
      <h3>+${total} XP${rw.chits ? ` · ₡ ${rw.chits.toLocaleString('en-AU')}` : ''}</h3>
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
    ok.addEventListener('click', () => { Audio.sfx('confirm'); o.remove(); resolve(); });
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
  courier: { cut: 'duet_victory', choice: 'case_choice', ending: 'courier_ending', title: 'Track 03 · The Missing Courier' }
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
      const label = { velvet: 'Track 01', ghost: 'Track 02', courier: 'Track 03' }[res.id] || 'Track';
      setTimeout(() => { toast(ok ? `${label} complete. Game saved.` : `${label} complete.`); Hud.refresh(); }, 800);
    });
  });
}
