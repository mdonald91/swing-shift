// Conversation box: portraits, typewriter text, numbered choices.
import { DIALOGUE } from '../data/dialogue.js';
import { CREW } from '../data/crew.js';
import { temperament } from '../data/appearance.js';
import { playerPortrait, npcPortrait } from '../art/portrait.js';
import { state, settings, flag, setFlag, saveGame, addRep } from '../state.js';
import { FACTIONS } from '../data/shop.js';
import { BOND_HP, BOND_ATK } from '../systems/party.js';
import { block, unblock } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { bus } from '../bus.js';
import { el, esc, dialogLayer, toast, travel } from './ui.js';
import { Hud } from './hud.js';
import { playCut } from './cutscene.js';
import { startBattle } from './battle.js';
import { openShop } from './menus.js';
import { busk } from './busk.js';

// Things a conversation can trigger. Anything that changes scene waits until the box closes.
let after = null;
const ACTIONS = {
  save() { const ok = saveGame(); Audio.sfx('save'); toast(ok ? `Saved to slot ${state.slot + 1}` : "Couldn't save: this browser is blocking storage"); },
  objective() { Hud.refresh(); },
  depart() { after = () => playCut('depart', { restoreMood: false }).then(() => travel('docks')); },
  toDocks() { after = () => travel('docks'); },
  toShip() { after = () => travel('ship', 'cockpit'); },
  confront() { after = () => playCut('confront', { restoreMood: false }).then(() => startBattle('velvet')); },
  shop(id) { after = () => openShop(id); },
  busk() { after = () => busk(); },
  toCygnus() { after = () => travel('cygnus'); },
  helixOffer() {
    after = () => playCut('helix_offer').then(() => {
      setFlag('ghost_offered');
      showRep(addRep({ helix: 1 }));
      toast('New contract on your bounty board: Ghost Frequency');
      Hud.refresh();
    });
  },
  departVesta() { after = () => playCut('vesta_depart', { restoreMood: false }).then(() => travel('vesta')); },
  toVesta() { after = () => travel('vesta'); },
  tail() { after = () => bus.emit('tail-start'); },
  courierFound() { after = () => playCut('courier_found', { restoreMood: false }).then(() => startBattle('duet')); },
  fightScavs() { after = () => startBattle('scavs'); },
  fight(id) { after = () => startBattle(id); },
  vestaChest() { state.chits += 500; state.items.curry = (state.items.curry || 0) + 2; Audio.sfx('save'); Hud.refresh(); },
  departK17() { after = () => playCut('k17_depart', { restoreMood: false }).then(() => { joinRhea(); travel('relay'); }); },
  toRelay() { after = () => travel('relay'); },
  power() { Audio.sfx('save'); },
  keycard() { Audio.sfx('confirm'); toast('Got the comms hub keycard'); },
  cryo() { Audio.sfx('heal'); toast('Found the missing crew, alive (bonus)'); },
  fightDrones() { after = () => startBattle('drones'); },
  warden() { after = () => playCut('k17_warden', { restoreMood: false }).then(() => startBattle('warden')); },
  protect() {
    if (flag('rhea_joined')) { state.bonds.rhea = Math.min(3, (state.bonds.rhea || 0) + 1); toast(`Bond with Rhea deepened: +${BOND_HP} HP, +${BOND_ATK} ATK`); }
  },
  handOver() {
    if (flag('rhea_joined')) { state.flags.rhea_joined = false; state.party = state.party.filter(x => x !== 'rhea'); toast('Rhea has left the crew'); }
  },
  drink() {
    if (state.chits < 40) { toast('Not enough chits'); return; }
    state.chits -= 40; Hud.refresh();
    toast('The Blue Seventh tastes like cold brass and good decisions.');
  },
  song() {
    state.flags.song_style = flag('song_bop') ? 'bop' : 'ballad';
    setFlag('song_done');
    toast("New on the jukebox: Brushes' song");
  },
  bond(id) {
    state.bonds[id] = Math.min(3, (state.bonds[id] || 0) + 1);
    Audio.sfx('save');
    toast(`Bond with ${CREW[id].short} deepened: +${BOND_HP} HP, +${BOND_ATK} ATK`);
  },
  lamp() {
    if (state.chits >= 300) { state.chits -= 300; setFlag('gerald_lamp'); toast('Bought Gerald a grow lamp (₡ 300)'); Hud.refresh(); }
    else toast("Not enough chits for the grow lamp yet");
  },
  noodle() {
    if (flag('noodle_given')) return;
    setFlag('noodle_given');
    state.items.noodle = (state.items.noodle || 0) + 1;
    toast('Got a Noodle Cup');
  },
  clue() {
    const n = ['clue_manifest', 'clue_ink', 'clue_chit'].filter(flag).length;
    if (n <= (state.flags.clues || 0)) return;
    state.flags.clues = n;
    Audio.sfx('confirm');
    toast(`Clue found (${n}/3)`);
    Hud.refresh();
    if (n >= 3 && !flag('door_open')) { setFlag('door_open'); after = () => runDialogue('comms_open'); }
  }
};

function joinRhea() {
  if (flag('rhea_joined')) return;
  setFlag('rhea_joined');
  if (!state.party.includes('rhea')) {
    const i = state.party.indexOf('rook');
    if (state.party.length >= 3) state.party[i >= 0 ? i : state.party.length - 1] = 'rhea'; else state.party.push('rhea');
  }
  setTimeout(() => toast('Rhea joined the crew. Change the party under Menu, Crew.'), 1600);
}

let running = false;

export async function runDialogue(id) {
  if (running || !DIALOGUE[id]) return;
  running = true; block();
  Hud.hint(null);
  const box = el(`
    <div class="dlg">
      <div class="dlg-choices" hidden>
        <div class="dlg-you"><span class="dlg-you-pt">${state.player ? playerPortrait(state.player) : ''}</span><span>${esc(state.player?.name || 'You')}</span></div>
        <ol></ol>
      </div>
      <div class="dlg-box">
        <div class="dlg-portrait"></div>
        <div class="dlg-body"><span class="dlg-name"></span><p class="dlg-text" aria-live="polite"></p><span class="dlg-next" aria-hidden="true"></span></div>
      </div>
    </div>`);
  dialogLayer().append(box);
  try {
    let node = id;
    while (node) {
      const steps = DIALOGUE[node]; node = null;
      for (const s of steps) {
        if (s.if && !flag(s.if)) continue;
        if (s.ifNot && flag(s.ifNot)) continue;
        if (s.set) setFlag(s.set);
        if (s.rep) showRep(addRep(s.rep));
        if (s.do && ACTIONS[s.do]) ACTIONS[s.do](s.arg);
        if (s.t !== undefined || s.pick) {
          const text = s.pick ? s.pick[Math.floor(Math.random() * s.pick.length)] : s.t;
          await showLine(box, s.who, fill(text));
        }
        if (s.choices) {
          const opts = s.choices.filter(c => (!c.temp || c.temp === temperament(state.player)) && (!c.if || flag(c.if)) && (!c.ifNot || !flag(c.ifNot)));
          const c = await showChoices(box, opts);
          if (c.set) setFlag(c.set);
          if (c.rep) showRep(addRep(c.rep));
          if (c.do && ACTIONS[c.do]) ACTIONS[c.do](c.arg);
          node = c.go || null;
          break;
        }
        if (s.go) { node = s.go; break; }
      }
    }
  } finally {
    box.remove();
    running = false; unblock();
    bus.emit('dialog-closed');
    const next = after; after = null;
    if (next) setTimeout(next, 60);
  }
}

function showRep(changes) {
  changes.forEach(([k, v]) => toast(`${FACTIONS[k]?.n || k} standing ${v > 0 ? '+' : ''}${v}`));
}

function fill(t) { return t.replace(/\{name\}/g, state.player?.name || 'Captain'); }

function speaker(who) {
  if (!who) return { name: '', portrait: '', color: 'var(--smoke)', blip: 0 };
  if (who === 'player') return { name: state.player.name, portrait: playerPortrait(state.player), color: 'var(--mustard)', blip: 340 };
  const c = CREW[who] || { short: who, color: 'var(--teal)', blip: 400 };
  return { name: c.short, portrait: npcPortrait(who), color: c.color, blip: c.blip };
}

function showLine(box, who, text) {
  return new Promise(resolve => {
    const sp = speaker(who);
    const dbox = box.querySelector('.dlg-box'), pt = box.querySelector('.dlg-portrait');
    const nameEl = box.querySelector('.dlg-name'), textEl = box.querySelector('.dlg-text');
    box.querySelector('.dlg-choices').hidden = true;
    dbox.classList.toggle('narration', !who);
    dbox.style.setProperty('--spk', sp.color);
    if (pt.dataset.who !== (who || '')) { pt.innerHTML = sp.portrait; pt.dataset.who = who || ''; }
    nameEl.textContent = sp.name; nameEl.hidden = !sp.name;
    textEl.textContent = '';
    let i = 0, done = false;
    pt.classList.add('talking');
    const perTick = settings.textSpeed >= 2 ? 3 : 1;
    const timer = setInterval(() => {
      i = Math.min(text.length, i + perTick);
      textEl.textContent = text.slice(0, i);
      if (sp.blip && i % 2 === 0 && text[i - 1] !== ' ') Audio.sfx('blip', sp.blip);
      if (i >= text.length) finishTyping();
    }, 24);
    function finishTyping() { clearInterval(timer); textEl.textContent = text; done = true; pt.classList.remove('talking'); dbox.classList.add('ready'); }
    function advance() {
      if (!done) { finishTyping(); return; }
      cleanup(); Audio.sfx('tick'); resolve();
    }
    const onKey = e => {
      if ([' ', 'Enter', 'e', 'E'].includes(e.key)) { e.preventDefault(); advance(); }
    };
    const onTap = e => { if (!e.target.closest('.dlg-choices')) advance(); };
    function cleanup() {
      document.removeEventListener('keydown', onKey);
      box.removeEventListener('pointerdown', onTap);
      dbox.classList.remove('ready');
    }
    dbox.classList.remove('ready');
    setTimeout(() => {
      document.addEventListener('keydown', onKey);
      box.addEventListener('pointerdown', onTap);
    }, 60);
  });
}

function showChoices(box, opts) {
  return new Promise(resolve => {
    const wrap = box.querySelector('.dlg-choices'), list = wrap.querySelector('ol');
    list.innerHTML = opts.map((c, i) => `
      <li><button type="button" data-i="${i}"><span class="num">${i + 1}.</span><span class="txt">${esc(fill(c.t))}</span>${c.temp ? `<em class="tag">${esc(c.temp)}</em>` : ''}</button></li>`).join('');
    wrap.hidden = false;
    let sel = 0;
    const btns = [...list.querySelectorAll('button')];
    const focus = i => { sel = (i + btns.length) % btns.length; btns.forEach((b, j) => b.classList.toggle('sel', j === sel)); btns[sel].focus({ preventScroll: true }); };
    const choose = i => { cleanup(); Audio.sfx('confirm'); resolve(opts[i]); };
    btns.forEach((b, i) => {
      b.addEventListener('click', () => choose(i));
      b.addEventListener('pointerenter', () => focus(i));
    });
    const onKey = e => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= btns.length) { e.preventDefault(); choose(n - 1); }
      else if (e.key === 'ArrowDown' || e.key === 's') { e.preventDefault(); focus(sel + 1); Audio.sfx('move'); }
      else if (e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); focus(sel - 1); Audio.sfx('move'); }
      else if (e.key === ' ' || e.key === 'Enter' || e.key === 'e') { e.preventDefault(); choose(sel); }
    };
    function cleanup() { document.removeEventListener('keydown', onKey); wrap.hidden = true; }
    setTimeout(() => { document.addEventListener('keydown', onKey); focus(0); }, 80);
  });
}
