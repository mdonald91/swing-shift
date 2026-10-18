// The walkable world: tile map, the captain, crew and things to interact with.
import { MAPS, TILE, SOLID, TILE_LOOKS, DOOR_OPEN, RUBBLE } from '../data/maps.js';
import { CREW } from '../data/crew.js';
import { characterSheet, droneSheet, mantisSheet, lyraSheet, tileSheet, starTile, shipSprite, darknessCanvas, addSheet, DIRS } from '../art/pixel.js';
import { resolveLook, NPC_LOOKS } from '../data/appearance.js';
import { Input } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { state, settings } from '../state.js';
import { bus } from '../bus.js';
import { chatAvailable } from '../data/dialogue.js';
import { jobNpcs } from '../systems/jobs.js';

const SPEED = 72;
const T = 16;

export class WorldScene extends Phaser.Scene {
  constructor() { super('world'); }

  create() {
    const map = MAPS[state.location] || MAPS.ship;
    this.mapDef = map;

    if (!this.textures.exists('tiles')) this.textures.addCanvas('tiles', tileSheet());
    if (!this.textures.exists('stars')) this.textures.addCanvas('stars', starTile());
    addSheet(this, 'player', characterSheet(resolveLook(state.player)), 16, 24);
    this.makeAnims('player');

    // starfield behind the hull
    this.stars = this.add.tileSprite(0, 0, 4000, 4000, 'stars').setOrigin(0.5).setScrollFactor(0.25).setDepth(-10);

    const data = map.rows.map(row => [...row].map(ch => TILE[ch] ?? -1));
    const tm = this.make.tilemap({ data, tileWidth: T, tileHeight: T });
    const ts = tm.addTilesetImage('tiles', 'tiles', T, T, 0, 0);
    this.layer = tm.createLayer(0, ts, 0, 0).setDepth(0);
    this.layer.setCollision(SOLID);
    this.doorTiles = (map.doors || []).map(d => ({ ...d, closed: data[d.y][d.x] }));
    this.swapTiles = (map.swaps || []).map(d => ({ ...d, was: data[d.y][d.x] }));
    this.W = tm.widthInPixels; this.H = tm.heightInPixels;
    this.physics.world.setBounds(0, 0, this.W, this.H);

    const sp = map.spawns.default;
    const sx = state.pos ? state.pos.px : sp.x * T + 8;
    const sy = state.pos ? state.pos.py : sp.y * T + 8;

    if (map.ship) {
      if (!this.textures.exists('hihat')) this.textures.addCanvas('hihat', shipSprite());
      this.add.image(map.ship.x * T + 8, map.ship.y * T + 14, 'hihat').setOrigin(0.5, 1).setDepth(map.ship.y * T + 14);
    }
    this.player = this.physics.add.sprite(sx, sy, 'player', 0).setOrigin(0.5, 0.85);
    this.player.body.setSize(10, 6).setOffset(3, 17);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.layer);
    this.facing = state.face || 'down';
    state.face = null;
    this.player.setFrame(DIRS.indexOf(this.facing) * 3);

    // crew
    this.npcs = [];
    const blockers = this.physics.add.staticGroup();
    if (!this.textures.exists('bubble')) this.textures.addCanvas('bubble', bubbleCanvas());
    for (const n of [...map.npcs, ...jobNpcs(state.location)]) {
      const lookId = n.look || n.id;
      const key = 'npc-' + lookId;
      const x = n.x * T + 8, y = n.y * T + 8;
      let spr;
      if (lookId === 'lyra') {
        if (!this.textures.exists(key)) addSheet(this, key, lyraSheet(), 16, 16);
        spr = this.add.sprite(x, y - 4, key, 0).setOrigin(0.5, 0.8);
        this.tweens.add({ targets: spr, y: y - 9, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        this.time.addEvent({ delay: 700, loop: true, callback: () => spr.setFrame(spr.frame.name === 0 ? 1 : 0) });
      } else if (lookId === 'mantis') {
        if (!this.textures.exists(key)) this.textures.addCanvas(key, mantisSheet());
        spr = this.add.sprite(x, y + 2, key).setOrigin(0.5, 0.9);
        this.tweens.add({ targets: spr, scaleY: 1.03, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      } else if (n.id === 'brushes' || lookId === 'drone') {
        if (!this.textures.exists(key)) addSheet(this, key, droneSheet(lookId === 'drone'), 16, 16);
        spr = this.add.sprite(x, y - 4, key, 0).setOrigin(0.5, 0.8);
        this.tweens.add({ targets: spr, y: y - 8, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        this.time.addEvent({ delay: 2600, loop: true, callback: () => { spr.setFrame(1); this.time.delayedCall(140, () => spr.setFrame(0)); } });
      } else {
        if (!this.textures.exists(key)) addSheet(this, key, characterSheet(NPC_LOOKS[lookId]), 16, 24);
        spr = this.add.sprite(x, y, key, DIRS.indexOf(n.face || 'down') * 3).setOrigin(0.5, 0.85);
      }
      spr.npcId = n.id; spr.homeFace = n.face || 'down'; spr.footY = y + 4;
      spr.bubble = this.add.image(x, y - (n.id === 'brushes' ? 22 : 24), 'bubble').setDepth(5000).setVisible(false);
      this.tweens.add({ targets: spr.bubble, y: spr.bubble.y - 2, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      if (n.deco) {      // part of the scenery (performers on stage): no collision, nothing to talk to
        spr.npcId = n.id; spr.def = n; spr.footY = y + 4; spr.zone = { body: null }; spr.bubble = this.add.image(0, 0, 'bubble').setVisible(false);
        this.tweens.add({ targets: spr, y: spr.y - 1, duration: 420 + Math.random() * 200, yoyo: true, repeat: -1 });
        this.npcs.push(spr); continue;
      }
      const z = lookId === 'mantis' ? this.add.zone(x, y, 28, 14) : this.add.zone(x, y + 3, 12, 8);
      blockers.add(z);
      spr.zone = z; spr.def = n;
      this.npcs.push(spr);
    }
    this.physics.add.collider(this.player, blockers);

    // things to use
    this.objects = map.objects.map(o => ({ ...o, rect: new Phaser.Geom.Rectangle(o.x * T - 2, o.y * T - 2, (o.w || 1) * T + 4, (o.h || 1) * T + 4) }));

    // controls
    const K = Phaser.Input.Keyboard.KeyCodes;
    this.keys = this.input.keyboard.addKeys({
      up: K.UP, down: K.DOWN, left: K.LEFT, right: K.RIGHT,
      w: K.W, a: K.A, s: K.S, d: K.D,
      act: K.SPACE, e: K.E, enter: K.ENTER, esc: K.ESC, m: K.M
    }, false);
    this.input.keyboard.disableGlobalCapture();

    // camera
    this.cameras.main.setRoundPixels(true);
    this.fit();
    this.scale.on('resize', this.fit, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.fit, this));

    // passers-by who stroll back and forth (no collision; just atmosphere)
    this.walkers = [];
    for (const wk of map.walkers || []) {
      const key = 'npc-' + wk.look;
      if (!this.textures.exists(key)) addSheet(this, key, characterSheet(NPC_LOOKS[wk.look]), 16, 24);
      if (!this.anims.exists(key + '-walk-left')) this.makeAnims(key);
      const y = wk.y * T + 8;
      const spr = this.add.sprite(wk.x1 * T + 8, y, key, 0).setOrigin(0.5, 0.85);
      const go = (from, to) => {
        const dir = to > from ? 'right' : 'left';
        spr.anims.play(key + '-walk-' + dir, true);
        this.tweens.add({
          targets: spr, x: to * T + 8, duration: Math.abs(to - from) * T / wk.speed * 1000,
          onComplete: () => { spr.anims.stop(); spr.setFrame(0); this.time.delayedCall(800 + Math.random() * 2000, () => go(to, from)); }
        });
      };
      this.time.delayedCall(Math.random() * 1500, () => go(wk.x1, wk.x2));
      spr.setDepth(y);
      this.walkers.push(spr);
    }

    // neon glow that flickers now and then
    for (const g of map.glows || []) {
      const glow = this.add.rectangle(g.x * T + (g.w * T) / 2, g.y * T + 22, g.w * T + 10, 12, g.c, 0.22).setDepth(1).setBlendMode(Phaser.BlendModes.ADD);
      this.time.addEvent({ delay: 1800 + Math.random() * 2500, loop: true, callback: () => {
        glow.setAlpha(0.05); this.time.delayedCall(70, () => glow.setAlpha(0.22)); this.time.delayedCall(140, () => glow.setAlpha(0.08)); this.time.delayedCall(210, () => glow.setAlpha(0.22));
      } });
    }

    // rain (or, under the Nyx dome, slow snow)
    this.rain = null; this.snow = !!map.snow;
    if (map.rain || map.snow) {
      this.rain = this.add.graphics().setDepth(9000);
      this.drops = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), v: .5 + Math.random() * .5 }));
    }

    // darkness until the power comes back
    this.dark = null;
    if (map.dark && !state.flags[map.dark]) {
      if (!this.textures.exists('dark')) this.textures.addCanvas('dark', darknessCanvas());
      this.dark = this.add.image(sx, sy, 'dark').setScale(1).setDepth(8000);
      this.alarm = this.add.rectangle(this.W / 2, this.H / 2, this.W + 400, this.H + 400, 0xd5473b, 0.08).setDepth(7999);
      this.tweens.add({ targets: this.alarm, alpha: 0.02, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }

    this.hintText = null;
    const refresh = () => {
      const f = state.flags;
      this.npcs.forEach(n => {
        const show = !(n.def.ifNot && f[n.def.ifNot]) && !(n.def.if && !f[n.def.if]) && !(n.def.job && !jobNpcs(state.location).length);
        n.setVisible(show); n.active = show;
        if (n.zone.body) n.zone.body.enable = show;
        n.bubble.setVisible(show && chatAvailable(n.npcId, f, state.location));
      });
      let changed = false;
      for (const d of this.doorTiles) {
        const want = d.closeOn ? (f[d.closeOn] ? RUBBLE : d.closed) : f[d.flag] ? DOOR_OPEN : d.closed;
        if (this.layer.getTileAt(d.x, d.y).index !== want) { this.layer.putTileAt(want, d.x, d.y); changed = true; }
      }
      for (const d of this.swapTiles) {
        const want = f[d.flag] ? TILE[d.to] : d.was;
        if (this.layer.getTileAt(d.x, d.y).index !== want) { this.layer.putTileAt(want, d.x, d.y); changed = true; }
      }
      if (changed) { this.layer.setCollision(SOLID); bus.emit('minimap', this.minimapData()); }
      if (this.dark && map.dark && f[map.dark]) {
        this.tweens.add({ targets: [this.dark, this.alarm], alpha: 0, duration: 900, onComplete: () => { this.dark?.destroy(); this.alarm?.destroy(); this.dark = null; } });
      }
    };
    refresh();
    const off = bus.on('dialog-closed', refresh);
    this.events.once('shutdown', off);

    // spotlights that switch on with the beat (the Lyceum heist)
    this.spots = null;
    if (map.spots) {
      this.spots = map.spots.map(sp => ({ ...sp, g: this.add.graphics().setDepth(8500).setBlendMode(Phaser.BlendModes.ADD) }));
      this.spotGrace = this.time.now + 1200;
    }

    // patrols: people walking a beat who see a short cone in front of them
    this.patrols = [];
    this.patrolGrace = this.time.now + 1500;
    for (const pt of map.patrols || []) if (this.patrolHere(pt)) this.addPatrol(pt);
    const offPatrol = bus.on('dialog-closed', () => {
      this.patrols = this.patrols.filter(pt => {
        if (this.patrolHere(pt.def)) return true;
        pt.spr.destroy(); pt.cone.destroy(); pt.warn.destroy(); return false;
      });
      this.patrols.forEach(pt => { if (pt.wait > 90000) { pt.wait = 1500; pt.warn.setVisible(false); } });
      this.patrolGrace = this.time.now + 2000;
    });
    this.events.once('shutdown', offPatrol);

    // tailing a suspect (see the map's "tail" route)
    this.tail = null;
    const offShake = bus.on('shake', () => this.cameras.main.shake(settings.reduceShake ? 250 : 500, settings.reduceShake ? .002 : .012));
    this.events.once('shutdown', offShake);
    const offTail = bus.on('tail-start', () => this.startTail());
    this.events.once('shutdown', () => { offTail(); if (this.tail) bus.emit('tail-status', null); });
    Audio.setMood(map.music);
    bus.emit('area', map);
    bus.emit('minimap', map.minimap ? this.minimapData() : null);
  }

  startTail() {
    const def = this.mapDef.tail;
    if (!def || this.tail) return;
    const key = 'npc-' + def.who;
    if (!this.textures.exists(key)) addSheet(this, key, characterSheet(NPC_LOOKS[def.who]), 16, 24);
    if (!this.anims.exists(key + '-walk-left')) this.makeAnims(key);
    const [x0, y0] = def.path[0];
    const spr = this.add.sprite(x0 * T + 8, y0 * T + 8, key, 0).setOrigin(0.5, 0.85);
    const warn = this.add.image(spr.x, spr.y - 24, 'bubble').setDepth(5001).setVisible(false);
    this.tail = {
      def, key, spr, warn, i: 1, mode: 'walk', t: 0, close: 0, far: 0, look: null, sent: 0,
      lost: state.flags.juno_protected ? 12 : 9      // Juno watches the market cameras for you
    };
    spr.anims.play(key + '-walk-right', true);
  }

  patrolHere(pt) {
    const f = state.flags;
    return !(pt.if && !f[pt.if]) && !(pt.ifNot && f[pt.ifNot]) && !f['patrol_' + state.location + '_' + pt.id];
  }

  addPatrol(def) {
    const key = 'npc-' + def.look;
    if (!this.textures.exists(key)) addSheet(this, key, characterSheet(NPC_LOOKS[def.look]), 16, 24);
    if (!this.anims.exists(key + '-walk-left')) this.makeAnims(key);
    const [x0, y0] = def.path[0];
    const spr = this.add.sprite(x0 * T + 8, y0 * T + 8, key, 0).setOrigin(0.5, 0.85);
    const cone = this.add.graphics().setDepth(8400);
    const warn = this.add.image(spr.x, spr.y - 24, 'bubble').setDepth(5001).setVisible(false);
    const [x1, y1] = def.path[1] || def.path[0];
    const face = [Math.sign(x1 - x0), Math.sign(y1 - y0)];
    this.patrols.push({ def, key, spr, cone, warn, i: 1, step: 1, wait: 400 + Math.random() * 800, face });
  }

  // Patrols walk back and forth along their path, pausing at each end. Returns true if one saw the captain.
  updatePatrols(time, dt) {
    const p = this.player, range = (state.flags.juno_protected ? 2.5 : 3.5) * T, spread = 0.7;
    let seen = null;
    for (const pt of this.patrols) {
      const s = pt.spr, path = pt.def.path;
      if (pt.wait > 0) {
        pt.wait -= dt;
        if (pt.wait <= 0) {     // turn round and set off again
          if (pt.i + pt.step < 0 || pt.i + pt.step >= path.length) pt.step = -pt.step;
          pt.i += pt.step;
        }
      } else {
        const [tx, ty] = path[pt.i], gx = tx * T + 8, gy = ty * T + 8;
        const dx = gx - s.x, dy = gy - s.y, d = Math.hypot(dx, dy), stepPx = pt.def.speed * dt / 1000;
        if (d <= stepPx) {
          s.setPosition(gx, gy); s.anims.stop();
          pt.wait = pt.def.pause || 1100;
        } else {
          pt.face = [Math.sign(dx), Math.sign(dy)];
          s.setPosition(s.x + dx / d * stepPx, s.y + dy / d * stepPx);
        }
      }
      const dir = pt.face[0] ? (pt.face[0] < 0 ? 'left' : 'right') : pt.face[1] < 0 ? 'up' : 'down';
      if (pt.wait > 0) { s.anims.stop(); s.setFrame(DIRS.indexOf(dir) * 3); } else s.anims.play(pt.key + '-walk-' + dir, true);
      s.setDepth(s.y); pt.warn.setPosition(s.x, s.y - 24);
      // the cone of sight
      const ang = Math.atan2(pt.face[1], pt.face[0]), half = Math.acos(spread), ex = s.x, ey = s.y - 4;
      const g = pt.cone; g.clear();
      g.fillStyle(0xff5f5f, pt.wait > 0 ? 0.1 : 0.16);
      const pts = [{ x: ex, y: ey }];
      for (let k = 0; k <= 10; k++) {     // each ray stops at the first wall, so the cone shows what they can really see
        const a = ang - half + (2 * half * k / 10), cx = Math.cos(a), cy = Math.sin(a);
        let d = 6;
        while (d < range) { const t = this.layer.getTileAtWorldXY(ex + cx * (d + 4), ey + cy * (d + 4)); if (!t || SOLID.includes(t.index)) break; d += 4; }
        pts.push({ x: ex + cx * Math.min(d + 4, range), y: ey + cy * Math.min(d + 4, range) });
      }
      g.fillPoints(pts, true);
      g.lineStyle(1, 0xff8a8a, 0.35).strokePoints(pts, true);
      const vx = p.x - ex, vy = p.y - 6 - ey, l = Math.hypot(vx, vy);
      if (!seen && l < range && (l < 10 || (vx * pt.face[0] + vy * pt.face[1]) / l > spread) && !this.blocked(ex, ey, p.x, p.y - 6)) seen = pt;
    }
    if (seen && time > this.patrolGrace) {
      this.patrolGrace = time + 99999;
      p.setVelocity(0, 0); p.anims.stop();
      seen.warn.setVisible(true); seen.wait = 99999;
      bus.emit('patrol-seen', { id: seen.def.id, fight: seen.def.fight });
      return true;
    }
    return false;
  }

  // Lights on, lights off, in time with the show. Returns true if the player was caught.
  updateSpots(time) {
    const bp = Audio.beatPos(), beat = ((Math.floor(bp) % 4) + 4) % 4, frac = bp - Math.floor(bp), next = (beat + 1) % 4;
    const easy = settings.rhythm !== 'normal';
    const p = this.player, tx = Math.floor(p.x / T), ty = Math.floor((p.y - 2) / T);
    let caught = null;
    for (const sp of this.spots) {
      const beats = easy ? sp.beats.slice(0, 1) : sp.beats;
      const lit = beats.includes(beat), warn = !lit && beats.includes(next) && frac > .5;
      const g = sp.g; g.clear();
      const x = sp.x * T, y = sp.y * T, w = sp.w * T, h = sp.h * T;
      if (lit) {
        g.fillStyle(0xfff2c0, 0.32).fillRect(x, y, w, h);
        g.fillStyle(0xfff2c0, 0.22).fillEllipse(x + w / 2, y + h / 2, w * .9, h * .9);
        g.lineStyle(1, 0xffe08a, 0.8).strokeRect(x + .5, y + .5, w - 1, h - 1);
        if (tx >= sp.x && tx < sp.x + sp.w && ty >= sp.y && ty < sp.y + sp.h) caught = sp;
      } else if (warn) {
        g.fillStyle(0xfff2c0, (Math.floor(time / 90) % 2) ? 0.1 : 0.04).fillRect(x, y, w, h);
        g.lineStyle(1, 0xffe08a, 0.35).strokeRect(x + .5, y + .5, w - 1, h - 1);
      } else {
        g.lineStyle(1, 0x8d90a8, 0.25).strokeRect(x + .5, y + .5, w - 1, h - 1);
      }
    }
    if (caught && time > this.spotGrace) {
      this.spotGrace = time + 99999;
      p.setVelocity(0, 0);
      bus.emit('spotted', caught.reset);
      return true;
    }
    return false;
  }

  // Is there a solid tile between two points?
  blocked(ax, ay, bx, by) {
    const d = Math.hypot(bx - ax, by - ay), n = Math.ceil(d / 4);
    for (let k = 1; k < n; k++) {
      const t = this.layer.getTileAtWorldXY(ax + (bx - ax) * k / n, ay + (by - ay) * k / n);
      if (t && SOLID.includes(t.index)) return true;
    }
    return false;
  }

  endTail(ok, reason) {
    const tl = this.tail; if (!tl) return;
    this.tail = null;
    tl.warn.destroy();
    if (ok) this.tweens.add({ targets: tl.spr, alpha: 0, duration: 500, onComplete: () => tl.spr.destroy() });
    else tl.spr.destroy();
    bus.emit('tail-status', null);
    bus.emit('tail-end', { ok, reason });
  }

  updateTail(dt) {
    const tl = this.tail, p = this.player, s = tl.spr, path = tl.def.path;
    const toTile = v => v / T;
    const dist = Math.hypot(p.x - s.x, p.y - s.y) / T;
    const back = (from, to) => { const vx = from[0] - to[0], vy = from[1] - to[1], l = Math.hypot(vx, vy) || 1; return [vx / l, vy / l]; };
    if (tl.mode === 'walk') {
      const [tx, ty] = path[tl.i], gx = tx * T + 8, gy = ty * T + 8;
      const dx = gx - s.x, dy = gy - s.y, d = Math.hypot(dx, dy), step = tl.def.speed * dt / 1000;
      const dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
      s.anims.play(tl.key + '-walk-' + dir, true);
      if (d <= step) {
        s.setPosition(gx, gy);
        const pause = path[tl.i][2];
        if (tl.i === path.length - 1) { this.endTail(true); return; }
        if (pause) { tl.mode = 'warn'; tl.t = 650; tl.look = back(path[tl.i - 1], path[tl.i]); tl.pause = pause; s.anims.stop(); tl.warn.setVisible(true); }
        tl.i++;
      } else s.setPosition(s.x + dx / d * step, s.y + dy / d * step);
    } else {
      tl.t -= dt;
      if (tl.mode === 'warn' && tl.t <= 0) {
        tl.mode = 'look'; tl.t = tl.pause; tl.warn.setVisible(false);
        const [lx, ly] = tl.look;
        s.setFrame(DIRS.indexOf(Math.abs(lx) > Math.abs(ly) ? (lx < 0 ? 'left' : 'right') : (ly < 0 ? 'up' : 'down')) * 3);
      } else if (tl.mode === 'look') {
        const vx = (p.x - s.x) / T, vy = (p.y - s.y) / T, l = Math.hypot(vx, vy) || 1;
        const facing = (vx * tl.look[0] + vy * tl.look[1]) / l > 0.2;
        if (dist < 7 && facing && !this.blocked(s.x, s.y - 8, p.x, p.y - 8)) { this.endTail(false, 'spotted'); return; }
        if (tl.t <= 0) tl.mode = 'walk';
      }
    }
    tl.warn.setPosition(s.x, s.y - 24);
    s.setDepth(s.y);
    tl.close = dist < 1.5 ? tl.close + dt : 0;
    tl.far = dist > tl.lost ? tl.far + dt : 0;
    if (tl.close > 900) { this.endTail(false, 'close'); return; }
    if (tl.far > 3000) { this.endTail(false, 'lost'); return; }
    tl.sent -= dt;
    if (tl.sent <= 0) {
      tl.sent = 100;
      bus.emit('tail-status', { dist, lost: tl.lost, mode: tl.mode, x: toTile(s.x), y: toTile(s.y) });
    }
  }

  minimapData() {
    const rows = [];
    for (let y = 0; y < this.layer.layer.height; y++) {
      const row = [];
      for (let x = 0; x < this.layer.layer.width; x++) {
        const t = this.layer.getTileAt(x, y);
        row.push(!t || t.index < 0 ? 0 : t.index === DOOR_OPEN ? 3 : this.doorTiles.some(d => d.x === x && d.y === y) ? 4 : SOLID.includes(t.index) ? 1 : 2);
      }
      rows.push(row);
    }
    return rows;
  }

  makeAnims(key) {
    DIRS.forEach((dir, d) => {
      const name = `${key}-walk-${dir}`;
      if (this.anims.exists(name)) this.anims.remove(name);
      this.anims.create({
        key: name, frameRate: 8, repeat: -1,
        frames: [1, 0, 2, 0].map(f => ({ key, frame: d * 3 + f }))
      });
    });
  }

  fit() {
    const cam = this.cameras.main, w = this.scale.width, h = this.scale.height;
    const zoom = h > w
      ? Phaser.Math.Clamp(Math.floor(w / 125), 2, 5)            // phone held upright
      : Phaser.Math.Clamp(Math.floor(Math.min(w / 240, h / 150)), 2, 5);
    cam.setZoom(zoom);
    const vw = w / zoom, vh = h / zoom;
    const bw = Math.max(this.W, vw), bh = Math.max(this.H, vh);
    cam.setBounds((this.W - bw) / 2, (this.H - bh) / 2, bw, bh);
    cam.startFollow(this.player, true, 0.15, 0.15);
  }

  facingPoint() {
    const p = this.player, d = { down: [0, 10], up: [0, -12], left: [-11, -2], right: [11, -2] }[this.facing];
    return { x: p.x + d[0], y: p.y + d[1] };
  }

  findTarget() {
    const f = this.facingPoint();
    let best = null, bd = 15;
    for (const n of this.npcs) {
      if (!n.active || n.def.deco) continue;
      const big = n.def.look === 'mantis';
      const dist = Phaser.Math.Distance.Between(f.x, f.y, n.x, n.footY - 4) - (big ? 12 : 0);
      if (dist < bd) { bd = dist; best = { kind: 'npc', id: n.npcId, spr: n, label: 'Talk to ' + (CREW[n.npcId]?.short || n.npcId) }; }
    }
    if (best) return best;
    const o = this.objects.find(o => o.rect.contains(f.x, f.y) && !(o.if && !state.flags[o.if]));
    if (o) return { kind: 'object', id: o.id, label: o.label };
    const tile = this.layer.getTileAtWorldXY(f.x, f.y);
    const look = tile && TILE_LOOKS[tile.index];
    return look ? { kind: 'object', id: look, label: 'Look' } : null;
  }

  update(time, dt) {
    const p = this.player;
    const k = this.keys;
    this.stars.tilePositionX += dt * 0.004;
    if (this.rain) {
      const v = this.cameras.main.worldView, w = v.width, h = v.height;
      this.rain.clear();
      if (this.snow) {
        this.rain.fillStyle(0xffffff, 0.8);
        for (const d of this.drops) {
          d.y += dt * 0.00012 * d.v; d.x += Math.sin((time / 900) + d.v * 7) * dt * 0.00004;
          if (d.y > 1) { d.y = 0; d.x = Math.random(); }
          if (d.x < 0) d.x += 1; if (d.x > 1) d.x -= 1;
          this.rain.fillRect(v.x + d.x * w, v.y + d.y * h, d.v > .75 ? 2 : 1, d.v > .75 ? 2 : 1);
        }
      } else {
        this.rain.lineStyle(1, 0x9fc6e0, 0.35);
        for (const d of this.drops) {
          d.y += dt * 0.0011 * d.v; d.x -= dt * 0.0002 * d.v;
          if (d.y > 1) { d.y = 0; d.x = Math.random(); }
          if (d.x < 0) d.x += 1;
          const x = v.x + d.x * w, y = v.y + d.y * h;
          this.rain.lineBetween(x, y, x - 1.5, y + 5);
        }
      }
    }

    if (Input.blocked > 0) {
      p.setVelocity(0, 0); p.anims.stop();
      p.setFrame(DIRS.indexOf(this.facing) * 3);
      // swallow key presses made while a menu was open
      [k.act, k.e, k.enter, k.esc, k.m].forEach(key => Phaser.Input.Keyboard.JustDown(key));
      Input.action = false; Input.menu = false;
      return;
    }
    state.playtime += dt / 1000;

    let vx = Input.x, vy = Input.y;
    if (k.left.isDown || k.a.isDown) vx = -1;
    else if (k.right.isDown || k.d.isDown) vx = 1;
    if (k.up.isDown || k.w.isDown) vy = -1;
    else if (k.down.isDown || k.s.isDown) vy = 1;
    const len = Math.hypot(vx, vy);
    if (len > 0.2) {
      const nx = vx / Math.max(1, len), ny = vy / Math.max(1, len);
      p.setVelocity(nx * SPEED, ny * SPEED);
      this.facing = Math.abs(nx) > Math.abs(ny) ? (nx < 0 ? 'left' : 'right') : (ny < 0 ? 'up' : 'down');
      p.anims.play('player-walk-' + this.facing, true);
    } else {
      p.setVelocity(0, 0);
      p.anims.stop();
      p.setFrame(DIRS.indexOf(this.facing) * 3);
    }
    p.setDepth(p.y);
    this.npcs.forEach(n => n.setDepth(n.footY));
    state.pos = { px: Math.round(p.x), py: Math.round(p.y) };
    if (this.dark) this.dark.setPosition(p.x, p.y - 6);
    if (this.tail) { this.updateTail(dt); if (!this.scene.isActive()) return; }
    if (this.spots && this.updateSpots(time)) return;
    if (this.patrols.length && this.updatePatrols(time, dt)) return;
    if (this.mapDef.minimap && (!this._mm || time - this._mm > 150)) { this._mm = time; bus.emit('minimap-pos', p.x / T, p.y / T); }

    // tiles that start a conversation the first time you step on them
    for (const tr of this.mapDef.triggers || []) {
      const tx = Math.floor(p.x / T), ty = Math.floor((p.y - 2) / T);
      if (!state.flags[tr.flag] && !this._trig && tx >= tr.x && tx < tr.x + (tr.w || 1) && ty >= tr.y && ty < tr.y + (tr.h || 1)) {
        this._trig = true; p.setVelocity(0, 0);
        bus.emit('trigger', tr.run);
        this.time.delayedCall(600, () => { this._trig = false; });
        return;
      }
    }

    const target = this.findTarget();
    const label = target ? target.label : null;
    if (label !== this.hintText) { this.hintText = label; bus.emit('hint', label); }

    const J = Phaser.Input.Keyboard.JustDown;
    if (performance.now() - Input.unblockedAt < 200) {
      [k.act, k.e, k.enter, k.esc, k.m].forEach(key => J(key));
      Input.action = false; Input.menu = false;
      return;
    }
    const pressed = Input.action || J(k.act) || J(k.e) || J(k.enter);
    Input.action = false;
    if (pressed && target) {
      if (target.kind === 'npc' && target.spr.npcId !== 'brushes' && !['drone', 'mantis', 'lyra'].includes(target.spr.def.look || target.spr.npcId)) {
        const dx = p.x - target.spr.x, dy = p.y - target.spr.y;
        const face = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
        target.spr.setFrame(DIRS.indexOf(face) * 3);
        bus.once('dialog-closed', () => target.spr.setFrame(DIRS.indexOf(target.spr.homeFace) * 3));
      }
      bus.emit('interact', target.id, target.kind);
    }
    if (Input.menu || J(k.esc) || J(k.m)) { Input.menu = false; bus.emit('menu'); }
  }
}

// A small speech bubble with an exclamation mark, shown over crew with something to say.
function bubbleCanvas() {
  const cv = document.createElement('canvas'); cv.width = 11; cv.height = 12;
  const c = cv.getContext('2d');
  c.fillStyle = '#07080d'; c.fillRect(1, 0, 9, 1); c.fillRect(0, 1, 11, 8); c.fillRect(1, 9, 9, 1); c.fillRect(3, 10, 3, 1); c.fillRect(3, 11, 1, 1);
  c.fillStyle = '#e9b23a'; c.fillRect(1, 1, 9, 8); c.fillRect(4, 9, 2, 1); c.fillRect(4, 10, 1, 1);
  c.fillStyle = '#10121e'; c.fillRect(5, 2, 1, 4); c.fillRect(5, 7, 1, 1);
  return cv;
}
