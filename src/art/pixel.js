// Pixel art drawn in code: characters, the ship drone, ship tiles and the starfield.
import { shade, PAL as P } from './color.js';

export const CW = 16, CH = 24;          // character frame size
export const DIRS = ['down', 'left', 'right', 'up'];
const PANTS = '#2a2e44', BOOTS = '#10121e', OUTLINE = '#07080d';

function rectFn(ctx, ox, oy) {
  return (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(ox + x, oy + y, w, h); };
}

// Draws one character frame. dir: down | left | up ("right" is drawn as a mirrored left).
function drawChar(ctx, ox, oy, L, dir, f) {
  const r = rectFn(ctx, ox, oy);
  const h = L.hair, h2 = shade(L.hair, -.3), skin = L.skin, sk2 = shade(L.skin, -.15);
  const o = L.outfit, pants = L.pants || PANTS;
  const st = L.style;

  // back hair (long) sits behind everything
  if (st === 'long' && dir === 'down') r(2, 4, 12, 10, h);
  if (st === 'long' && dir === 'left') r(8, 4, 5, 10, h);

  // legs and boots
  if (dir === 'left') {
    if (f === 0) { r(6, 17, 4, 5, pants); r(5, 22, 5, 2, BOOTS); }
    else {
      const front = f === 1 ? 4 : 5, back = f === 1 ? 9 : 8;
      r(back, 17, 3, 4, shade(pants, -.25)); r(back, 21, 3, 2, BOOTS);
      r(front, 17, 3, 5, pants); r(front - 1, 22, 4, 2, BOOTS);
    }
  } else {
    const lUp = f === 2, rUp = f === 1;
    r(5, 17, 3, lUp ? 4 : 5, pants); r(5, lUp ? 21 : 22, 3, 2, BOOTS);
    r(8, 17, 3, rUp ? 4 : 5, pants); r(8, rUp ? 21 : 22, 3, 2, BOOTS);
  }

  // torso
  if (dir === 'left') {
    r(5, 11, 6, 6, o.main);
    if (o.style === 'coat') r(5, 17, 6, 2, o.main);
    if (o.style === 'flight' || o.style === 'suit') r(5, 11, 1, 5, o.acc);
    if (o.style === 'hoodie') r(7, 10, 5, 2, o.shade);
    r(7, 12, 2, 4, o.shade);                 // arm
    r(7, 16, 2, 1, skin);                    // hand
  } else {
    r(4, 11, 8, 6, o.main);
    if (dir === 'down') {
      switch (o.style) {
        case 'suit': r(7, 11, 2, 4, o.acc); r(6, 11, 1, 3, o.shade); r(9, 11, 1, 3, o.shade); break;
        case 'bomber': r(4, 11, 8, 1, o.shade); r(7, 12, 2, 1, o.acc); r(4, 16, 8, 1, o.shade); break;
        case 'coat': r(4, 10, 1, 2, o.shade); r(11, 10, 1, 2, o.shade); r(4, 17, 8, 2, o.main); r(7, 11, 2, 8, o.shade); break;
        case 'flight': r(7, 11, 1, 5, o.acc); r(9, 12, 2, 1, o.acc); break;
        case 'body': r(6, 12, 4, 4, o.acc); break;
        case 'hoodie': r(5, 10, 6, 1, o.shade); r(6, 11, 1, 3, o.acc); r(9, 11, 1, 3, o.acc); r(5, 15, 6, 1, o.shade); break;
      }
    } else {
      if (o.style === 'coat') r(4, 17, 8, 2, o.main);
      if (o.style === 'hoodie') r(5, 10, 6, 3, o.shade);
    }
    const swing = f === 0 ? 0 : 1;
    r(3, 11 + (f === 1 ? -swing : 0), 1, 5, o.shade); r(3, 16 + (f === 1 ? -swing : 0), 1, 1, skin);
    r(12, 11 + (f === 2 ? -swing : 0), 1, 5, o.shade); r(12, 16 + (f === 2 ? -swing : 0), 1, 1, skin);
  }

  // head
  r(4, 2, 8, 9, skin); r(3, 3, 10, 7, skin);
  r(6, 10, 4, 1, sk2);

  // face
  if (dir === 'down') {
    const ink = P.ink;
    switch (L.face) {
      case 0: r(5, 7, 2, 1, ink); r(9, 7, 2, 1, ink); break;
      case 1: r(5, 6, 1, 2, ink); r(10, 6, 1, 2, ink); r(4, 8, 1, 1, '#e08a7a'); r(11, 8, 1, 1, '#e08a7a'); break;
      case 2: r(5, 7, 2, 1, ink); r(9, 7, 2, 1, ink); r(5, 6, 1, 1, h2); r(10, 6, 1, 1, h2); break;
      default: r(5, 6, 1, 2, ink); r(10, 6, 1, 2, ink); r(7, 9, 2, 1, sk2); break;
    }
  } else if (dir === 'left') {
    r(4, 6, 1, 2, P.ink);
    r(2, 7, 1, 1, skin);
  }

  // hair
  if (dir === 'down') {
    switch (st) {
      case 'swept': r(3, 1, 10, 3, h); r(2, 3, 2, 4, h); r(12, 3, 2, 4, h); r(4, 4, 5, 1, h); r(5, 2, 4, 1, h2); break;
      case 'buzz': r(3, 2, 10, 2, h); r(3, 4, 1, 2, h); r(12, 4, 1, 2, h); break;
      case 'long': r(3, 1, 10, 3, h); r(2, 3, 2, 9, h); r(12, 3, 2, 9, h); r(4, 4, 3, 1, h); r(9, 4, 3, 1, h); break;
      case 'curls': r(2, 1, 12, 3, h); r(3, 0, 2, 1, h); r(7, 0, 2, 1, h); r(11, 0, 2, 1, h); r(2, 4, 2, 3, h); r(12, 4, 2, 3, h); r(4, 4, 2, 1, h); r(8, 4, 2, 1, h); r(5, 2, 1, 1, h2); r(10, 1, 1, 1, h2); break;
      case 'mohawk': r(3, 3, 10, 1, h2); r(7, 0, 2, 4, h); break;
      case 'topknot': r(3, 2, 10, 2, h); r(3, 4, 1, 2, h); r(12, 4, 1, 2, h); r(6, 0, 4, 2, h); r(7, 2, 2, 1, h2); break;
    }
  } else if (dir === 'up') {
    switch (st) {
      case 'long': r(2, 2, 12, 12, h); break;
      case 'curls': r(2, 1, 12, 9, h); r(3, 0, 2, 1, h); r(7, 0, 2, 1, h); r(11, 0, 2, 1, h); r(5, 4, 1, 1, h2); r(9, 6, 1, 1, h2); break;
      case 'mohawk': r(3, 2, 10, 8, h2); r(7, 0, 2, 10, h); break;
      case 'topknot': r(3, 2, 10, 8, h); r(6, 0, 4, 2, h); r(7, 2, 2, 1, h2); break;
      case 'swept': r(3, 1, 10, 9, h); r(5, 3, 6, 1, h2); break;
      default: r(3, 2, 10, 8, h);
    }
  } else {
    switch (st) {
      case 'swept': r(3, 1, 10, 3, h); r(7, 4, 6, 4, h); r(3, 4, 3, 1, h); r(5, 2, 4, 1, h2); break;
      case 'buzz': r(4, 2, 9, 2, h); r(9, 4, 4, 3, h); break;
      case 'long': r(3, 1, 10, 3, h); r(8, 4, 5, 6, h); r(3, 4, 2, 1, h); break;
      case 'curls': r(2, 1, 12, 3, h); r(3, 0, 2, 1, h); r(8, 0, 2, 1, h); r(8, 4, 6, 4, h); r(2, 4, 2, 1, h); break;
      case 'mohawk': r(5, 0, 7, 2, h); r(7, 2, 6, 4, h2); break;
      case 'topknot': r(3, 2, 10, 2, h); r(8, 4, 5, 3, h); r(9, 0, 4, 2, h); break;
    }
  }

  // accessory
  const acc = L.acc;
  if (acc === 'Goggles') {
    if (dir === 'down') { r(3, 4, 10, 1, P.ink); r(4, 3, 3, 2, P.mustard); r(9, 3, 3, 2, P.mustard); }
    else if (dir === 'up') r(3, 4, 10, 1, P.ink);
    else { r(3, 4, 10, 1, P.ink); r(3, 3, 3, 2, P.mustard); }
  } else if (acc === 'Scarf') {
    if (dir === 'down') { r(4, 10, 8, 2, P.crimson); r(9, 12, 2, 3, P.crimson); }
    else if (dir === 'up') { r(4, 10, 8, 2, P.crimson); r(6, 12, 2, 4, P.crimson); }
    else { r(5, 10, 6, 2, P.crimson); r(10, 12, 2, 3, P.crimson); }
  } else if (acc === 'Shades') {
    if (dir === 'down') { r(4, 6, 8, 2, P.ink); r(5, 6, 1, 1, '#5d6a80'); r(9, 6, 1, 1, '#5d6a80'); }
    else if (dir === 'left') r(3, 6, 4, 2, P.ink);
  } else if (acc === 'Earring') {
    if (dir === 'down') { r(3, 9, 1, 1, P.mustard); r(12, 9, 1, 1, P.mustard); }
    else if (dir === 'left') r(9, 9, 1, 1, P.mustard);
  } else if (acc === 'Headband') {
    r(3, 3, 10, 1, P.crimson);
    if (dir === 'up') { r(6, 4, 1, 3, P.crimson); r(9, 4, 1, 3, P.crimson); }
    if (dir === 'left') r(12, 4, 2, 2, P.crimson);
  }
}

// Adds a dark 1px outline around everything drawn in one cell, for readability.
function outline(ctx, ox, oy, w, h) {
  const img = ctx.getImageData(ox, oy, w, h), d = img.data;
  const solid = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0;
  const add = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (solid(x, y)) continue;
    if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1)) add.push([x, y]);
  }
  ctx.fillStyle = OUTLINE;
  add.forEach(([x, y]) => ctx.fillRect(ox + x, oy + y, 1, 1));
}

// A sheet: 3 frames (stand, step, step) for each of down, left, right, up.
export function characterSheet(look) {
  const cv = document.createElement('canvas');
  cv.width = CW * 3; cv.height = CH * 4;
  const ctx = cv.getContext('2d');
  DIRS.forEach((dir, d) => {
    for (let f = 0; f < 3; f++) {
      const ox = f * CW, oy = d * CH;
      if (dir === 'right') {
        ctx.setTransform(-1, 0, 0, 1, ox * 2 + CW, 0);
        drawChar(ctx, ox, oy, look, 'left', f);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      } else drawChar(ctx, ox, oy, look, dir, f);
      outline(ctx, ox, oy, CW, CH);
    }
  });
  return cv;
}

export function droneSheet(hostile = false) {
  const cv = document.createElement('canvas');
  cv.width = 32; cv.height = 16;
  const ctx = cv.getContext('2d');
  for (let f = 0; f < 2; f++) {
    const r = rectFn(ctx, f * 16, 0);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const dx = x - 7.5, dy = y - 9.5;
      if (dx * dx + dy * dy <= 30) r(x, y, 1, 1, y > 10 ? (hostile ? '#262a3a' : '#46516a') : (hostile ? '#3a4258' : '#5d6a80'));
    }
    const eye = hostile ? P.crimson : P.mustard;
    r(5, 7, 6, 5, P.ink);
    if (f === 0) { r(6, 8, 4, 3, eye); r(7, 9, 2, 1, P.ink); r(8, 8, 1, 1, P.cream); }
    else { r(6, 9, 4, 1, eye); }
    r(6, 13, 4, 1, hostile ? P.crimson : P.teal);
    if (hostile) { r(1, 8, 3, 2, '#262a3a'); r(12, 8, 3, 2, '#262a3a'); r(7, 2, 2, 2, '#5d6a80'); }
    else {
      r(4, 3, 1, 2, '#8d90a8'); r(3, 2, 1, 1, '#8d90a8'); r(11, 3, 1, 2, '#8d90a8'); r(12, 2, 1, 1, '#8d90a8');
      r(2, 0, 3, 2, P.mustard); r(11, 0, 3, 2, P.mustard);
    }
    outline(ctx, f * 16, 0, 16, 16);
  }
  return cv;
}

// ---- Ship tiles (16x16), in the order used by data/maps.js TILE ----
export function tileSheet() {
  const T = 16, cols = 8, count = 104;   // room to grow: 0-103
  const cv = document.createElement('canvas');
  cv.width = T * cols; cv.height = T * Math.ceil(count / cols);
  const ctx = cv.getContext('2d');
  const at = i => rectFn(ctx, (i % cols) * T, Math.floor(i / cols) * T);

  const floor = r => {
    r(0, 0, 16, 16, '#2a3046'); r(0, 0, 16, 1, '#343b56'); r(0, 0, 1, 16, '#343b56');
    r(15, 0, 1, 16, '#222738'); r(0, 15, 16, 1, '#222738');
    [[2, 2], [13, 2], [2, 13], [13, 13]].forEach(([x, y]) => r(x, y, 1, 1, '#3f4766'));
  };
  const wall = r => {
    r(0, 0, 16, 16, '#3a4258'); r(0, 0, 16, 2, '#4a5470'); r(0, 13, 16, 3, '#2c3346');
    r(5, 3, 1, 9, '#2c3346'); r(11, 3, 1, 9, '#2c3346'); r(0, 12, 16, 1, '#b3842a');
  };
  let r;

  r = at(0); r(0, 0, 16, 16, '#151a28'); r(0, 15, 16, 1, '#1f2538'); r(3, 7, 1, 1, '#262c40'); r(12, 7, 1, 1, '#262c40');
  r = at(1); wall(r);
  r = at(2); wall(r); r(2, 2, 12, 10, '#5a647e'); r(3, 3, 10, 8, '#0a0c16');
  [[5, 4], [10, 5], [7, 7], [11, 9], [4, 9]].forEach(([x, y]) => r(x, y, 1, 1, P.cream)); r(3, 8, 3, 3, '#c48456'); r(3, 9, 3, 1, '#e8c49a');
  r = at(3); floor(r);
  r = at(4); r(0, 0, 16, 16, '#1f2436'); for (let y = 2; y < 16; y += 3) r(1, y, 14, 1, '#141826'); r(0, 0, 16, 1, '#2a3046');
  r = at(5); r(0, 0, 16, 16, '#7a2e2a'); r(7, 2, 2, 12, '#9c3a30'); r(2, 7, 12, 2, '#9c3a30'); r(7, 7, 2, 2, P.mustard); r(1, 1, 1, 1, P.mustard); r(14, 14, 1, 1, P.mustard);
  r = at(6); floor(r); r(2, 2, 14, 6, '#22535a'); r(2, 8, 14, 5, '#3a8590'); r(2, 4, 3, 10, '#22535a'); r(2, 13, 14, 1, '#1b3f45'); r(3, 14, 1, 2, P.ink); r(14, 14, 1, 2, P.ink); r(7, 9, 1, 3, '#2c6a72');
  r = at(7); floor(r); r(0, 2, 14, 6, '#22535a'); r(0, 8, 14, 5, '#3a8590'); r(11, 4, 3, 10, '#22535a'); r(0, 13, 14, 1, '#1b3f45'); r(2, 14, 1, 2, P.ink); r(12, 14, 1, 2, P.ink); r(0, 9, 1, 3, '#2c6a72');
  r = at(8); floor(r); r(2, 4, 12, 7, '#6b4a2a'); r(2, 11, 12, 2, '#4a321c'); r(3, 13, 1, 2, '#2c1e10'); r(12, 13, 1, 2, '#2c1e10'); r(4, 5, 2, 3, P.cream); r(9, 6, 3, 3, P.crimson); r(9, 6, 3, 1, P.cream);
  r = at(9); floor(r); r(2, 0, 12, 15, '#262a40'); r(3, 2, 10, 7, '#0d3b3a'); r(4, 3, 6, 1, P.mustard); r(4, 5, 8, 1, P.teal); r(4, 7, 5, 1, P.teal); r(11, 3, 1, 1, P.crimson);
  for (let x = 4; x < 12; x += 2) r(x, 11, 1, 1, '#5d6a80'); r(2, 14, 12, 1, '#1b1e30');
  r = at(10); floor(r); r(1, 2, 14, 14, '#2c3346'); r(3, 3, 10, 5, P.cream); r(3, 7, 10, 1, '#c9c0aa'); r(2, 9, 12, 7, P.violet); r(2, 9, 12, 1, '#7a5a98');
  r = at(17); floor(r); r(1, 0, 14, 14, '#2c3346'); r(2, 0, 12, 12, P.violet); r(2, 11, 12, 1, '#3f2b52'); r(1, 13, 14, 1, '#1e2232');
  r = at(11); wall(r); r(0, 6, 16, 10, '#5d6a80'); r(0, 5, 16, 2, '#8d90a8'); r(2, 5, 4, 1, P.ink); r(9, 1, 4, 4, P.crimson); r(10, 0, 2, 1, P.crimson); r(1, 9, 14, 1, '#46516a'); r(3, 11, 1, 2, '#8d90a8'); r(12, 11, 1, 2, '#8d90a8');
  r = at(12); wall(r); r(2, 0, 12, 16, '#c9c4b4'); r(2, 6, 12, 1, '#9a968a'); r(11, 2, 1, 3, '#5d6a80'); r(11, 8, 1, 4, '#5d6a80'); r(5, 9, 2, 2, P.mustard); r(2, 15, 12, 1, '#9a968a');
  r = at(13); floor(r); r(5, 10, 6, 6, P.crimson); r(4, 10, 8, 1, '#a5352c'); r(4, 2, 4, 5, '#3f8f5a'); r(8, 1, 4, 5, '#2c6a44'); r(6, 5, 5, 5, '#3f8f5a'); r(3, 6, 3, 3, '#2c6a44'); r(10, 5, 3, 3, '#3f8f5a');
  r = at(14); r(0, 0, 16, 16, '#151a28'); r(2, 2, 12, 14, '#5d6a80'); r(7, 2, 2, 14, '#3a4258');
  for (let x = 0; x < 16; x += 4) { r(x, 0, 2, 2, P.mustard); r(x + 2, 0, 2, 2, P.ink); } r(4, 8, 2, 2, P.crimson);
  r = at(15); floor(r); r(2, 2, 12, 14, P.crimson); r(3, 1, 10, 1, P.crimson); r(4, 3, 8, 6, P.mustard); r(5, 4, 6, 4, '#f3c860'); r(4, 10, 8, 4, P.ink);
  for (let y = 10; y < 14; y += 2) r(4, y, 8, 1, '#3a2018'); r(2, 15, 12, 1, '#8a2a22');
  r = at(16); floor(r); r(0, 2, 16, 10, '#262a40'); r(0, 3, 16, 4, '#0d3b3a'); r(1, 4, 14, 1, P.teal); r(2, 9, 1, 1, P.crimson); r(5, 9, 1, 1, P.mustard); r(8, 9, 2, 1, P.teal); r(12, 9, 1, 1, P.mustard); r(0, 12, 16, 2, '#1b1e30');

  // ---- Dock 9 ----
  const dock = r => {
    r(0, 0, 16, 16, '#3a4152'); r(0, 15, 16, 1, '#323847'); r(15, 0, 1, 16, '#323847');
    [[3, 4], [11, 2], [7, 10], [13, 12], [2, 13]].forEach(([x, y]) => r(x, y, 1, 1, '#465066'));
    r(9, 6, 2, 1, '#2f3542');
  };
  r = at(18); dock(r);
  r = at(19); r(0, 0, 16, 16, '#30364a');
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if ((x + y) % 8 < 2) r(x, y, 1, 1, '#6e5a26');
  const container = (i, main, rib, lip) => {
    r = at(i); r(0, 0, 16, 16, main); for (let x = 1; x < 16; x += 3) r(x, 2, 1, 12, rib);
    r(0, 0, 16, 2, lip); r(0, 14, 16, 2, '#14161f');
  };
  container(20, '#8a2e26', '#6b221c', '#a8463a');
  container(21, '#22706c', '#18524f', '#3a8f8a');
  container(22, '#5b3f74', '#432d57', '#7a5a98');
  r = at(23); dock(r); r(1, 2, 14, 13, '#8a6a3a'); r(1, 2, 14, 1, '#a5844e'); r(1, 7, 14, 1, '#6b4f28'); r(1, 12, 14, 1, '#6b4f28');
  for (let k = 0; k < 10; k++) r(2 + k, 3 + k, 2, 1, '#6b4f28'); r(1, 14, 14, 1, '#4a321c');
  r = at(24); r(0, 0, 16, 16, '#4a5470'); for (let x = 0; x < 16; x += 2) r(x, 0, 1, 16, '#3a4258'); r(0, 0, 16, 2, '#5d6a80'); r(0, 6, 16, 2, '#b3842a'); r(0, 14, 16, 2, '#2c3346');
  r = at(25); r(0, 0, 16, 16, '#151a28'); r(1, 1, 14, 15, '#5d6a80'); for (let y = 3; y < 16; y += 2) r(1, y, 14, 1, '#46516a');
  for (let x = 0; x < 16; x += 4) { r(x, 0, 2, 1, P.mustard); r(x + 2, 0, 2, 1, P.ink); } r(7, 2, 2, 1, P.crimson);
  r = at(26); dock(r); r(7, 3, 2, 12, '#262a40'); r(5, 1, 6, 2, '#262a40'); r(5, 3, 6, 1, P.mustard); r(6, 14, 4, 2, '#1b1e30');
  r = at(27); r(0, 0, 16, 16, '#1a2233'); r(2, 3, 5, 2, '#2c3a52'); r(9, 9, 6, 2, '#2c3a52'); r(4, 12, 3, 1, '#2c3a52');
  [[5, 3], [12, 9], [3, 12], [10, 2]].forEach(([x, y]) => r(x, y, 1, 1, '#c9d6e8'));
  r = at(28); r(0, 0, 16, 16, '#22404a'); r(0, 0, 16, 1, '#2c5560'); r(0, 15, 16, 1, '#1a3038'); r(7, 0, 2, 16, '#6e5a26');
  r = at(30); dock(r); r(2, 0, 12, 16, P.crimson); r(3, 2, 7, 10, '#0d1424');
  [[4, 3, P.mustard], [6, 3, P.teal], [8, 3, P.cream], [4, 6, P.teal], [6, 6, P.crimson], [8, 6, P.mustard], [4, 9, P.cream], [6, 9, P.mustard], [8, 9, P.teal]]
    .forEach(([x, y, c]) => r(x, y, 1, 2, c));
  r(11, 3, 2, 3, '#f3c860'); r(11, 8, 2, 1, P.ink); r(3, 13, 7, 2, '#8a2a22');
  // ---- Cygnus Station ----
  const street = r => {
    r(0, 0, 16, 16, '#171b2c'); r(0, 15, 16, 1, '#12152280');
    [[2, 3, 5], [9, 9, 4], [4, 12, 3]].forEach(([x, y, w]) => { r(x, y, w, 1, '#2a2f4a'); r(x + 1, y + 1, w - 2, 1, '#3a2a48'); });
    r(12, 4, 1, 1, '#d5473b55'); r(6, 7, 1, 1, '#2b8f8a66');
  };
  const walk = r => {
    r(0, 0, 16, 16, '#2a2f44'); r(0, 0, 16, 1, '#343a52'); r(0, 0, 1, 16, '#343a52'); r(7, 0, 1, 16, '#24283a'); r(0, 7, 16, 1, '#24283a');
  };
  const front = r => {
    r(0, 0, 16, 16, '#1d2133'); r(0, 0, 16, 2, '#262b40'); r(0, 14, 16, 2, '#121522');
    r(2, 4, 12, 8, '#0d1424'); r(2, 4, 12, 1, '#2b8f8a55'); r(3, 9, 3, 3, '#e9b23a44'); r(9, 7, 4, 5, '#d5473b33');
  };
  r = at(32); street(r);
  r = at(33); walk(r);
  r = at(34); front(r);
  const neon = (i, c, glow, glyph) => {
    r = at(i); r(0, 0, 16, 16, '#1d2133'); r(0, 14, 16, 2, '#121522');
    r(1, 2, 14, 11, glow); r(2, 3, 12, 9, '#0b0d18');
    glyph.forEach(([x, y, w, h]) => r(x, y, w, h, c));
  };
  neon(35, '#ff5fa2', '#ff5fa233', [[4, 5, 8, 1], [7, 5, 1, 5], [4, 9, 8, 1], [4, 7, 2, 1]]);
  neon(36, '#5fe3d4', '#5fe3d433', [[4, 4, 1, 7], [4, 4, 7, 1], [10, 4, 1, 4], [4, 7, 7, 1], [8, 8, 3, 3]]);
  neon(37, '#ffd34d', '#ffd34d33', [[5, 4, 6, 1], [7, 4, 1, 7], [5, 7, 6, 1], [4, 10, 8, 1]]);
  r = at(38); front(r); r(4, 3, 8, 13, '#2c3346'); r(5, 4, 6, 12, '#f3c86055'); r(4, 2, 8, 1, P.mustard); r(10, 9, 1, 2, P.ink);
  r = at(39); front(r); r(4, 3, 8, 13, '#3a1a24'); r(5, 4, 6, 12, '#ff5fa244'); r(3, 1, 10, 2, '#ff5fa2'); r(10, 9, 1, 2, P.mustard);
  r = at(40); walk(r); r(0, 6, 16, 10, '#8a2e26'); r(0, 5, 16, 2, '#c9a46a'); r(2, 8, 3, 3, P.cream); r(7, 8, 3, 3, P.cream); r(12, 8, 3, 3, P.cream);
  r(3, 0, 3, 4, '#ff5fa2'); r(10, 0, 3, 4, '#ffd34d'); r(4, 4, 1, 1, P.ink); r(11, 4, 1, 1, P.ink);
  r = at(41); walk(r); r(7, 3, 2, 12, '#262a40'); r(5, 1, 6, 2, '#5fe3d4'); r(6, 3, 4, 1, '#5fe3d466'); r(6, 14, 4, 2, '#1b1e30');
  r = at(43); walk(r); r(2, 9, 12, 7, '#3a4258'); r(2, 9, 12, 1, '#5d6a80'); r(4, 2, 8, 8, '#2c6a44'); r(3, 4, 4, 5, '#3f8f5a'); r(9, 3, 4, 5, '#3f8f5a'); r(7, 6, 1, 4, '#4a321c');
  r = at(44); r(0, 0, 16, 16, '#0b0d18'); r(0, 0, 16, 3, '#3a4258'); r(0, 3, 16, 1, '#5fe3d4'); for (let x = 1; x < 16; x += 5) r(x, 4, 2, 6, '#3a4258');
  r = at(45); r(0, 0, 16, 16, '#4a3020'); for (let y = 0; y < 16; y += 4) r(0, y, 16, 1, '#3a2418'); r(5, 1, 1, 3, '#3a2418'); r(11, 5, 1, 3, '#3a2418'); r(3, 9, 1, 3, '#3a2418'); r(13, 13, 1, 3, '#3a2418');
  r = at(46); r(0, 0, 16, 16, '#4a3020'); r(0, 2, 16, 14, '#6b4a2a'); r(0, 2, 16, 3, '#8a6a3a'); r(0, 13, 16, 3, '#3a2418'); r(4, 0, 2, 3, '#7fe0c8'); r(11, 0, 2, 3, P.mustard);
  r = at(47); r(0, 0, 16, 16, '#4a3020'); for (let y = 0; y < 16; y += 4) r(0, y, 16, 1, '#3a2418'); r(5, 3, 6, 4, P.crimson); r(5, 3, 6, 1, '#e86a5e'); r(7, 7, 2, 7, '#262a40'); r(5, 13, 6, 1, '#262a40');
  r = at(48); r(0, 0, 16, 16, '#4a3020'); r(0, 1, 16, 12, '#10121e'); r(1, 2, 14, 3, '#1b1e30'); r(1, 6, 14, 4, P.cream); for (let x = 2; x < 15; x += 2) r(x, 6, 1, 2, P.ink); r(2, 13, 2, 3, '#10121e'); r(12, 13, 2, 3, '#10121e');
  r = at(49); r(0, 0, 16, 16, '#2a1a1a'); r(0, 5, 16, 1, '#6b4a2a'); r(0, 11, 16, 1, '#6b4a2a');
  [[1, 1, '#2b8f8a'], [4, 2, '#e9b23a'], [7, 1, '#d5473b'], [10, 2, '#7fe0c8'], [13, 1, '#c9a46a'], [2, 7, '#e9b23a'], [5, 8, '#5b3f74'], [9, 7, '#2b8f8a'], [12, 8, '#d5473b']]
    .forEach(([x, y, c]) => { r(x, y, 2, 4, c); r(x, y - 1 < 0 ? 0 : y - 1, 1, 1, c); });
  r(0, 13, 16, 3, '#1a1010');
  r = at(50); r(0, 0, 16, 16, '#4a3020'); for (let y = 0; y < 16; y += 4) r(0, y, 16, 1, '#3a2418'); r(3, 3, 10, 8, '#2c3346'); r(2, 4, 12, 6, '#2c3346'); r(4, 4, 8, 1, '#46516a'); r(6, 5, 2, 3, '#f3c860'); r(7, 11, 2, 4, '#1b1e30');
  r = at(51); r(0, 0, 16, 16, '#4a3020'); r(0, 0, 16, 16, '#5a1d24'); r(0, 0, 4, 16, '#7a2a30'); r(4, 2, 12, 12, '#6b2228'); r(4, 7, 12, 1, '#4a1418');
  r = at(52); front(r); r(3, 2, 10, 14, '#1d4a4a'); r(4, 3, 8, 13, '#5fe3d455'); r(7, 3, 2, 13, '#1d4a4a'); r(3, 1, 10, 1, '#5fe3d4'); r(6, 7, 4, 2, P.cream);
  r = at(53); r(0, 0, 16, 16, '#151a28'); r(3, 0, 10, 16, '#3a2418'); r(4, 1, 8, 15, '#6b4a2a'); r(10, 8, 1, 2, P.mustard); r(3, 0, 10, 1, '#ff5fa2');

  // ---- Relay K-17 ----
  const kfloor = r => {
    r(0, 0, 16, 16, '#262b3a'); r(0, 0, 16, 1, '#2f3546'); r(0, 0, 1, 16, '#2f3546'); r(15, 0, 1, 16, '#1d2130'); r(0, 15, 16, 1, '#1d2130');
    r(4, 4, 8, 8, '#2a3040'); r(4, 4, 8, 1, '#323a4e'); [[2, 2], [13, 2], [2, 13], [13, 13]].forEach(([x, y]) => r(x, y, 1, 1, '#3a4258'));
  };
  const kwall = r => {
    r(0, 0, 16, 16, '#252938'); r(0, 0, 16, 2, '#30364a'); r(0, 13, 16, 3, '#1b1e2a'); r(3, 3, 1, 9, '#1b1e2a'); r(12, 3, 1, 9, '#1b1e2a');
    r(0, 11, 16, 1, '#d5473b'); r(6, 5, 4, 3, '#1b1e2a');
  };
  r = at(54); r(0, 0, 16, 16, '#0e1018'); r(0, 15, 16, 1, '#1a1e2c'); r(4, 6, 1, 1, '#1a1e2c'); r(11, 9, 1, 1, '#1a1e2c');
  r = at(55); kwall(r);
  r = at(56); kfloor(r);
  r = at(57); r(0, 0, 16, 16, '#1b1f2c'); for (let y = 2; y < 16; y += 3) r(1, y, 14, 1, '#11131c'); r(0, 0, 16, 1, '#262b3a');
  const door = (i, light, extra) => {
    r = at(i); r(0, 0, 16, 16, '#0e1018'); r(1, 1, 14, 15, '#3a4258'); r(7, 1, 2, 15, '#252938'); r(2, 3, 4, 1, '#4a5470'); r(10, 3, 4, 1, '#4a5470');
    for (let x = 0; x < 16; x += 4) { r(x, 0, 2, 1, P.mustard); r(x + 2, 0, 2, 1, P.ink); }
    r(7, 2, 2, 2, light); extra && extra(r);
  };
  door(58, P.crimson);
  door(59, P.crimson, r2 => { r2(11, 7, 3, 4, '#1b1e2a'); r2(12, 8, 1, 1, P.mustard); r2(12, 9, 1, 1, P.mustard); });
  r = at(60); r(0, 0, 16, 16, '#11131c'); r(0, 0, 2, 16, '#3a4258'); r(14, 0, 2, 16, '#3a4258'); r(2, 0, 12, 1, '#7fe0c8'); r(2, 15, 12, 1, '#262b3a');
  r = at(61); kfloor(r); r(1, 1, 14, 13, '#1b1e2a'); r(2, 2, 12, 6, '#0d3b3a'); r(3, 3, 6, 1, '#5fe3d4'); r(3, 5, 9, 1, '#2b8f8a'); r(10, 3, 2, 1, P.crimson);
  for (let x = 3; x < 13; x += 2) r(x, 10, 1, 1, '#5d6a80');
  r = at(62); kfloor(r); r(1, 0, 14, 15, '#3a4258'); r(1, 0, 14, 2, '#4a5470'); r(3, 3, 10, 9, '#1b1e2a');
  for (let y = 4; y < 12; y += 2) r(4, y, 8, 1, P.mustard); r(2, 13, 4, 2, P.crimson); r(10, 13, 4, 2, '#5fe3d4');
  r = at(63); kfloor(r); r(2, 0, 12, 15, '#10121a'); r(2, 0, 12, 1, '#2a2f44');
  for (let y = 2; y < 14; y += 3) { r(3, y, 10, 2, '#1b1e2a'); r(4, y, 1, 1, '#5fe3d4'); r(6, y, 1, 1, y % 2 ? P.crimson : '#5fe3d4'); r(11, y + 1, 1, 1, P.mustard); }
  r = at(64); kfloor(r); r(3, 0, 10, 16, '#46516a'); r(4, 1, 8, 14, '#9fc6e0'); r(5, 2, 6, 12, '#7fa8c8'); r(6, 4, 4, 3, '#c9d6e8'); r(6, 7, 4, 6, '#b0c4da'); r(3, 7, 1, 2, '#5fe3d4');
  r = at(65); kfloor(r); r(1, 2, 14, 13, '#3a4258'); r(2, 3, 12, 4, '#c9c0aa'); r(2, 8, 12, 6, '#46516a'); r(1, 14, 14, 1, '#1b1e2a');
  r = at(66); kwall(r); r(1, 1, 6, 15, '#5d6a80'); r(9, 1, 6, 15, '#5d6a80'); for (let y = 3; y < 8; y += 2) { r(2, y, 4, 1, '#46516a'); r(10, y, 4, 1, '#46516a'); } r(5, 9, 1, 2, P.ink); r(13, 9, 1, 2, P.ink);
  r = at(67); kwall(r); r(2, 2, 12, 8, '#5a647e'); r(3, 3, 10, 6, '#05060c'); [[4, 4], [9, 5], [11, 7], [6, 7]].forEach(([x, y]) => r(x, y, 1, 1, P.cream)); r(10, 3, 3, 2, '#f3c860');
  r = at(68); kfloor(r); r(0, 5, 16, 1, '#8a2a22'); r(0, 9, 16, 1, '#1d6663'); r(0, 7, 6, 1, '#a5741a'); r(9, 7, 7, 1, '#a5741a');
  r = at(69); kfloor(r); r(2, 3, 12, 11, '#5d6a80'); r(2, 3, 12, 2, '#8d90a8'); r(2, 8, 12, 1, '#46516a'); r(6, 5, 4, 2, P.mustard);

  // ---- Vesta ----
  const rock = r => { r(0, 0, 16, 16, '#1c1714'); [[3, 2], [11, 5], [6, 10], [13, 13], [1, 12], [9, 1]].forEach(([x, y]) => r(x, y, 2, 1, '#2a221e')); };
  const dirt = r => {
    r(0, 0, 16, 16, '#4a3a2e'); r(0, 15, 16, 1, '#3e3026');
    [[2, 3], [9, 2], [13, 7], [5, 9], [11, 12], [3, 13]].forEach(([x, y]) => r(x, y, 1, 1, '#5e4a3a'));
    [[7, 5], [12, 14]].forEach(([x, y]) => r(x, y, 2, 1, '#3a2c22'));
  };
  const market = r => {
    r(0, 0, 16, 16, '#4c3e36'); r(0, 0, 16, 1, '#5a4a40'); r(0, 0, 1, 16, '#5a4a40'); r(15, 0, 1, 16, '#3c302a'); r(0, 15, 16, 1, '#3c302a');
    r(7, 7, 2, 2, '#594a40');
  };
  const stall = (i, a, b) => {
    r = at(i); market(r);
    for (let x = 0; x < 16; x += 4) { r(x, 0, 2, 6, a); r(x + 2, 0, 2, 6, b); }
    r(0, 6, 16, 1, '#2a1e18');
    r(1, 7, 14, 8, '#6b4a2a'); r(1, 7, 14, 1, '#8a6a3a');
    r(3, 9, 2, 2, P.mustard); r(7, 9, 3, 2, '#7fe0c8'); r(11, 9, 2, 2, P.crimson); r(1, 15, 14, 1, '#2a1e18');
  };
  r = at(70); rock(r);
  r = at(71); r(0, 0, 16, 16, '#3a2e28'); r(0, 4, 16, 1, '#2e241f'); r(0, 9, 16, 1, '#2e241f'); r(3, 0, 1, 4, '#2e241f'); r(10, 5, 1, 4, '#2e241f'); r(6, 10, 1, 4, '#2e241f'); r(0, 14, 16, 2, '#1c1714'); r(0, 0, 16, 1, '#4a3c34');
  r = at(72); dirt(r);
  r = at(73); market(r);
  stall(74, P.crimson, P.cream);
  stall(75, P.teal, P.cream);
  r = at(76); dirt(r); for (let x = 1; x < 16; x += 4) r(x, 4, 2, 9, '#3a2418'); r(0, 5, 16, 1, '#8d90a8'); r(0, 11, 16, 1, '#8d90a8'); r(0, 6, 16, 1, '#4a4e5e'); r(0, 12, 16, 1, '#4a4e5e');
  r = at(77); dirt(r); r(7, 4, 2, 11, '#2c1e10'); r(5, 1, 6, 4, '#2c1e10'); r(6, 2, 4, 2, '#f3c860'); r(4, 0, 8, 1, '#2c1e10'); r(6, 14, 4, 2, '#1c1410');
  r = at(78); r(0, 0, 16, 16, '#3a2e28'); r(0, 14, 16, 2, '#1c1714'); r(2, 2, 12, 14, '#2c1e10'); r(3, 3, 10, 13, '#6b4a2a');
  for (let y = 5; y < 16; y += 3) r(3, y, 10, 1, '#4a321c'); r(10, 9, 2, 2, '#8d90a8'); r(2, 2, 12, 1, '#8a6a3a');

  // ---- Targon mine ----
  const basalt = r => { r(0, 0, 16, 16, '#221d1b'); [[2, 3], [10, 1], [6, 8], [13, 11], [3, 13], [11, 6]].forEach(([x, y]) => r(x, y, 2, 1, '#2f2723')); r(8, 12, 1, 1, '#4a2e22'); };
  const gravel = r => {
    r(0, 0, 16, 16, '#4e3d31'); r(0, 15, 16, 1, '#433428');
    [[1, 2], [6, 1], [11, 3], [3, 7], [9, 6], [14, 8], [5, 11], [12, 12], [2, 14], [8, 14]].forEach(([x, y]) => r(x, y, 1, 1, '#6a5442'));
    [[4, 4], [13, 5], [7, 10], [1, 10]].forEach(([x, y]) => r(x, y, 2, 1, '#3e3027'));
  };
  r = at(80); basalt(r);
  r = at(81); gravel(r);
  // rock face held up by timber framing
  r = at(82); r(0, 0, 16, 16, '#3a2e28'); r(0, 0, 16, 1, '#4a3c34'); r(0, 14, 16, 2, '#1c1714');
  r(1, 0, 3, 14, '#6b4a2a'); r(12, 0, 3, 14, '#6b4a2a'); r(1, 2, 14, 3, '#7a5632'); r(2, 2, 1, 12, '#4a321c'); r(13, 2, 1, 12, '#4a321c'); r(1, 5, 14, 1, '#4a321c');
  r(6, 8, 2, 1, '#2e241f'); r(8, 11, 3, 1, '#2e241f');
  // timber support post
  r = at(83); gravel(r); r(5, 0, 6, 16, '#6b4a2a'); r(5, 0, 1, 16, '#8a6a3a'); r(10, 0, 1, 16, '#4a321c'); r(4, 2, 8, 2, '#4a321c'); r(5, 14, 6, 2, '#2c1e10');
  // rails, across and up
  r = at(84); gravel(r); for (let x = 1; x < 16; x += 4) r(x, 4, 2, 9, '#3a2418'); r(0, 5, 16, 1, '#a0a4b8'); r(0, 11, 16, 1, '#a0a4b8'); r(0, 6, 16, 1, '#4a4e5e'); r(0, 12, 16, 1, '#4a4e5e');
  r = at(85); gravel(r); for (let y = 1; y < 16; y += 4) r(4, y, 9, 2, '#3a2418'); r(5, 0, 1, 16, '#a0a4b8'); r(11, 0, 1, 16, '#a0a4b8'); r(6, 0, 1, 16, '#4a4e5e'); r(12, 0, 1, 16, '#4a4e5e');
  // lift cage platform
  r = at(86); r(0, 0, 16, 16, '#3a4258'); r(1, 1, 14, 14, '#5d6a80'); for (let x = 2; x < 15; x += 3) r(x, 1, 1, 14, '#46516a'); r(0, 0, 16, 1, P.mustard); r(0, 15, 16, 1, P.mustard); r(0, 0, 1, 16, '#2c3346'); r(15, 0, 1, 16, '#2c3346');
  // the drop: a dark chasm with a crumbling lip
  r = at(87); r(0, 0, 16, 16, '#07060a'); r(0, 0, 16, 2, '#2a221e'); r(2, 2, 3, 1, '#2a221e'); r(9, 2, 4, 1, '#2a221e'); r(5, 9, 1, 1, '#151018'); r(11, 13, 1, 1, '#151018');
  // ore cart on rails
  r = at(88); gravel(r); r(0, 11, 16, 1, '#a0a4b8'); r(1, 3, 14, 8, '#5a3a24'); r(1, 3, 14, 1, '#8a5a34'); r(2, 4, 12, 2, '#7a5a5a'); r(3, 4, 3, 1, '#c88a3a'); r(9, 4, 2, 1, '#9fc6e0');
  r(2, 6, 12, 1, '#3a2418'); r(3, 11, 3, 3, '#1c1714'); r(10, 11, 3, 3, '#1c1714'); r(4, 12, 1, 1, '#8d90a8'); r(11, 12, 1, 1, '#8d90a8');
  // junction panel on the wall
  r = at(89); r(0, 0, 16, 16, '#3a2e28'); r(0, 14, 16, 2, '#1c1714'); r(2, 1, 12, 13, '#4a5470'); r(2, 1, 12, 1, '#6a7490'); r(3, 3, 10, 6, '#151a28');
  r(4, 4, 2, 1, P.mustard); r(7, 5, 3, 1, '#7fe0c8'); r(4, 7, 5, 1, P.crimson); r(11, 4, 1, 4, P.mustard); r(4, 10, 2, 3, '#8d90a8'); r(10, 10, 2, 3, '#8d90a8'); r(4, 10, 2, 1, P.crimson);
  // rubble from a cave-in
  r = at(90); gravel(r); r(1, 6, 7, 8, '#3a2e28'); r(6, 3, 8, 11, '#4a3c34'); r(2, 10, 12, 5, '#2e241f'); r(8, 4, 3, 2, '#5a4a40'); r(3, 7, 2, 2, '#5a4a40'); r(11, 9, 2, 2, '#5a4a40'); r(1, 14, 14, 1, '#1c1714');
  // lantern on a post
  r = at(91); gravel(r); r(7, 4, 2, 11, '#2c1e10'); r(5, 1, 6, 4, '#2c1e10'); r(6, 2, 4, 2, '#f3a850'); r(4, 0, 8, 1, '#2c1e10'); r(6, 14, 4, 2, '#1c1410');
  // mining machinery: a winch drum and gears
  r = at(92); gravel(r); r(1, 3, 14, 11, '#3a4258'); r(1, 3, 14, 2, '#5d6a80'); r(3, 6, 6, 6, '#b3842a'); r(4, 7, 4, 4, '#6b4a2a'); r(5, 8, 2, 2, '#2c1e10'); r(10, 6, 4, 2, P.crimson); r(10, 9, 4, 1, '#8d90a8'); r(10, 11, 4, 1, '#8d90a8'); r(1, 14, 14, 1, '#1c1714');
  // metal grating
  r = at(93); r(0, 0, 16, 16, '#3a4258'); for (let i = 0; i < 16; i += 4) { r(i, 0, 1, 16, '#2c3346'); r(0, i, 16, 1, '#2c3346'); } r(0, 0, 16, 1, '#5d6a80');
  // workbench with tools
  r = at(94); gravel(r); r(0, 5, 16, 3, '#8a6a3a'); r(0, 5, 16, 1, '#a8844a'); r(1, 8, 2, 7, '#4a321c'); r(13, 8, 2, 7, '#4a321c'); r(3, 2, 2, 3, '#8d90a8'); r(7, 3, 4, 2, P.crimson); r(12, 1, 1, 4, '#8d90a8'); r(11, 1, 3, 1, '#8d90a8');
  // corrugated hut wall
  r = at(95); r(0, 0, 16, 16, '#7a4a2e'); for (let x = 0; x < 16; x += 3) r(x, 0, 1, 16, '#5a3420'); r(0, 0, 16, 2, '#9a6a3e'); r(0, 13, 16, 3, '#3a2418'); r(4, 6, 2, 1, '#a8844a');
  // rails bridging the drop (you can't walk on these)
  r = at(96); r(0, 0, 16, 16, '#07060a'); for (let x = 1; x < 16; x += 4) r(x, 4, 2, 9, '#4a2e1e'); r(0, 5, 16, 1, '#a0a4b8'); r(0, 11, 16, 1, '#a0a4b8'); r(0, 13, 16, 1, '#151018');

  // ---- Hi-Hat upgrades ----
  // Tam's workbench: vice, tools and a scrap bin
  r = at(97); floor(r); r(0, 3, 16, 4, '#8a6a3a'); r(0, 3, 16, 1, '#a8844a'); r(1, 7, 2, 8, '#4a321c'); r(13, 7, 2, 8, '#4a321c');
  r(2, 0, 3, 3, '#8d90a8'); r(3, 1, 1, 2, '#5d6a80'); r(7, 1, 4, 2, P.crimson); r(12, 0, 1, 3, '#8d90a8'); r(4, 9, 8, 5, '#46516a'); r(5, 10, 2, 1, '#b3842a'); r(8, 11, 3, 1, '#8d90a8');
  // recording booth: mic on a stand in front of foam panels
  r = at(98); floor(r); r(1, 0, 14, 7, '#3a2440'); for (let x = 2; x < 15; x += 3) for (let y = 1; y < 7; y += 3) r(x, y, 2, 2, '#4f3458');
  r(7, 7, 2, 7, '#5d6a80'); r(5, 14, 6, 1, '#3a4258'); r(6, 3, 4, 5, '#8d90a8'); r(6, 4, 4, 1, '#5d6a80'); r(6, 6, 4, 1, '#5d6a80'); r(11, 2, 2, 1, P.crimson);
  // booth mixing desk with a red ON AIR light
  r = at(99); floor(r); r(1, 0, 14, 7, '#3a2440'); for (let x = 2; x < 15; x += 3) for (let y = 1; y < 7; y += 3) r(x, y, 2, 2, '#4f3458');
  r(0, 7, 16, 7, '#262a40'); r(0, 7, 16, 1, '#46516a'); for (let x = 2; x < 14; x += 2) r(x, 9, 1, 3, x % 4 ? P.mustard : '#7fe0c8'); r(10, 1, 4, 2, P.crimson); r(1, 14, 14, 1, '#1b1e30');

  r = at(31); dock(r); r(3, 3, 10, 12, '#2b8f8a'); r(3, 6, 10, 1, '#1d6663'); r(3, 11, 10, 1, '#1d6663'); r(3, 2, 10, 2, '#3fb0aa'); r(6, 2, 4, 1, '#1d6663'); r(3, 14, 10, 1, '#14403e');
  return cv;
}

// The Iron Mantis, folded up in its den (32x32): a mining mech with scythe arms and a drill tail.
export function mantisSheet() {
  const cv = document.createElement('canvas'); cv.width = 32; cv.height = 32;
  const r = rectFn(cv.getContext('2d'), 0, 0);
  r(4, 29, 24, 2, 'rgba(0,0,0,.35)');
  // legs
  [[5, 20], [10, 22], [20, 22], [25, 20]].forEach(([x, y]) => { r(x, y, 2, 9 - (y - 20), '#3a4258'); r(x - 1, 28, 4, 1, '#22263a'); });
  // body and drill tail
  r(8, 15, 16, 8, '#5d6a80'); r(8, 15, 16, 2, '#8d90a8'); r(9, 19, 14, 1, '#3a4258'); r(11, 17, 10, 1, '#b3842a');
  r(22, 17, 5, 4, '#46516a'); r(26, 18, 3, 2, '#8d90a8'); r(29, 18, 2, 1, '#c9ccd6');
  // neck and head
  r(13, 10, 6, 6, '#46516a'); r(11, 5, 10, 6, '#5d6a80'); r(11, 5, 10, 1, '#8d90a8');
  r(12, 7, 3, 2, '#d5473b'); r(17, 7, 3, 2, '#d5473b'); r(13, 7, 1, 1, '#ffd1c8'); r(18, 7, 1, 1, '#ffd1c8');
  r(10, 3, 1, 3, '#8d90a8'); r(21, 3, 1, 3, '#8d90a8'); r(9, 2, 2, 1, '#e9b23a'); r(21, 2, 2, 1, '#e9b23a');
  // folded scythe arms
  r(5, 9, 3, 9, '#46516a'); r(24, 9, 3, 9, '#46516a'); r(3, 8, 3, 2, '#c9ccd6'); r(26, 8, 3, 2, '#c9ccd6'); r(2, 9, 2, 4, '#c9ccd6'); r(28, 9, 2, 4, '#c9ccd6');
  r(6, 12, 2, 1, '#e9b23a'); r(24, 12, 2, 1, '#e9b23a');
  // outline the silhouette
  const ctx = cv.getContext('2d'), img = ctx.getImageData(0, 0, 32, 32), d = img.data, a = (x, y) => x >= 0 && y >= 0 && x < 32 && y < 32 && d[(y * 32 + x) * 4 + 3] > 200;
  const edge = [];
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if (!a(x, y) && (a(x + 1, y) || a(x - 1, y) || a(x, y + 1) || a(x, y - 1))) edge.push([x, y]);
  edge.forEach(([x, y]) => r(x, y, 1, 1, '#07080d'));
  return cv;
}

// Soft circle of torchlight for dark maps (transparent centre, dark edges).
export function darknessCanvas() {
  const S = 1024, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const c = cv.getContext('2d');
  const g = c.createRadialGradient(S / 2, S / 2, 26, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(4,4,10,0)'); g.addColorStop(.08, 'rgba(4,4,10,.5)'); g.addColorStop(.2, 'rgba(4,4,10,.93)'); g.addColorStop(1, 'rgba(4,4,10,.97)');
  c.fillStyle = g; c.fillRect(0, 0, S, S);
  return cv;
}

// The Hi-Hat parked on a landing pad (80x44).
export function shipSprite() {
  const W = 80, H = 44;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  const r = rectFn(ctx, 0, 0);
  const ell = (cx, cy, rx, ry, c) => {
    for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) r(cx + x, cy + y, 1, 1, c);
  };
  r(18, 31, 3, 6, '#262a40'); r(59, 31, 3, 6, '#262a40');  // landing legs
  r(6, 20, 10, 4, P.crimson); r(4, 24, 10, 3, P.crimson);  // fins
  r(64, 20, 10, 4, P.crimson); r(66, 24, 10, 3, P.crimson);
  ell(40, 26, 34, 8, P.cream);
  ell(40, 28, 30, 4, '#d9cfb8');
  ell(40, 18, 16, 9, P.teal); r(24, 22, 33, 5, P.cream);
  r(44, 12, 7, 5, '#0d3b3a');
  r(10, 25, 60, 1, P.ink);
  for (let i = 0; i < 5; i++) r(24 + i * 7, 28, 3, 2, i % 2 ? P.mustard : '#f3c860');
  r(33, 30, 14, 4, '#3a4258'); r(35, 34, 10, 4, '#5d6a80');  // ramp
  outline(ctx, 0, 0, W, H);
  ctx.globalCompositeOperation = 'destination-over';
  r(12, 36, 56, 4, 'rgba(0,0,0,.35)');                    // shadow
  ctx.globalCompositeOperation = 'source-over';
  return cv;
}

export function starTile() {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#07080f'; ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = Math.random() < .15 ? P.mustard : P.cream;
    ctx.globalAlpha = .3 + Math.random() * .7;
    ctx.fillRect(Math.floor(Math.random() * 128), Math.floor(Math.random() * 128), 1, 1);
  }
  ctx.globalAlpha = 1;
  return cv;
}

// Registers a canvas sheet with Phaser, cutting it into numbered frames.
export function addSheet(scene, key, canvas, fw, fh) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const tex = scene.textures.addCanvas(key, canvas);
  const cols = canvas.width / fw, rows = canvas.height / fh;
  let i = 0;
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) tex.add(i++, 0, x * fw, y * fh, fw, fh);
  return tex;
}
