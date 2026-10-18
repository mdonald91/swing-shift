// "Story so far": liner notes for the current side of the record, built from the choices on this save.
// Opens from the menu any time, and plays as the closing screen of the Act 1 finale.
import { state, flag, setFlag, saveGame, formatTime } from '../state.js';
import { CREW, CAPTAIN_ROLES } from '../data/crew.js';
import { FACTIONS, tier } from '../data/shop.js';
import { temperament } from '../data/appearance.js';
import { level, available, CREW_KEYS } from '../systems/party.js';
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
    },
    {
      n: '04', side: 'B', name: 'Iron Mantis', where: 'Targon, Shaft 3', done: done('mantis'), started: f.bounty_mantis,
      notes: [
        'Rescued Dagny Ferro, the engineer who built the Mantis.',
        f.tg_photo && 'Tam showed you the photo from her first day in Ferro\'s workshop.',
        f.mantis_spared && 'Let Ferro keep and repair the Mantis. Tam got her mentor\'s toolkit.',
        f.mantis_core && 'Sent the Mantis\'s control core to the Bounty Office as evidence.',
        f.mantis_scrapped && 'Had the Mantis scrapped for Targon Mining.'
      ]
    },
    {
      n: '05', side: 'B', name: 'Runaway Prototype', where: 'Nyx', done: done('proto'), started: f.bounty_proto,
      notes: [
        'Found Lyra, prototype L-7, in the frozen garden dome, and beat the Sentinel sent to take her.',
        "Learned where Brushes came from: unit B-1, scrapped for improvising. Lyra is built from his recordings.",
        f.proto_returned && 'Sent Lyra back to Dr Sato, who cancelled the buyer.',
        f.proto_free && 'Set Lyra free in the network, to play the wrong note at the right time.',
        f.lyra_joined && 'Lyra joined the Hi-Hat as its conductor.'
      ]
    },
    {
      n: '06', side: 'B', name: 'Mister Nocturne', where: 'Titan, the Lyceum', done: done('nocturne'), started: f.bounty_nocturne,
      notes: [
        'Crossed the Lyceum backstage in the dark between spotlight cues, mid-show, and dropped the Halcyon through the stage.',
        'Learned the four bars are the first four of five: "Halcyon", written by Mae Halloway, Old Sol\'s teacher.',
        'Brought Mister Nocturne in, and forty-one stolen instruments with him.',
        f.piano_sol && 'Sent the Halcyon home with Old Sol, who played you the fifth bar.',
        f.piano_kept && 'Kept the Halcyon aboard the Hi-Hat. Old Sol taught Brushes the fifth bar.',
        f.piano_sold && 'Sold the Halcyon. The Conductor was the buyer.'
      ]
    },
    {
      n: '07', side: 'C', name: 'The Conductor', where: 'Cygnus Station, Helix Salvage', done: flag('metronome_done'), started: f.bounty_conductor,
      notes: [
        'Crossed Cygnus Station under lockdown, with a price on every face in the crew.',
        f.gate_open && (f.std_office ? 'Marshal Okoro of the Bounty Office opened the checkpoint for you.' : 'Cass Marlowe talked the checkpoint open.'),
        f.hatch_open && "Benny Banda, Ozzie's cousin, opened the service run under the plaza.",
        f.shutter_open && 'Ferro and the Iron Mantis tore open the east shutter.',
        'Beat Silas Crane, the Metronome, in Director Hale\'s office.',
        'Learned the Conductor is Ambrose Hale: Helix\'s founder, Hale\'s father and the student Mae Halloway sent away before the fifth bar.',
        f.hale_ally && 'Took Director Hale aboard the Hi-Hat. She brought the Blue Note docking codes.',
        f.hale_office && 'Handed Director Hale to the Bounty Office. She gave you the Blue Note docking codes first.',
        f.hale_free && 'Let Director Hale walk away. She left you the Blue Note docking codes.'
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
    ['rook', 'tam', 'brushes'].filter(k => f['chat_' + k]).length === 3 && 'Made time for every one of the original crew.',
    f.rook_s2 && (f.cass_free ? 'Stood by Rook while he let his old partner Cass Marlowe walk free.' : 'Stood by Rook while he brought his old partner Cass Marlowe in.'),
    (f.up_workshop || f.up_booth || f.up_engine) && `Fitted out the Hi-Hat: ${[f.up_workshop && "Tam's workshop", f.up_booth && 'a recording booth', f.up_engine && 'a bigger engine'].filter(Boolean).join(', ')}.`,
    state.jobsDone >= 3 && `Took ${state.jobsDone} odd jobs between bounties.`
  ].filter(Boolean);
}

function html({ finale, side }) {
  const p = state.player, temp = temperament(p);
  const crew = CREW_KEYS.filter(k => k !== 'captain' && available(k));
  side ||= flag('act3_open') ? 'C' : flag('act1_done') ? 'B' : 'A';
  const all = tracks(), sideB = side === 'B', sideC = side === 'C';
  const ts = all.filter(t => (t.side || 'A') === side);
  const off = offClock();
  const sideA = all.filter(t => !t.side);
  return `<div class="liner">
    <header class="ln-head">
      <p class="ln-side">${sideC ? 'The Encore' : sideB ? 'Side B' : 'Side A'}</p>
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
    ${sideC ? `<section class="ln-sec ln-next"><h3>Sides A and B, in short</h3>
      <p>${esc(all.filter(t => t.side !== 'C' && t.done).map(t => `${t.n} ${t.name}`).join(' · '))}. ${flag('fifth_bar') ? 'You know the fifth bar.' : 'You never heard the fifth bar.'}</p></section>
      <section class="ln-sec ln-next"><h3>Still to come in the Encore</h3><p>${flag('metronome_done') ? '' : '07 · The Conductor &nbsp; '}08 · Blue Note &nbsp; 09 · Last Set</p></section>`
      : sideB && finale ? `<section class="ln-sec ln-next"><h3>Coming up: the Encore</h3>
      <p>07 · The Conductor &nbsp; 08 · Blue Note &nbsp; 09 · Last Set. ${flag('fifth_bar') ? 'And you know something he does not: the fifth bar.' : 'And he knows exactly where you are.'}</p></section>`
      : sideB ? `<section class="ln-sec ln-next"><h3>Side A, in short</h3>
      <p>${sideA.map(t => `${t.n} · ${esc(t.name)}`).join(' &nbsp; ')}: ${esc(sideA.flatMap(t => t.notes).filter(n => /Juno|core|Rhea/.test(n)).join(' '))}</p></section>
      <section class="ln-sec ln-next"><h3>${flag('act2_done') ? 'Coming up: the Encore' : 'Still to come on Side B'}</h3><p>${flag('act2_done') ? '07 · The Conductor &nbsp; 08 · Blue Note &nbsp; 09 · Last Set' : `${flag('proto_done') ? '' : '05 · Runaway Prototype &nbsp; '}${flag('nocturne_done') ? '' : '06 · Mister Nocturne &nbsp; '}and the Conductor, still listening.`}</p></section>`
      : finale ? `<section class="ln-sec ln-next"><h3>Coming up on Side B</h3>
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

// The full-screen version at the end of a side.
function finaleRecap(side = 'A') {
  return new Promise(resolve => {
    block();
    const node = el(`<div class="recap-screen" role="dialog" aria-label="Story so far">
      <div class="recap-scroll">${html({ finale: true, side })}
        <div class="recap-btns"><button class="btn primary big" type="button" data-flip>${side === 'A' ? 'Flip the record' : 'Wait for the encore'}</button></div>
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

// Act 2 finale: the Conductor names the Hi-Hat a loose end, then the Side B liner notes. Plays once per save.
let playing2 = false;
export async function playFinale2() {
  if (playing2 || flag('act2_done') || !flag('nocturne_done')) return;
  playing2 = true;
  await playCut('act2_finale', { restoreMood: false });
  Audio.setMood('finale');
  await finaleRecap('B');
  setFlag('act2_done');
  Audio.setMood('ship');
  const ok = saveGame();
  Hud.refresh();
  playing2 = false;
  setTimeout(() => toast(ok ? 'Side B complete. Game saved.' : 'Side B complete.'), 300);
  setTimeout(playAct3Open, 2600);
}

// Act 3 opens: the Conductor puts a price on the crew. Plays once per save, on the ship.
let playing3 = false;
export async function playAct3Open() {
  if (playing3 || flag('act3_open') || !flag('act2_done') || state.location !== 'ship') return;
  playing3 = true;
  await playCut('hunted', { restoreMood: false });
  setFlag('act3_open');
  Audio.setMood('ship');
  saveGame();
  Hud.refresh();
  playing3 = false;
  setTimeout(() => toast('New on the bounty board: The Conductor'), 400);
}
