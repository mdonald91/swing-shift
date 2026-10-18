// Combat data: party stats and growth, skills and skill trees, items, enemies and encounters.
//
// Damage types: every attack and damaging skill is shot, blunt or shock. Enemies can be weak
// to a type (x1.5 damage, bonus Groove) or resist it (x0.6).
//
// Skill fields (all optional except n, cost, tgt):
//   tgt      enemy | enemies | random | ally | party | none
//   type     shot | blunt | shock (damaging skills)
//   hit      damage multiplier of the user's attack
//   multi    number of hits (on the target, or on random enemies with tgt: random)
//   pierce   ignores the target's DEF
//   stun     chance to make the target skip a turn (halved against bosses, doubled if weak to stun)
//   jam      rounds the target takes +25% damage
//   weaken   rounds the target deals 40% less damage
//   heal     HP restored (a number, or a fraction of max HP when under 1); revive brings back a downed ally
//   reviveAll  brings back every downed ally at this fraction of max HP
//   sp       SP restored to each ally (with tgt: party or none)
//   buff     rounds the whole crew hits 30% harder
//   shield   rounds the whole crew takes 35% less damage
//   groove   Groove added
//   exec     double damage against targets under 40% HP
//   wide     a more forgiving beat window

export const PARTY = {
  captain: { hp: 110, sp: 40, atk: 17, def: 4, attack: { n: 'Shoot', word: 'BANG!', sfx: 'bang', type: 'shot' } },
  rook: { hp: 120, sp: 40, atk: 19, def: 4, attack: { n: 'Shoot', word: 'BANG!', sfx: 'bang', type: 'shot' }, skills: ['quickdraw', 'ricochet'] },
  tam: { hp: 105, sp: 40, atk: 14, def: 5, attack: { n: 'Wrench', word: 'CLANK!', sfx: 'clank', type: 'blunt' }, skills: ['patch', 'overclock'] },
  brushes: { hp: 85, sp: 40, atk: 12, def: 3, attack: { n: 'Rimshot', word: 'TOK!', sfx: 'tok', type: 'blunt' }, skills: ['static', 'jamsignal'] },
  rhea: { hp: 95, sp: 40, atk: 15, def: 3, attack: { n: 'Taser', word: 'ZAP!', sfx: 'zap', type: 'shock' }, skills: ['tap', 'feedback'] }
};

// What each crew member gains per level after level 1.
export const GROWTH = {
  captain: { hp: 9, sp: 2, atk: 1.4, def: .5 },
  rook: { hp: 10, sp: 1.5, atk: 1.6, def: .5 },
  tam: { hp: 9, sp: 2, atk: 1.2, def: .7 },
  brushes: { hp: 7, sp: 2.5, atk: 1.1, def: .4 },
  rhea: { hp: 8, sp: 2.2, atk: 1.3, def: .4 }
};
export const MAX_LEVEL = 30;
export const xpToNext = lv => 20 + 20 * lv;          // 40 to reach level 2, 60 to reach 3, ...

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
  // starting skills
  quickdraw: { n: 'Quick Draw', cost: 8, tgt: 'enemy', type: 'shot', d: 'Heavy single shot', hit: 1.9, word: 'BANG!', sfx: 'bang' },
  ricochet: { n: 'Ricochet', cost: 12, tgt: 'enemies', type: 'shot', d: 'Hits every enemy', hit: .85, word: 'PING!', sfx: 'ping', tag: 'ricochet' },
  patch: { n: 'Patch Job', cost: 8, tgt: 'ally', d: 'Heal or revive one', heal: 38, revive: true },
  overclock: { n: 'Overclock', cost: 10, tgt: 'none', d: 'Crew hits harder for 3 rounds', buff: 3 },
  static: { n: 'Static Brush', cost: 8, tgt: 'enemy', type: 'shock', d: 'Zap that may stun', hit: .6, stun: .45, word: 'BZZT!', sfx: 'zap' },
  jamsignal: { n: 'Jam Signal', cost: 10, tgt: 'enemies', d: 'Enemies take +25% damage', jam: 3, word: 'WOBBLE', sfx: 'zap' },
  steady: { n: 'Steady Aim', cost: 8, tgt: 'enemy', type: 'shot', d: 'Heavy shot, easier timing', hit: 1.7, wide: true, word: 'BANG!', sfx: 'bang' },
  talkdown: { n: 'Talk Down', cost: 8, tgt: 'enemy', d: 'Target hits 40% softer', weaken: 3, word: 'EASY...' },
  cheapshot: { n: 'Cheap Shot', cost: 8, tgt: 'enemy', type: 'blunt', d: 'Low blow that may stun', hit: 1.3, stun: .35, word: 'OOF!', sfx: 'tok' },
  heckle: { n: 'Heckle', cost: 10, tgt: 'enemies', d: 'Enemies take +25% damage', jam: 3, word: 'BOO!' },
  rally: { n: 'Rally', cost: 10, tgt: 'party', d: 'Heal the crew, +4 SP', heal: 22, sp: 4 },
  coverfire: { n: 'Cover Fire', cost: 10, tgt: 'enemies', type: 'shot', d: 'Spray every enemy', hit: .7, word: 'RAT-TAT!', sfx: 'bang' },
  execution: { n: 'Execution', cost: 10, tgt: 'enemy', type: 'shot', d: 'Double damage under 40% HP', hit: 1.2, exec: true, word: 'BANG!', sfx: 'bang' },
  intimidate: { n: 'Intimidate', cost: 10, tgt: 'enemies', d: 'May stun every enemy', stun: .45, word: 'GLARE' },
  tap: { n: 'Signal Tap', cost: 8, tgt: 'enemy', type: 'shock', d: 'Hack: target takes more, hits softer', hit: .6, jam: 3, weaken: 2, word: 'TAPPED', sfx: 'zap' },
  feedback: { n: 'Feedback Loop', cost: 12, tgt: 'enemies', type: 'shock', d: 'Shocks every enemy, may stun', hit: .75, stun: .25, word: 'SKREEE', sfx: 'zap' },

  // captain's tree
  trickshot: { n: 'Trick Shot', cost: 7, tgt: 'enemy', type: 'shot', d: 'Two quick shots', hit: .75, multi: 2, word: 'BANG!', sfx: 'bang' },
  secondwind: { n: 'Second Wind', cost: 10, tgt: 'party', d: 'Heal the crew 18, +6 SP', heal: 18, sp: 6 },
  pointblank: { n: 'Point Blank', cost: 10, tgt: 'enemy', type: 'shot', d: 'Ignores armour', hit: 1.5, pierce: true, word: 'BLAM!', sfx: 'bang' },
  rallyingcry: { n: 'Rallying Cry', cost: 12, tgt: 'none', d: 'Crew hits harder, +20 Groove', buff: 2, groove: 20 },
  holdline: { n: 'Hold the Line', cost: 12, tgt: 'none', d: 'Crew takes 35% less damage, 2 rounds', shield: 2 },
  marked: { n: 'Marked', cost: 9, tgt: 'enemy', d: 'Target takes more and hits softer', jam: 3, weaken: 3, word: 'MARKED' },
  fullclip: { n: 'Full Clip', cost: 16, tgt: 'random', type: 'shot', d: 'Four shots at random enemies', hit: .6, multi: 4, word: 'BANG!', sfx: 'bang' },
  secondchance: { n: 'Second Chance', cost: 14, tgt: 'ally', d: 'Revive or heal one to 60%', heal: .6, revive: true },
  headliner: { n: 'Headliner', cost: 20, tgt: 'enemy', type: 'shot', d: 'Massive shot, double under 40%', hit: 2.6, exec: true, word: 'KA-BLAM!', sfx: 'bang' },
  encore: { n: 'Encore', cost: 18, tgt: 'none', d: '+50 Groove, +10 SP to the crew', groove: 50, sp: 10 },

  // Rook's tree
  snapshot: { n: 'Snap Shot', cost: 5, tgt: 'enemy', type: 'shot', d: 'Cheap shot, easy timing', hit: 1.3, wide: true, word: 'BANG!', sfx: 'bang' },
  fanhammer: { n: 'Fan the Hammer', cost: 10, tgt: 'enemy', type: 'shot', d: 'Three shots at one target', hit: .6, multi: 3, word: 'BANG!', sfx: 'bang' },
  piercer: { n: 'Armour Piercer', cost: 10, tgt: 'enemy', type: 'shot', d: 'Ignores armour', hit: 1.6, pierce: true, word: 'PTANG!', sfx: 'ping' },
  legshot: { n: 'Leg Shot', cost: 8, tgt: 'enemy', type: 'shot', d: 'Target hits 40% softer', hit: .9, weaken: 3, word: 'BANG!', sfx: 'bang' },
  deadeye: { n: 'Dead Eye', cost: 14, tgt: 'enemy', type: 'shot', d: 'Huge shot, easy timing', hit: 2.2, wide: true, word: 'BLAM!', sfx: 'bang' },
  bulletstorm: { n: 'Bullet Storm', cost: 16, tgt: 'enemies', type: 'shot', d: 'Hits every enemy hard', hit: 1.05, word: 'RAT-TAT!', sfx: 'bang' },
  quickhands: { n: 'Quick Hands', cost: 14, tgt: 'random', type: 'shot', d: 'Two heavy shots, random targets', hit: 1.05, multi: 2, word: 'BANG!', sfx: 'bang' },
  smokeround: { n: 'Smoke Round', cost: 14, tgt: 'enemies', d: 'May stun every enemy', stun: .4, hit: .35, type: 'shot', word: 'FWOOSH', sfx: 'ping' },
  highnoon: { n: 'High Noon', cost: 22, tgt: 'enemy', type: 'shot', d: 'Ignores armour, double under 40%', hit: 2.3, pierce: true, exec: true, word: 'HIGH NOON', sfx: 'bang' },
  luckyseven: { n: 'Lucky Seven', cost: 20, tgt: 'random', type: 'shot', d: 'Seven shots at random enemies', hit: .45, multi: 7, word: 'BANG!', sfx: 'bang' },

  // Tam's tree
  tuneup: { n: 'Tune-Up', cost: 10, tgt: 'party', d: 'Heal the crew 25', heal: 25 },
  wrenchtoss: { n: 'Wrench Toss', cost: 8, tgt: 'enemy', type: 'blunt', d: 'Heavy hit that may stun', hit: 1.4, stun: .3, word: 'CLONK!', sfx: 'clank' },
  spareparts: { n: 'Spare Parts', cost: 12, tgt: 'ally', d: 'Revive or heal one to 60%', heal: .6, revive: true },
  overload: { n: 'Overload', cost: 10, tgt: 'enemy', type: 'blunt', d: 'Ignores armour', hit: 1.5, pierce: true, word: 'KRANG!', sfx: 'clank' },
  blastshield: { n: 'Blast Shield', cost: 12, tgt: 'none', d: 'Crew takes 35% less damage, 2 rounds', shield: 2 },
  jumpstart: { n: 'Jump Start', cost: 8, tgt: 'party', d: '+12 SP to the crew', sp: 12 },
  fullservice: { n: 'Full Service', cost: 18, tgt: 'party', d: 'Heal the crew 50', heal: 50 },
  hammertime: { n: 'Hammer Time', cost: 14, tgt: 'enemy', type: 'blunt', d: 'Huge hit, target hits softer', hit: 2.0, weaken: 2, word: 'KA-CHUNK!', sfx: 'clank' },
  miraclefix: { n: 'Miracle Fix', cost: 24, tgt: 'party', d: 'Revive everyone at 50%, heal 30', reviveAll: .5, heal: 30 },
  wreckingball: { n: 'Wrecking Ball', cost: 18, tgt: 'enemies', type: 'blunt', d: 'Hits every enemy, may stun', hit: 1.25, stun: .3, word: 'WHAM!', sfx: 'clank' },

  // Brushes' tree
  snareroll: { n: 'Snare Roll', cost: 8, tgt: 'enemy', type: 'blunt', d: 'Three quick taps', hit: .45, multi: 3, word: 'TAK!', sfx: 'tok' },
  countin: { n: 'Count-In', cost: 8, tgt: 'none', d: '+30 Groove', groove: 30 },
  paradiddle: { n: 'Paradiddle', cost: 10, tgt: 'enemy', type: 'blunt', d: 'Likely stun', hit: .5, stun: .6, word: 'DIDDLE', sfx: 'tok' },
  brushsweep: { n: 'Brush Sweep', cost: 12, tgt: 'enemies', d: 'Every enemy hits 40% softer', weaken: 2, word: 'SWISH' },
  cymbalcrash: { n: 'Cymbal Crash', cost: 14, tgt: 'enemies', type: 'shock', d: 'Shocks every enemy, may stun', hit: .9, stun: .3, word: 'CRASH!', sfx: 'zap' },
  backbeat: { n: 'Backbeat', cost: 12, tgt: 'none', d: 'Crew hits harder for 3 rounds', buff: 3 },
  drumsolo: { n: 'Drum Solo', cost: 16, tgt: 'random', type: 'blunt', d: 'Six hits at random enemies', hit: .4, multi: 6, word: 'TOK!', sfx: 'tok' },
  temposhift: { n: 'Tempo Shift', cost: 16, tgt: 'enemies', d: 'Enemies take more and hit softer', jam: 3, weaken: 3, word: 'WOBBLE' },
  bigfinish: { n: 'Big Finish', cost: 20, tgt: 'none', d: 'Fills the Groove meter', groove: 100 },
  thunderkit: { n: 'Thunder Kit', cost: 20, tgt: 'enemies', type: 'shock', d: 'Big shock to every enemy, may stun', hit: 1.4, stun: .4, word: 'KRAKOOM', sfx: 'zap' },

  // Rhea's tree
  ping: { n: 'Ping', cost: 5, tgt: 'enemy', type: 'shock', d: 'Cheap, accurate zap', hit: 1.2, wide: true, word: 'PING', sfx: 'zap' },
  firewall: { n: 'Firewall', cost: 12, tgt: 'none', d: 'Crew takes 35% less damage, 2 rounds', shield: 2 },
  overclockhack: { n: 'Overclock Hack', cost: 12, tgt: 'none', d: '+8 SP to the crew, hits harder', sp: 8, buff: 2 },
  packetstorm: { n: 'Packet Storm', cost: 12, tgt: 'random', type: 'shock', d: 'Four zaps at random enemies', hit: .45, multi: 4, word: 'BZT!', sfx: 'zap' },
  backdoor: { n: 'Backdoor', cost: 12, tgt: 'enemy', type: 'shock', d: 'Ignores armour', hit: 1.8, pierce: true, word: 'ACCESS', sfx: 'zap' },
  blackout: { n: 'Blackout', cost: 16, tgt: 'enemies', d: 'Likely stun on every enemy', stun: .5, word: 'DARK' },
  signaljam: { n: 'Signal Jam', cost: 14, tgt: 'enemies', d: 'Enemies take more and hit softer', jam: 3, weaken: 3, word: 'NO SIGNAL' },
  shortcircuit: { n: 'Short Circuit', cost: 16, tgt: 'enemy', type: 'shock', d: 'Huge zap that may stun', hit: 2.2, stun: .4, word: 'FZZZT', sfx: 'zap' },
  zeroday: { n: 'Zero Day', cost: 22, tgt: 'enemy', type: 'shock', d: 'Ignores armour, double under 40%', hit: 2.4, pierce: true, exec: true, word: 'ZERO DAY', sfx: 'zap' },
  totalfeedback: { n: 'Total Feedback', cost: 22, tgt: 'enemies', type: 'shock', d: 'Big shock to every enemy', hit: 1.55, stun: .3, word: 'SKREEEE', sfx: 'zap' }
};

// Skill trees: at each tier level, pick one of the two skills.
export const TIERS = [3, 6, 10, 15, 20];
export const TREES = {
  captain: [['trickshot', 'secondwind'], ['pointblank', 'rallyingcry'], ['holdline', 'marked'], ['fullclip', 'secondchance'], ['headliner', 'encore']],
  rook: [['snapshot', 'fanhammer'], ['piercer', 'legshot'], ['deadeye', 'bulletstorm'], ['quickhands', 'smokeround'], ['highnoon', 'luckyseven']],
  tam: [['tuneup', 'wrenchtoss'], ['spareparts', 'overload'], ['blastshield', 'jumpstart'], ['fullservice', 'hammertime'], ['miraclefix', 'wreckingball']],
  brushes: [['snareroll', 'countin'], ['paradiddle', 'brushsweep'], ['cymbalcrash', 'backbeat'], ['drumsolo', 'temposhift'], ['bigfinish', 'thunderkit']],
  rhea: [['ping', 'firewall'], ['overclockhack', 'packetstorm'], ['backdoor', 'blackout'], ['signaljam', 'shortcircuit'], ['zeroday', 'totalfeedback']]
};
export const RELEARN_COST = 300;

// tgt: living (a standing crewmate), downed (a knocked-out one) or party (everyone standing)
export const ITEMS = {
  noodle: { n: 'Noodle Cup', d: 'Heals 45 HP', heal: 45, tgt: 'living', price: 60 },
  coffee: { n: 'Hot Coffee', d: 'Restores 15 SP', sp: 15, tgt: 'living', price: 90 },
  patch: { n: 'Patch Kit', d: 'Revives a downed crewmate at half HP', revive: .5, tgt: 'downed', price: 260 },
  curry: { n: 'Neon Curry', d: 'Heals the whole crew 30 HP', heal: 30, tgt: 'party', price: 180 }
};

export const TYPES = { shot: 'Shot', blunt: 'Blunt', shock: 'Shock', stun: 'Stun' };

// Enemy types. Encounters list these by key and can override any field.
// weakTo/resists: damage types (or 'stun', which doubles stun chances). xp: experience for beating it.
export const ENEMIES = {
  goon: { id: 'goon', name: 'Dock Goon', hp: 70, atk: 14, def: 2, xp: 18, weakTo: ['blunt'], word: 'POW!' },
  gunman: { id: 'gunman', name: 'Gunman', hp: 90, atk: 17, def: 3, xp: 22, weakTo: ['stun', 'blunt'], word: 'BLAM!', verb: 'fires at' },
  hacker: { id: 'hacker', name: 'Hacker', hp: 70, atk: 15, def: 2, xp: 24, weakTo: ['shot'], resists: ['shock'], ai: 'hacker', word: 'GLITCH' },
  heavy: { id: 'mech', name: 'Heavy mech', hp: 170, atk: 19, def: 9, xp: 45, weakTo: ['shock'], resists: ['shot'], machine: true, word: 'KRUNCH!', verb: 'slams' },
  drone: { id: 'drone', name: 'Security drone', hp: 90, atk: 17, def: 4, xp: 26, weakTo: ['shock'], machine: true, word: 'ZZT!', verb: 'fires a stun bolt at' },
  scav: { id: 'scav', name: 'Tunnel scavenger', hp: 120, atk: 21, def: 5, xp: 30, weakTo: ['shot'], word: 'THUNK!' },
  holo: { id: 'holo', name: 'Holo-player', hp: 75, atk: 14, def: 2, xp: 20, weakTo: ['shock'], machine: true, word: 'BLIP!' }
};
const E = (key, over = {}) => ({ ...ENEMIES[key], ...over });

// Encounter fields: bg backdrop; noRun text if you can't flee; bounty id for story fights
// (cutscene + ledger after); otherwise flag + reward for a skirmish; scale: enemies grow with the party.
// Enemy ai: velvet | warden | duet | hacker | grunt (default).
export const ENCOUNTERS = {
  // ---- story fights ----
  velvet: {
    bg: 'warehouse', bounty: 'velvet', intro: 'Velvet tips her hat. Two goons crack their knuckles in 4/4 time.',
    noRun: "Velvet's goons have the exit covered.",
    enemies: [
      E('goon'),
      { id: 'velvet', name: 'Velvet Moreau', hp: 340, atk: 23, def: 4, boss: true, ai: 'velvet', xp: 110, weakTo: ['shock'] },
      E('goon')
    ]
  },
  drones: {
    bg: 'relay_in', intro: 'Two security drones swivel their red eyes towards you.',
    flag: 'drones_cleared', reward: { chits: 450, items: { coffee: 1 } },
    enemies: [E('drone'), E('drone')]
  },
  warden: {
    bg: 'relay_in', bounty: 'ghost', intro: 'The Warden unfolds from the ceiling. Every screen in the hub turns red.',
    noRun: 'The comms hub doors have sealed behind you.',
    enemies: [
      E('drone', { hp: 80 }),
      { id: 'warden', name: 'The Warden', hp: 520, atk: 28, def: 8, boss: true, machine: true, ai: 'warden', xp: 170, weakTo: ['shock'], resists: ['shot'] },
      E('drone', { hp: 70 })
    ]
  },
  scavs: {
    bg: 'tunnel', intro: 'Two tunnel scavengers crack their knuckles. One of them has a pickaxe. The other has a bigger pickaxe.',
    flag: 'scavs_cleared', reward: { chits: 600, items: { noodle: 2 } },
    enemies: [E('scav'), E('scav', { id: 'scav2' })]
  },
  // Sable and Vox fight as a duet: every third round they tune up for a Harmony that hits everyone.
  // Stun either of them while they're tuning to break it. Beat one and the other plays on, furious.
  duet: {
    bg: 'tunnel', bounty: 'courier', intro: 'Sable hums a note. Vox thumbs a low string. The tunnel walls hum back.',
    noRun: 'Vox is standing in the only doorway. He is a very wide man.',
    enemies: [
      { id: 'sable', name: 'Sable', hp: 360, atk: 27, def: 5, boss: true, ai: 'duet', role: 'sable', xp: 150, weakTo: ['shot'] },
      { id: 'vox', name: 'Vox', hp: 410, atk: 31, def: 8, boss: true, ai: 'duet', role: 'vox', xp: 150, weakTo: ['blunt'], resists: ['shot'] }
    ]
  },

  // ---- optional side fights ----
  smugglers: {
    bg: 'docks', intro: 'Two smugglers draw on you before you have finished saying hello.',
    flag: 'smugglers_cleared', reward: { chits: 300, items: { noodle: 1 } },
    enemies: [E('gunman', { name: 'Smuggler', hp: 75, atk: 15 }), E('gunman', { name: 'Smuggler', hp: 75, atk: 15 })]
  },
  loader: {
    bg: 'docks', intro: 'A cargo loader stomps out of its bay, its safety lights blinking an unsafe red.',
    flag: 'loader_cleared', reward: { chits: 380, items: { coffee: 1 } },
    enemies: [E('heavy', { name: 'Rogue loader', hp: 190, atk: 20, def: 7 })]
  },
  alley: {
    bg: 'station', intro: 'A hacker and two hired guns peel off the wall. Somebody wants your wallet and your ship codes.',
    flag: 'alley_cleared', reward: { chits: 550, items: { curry: 1 } },
    enemies: [E('gunman', { atk: 19 }), E('hacker', { hp: 80 }), E('gunman', { atk: 19 })]
  },
  maint: {
    bg: 'relay_in', intro: 'A maintenance mech wakes up in the storeroom. It has decided you are maintenance.',
    flag: 'maint_cleared', reward: { chits: 600, items: { patch: 1 } },
    enemies: [E('drone', { hp: 90 }), E('heavy', { hp: 240, atk: 25, def: 10 })]
  },
  jumpers: {
    bg: 'tunnel', intro: "Claim jumpers. A hacker, a gunman and a mining mech, and they all think this tunnel is theirs.",
    flag: 'jumpers_cleared', reward: { chits: 800, items: { curry: 1, coffee: 1 } },
    enemies: [E('gunman', { hp: 120, atk: 25, def: 5 }), E('heavy', { hp: 280, atk: 28, def: 11 }), E('hacker', { hp: 100, atk: 21 })]
  },
  // Brushes' holo-rehearsal on the Hi-Hat: repeatable, grows with the crew, XP only.
  rehearsal: {
    bg: 'lounge', intro: 'Brushes projects a holo-band into the lounge. "Practice makes perfect! Or at least makes slightly less bad."',
    scale: true, xpRate: .6, reward: { chits: 0 },
    enemies: [E('holo', { name: 'Holo-drummer' }), E('holo', { name: 'Holo-bassist', hp: 60, weakTo: ['shot'] })]
  }
};
