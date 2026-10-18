// Panels opened over the world: bounty board, the ship menu, crew, settings, jukebox.
import { BOUNTIES } from '../data/bounties.js';
import { CREW, CAPTAIN_ROLES } from '../data/crew.js';
import { TRACKS } from '../data/music.js';
import { temperament, OUTFITS } from '../data/appearance.js';
import { playerPortrait, npcPortrait } from '../art/portrait.js';
import { state, settings, saveGame, saveSettings, setFlag, formatTime, allSlots, SLOT_COUNT } from '../state.js';
import { MAPS } from '../data/maps.js';
import { openRecap } from './recap.js';
import { SHOPS, GEAR, FACTIONS, tier } from '../data/shop.js';
import { ITEMS, SKILLS, TREES, TIERS, TYPES, RELEARN_COST, xpToNext, MAX_LEVEL } from '../data/battles.js';
import { crewStats, ownsGear, BOND_HP, BOND_ATK, available, activeParty, level, pendingPicks, learn } from '../systems/party.js';
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
    if (b.showIf && !state.flags[b.showIf]) return false;
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
        <button type="button" data-go="crew" autofocus>Crew${['captain', 'rook', 'tam', 'brushes', 'rhea'].some(k => (k === 'captain' || available(k)) && pendingPicks(k)) ? ' <em class="dot">New skill</em>' : ''}</button>
        <button type="button" data-go="bag">Bag</button>
        <button type="button" data-go="standing">Standing</button>
        <button type="button" data-go="bounties">Bounties</button>
        <button type="button" data-go="story">Story so far</button>
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
    else if (go === 'save') openSavePicker(m);
    else if (go === 'story') openRecap();
    else if (go === 'settings') openSettings();
    else if (go === 'title') confirmTitle(b);
  }));
}

/* ---------------- Save anywhere ---------------- */
function openSavePicker(menu) {
  Audio.sfx('confirm');
  const slots = allSlots();
  const node = el(`<div class="panel savepick">
    ${head('Save', 'セーブ')}
    <div class="sp-body">
      <p class="muted small">You can save anywhere. You're playing in slot ${state.slot + 1}; autosave writes there too.</p>
      <div class="slot-list">${Array.from({ length: SLOT_COUNT }, (_, i) => {
        const sv = slots[i];
        return `<button type="button" class="slot ${sv ? '' : 'empty'} ${i === state.slot ? 'current' : ''}" data-i="${i}">
          <span class="slot-n">${i + 1}</span>
          ${sv ? `<span class="slot-pt">${playerPortrait(sv.player)}</span>
            <span class="slot-main"><b>${esc(sv.player.name)}${i === state.slot ? ' <em class="dot">This game</em>' : ''}</b><small>${esc((MAPS[sv.location] || MAPS.ship).name)} · ${formatTime(sv.playtime)} played</small>
            <small class="when">${new Date(sv.savedAt).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}</small></span>`
            : '<span class="slot-main"><b>Empty</b><small>Save a copy here</small></span>'}
        </button>`;
      }).join('')}</div>
    </div>
  </div>`);
  const m = openModal(node);
  wireClose(node, m);
  node.querySelectorAll('.slot').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.i, sv = slots[i];
    // overwriting a different captain's save needs a second tap
    if (sv && i !== state.slot && !b.dataset.armed) {
      b.dataset.armed = '1';
      b.querySelector('.slot-main small').textContent = `Tap again to overwrite ${sv.player.name}`;
      Audio.sfx('tick'); return;
    }
    const ok = saveGame(i);
    Audio.sfx(ok ? 'save' : 'clam');
    toast(ok ? `Saved to slot ${i + 1}` : "Couldn't save: this browser is blocking storage");
    m.close(true); menu?.close(true);
  }));
  setTimeout(() => node.querySelector('.slot.current')?.focus({ preventScroll: true }), 40);
}

function confirmTitle(btn) {
  if (btn.dataset.armed) { leaveWorld(); Title.show(); return; }
  btn.dataset.armed = '1';
  btn.textContent = 'Tap again (progress since your last save is lost)';
  setTimeout(() => { if (btn.isConnected) { delete btn.dataset.armed; btn.textContent = 'Title screen'; } }, 3000);
}

/* ---------------- Crew ---------------- */
function openCrew(quiet) {
  if (!quiet) Audio.sfx('confirm');
  const party = activeParty();
  const p = state.player, temp = temperament(p), cap = CAPTAIN_ROLES[temp];
  const cards = [
    { key: 'captain', name: p.name, role: `Captain · ${cap.role}`, pt: playerPortrait(p), bio: `${OUTFITS[p.outfit].n}. ${temp} under pressure.`, color: 'var(--mustard)' },
    ...['rook', 'tam', 'brushes', 'rhea'].filter(available).map(id => ({ key: id, name: CREW[id].name, role: CREW[id].role, pt: npcPortrait(id), bio: CREW[id].bio, color: CREW[id].color }))
  ].map(c => ({ ...c, st: crewStats(c.key) }));
  const node = el(`<div class="panel crew">
    ${head('Crew', 'クルー')}
    <div class="crew-grid">${cards.map(c => `
      <article class="crew-card" style="--c:${c.color}">
        <span class="cc-pt">${c.pt}</span>
        <div class="cc-info">
          <b>${esc(c.name)}</b><small>${esc(c.role)}</small>
          <div class="cc-lv"><span>Lv ${c.st.lv}</span><i class="bar xp"><i style="width:${xpPct(c.key)}%"></i></i><em>${xpText(c.key)}</em></div>
          <p class="cc-stats"><span>HP <b>${c.st.hp}</b></span><span>SP <b>${c.st.sp}</b></span><span>ATK <b>${c.st.atk}</b></span><span>DEF <b>${c.st.def}</b></span></p>
          ${c.key === 'captain' ? '<p class="cc-party lead">Leads every fight</p>' : `<button class="cc-party ${party.includes(c.key) ? 'on' : ''}" type="button" data-p="${c.key}">${party.includes(c.key) ? 'In the party' : 'On the bench'}</button>`}
          ${c.key === 'captain' ? '' : `<p class="bond" title="Bond">${[0, 1, 2].map(i => `<i class="${i < c.st.bond ? 'on' : ''}"></i>`).join('')}<span>Bond ${c.st.bond}</span></p>`}
          <p class="skills">${c.st.skills.map(k => `<span>${esc(SKILLS[k]?.n || k)}</span>`).join('')}</p>
          <button class="cc-tree ${pendingPicks(c.key) ? 'new' : ''}" type="button" data-tree="${c.key}">${pendingPicks(c.key) ? `Learn a new skill (${pendingPicks(c.key)})` : 'Skill tree'}</button>
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
  node.querySelectorAll('[data-tree]').forEach(b => b.addEventListener('click', () => { m.close(true); openTree(b.dataset.tree); }));
}

function xpPct(k) { const L = state.levels?.[k] || { lv: 1, xp: 0 }; return L.lv >= MAX_LEVEL ? 100 : Math.round(L.xp / xpToNext(L.lv) * 100); }
function xpText(k) { const L = state.levels?.[k] || { lv: 1, xp: 0 }; return L.lv >= MAX_LEVEL ? 'Max level' : `${L.xp}/${xpToNext(L.lv)} XP`; }

/* ---------------- Skill tree ---------------- */
function openTree(key) {
  Audio.sfx('confirm');
  const name = key === 'captain' ? state.player.name : CREW[key].short;
  const lv = level(key), picked = state.skills?.[key] || [];
  const node = el(`<div class="panel tree">
    ${head(`${esc(name)} · Skill tree`, 'スキル')}
    <p class="tree-lead muted small">At each level marked below, pick one of two skills. Picks are permanent, but you can relearn them for ₡ ${RELEARN_COST}. ${esc(name)} is level ${lv}.</p>
    <ol class="tree-list">${TREES[key].map((pair, i) => {
      const need = TIERS[i], open = lv >= need, chosen = picked[i];
      return `<li class="tier ${open ? 'open' : 'locked'} ${open && !chosen ? 'pick' : ''}">
        <span class="tier-lv">Lv ${need}</span>
        <div class="tier-opts">${pair.map(sk => {
          const S = SKILLS[sk];
          return `<button type="button" class="opt ${chosen === sk ? 'chosen' : ''} ${chosen && chosen !== sk ? 'other' : ''}" data-tier="${i}" data-sk="${sk}" ${!open || chosen ? 'disabled' : ''}>
            <b>${esc(S.n)}</b><small>${S.cost} SP${S.type ? ' · ' + TYPES[S.type] : ''}</small><span>${esc(S.d)}</span></button>`;
        }).join('<i class="or">or</i>')}</div>
      </li>`;
    }).join('')}</ol>
    <div class="tree-foot">${picked.some(Boolean) ? `<button class="btn ghost" type="button" data-relearn ${state.chits < RELEARN_COST ? 'disabled' : ''}>Relearn all (₡ ${RELEARN_COST})</button>` : ''}<button class="btn" type="button" data-back>Back to crew</button></div>
  </div>`);
  const m = openModal(node);
  wireClose(node, m);
  node.querySelector('[data-back]').addEventListener('click', () => { m.close(true); openCrew(true); });
  node.querySelectorAll('[data-sk]').forEach(b => b.addEventListener('click', () => {
    if (!learn(key, +b.dataset.tier, b.dataset.sk)) return;
    Audio.sfx('save'); toast(`${name} learned ${SKILLS[b.dataset.sk].n}`);
    m.close(true); openTree(key);
  }));
  node.querySelector('[data-relearn]')?.addEventListener('click', e => {
    const btn = e.currentTarget;
    if (!btn.dataset.armed) { btn.dataset.armed = '1'; btn.textContent = `Tap again to forget all picks (₡ ${RELEARN_COST})`; return; }
    if (state.chits < RELEARN_COST) return;
    state.chits -= RELEARN_COST; state.skills[key] = [];
    Audio.sfx('back'); toast(`${name}'s skill picks reset`); Hud.refresh();
    m.close(true); openTree(key);
  });
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
// Body classes for the display options, applied at start-up and whenever they change.
export function applyDisplay() {
  const b = document.body.classList;
  b.toggle('ts-1', settings.textSize === 1); b.toggle('ts-2', settings.textSize >= 2);
  b.toggle('calm-fx', !!settings.reduceShake);
}

const msText = ms => ms === 0 ? '0 ms' : `${ms > 0 ? '+' : '−'}${Math.abs(ms)} ms`;

export function openSettings({ fromTitle } = {}) {
  Audio.sfx('confirm');
  const opt = (v, cur, label) => `<option value="${v}" ${String(v) === String(cur) ? 'selected' : ''}>${label}</option>`;
  const node = el(`<div class="panel settings">
    ${head('Settings', '設定')}
    <div class="set-body">
      <h4 class="set-h">Sound</h4>
      <label class="set-row" for="set-music"><span>Music</span><input id="set-music" type="range" min="0" max="1" step="0.05" value="${settings.music}"></label>
      <label class="set-row" for="set-sfx"><span>Sound effects</span><input id="set-sfx" type="range" min="0" max="1" step="0.05" value="${settings.sfx}"></label>
      <label class="set-row" for="set-suno"><span>Use my Suno tracks</span><input id="set-suno" type="checkbox" ${settings.suno ? 'checked' : ''}></label>

      <h4 class="set-h">Rhythm</h4>
      <div class="set-row"><span>Beat offset<small>Lines your taps up with your speaker or headphones</small></span>
        <span class="set-cal"><button type="button" class="stepper" data-cal="-10" aria-label="Earlier">−</button><b class="cal-v">${msText(settings.calibration)}</b><button type="button" class="stepper" data-cal="10" aria-label="Later">+</button></span></div>
      <div class="set-row set-row-end"><button class="btn ghost small-btn" type="button" data-calibrate>Calibrate by tapping</button></div>
      <label class="set-row" for="set-rhythm"><span>Rhythm mode<small class="rh-note"></small></span>
        <select id="set-rhythm">${opt('normal', settings.rhythm, 'Normal')}${opt('relaxed', settings.rhythm, 'Relaxed')}${opt('auto', settings.rhythm, 'Auto')}</select></label>

      <h4 class="set-h">Display</h4>
      <label class="set-row" for="set-size"><span>Text size</span>
        <select id="set-size">${opt(0, settings.textSize, 'Normal')}${opt(1, settings.textSize, 'Large')}${opt(2, settings.textSize, 'Largest')}</select></label>
      <label class="set-row" for="set-text"><span>Text speed</span>
        <select id="set-text">${opt(1, settings.textSpeed < 2 ? 1 : 2, 'Normal')}${opt(2, settings.textSpeed < 2 ? 1 : 2, 'Fast')}</select></label>
      <label class="set-row" for="set-shake"><span>Less screen shake<small>Softer hits and flashes</small></span><input id="set-shake" type="checkbox" ${settings.reduceShake ? 'checked' : ''}></label>

      <h4 class="set-h">Help</h4>
      <label class="set-row" for="set-tut"><span>Tutorial tips</span><input id="set-tut" type="checkbox" ${settings.tutorials ? 'checked' : ''}></label>
      <label class="set-row" for="set-auto"><span>Autosave<small>Saves to your slot each time you enter a new area</small></span><input id="set-auto" type="checkbox" ${settings.autosave ? 'checked' : ''}></label>
      ${fromTitle ? '' : '<div class="set-row set-row-end"><button class="btn ghost small-btn" type="button" data-retips>Show tutorial tips again</button></div>'}
      <p class="muted small">Suno tracks go in the game's music folder as title.mp3, ship.mp3, tense.mp3, battle.mp3 and victory.mp3. Any that are missing are played by the house band.</p>
    </div>
  </div>`);
  const m = openModal(node);
  wireClose(node, m);
  const RH = { normal: 'Tap on the beat', relaxed: 'Wider timing for every beat', auto: 'The band taps for you (steady, never perfect)' };
  const note = () => { node.querySelector('.rh-note').textContent = RH[settings.rhythm]; };
  note();
  const upd = () => {
    settings.music = +node.querySelector('#set-music').value;
    settings.sfx = +node.querySelector('#set-sfx').value;
    settings.suno = node.querySelector('#set-suno').checked;
    settings.textSpeed = +node.querySelector('#set-text').value;
    settings.textSize = +node.querySelector('#set-size').value;
    settings.reduceShake = node.querySelector('#set-shake').checked;
    settings.rhythm = node.querySelector('#set-rhythm').value;
    settings.tutorials = node.querySelector('#set-tut').checked;
    settings.autosave = node.querySelector('#set-auto').checked;
    saveSettings(); Audio.volumes(); applyDisplay(); note();
  };
  node.querySelectorAll('input,select').forEach(i => i.addEventListener('input', upd));
  node.querySelectorAll('input[type=checkbox],select').forEach(i => i.addEventListener('change', upd));
  node.querySelector('#set-sfx').addEventListener('change', () => Audio.sfx('tick'));
  const showCal = () => { node.querySelector('.cal-v').textContent = msText(settings.calibration); };
  node.querySelectorAll('[data-cal]').forEach(b => b.addEventListener('click', () => {
    settings.calibration = Math.max(-250, Math.min(400, settings.calibration + +b.dataset.cal));
    saveSettings(); showCal(); Audio.sfx('tick');
  }));
  node.querySelector('[data-calibrate]').addEventListener('click', () => openCalibrate(showCal));
  node.querySelector('[data-retips]')?.addEventListener('click', e => {
    Object.keys(state.flags).filter(k => k.startsWith('tut_')).forEach(k => delete state.flags[k]);
    settings.tutorials = true; saveSettings(); node.querySelector('#set-tut').checked = true;
    e.currentTarget.textContent = 'Tips will show again'; e.currentTarget.disabled = true; Audio.sfx('confirm');
  });
  return m;
}

/* ---------------- Beat calibration ---------------- */
// Clicks at 100 BPM on the audio clock; the player taps along to what they hear.
// The median gap between taps and clicks becomes the beat offset.
function openCalibrate(done) {
  Audio.init();
  const SPB = .6, COUNT = 4, TAPS = 12;
  const node = el(`<div class="panel calib">
    ${head('Calibrate', '調整')}
    <div class="cal-body">
      <p>Four clicks count you in. Then tap along to the next ${TAPS} clicks: anywhere on the pad, or Space.</p>
      <p class="muted small">Tap to what you <b>hear</b>, not what you see. If you play through Bluetooth, use it now.</p>
      <button class="cal-pad" type="button" aria-label="Tap pad"><i class="cal-dot"></i><span class="cal-msg">Press start</span></button>
      <div class="cal-dots">${Array.from({ length: TAPS }, () => '<i></i>').join('')}</div>
      <div class="cal-btns"><button class="btn primary" type="button" data-start>Start</button></div>
    </div>
  </div>`);
  let run = null, raf = 0;
  const m = openModal(node, { onClose: () => { stop(); done(); } });
  wireClose(node, m);
  const $ = q => node.querySelector(q);
  const dots = [...node.querySelectorAll('.cal-dots i')];
  function stop() {
    cancelAnimationFrame(raf);
    document.removeEventListener('keydown', onKey, true);
    if (run) { Audio.duck(false); run = null; }
  }
  function start() {
    stop();
    const t0 = Audio.time() + 1;
    run = { clicks: Array.from({ length: COUNT + TAPS }, (_, i) => t0 + i * SPB), taps: [], end: t0 + (COUNT + TAPS) * SPB + .3 };
    run.clicks.forEach((t, i) => Audio.click(t, i < COUNT));
    Audio.duck(true);
    dots.forEach(d => d.className = '');
    $('[data-start]').hidden = true;
    $('.cal-msg').textContent = 'Listen...';
    document.addEventListener('keydown', onKey, true);
    raf = requestAnimationFrame(frame);
  }
  function tap(at) {
    if (!run) return;
    const t = Audio.time(at) - Audio.lag();
    const targets = run.clicks.slice(COUNT);
    let best = -1, bd = 9;
    targets.forEach((c, i) => { const d = t - c; if (Math.abs(d) < Math.abs(bd)) { bd = d; best = i; } });
    if (best < 0 || Math.abs(bd) > SPB * .45 || run.taps.some(x => x.i === best)) return;
    run.taps.push({ i: best, d: bd });
    dots[best].className = 'hit';
    $('.cal-pad').classList.remove('tap'); void $('.cal-pad').offsetWidth; $('.cal-pad').classList.add('tap');
  }
  function frame() {
    if (!run) return;
    const t = Audio.time() - Audio.lag();
    const i = run.clicks.findIndex(c => t >= c && t < c + .12);
    $('.cal-dot').classList.toggle('on', i >= 0);
    if (i >= 0) $('.cal-msg').textContent = i < COUNT ? String(i + 1) : 'Tap!';
    if (t > run.end) return finish();
    raf = requestAnimationFrame(frame);
  }
  function finish() {
    const taps = run.taps.map(x => x.d).sort((a, b) => a - b);
    stop();
    $('[data-start]').hidden = false; $('[data-start]').textContent = 'Try again';
    $('.cal-dot').classList.remove('on');
    if (taps.length < 6) { $('.cal-msg').textContent = 'Not enough taps. Try again?'; Audio.sfx('clam'); return; }
    const mid = taps.length >> 1, med = taps.length % 2 ? taps[mid] : (taps[mid - 1] + taps[mid]) / 2;
    const ms = Math.max(-250, Math.min(400, Math.round(med * 1000 / 5) * 5));
    settings.calibration = ms; saveSettings(); done();
    $('.cal-msg').textContent = `Offset set to ${msText(ms)}`;
    Audio.sfx('save');
    if (!$('.cal-result')) $('.cal-btns').insertAdjacentHTML('beforebegin', '<p class="cal-result muted small"></p>');
    $('.cal-result').textContent = Math.abs(ms) < 25 ? 'Your taps were right on the click. Nice ears.'
      : ms > 0 ? `You heard the clicks about ${ms} ms late, so the beat now waits for your speaker.` : `You tapped about ${-ms} ms early, so the beat now comes a little sooner.`;
  }
  const onKey = e => { if (e.key === ' ' || e.key === 'Enter') { if (run) { e.preventDefault(); e.stopPropagation(); tap(e.timeStamp); } } };
  $('.cal-pad').addEventListener('pointerdown', e => { e.preventDefault(); tap(e.timeStamp); });
  $('[data-start]').addEventListener('click', () => { Audio.sfx('tick'); setTimeout(start, 50); });
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
