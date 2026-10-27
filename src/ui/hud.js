// On-screen HUD while walking around: location, objective, chits, menu, hints and touch controls.
import { state } from '../state.js';
import { jobObjective } from '../systems/jobs.js';
import { Input } from '../systems/input.js';
import { bus } from '../bus.js';

let root, hintEl, objEl, chitsEl, areaEl, locEl;
const touchQuery = window.matchMedia ? window.matchMedia('(pointer: coarse)') : { matches: false };

export function objective() {
  const f = state.flags;
  if (!f.intro_done) return '';
  const met = ['met_rook', 'met_tam', 'met_brushes'].filter(k => f[k]).length;
  if (f.act1_done) {
    if (f.game_done) return "The record's over. Thanks for listening";
    if (f.bluenote_done) {
      if (state.location === 'lyceum_hall') return 'Say hello to the audience, then talk to Ambrose on stage';
      return f.lastset_arrived ? 'Fly back to the Lyceum on Titan from the cockpit' : 'Fly to Titan for the last set, from the cockpit';
    }
    if (f.metronome_done) {
      const loc = state.location, sq = state.squads?.split ? state.squads.active : null;
      if (loc === 'bn_ring' || loc === 'bn_spine') {
        if (!f.bn_split) return 'Find a way into the ring. The door by the dock';
        if (sq === 'a') {
          if (!f.bn_d1) return "Team A: the ring door is sealed. Swap to Team B to open it";
          if (!f.bn_d2) return "Team A: pull the pressure lever in the ring to open Team B's hatch";
          if (!f.bn_d3) return 'Team A: Team B has to open the core door from the node room. Swap to them';
          return 'Team A: go through the core door. Both teams are in place';
        }
        if (!f.bn_d1) return "Team B: open the ring door from the controls by the airlock";
        if (!f.bn_d2) return "Team B: the hatch is sealed. Swap to Team A to pull the pressure lever";
        if (!f.bn_d3) return 'Team B: reach the node room at the end of the spine and open the core door';
        return 'Team B is in place. Swap to Team A and go through the core door';
      }
      return f.bn_arrived ? 'Fly back to Blue Note station from the cockpit' : 'Fly to Blue Note station, past Saturn, from the cockpit';
    }
    if (f.act3_open) {
      if (!f.bounty_conductor) return 'Accept The Conductor on the bounty board';
      if (state.location === 'helix_hq') return 'Find Director Hale on the top floor';
      if (state.location === 'cygnus_lock') return "Reach Helix Salvage at the top of the plaza. Stay out of the collectors' sight";
      return 'Fly to Cygnus Station and find out who posted the bounty';
    }
    if (f.act2_done) return 'Side B complete. Rest up aboard the Hi-Hat.';
    if (f.nocturne_done) return 'Head back to the Hi-Hat';
    if (f.proto_done) {
      if (!f.bounty_nocturne) return 'Accept Mister Nocturne on the bounty board';
      if (state.location === 'lyceum') return f.heist_done ? 'Stop Mister Nocturne' : 'Cross backstage on the dark beats and pull the piano-lift lever';
      if (state.location === 'titan') {
        if (!f.heist_ready) return 'Find a way into the Lyceum. Try the stagehand by the stage door';
        return 'Slip in through the stage door, on the right of the square';
      }
      if (!f.sol_story && state.location === 'cygnus') return 'Old Sol on the plaza wants a word, or fly to Titan from the cockpit';
      return f.titan_arrived ? 'Fly back to Titan from the cockpit' : 'Fly to Titan from the cockpit';
    }
    if (f.mantis_done) {
      if (!f.bounty_proto) return 'Accept Runaway Prototype on the bounty board';
      if (state.location === 'nyx') {
        if (!f.met_sato) return 'Talk to Dr Sato in the lobby';
        if (!f.labsec_cleared) return 'Get past lab security in the east corridor';
        if (!f.nyx_dome_open) return 'Open the garden dome door at the end of the corridor';
        return 'Find Lyra in the garden dome';
      }
      if (state.location === 'nyx_dome') return 'Find Lyra by the frozen fountain';
      return f.nyx_arrived ? 'Fly back to Nyx from the cockpit' : 'Fly to Nyx from the cockpit';
    }
    if (!f.bounty_mantis) return 'Accept Iron Mantis on the bounty board';
    if (state.location === 'targon') {
      if (!f.tg_power1) return f.met_okada ? 'Route power to the main lift: junction board in the pump house' : 'Talk to the foreman';
      return 'Take the main lift down to Level 4';
    }
    if (state.location === 'targon_deep') {
      if (!f.minebots_cleared) return 'Clear the mine bots off the junction box';
      if (!f.tg_lights) return 'Route power to the lights and the cart line';
      if (!f.tg_cavein) return 'Ride the ore cart across the drop, then head down';
      if (!f.ferro_found) return 'Find Dagny Ferro';
      return 'Face the Iron Mantis in the west of the gallery';
    }
    return f.targon_arrived ? 'Fly back to Targon from the cockpit' : 'Fly to Targon from the cockpit';
  }
  if (f.velvet_done) {
    const chats = ['rook', 'tam', 'brushes'].filter(k => f['chat_' + k]).length;
    if (!f.cygnus_arrived) return chats < 3 ? `Catch up with your crew (${chats}/3), then fly to Cygnus Station` : 'Fly to Cygnus Station from the cockpit';
    if (!f.ghost_offered) return 'Visit Helix Salvage on the Cygnus plaza';
    if (!f.bounty_ghost) return 'Accept Ghost Frequency on the bounty board';
    if (f.courier_done) return 'Head back to the Hi-Hat';
    if (f.ghost_done) {
      if (!f.bounty_courier) return 'Accept The Missing Courier on the bounty board';
      if (state.location === 'vesta') {
        if (!f.met_pell) return 'Find Pell the broker in the market';
        if (!f.tail_done) return 'Tail the man in the grey coat';
        return 'Find Wren behind the hideout door';
      }
      return 'Fly to Vesta from the cockpit';
    }
    if (state.location === 'relay') {
      if (!f.power_on) return 'Restore power at the generator';
      if (!f.k17_keycard) return 'Search the crew quarters';
      if (!f.drones_cleared) return 'Deal with the drones outside the comms hub';
      return 'Find whoever is playing the four bars';
    }
    return 'Fly to Relay K-17 from the cockpit';
  }
  if (!f.bounty_velvet) return met < 3 ? `Talk to your crew (${met}/3)` : 'Check the bounty board';
  if (state.location === 'docks') {
    if (!f.door_open) return `Find proof of the press (${f.clues || 0}/3)`;
    return 'Get into Warehouse 9-C';
  }
  return f.velvet_course ? 'Fly back to Dock 9 from the cockpit' : 'Fly to Dock 9 from the cockpit';
}

export const Hud = {
  mount(layer) {
    root = document.createElement('div');
    root.id = 'hud';
    root.hidden = true;
    root.innerHTML = `
      <div class="hud-loc">
        <div class="hud-place"><b id="hud-name">The Hi-Hat</b><span class="jp" id="hud-jp">ハイハット号</span></div>
        <p class="hud-obj" id="hud-obj" hidden><i aria-hidden="true"></i><span></span></p>
        <p class="hud-job" id="hud-job" hidden></p>
      </div>
      <div class="hud-right">
        <span class="chits" id="hud-chits" title="Chits"></span>
        <button class="hud-menu hud-squad" id="hud-squad" type="button" hidden>Swap team</button>
        <button class="hud-menu" id="hud-menu" type="button">Menu</button>
      </div>
      <canvas class="minimap" id="minimap" hidden aria-label="Map"></canvas>
      <div class="tailmeter panel" id="tailmeter" hidden>
        <p class="eyebrow">Tailing Fennick</p>
        <div class="tm-bar"><i class="tm-zone"></i><i class="tm-mark"></i></div>
        <p class="tm-status"></p>
      </div>
      <div class="hud-hint" id="hud-hint" hidden><kbd class="k-key">Space</kbd><kbd class="k-touch">A</kbd><span></span></div>
      <div class="stick-zone" id="stick-zone"><div class="stick" id="stick" hidden><i class="knob" id="knob"></i></div></div>
      <button class="btn-a" id="btn-a" type="button" aria-label="Interact">A</button>
      <div class="hud-autosave" id="hud-autosave" aria-live="polite">Autosaving</div>
      <div class="areacard" id="areacard" hidden><span class="ac-jp"></span><b class="ac-name"></b><span class="ac-where"></span></div>`;
    layer.append(root);
    hintEl = root.querySelector('#hud-hint');
    objEl = root.querySelector('#hud-obj');
    chitsEl = root.querySelector('#hud-chits');
    areaEl = root.querySelector('#areacard');
    locEl = { name: root.querySelector('#hud-name'), jp: root.querySelector('#hud-jp') };

    root.querySelector('#hud-menu').addEventListener('click', () => bus.emit('menu'));
    root.querySelector('#hud-squad').addEventListener('click', () => bus.emit('swap-squad'));
    window.addEventListener('keydown', e => { if ((e.key === 'Tab' || e.key === 'q' || e.key === 'Q') && state.squads?.split && /^bn_/.test(state.location) && !root.hidden) { e.preventDefault(); bus.emit('swap-squad'); } });
    const a = root.querySelector('#btn-a');
    a.addEventListener('pointerdown', e => { e.preventDefault(); Input.action = true; a.classList.add('down'); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => a.addEventListener(ev, () => a.classList.remove('down')));
    setupStick(root.querySelector('#stick-zone'), root.querySelector('#stick'), root.querySelector('#knob'));

    const setTouch = on => document.body.classList.toggle('touch-on', on);
    setTouch(touchQuery.matches);
    window.addEventListener('touchstart', () => setTouch(true), { passive: true });
    window.addEventListener('keydown', e => { if (e.key.length > 1 || /^[a-z ]$/i.test(e.key)) setTouch(false); });

    bus.on('dialog-closed', () => Hud.refresh());
    const mm = root.querySelector('#minimap');
    let mmData = null, mmPos = null;
    const drawMM = () => {
      if (!mmData) { mm.hidden = true; return; }
      const C = 3, h = mmData.length, w = mmData[0].length;
      mm.width = w * C; mm.height = h * C; mm.hidden = false;
      const c = mm.getContext('2d');
      const col = ['rgba(0,0,0,0)', '#3a4258', '#151a28', '#7fe0c8', '#d5473b'];
      mmData.forEach((row, y) => row.forEach((v, x) => { if (v) { c.fillStyle = col[v]; c.fillRect(x * C, y * C, C, C); } }));
      if (mmPos) { c.fillStyle = '#e9b23a'; c.fillRect(Math.floor(mmPos[0]) * C - 1, Math.floor(mmPos[1]) * C - 1, C + 2, C + 2); }
    };
    let mmMark = null;
    const drawMark = () => {
      if (!mmMark || !mmData) return;
      const c = mm.getContext('2d'), C = 3;
      c.fillStyle = '#d5473b'; c.fillRect(Math.floor(mmMark[0]) * C - 1, Math.floor(mmMark[1]) * C - 1, C + 2, C + 2);
    };
    bus.on('minimap', d => { mmData = d; drawMM(); drawMark(); });
    bus.on('minimap-pos', (x, y) => { mmPos = [x, y]; drawMM(); drawMark(); });
    const tm = root.querySelector('#tailmeter');
    bus.on('tail-status', st => {
      tm.hidden = !st;
      mmMark = st && state.flags.juno_protected ? [st.x, st.y] : null;
      if (!st) return;
      const max = st.lost + 2, pct = v => Math.max(0, Math.min(100, v / max * 100));
      tm.querySelector('.tm-zone').style.left = pct(2.5) + '%';
      tm.querySelector('.tm-zone').style.width = (pct(st.lost - 1) - pct(2.5)) + '%';
      tm.querySelector('.tm-mark').style.left = pct(st.dist) + '%';
      let msg, cls;
      if (st.mode === 'warn') { msg = "He's about to look back. Get behind a stall!"; cls = 'warn'; }
      else if (st.mode === 'look') { msg = 'He is looking back. Stay out of sight.'; cls = 'bad'; }
      else if (st.dist < 2) { msg = 'Too close!'; cls = 'bad'; }
      else if (st.dist > st.lost - 1) { msg = 'Losing him...'; cls = 'warn'; }
      else { msg = 'Good distance'; cls = 'good'; }
      const el = tm.querySelector('.tm-status'); el.textContent = msg; el.className = 'tm-status ' + cls;
    });
  },
  show() { root.hidden = false; Hud.refresh(); },
  hide() { root.hidden = true; },
  refresh() {
    const o = objective();
    objEl.hidden = !o;
    objEl.querySelector('span').textContent = o;
    chitsEl.textContent = '₡ ' + state.chits.toLocaleString('en-AU');
    const sq = root.querySelector('#hud-squad'), split = !!state.squads?.split && /^bn_/.test(state.location);
    sq.hidden = !split;
    if (split) sq.textContent = state.squads.active === 'a' ? `Swap to Team B` : 'Swap to Team A';
    const jobEl = root.querySelector('#hud-job'), jt = jobObjective();
    jobEl.hidden = !jt; jobEl.textContent = jt;
  },
  autosaved() {
    const a = root.querySelector('#hud-autosave');
    a.classList.add('on'); clearTimeout(Hud._as);
    Hud._as = setTimeout(() => a.classList.remove('on'), 1500);
  },
  hint(text) {
    hintEl.hidden = !text;
    if (text) hintEl.querySelector('span').textContent = text;
  },
  area(map) {
    const same = Hud._lastArea === map.name;
    Hud._lastArea = map.name;
    locEl.name.textContent = map.name; locEl.jp.textContent = map.jp;
    areaEl.querySelector('.ac-jp').textContent = map.jp;
    areaEl.querySelector('.ac-name').textContent = map.name;
    areaEl.querySelector('.ac-where').textContent = map.where;
    if (same) { Hud.refresh(); return; }
    areaEl.hidden = true; void areaEl.offsetWidth; areaEl.hidden = false;
    clearTimeout(areaEl._t);
    areaEl._t = setTimeout(() => { areaEl.hidden = true; }, 3200);
    Hud.refresh();
  }
};

function setupStick(zone, stick, knob) {
  const R = 44;
  let id = null, cx = 0, cy = 0;
  zone.addEventListener('pointerdown', e => {
    if (id !== null) return;
    id = e.pointerId; zone.setPointerCapture(id);
    cx = e.clientX; cy = e.clientY;
    stick.style.left = cx + 'px'; stick.style.top = cy + 'px';
    stick.hidden = false; knob.style.transform = 'translate(-50%,-50%)';
  });
  zone.addEventListener('pointermove', e => {
    if (e.pointerId !== id) return;
    let dx = e.clientX - cx, dy = e.clientY - cy;
    const d = Math.hypot(dx, dy);
    if (d > R) { dx *= R / d; dy *= R / d; }
    knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    Input.x = Math.abs(dx) > 8 ? dx / R : 0;
    Input.y = Math.abs(dy) > 8 ? dy / R : 0;
  });
  const end = e => {
    if (e.pointerId !== id) return;
    id = null; stick.hidden = true; Input.x = Input.y = 0;
  };
  zone.addEventListener('pointerup', end);
  zone.addEventListener('pointercancel', end);
}
