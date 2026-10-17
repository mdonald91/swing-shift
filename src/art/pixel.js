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

export function droneSheet() {
  const cv = document.createElement('canvas');
  cv.width = 32; cv.height = 16;
  const ctx = cv.getContext('2d');
  for (let f = 0; f < 2; f++) {
    const r = rectFn(ctx, f * 16, 0);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const dx = x - 7.5, dy = y - 9.5;
      if (dx * dx + dy * dy <= 30) r(x, y, 1, 1, y > 10 ? '#46516a' : '#5d6a80');
    }
    r(5, 7, 6, 5, P.ink);
    if (f === 0) { r(6, 8, 4, 3, P.mustard); r(7, 9, 2, 1, P.ink); r(8, 8, 1, 1, P.cream); }
    else { r(6, 9, 4, 1, P.mustard); }
    r(6, 13, 4, 1, P.teal);
    r(4, 3, 1, 2, '#8d90a8'); r(3, 2, 1, 1, '#8d90a8'); r(11, 3, 1, 2, '#8d90a8'); r(12, 2, 1, 1, '#8d90a8');
    r(2, 0, 3, 2, P.mustard); r(11, 0, 3, 2, P.mustard);
    outline(ctx, f * 16, 0, 16, 16);
  }
  return cv;
}

// ---- Ship tiles (16x16), in the order used by data/maps.js TILE ----
export function tileSheet() {
  const T = 16, cols = 8, count = 18;
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
