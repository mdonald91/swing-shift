// Panels opened over the world: bounty board, the ship menu, crew, settings, jukebox.
import { BOUNTIES } from '../data/bounties.js';
import { CREW, CAPTAIN_ROLES } from '../data/crew.js';
import { TRACKS } from '../data/music.js';
import { temperament, OUTFITS } from '../data/appearance.js';
import { playerPortrait, npcPortrait } from '../art/portrait.js';
import { state, settings, saveGame, saveSettings, setFlag, formatTime } from '../state.js';
import { Audio } from '../systems/audio.js';
import { el, esc, openModal, toast, leaveWorld } from './ui.js';
import { Hud } from './hud.js';
import { Title } from './title.js';

const money = n => '₡ ' + n.toLocaleString('en-AU');
const head = (title, jp) => `<header class="panel-head"><h2>${title}</h2>${jp ? `<span class="jp">${jp}</span>` : ''}<button class="x" type="button" data-close aria-label="Close">✕</button></header>`;
const wireClose = (node, m) => node.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => m.close()));

/* ---------------- Bounty board ---------------- */
export function openBoard() {
  Audio.sfx('confirm');
  let tab = 'available', selected = null;
  const node = el(`<div class="panel board">
    ${head('Bounty board', '賞金首リスト')}
    <div class="tabs" role="tablist">
      <button type="button" role="tab" data-tab="available">Available</button>
      <button type="button" role="tab" data-tab="active">In progress</button>
      <button type="button" role="tab" data-tab="done">Completed</button>
    </div>
    <div class="board-body"><ul class="b-list"></ul><aside class="b-detail"></aside></div>
  </div>`);
  const m = openModal(node);
  wireClose(node, m);
  const listEl = node.querySelector('.b-list'), detailEl = node.querySelector('.b-detail');

  const status = b => state.bounties[b.id] || (b.unlock ? 'locked' : 'open');
  const inTab = b => {
    const s = status(b);
    return tab === 'available' ? (s === 'open' || s === 'locked') : s === tab;
  };

  function render() {
    node.querySelectorAll('[data-tab]').forEach(t => t.setAttribute('aria-selected', t.dataset.tab === tab));
    const items = BOUNTIES.filter(inTab);
    if (!items.find(b => b.id === selected)) selected = items[0]?.id || null;
    listEl.innerHTML = items.length ? items.map(b => {
      const s = status(b);
      return `<li><button type="button" class="b-row ${s === 'locked' ? 'locked' : ''} ${b.id === selected ? 'sel' : ''}" data-id="${b.id}">
        <span class="b-thumb">${npcPortrait(b.portrait)}</span>
        <span class="b-main"><b>${esc(b.name)}</b><small>${esc(b.sub)}</small></span>
        <span class="b-reward">${money(b.reward)}</span>
        <span class="risk r-${b.risk}" title="Risk ${b.risk}">${b.risk}</span>
      </button></li>`;
    }).join('') : `<li class="b-empty">${tab === 'active' ? 'No contract in progress. Pick one from Available.' : 'Nothing finished yet. Your first payday is out there.'}</li>`;
    listEl.querySelectorAll('.b-row').forEach(r => r.addEventListener('click', () => { selected = r.dataset.id; Audio.sfx('move'); render(); }));
    renderDetail();
  }

  function renderDetail() {
    const b = BOUNTIES.find(x => x.id === selected);
    if (!b) { detailEl.innerHTML = `<p class="muted">Select a contract.</p>`; return; }
    const s = status(b);
    const anyActive = BOUNTIES.some(x => state.bounties[x.id] === 'active');
    let action;
    if (s === 'locked') action = `<p class="lock">${esc(b.unlock)}</p>`;
    else if (s === 'active') action = `<p class="ok">In progress. Plot a course in the cockpit.</p>`;
    else if (s === 'done') action = `<p class="ok">Completed.</p>`;
    else if (anyActive) action = `<p class="lock">Finish your current contract first.</p>`;
    else action = `<button class="btn primary" type="button" data-accept>Accept contract</button>`;
    detailEl.innerHTML = `
      <p class="eyebrow">Target · ${esc(b.track)}</p>
      <div class="d-top"><span class="d-pt">${npcPortrait(b.portrait)}</span>
        <dl>
          <dt>Name</dt><dd>${esc(b.name)}</dd>
          <dt>Client</dt><dd>${esc(b.client)}</dd>
          <dt>Wanted</dt><dd>${esc(b.wanted)}</dd>
          <dt>Reward</dt><dd class="gold">${money(b.reward)}</dd>
          <dt>Risk</dt><dd><span class="risk r-${b.risk}">${b.risk}</span> ${{ A: 'High', B: 'Moderate', C: 'Low' }[b.risk]}</dd>
        </dl></div>
      <p class="d-desc">${esc(b.desc)}</p>
      ${action}`;
    const acc = detailEl.querySelector('[data-accept]');
    if (acc) acc.addEventListener('click', () => {
      state.bounties[b.id] = 'active';
      setFlag('bounty_' + b.id);
      Audio.sfx('confirm');
      toast(`Contract accepted: ${b.name}`);
      Hud.refresh();
      tab = 'active'; render();
    });
  }

  node.querySelectorAll('[data-tab]').forEach(t => t.addEventListener('click', () => { tab = t.dataset.tab; Audio.sfx('move'); render(); }));
  render();
}

/* ---------------- The ship menu ---------------- */
export function openPauseMenu() {
  Audio.sfx('confirm');
  const p = state.player;
  const node = el(`<div class="panel shipmenu">
    ${head('The ship', 'ハイハット号')}
    <div class="sm-body">
      <nav class="sm-nav">
        <button type="button" data-go="crew" autofocus>Crew</button>
        <button type="button" data-go="bounties">Bounties</button>
        <button type="button" data-go="save">Save</button>
        <button type="button" data-go="settings">Settings</button>
        <button type="button" data-go="title">Title screen</button>
      </nav>
      <div class="sm-card">
        <span class="sm-pt">${playerPortrait(p)}</span>
        <div class="sm-info">
          <p class="eyebrow">Captain</p>
          <b class="sm-name">${esc(p.name)}</b>
          <dl>
            <dt>Temperament</dt><dd>${esc(temperament(p))}</dd>
            <dt>Chits</dt><dd class="gold">${money(state.chits)}</dd>
            <dt>Played</dt><dd>${formatTime(state.playtime)}</dd>
            <dt>Save slot</dt><dd>${state.slot + 1}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>`);
  const m = openModal(node);
  wireClose(node, m);
  node.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => {
    const go = b.dataset.go;
    if (go === 'crew') openCrew();
    else if (go === 'bounties') { m.close(true); openBoard(); }
    else if (go === 'save') { const ok = saveGame(); Audio.sfx('save'); toast(ok ? `Saved to slot ${state.slot + 1}` : "Couldn't save: this browser is blocking storage"); }
    else if (go === 'settings') openSettings();
    else if (go === 'title') confirmTitle(b);
  }));
}

function confirmTitle(btn) {
  if (btn.dataset.armed) { leaveWorld(); Title.show(); return; }
  btn.dataset.armed = '1';
  btn.textContent = 'Tap again (unsaved progress is lost)';
  setTimeout(() => { if (btn.isConnected) { delete btn.dataset.armed; btn.textContent = 'Title screen'; } }, 3000);
}

/* ---------------- Crew ---------------- */
function openCrew() {
  Audio.sfx('confirm');
  const p = state.player, cap = CAPTAIN_ROLES[temperament(p)];
  const cards = [
    { name: p.name, role: `Captain · ${cap.role}`, pt: playerPortrait(p), hp: 110, sp: 50, skills: cap.skills, bio: `${OUTFITS[p.outfit].n}. ${temperament(p)} under pressure.`, color: 'var(--mustard)' },
    ...['rook', 'tam', 'brushes'].map(id => ({ name: CREW[id].name, role: CREW[id].role, pt: npcPortrait(id), hp: CREW[id].hp, sp: CREW[id].sp, skills: CREW[id].skills, bio: CREW[id].bio, color: CREW[id].color }))
  ];
  const node = el(`<div class="panel crew">
    ${head('Crew', 'クルー')}
    <div class="crew-grid">${cards.map(c => `
      <article class="crew-card" style="--c:${c.color}">
        <span class="cc-pt">${c.pt}</span>
        <div class="cc-info">
          <b>${esc(c.name)}</b><small>${esc(c.role)}</small>
          <div class="stat"><span>HP</span><i class="bar hp"><i style="width:100%"></i></i><em>${c.hp}</em></div>
          <div class="stat"><span>SP</span><i class="bar sp"><i style="width:100%"></i></i><em>${c.sp}</em></div>
          <p class="skills">${c.skills.map(s => `<span>${esc(s)}</span>`).join('')}</p>
          <p class="bio">${esc(c.bio)}</p>
        </div>
      </article>`).join('')}</div>
  </div>`);
  const m = openModal(node);
  wireClose(node, m);
}

/* ---------------- Settings ---------------- */
export function openSettings({ fromTitle } = {}) {
  Audio.sfx('confirm');
  const node = el(`<div class="panel settings">
    ${head('Settings', '設定')}
    <div class="set-body">
      <label class="set-row" for="set-music"><span>Music</span><input id="set-music" type="range" min="0" max="1" step="0.05" value="${settings.music}"></label>
      <label class="set-row" for="set-sfx"><span>Sound effects</span><input id="set-sfx" type="range" min="0" max="1" step="0.05" value="${settings.sfx}"></label>
      <label class="set-row" for="set-suno"><span>Use my Suno tracks</span><input id="set-suno" type="checkbox" ${settings.suno ? 'checked' : ''}></label>
      <label class="set-row" for="set-text"><span>Text speed</span>
        <select id="set-text"><option value="1" ${settings.textSpeed < 2 ? 'selected' : ''}>Normal</option><option value="2" ${settings.textSpeed >= 2 ? 'selected' : ''}>Fast</option></select></label>
      <p class="muted small">Suno tracks go in the game's music folder as title.mp3, ship.mp3, tense.mp3, battle.mp3 and victory.mp3. Any that are missing are played by the house band.</p>
    </div>
  </div>`);
  const m = openModal(node);
  wireClose(node, m);
  const upd = () => {
    settings.music = +node.querySelector('#set-music').value;
    settings.sfx = +node.querySelector('#set-sfx').value;
    settings.suno = node.querySelector('#set-suno').checked;
    settings.textSpeed = +node.querySelector('#set-text').value;
    saveSettings(); Audio.volumes();
  };
  node.querySelectorAll('input,select').forEach(i => i.addEventListener('input', upd));
  node.querySelector('#set-sfx').addEventListener('change', () => Audio.sfx('tick'));
  return m;
}

/* ---------------- Jukebox ---------------- */
export function openJukebox() {
  Audio.sfx('confirm');
  const node = el(`<div class="panel jukebox">
    ${head("Brushes' record collection", 'ジュークボックス')}
    <ul class="jb-list"></ul>
    <p class="muted small">Picks stick until you leave the ship.</p>
  </div>`);
  const m = openModal(node);
  wireClose(node, m);
  const list = node.querySelector('.jb-list');
  const render = () => {
    list.innerHTML = Object.entries(TRACKS).map(([k, t]) => `
      <li><button type="button" class="jb-row ${Audio.mood === k ? 'sel' : ''}" data-k="${k}">
        <span class="jb-disc" aria-hidden="true"></span>
        <span class="jb-main"><b>${esc(t.label)}</b><small>${Audio.isSuno(k) ? 'Your Suno track' : Audio.sunoMissing(k) || !settings.suno ? 'House band' : 'Suno track if present, else house band'}</small></span>
        ${Audio.mood === k ? '<em>Playing</em>' : ''}
      </button></li>`).join('');
    list.querySelectorAll('.jb-row').forEach(r => r.addEventListener('click', () => { Audio.init(); Audio.setMood(r.dataset.k); Audio.sfx('tick'); setTimeout(render, 400); render(); }));
  };
  render();
}
