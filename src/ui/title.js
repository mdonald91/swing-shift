// Title screen and save-slot picker.
import { allSlots, latestSlot, loadGame, formatTime, SLOT_COUNT } from '../state.js';
import { Audio } from '../systems/audio.js';
import { playerPortrait } from '../art/portrait.js';
import { MAPS } from '../data/maps.js';
import { el, esc, showScreen, startWorld } from './ui.js';
import { Creator } from './creator.js';
import { openSettings } from './menus.js';

let raf = 0;

export const Title = {
  show() {
    Audio.setMood('title');
    const node = el(`<section class="screen title">
      <canvas class="title-bg" aria-hidden="true"></canvas>
      <div class="title-inner">
        <h1 class="logo"><span class="logo-script">Swing</span><span class="logo-block">SHIFT</span></h1>
        <p class="logo-jp">スウィング・シフト</p>
        <p class="tagline">Bounties. Jazz. One more tank of fuel.</p>
        <nav class="title-menu"></nav>
      </div>
      <p class="title-foot">Build 0.5 · Cygnus Station</p>
    </section>`);
    showScreen(node);
    renderMenu(node, Audio.started);
    startBg(node.querySelector('.title-bg'));
  }
};

function renderMenu(node, started) {
  const nav = node.querySelector('.title-menu');
  if (!started) {
    nav.innerHTML = `<button class="btn primary big pulse" type="button" data-a="start">Press start</button>`;
  } else {
    const latest = latestSlot();
    const any = allSlots().some(Boolean);
    nav.innerHTML = `
      ${latest >= 0 ? `<button class="btn primary big" type="button" data-a="continue">Continue</button>` : ''}
      <button class="btn ${latest >= 0 ? '' : 'primary big'}" type="button" data-a="new">New game</button>
      ${any ? `<button class="btn" type="button" data-a="load">Load game</button>` : ''}
      <button class="btn ghost" type="button" data-a="settings">Settings</button>`;
  }
  nav.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.a;
    if (a === 'start') { Audio.init(); Audio.setMood('title', true); Audio.sfx('cymbal'); renderMenu(node, true); return; }
    Audio.sfx('confirm');
    if (a === 'continue') { if (loadGame(latestSlot())) { stopBg(); startWorld(); } }
    else if (a === 'new') slotPicker('new');
    else if (a === 'load') slotPicker('load');
    else if (a === 'settings') openSettings({ fromTitle: true });
  }));
  nav.querySelector('button')?.focus({ preventScroll: true });
}

function slotPicker(mode) {
  stopBg();
  const slots = allSlots();
  const node = el(`<section class="screen slots">
    <div class="slots-inner">
      <p class="eyebrow">${mode === 'new' ? 'New game' : 'Load game'}</p>
      <h2>${mode === 'new' ? 'Pick a save slot' : 'Pick a save'}</h2>
      <div class="slot-list">${Array.from({ length: SLOT_COUNT }, (_, i) => {
        const s = slots[i];
        const disabled = mode === 'load' && !s;
        return `<button type="button" class="slot ${s ? '' : 'empty'}" data-i="${i}" ${disabled ? 'disabled' : ''}>
          <span class="slot-n">${i + 1}</span>
          ${s ? `<span class="slot-pt">${playerPortrait(s.player)}</span>
            <span class="slot-main"><b>${esc(s.player.name)}</b><small>${esc((MAPS[s.location] || MAPS.ship).name)} · ${formatTime(s.playtime)} played</small>
            <small class="when">${new Date(s.savedAt).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}</small></span>`
            : `<span class="slot-main"><b>Empty</b><small>${mode === 'new' ? 'Start a new captain here' : 'No save'}</small></span>`}
        </button>`;
      }).join('')}</div>
      <button class="btn ghost" type="button" data-back>Back</button>
    </div>
  </section>`);
  showScreen(node);
  node.querySelector('[data-back]').addEventListener('click', () => { Audio.sfx('back'); Title.show(); });
  node.querySelectorAll('.slot').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.i;
    if (mode === 'load') { Audio.sfx('confirm'); if (loadGame(i)) startWorld(); return; }
    if (slots[i] && !b.dataset.armed) {
      b.dataset.armed = '1';
      b.querySelector('.slot-main small').textContent = 'Tap again to overwrite this save';
      Audio.sfx('tick');
      return;
    }
    Audio.sfx('confirm');
    Creator.show(i);
  }));
  node.querySelector('.slot:not([disabled])')?.focus({ preventScroll: true });
}

/* ---------------- animated title background ---------------- */
function startBg(cv) {
  stopBg();
  const ctx = cv.getContext('2d');
  const stars = Array.from({ length: 180 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random() * .8 + .2 }));
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t0 = performance.now();
  const frame = now => {
    const t = (now - t0) / 1000;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#07080f'); g.addColorStop(1, '#121a33');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (const s of stars) {
      const x = ((s.x - (reduce ? 0 : t * .006 * s.z)) % 1 + 1) % 1 * w;
      ctx.globalAlpha = s.z; ctx.fillStyle = s.z > .9 ? '#e9b23a' : '#f1e8d4';
      ctx.fillRect(Math.round(x), Math.round(s.y * h), s.z > .7 ? 2 : 1, s.z > .7 ? 2 : 1);
    }
    ctx.globalAlpha = 1;
    // planet limb
    const R = Math.max(w, h) * .9, cx = w * .78, cy = h + R * .62;
    const pg = ctx.createLinearGradient(0, cy - R, 0, cy - R * .62);
    ['#c98a5a', '#f0d6ae', '#b06a40', '#f3dcb4', '#d4935f', '#c23a30', '#e8c49a', '#a9653f', '#f0d6ae', '#b9764b'].forEach((c, i, a) => pg.addColorStop(i / (a.length - 1), c));
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = pg; ctx.fill();
    ctx.globalCompositeOperation = 'source-atop';
    const sh = ctx.createRadialGradient(cx - R * .3, cy - R * 1.1, R * .2, cx, cy, R * 1.05);
    sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(.7, 'rgba(7,8,15,.1)'); sh.addColorStop(1, 'rgba(7,8,15,.55)');
    ctx.fillStyle = sh; ctx.fillRect(0, 0, w, h); ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, R + 3, Math.PI * 1.08, Math.PI * 1.92);
    ctx.strokeStyle = 'rgba(233,178,58,.35)'; ctx.lineWidth = 6; ctx.stroke();
    // the Hi-Hat
    const narrow = w < 700;
    const sx = w * (narrow ? .7 : .76) + (reduce ? 0 : Math.sin(t * .15) * w * .02), sy = h * (narrow ? .16 : .24) + Math.sin(t * .9) * 4, k = Math.max(.5, Math.min(1.4, w / 1000));
    drawShip(ctx, sx, sy, k, t);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
}
function stopBg() { cancelAnimationFrame(raf); raf = 0; }

function drawShip(ctx, x, y, k, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const flick = .7 + Math.sin(t * 30) * .15;
  ctx.fillStyle = `rgba(233,178,58,${.35 * flick})`;
  ctx.beginPath(); ctx.moveTo(-96, -10); ctx.lineTo(-210, 0); ctx.lineTo(-96, 10); ctx.fill();
  ctx.fillStyle = '#e9b23a'; ctx.beginPath(); ctx.arc(-92, 0, 9 * flick, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d5473b'; ctx.beginPath(); ctx.moveTo(-60, 6); ctx.lineTo(-100, 34); ctx.lineTo(-40, 14); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-60, -6); ctx.lineTo(-96, -30); ctx.lineTo(-40, -12); ctx.fill();
  ctx.fillStyle = '#f1e8d4'; ctx.beginPath(); ctx.ellipse(0, 0, 90, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2b8f8a'; ctx.beginPath(); ctx.moveTo(-46, -8); ctx.bezierCurveTo(-34, -40, 34, -40, 46, -8); ctx.fill();
  ctx.fillStyle = '#10121e'; ctx.fillRect(-60, -2, 120, 4);
  ctx.fillStyle = '#0d3b3a'; ctx.beginPath(); ctx.moveTo(10, -26); ctx.bezierCurveTo(24, -26, 36, -18, 40, -10); ctx.lineTo(10, -10); ctx.fill();
  for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? '#e9b23a' : '#f3c860'; ctx.fillRect(-40 + i * 14, 6, 6, 3); }
  ctx.restore();
}
