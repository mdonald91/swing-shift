// Turn-based combat with on-the-beat timing, plus the payday ledger afterwards.
import { PARTY, CAPTAIN_SKILLS, SKILLS, ITEMS, ENCOUNTERS } from '../data/battles.js';
import { CREW } from '../data/crew.js';
import { BOUNTIES } from '../data/bounties.js';
import { temperament } from '../data/appearance.js';
import { backdrop } from '../art/backdrops.js';
import { playerPortrait, npcPortrait } from '../art/portrait.js';
import { state, setFlag, saveGame, addRep } from '../state.js';
import { crewStats, startingGroove, beatWindowBonus } from '../systems/party.js';
import { block, unblock } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { el, esc, sceneLayer, toast, travel } from './ui.js';
import { playCut } from './cutscene.js';
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
  const temp = temperament(state.player);
  const party = [
    { key: 'captain', id: 'player', name: state.player.name, ...crewStats('captain'), skills: CAPTAIN_SKILLS[temp] },
    ...['rook', 'tam', 'brushes'].map(k => ({ key: k, id: k, name: CREW[k].short, ...crewStats(k) }))
  ].map(u => ({ ...u, max: u.hp, spMax: u.sp, sp: 14, ko: false, guard: false }));
  const enemies = enc.enemies.map((e, i) => ({ ...e, key: 'e' + i, max: e.hp, ko: false }));
  B = { id, enc, party, enemies, groove: Math.min(100, startingGroove()), turn: 0, overclock: 0, perfects: 0, ricochet: 0, wrench: 0, over: false, mode: 'busy', pending: null };

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
  log(id === 'velvet' ? 'Velvet tips her hat. Two goons crack their knuckles in 4/4 time.' : 'Here they come.');
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
    <span class="bt-info"><b class="bt-nm">${esc(u.name)}</b>
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
    if (u.guard) tags.push('Guard'); if (u.stun) tags.push('Stunned'); if (u.jammed > 0) tags.push('Jammed'); if (u.weak > 0) tags.push('Weakened');
    if (!u.boss && u.spMax && B.overclock > 0 && !u.ko) tags.push('Overclocked');
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
      return `<button type="button" data-s="${k}" ${a.sp < s.cost ? 'disabled' : ''}>${esc(s.n)} <small>${s.cost} SP<span class="d"> · ${esc(s.d)}</span></small></button>`;
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
    log(B.enc.noRun || 'You slip away.');
    Audio.sfx('back');
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
    hitEnemy(a, target, m, a.attack.word, a.attack.sfx);
  } else {
    a.sp -= act.sk.cost;
    wait += applySkill(a, act.sk, target, m);
  }
  update();
  endAction(wait);
}

function applySkill(a, sk, target, m) {
  const targets = sk.tgt === 'enemy' || sk.tgt === 'ally' ? [target]
    : sk.tgt === 'enemies' ? living(B.enemies)
    : sk.tgt === 'party' ? living(B.party) : [];
  if (sk.tag === 'ricochet') B.ricochet++;
  if (sk.buff) {
    B.overclock = sk.buff + (m >= 1.5 ? 1 : 0);
    Audio.sfx('zap');
    log(`${a.name} cranks the ship's amp to eleven. The crew hits harder for ${B.overclock} rounds.`);
  }
  const notes = [];
  targets.forEach((t, i) => setTimeout(() => {
    if (!root) return;
    if (B.enemies.includes(t)) {
      if (t.ko) return;
      if (sk.hit) {
        let mult = sk.hit * m;
        if (sk.exec && t.hp < t.max * .4) mult *= 2;
        hitEnemy(a, t, mult, sk.word || a.attack.word, sk.sfx || 'bang');
      } else {
        if (sk.word) pop(cardOf(t), sk.word);
        if (sk.sfx) Audio.sfx(sk.sfx);
      }
      if (!t.ko) {
        if (sk.stun && Math.random() < sk.stun * Math.min(m, 1.4) * (t.boss ? .5 : 1)) { t.stun = true; notes.push(`${t.name} is stunned`); }
        if (sk.jam) { t.jammed = sk.jam; notes.push(`${t.name} takes extra damage`); }
        if (sk.weaken) { t.weak = sk.weaken; notes.push(`${t.name} is weakened`); }
      }
    } else {
      if (sk.heal) healAlly(t, Math.round(sk.heal * Math.min(m, 1.3)), sk.revive);
      if (sk.sp && !t.ko) t.sp = Math.min(t.spMax, t.sp + sk.sp);
    }
    update();
    if (i === targets.length - 1 && notes.length) log(notes.slice(0, 2).join('. ') + (notes.length > 2 ? '...' : '.'));
  }, i * 170));
  return targets.length * 170;
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

function hitEnemy(a, e, mult, word, snd) {
  if (!e || e.ko) { e = living(B.enemies)[0]; if (!e) return; }
  let v = a.atk * mult * rnd(.9, 1.1) * (B.overclock > 0 ? 1.3 : 1) * (e.jammed > 0 ? 1.25 : 1) - e.def;
  v = Math.max(1, Math.round(v));
  e.hp = Math.max(0, e.hp - v);
  const c = cardOf(e); pop(c, word); pop(c, '-' + v, 'num'); shake(c);
  Audio.sfx(snd);
  if (e.hp === 0) { e.ko = true; e.stun = false; e.jammed = 0; log(e.boss ? 'Velvet hits the deck. Her hat lands a beat later.' : `${e.name} is down for the count.`); }
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
  for (const e of B.enemies) {
    if (!root) return;
    if (e.ko) continue;
    if (checkEnd()) return;
    await sleep(650);
    if (!root) return;
    if (e.stun) { e.stun = false; log(`${e.name} is still seeing stars. Turn skipped.`); update(); continue; }
    clearMarks(); cardOf(e).classList.add('acting');
    const targets = living(B.party); if (!targets.length) break;
    if (e.boss) {
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
    } else {
      const p = pick(targets); const v = hitParty(e, p, 1, 'POW!');
      log(`${e.name} throws a haymaker at ${p.name}. ${v} damage.`);
    }
    await sleep(600);
  }
  if (!root) return;
  clearMarks();
  if (checkEnd()) return;
  B.enemies.forEach(e => { if (e.jammed > 0) e.jammed--; if (e.weak > 0) e.weak--; });
  if (B.overclock > 0) B.overclock--;
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
    setTimeout(() => { const res = { ...B }; cleanup(); playCut('victory', { restoreMood: false }).then(() => showLedger(res)); }, 1200);
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
    <p>Velvet is still out there, and Tam is already blaming Rook's shoes.</p>
    <div class="bt-over-btns"><button class="btn primary" type="button" data-retry>Take it from the top</button><button class="btn ghost" type="button" data-leave>Back to the ship</button></div>
  </div>`;
  o.hidden = false;
  o.querySelector('[data-retry]').addEventListener('click', () => { Audio.sfx('confirm'); startBattle(B.id, { retry: true }); });
  o.querySelector('[data-leave]').addEventListener('click', () => { Audio.sfx('back'); cleanup(); unblock(); travel('ship', 'lounge'); });
  o.querySelector('[data-retry]').focus({ preventScroll: true });
}

/* ---------------- payday ---------------- */
function showLedger(res) {
  Audio.setMood('victory');
  const b = BOUNTIES.find(x => x.id === res.id) || { name: 'Bounty', reward: 0 };
  const items = [
    [`Bounty: ${b.name}, alive`, b.reward],
    [`Style bonus: ${res.perfects} hits on the beat`, res.perfects * 150],
    [res.ricochet ? 'Warehouse roof (ricochet damage)' : 'Warehouse crate damage', res.ricochet ? -3850 : -920],
    ['Fuel, at Ganymede prices', -4120],
    ['Hull patch', -2460],
    ...(res.wrench ? [['Replacement wrench (bent)', -240]] : []),
    ['New drum brushes for Brushes', -115],
    ['Instant noodles, bulk', -89]
  ];
  const net = items.reduce((s, i) => s + i[1], 0);
  state.chits += net;
  const fmt = n => Math.abs(n).toLocaleString('en-AU');
  const screen = el(`<div class="ledger">
    <div class="ledger-inner">
      <div class="receipt">
        <p class="eyebrow">Payday ledger</p>
        <h2>Track 01 · Counterfeit Swing</h2>
        <p class="sub">Bounty office, Ganymede relay · amounts in chits</p>
        ${items.map((it, i) => `<div class="lrow ${it[1] < 0 ? 'neg' : ''}" style="animation-delay:${i * .12}s"><span>${esc(it[0])}</span><span>${it[1] < 0 ? '−' : ''}₡ ${fmt(it[1])}</span></div>`).join('')}
        <div class="lrow total" style="animation-delay:${items.length * .12}s"><span>Take-home</span><span>₡ ${fmt(net)}</span></div>
      </div>
      <button class="btn primary big" type="button" data-home>Head home</button>
    </div>
  </div>`);
  sceneLayer().append(screen);
  screen.querySelector('[data-home]').focus({ preventScroll: true });
  screen.querySelector('[data-home]').addEventListener('click', () => {
    Audio.sfx('confirm');
    screen.remove();
    playCut('ending', { restoreMood: false }).then(() => {
      state.bounties[res.id] = 'done';
      setFlag(res.id + '_done');
      if (!state.flags.rep_init) { addRep({ office: 2 }); setFlag('rep_init'); }
      unblock();
      travel('ship', 'lounge');
      const ok = saveGame();
      setTimeout(() => { toast(ok ? 'Track 01 complete. Game saved.' : 'Track 01 complete.'); Hud.refresh(); }, 800);
    });
  });
}
