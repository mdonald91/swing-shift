// Letterboxed cutscenes with talking portraits and title cards.
import { CUTSCENES } from '../data/cutscenes.js';
import { CREW } from '../data/crew.js';
import { MAPS } from '../data/maps.js';
import { temperament } from '../data/appearance.js';
import { backdrop } from '../art/backdrops.js';
import { playerPortrait, npcPortrait } from '../art/portrait.js';
import { state } from '../state.js';
import { block, unblock } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { el, esc, sceneLayer } from './ui.js';

const portraitOf = id => id === 'player' ? playerPortrait(state.player) : npcPortrait(id);
const fill = t => t.replace(/\{name\}/g, state.player?.name || 'Captain');

export function playCut(name, { restoreMood = true } = {}) {
  const script = CUTSCENES[name];
  if (!script) return Promise.resolve();
  return new Promise(resolve => {
    block();
    const root = el(`<div class="cs" role="dialog" aria-label="Cutscene">
      <div class="cs-bg"></div>
      <div class="cs-slot left"></div><div class="cs-slot right"></div>
      <div class="cs-bar top"></div><div class="cs-bar bottom"></div>
      <div class="cs-caption" hidden><p></p></div>
      <div class="cs-dialog" hidden><div class="cs-box"><span class="cs-speaker"></span><p class="cs-line" aria-live="polite"></p><span class="cs-next" aria-hidden="true"></span></div></div>
      <div class="cs-card" hidden><span class="cs-track"></span><span class="cs-name"></span><span class="cs-hint">Tap to continue</span></div>
      <button class="cs-skip" type="button">Skip ▸▸</button>
    </div>`);
    sceneLayer().append(root);
    const $ = s => root.querySelector(s);
    const L = $('.cs-slot.left'), R = $('.cs-slot.right');
    let i = 0, typing = null, full = '', who = null, finished = false;

    function setSlot(slot, id, side) {
      if (!id) { slot.innerHTML = ''; slot.dataset.id = ''; return; }
      if (slot.dataset.id === id) return;
      slot.dataset.id = id; slot.innerHTML = portraitOf(id);
      slot.classList.remove('in'); void slot.offsetWidth; slot.classList.add('in');
    }
    function talking(on) { [L, R].forEach(s => s.classList.toggle('talking', on && s.dataset.id === who)); }
    function stopTyping() { clearInterval(typing); typing = null; talking(false); }

    function render() {
      const s = script[i];
      if (s.mood) Audio.setMood(s.mood);
      if (s.bg !== undefined && $('.cs-bg').dataset.bg !== s.bg) { $('.cs-bg').innerHTML = backdrop(s.bg); $('.cs-bg').dataset.bg = s.bg; }
      if ('l' in s) setSlot(L, s.l);
      if ('r' in s) setSlot(R, s.r);
      $('.cs-caption').hidden = !s.caption;
      if (s.caption) $('.cs-caption p').textContent = fill(s.caption);
      const card = $('.cs-card');
      card.hidden = true;
      if (s.card) { $('.cs-track').textContent = s.card.track; $('.cs-name').textContent = s.card.name; void card.offsetWidth; card.hidden = false; }
      if (s.fx) { root.classList.remove('shake', 'flash'); void root.offsetWidth; root.classList.add(s.fx); }
      if (s.sfx) Audio.sfx(s.sfx);
      [L, R].forEach(x => x.classList.remove('talk', 'dim'));
      who = s.who || null;
      if (who) {
        const side = L.dataset.id === who ? L : (R.dataset.id === who ? R : null);
        if (side) { side.classList.add('talk'); (side === L ? R : L).classList.add('dim'); }
      }
      const dlg = $('.cs-dialog');
      const line = s.byTemp && state.player ? (s.byTemp[temperament(state.player)] || s.line) : s.line;
      if (line) {
        dlg.hidden = false;
        const c = who === 'player' ? { short: state.player.name, color: 'var(--mustard)', blip: 340 } : (CREW[who] || { short: '', color: 'var(--teal)', blip: 400 });
        $('.cs-speaker').textContent = c.short; dlg.style.setProperty('--spk', c.color);
        type(fill(line), c.blip);
      } else { dlg.hidden = true; stopTyping(); }
    }
    function type(text, blip) {
      stopTyping(); full = text;
      const el2 = $('.cs-line'); el2.textContent = ''; let n = 0;
      talking(true);
      typing = setInterval(() => {
        n++; el2.textContent = text.slice(0, n);
        if (n % 2 === 0 && text[n - 1] !== ' ') Audio.sfx('blip', blip);
        if (n >= text.length) stopTyping();
      }, 24);
    }
    function advance() {
      if (finished) return;
      if (typing) { stopTyping(); $('.cs-line').textContent = full; return; }
      Audio.sfx('tick');
      i++;
      if (i >= script.length) end(); else render();
    }
    function end() {
      if (finished) return;
      finished = true; stopTyping();
      document.removeEventListener('keydown', onKey);
      root.classList.add('out');
      setTimeout(() => root.remove(), 250);
      unblock();
      if (restoreMood && document.body.classList.contains('in-world')) Audio.setMood((MAPS[state.location] || MAPS.ship).music);
      resolve();
    }
    const onKey = e => { if ([' ', 'Enter', 'e', 'E'].includes(e.key)) { e.preventDefault(); advance(); } else if (e.key === 'Escape') end(); };
    root.addEventListener('pointerdown', e => { if (!e.target.closest('.cs-skip')) advance(); });
    $('.cs-skip').addEventListener('click', e => { e.stopPropagation(); end(); });
    setTimeout(() => document.addEventListener('keydown', onKey), 80);
    render();
  });
}
