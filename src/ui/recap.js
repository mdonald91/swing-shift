// "Story so far": liner notes for Side A, built from the choices on this save.
// Opens from the menu any time, and plays as the closing screen of the Act 1 finale.
import { state, flag, setFlag, saveGame, formatTime } from '../state.js';
import { CREW, CAPTAIN_ROLES } from '../data/crew.js';
import { FACTIONS, tier } from '../data/shop.js';
import { temperament } from '../data/appearance.js';
import { level, available } from '../systems/party.js';
import { block, unblock } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { playCut } from './cutscene.js';
import { el, esc, openModal, sceneLayer, toast } from './ui.js';
import { Hud } from './hud.js';

const done = id => state.bounties[id] === 'done' || flag(id + '_done');

function tracks() {
  const f = state.flags;
  return [
    {
      n: '01', name: 'Counterfeit Swing', where: 'Ganymede, Dock 9', done: done('velvet'), started: f.bounty_velvet || f.velvet_course,
      notes: [
        'Velvet Moreau delivered alive.',
        f.thanked_ozzie && 'Thanked Ozzie for the tip-off. The docks noticed.',
        f.noodle_given && 'Shared your noodles on Dock 9.'
      ]
    },
    {
      n: '02', name: 'Ghost Frequency', where: 'Cygnus Station, Relay K-17', done: done('ghost'), started: f.ghost_offered,
      notes: [
        f.juno_protected && 'Protected Juno and sent the relay logs to the Bounty Office. Helix will not forget.',
        f.juno_handed && 'Handed Juno and the data to Director Hale. A contract is a contract.',
        f.cryo_found && 'Found the four missing crew alive in cryo.',
        f.rhea_joined ? 'Rhea Vance joined the crew.' : f.juno_handed && 'Rhea walked away from the Hi-Hat.'
      ]
    },
    {
      n: '03', name: 'The Missing Courier', where: 'Vesta market ring', done: done('courier'), started: f.bounty_courier || f.vesta_arrived,
      notes: [
        'Wren Castillo found and sent home to her sister.',
        f.tail_done && 'Tailed Fennick through the market without being seen.',
        'Beat Sable and Vox, and lost them their jobs.',
        f.core_kept && 'Kept the tuning core aboard. Brushes named it Kevin.',
        f.core_office && 'Gave the tuning core to the Bounty Office as evidence.',
        f.core_helix && 'Gave the tuning core to Mr Quill for Helix.',
        f.core_sold && 'Sold the tuning core to Kessler.'
      ]
    }
  ].map(t => ({ ...t, notes: t.notes.filter(Boolean) }));
}

function offClock() {
  const f = state.flags;
  return [
    f.song_bop && 'Brushes wrote you a bebop number. Fast sells.',
    f.song_ballad && 'Brushes wrote you a ballad. A moody one.',
    f.gerald_lamp && 'Bought Gerald a grow lamp. Tam has not stopped talking about it.',
    f.busked_ever && 'Sat in with Old Sol on the Cygnus plaza.',
    ['rook', 'tam', 'brushes'].filter(k => f['chat_' + k]).length === 3 && 'Made time for every one of the original crew.'
  ].filter(Boolean);
}

function html({ finale }) {
  const p = state.player, temp = temperament(p);
  const crew = ['rook', 'tam', 'brushes', 'rhea'].filter(available);
  const ts = tracks();
  const off = offClock();
  return `<div class="liner">
    <header class="ln-head">
      <p class="ln-side">Side A</p>
      <h2>The story so far</h2>
      <p class="ln-cap"><b>${esc(p.name)}</b> · ${esc(temp)} ${esc(CAPTAIN_ROLES[temp].role)} · Lv ${level('captain')} · ${formatTime(state.playtime)} played</p>
    </header>
    <ol class="ln-tracks">${ts.map(t => `
      <li class="${t.done ? 'done' : t.started ? 'now' : 'todo'}">
        <span class="ln-n">${t.n}</span>
        <div><b>${esc(t.name)}</b> <small>${esc(t.where)}</small>
          ${t.done ? `<ul>${t.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>`
            : `<p class="ln-wait">${t.started ? 'In progress' : 'Not played yet'}</p>`}
        </div>
      </li>`).join('')}
    </ol>
    ${off.length ? `<section class="ln-sec"><h3>Off the clock</h3><ul>${off.map(n => `<li>${esc(n)}</li>`).join('')}</ul></section>` : ''}
    <div class="ln-cols">
      <section class="ln-sec"><h3>The band</h3><ul class="ln-band">${crew.map(k => `
        <li><b>${esc(CREW[k].short)}</b> <span>Lv ${level(k)}</span> <span class="ln-bond" title="Bond">${[0, 1, 2].map(i => `<i class="${i < (state.bonds[k] || 0) ? 'on' : ''}"></i>`).join('')}</span></li>`).join('')}
      </ul></section>
      <section class="ln-sec"><h3>Standing</h3><ul class="ln-band">${Object.entries(FACTIONS).map(([k, fa]) => `
        <li><b>${esc(fa.n)}</b> <span>${esc(tier(state.rep[k] || 0))}</span></li>`).join('')}
      </ul></section>
    </div>
    ${flag('act1_done') || finale ? `<section class="ln-sec ln-next"><h3>Coming up on Side B</h3>
      <p>04 · Iron Mantis &nbsp; 05 · Runaway Prototype &nbsp; and a quarter of a million chits on the Conductor.</p></section>` : ''}
  </div>`;
}

export function openRecap() {
  Audio.sfx('confirm');
  const node = el(`<div class="panel recap">
    <header class="panel-head"><h2>Story so far</h2><span class="jp">これまでの物語</span><button class="x" type="button" data-close aria-label="Close">✕</button></header>
    <div class="recap-body">${html({})}</div>
  </div>`);
  const m = openModal(node);
  node.querySelector('[data-close]').addEventListener('click', () => m.close());
  return m;
}

// The full-screen version at the end of Side A.
function finaleRecap() {
  return new Promise(resolve => {
    block();
    const node = el(`<div class="recap-screen" role="dialog" aria-label="Story so far">
      <div class="recap-scroll">${html({ finale: true })}
        <div class="recap-btns"><button class="btn primary big" type="button" data-flip>Flip the record</button></div>
      </div>
    </div>`);
    sceneLayer().append(node);
    const b = node.querySelector('[data-flip]');
    setTimeout(() => b.focus({ preventScroll: true }), 60);
    b.addEventListener('click', () => {
      Audio.sfx('confirm');
      node.classList.add('out');
      setTimeout(() => { node.remove(); unblock(); resolve(); }, 300);
    });
  });
}

// Act 1 finale: the broadcast, the liner notes, then back to the ship. Plays once per save.
let playing = false;
export async function playFinale() {
  if (playing || flag('act1_done') || !flag('courier_done')) return;
  playing = true;
  await playCut('act1_finale', { restoreMood: false });
  Audio.setMood('finale');
  await finaleRecap();
  setFlag('act1_done');
  Audio.setMood('ship');
  const ok = saveGame();
  Hud.refresh();
  playing = false;
  setTimeout(() => toast(ok ? 'Side A complete. Game saved.' : 'Side A complete.'), 300);
  setTimeout(() => toast('New on the bounty board: The Conductor'), 2900);
}
