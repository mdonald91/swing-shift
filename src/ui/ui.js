// The HTML layer over the game canvas: screens, menus, dialogue, toasts.
import { bus } from '../bus.js';
import { state, flag } from '../state.js';
import { block, unblock } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { entry } from '../data/dialogue.js';
import { Title } from './title.js';
import { Hud } from './hud.js';
import { runDialogue } from './dialog.js';
import { openBoard, openPauseMenu, openJukebox } from './menus.js';

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
    root.innerHTML = `<div id="screen"></div><div id="hud-layer"></div><div id="dialog-layer"></div><div id="modal-layer"></div><div id="toast-layer" aria-live="polite"></div>`;
    ['screen', 'hud-layer', 'dialog-layer', 'modal-layer', 'toast-layer'].forEach(id => layers[id] = document.getElementById(id));
    Hud.mount(layers['hud-layer']);

    bus.on('interact', id => {
      if (id === 'board') return openBoard();
      if (id === 'jukebox') return openJukebox();
      runDialogue(entry(id, state.flags));
    });
    bus.on('menu', () => { if (!modals.length && !document.querySelector('.dlg')) openPauseMenu(); });
    bus.on('hint', t => Hud.hint(t));
    bus.on('area', map => Hud.area(map));

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

export function startWorld() {
  showScreen(null);
  document.body.classList.add('in-world');
  Hud.show();
  if (game.scene.isActive('world') || game.scene.isPaused('world')) game.scene.stop('world');
  game.scene.start('world');
  if (!flag('intro_done')) setTimeout(() => runDialogue('intro'), 2600);
  if (window.innerHeight > window.innerWidth && window.innerWidth < 700) setTimeout(() => toast('Tip: turn your phone sideways for the best view'), 600);
}

export function leaveWorld() {
  if (game.scene.isActive('world')) game.scene.stop('world');
  document.body.classList.remove('in-world');
  Hud.hide();
  while (modals.length) modals[modals.length - 1].close(true);
}

export function dialogLayer() { return layers['dialog-layer']; }

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
