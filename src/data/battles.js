// Combat data: party stats, skills, items and encounters.
//
// Skill fields (all optional except n, cost, tgt):
//   tgt      enemy | enemies | ally | party | none
//   hit      damage multiplier of the user's attack
//   stun     chance to make the target skip a turn (halved against bosses)
//   jam      rounds the target takes +25% damage
//   weaken   rounds the target deals 40% less damage
//   heal     HP restored; revive lets it bring back a downed ally
//   sp       SP restored to each ally (with tgt: party)
//   buff     rounds the whole crew hits 30% harder
//   exec     double damage against targets under 40% HP
//   wide     a more forgiving beat window

export const PARTY = {
  captain: { hp: 110, sp: 40, atk: 17, def: 4, attack: { n: 'Shoot', word: 'BANG!', sfx: 'bang' } },
  rook: { hp: 120, sp: 40, atk: 19, def: 4, attack: { n: 'Shoot', word: 'BANG!', sfx: 'bang' }, skills: ['quickdraw', 'ricochet'] },
  tam: { hp: 105, sp: 40, atk: 14, def: 5, attack: { n: 'Wrench', word: 'CLANK!', sfx: 'clank' }, skills: ['patch', 'overclock'] },
  brushes: { hp: 85, sp: 40, atk: 12, def: 3, attack: { n: 'Rimshot', word: 'TOK!', sfx: 'tok' }, skills: ['static', 'jamsignal'] }
};

export const CAPTAIN_SKILLS = {
  Calm: ['steady', 'talkdown'],
  Sarcastic: ['cheapshot', 'heckle'],
  Idealistic: ['rally', 'coverfire'],
  Ruthless: ['execution', 'intimidate']
};

export const SKILLS = {
  quickdraw: { n: 'Quick Draw', cost: 8, tgt: 'enemy', d: 'Heavy single shot', hit: 1.9, word: 'BANG!', sfx: 'bang' },
  ricochet: { n: 'Ricochet', cost: 12, tgt: 'enemies', d: 'Hits every enemy', hit: .85, word: 'PING!', sfx: 'ping', tag: 'ricochet' },
  patch: { n: 'Patch Job', cost: 8, tgt: 'ally', d: 'Heal or revive one', heal: 38, revive: true },
  overclock: { n: 'Overclock', cost: 10, tgt: 'none', d: 'Crew hits harder for 3 rounds', buff: 3 },
  static: { n: 'Static Brush', cost: 8, tgt: 'enemy', d: 'Zap that may stun', hit: .6, stun: .45, word: 'BZZT!', sfx: 'zap' },
  jamsignal: { n: 'Jam Signal', cost: 10, tgt: 'enemies', d: 'Enemies take +25% damage', jam: 3, word: 'WOBBLE', sfx: 'zap' },
  steady: { n: 'Steady Aim', cost: 8, tgt: 'enemy', d: 'Heavy shot, easier timing', hit: 1.7, wide: true, word: 'BANG!', sfx: 'bang' },
  talkdown: { n: 'Talk Down', cost: 8, tgt: 'enemy', d: 'Target hits 40% softer', weaken: 3, word: 'EASY...' },
  cheapshot: { n: 'Cheap Shot', cost: 8, tgt: 'enemy', d: 'Low blow that may stun', hit: 1.3, stun: .35, word: 'OOF!', sfx: 'tok' },
  heckle: { n: 'Heckle', cost: 10, tgt: 'enemies', d: 'Enemies take +25% damage', jam: 3, word: 'BOO!' },
  rally: { n: 'Rally', cost: 10, tgt: 'party', d: 'Heal the crew, +4 SP', heal: 22, sp: 4 },
  coverfire: { n: 'Cover Fire', cost: 10, tgt: 'enemies', d: 'Spray every enemy', hit: .7, word: 'RAT-TAT!', sfx: 'bang' },
  execution: { n: 'Execution', cost: 10, tgt: 'enemy', d: 'Double damage under 40% HP', hit: 1.2, exec: true, word: 'BANG!', sfx: 'bang' },
  intimidate: { n: 'Intimidate', cost: 10, tgt: 'enemies', d: 'May stun every enemy', stun: .45, word: 'GLARE' }
};

export const ITEMS = {
  noodle: { n: 'Noodle Cup', d: 'Heals 45 HP', heal: 45 }
};

export const ENCOUNTERS = {
  velvet: {
    bg: 'warehouse',
    noRun: "Velvet's goons have the exit covered.",
    enemies: [
      { id: 'goon', name: 'Dock Goon', hp: 55, atk: 12, def: 2 },
      { id: 'velvet', name: 'Velvet Moreau', hp: 270, atk: 20, def: 4, boss: true },
      { id: 'goon', name: 'Dock Goon', hp: 55, atk: 12, def: 2 }
    ]
  }
};
