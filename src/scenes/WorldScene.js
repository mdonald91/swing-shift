// The walkable world: tile map, the captain, crew and things to interact with.
import { MAPS, TILE, SOLID } from '../data/maps.js';
import { characterSheet, droneSheet, tileSheet, starTile, addSheet, DIRS } from '../art/pixel.js';
import { resolveLook, NPC_LOOKS } from '../data/appearance.js';
import { Input } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { state } from '../state.js';
import { bus } from '../bus.js';

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
    this.W = tm.widthInPixels; this.H = tm.heightInPixels;
    this.physics.world.setBounds(0, 0, this.W, this.H);

    const sx = state.pos ? state.pos.px : map.spawn.x * T + 8;
    const sy = state.pos ? state.pos.py : map.spawn.y * T + 8;
    this.player = this.physics.add.sprite(sx, sy, 'player', 0).setOrigin(0.5, 0.85);
    this.player.body.setSize(10, 6).setOffset(3, 17);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.layer);
    this.facing = 'down';

    // crew
    this.npcs = [];
    const blockers = this.physics.add.staticGroup();
    for (const n of map.npcs) {
      const key = 'npc-' + n.id;
      const x = n.x * T + 8, y = n.y * T + 8;
      let spr;
      if (n.id === 'brushes') {
        if (!this.textures.exists(key)) addSheet(this, key, droneSheet(), 16, 16);
        spr = this.add.sprite(x, y - 4, key, 0).setOrigin(0.5, 0.8);
        this.tweens.add({ targets: spr, y: y - 8, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        this.time.addEvent({ delay: 2600, loop: true, callback: () => { spr.setFrame(1); this.time.delayedCall(140, () => spr.setFrame(0)); } });
      } else {
        if (!this.textures.exists(key)) { addSheet(this, key, characterSheet(NPC_LOOKS[n.id]), 16, 24); }
        spr = this.add.sprite(x, y, key, DIRS.indexOf(n.face || 'down') * 3).setOrigin(0.5, 0.85);
      }
      spr.npcId = n.id; spr.homeFace = n.face || 'down'; spr.footY = y + 4;
      const z = this.add.zone(x, y + 3, 12, 8);
      blockers.add(z);
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

    this.hintText = null;
    Audio.setMood(map.music);
    bus.emit('area', map);
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
      const dist = Phaser.Math.Distance.Between(f.x, f.y, n.x, n.footY - 4);
      if (dist < bd) { bd = dist; best = { kind: 'npc', id: n.npcId, spr: n, label: 'Talk to ' + n.npcId[0].toUpperCase() + n.npcId.slice(1) }; }
    }
    if (best) return best;
    const o = this.objects.find(o => o.rect.contains(f.x, f.y));
    return o ? { kind: 'object', id: o.id, label: o.label } : null;
  }

  update(time, dt) {
    const p = this.player;
    const k = this.keys;
    this.stars.tilePositionX += dt * 0.004;

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
      if (target.kind === 'npc' && target.spr.npcId !== 'brushes') {
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
