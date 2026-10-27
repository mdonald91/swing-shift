// The end credits: the ending, where everyone ended up, and the soundtrack. Rolls on its own; you can scroll or skip.
import { state } from '../state.js';
import { TRACKS } from '../data/music.js';
import { ENDINGS, whereNow, crewNow } from '../data/endings.js';
import { block, unblock } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { el, esc, sceneLayer } from './ui.js';

export function rollCredits(ending) {
  return new Promise(resolve => {
    block();
    Audio.setMood('finale');
    const E = ENDINGS[ending] || ENDINGS.lastcall;
    const songs = Object.values(TRACKS).map(t => `<li><b>${esc(t.label)}</b> <small>${esc(t.file.replace('music/', ''))}</small></li>`).join('');
    const node = el(`<div class="credits" role="dialog" aria-label="Credits">
      <div class="cr-roll">
        <p class="cr-eyebrow">Swing Shift</p>
        <h1>${esc(E.n)}</h1>
        <p class="cr-sub">${esc(E.d)}</p>
        <section><h2>The crew of the Hi-Hat</h2><p>${esc(crewNow(ending))}</p></section>
        <section><h2>Where are they now</h2><dl>${whereNow(state, ending).map(([who, line]) => `<dt>${esc(who)}</dt><dd>${esc(line)}</dd>`).join('')}</dl></section>
        <section><h2>Soundtrack</h2><p class="cr-note">Your Suno tracks wherever you dropped them in, and the house band everywhere else.</p><ol class="cr-songs">${songs}</ol></section>
        <section><h2>Swing Shift</h2><p>A game by Mitchell Donald.<br>Built with Claude, drawn entirely in code.</p><p>Thanks for listening.</p></section>
        <div class="cr-end"><button class="btn primary big" type="button" data-done>Back to the Hi-Hat</button></div>
      </div>
      <button class="cr-skip" type="button" data-done>Skip ▸▸</button>
    </div>`);
    sceneLayer().append(node);
    // roll slowly; stop rolling as soon as you touch or scroll it yourself
    let rolling = true, last = performance.now(), acc = 0;
    const stop = () => { rolling = false; };
    node.addEventListener('wheel', stop, { passive: true });
    node.addEventListener('touchstart', stop, { passive: true });
    node.addEventListener('keydown', stop);
    const tick = now => {
      if (!node.isConnected) return;
      acc += (now - last) * .035; last = now;
      if (rolling && acc >= 1) { node.scrollTop += Math.floor(acc); acc -= Math.floor(acc); }
      if (rolling && node.scrollTop + node.clientHeight >= node.scrollHeight - 2) rolling = false;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    node.querySelectorAll('[data-done]').forEach(b => b.addEventListener('click', () => {
      Audio.sfx('confirm'); node.classList.add('out');
      setTimeout(() => { node.remove(); unblock(); resolve(); }, 300);
    }));
  });
}
