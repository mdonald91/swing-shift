// Lyra's echo lock on the garden dome: she sings a phrase on four pads, you sing it back.
// Three phrases, each a note longer. A wrong note just replays the phrase.
import { state, setFlag } from '../state.js';
import { Audio } from '../systems/audio.js';
import { el, openModal, toast } from './ui.js';
import { tip } from './tips.js';
import { bus } from '../bus.js';

const PADS = [
  { n: 62, label: 'Low', shape: '●', c: '#2b8f8a' },
  { n: 66, label: 'Mid', shape: '▲', c: '#e9b23a' },
  { n: 69, label: 'High', shape: '■', c: '#d5473b' },
  { n: 73, label: 'Top', shape: '◆', c: '#9a7fd0' }
];
// The phrases are fixed, so a note-by-note guide can be shared (and Brushes can hum along).
const PHRASES = [[0, 2, 1], [1, 3, 2, 0], [2, 0, 3, 1, 2]];
const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function openEcho() {
  if (state.flags.nyx_dome_open) return true;
  await tip('echo');
  return new Promise(resolve => {
    let round = 0, step = 0, listening = false, solved = false, alive = true;
    const node = el(`<div class="panel echo">
      <header class="panel-head"><h2>Echo lock</h2><span class="jp">エコー錠</span><button class="x" type="button" data-close aria-label="Close">✕</button></header>
      <div class="echo-body">
        <p class="echo-voice">A soft voice comes through the door speaker: <em>"If you're not here to take me back, sing it back."</em></p>
        <div class="echo-pads">${PADS.map((p, i) => `<button type="button" class="echo-pad" data-p="${i}" style="--c:${p.c}" aria-label="${p.label} note, key ${i + 1}"><span>${p.shape}</span><small>${i + 1}</small></button>`).join('')}</div>
        <div class="echo-progress">${PHRASES.map(() => '<i></i>').join('')}</div>
        <p class="echo-status" aria-live="polite">Listen...</p>
        <div class="echo-btns"><button class="btn ghost" type="button" data-replay>Play it again</button></div>
      </div>
    </div>`);
    const m = openModal(node, { onClose: () => { alive = false; document.removeEventListener('keydown', onKey, true); bus.emit('dialog-closed'); resolve(solved); } });
    node.querySelector('[data-close]').addEventListener('click', () => m.close());
    const $ = s => node.querySelector(s);
    const pads = [...node.querySelectorAll('.echo-pad')];
    const flash = (i, ms = 380) => { pads[i].classList.add('lit'); setTimeout(() => pads[i].classList.remove('lit'), ms); };
    async function play() {
      listening = false; step = 0;
      pads.forEach(p => p.disabled = true);
      $('.echo-status').textContent = 'Listen...';
      await sleep(600);
      for (const i of PHRASES[round]) { if (!alive) return; Audio.note(PADS[i].n); flash(i); await sleep(620); }
      if (!alive) return;
      pads.forEach(p => p.disabled = false);
      listening = true;
      $('.echo-status').textContent = `Your turn: ${PHRASES[round].length} notes`;
      pads[PHRASES[round][0]] && pads[0].focus({ preventScroll: true });
    }
    async function press(i) {
      if (!listening) return;
      Audio.note(PADS[i].n, .35); flash(i, 220);
      if (PHRASES[round][step] !== i) {
        listening = false; Audio.sfx('clam');
        $('.echo-status').textContent = 'Not quite. Again...';
        await sleep(700); if (alive) play(); return;
      }
      step++;
      if (step < PHRASES[round].length) return;
      listening = false;
      node.querySelectorAll('.echo-progress i')[round].classList.add('on');
      round++;
      if (round >= PHRASES.length) {
        solved = true; setFlag('nyx_dome_open');
        Audio.sfx('save'); $('.echo-status').textContent = 'The lock sings the whole phrase back, and the door slides open.';
        node.classList.add('solved');
        setTimeout(() => { toast('The garden dome is open'); m.close(true); }, 1600);
        return;
      }
      Audio.sfx('perfect'); $('.echo-status').textContent = 'Yes. Again, longer...';
      await sleep(900); if (alive) play();
    }
    pads.forEach((p, i) => p.addEventListener('click', () => press(i)));
    node.querySelector('[data-replay]').addEventListener('click', () => { if (listening) play(); });
    const onKey = e => { const i = '1234'.indexOf(e.key); if (i >= 0) { e.preventDefault(); e.stopPropagation(); press(i); } };
    document.addEventListener('keydown', onKey, true);
    play();
  });
}
