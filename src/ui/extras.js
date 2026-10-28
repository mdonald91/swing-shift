// Extras: the endings gallery, the full jukebox and the credits. Opened from the title screen;
// the Hi-Hat's jukebox opens the same record collection.
import { TRACKS } from '../data/music.js';
import { ENDINGS } from '../data/endings.js';
import { state, settings } from '../state.js';
import { meta, heard, seenEnding } from '../systems/meta.js';
import { Audio } from '../systems/audio.js';
import { el, esc, openModal } from './ui.js';
import { rollCredits } from './credits.js';

const head = (title, jp) => `<header class="panel-head"><h2>${title}</h2>${jp ? `<span class="jp">${jp}</span>` : ''}<button class="x" type="button" data-close aria-label="Close">✕</button></header>`;

// how to find each ending, shown before you've reached it
const HINTS = {
  encore: 'Know the end of the song, and bring a band that would follow you anywhere.',
  halftime: 'Know the end of the song, but not your band.',
  duet: 'Bring someone who knows him better than you do.',
  lastcall: 'Just do the job. Mostly kindly.',
  solo: 'Just do the job. Coldly, all record long.'
};
const ORDER = ['encore', 'halftime', 'duet', 'lastcall', 'solo'];

// a track is in the collection once you've heard it anywhere, in any save
const found = k => heard(k) || (state.player && TRACKS[k].unlock && state.flags[TRACKS[k].unlock]);

export function renderJukebox(list) {
  const keys = Object.keys(TRACKS), n = keys.filter(found).length;
  const draw = () => {
    list.innerHTML = `<li class="jb-count">${n} of ${keys.length} tracks in the collection</li>` + keys.map(k => {
      const t = TRACKS[k];
      if (!found(k)) return `<li><div class="jb-row locked"><span class="jb-disc" aria-hidden="true"></span><span class="jb-main"><b>???</b><small>Not heard yet</small></span></div></li>`;
      const on = Audio.mood === k;
      return `<li><button type="button" class="jb-row ${on ? 'sel' : ''}" data-k="${k}">
        <span class="jb-disc" aria-hidden="true"></span>
        <span class="jb-main"><b>${esc(t.label)}</b><small>${esc(t.where || '')} · ${Audio.isSuno(k) ? 'your Suno track' : Audio.sunoMissing(k) || !settings.suno ? 'house band' : 'Suno track if present'}</small></span>
        ${on ? '<em>Playing</em>' : ''}
      </button></li>`;
    }).join('');
    list.querySelectorAll('button.jb-row').forEach(r => r.addEventListener('click', () => { Audio.init(); Audio.setMood(r.dataset.k); Audio.sfx('tick'); draw(); setTimeout(draw, 400); }));
  };
  draw();
}

export function openJukebox() {
  Audio.sfx('confirm');
  const node = el(`<div class="panel jukebox">
    ${head("Brushes' record collection", 'ジュークボックス')}
    <ul class="jb-list"></ul>
    <p class="muted small">Picks stick until you leave the ship. New tracks join the collection as you hear them.</p>
  </div>`);
  const m = openModal(node);
  node.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => m.close()));
  renderJukebox(node.querySelector('.jb-list'));
}

function renderEndings(box) {
  const m = meta(), got = ORDER.filter(seenEnding).length;
  box.innerHTML = `<p class="ex-count">${got} of ${ORDER.length} endings · records finished: ${m.clears}</p>
    <ul class="ex-endings">${ORDER.map(id => {
      const e = ENDINGS[id], s = m.endings[id];
      return s ? `<li class="ex-end got"><b>${esc(e.n)}</b><p>${esc(e.d)}</p><small>${s.by ? `Reached by ${esc(s.by)}, ` : 'Reached '}${new Date(s.at).toLocaleDateString('en-AU', { dateStyle: 'medium' })}</small></li>`
        : `<li class="ex-end"><b>???</b><p>${esc(HINTS[id])}</p><small>Not reached yet</small></li>`;
    }).join('')}</ul>`;
}

export function openExtras(onClose) {
  Audio.sfx('confirm');
  const node = el(`<div class="panel extras">
    ${head('Extras', 'おまけ')}
    <div class="ex-tabs" role="tablist">
      <button type="button" role="tab" data-t="endings" class="on">Endings</button>
      <button type="button" role="tab" data-t="jukebox">Jukebox</button>
      <button type="button" role="tab" data-t="credits">Credits</button>
    </div>
    <div class="ex-body"></div>
  </div>`);
  const before = Audio.mood;
  const m = openModal(node, { onClose: () => { if (Audio.mood !== before) Audio.setMood(before); onClose && onClose(); } });
  node.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => m.close()));
  const body = node.querySelector('.ex-body');
  const show = t => {
    node.querySelectorAll('.ex-tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === t));
    if (t === 'endings') renderEndings(body);
    else if (t === 'jukebox') { body.innerHTML = '<ul class="jb-list"></ul>'; renderJukebox(body.firstChild); }
    else {
      body.innerHTML = `<div class="ex-credits"><p>Swing Shift: nine Tracks, three sides and an encore.</p><p>A game by Mitchell Donald. Built with Claude, drawn entirely in code.</p>
        <button type="button" class="btn primary" data-roll>Roll the credits</button></div>`;
      body.querySelector('[data-roll]').addEventListener('click', async () => { m.close(true); await rollCredits(null); Audio.setMood(before); onClose && onClose(); });
    }
  };
  node.querySelectorAll('.ex-tabs button').forEach(b => b.addEventListener('click', () => { Audio.sfx('tick'); show(b.dataset.t); }));
  show('endings');
}
