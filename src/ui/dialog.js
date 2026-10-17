// Conversation box: portraits, typewriter text, numbered choices.
import { DIALOGUE } from '../data/dialogue.js';
import { CREW } from '../data/crew.js';
import { temperament } from '../data/appearance.js';
import { playerPortrait, npcPortrait } from '../art/portrait.js';
import { state, settings, flag, setFlag, saveGame } from '../state.js';
import { block, unblock } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { bus } from '../bus.js';
import { el, esc, dialogLayer, toast } from './ui.js';
import { Hud } from './hud.js';

const ACTIONS = {
  save() { const ok = saveGame(); Audio.sfx('save'); toast(ok ? `Saved to slot ${state.slot + 1}` : "Couldn't save: this browser is blocking storage"); },
  objective() { Hud.refresh(); }
};

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
        if (s.do && ACTIONS[s.do]) ACTIONS[s.do]();
        if (s.t !== undefined || s.pick) {
          const text = s.pick ? s.pick[Math.floor(Math.random() * s.pick.length)] : s.t;
          await showLine(box, s.who, fill(text));
        }
        if (s.choices) {
          const opts = s.choices.filter(c => (!c.temp || c.temp === temperament(state.player)) && (!c.if || flag(c.if)) && (!c.ifNot || !flag(c.ifNot)));
          const c = await showChoices(box, opts);
          if (c.set) setFlag(c.set);
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
  }
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
