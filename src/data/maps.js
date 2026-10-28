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
  '¤': 97, '¶': 98, '©': 99,
  // Nyx: labs and the frozen garden dome
  'α': 100, 'β': 101, 'γ': 102, 'δ': 103, 'ε': 104, 'ζ': 105, 'η': 106, 'θ': 107, 'ι': 108, 'κ': 109,
  'λ': 110, 'μ': 111, 'ν': 112, 'ξ': 113, 'ο': 114,
  // Titan and the Lyceum
  'π': 115, 'ρ': 116, 'σ': 117, 'τ': 118, 'υ': 119, 'φ': 120, 'χ': 121, 'ψ': 122, 'ω': 123,
  'Γ': 124, 'Δ': 125, 'Θ': 126, 'Λ': 127, 'Ξ': 128, 'Π': 129, 'Σ': 130, 'Φ': 131, 'Ψ': 132, 'Ω': 133,
  // Act 3: Cygnus under lockdown and the Helix tower
  'Б': 134, 'Ж': 135, 'Д': 136, 'И': 137, 'Л': 138, 'Ц': 139, 'Ш': 140,
  'П': 141, 'Ф': 142, 'Ч': 143, 'Щ': 144, 'Ы': 145, 'Э': 146, 'Ю': 147, 'Я': 148, 'З': 149,
  // Blue Note
  'а': 150, 'б': 151, 'в': 152, 'г': 153, 'д': 154, 'е': 155, 'ж': 156, 'з': 157, 'и': 158, 'й': 159, 'к': 160, 'л': 161,
  // the Lyceum's auditorium
  'м': 162, 'н': 163, 'о': 164
};
export const RUBBLE = 90;
export const DOOR_OPEN = 60;
// Tiles you can't walk through.
export const SOLID = [0, 1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31,
  34, 35, 36, 37, 38, 39, 40, 41, 43, 44, 46, 48, 49, 50, 51, 52, 53,
  54, 55, 58, 59, 61, 62, 63, 64, 65, 66, 67, 69,
  70, 71, 74, 75, 77, 78,
  80, 82, 83, 87, 88, 89, 90, 91, 92, 94, 95, 96, 97, 98, 99,
  101, 102, 103, 104, 105, 106, 108, 109, 110, 111, 112, 113,
  116, 117, 118, 119, 120, 121, 122, 123, 125, 126, 127, 129, 130, 131, 132,
  134, 135, 136, 138, 139, 142, 143, 144, 145, 146, 147, 148,
  151, 152, 154, 155, 156, 157, 158, 159, 160, 162, 164];
// Tiles that give a generic "Look" when you face them and nothing more specific is there.
export const TILE_LOOKS = {
  20: 'container', 21: 'container', 22: 'container', 26: 'lamp', 24: 'warehouse',
  34: 'storefront', 35: 'neon', 36: 'neon', 37: 'neon', 41: 'neonlamp', 43: 'planter', 44: 'railing',
  48: 'piano', 49: 'bottles', 50: 'bartable', 51: 'booth',
  74: 'stall', 75: 'stall', 77: 'lantern', 71: 'rockwall',
  116: 'titanwall', 117: 'column', 119: 'poster', 120: 'cafe', 121: 'titanlamp', 122: 'hedge', 123: 'titanfountain',
  125: 'curtain', 126: 'flats', 127: 'roadcase', 129: 'footlights', 132: 'mirror',
  162: 'seats', 130: 'halcyon_look', 151: 'bnwall', 152: 'bndish', 154: 'bnterminal', 156: 'bnwindow', 158: 'bnservers', 159: 'bnspeakers',
  134: 'barricade', 140: 'torn_shutter', 142: 'helixwall', 143: 'helixwindow', 144: 'reception', 145: 'haledesk', 146: 'helixplant', 148: 'helixlogo',
  102: 'labglass', 103: 'labbench', 104: 'servers', 105: 'specimen', 108: 'icepond', 109: 'frozentree', 110: 'crystals', 111: 'domeglass',
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
      { id: 'rhea', x: 14, y: 7, face: 'down', if: 'rhea_joined' },
      { id: 'lyra', x: 16, y: 7, look: 'lyra', if: 'lyra_joined' }
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
      { x: 17, y: 1, w: 1, c: 0xff5fa2 }, { x: 24, y: 1, w: 1, c: 0x5fe3d4 }, { x: 14, y: 9, w: 4, c: 0xffd34d }
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
      '#XXXXXXXXXXXXXооооXXXXXXXXXXXXX#',
      '##############оооо##############'
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
      { id: 'dockgate', x: 13, y: 10, w: 6, label: 'Docking bay: back to the Hi-Hat' }
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
  },
  nyx: {
    name: 'Nyx Applied Sciences',
    jp: 'ニュクス応用科学',
    where: 'Research campus, Nyx',
    music: 'nyx',
    minimap: true,
    rows: [
      'ββββββββββββββββββββββββββββββββ',
      'βξαδδαζαδδβζαζαζαζαζβεεεξααεεεεβ',
      'βαααααααααβαααααααααβααααααααααβ',
      'βααδδααδδαβαααααααααβααααααααααβ',
      'βαααααααααβαζααααζααβααααααααδδβ',
      'βαααααααααβαααααααααβααααααααααβ',
      'βββββαβββββββββαβββββββββαββββββ',
      'βααααααααααααααααααααααααααααααβ',
      'βααααααααααααααααααααααααααααααη',
      'βααααααααααααααααααααααααααααααβ',
      'βγγγγααγγγγγγβγγγγγγγααγγγγγγγγβ',
      'βααααααααααααβαααααααααααααααααβ',
      'βαααααααζααααβααζααααααααααζαααβ',
      'βααααααααααααβαααααααααααααααααβ',
      'βδδααααααααδδβαααααααααααααααααβ',
      'ββββββββββββββββββββββββββββββββ'
    ],
    doors: [{ x: 31, y: 8, flag: 'nyx_dome_open' }],
    spawns: { default: { x: 2, y: 12, face: 'right' }, dome: { x: 30, y: 8, face: 'left' } },
    npcs: [
      { id: 'sato', x: 8, y: 12, face: 'left' },
      { id: 'brushes', x: 4, y: 13, ifNot: 'proto_done' },
      { id: 'rhea', x: 10, y: 13, face: 'up', if: 'rhea_joined', ifNot: 'proto_done' },
      { id: 'labsec', x: 28, y: 8, face: 'left', look: 'mech', ifNot: 'labsec_cleared' },
      { id: 'labbots', x: 25, y: 12, look: 'drone', ifNot: 'labbots_cleared' }
    ],
    objects: [
      { id: 'airlock_nyx', x: 0, y: 12, label: 'Airlock to the Hi-Hat' },
      { id: 'l7_terminal', x: 1, y: 1, label: 'Training terminal' },
      { id: 'l7_bench', x: 3, y: 3, w: 2, label: 'Look' },
      { id: 'sec_terminal', x: 24, y: 1, label: 'Security terminal' },
      { id: 'sec_desk', x: 29, y: 4, w: 2, label: 'Look' },
      { id: 'dome_door', x: 31, y: 8, label: 'Garden dome door' },
      { id: 'reception', x: 1, y: 14, w: 2, label: 'Look' }
    ]
  },

  nyx_dome: {
    name: 'The Garden Dome',
    jp: '凍った庭園',
    where: 'Nyx, under glass',
    music: 'nyx',
    snow: true,
    rows: [
      'μμμμμμμμμμμμμμμμμμμμμμμμμμμμμμ',
      'μθθθθθθθθθθθθθθθθθθθθθθθθθθθθμ',
      'μθθθθθκθθθθθκθθθθθθθθθθθθθθθxμ',
      'μθθκθθθθθθθθθθθθθθθθθθθθθκθθθμ',
      'μθθθθθθθθθθθθθθκθθθθθθθθθθθθθμ',
      'μθθθθθθθθθθθθθθθθθθθθθθθθθθθθμ',
      'μθθθιιιιθθθκθθθθθθθθθθθθλλθθθμ',
      'μθθιιιιιθθθθθθθθθθθθθθθθθθθθθμ',
      'μθθιιιιιθθθθθθθθθθθθθννθθθθθθμ',
      'μοοιιιιιοοοοολλοοοοοθννθθθθκθμ',
      'μθθιιιιθθθθθθλθθθθθθθθθθθθθθθμ',
      'μθθθθθθθθθθθθθθθθθθθθθθθθθθθθμ',
      'μθθθθθθθθθθθθθθθλλθθθθθθθθθθθμ',
      'μθθθκθθθθθθθθθκθθθθθθθθθθθθθθμ',
      'μθθθθθθθθθθθθθθθθθθθθθθθθθκθθμ',
      'μθθθθθθθθκθθθθθθθθκθθθθθθθθθθμ',
      'μθθθθθθθθθθθθθθθθθθθθθθθθθθθθμ',
      'μμμμμμμμμμμμμμμμμμμμμμμμμμμμμμ'
    ],
    spawns: { default: { x: 1, y: 9, face: 'right' } },
    npcs: [
      { id: 'lyra', x: 20, y: 10, look: 'lyra', ifNot: 'proto_done' },
      { id: 'moths', x: 9, y: 3, look: 'drone', ifNot: 'moths_cleared' }
    ],
    objects: [
      { id: 'dome_exit', x: 0, y: 9, label: 'Back to the labs' },
      { id: 'dome_cache', x: 28, y: 2, label: 'Search the crate' },
      { id: 'fountain', x: 21, y: 8, w: 2, h: 2, label: 'Look' }
    ]
  },
  titan: {
    name: 'Titan',
    jp: 'タイタン',
    where: 'Lyceum Square, under an orange sky',
    music: 'titan',
    rows: [
      'ρρρρρρρρρρρρρρρρρρρρρρρρρρρρρρρρ',
      'ρρρρρρρρρρρσρσττσρσρρρρρρρρρρρρρ',
      'ρππππππππππππππππππππππππππππππρ',
      'ρππυππππππππππππππππππππππππυππρ',
      'ρππππππππππππππππππππππππππππππρ',
      'ρπχππππππππππχππππχππππππππππχπρ',
      'ρππππππππππππππππππππππππππππππρ',
      'ρπφππφπππππππππωωπππππππππφππφπρ',
      'ρππππππππππππππωωππππππππππππππρ',
      'ρππππππππππππππππππππππππππππππρ',
      'ρψψψψππππππππππππππππππππππψψψψρ',
      'ρππππππππππππππππππππππππππππππρ',
      'ρπππPPPPPππππππππππππππππππππππρ',
      'ρπππPPPPPππππππππππππππππππππππρ',
      'ρπππPPPPPππππππππππππππππππππππρ',
      'ρρρρρρρρρρρρρρρρρρρρρρρρρρρρρρρρ'
    ],
    spawns: { default: { x: 10, y: 13, face: 'up' }, stagedoor: { x: 30, y: 13, face: 'left' } },
    ship: { x: 6, y: 13 },
    npcs: [
      { id: 'sax', x: 10, y: 6, face: 'down', ifNot: 'nocturne_done' },
      { id: 'fitz', x: 29, y: 11, face: 'left' },
      { id: 'tickets', x: 15, y: 3, face: 'down' },
      { id: 'rhea', x: 20, y: 11, face: 'up', if: 'rhea_joined', ifNot: 'nocturne_done' },
      { id: 'lyra', x: 22, y: 11, look: 'lyra', if: 'lyra_joined', ifNot: 'nocturne_done' },
      { id: 'ushers', x: 25, y: 4, face: 'left', look: 'goon', ifNot: 'ushers_cleared' }
    ],
    walkers: [
      { look: 't1', y: 4, x1: 4, x2: 22, speed: 16 },
      { look: 't2', y: 9, x1: 27, x2: 3, speed: 20 },
      { look: 't3', y: 6, x1: 20, x2: 28, speed: 14 }
    ],
    objects: [
      { id: 'ship', x: 4, y: 12, w: 5, h: 3, label: 'Board the Hi-Hat' },
      { id: 'lyceum_doors', x: 15, y: 1, w: 2, label: 'The Lyceum' },
      { id: 'stage_door', x: 31, y: 13, label: 'Stage door' }
    ]
  },

  // ---- Act 3: Cygnus under lockdown (Track 07) ----
  // Every route but the west gap is a shortcut that standing or old friends open. The west gap is always there.
  cygnus_lock: {
    name: 'Cygnus Station',
    jp: 'シグナス・封鎖中',
    where: 'Upper ring plaza, under lockdown',
    music: 'lockdown',
    rain: true,
    glows: [
      { x: 3, y: 1, w: 2, c: 0xff5fa2 }, { x: 12, y: 1, w: 2, c: 0x5fe3d4 }, { x: 26, y: 1, w: 2, c: 0xffd34d },
      { x: 15, y: 8, w: 2, c: 0xff3a3a }
    ],
    rows: [
      '####################################',
      '#SSNNSSdSSSSMMSSQSSSSSShSSYYSSSS####',
      '#wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww#ss#',
      '#wlwwwwwwlwwwwwwwwlwwwwwwwwwwvwwДss#',
      '#sssssssssssssssssssssssssssssss#ss#',
      '#sssssssssssssssssssssssssssssss#ss#',
      '#sssskksssssssssssssssssskksssss#ss#',
      '#sssssssssssssssssssssssssssssss#ss#',
      '#БssБББББББББББЛЛББББББББББЦЦБББ#ss#',
      '#wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww#ss#',
      '#wwwwwwwwЖwwwwwwwwwwwwЖwwwwwwwww#ss#',
      '#wkwwuuuwwwwwwwwwwwwwwwwwwwwwwwwДss#',
      '#wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww#ss#',
      '#XXXXXXXXXXXXXwwwwXXXXXXXXXXXXXX####',
      '##############wwww##################',
      '####################################'
    ],
    swaps: [
      { x: 15, y: 8, flag: 'gate_open', to: 'w', shortcut: true }, { x: 16, y: 8, flag: 'gate_open', to: 'w', shortcut: true },
      { x: 32, y: 11, flag: 'hatch_open', to: 'И', shortcut: true }, { x: 32, y: 3, flag: 'hatch_open', to: 'И', shortcut: true },
      { x: 27, y: 8, flag: 'shutter_open', to: 'Ш', shortcut: true }, { x: 28, y: 8, flag: 'shutter_open', to: 'Ш', shortcut: true }
    ],
    spawns: { default: { x: 15, y: 14, face: 'up' }, helix: { x: 23, y: 2, face: 'down' } },
    npcs: [
      { id: 'marshal', x: 14, y: 9, face: 'down' },
      { id: 'cass', x: 18, y: 9, face: 'down', if: 'cass_free' },
      { id: 'benny', x: 31, y: 12, face: 'up', if: 'std_docks' },
      { id: 'ferro', x: 30, y: 9, face: 'left', if: 'mantis_spared' },
      { id: 'mantis', x: 28, y: 10, look: 'mantis', deco: true, if: 'mantis_spared' },
      { id: 'helixsec', x: 22, y: 2, face: 'down', look: 'helixsec', ifNot: 'helixsec_cleared' },
      { id: 'helixsec', x: 24, y: 2, face: 'down', look: 'helixsec', ifNot: 'helixsec_cleared' }
    ],
    // collectors walking a beat; each one sees a short cone in front of it (Juno's camera tricks make it shorter)
    patrols: [
      { id: 'low', look: 'collector', path: [[4, 9], [12, 9]], speed: 26, fight: 'collectors' },
      { id: 'gap', look: 'collector2', path: [[3, 4], [11, 4]], speed: 24, fight: 'collectors' },
      { id: 'mid', look: 'collector', path: [[12, 6], [21, 6]], speed: 28, fight: 'collectors', ifNot: 'gate_open' },
      { id: 'hx', look: 'helixsec', path: [[20, 4], [30, 4]], speed: 24, fight: 'helixpatrol', if: 'std_helix_bad' }
    ],
    objects: [
      { id: 'lock_dock', x: 14, y: 15, w: 4, label: 'Back to the Hi-Hat' },
      { id: 'helix_lock', x: 23, y: 1, label: 'Helix Salvage' },
      { id: 'ninth_shut', x: 7, y: 1, label: 'The Flat Ninth' },
      { id: 'lock_gate', x: 15, y: 8, w: 2, label: 'Checkpoint' },
      { id: 'hatch_low', x: 32, y: 11, label: 'Maintenance hatch' },
      { id: 'hatch_high', x: 32, y: 3, label: 'Maintenance hatch' },
      { id: 'shutter', x: 27, y: 8, w: 2, label: 'Shutter' },
      { id: 'wanted', x: 9, y: 10, label: 'Wanted board' },
      { id: 'wanted', x: 22, y: 10, label: 'Wanted board' }
    ]
  },

  // Helix Salvage, Cygnus office: the lobby, a security corridor and Director Hale's office.
  helix_hq: {
    name: 'Helix Salvage',
    jp: 'ヘリックス社',
    where: 'Cygnus Station, the top floor',
    music: 'helix',
    rows: [
      '######################',
      '#ФФФЧЧЧЧЧЧЧЧЧЧЧЧЧЧФФФ#',
      '#ЭЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗЭ#',
      '#ЗЗЗЗЗЗЗЫЫЫЫЫЫЗЗЗЗЗЗЗ#',
      '#ЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗ#',
      '#ЯЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗЗЯ#',
      '#ФФФФФФФФФППФФФФФФФФФ#',
      '#ФЮППППППППППППППППЮФ#',
      '#ПППППППППППППППППППП#',
      '#ПППППППППППППППППППП#',
      '#ФФФФФФФФФППФФФФФФФФФ#',
      '#ЭППППППППППППППППППЭ#',
      '#ППППППЩЩЩППППППППППП#',
      '#ПППППППППППППППППППП#',
      '#ППЯППППППППППППППЯПП#',
      '#ПППППППППППППППППППП#',
      '##########hh##########'
    ],
    spawns: { default: { x: 10, y: 15, face: 'up' } },
    npcs: [
      { id: 'receptionist', x: 8, y: 11, face: 'down' },
      { id: 'quill', x: 16, y: 13, face: 'left', if: 'std_helix' },
      { id: 'hale', x: 10, y: 2, face: 'down', deco: true, ifNot: 'metronome_done' }
    ],
    patrols: [
      { id: 'corr', look: 'helixsec', path: [[2, 8], [19, 8]], speed: 26, fight: 'helixpatrol', ifNot: 'std_helix' }
    ],
    triggers: [{ x: 10, y: 6, w: 2, flag: 'metronome_done', run: 'crane_ambush' }],
    objects: [
      { id: 'hq_exit', x: 10, y: 16, w: 2, label: 'Back to the plaza' },
      { id: 'reception', x: 7, y: 12, w: 3, label: 'Reception' },
      { id: 'hq_lift', x: 2, y: 7, label: 'Lift' },
      { id: 'hq_lift', x: 19, y: 7, label: 'Lift' }
    ]
  },

  // ---- Track 08: Blue Note, the listening array past Saturn. The crew splits into two teams. ----
  // Team A (the captain) works the outer ring; Team B works the maintenance spine. Each opens the way for the other.
  bn_ring: {
    name: 'Blue Note',
    jp: 'ブルーノート',
    where: 'The outer listening ring',
    music: 'bluenote',
    minimap: true,
    rows: [
      '##############################',
      '#ббжжжббббйбжжжббзбббжжжббйбб#',
      '#ааааааабаааааааааааааааааабб#',
      '#ааааааабаааааааааааааааааабб#',
      '#ааааааабаааввааааааааавваабб#',
      '#ааааааабаааааааааааааааааабб#',
      '#аааааааеггггггггггггггггггбб#',
      '#ааааааабааааааааааааааааааеб#',
      '#ааааааабаааааааааввааааааабб#',
      '#аPPPPPабааааааиаааааиааааабб#',
      '#аPPPPPабааааааиаааааиааааабб#',
      '#аPPPPPабаааааааааааааааадабб#',
      '#бббббббббйбббббббббббббббйбб#',
      '##############################'
    ],
    swaps: [{ x: 8, y: 6, flag: 'bn_d1', to: 'а' }],
    spawns: { default: { x: 4, y: 6, face: 'right' } },
    ship: { x: 4, y: 11 },
    npcs: [
      { id: 'hale', x: 2, y: 3, face: 'right', if: 'hale_ally' }
    ],
    patrols: [
      { id: 'top', look: 'listener', path: [[10, 3], [25, 3]], speed: 24, fight: 'listeners', ifNot: 'bn_cams' },
      { id: 'low', look: 'listener', path: [[24, 11], [10, 11]], speed: 22, fight: 'listeners', ifNot: 'bn_cams' }
    ],
    objects: [
      { id: 'bn_ship', x: 2, y: 9, w: 5, h: 3, label: 'Board the Hi-Hat' },
      { id: 'bn_d1door', x: 8, y: 6, label: 'Ring door' },
      { id: 'bn_lever', x: 17, y: 1, label: 'Pressure lever' },
      { id: 'moment_tam', x: 12, y: 4, w: 2, label: 'Tuning arm' },
      { id: 'moment_brushes', x: 15, y: 9, h: 2, label: 'Archive stack' },
      { id: 'moment_lyra', x: 25, y: 11, label: 'Podium' },
      { id: 'bn_coredoor', x: 27, y: 7, label: 'Core door' }
    ]
  },
  bn_spine: {
    name: 'Blue Note',
    jp: 'ブルーノート',
    where: 'The maintenance spine',
    music: 'bluenote',
    minimap: true,
    rows: [
      '############################',
      '#ббббдбббббйббдббббдббббйбб#',
      '#аааааааабааааааааааааааалл#',
      '#аааааааабааааааааааааааалл#',
      '#аааааааабаааиаааааааиааалл#',
      '#аааааааабаааиаааааааиааалл#',
      '#аааааааабааааааааааааааалл#',
      '#аааааааакггггггггггггггглд#',
      '#аааааааабааааааааааааааалл#',
      '#аааааааабаааааааиааааааалл#',
      '#аааааааабаааааааиааааааалл#',
      '#аааааааабааааааааааааааалл#',
      '#бббббббббббдбббббббббебббб#',
      '############################'
    ],
    swaps: [{ x: 9, y: 7, flag: 'bn_d2', to: 'г' }],
    spawns: { default: { x: 3, y: 7, face: 'right' } },
    npcs: [
      { id: 'rhea', x: 11, y: 11, face: 'right', if: 'bn_rhea_here', ifNot: 'bnm_rhea' }
    ],
    patrols: [
      { id: 'sp1', look: 'listener', path: [[11, 3], [24, 3]], speed: 24, fight: 'listeners', ifNot: 'bn_cams' },
      { id: 'sp2', look: 'listener', path: [[24, 11], [12, 11]], speed: 22, fight: 'listeners', ifNot: 'bn_cams' }
    ],
    objects: [
      { id: 'bn_t1', x: 5, y: 1, label: 'Ring door controls' },
      { id: 'bn_hatch', x: 9, y: 7, label: 'Pressure hatch' },
      { id: 'bn_cams', x: 14, y: 1, label: 'Listener control' },
      { id: 'moment_rook', x: 19, y: 1, label: 'Office logbook' },
      { id: 'moment_rhea', x: 12, y: 12, label: 'Comms desk' },
      { id: 'moment_juno', x: 22, y: 12, label: 'Holding cell' },
      { id: 'bn_t3', x: 26, y: 7, label: 'Core controls' }
    ]
  },

  // ---- Track 09: Last Set. The Lyceum's auditorium; everyone you met has come to hear it end. ----
  lyceum_hall: {
    name: 'The Lyceum',
    jp: 'リュケイオン劇場',
    where: 'Titan, the last night',
    music: 'nocturne',
    rows: [
      'ΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘ',
      'ΘΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΘ',
      'ΘΓΛΓΓΓΓΓΓΓΓΓΓΣΣΓΓΓΓΓΓΓΓΓΓΛΓΘ',
      'ΘΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΘ',
      'ΘΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΘ',
      'ΘΠΠΠΠΠΠΠΠΠΠΠΠннΠΠΠΠΠΠΠΠΠΠΠΠΘ',
      'ΘннммммммммммннммммммммммннΘ',
      'ΘннммммммммммннммммммммммннΘ',
      'ΘннммммммммммннммммммммммннΘ',
      'ΘннммммммммммннммммммммммннΘ',
      'ΘннннннннннннннннннннннннннΘ',
      'ΘннммммммммммннммммммммммннΘ',
      'ΘннммммммммммннммммммммммннΘ',
      'ΘннммммммммммннммммммммммннΘ',
      'ΘннммммммммммннммммммммммннΘ',
      'ΘннннннннннннннннннннннннннΘ',
      'ΘΘΘΘΘΘΘΘΘΘΘΘΘττΘΘΘΘΘΘΘΘΘΘΘΘΘ',
      'ΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘ'
    ],
    spawns: { default: { x: 13, y: 15, face: 'up' } },
    npcs: [
      { id: 'ambrose', x: 13, y: 3, face: 'down', ifNot: 'lastset_done' },
      { id: 'sax', x: 12, y: 7, face: 'right' },
      { id: 'fitz', x: 15, y: 7, face: 'left' },
      { id: 'mags', x: 3, y: 7, face: 'left' },
      { id: 'ozzie', x: 24, y: 7, face: 'right' },
      { id: 'juno', x: 12, y: 8, face: 'right', if: 'fin_juno' },
      { id: 'ferro', x: 15, y: 8, face: 'left', if: 'mantis_spared' },
      { id: 'cass', x: 3, y: 8, face: 'left', if: 'cass_free' },
      { id: 'sato', x: 24, y: 8, face: 'right', if: 'proto_returned' },
      { id: 'hale', x: 12, y: 12, face: 'right', if: 'hale_ally' },
      { id: 'marshal', x: 15, y: 12, face: 'left' },
      { id: 'benny', x: 3, y: 12, face: 'left', if: 'hatch_open' },
      { id: 'wren', x: 24, y: 12, face: 'right' },
      { id: 'rhea', x: 12, y: 13, face: 'right', if: 'fin_rhea' },
      { id: 'chef', x: 15, y: 13, face: 'left' },
      { id: 'pip', x: 3, y: 13, face: 'left', if: 'met_pip' },
      { id: 'kessler', x: 24, y: 13, face: 'right' }
    ],
    objects: [
      { id: 'hall_exit', x: 13, y: 16, w: 2, label: 'The grand doors' }
    ]
  },

  lyceum: {
    name: 'The Lyceum, backstage',
    jp: '劇場の舞台裏',
    where: 'Titan, during the show',
    music: 'nocturne',
    minimap: true,
    rows: [
      'ΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘ',
      'ΘΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΘ',
      'ΘΓΦΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΘ',
      'ΘΓΓΓΓΛΓΓΓΓΓΛΓΓΓΓΓΛΓΓΓΓΓΛΓΓΓΓΓΓΓΓΓΘ',
      'ΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΓΓΓΓΘ',
      'ΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΔΘΓΓΓΓΘ',
      'ΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΘΓΓΓΓΘ',
      'ΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΘΓΛΓΓΘ',
      'ΩΩΩΩΩΩΩΩΩΩΩΩΩΣΣΩΩΩΩΩΩΩΩΩΩΩΩΩΘΓΓΓΓΘ',
      'ΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΘΓΓΛΓΘ',
      'ΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΩΘΓΓΓΓΘ',
      'ΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΠΘΓΓΓΓΘ',
      'ΘΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΘ',
      'ΘΓΓΓΛΓΓΓΓΓΛΓΓΓΓΓΛΓΓΓΓΓΛΓΓΓΓΓΓΓΓΓΓΘ',
      'ΘΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΘ',
      'ΘΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΘ',
      'ΘΓΨΨΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΓΘ',
      'ΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘΘ'
    ],
    offLimits: [[5, 7]],          // the stage itself: you see the show, you don't walk on it
    // spotlights that switch on with the beat of the show (beats 0-3 of each bar); get caught and you start the section again
    spots: [
      { x: 6, y: 12, w: 3, h: 5, beats: [0, 1], reset: 'default' },
      { x: 12, y: 12, w: 3, h: 5, beats: [2, 3], reset: 'default' },
      { x: 18, y: 12, w: 3, h: 5, beats: [0, 1], reset: 'default' },
      { x: 24, y: 12, w: 3, h: 5, beats: [2, 3], reset: 'default' },
      { x: 29, y: 9, w: 4, h: 2, beats: [0, 1], reset: 'column' },
      { x: 29, y: 5, w: 4, h: 2, beats: [2, 3], reset: 'column' },
      { x: 24, y: 1, w: 3, h: 3, beats: [1, 2], reset: 'gallery' },
      { x: 18, y: 1, w: 3, h: 3, beats: [3, 0], reset: 'gallery' },
      { x: 12, y: 1, w: 3, h: 3, beats: [1, 2], reset: 'gallery' },
      { x: 6, y: 1, w: 3, h: 3, beats: [3, 0], reset: 'gallery' }
    ],
    spawns: { default: { x: 2, y: 15, face: 'right' }, column: { x: 30, y: 12, face: 'up' }, gallery: { x: 30, y: 2, face: 'left' } },
    npcs: [
      { id: 'tam', x: 3, y: 14, face: 'right', ifNot: 'nocturne_done' },
      { id: 'nocturne', x: 18, y: 8, face: 'down', deco: true, ifNot: 'heist_done' },
      { id: 'clockwork', x: 10, y: 7, face: 'down', look: 'mech', deco: true, ifNot: 'heist_done' },
      { id: 'clockwork', x: 23, y: 7, face: 'down', look: 'mech', deco: true, ifNot: 'heist_done' }
    ],
    objects: [
      { id: 'stage_exit', x: 0, y: 15, label: 'Stage door' },
      { id: 'lift_lever', x: 2, y: 2, label: 'Piano lift lever' },
      { id: 'mirror', x: 2, y: 16, w: 2, label: 'Look' }
    ]
  }
};
