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
//   machine  damage multiplier against machine enemies

export const PARTY = {
  captain: { hp: 110, sp: 40, atk: 17, def: 4, attack: { n: 'Shoot', word: 'BANG!', sfx: 'bang' } },
  rook: { hp: 120, sp: 40, atk: 19, def: 4, attack: { n: 'Shoot', word: 'BANG!', sfx: 'bang' }, skills: ['quickdraw', 'ricochet'] },
  tam: { hp: 105, sp: 40, atk: 14, def: 5, attack: { n: 'Wrench', word: 'CLANK!', sfx: 'clank' }, skills: ['patch', 'overclock'] },
  brushes: { hp: 85, sp: 40, atk: 12, def: 3, attack: { n: 'Rimshot', word: 'TOK!', sfx: 'tok' }, skills: ['static', 'jamsignal'] },
  rhea: { hp: 95, sp: 40, atk: 15, def: 3, attack: { n: 'Taser', word: 'ZAP!', sfx: 'zap' }, skills: ['tap', 'feedback'] }
};

// Crew who can be picked for the party, and what makes them available.
export const ROSTER = [
  { id: 'rook' }, { id: 'tam' }, { id: 'brushes' }, { id: 'rhea', needs: 'rhea_joined' }
];

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
  intimidate: { n: 'Intimidate', cost: 10, tgt: 'enemies', d: 'May stun every enemy', stun: .45, word: 'GLARE' },
  tap: { n: 'Signal Tap', cost: 8, tgt: 'enemy', d: 'Hack: target takes more, hits softer', hit: .6, jam: 3, weaken: 2, word: 'TAPPED', sfx: 'zap' },
  feedback: { n: 'Feedback Loop', cost: 12, tgt: 'enemies', d: 'Hits all; brutal against machines', hit: .7, machine: 1.8, stun: .25, word: 'SKREEE', sfx: 'zap' }
};

// tgt: living (a standing crewmate), downed (a knocked-out one) or party (everyone standing)
export const ITEMS = {
  noodle: { n: 'Noodle Cup', d: 'Heals 45 HP', heal: 45, tgt: 'living', price: 60 },
  coffee: { n: 'Hot Coffee', d: 'Restores 15 SP', sp: 15, tgt: 'living', price: 90 },
  patch: { n: 'Patch Kit', d: 'Revives a downed crewmate at half HP', revive: .5, tgt: 'downed', price: 260 },
  curry: { n: 'Neon Curry', d: 'Heals the whole crew 30 HP', heal: 30, tgt: 'party', price: 180 }
};

// Encounter fields: bg backdrop; noRun text if you can't flee; bounty id for story fights
// (cutscene + ledger after); otherwise flag + reward for a skirmish.
// Enemy ai: velvet | warden | duet | grunt (default). machine: true makes Feedback Loop hit harder.
export const ENCOUNTERS = {
  scavs: {
    bg: 'tunnel', intro: 'Two tunnel scavengers crack their knuckles. One of them has a pickaxe. The other has a bigger pickaxe.',
    flag: 'scavs_cleared', reward: { chits: 600, items: { noodle: 2 } },
    enemies: [
      { id: 'scav', name: 'Tunnel scavenger', hp: 70, atk: 14, def: 3, word: 'THUNK!' },
      { id: 'scav2', name: 'Tunnel scavenger', hp: 70, atk: 14, def: 3, word: 'THUNK!' }
    ]
  },
  // Sable and Vox fight as a duet: every third round they tune up for a Harmony that hits everyone.
  // Stun either of them while they're tuning to break it. Beat one and the other plays on, furious.
  duet: {
    bg: 'tunnel', bounty: 'courier', intro: 'Sable hums a note. Vox thumbs a low string. The tunnel walls hum back.',
    noRun: 'Vox is standing in the only doorway. He is a very wide man.',
    enemies: [
      { id: 'sable', name: 'Sable', hp: 220, atk: 18, def: 4, boss: true, ai: 'duet', role: 'sable' },
      { id: 'vox', name: 'Vox', hp: 250, atk: 22, def: 6, boss: true, ai: 'duet', role: 'vox' }
    ]
  },
  drones: {
    bg: 'relay_in', intro: 'Two security drones swivel their red eyes towards you.',
    flag: 'drones_cleared', reward: { chits: 450, items: { coffee: 1 } },
    enemies: [
      { id: 'drone', name: 'Security drone', hp: 60, atk: 13, def: 3, machine: true, word: 'ZZT!' },
      { id: 'drone', name: 'Security drone', hp: 60, atk: 13, def: 3, machine: true, word: 'ZZT!' }
    ]
  },
  warden: {
    bg: 'relay_in', bounty: 'ghost', intro: 'The Warden unfolds from the ceiling. Every screen in the hub turns red.',
    noRun: 'The comms hub doors have sealed behind you.',
    enemies: [
      { id: 'drone', name: 'Security drone', hp: 55, atk: 13, def: 3, machine: true, word: 'ZZT!' },
      { id: 'warden', name: 'The Warden', hp: 360, atk: 22, def: 6, boss: true, machine: true, ai: 'warden' },
      { id: 'drone', name: 'Security drone', hp: 55, atk: 13, def: 3, machine: true, word: 'ZZT!' }
    ]
  },
  velvet: {
    bg: 'warehouse', bounty: 'velvet', intro: 'Velvet tips her hat. Two goons crack their knuckles in 4/4 time.',
    noRun: "Velvet's goons have the exit covered.",
    enemies: [
      { id: 'goon', name: 'Dock Goon', hp: 55, atk: 12, def: 2 },
      { id: 'velvet', name: 'Velvet Moreau', hp: 270, atk: 20, def: 4, boss: true, ai: 'velvet' },
      { id: 'goon', name: 'Dock Goon', hp: 55, atk: 12, def: 2 }
    ]
  }
};
