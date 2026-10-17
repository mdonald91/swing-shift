// On-screen HUD while walking around: location, objective, chits, menu, hints and touch controls.
import { state } from '../state.js';
import { Input } from '../systems/input.js';
import { bus } from '../bus.js';

let root, hintEl, objEl, chitsEl, areaEl, locEl;
const touchQuery = window.matchMedia ? window.matchMedia('(pointer: coarse)') : { matches: false };

export function objective() {
  const f = state.flags;
  if (!f.intro_done) return '';
  const met = ['met_rook', 'met_tam', 'met_brushes'].filter(k => f[k]).length;
  if (f.velvet_done) {
    const chats = ['rook', 'tam', 'brushes'].filter(k => f['chat_' + k]).length;
    if (!f.cygnus_arrived) return chats < 3 ? `Catch up with your crew (${chats}/3), then fly to Cygnus Station` : 'Fly to Cygnus Station from the cockpit';
    if (!f.ghost_offered) return 'Visit Helix Salvage on the Cygnus plaza';
    if (!f.bounty_ghost) return 'Accept Ghost Frequency on the bounty board';
    return 'Ghost Frequency: Relay K-17 opens next build';
  }
  if (!f.bounty_velvet) return met < 3 ? `Talk to your crew (${met}/3)` : 'Check the bounty board';
  if (state.location === 'docks') {
    if (!f.door_open) return `Find proof of the press (${f.clues || 0}/3)`;
    return 'Get into Warehouse 9-C';
  }
  return f.velvet_course ? 'Fly back to Dock 9 from the cockpit' : 'Fly to Dock 9 from the cockpit';
}

export const Hud = {
  mount(layer) {
    root = document.createElement('div');
    root.id = 'hud';
    root.hidden = true;
    root.innerHTML = `
      <div class="hud-loc">
        <div class="hud-place"><b id="hud-name">The Hi-Hat</b><span class="jp" id="hud-jp">ハイハット号</span></div>
        <p class="hud-obj" id="hud-obj" hidden><i aria-hidden="true"></i><span></span></p>
      </div>
      <div class="hud-right">
        <span class="chits" id="hud-chits" title="Chits"></span>
        <button class="hud-menu" id="hud-menu" type="button">Menu</button>
      </div>
      <div class="hud-hint" id="hud-hint" hidden><kbd class="k-key">Space</kbd><kbd class="k-touch">A</kbd><span></span></div>
      <div class="stick-zone" id="stick-zone"><div class="stick" id="stick" hidden><i class="knob" id="knob"></i></div></div>
      <button class="btn-a" id="btn-a" type="button" aria-label="Interact">A</button>
      <div class="areacard" id="areacard" hidden><span class="ac-jp"></span><b class="ac-name"></b><span class="ac-where"></span></div>`;
    layer.append(root);
    hintEl = root.querySelector('#hud-hint');
    objEl = root.querySelector('#hud-obj');
    chitsEl = root.querySelector('#hud-chits');
    areaEl = root.querySelector('#areacard');
    locEl = { name: root.querySelector('#hud-name'), jp: root.querySelector('#hud-jp') };

    root.querySelector('#hud-menu').addEventListener('click', () => bus.emit('menu'));
    const a = root.querySelector('#btn-a');
    a.addEventListener('pointerdown', e => { e.preventDefault(); Input.action = true; a.classList.add('down'); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => a.addEventListener(ev, () => a.classList.remove('down')));
    setupStick(root.querySelector('#stick-zone'), root.querySelector('#stick'), root.querySelector('#knob'));

    const setTouch = on => document.body.classList.toggle('touch-on', on);
    setTouch(touchQuery.matches);
    window.addEventListener('touchstart', () => setTouch(true), { passive: true });
    window.addEventListener('keydown', e => { if (e.key.length > 1 || /^[a-z ]$/i.test(e.key)) setTouch(false); });

    bus.on('dialog-closed', () => Hud.refresh());
  },
  show() { root.hidden = false; Hud.refresh(); },
  hide() { root.hidden = true; },
  refresh() {
    const o = objective();
    objEl.hidden = !o;
    objEl.querySelector('span').textContent = o;
    chitsEl.textContent = '₡ ' + state.chits.toLocaleString('en-AU');
  },
  hint(text) {
    hintEl.hidden = !text;
    if (text) hintEl.querySelector('span').textContent = text;
  },
  area(map) {
    locEl.name.textContent = map.name; locEl.jp.textContent = map.jp;
    areaEl.querySelector('.ac-jp').textContent = map.jp;
    areaEl.querySelector('.ac-name').textContent = map.name;
    areaEl.querySelector('.ac-where').textContent = map.where;
    areaEl.hidden = true; void areaEl.offsetWidth; areaEl.hidden = false;
    clearTimeout(areaEl._t);
    areaEl._t = setTimeout(() => { areaEl.hidden = true; }, 3200);
    Hud.refresh();
  }
};

function setupStick(zone, stick, knob) {
  const R = 44;
  let id = null, cx = 0, cy = 0;
  zone.addEventListener('pointerdown', e => {
    if (id !== null) return;
    id = e.pointerId; zone.setPointerCapture(id);
    cx = e.clientX; cy = e.clientY;
    stick.style.left = cx + 'px'; stick.style.top = cy + 'px';
    stick.hidden = false; knob.style.transform = 'translate(-50%,-50%)';
  });
  zone.addEventListener('pointermove', e => {
    if (e.pointerId !== id) return;
    let dx = e.clientX - cx, dy = e.clientY - cy;
    const d = Math.hypot(dx, dy);
    if (d > R) { dx *= R / d; dy *= R / d; }
    knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    Input.x = Math.abs(dx) > 8 ? dx / R : 0;
    Input.y = Math.abs(dy) > 8 ? dy / R : 0;
  });
  const end = e => {
    if (e.pointerId !== id) return;
    id = null; stick.hidden = true; Input.x = Input.y = 0;
  };
  zone.addEventListener('pointerup', end);
  zone.addEventListener('pointercancel', end);
}
