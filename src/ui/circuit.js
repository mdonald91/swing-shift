// The power-routing puzzle: a grid of cable tiles you turn until the power reaches every output.
import { CIRCUITS, trace, rotate, startGrid } from '../data/circuits.js';
import { state, setFlag } from '../state.js';
import { Audio } from '../systems/audio.js';
import { el, esc, openModal, toast } from './ui.js';
import { bus } from '../bus.js';

const ARM = { 1: 'M50 50V0', 2: 'M50 50H100', 4: 'M50 50V100', 8: 'M50 50H0' };

function tileSvg(mask, on) {
  const c = on ? 'var(--mustard)' : '#5d6a80';
  const arms = [1, 2, 4, 8].filter(b => mask & b).map(b => `<path d="${ARM[b]}"/>`).join('');
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><g stroke="${on ? '#f3c860' : '#3a4258'}" stroke-width="30" stroke-linecap="butt" opacity="${on ? .35 : 1}">${arms}</g>
    <g stroke="${c}" stroke-width="14" stroke-linecap="butt">${arms}</g><circle cx="50" cy="50" r="${mask ? 11 : 0}" fill="${c}"/></svg>`;
}

// Resolves true once solved (or if it already was).
export function openCircuit(id) {
  const c = CIRCUITS[id];
  if (!c) return Promise.resolve(false);
  if (state.flags[c.flag]) { toast('This board is already routed.'); return Promise.resolve(true); }
  const saved = state.flags['grid_' + id];
  let grid = Array.isArray(saved) ? saved.map(r => [...r]) : startGrid(c);
  const H = grid.length, Wd = grid[0].length;
  return new Promise(resolve => {
    let solved = false;
    const node = el(`<div class="panel circuit">
      <header class="panel-head"><h2>${esc(c.title)}</h2><span class="jp">配電盤</span><button class="x" type="button" data-close aria-label="Close">✕</button></header>
      <div class="cc-body">
        <p class="cc-note">${esc(c.note)} Tap a tile to turn it.</p>
        <div class="cc-board" style="--cols:${Wd};--rows:${H}">
          <div class="cc-grid" role="grid">${grid.map((row, y) => row.map((m, x) => `<button type="button" class="cc-tile" data-x="${x}" data-y="${y}" aria-label="Cable tile, row ${y + 1}, column ${x + 1}"></button>`).join('')).join('')}</div>
          ${[c.source, ...c.outputs].map((p, i) => `<span class="cc-port ${i ? 'out' : 'src'} side-${p.side}" style="--at:${p.at}" data-port="${i}"><i></i><b>${esc(p.short || p.label)}</b></span>`).join('')}
        </div>
        <ul class="cc-legend">
          <li class="src"><i></i>${esc(c.source.label)}</li>
          ${c.outputs.map((o, i) => `<li data-out="${i}"><i></i>${esc(o.label)} <em>No power</em></li>`).join('')}
        </ul>
        <p class="cc-status" aria-live="polite"></p>
      </div>
    </div>`);
    const m = openModal(node, { onClose: () => { if (!solved) state.flags['grid_' + id] = grid; bus.emit('dialog-closed'); resolve(solved); } });
    node.querySelector('[data-close]').addEventListener('click', () => m.close());
    const tiles = [...node.querySelectorAll('.cc-tile')];
    const draw = () => {
      const t = trace(c, grid);
      tiles.forEach(b => { const x = +b.dataset.x, y = +b.dataset.y; b.innerHTML = tileSvg(grid[y][x], t.lit[y][x]); b.classList.toggle('on', t.lit[y][x]); });
      t.out.forEach((on, i) => {
        node.querySelector(`[data-port="${i + 1}"]`).classList.toggle('on', on);
        const li = node.querySelector(`[data-out="${i}"]`); li.classList.toggle('on', on); li.querySelector('em').textContent = on ? 'Powered' : 'No power';
      });
      node.querySelector('[data-port="0"]').classList.add('on');
      return t;
    };
    draw();
    tiles.forEach(b => b.addEventListener('click', () => {
      if (solved) return;
      const x = +b.dataset.x, y = +b.dataset.y;
      const before = trace(c, grid).out.filter(Boolean).length;
      grid[y][x] = rotate(grid[y][x], 1);
      b.classList.remove('spin'); void b.offsetWidth; b.classList.add('spin');
      const t = draw();
      const after = t.out.filter(Boolean).length;
      Audio.sfx(after > before ? 'confirm' : 'tick');
      if (t.done) {
        solved = true;
        setFlag(c.flag); delete state.flags['grid_' + id];
        node.classList.add('solved');
        node.querySelector('.cc-status').textContent = 'Every output is live.';
        Audio.sfx('save');
        setTimeout(() => m.close(true), 1300);
      }
    }));
    setTimeout(() => tiles[0]?.focus({ preventScroll: true }), 40);
  });
}
