// Panels opened over the world: bounty board, the ship menu, crew, settings, jukebox.
import { BOUNTIES } from '../data/bounties.js';
import { CREW, CAPTAIN_ROLES } from '../data/crew.js';
import { TRACKS } from '../data/music.js';
import { temperament, OUTFITS } from '../data/appearance.js';
import { playerPortrait, npcPortrait } from '../art/portrait.js';
import { state, settings, saveGame, saveSettings, setFlag, formatTime } from '../state.js';
import { SHOPS, GEAR, FACTIONS, tier } from '../data/shop.js';
import { ITEMS, SKILLS, CAPTAIN_SKILLS } from '../data/battles.js';
import { crewStats, ownsGear, BOND_HP, BOND_ATK, available, activeParty } from '../systems/party.js';
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

  const status = b => state.bounties[b.id] || (b.requires ? (state.flags[b.requires] ? 'open' : 'locked') : b.unlock ? 'locked' : 'open');
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
    if (s === 'locked') action = `<p class="lock">${esc(b.id === 'courier' && state.flags.ghost_done ? 'Track 03 arrives in the next build' : b.unlock)}</p>`;
    else if (s === 'active') action = `<p class="ok">In progress. Fly to the target from the cockpit.</p>`;
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
        <button type="button" data-go="bag">Bag</button>
        <button type="button" data-go="standing">Standing</button>
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
    else if (go === 'bag') openBag();
    else if (go === 'standing') openStanding();
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
function openCrew(quiet) {
  if (!quiet) Audio.sfx('confirm');
  const party = activeParty();
  const p = state.player, temp = temperament(p), cap = CAPTAIN_ROLES[temp];
  const cards = [
    { key: 'captain', name: p.name, role: `Captain · ${cap.role}`, pt: playerPortrait(p), skills: CAPTAIN_SKILLS[temp], bio: `${OUTFITS[p.outfit].n}. ${temp} under pressure.`, color: 'var(--mustard)' },
    ...['rook', 'tam', 'brushes', 'rhea'].filter(available).map(id => ({ key: id, name: CREW[id].name, role: CREW[id].role, pt: npcPortrait(id), skills: CREW[id].skillKeys, bio: CREW[id].bio, color: CREW[id].color }))
  ].map(c => ({ ...c, st: crewStats(c.key) }));
  const node = el(`<div class="panel crew">
    ${head('Crew', 'クルー')}
    <div class="crew-grid">${cards.map(c => `
      <article class="crew-card" style="--c:${c.color}">
        <span class="cc-pt">${c.pt}</span>
        <div class="cc-info">
          <b>${esc(c.name)}</b><small>${esc(c.role)}</small>
          <p class="cc-stats"><span>HP <b>${c.st.hp}</b></span><span>SP <b>${c.st.sp}</b></span><span>ATK <b>${c.st.atk}</b></span><span>DEF <b>${c.st.def}</b></span></p>
          ${c.key === 'captain' ? '<p class="cc-party lead">Leads every fight</p>' : `<button class="cc-party ${party.includes(c.key) ? 'on' : ''}" type="button" data-p="${c.key}">${party.includes(c.key) ? 'In the party' : 'On the bench'}</button>`}
          ${c.key === 'captain' ? '' : `<p class="bond" title="Bond">${[0, 1, 2].map(i => `<i class="${i < c.st.bond ? 'on' : ''}"></i>`).join('')}<span>Bond ${c.st.bond}</span></p>`}
          <p class="skills">${(c.skills || []).map(k => `<span>${esc(SKILLS[k]?.n || k)}</span>`).join('')}</p>
          <p class="bio">${esc(c.bio)}</p>
        </div>
      </article>`).join('')}</div>
    <p class="muted small panel-foot">Three crew fight beside you: tap a card's button to swap. Bond grows when you make time for your crew between jobs; each level adds ${BOND_HP} HP and ${BOND_ATK} ATK.</p>
  </div>`);
  const m = openModal(node);
  wireClose(node, m);
  node.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.p;
    let p = activeParty();
    if (p.includes(k)) {
      if (p.length <= 1) return;
      p = p.filter(x => x !== k);
    } else {
      if (p.length >= 3) { toast('The party is full. Bench someone first.'); Audio.sfx('back'); return; }
      p.push(k);
    }
    state.party = p;
    Audio.sfx('tick');
    m.close(true); openCrew(true);
  }));
}

/* ---------------- Bag ---------------- */
function openBag() {
  Audio.sfx('confirm');
  const items = Object.entries(state.items).filter(([k, n]) => n > 0 && ITEMS[k]);
  const gear = GEAR.filter(g => ownsGear(g.id));
  const node = el(`<div class="panel bag">
    ${head('Bag', '持ち物')}
    <div class="bag-body">
      <section><p class="eyebrow">Supplies</p>
        ${items.length ? `<ul class="bag-list">${items.map(([k, n]) => `<li><b>${esc(ITEMS[k].n)}</b><span class="muted">${esc(ITEMS[k].d)}</span><em>×${n}</em></li>`).join('')}</ul>` : '<p class="muted">Nothing. Tam has hidden the noodles again.</p>'}
      </section>
      <section><p class="eyebrow">Gear</p>
        ${gear.length ? `<ul class="bag-list">${gear.map(g => `<li><b>${esc(g.n)}</b><span class="muted">${esc(g.d)}</span><em>Equipped</em></li>`).join('')}</ul>` : '<p class="muted">No upgrades yet. The supply terminal in the galley sells them.</p>'}
      </section>
      <p class="chits-line">Chits: <b class="gold">${money(state.chits)}</b></p>
    </div>
  </div>`);
  const m = openModal(node);
  wireClose(node, m);
}

/* ---------------- Standing ---------------- */
function openStanding() {
  Audio.sfx('confirm');
  const node = el(`<div class="panel standing">
    ${head('Standing', '評判')}
    <ul class="st-list">${Object.entries(FACTIONS).map(([k, f]) => {
      const v = state.rep[k] || 0;
      const pct = Math.max(0, Math.min(100, (v + 1) / 6 * 100));
      return `<li><div class="st-top"><b>${esc(f.n)}</b><span class="st-tier">${tier(v)}</span></div>
        <i class="bar st"><i style="width:${pct}%"></i></i><p class="muted small">${esc(f.d)}</p></li>`;
    }).join('')}</ul>
    <p class="muted small panel-foot">How you treat people changes how they treat you: prices, tips and the jobs they offer.</p>
  </div>`);
  const m = openModal(node);
  wireClose(node, m);
}

/* ---------------- Shops ---------------- */
export function openShop(id) {
  const shop = SHOPS[id]; if (!shop) return;
  Audio.sfx('confirm');
  let tab = 'items';
  const d = shop.discount;
  const off = d && (state.rep[d.rep] || 0) >= d.min ? d.off : 0;
  const price = p => Math.round(p * (1 - off));
  const node = el(`<div class="panel shop">
    ${head(esc(shop.name), shop.jp)}
    <div class="shop-greet"><span class="shop-pt">${npcPortrait(shop.keeper)}</span><p>${esc(shop.greet)}${off ? ` <b class="gold">Friend price: ${Math.round(off * 100)}% off.</b>` : ''}</p></div>
    <div class="tabs" role="tablist">
      <button type="button" role="tab" data-tab="items">Supplies</button>
      ${shop.gear.length ? '<button type="button" role="tab" data-tab="gear">Gear</button>' : ''}
      <span class="shop-chits gold"></span>
    </div>
    <ul class="shop-list"></ul>
  </div>`);
  const m = openModal(node);
  wireClose(node, m);
  const list = node.querySelector('.shop-list');
  function render() {
    node.querySelectorAll('[data-tab]').forEach(t => t.setAttribute('aria-selected', t.dataset.tab === tab));
    node.querySelector('.shop-chits').textContent = money(state.chits);
    if (tab === 'items') {
      list.innerHTML = shop.items.map(k => {
        const it = ITEMS[k], cost = price(it.price);
        return `<li class="shop-row"><div class="sr-main"><b>${esc(it.n)}</b><small>${esc(it.d)}</small></div>
          <span class="sr-own">Have ${state.items[k] || 0}</span><span class="sr-price">${money(cost)}</span>
          <button class="btn" type="button" data-buy="${k}" ${state.chits < cost ? 'disabled' : ''}>Buy</button></li>`;
      }).join('');
    } else {
      list.innerHTML = shop.gear.map(gid => {
        const g = GEAR.find(x => x.id === gid), cost = price(g.price), own = ownsGear(g.id);
        return `<li class="shop-row"><div class="sr-main"><b>${esc(g.n)}</b><small>${esc(g.d)}</small></div>
          <span class="sr-own">${own ? 'Owned' : ''}</span><span class="sr-price">${own ? '' : money(cost)}</span>
          ${own ? '<span class="sr-done">✓</span>' : `<button class="btn" type="button" data-gear="${g.id}" ${state.chits < cost ? 'disabled' : ''}>Buy</button>`}</li>`;
      }).join('');
    }
    list.querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.buy, cost = price(ITEMS[k].price);
      if (state.chits < cost) return;
      state.chits -= cost; state.items[k] = (state.items[k] || 0) + 1;
      Audio.sfx('save'); toast(`Bought a ${ITEMS[k].n}`); Hud.refresh(); render();
    }));
    list.querySelectorAll('[data-gear]').forEach(b => b.addEventListener('click', () => {
      const g = GEAR.find(x => x.id === b.dataset.gear), cost = price(g.price);
      if (state.chits < cost || ownsGear(g.id)) return;
      state.chits -= cost; state.gear = [...(state.gear || []), g.id];
      Audio.sfx('save'); toast(`${g.n} equipped`); Hud.refresh(); render();
    }));
  }
  node.querySelectorAll('[data-tab]').forEach(t => t.addEventListener('click', () => { tab = t.dataset.tab; Audio.sfx('move'); render(); }));
  render();
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
    const tracks = Object.entries(TRACKS).filter(([k, t]) => !t.unlock || state.flags[t.unlock]);
    list.innerHTML = tracks.map(([k, t]) => `
      <li><button type="button" class="jb-row ${Audio.mood === k ? 'sel' : ''}" data-k="${k}">
        <span class="jb-disc" aria-hidden="true"></span>
        <span class="jb-main"><b>${esc(t.label)}</b><small>${Audio.isSuno(k) ? 'Your Suno track' : Audio.sunoMissing(k) || !settings.suno ? 'House band' : 'Suno track if present, else house band'}</small></span>
        ${Audio.mood === k ? '<em>Playing</em>' : ''}
      </button></li>`).join('');
    list.querySelectorAll('.jb-row').forEach(r => r.addEventListener('click', () => { Audio.init(); Audio.setMood(r.dataset.k); Audio.sfx('tick'); setTimeout(render, 400); render(); }));
  };
  render();
}
