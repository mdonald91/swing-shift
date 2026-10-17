// Map layouts. Each character is one 16px tile; see TILE for what they mean.
// Coordinates in spawns/npcs/objects are tile columns (x) and rows (y), counting from 0.
export const TILE = {
  ' ': -1,
  // the Hi-Hat
  '#': 0, 'W': 1, 'O': 2, '.': 3, ',': 4, 'r': 5, 'c': 6, 'C': 7, 't': 8,
  'B': 9, 'b': 10, 'g': 11, 'f': 12, 'p': 13, 'D': 14, 'j': 15, 'K': 16, 'e': 17,
  // Dock 9
  '_': 18, '=': 19, 'R': 20, 'T': 21, 'V': 22, 'x': 23, 'H': 24, 'G': 25, 'L': 26,
  '~': 27, 'P': 28, 'v': 30, 'o': 31
};
// Tiles you can't walk through.
export const SOLID = [0, 1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31];
// Tiles that give a generic "Look" when you face them and nothing more specific is there.
export const TILE_LOOKS = { 20: 'container', 21: 'container', 22: 'container', 26: 'lamp', 24: 'warehouse' };

export const MAPS = {
  ship: {
    name: 'The Hi-Hat',
    jp: 'ハイハット号',
    where: 'Jupiter orbit, near Ganymede',
    music: 'ship',
    rows: [
      '########################',
      '#WWOWWfgggWWOWWWWOOOOWW#',
      '#b......,........KKKK..#',
      '#e......,..............#',
      '#.......,...rrrrr....B.#',
      '#.cC....,...rrtrr......#',
      '#.......,...rrrrr..p...#',
      '#p..j...,..............#',
      '#,,,,,,,,,,,,,,,,,,,,,,#',
      '#......................#',
      '###########D############'
    ],
    spawns: { default: { x: 11, y: 8 }, cockpit: { x: 18, y: 3 }, lounge: { x: 6, y: 6 } },
    npcs: [
      { id: 'rook', x: 2, y: 6, face: 'down' },
      { id: 'tam', x: 8, y: 2, face: 'down' },
      { id: 'brushes', x: 20, y: 4 }
    ],
    objects: [
      { id: 'bed', x: 1, y: 2, w: 1, h: 2, label: 'Rest' },
      { id: 'fridge', x: 6, y: 1, label: 'Check the fridge' },
      { id: 'galley', x: 7, y: 1, w: 3, label: 'Galley' },
      { id: 'cockpit', x: 17, y: 2, w: 4, label: 'Ship systems' },
      { id: 'board', x: 21, y: 4, label: 'Bounty board' },
      { id: 'jukebox', x: 4, y: 7, label: 'Jukebox' },
      { id: 'couch', x: 2, y: 5, w: 2, label: 'Couch' },
      { id: 'plant', x: 19, y: 6, label: 'Look' },
      { id: 'plant', x: 1, y: 7, label: 'Look' },
      { id: 'table', x: 14, y: 5, label: 'Look' },
      { id: 'hatch', x: 11, y: 10, label: 'Airlock' },
      { id: 'window', x: 3, y: 1, label: 'Look outside' },
      { id: 'window', x: 12, y: 1, label: 'Look outside' }
    ]
  },

  docks: {
    name: 'Dock 9',
    jp: 'ガニメデ・第9ドック',
    where: 'Ganymede',
    music: 'tense',
    rows: [
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~HHHHHHHHHHHGHHHHH~~HHHHHHHHH~',
      '~_____L_____=_____L________v_~',
      '~___________=________________~',
      '~__RRR___TTT=__VVV___RRR_____~',
      '~__RRR___TTT=__VVV___RRR__xx_~',
      '~___________=_______________o~',
      '~============================~',
      '~___________=________________~',
      '~_xx__TTT__L=__RRR___VVV____o~',
      '~_x___TTT___=__RRR___VVV_____~',
      '~___________=________________~',
      '~____PPPPP__=_______L________~',
      '~____PPPPP__=________________~',
      '~____PPPPP__=______________o_~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
    ],
    spawns: { default: { x: 4, y: 11 } },
    ship: { x: 7, y: 13 },      // where the Hi-Hat sits on the landing pad
    npcs: [
      { id: 'rook', x: 3, y: 12, face: 'right' },
      { id: 'tam', x: 10, y: 13, face: 'left' },
      { id: 'ozzie', x: 22, y: 2, face: 'down' },
      { id: 'goon', x: 11, y: 2, face: 'down', look: 'goon' },
      { id: 'goon', x: 14, y: 2, face: 'down', look: 'goon2' }
    ],
    objects: [
      { id: 'door', x: 12, y: 1, label: 'Warehouse 9-C' },
      { id: 'manifest', x: 26, y: 5, w: 2, label: 'Search the crates' },
      { id: 'ink', x: 28, y: 9, label: 'Search the drums' },
      { id: 'chit', x: 27, y: 2, label: 'Vending machine' },
      { id: 'drum', x: 28, y: 6, label: 'Look' },
      { id: 'drum', x: 27, y: 14, label: 'Look' },
      { id: 'crate', x: 2, y: 9, w: 2, h: 2, label: 'Look' },
      { id: 'ship', x: 5, y: 12, w: 5, h: 3, label: 'Board the Hi-Hat' }
    ]
  }
};
