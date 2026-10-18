// The Hi-Hat's own rooms: the upgrades terminal, Tam's workshop and the recording booth.
import { UPGRADES, RECIPES, GEAR } from '../data/shop.js';
import { ITEMS, JAM_STYLES } from '../data/battles.js';
import { state, setFlag } from '../state.js';
import { ownsGear } from '../systems/party.js';
import { Audio } from '../systems/audio.js';
import { npcPortrait } from '../art/portrait.js';
import { el, esc, openModal, toast } from './ui.js';
import { Hud } from './hud.js';
import { bus } from '../bus.js';

const money = n => '₡ ' + n.toLocaleString('en-AU');
const head = (title, jp) => `<header class="panel-head"><h2>${title}</h2>${jp ? `<span class="jp">${jp}</span>` : ''}<button class="x" type="button" data-close aria-label="Close">✕</button></header>`;
const greet = (who, text) => `<div class="shop-greet"><span class="shop-pt">${npcPortrait(who)}</span><p>${text}</p></div>`;

export function openUpgrades() {
  Audio.sfx('confirm');
  const node = el(`<div class="panel shop upgrades">
    ${head('Ship upgrades', '改造')}
    ${greet('tam', "Every chit you spend here makes my life easier. I mean the ship's life. Same thing.")}
    <div class="tabs"><span class="shop-chits gold"></span></div>
    <ul class="shop-list"></ul>
  </div>`);
  const m = openModal(node, { onClose: () => bus.emit('dialog-closed') });
  node.querySelector('[data-close]').addEventListener('click', () => m.close());
  const list = node.querySelector('.shop-list');
  const render = () => {
    node.querySelector('.shop-chits').textContent = money(state.chits);
    list.innerHTML = UPGRADES.map(u => {
      const own = !!state.flags[u.flag];
      return `<li class="shop-row"><div class="sr-main"><b>${esc(u.n)}</b><small>${esc(u.d)}</small></div>
        <span class="sr-own">${own ? 'Installed' : ''}</span><span class="sr-price">${own ? '' : money(u.price)}</span>
        ${own ? '<span class="sr-done">✓</span>' : `<button class="btn" type="button" data-up="${u.id}" ${state.chits < u.price ? 'disabled' : ''}>Install</button>`}</li>`;
    }).join('');
    list.querySelectorAll('[data-up]').forEach(b => b.addEventListener('click', () => {
      const u = UPGRADES.find(x => x.id === b.dataset.up);
      if (state.chits < u.price || state.flags[u.flag]) return;
      state.chits -= u.price; setFlag(u.flag);
      Audio.sfx('save'); Hud.refresh();
      toast({ workshop: "Tam's workshop is set up in the lounge", booth: 'The recording booth is in, by the hatch', engine: 'Bigger engine fitted. Plot a course from wherever you land.' }[u.id]);
      render();
    }));
  };
  render();
}

export function openWorkshop() {
  Audio.sfx('confirm');
  const node = el(`<div class="panel shop workshop">
    ${head("Tam's workshop", '工房')}
    ${greet('tam', 'Bring me scrap off anything mechanical you knock over, and I can make you something nice. Or something that explodes. Both nice.')}
    <div class="tabs"><span class="shop-chits"></span></div>
    <ul class="shop-list"></ul>
  </div>`);
  const m = openModal(node);
  node.querySelector('[data-close]').addEventListener('click', () => m.close());
  const list = node.querySelector('.shop-list');
  const render = () => {
    node.querySelector('.shop-chits').innerHTML = `Scrap: <b>${state.scrap || 0}</b>`;
    list.innerHTML = RECIPES.filter(r => !r.needs || state.flags[r.needs]).map(r => {
      const thing = r.item ? ITEMS[r.item] : GEAR.find(g => g.id === r.gear);
      const made = r.gear && ownsGear(r.gear);
      const have = r.item ? `Have ${state.items[r.item] || 0}` : made ? 'Fitted' : '';
      return `<li class="shop-row"><div class="sr-main"><b>${esc(thing.n)}</b><small>${esc(thing.d)}</small></div>
        <span class="sr-own">${have}</span><span class="sr-price">${made ? '' : `${r.scrap} scrap`}</span>
        ${made ? '<span class="sr-done">✓</span>' : `<button class="btn" type="button" data-make="${r.id}" ${(state.scrap || 0) < r.scrap ? 'disabled' : ''}>Make</button>`}</li>`;
    }).join('');
    list.querySelectorAll('[data-make]').forEach(b => b.addEventListener('click', () => {
      const r = RECIPES.find(x => x.id === b.dataset.make);
      if ((state.scrap || 0) < r.scrap) return;
      state.scrap -= r.scrap;
      if (r.item) { state.items[r.item] = (state.items[r.item] || 0) + 1; toast(`Tam made a ${ITEMS[r.item].n}`); }
      else { state.gear = [...(state.gear || []), r.gear]; toast(`${GEAR.find(g => g.id === r.gear).n} fitted`); }
      Audio.sfx('clank'); setTimeout(() => Audio.sfx('save'), 200);
      render();
    }));
  };
  render();
}

export function openBooth() {
  Audio.sfx('confirm');
  const node = el(`<div class="panel shop booth">
    ${head('Recording booth', '録音室')}
    ${greet('brushes', 'Pick the arrangement for our next Jam Session, Captain. I have rehearsed all of them. Some of them twice. One of them in my sleep, which I do not do.')}
    <ul class="shop-list"></ul>
  </div>`);
  const m = openModal(node);
  node.querySelector('[data-close]').addEventListener('click', () => m.close());
  const list = node.querySelector('.shop-list');
  const render = () => {
    list.innerHTML = Object.entries(JAM_STYLES).filter(([, s]) => !s.booth || state.flags.up_booth).map(([k, s]) => {
      const on = state.jamStyle === k;
      return `<li class="shop-row ${on ? 'on' : ''}"><div class="sr-main"><b>${esc(s.n)}</b><small>${esc(s.d)}</small></div>
        <span></span><span></span>
        ${on ? '<span class="sr-done">Playing</span>' : `<button class="btn" type="button" data-style="${k}">Choose</button>`}</li>`;
    }).join('');
    list.querySelectorAll('[data-style]').forEach(b => b.addEventListener('click', () => {
      state.jamStyle = b.dataset.style; Audio.sfx('cymbal');
      toast(`Jam Session arrangement: ${JAM_STYLES[state.jamStyle].n}`);
      render();
    }));
  };
  render();
}
