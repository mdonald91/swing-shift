// The HTML layer over the game canvas: screens, menus, dialogue, toasts.
import { bus } from '../bus.js';
import { state, settings, flag, setFlag, saveGame } from '../state.js';
import { block, unblock } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { entry } from '../data/dialogue.js';
import { MAPS } from '../data/maps.js';
import { playCut } from './cutscene.js';
import { Title } from './title.js';
import { Hud } from './hud.js';
import { runDialogue } from './dialog.js';
import { openBoard, openPauseMenu, openJukebox, openShop, applyDisplay } from './menus.js';
import { tip } from './tips.js';
import { playFinale, playFinale2 } from './recap.js';
import { openUpgrades, openWorkshop, openBooth } from './hihat.js';
import { jobDialogue } from '../systems/jobs.js';
import { available } from '../systems/party.js';
import { startBattle } from './battle.js';
import { playAct3Open } from './recap.js';

export const $ = (s, root = document) => root.querySelector(s);
export const $$ = (s, root = document) => [...root.querySelectorAll(s)];
export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const layers = {};
let game = null;
const modals = [];

export const UI = {
  init(g) {
    game = g;
    const root = document.getElementById('ui');
    root.innerHTML = `<div id="screen"></div><div id="hud-layer"></div><div id="dialog-layer"></div><div id="scene-layer"></div><div id="modal-layer"></div><div id="toast-layer" aria-live="polite"></div>`;
    ['screen', 'hud-layer', 'dialog-layer', 'scene-layer', 'modal-layer', 'toast-layer'].forEach(id => layers[id] = document.getElementById(id));
    Hud.mount(layers['hud-layer']);
    applyDisplay();

    bus.on('interact', id => {
      if (id === 'board') return openBoard();
      if (id === 'upgrades') return openUpgrades();
      if (id === 'workbench') return openWorkshop();
      if (id === 'booth') return openBooth();
      const jd = jobDialogue(id);
      if (jd) return runDialogue(jd);
      if (id === 'jukebox') return openJukebox();
      if (id === 'supply') return openShop('supply');
      if (id === 'outfitters') return openShop('outfitters');
      if (id === 'stand') return openShop('stand');
      if (id === 'bar_door') { Audio.sfx('confirm'); return travel('bar'); }
      if (id === 'bar_exit') { Audio.sfx('back'); return travel('cygnus', 'bar'); }
      runDialogue(entry(id, state.flags, state.location));
    });
    bus.on('tail-end', ({ ok, reason }) => {
      if (ok) { setFlag('tail_done'); Audio.sfx('confirm'); setTimeout(() => runDialogue('tail_done'), 300); return; }
      Audio.sfx('scratch');
      travel('vesta', 'pell');
      setTimeout(() => runDialogue('tail_fail_' + reason), 700);
    });
    bus.on('trigger', id => runDialogue(id));
    bus.on('spotted', reset => {
      Audio.sfx('scratch');
      toast(['Spotted! Back into the shadows.', 'A spotlight catches you. Try again, on the dark beats.', "The crowd gasps. Not for Nocturne. Back you go."][Math.floor(Math.random() * 3)]);
      setTimeout(() => travel('lyceum', reset), 250);
    });
    bus.on('patrol-seen', ({ id, fight }) => {
      Audio.sfx('scratch');
      toast(['Spotted! The collectors close in.', 'A visor flashes red. You have been made.', '"Hi-Hat crew! Over here!"'][Math.floor(Math.random() * 3)]);
      setTimeout(() => startBattle(fight, { flag: 'patrol_' + state.location + '_' + id, retreatTo: 'default' }), 800);
    });
    bus.on('menu', () => { if (!modals.length && !document.querySelector('.dlg')) openPauseMenu(); });
    bus.on('hint', t => Hud.hint(t));
    bus.on('area', map => {
      Hud.area(map);
      autosave();
      if (state.location === 'vesta' && !flag('vesta_arrived')) {
        setTimeout(() => playCut('vesta_arrive').then(() => {
          setFlag('vesta_arrived');
          if (flag('juno_protected') && !flag('juno_gift')) { setFlag('juno_gift'); state.items.patch = (state.items.patch || 0) + 2; toast("Juno's gift: 2 Patch Kits"); }
          Hud.refresh();
        }), 400);
      }
      if (state.location === 'relay' && !flag('k17_arrived')) {
        setTimeout(() => playCut('k17_arrive').then(() => { setFlag('k17_arrived'); Hud.refresh(); }), 400);
      }
      if (state.location === 'cygnus' && !flag('cygnus_arrived')) {
        setTimeout(() => playCut('cygnus_arrive').then(() => { setFlag('cygnus_arrived'); Hud.refresh(); }), 400);
      }
      if (state.location === 'ship' && flag('courier_done') && !flag('act1_done')) setTimeout(playFinale, 1200);
      if (state.location === 'ship' && flag('nocturne_done') && !flag('act2_done')) setTimeout(playFinale2, 1200);
      if (state.location === 'ship' && flag('act2_done') && !flag('act3_open')) setTimeout(playAct3Open, 1200);
      if (state.location === 'cygnus_lock' && !flag('lock_arrived')) {
        setTimeout(async () => { setFlag('lock_arrived'); await tip('patrols'); runDialogue('lock_arrive'); Hud.refresh(); }, 700);
      }
      if (state.location === 'titan' && !flag('titan_arrived')) {
        setTimeout(() => playCut('titan_arrive').then(() => { setFlag('titan_arrived'); Hud.refresh(); }), 400);
      }
      if (state.location === 'lyceum' && !flag('lyceum_arrived')) {
        setTimeout(async () => { setFlag('lyceum_arrived'); await tip('spots'); runDialogue('lyceum_arrive'); }, 600);
      }
      if (state.location === 'nyx' && !flag('nyx_arrived')) {
        setTimeout(() => playCut('nyx_arrive').then(() => { setFlag('nyx_arrived'); Hud.refresh(); }), 400);
      }
      if (state.location === 'targon' && !flag('targon_arrived')) {
        setTimeout(() => playCut('targon_arrive').then(() => { setFlag('targon_arrived'); Hud.refresh(); }), 400);
      }
      if (state.location === 'targon_deep' && !flag('tg_deep_arrived')) {
        setTimeout(() => { setFlag('tg_deep_arrived'); runDialogue('tg_deep_arrive'); }, 700);
      }
      if (state.location === 'docks' && !flag('docks_arrived')) {
        setTimeout(() => playCut('arrive').then(() => { setFlag('docks_arrived'); Hud.refresh(); }), 400);
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modals.length) { e.preventDefault(); modals[modals.length - 1].close(); }
    });
    // unlock audio on the first touch or key anywhere
    const unlock = () => Audio.init();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    Title.show();
  }
};

export function showScreen(node) {
  const s = layers.screen;
  s.innerHTML = '';
  if (node) s.append(node);
  s.hidden = !node;
  document.body.classList.toggle('on-screen', !!node);
}

// Autosave whenever a new area loads, unless it's switched off or a scene is mid-flow.
let lastAuto = 0;
function autosave() {
  if (!settings.autosave || !state.player) return;
  if (performance.now() - lastAuto < 1500) return;
  lastAuto = performance.now();
  setTimeout(() => { if (saveGame()) Hud.autosaved(); }, 250);
}

export function startWorld() {
  showScreen(null);
  document.body.classList.add('in-world');
  Hud.show();
  updateStanding();
  if (state.location === 'cygnus' && lockdown()) { state.location = 'cygnus_lock'; state.pos = null; }
  if (game.scene.isActive('world') || game.scene.isPaused('world')) game.scene.stop('world');
  game.scene.start('world');
  setTimeout(async () => {
    await tip('controls');
    if (!flag('intro_done')) setTimeout(() => runDialogue('intro'), 400);
  }, flag('intro_done') ? 1400 : 2200);
  if (window.innerHeight > window.innerWidth && window.innerWidth < 700) setTimeout(() => toast('Tip: turn your phone sideways for the best view'), 600);
}

export function leaveWorld() {
  if (game.scene.isActive('world')) game.scene.stop('world');
  document.body.classList.remove('in-world');
  Hud.hide();
  while (modals.length) modals[modals.length - 1].close(true);
}

export function dialogLayer() { return layers['dialog-layer']; }
export function sceneLayer() { return layers['scene-layer']; }

// Move to another map. spawn names a point in that map's "spawns".
// Standing and bonds, kept as flags so maps and scenes can check them (recalculated on every move).
export function updateStanding() {
  const r = state.rep || {}, f = state.flags, b = state.bonds || {};
  const set = (k, v) => { if (v) f[k] = true; else delete f[k]; };
  set('std_office', (r.office || 0) >= 3);
  set('std_docks', (r.docks || 0) >= 2);
  set('std_helix', (r.helix || 0) >= 2);
  set('std_helix_bad', (r.helix || 0) <= -2);
  for (const k of ['rook', 'tam', 'brushes', 'rhea', 'lyra']) set('bonded_' + k, (b[k] || 0) >= 2 && available(k));
}

// Cygnus is under lockdown while the Conductor's bounty is out on the crew.
const lockdown = () => flag('bounty_conductor') && !flag('metronome_done');

export function travel(location, spawn = 'default') {
  if (location === 'cygnus' && lockdown()) { location = 'cygnus_lock'; if (!MAPS.cygnus_lock.spawns[spawn]) spawn = 'default'; }
  updateStanding();
  const m = MAPS[location]; if (!m) return;
  const s = m.spawns[spawn] || m.spawns.default;
  if (state.location === 'ship' && location !== 'ship') delete state.flags.busked_visit;   // a fresh crowd each trip
  state.location = location;
  state.pos = { px: s.x * 16 + 8, py: s.y * 16 + 8 };
  state.face = s.face || null;
  if (game.scene.isActive('world') || game.scene.isPaused('world')) game.scene.stop('world');
  game.scene.start('world');
}

// A modal panel over the world. Returns a handle with close().
export function openModal(node, { onClose } = {}) {
  block();
  const wrap = el('<div class="modal" role="dialog" aria-modal="true"></div>');
  wrap.append(node);
  wrap.addEventListener('pointerdown', e => { if (e.target === wrap) handle.close(); });
  layers['modal-layer'].append(wrap);
  const handle = {
    node: wrap,
    close(silent) {
      const i = modals.indexOf(handle); if (i < 0) return;
      modals.splice(i, 1); wrap.remove(); unblock();
      if (!silent) Audio.sfx('back');
      onClose && onClose();
    }
  };
  modals.push(handle);
  setTimeout(() => (wrap.querySelector('[autofocus]') || wrap.querySelector('button'))?.focus({ preventScroll: true }), 30);
  return handle;
}

export function toast(msg) {
  const t = el(`<div class="toast">${esc(msg)}</div>`);
  layers['toast-layer'].append(t);
  setTimeout(() => t.classList.add('out'), 2200);
  setTimeout(() => t.remove(), 2700);
}
