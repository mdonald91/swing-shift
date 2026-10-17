// New Game: create your hunter.
import { PRESETS, ROWS, TEMPERAMENTS, resolveLook } from '../data/appearance.js';
import { playerPortrait } from '../art/portrait.js';
import { characterSheet, CW, CH } from '../art/pixel.js';
import { newGame, saveGame } from '../state.js';
import { Audio } from '../systems/audio.js';
import { el, esc, showScreen, startWorld } from './ui.js';
import { Title } from './title.js';

let timer = 0;

export const Creator = {
  show(slot) {
    const draft = { ...PRESETS[0] };
    let presetIdx = 0;
    const node = el(`<section class="screen creator">
      <header class="cr-head"><div><p class="eyebrow">New game</p><h2>Create your hunter</h2></div>
        <button class="btn ghost" type="button" data-back>Back</button></header>
      <div class="cr-body">
        <div class="cr-presets" role="radiogroup" aria-label="Presets">${PRESETS.map((p, i) => `
          <button type="button" class="preset" data-i="${i}" role="radio">
            <span class="preset-pt">${playerPortrait(p)}</span><span class="preset-l">${esc(p.label)}</span>
          </button>`).join('')}</div>
        <div class="cr-preview">
          <div class="cr-portrait"></div>
          <div class="cr-sprite"><canvas width="${CW}" height="${CH}" aria-label="In-game sprite preview"></canvas><span>In game</span></div>
        </div>
        <div class="cr-form">
          <label class="cr-label" for="cr-name">Name</label>
          <input id="cr-name" class="cr-name" maxlength="12" autocomplete="off" spellcheck="false">
          <p class="cr-label">Appearance</p>
          <div class="cr-rows">${ROWS.map(r => `
            <div class="cr-row" data-key="${r.key}">
              <span class="cr-row-l">${r.label}</span>
              <button type="button" class="arrow" data-d="-1" aria-label="Previous ${r.label}">◀</button>
              <span class="cr-val"><b></b><small></small></span>
              <button type="button" class="arrow" data-d="1" aria-label="Next ${r.label}">▶</button>
            </div>`).join('')}</div>
          <p class="cr-label">Temperament</p>
          <div class="cr-temps" role="radiogroup" aria-label="Temperament">${TEMPERAMENTS.map((t, i) => `
            <button type="button" class="temp" data-i="${i}" role="radio"><b>${t.n}</b><small>${t.d}</small></button>`).join('')}</div>
          <button class="btn primary big cr-confirm" type="button" data-confirm>Confirm</button>
        </div>
      </div>
    </section>`);
    showScreen(node);

    const nameIn = node.querySelector('#cr-name');
    const portraitEl = node.querySelector('.cr-portrait');
    const spriteCv = node.querySelector('.cr-sprite canvas');
    let sheet = null;

    function render() {
      nameIn.value = draft.name;
      portraitEl.innerHTML = playerPortrait(draft);
      sheet = characterSheet(resolveLook(draft));
      node.querySelectorAll('.preset').forEach((b, i) => b.setAttribute('aria-checked', i === presetIdx));
      ROWS.forEach(r => {
        const row = node.querySelector(`.cr-row[data-key="${r.key}"]`);
        row.querySelector('b').textContent = r.list[draft[r.key]].n;
        row.querySelector('small').textContent = `${draft[r.key] + 1}/${r.list.length}`;
      });
      node.querySelectorAll('.temp').forEach((b, i) => b.setAttribute('aria-checked', i === draft.temp));
    }

    node.querySelectorAll('.preset').forEach(b => b.addEventListener('click', () => {
      presetIdx = +b.dataset.i; Object.assign(draft, PRESETS[presetIdx]); Audio.sfx('tick'); render();
    }));
    node.querySelectorAll('.cr-row').forEach(row => row.querySelectorAll('.arrow').forEach(a => a.addEventListener('click', () => {
      const r = ROWS.find(x => x.key === row.dataset.key);
      draft[r.key] = (draft[r.key] + +a.dataset.d + r.list.length) % r.list.length;
      presetIdx = -1; Audio.sfx('move'); render();
    })));
    node.querySelectorAll('.temp').forEach(b => b.addEventListener('click', () => { draft.temp = +b.dataset.i; Audio.sfx('tick'); render(); }));
    nameIn.addEventListener('input', () => { draft.name = nameIn.value; });
    node.querySelector('[data-back]').addEventListener('click', () => { stop(); Audio.sfx('back'); Title.show(); });
    node.querySelector('[data-confirm]').addEventListener('click', () => {
      const name = (draft.name || '').trim() || PRESETS[Math.max(0, presetIdx)].name;
      const player = { name, face: draft.face, skin: draft.skin, hair: draft.hair, hairColour: draft.hairColour, outfit: draft.outfit, acc: draft.acc, temp: draft.temp };
      stop();
      newGame(slot, player);
      saveGame();
      Audio.sfx('cymbal');
      startWorld();
    });

    // walking sprite preview: turns through each direction
    const ctx = spriteCv.getContext('2d');
    let tick = 0;
    stop();
    timer = setInterval(() => {
      if (!sheet || !spriteCv.isConnected) return;
      const dirOrder = [0, 1, 3, 2];
      const d = dirOrder[Math.floor(tick / 8) % 4], f = [1, 0, 2, 0][tick % 4];
      ctx.clearRect(0, 0, CW, CH);
      ctx.drawImage(sheet, f * CW, d * CH, CW, CH, 0, 0, CW, CH);
      tick++;
    }, 160);

    render();
    nameIn.focus({ preventScroll: true });
  }
};

function stop() { clearInterval(timer); timer = 0; }
