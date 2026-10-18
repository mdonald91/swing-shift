// Map checker: walks every map from its spawn points and reports anything a player can't reach.
// Run with:  node tools/check-maps.mjs      (exits with an error if a problem is found)
// Doors that open later (map.doors) count as open, since the story opens them.
import { MAPS, TILE, SOLID } from '../src/data/maps.js';
import { JOBS, STORY_JOBS } from '../src/data/jobs.js';
const JOB_SPOTS = [...JOBS, ...STORY_JOBS].filter(j => j.at);

let problems = 0;
const say = (map, msg) => { problems++; console.log(`  ✗ ${map}: ${msg}`); };

for (const [name, m] of Object.entries(MAPS)) {
  const H = m.rows.length, W = m.rows[0].length;
  m.rows.forEach((r, y) => { if (r.length !== W) say(name, `row ${y} is ${r.length} wide, expected ${W}`); });
  const doors = new Set((m.doors || []).map(d => d.x + ',' + d.y));
  // rooms that can appear later (map.swaps) count as solid if they would be
  const swapped = new Map((m.swaps || []).map(d => [d.x + ',' + d.y, d.to]));
  // shortcuts (swaps marked "shortcut") only open for some players, so everything must also be reachable without them
  const shortcut = new Set((m.swaps || []).filter(d => d.shortcut).map(d => d.x + ',' + d.y));
  const solidAt = base => (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return true;
    if (doors.has(x + ',' + y)) return false;
    const k = x + ',' + y;
    const t = TILE[(base && shortcut.has(k) ? null : swapped.get(k)) || [...m.rows[y]][x]];
    return t === undefined || t < 0 || SOLID.includes(t);
  };
  const solid = solidAt(false), solidBase = solidAt(true);
  // NPCs who are always there block their tile; ones who leave later (if/ifNot) don't count as walls
  const npcAt = new Set(m.npcs.filter(n => !n.if && !n.ifNot).map(n => n.x + ',' + n.y));

  // flood fill from every spawn
  const fill = isSolid => {
    const seen = new Set(), queue = [];
    for (const [k, s] of Object.entries(m.spawns)) {
      if (isSolid(s.x, s.y)) say(name, `spawn "${k}" at ${s.x},${s.y} is inside a wall`);
      queue.push([s.x, s.y]); seen.add(s.x + ',' + s.y);
    }
    while (queue.length) {
      const [x, y] = queue.shift();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, key = nx + ',' + ny;
        if (seen.has(key) || isSolid(nx, ny) || npcAt.has(key)) continue;
        seen.add(key); queue.push([nx, ny]);
      }
    }
    return seen;
  };
  const seen = fill(solid);
  const seenBase = shortcut.size ? fill(solidBase) : seen;
  const touchable = (x, y, w = 1, h = 1) => {
    for (let yy = y - 1; yy <= y + h; yy++) for (let xx = x - 1; xx <= x + w; xx++) {
      const inside = xx >= x && xx < x + w && yy >= y && yy < y + h;
      const edge = !inside && (xx >= x && xx < x + w || yy >= y && yy < y + h);   // not diagonal
      if ((inside || edge) && seenBase.has(xx + ',' + yy)) return true;
    }
    return false;
  };
  for (const o of m.objects) if (!touchable(o.x, o.y, o.w || 1, o.h || 1)) say(name, `can't reach object "${o.id}" at ${o.x},${o.y}`);
  for (const n of m.npcs) if (!n.deco && !touchable(n.x, n.y)) say(name, `can't reach ${n.id} at ${n.x},${n.y}`);
  for (const d of m.doors || []) if (!touchable(d.x, d.y)) say(name, `can't reach door at ${d.x},${d.y}`);
  // odd-job markers must stand somewhere you can reach and talk to
  for (const j of JOB_SPOTS.filter(j => j.map === name)) {
    if (solid(j.at.x, j.at.y)) say(name, `odd job "${j.id}" marker at ${j.at.x},${j.at.y} is inside a wall`);
    else if (!touchable(j.at.x, j.at.y)) say(name, `can't reach odd job "${j.id}" at ${j.at.x},${j.at.y}`);
  }
  // spotlights must leave somewhere dark to wait: no two spots in the same place
  for (const sp of m.spots || []) if (!m.spawns[sp.reset]) say(name, `spotlight at ${sp.x},${sp.y} resets to a missing spawn "${sp.reset}"`);
  if (m.tail) for (const [x, y] of m.tail.path) {
    const t = TILE[m.rows[y][x]];
    if (!doors.has(x + ',' + y) && SOLID.includes(t)) say(name, `tail route passes through a wall at ${x},${y}`);
  }
  // patrols walk straight lines between their points, over floor
  for (const pt of m.patrols || []) {
    for (let i = 0; i < pt.path.length; i++) {
      const [x, y] = pt.path[i], [nx, ny] = pt.path[i + 1] || pt.path[i];
      if (x !== nx && y !== ny) say(name, `patrol "${pt.id}" moves diagonally from ${x},${y}`);
      for (let k = 0; k <= Math.max(Math.abs(nx - x), Math.abs(ny - y)); k++) {
        const px = x + Math.sign(nx - x) * k, py = y + Math.sign(ny - y) * k;
        if (solidBase(px, py)) say(name, `patrol "${pt.id}" walks through a wall at ${px},${py}`);
      }
    }
  }
  // any sealed-off pocket of floor bigger than a couple of tiles is almost certainly a mistake
  const lost = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const k = x + ',' + y;
    if (solid(x, y) || seen.has(k) || lost.has(k)) continue;
    const pocket = [[x, y]]; lost.add(k);
    for (let i = 0; i < pocket.length; i++) {
      const [px, py] = pocket[i];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nk = (px + dx) + ',' + (py + dy);
        if (!solid(px + dx, py + dy) && !seen.has(nk) && !lost.has(nk)) { lost.add(nk); pocket.push([px + dx, py + dy]); }
      }
    }
    const meant = (m.offLimits || []).some(([ox, oy]) => pocket.some(([px, py]) => px === ox && py === oy));
    if (pocket.length > 3 && !meant) say(name, `${pocket.length} floor tiles around ${x},${y} can't be reached`);
  }
  const floor = m.rows.flatMap((r, y) => [...r].map((c, x) => [x, y])).filter(([x, y]) => !solid(x, y)).length;
  console.log(`${problems ? '' : '✓'} ${name}: ${seen.size} of ${floor} floor tiles reachable${shortcut.size ? ` (${seenBase.size} without shortcuts)` : ''}`);
}
console.log(problems ? `\n${problems} problem(s) found` : '\nAll maps fully reachable');
process.exit(problems ? 1 : 0);
