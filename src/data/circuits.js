// Power-routing puzzles for the Targon mine. Tap a tile to turn it a quarter clockwise;
// get power from the source to every labelled output.
//
// Each tile is a bitmask of the sides it connects: N=1, E=2, S=4, W=8.
// "solved" is one working layout; "turns" is how many quarter turns each tile starts away from it
// (the player needs 4 - turns taps to put a tile back). Ports sit just outside the grid:
// side is the edge they're on, at is the row (for E/W) or column (for N/S).
export const N = 1, E = 2, S = 4, W = 8;

export const CIRCUITS = {
  surface: {
    title: 'Pump house junction board',
    note: 'The Mantis tore through the cabling. Route the generator to the main lift and the shaft fans.',
    source: { side: 'W', at: 1, label: 'Generator', short: 'Gen' },
    outputs: [
      { side: 'E', at: 0, label: 'Main lift', short: 'Lift' },
      { side: 'E', at: 2, label: 'Shaft fans', short: 'Fans' }
    ],
    flag: 'tg_power1',
    solved: [
      [3, 5, 6, 10, 10],
      [10, 10, 13, 7, 9],
      [6, 10, 3, 10, 10]
    ],
    turns: [
      [1, 2, 1, 1, 3],
      [1, 3, 2, 1, 2],
      [2, 1, 3, 1, 1]
    ]
  },
  deep: {
    title: 'Level 4 junction box',
    note: 'Two outputs left on this box: the tunnel lights and the ore cart line across the drop.',
    source: { side: 'W', at: 3, label: 'Feed from the surface', short: 'Feed' },
    outputs: [
      { side: 'N', at: 1, label: 'Tunnel lights', short: 'Lights' },
      { side: 'E', at: 2, label: 'Cart line', short: 'Cart' }
    ],
    flag: 'tg_lights',
    solved: [
      [6, 5, 3, 12, 5, 9],
      [10, 5, 6, 10, 12, 3],
      [6, 11, 10, 12, 6, 10],
      [9, 7, 5, 3, 9, 12]
    ],
    turns: [
      [2, 1, 3, 1, 2, 1],
      [1, 3, 2, 3, 1, 2],
      [3, 1, 2, 1, 3, 3],
      [1, 2, 1, 3, 2, 1]
    ]
  }
};

export const rotate = (m, k = 1) => { for (let i = 0; i < ((k % 4) + 4) % 4; i++) m = ((m << 1) | (m >> 3)) & 15; return m; };
const DIR = { 1: [0, -1, 4], 2: [1, 0, 8], 4: [0, 1, 1], 8: [-1, 0, 2] };   // dx, dy, opposite side

// Which tiles carry power, and which outputs are lit.
export function trace(c, grid) {
  const H = grid.length, Wd = grid[0].length;
  const start = c.source.side === 'W' ? [0, c.source.at, W] : c.source.side === 'E' ? [Wd - 1, c.source.at, E] : c.source.side === 'N' ? [c.source.at, 0, N] : [c.source.at, H - 1, S];
  const lit = grid.map(r => r.map(() => false));
  const [sx, sy, sd] = start;
  if (grid[sy][sx] & sd) {
    const q = [[sx, sy]]; lit[sy][sx] = true;
    while (q.length) {
      const [x, y] = q.shift();
      for (const bit of [N, E, S, W]) {
        if (!(grid[y][x] & bit)) continue;
        const [dx, dy, opp] = DIR[bit], nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= Wd || ny >= H || lit[ny][nx] || !(grid[ny][nx] & opp)) continue;
        lit[ny][nx] = true; q.push([nx, ny]);
      }
    }
  }
  const out = c.outputs.map(o => {
    const [x, y, bit] = o.side === 'E' ? [Wd - 1, o.at, E] : o.side === 'W' ? [0, o.at, W] : o.side === 'N' ? [o.at, 0, N] : [o.at, H - 1, S];
    return lit[y][x] && !!(grid[y][x] & bit);
  });
  return { lit, out, done: out.every(Boolean) };
}

export const startGrid = c => c.solved.map((row, y) => row.map((m, x) => rotate(m, c.turns[y][x])));
