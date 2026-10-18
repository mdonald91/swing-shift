// Map layouts. Each character is one 16px tile; see TILE for what they mean.
// Coordinates in spawns/npcs/objects are tile columns (x) and rows (y), counting from 0.
export const TILE = {
  ' ': -1,
  // the Hi-Hat
  '#': 0, 'W': 1, 'O': 2, '.': 3, ',': 4, 'r': 5, 'c': 6, 'C': 7, 't': 8,
  'B': 9, 'b': 10, 'g': 11, 'f': 12, 'p': 13, 'D': 14, 'j': 15, 'K': 16, 'e': 17,
  // Dock 9
  '_': 18, '=': 19, 'R': 20, 'T': 21, 'V': 22, 'x': 23, 'H': 24, 'G': 25, 'L': 26,
  '~': 27, 'P': 28, 'v': 30, 'o': 31,
  // Cygnus Station and the Flat Ninth
  's': 32, 'w': 33, 'S': 34, 'N': 35, 'M': 36, 'Y': 37, 'd': 38, 'Q': 39, 'u': 40, 'l': 41,
  'k': 43, 'X': 44, 'F': 45, 'A': 46, 'z': 47, 'I': 48, 'J': 49, 'n': 50, 'U': 51, 'h': 52, 'E': 53,
  // Relay K-17 (1 and 2 are doors that open later)
  'q': 54, 'Z': 55, 'm': 56, 'y': 57, '1': 58, '2': 59, '3': 61, '4': 62, '5': 63, '6': 64, '7': 65, '8': 66, '9': 67, '!': 68, '$': 69,
  // Vesta
  '%': 70, '&': 71, '-': 72, ':': 73, '(': 74, ')': 75, '|': 76, '*': 77, '+': 78,
  // Targon mine
  'a': 80, 'i': 81, '[': 82, ']': 83, '/': 84, '^': 85, '<': 86, '>': 87, '?': 88, '@': 89, '0': 90,
  ';': 91, '{': 92, '}': 93, '`': 94, '"': 95, '§': 96,
  // Hi-Hat upgrades (swapped in when bought)
  '¤': 97, '¶': 98, '©': 99
};
export const RUBBLE = 90;
export const DOOR_OPEN = 60;
// Tiles you can't walk through.
export const SOLID = [0, 1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31,
  34, 35, 36, 37, 38, 39, 40, 41, 43, 44, 46, 48, 49, 50, 51, 52, 53,
  54, 55, 58, 59, 61, 62, 63, 64, 65, 66, 67, 69,
  70, 71, 74, 75, 77, 78,
  80, 82, 83, 87, 88, 89, 90, 91, 92, 94, 95, 96, 97, 98, 99];
// Tiles that give a generic "Look" when you face them and nothing more specific is there.
export const TILE_LOOKS = {
  20: 'container', 21: 'container', 22: 'container', 26: 'lamp', 24: 'warehouse',
  34: 'storefront', 35: 'neon', 36: 'neon', 37: 'neon', 41: 'neonlamp', 43: 'planter', 44: 'railing',
  48: 'piano', 49: 'bottles', 50: 'bartable', 51: 'booth',
  74: 'stall', 75: 'stall', 77: 'lantern', 71: 'rockwall',
  80: 'basalt', 82: 'mineface', 83: 'timber', 87: 'chasm', 88: 'orecart', 90: 'rubble', 91: 'minelamp', 92: 'winch', 95: 'hutwall',
  61: 'console_k17', 63: 'racks', 64: 'cryo_look', 65: 'bunk', 66: 'locker', 67: 'window_k17', 69: 'crate_k17'
};

export const MAPS = {
  ship: {
    name: 'The Hi-Hat',
    jp: 'ハイハット号',
    where: 'Jupiter orbit, near Ganymede',
    music: 'ship',
    rows: [
      '########################',
      '#WWOWWfgggWWOWWWWOOOOWW#',
      '#b......,........KKKK.K#',
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
    // rooms that appear once they're bought at the upgrades terminal
    swaps: [
      { x: 1, y: 9, flag: 'up_workshop', to: '¤' }, { x: 2, y: 9, flag: 'up_workshop', to: '¤' },
      { x: 21, y: 9, flag: 'up_booth', to: '¶' }, { x: 22, y: 9, flag: 'up_booth', to: '©' }
    ],
    npcs: [
      { id: 'rook', x: 2, y: 6, face: 'down' },
      { id: 'tam', x: 8, y: 2, face: 'down' },
      { id: 'brushes', x: 20, y: 4 },
      { id: 'rhea', x: 14, y: 7, face: 'down', if: 'rhea_joined' }
    ],
    objects: [
      { id: 'bed', x: 1, y: 2, w: 1, h: 2, label: 'Rest' },
      { id: 'fridge', x: 6, y: 1, label: 'Check the fridge' },
      { id: 'supply', x: 7, y: 1, w: 3, label: 'Supply terminal' },
      { id: 'cockpit', x: 17, y: 2, w: 4, label: 'Ship systems' },
      { id: 'board', x: 21, y: 4, label: 'Bounty board' },
      { id: 'jukebox', x: 4, y: 7, label: 'Jukebox' },
      { id: 'couch', x: 2, y: 5, w: 2, label: 'Couch' },
      { id: 'plant', x: 19, y: 6, label: 'Look' },
      { id: 'plant', x: 1, y: 7, label: 'Look' },
      { id: 'holo', x: 14, y: 5, label: 'Holo-rehearsal' },
      { id: 'upgrades', x: 22, y: 2, label: 'Ship upgrades' },
      { id: 'workbench', x: 1, y: 9, w: 2, label: "Tam's workshop", if: 'up_workshop' },
      { id: 'booth', x: 21, y: 9, w: 2, label: 'Recording booth', if: 'up_booth' },
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
      { id: 'goon', x: 11, y: 2, face: 'down', look: 'goon', ifNot: 'velvet_done' },
      { id: 'goon', x: 14, y: 2, face: 'down', look: 'goon2', ifNot: 'velvet_done' },
      { id: 'smugglers', x: 2, y: 8, face: 'right', look: 'gunman', ifNot: 'smugglers_cleared' },
      { id: 'loader', x: 26, y: 11, face: 'left', look: 'mech', ifNot: 'loader_cleared' }
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
  },

  cygnus: {
    name: 'Cygnus Station',
    jp: 'シグナス・ステーション',
    where: 'Upper ring plaza',
    music: 'station',
    rain: true,
    glows: [
      { x: 3, y: 1, w: 2, c: 0xff5fa2 }, { x: 13, y: 1, w: 2, c: 0x5fe3d4 }, { x: 27, y: 1, w: 2, c: 0xffd34d },
      { x: 17, y: 1, w: 1, c: 0xff5fa2 }, { x: 24, y: 1, w: 1, c: 0x5fe3d4 }
    ],
    rows: [
      '################################',
      '#SSNNSSdSS#SSMMSSQSSS#SShSSYYSS#',
      '#wwwwwwwwwwwwwwwwwwwwwwwwwwwwww#',
      '#wlwwwwwwlwwwwwwwwlwwwwwwwlwwvw#',
      '#ssssssssssssssssssssssssssssss#',
      '#ssssssssssssssssssssssssssssss#',
      '#ssssssssssssssssssssssssssssss#',
      '#wwwwwwwwwwwwwwwwwwwwwwwwwwwwww#',
      '#wkwwwuuuwwwwwwwwwwwwwwwwwwwkww#',
      '#wwwwwwwwwwwwwwwwwwwwwwwwwwwwww#',
      '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#'
    ],
    spawns: { default: { x: 15, y: 8 }, bar: { x: 17, y: 2 } },
    npcs: [
      { id: 'sax', x: 12, y: 8, face: 'down' },
      { id: 'chef', x: 7, y: 9, face: 'up' },
      { id: 'alley', x: 30, y: 6, face: 'left', look: 'hacker', ifNot: 'alley_cleared' }
    ],
    walkers: [
      { look: 'w1', y: 5, x1: 3, x2: 27, speed: 22 },
      { look: 'w2', y: 4, x1: 25, x2: 6, speed: 18 },
      { look: 'w3', y: 6, x1: 10, x2: 29, speed: 26 },
      { look: 'w4', y: 2, x1: 20, x2: 4, speed: 16 }
    ],
    objects: [
      { id: 'outfitters', x: 7, y: 1, label: "Kessler's Outfitters" },
      { id: 'bar_door', x: 17, y: 1, label: 'The Flat Ninth' },
      { id: 'helix', x: 24, y: 1, label: 'Helix Salvage' },
      { id: 'stand', x: 6, y: 8, w: 3, label: 'Noodle stand' },
      { id: 'vend_cygnus', x: 29, y: 3, label: 'Vending machine' },
      { id: 'dockgate', x: 13, y: 10, w: 5, label: 'Docking bay' }
    ]
  },

  bar: {
    name: 'The Flat Ninth',
    jp: 'フラット・ナインス',
    where: 'A bar on Cygnus Station',
    music: 'ship',
    rows: [
      '##################',
      '#JJJJJJJJJJJJJJJJ#',
      '#FFFFFFFFFFFFFIIF#',
      '#AAAAAAAFFFFFFFFF#',
      '#zzzzzzzFFFnFFFFF#',
      '#FFFFFFFFFFFFFnFF#',
      '#UUFFFFnFFFFFFFFF#',
      '#UUFFFFFFFFFFFFjF#',
      '#FFFFFFFFFFFFFFFF#',
      '########E#########'
    ],
    spawns: { default: { x: 8, y: 8 } },
    offLimits: [[1, 2]],        // behind the bar counter, on purpose (tools/check-maps.mjs skips it)
    npcs: [
      { id: 'mags', x: 4, y: 2, face: 'down' },
      { id: 'lou', x: 15, y: 3, face: 'up' },
      { id: 'rhea', x: 3, y: 6, face: 'left', ifNot: 'rhea_joined' },
      { id: 'dutch', x: 12, y: 4, face: 'left', if: 'velvet_done' },
      { id: 'pip', x: 13, y: 6, face: 'up', if: 'cygnus_arrived' }
    ],
    objects: [
      { id: 'mags', x: 1, y: 3, w: 7, label: 'Talk to Mags' },
      { id: 'jukebox', x: 15, y: 7, label: 'Jukebox' },
      { id: 'bar_exit', x: 8, y: 9, label: 'Back to the plaza' }
    ]
  },

  relay: {
    name: 'Relay K-17',
    jp: 'リレー K-17',
    where: 'Orbital relay station, past the belt',
    music: 'tense',
    dark: 'power_on',          // dark with emergency lights until this flag is set
    minimap: true,
    rows: [
      'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
      'qZZZ9ZZZqZZZ9ZZZZ9ZZZqZZZ9ZZZ9ZZZq',
      'q4mmmmmmq7m7m7mmmm888q5m5m5m5m5mmq',
      'q4mmmmmmqmmmmmmmmmmmmqmmmmmmmmmmmq',
      'qmm!!mmmq7m7m7mmmmmmmq5m5m5mm333mq',
      'qmmmmmmmqmmmmmmmmmmmmqmmmmmmmmmmmq',
      'qqqqyqqqqqqqqqq1qqqqqqqqqqqq2qqqqq',
      'qyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyq',
      'qyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyq',
      'qqqqqqyqqqqqqqqqqyqqqqqqqqqq1qqqqq',
      'qZZZZZmZZZZZZqZZZmZZZqZZZZZZmZZZZq',
      'qmmmmmmmmmmmmq$m$mm$mq6m6m6mmmmmmq',
      'qmmmmmmmmmmmmqmmmmmmmqmmmmmmmmmmmq',
      'qmmm!!!!!!mmmq$mmmm$$q6m6m6m6mm3mq',
      'qmmmmmmmmmmmmqmmmmmmmqmmmmmmmmmmmq',
      'qqqqqqDqqqqqqqqqqqqqqqqqqqqqqqqqqq'
    ],
    doors: [
      { x: 15, y: 6, flag: 'power_on' },
      { x: 28, y: 9, flag: 'power_on' },
      { x: 28, y: 6, flag: 'k17_keycard' }
    ],
    spawns: { default: { x: 6, y: 13 } },
    npcs: [
      { id: 'rhea', x: 9, y: 12, face: 'left', if: 'rhea_joined' },
      { id: 'brushes', x: 3, y: 12 },
      { id: 'drone', x: 27, y: 7, look: 'drone', ifNot: 'drones_cleared' },
      { id: 'drone', x: 29, y: 7, look: 'drone', ifNot: 'drones_cleared' },
      { id: 'juno', x: 32, y: 5, face: 'left', ifNot: 'ghost_done' },
      { id: 'maint', x: 17, y: 13, face: 'up', look: 'mech', ifNot: 'maint_cleared' }
    ],
    objects: [
      { id: 'generator', x: 1, y: 2, h: 2, label: 'Generator' },
      { id: 'lockers', x: 18, y: 2, w: 3, label: 'Search the lockers' },
      { id: 'log_bunk', x: 9, y: 2, label: 'Read the bunk log' },
      { id: 'comms', x: 29, y: 4, w: 3, label: 'Comms console' },
      { id: 'cryo', x: 22, y: 11, w: 7, h: 3, label: 'Cryo pods' },
      { id: 'log_med', x: 31, y: 13, label: 'Medical log' },
      { id: 'door_power', x: 15, y: 6, label: 'Door' },
      { id: 'door_power', x: 28, y: 9, label: 'Door' },
      { id: 'door_key', x: 28, y: 6, label: 'Comms hub door' },
      { id: 'airlock_k17', x: 6, y: 15, label: 'Airlock to the Hi-Hat' }
    ]
  },

  vesta: {
    name: 'Vesta',
    jp: 'ベスタ',
    where: 'Mining colony, market ring',
    music: 'vesta',
    minimap: true,
    rows: [
      '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
      '%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&%',
      '%:*:::::::::*:::::::::*::::::::*:%',
      '%:::::((:::::::)):::::::((:::::::%',
      '%::::::::::::::::::::::::::::::::%',
      '%::::::::::::::::::::::::::::::::%',
      '%::)):::::(((::::::)):::::::((:::%',
      '%::::::::::::::::::::::::::::::::%',
      '%::::::((:::::::)):::::((::::::::%',
      '%::::::::::::::::::::::::::::::::%',
      '%&&D&&&&&&&&&&&&&&&&&&&&&&&--&&&&%',
      '%%&&&&&&%&&&&&&&&&&&&&&&&&&--&&&%%',
      '%%xx---*&----xx-*---x---o-----x-%%',
      '%%------+-----------------------%%',
      '%%------&|||||||||||||||||||||||%%',
      '%%------%%%%%%%%%%--%%%%%%%%%%%%%%',
      '%%------%%%%%%%--------x%%%%%%%%%%',
      '%%o-----%%%%%%%xo-------%%%%%%%%%%',
      '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
      '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'
    ],
    doors: [{ x: 8, y: 13, flag: 'tail_done' }],
    spawns: { default: { x: 3, y: 9, face: 'up' }, pell: { x: 5, y: 5, face: 'right' } },
    // the man in the grey coat walks this route; "look" makes him stop and check behind him (ms)
    tail: {
      who: 'fennick',
      path: [[9, 4], [13, 4], [13, 5], [18, 5], [22, 5, 1600], [22, 7], [26, 7, 1600], [27, 7], [27, 9], [27, 12], [27, 13, 1700], [18, 13], [12, 13, 1600], [9, 13], [8, 13]],
      speed: 34
    },
    npcs: [
      { id: 'pell', x: 4, y: 4, face: 'right' },
      { id: 'tam', x: 5, y: 9, face: 'up' },
      { id: 'rhea', x: 7, y: 9, face: 'up', if: 'rhea_joined' },
      { id: 'quill', x: 20, y: 3, face: 'down', if: 'juno_handed', ifNot: 'courier_done' },
      { id: 'wren', x: 4, y: 14, face: 'right', ifNot: 'courier_done' },
      { id: 'scav', x: 18, y: 15, face: 'up', look: 'scav', ifNot: 'scavs_cleared' },
      { id: 'scav', x: 19, y: 15, face: 'up', look: 'scav2', ifNot: 'scavs_cleared' },
      { id: 'jumpers', x: 30, y: 13, face: 'left', look: 'gunman', ifNot: 'jumpers_cleared' }
    ],
    walkers: [
      { look: 'v1', y: 5, x1: 3, x2: 30, speed: 20 },
      { look: 'v2', y: 7, x1: 29, x2: 4, speed: 17 },
      { look: 'v3', y: 9, x1: 10, x2: 25, speed: 15 }
    ],
    objects: [
      { id: 'lift_vesta', x: 3, y: 10, label: 'Lift to the docking bay' },
      { id: 'chest_vesta', x: 23, y: 16, label: 'Search the crate' },
      { id: 'hideout_crates', x: 2, y: 12, w: 2, label: 'Look' },
      { id: 'door_hideout', x: 8, y: 13, label: 'Door' }
    ]
  },
  targon: {
    name: 'Targon Mine',
    jp: 'ターゴン鉱山',
    where: 'Shaft 3 head, Targon',
    music: 'targon',
    rows: [
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      'a[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[a',
      'a""""""""iiiiiiiiii""""""""ii{{a',
      'a"`i{ii`"iiiiiiiiii"@ii{{i"ii<<a',
      'a"iiiiii"iiiiiiiiii"iiiiii"ii<<a',
      'a"iiiiii"iiiiiiiiii"iiiiii"iiiia',
      'a"""i""""iiiiiiiiii"""i""""iiiia',
      'aiiiiiiiiiiiiiiiiiiiiiiiiiiiiiia',
      'aiiiiiiii;iiiiiiiii;iiiiiiiiiiia',
      'ai/////////////////////?iiiiiiia',
      'aiiiiiiiiiiiiiiiiiiiiiiiiiiiiiia',
      'aiiiiiiiiiiiiiiii]iiiiiiiiiaaaaa',
      'aiiiPPPPPiiiiiiiiiiiiiiiiia000aa',
      'aiiiPPPPPiiiiiiiiiiiiiiiiiiiiiia',
      'aiiiPPPPPiiiiiiiiiiiiiiiiiiiiiia',
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    ],
    spawns: { default: { x: 10, y: 13, face: 'right' }, lift: { x: 28, y: 4, face: 'left' } },
    ship: { x: 6, y: 13 },
    npcs: [
      { id: 'okada', x: 14, y: 4, face: 'down' },
      { id: 'tam', x: 5, y: 4, face: 'up', ifNot: 'mantis_done' },
      { id: 'rhea', x: 12, y: 7, face: 'down', if: 'rhea_joined', ifNot: 'mantis_done' },
      { id: 'rockrats', x: 28, y: 13, look: 'drone', ifNot: 'rockrats_cleared' }
    ],
    walkers: [
      { look: 'm1', y: 10, x1: 3, x2: 22, speed: 18 },
      { look: 'm2', y: 7, x1: 26, x2: 10, speed: 15 }
    ],
    objects: [
      { id: 'ship', x: 4, y: 12, w: 5, h: 3, label: 'Board the Hi-Hat' },
      { id: 'tg_tools', x: 2, y: 3, label: 'Look' },
      { id: 'tg_drafting', x: 4, y: 3, label: "Ferro's drafting table" },
      { id: 'tg_photo', x: 7, y: 3, label: 'A photo above the bench' },
      { id: 'junction_top', x: 20, y: 3, label: 'Junction board' },
      { id: 'tg_pumps', x: 23, y: 3, w: 2, label: 'Look' },
      { id: 'lift_top', x: 29, y: 3, w: 2, h: 2, label: 'Main lift' },
      { id: 'tg_headframe', x: 29, y: 2, w: 2, label: 'Look' },
      { id: 'tg_ore', x: 23, y: 9, label: 'Look' },
      { id: 'tg_spoil', x: 27, y: 12, w: 3, label: 'Look' }
    ]
  },

  targon_deep: {
    name: 'Shaft 3, Level 4',
    jp: '第三坑・四層',
    where: 'Deep under Targon',
    music: 'tense',
    dark: 'tg_lights',
    minimap: true,
    rows: [
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      'a[[[[[[[[[[[[[a>>>>>a[[[[[[[[[[[[a',
      'a<<iiiiiiiii]ia>>>>>aiiiiiiiiiiixa',
      'a<<iiiiiiiiiiia>>>>>aiii;iiii]iiia',
      'aiiiiiii;iiiiia>>>>>aiiiiiiiiiiiia',
      'aaaaaaiiaaaaaaa>>>>>aaaaaaaaaaiiia',
      'a[[[[[ii[[[[[[a>>>>>a[[[[[[[[[iiia',
      'aiiiiiiiiiiiii?§§§§§?iiiiiiiiiiiia',
      'aiiiiiiiiiiiiia>>>>>aiiiiiiiiaiiia',
      'ai{@iiiiiiiiiia>>>>>aiiiiiiiiaiiia',
      'aaaaaaaaaaaaaaa>>>>>aaaaaaaaaaiiia',
      'a[[[[[[[[[[[[[[[[[[[[[[[[[[[[[iiia',
      'aiiiiiiiiii]iiiiiiiiiiiiiiiiiiiiia',
      'aiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiia',
      'ai;iiiiiiiiiiii{iiiiiiiiiiii;iiiia',
      'aiiiiiiiiiiiiiiiiiiiiiiiiiiii<<iia',
      'aiiiiiiiiiiiiiiiiiiiiiiiiiiii<<iia',
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    ],
    // the tunnel caves in behind you on the way down (closeOn: the tile becomes rubble once the flag is set)
    doors: [{ x: 30, y: 8, closeOn: 'tg_cavein' }, { x: 31, y: 8, closeOn: 'tg_cavein' }, { x: 32, y: 8, closeOn: 'tg_cavein' }],
    // stepping on these runs a conversation once
    triggers: [{ x: 30, y: 10, w: 3, h: 1, flag: 'tg_cavein', run: 'tg_cavein' }],
    spawns: {
      default: { x: 3, y: 3, face: 'right' },
      cart_near: { x: 13, y: 7, face: 'left' },
      cart_far: { x: 21, y: 7, face: 'right' },
      service: { x: 28, y: 15, face: 'left' }
    },
    npcs: [
      { id: 'brushes', x: 10, y: 3 },
      { id: 'minebots', x: 8, y: 8, look: 'drone', ifNot: 'minebots_cleared' },
      { id: 'crawler', x: 25, y: 3, face: 'down', look: 'mech', ifNot: 'crawler_cleared' },
      { id: 'ferro', x: 24, y: 13, face: 'left', ifNot: 'mantis_done' },
      { id: 'mantis', x: 5, y: 13, look: 'mantis', ifNot: 'mantis_done' }
    ],
    objects: [
      { id: 'lift_bottom', x: 1, y: 2, w: 2, h: 2, label: 'Main lift' },
      { id: 'junction_deep', x: 3, y: 9, label: 'Junction box' },
      { id: 'tg_winch', x: 2, y: 9, label: 'Look' },
      { id: 'tg_cart', x: 14, y: 7, label: 'Ore cart' },
      { id: 'tg_cart_back', x: 20, y: 7, label: 'Ore cart' },
      { id: 'tg_cache', x: 32, y: 2, label: 'Search the crate' },
      { id: 'tg_drill', x: 15, y: 14, label: 'Look' },
      { id: 'lift_service', x: 29, y: 15, w: 2, h: 2, label: 'Service lift' }
    ]
  }
};
