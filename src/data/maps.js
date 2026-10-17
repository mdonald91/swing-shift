// Map layouts. Each character is one 16px tile; see TILE for what they mean.
// Coordinates in npcs/objects are tile columns (x) and rows (y), counting from 0.
export const TILE = {
  ' ': -1, '#': 0, 'W': 1, 'O': 2, '.': 3, ',': 4, 'r': 5, 'c': 6, 'C': 7, 't': 8,
  'B': 9, 'b': 10, 'g': 11, 'f': 12, 'p': 13, 'D': 14, 'j': 15, 'K': 16, 'e': 17
};
// Tiles you can't walk through.
export const SOLID = [0, 1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

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
    spawn: { x: 11, y: 8 },
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
  }
};
