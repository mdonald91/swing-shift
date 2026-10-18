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
  rhea: { hp: 95, sp: 40, atk: 15, def: 3, attack: { n: 'Taser', word: 'ZAP!', sfx: 'zap', type: 'shock' }, skills: ['tap', 'feedback'] },
  lyra: { hp: 92, sp: 46, atk: 14, def: 3, attack: { n: 'Sonic Pulse', word: 'VOOM!', sfx: 'zap', type: 'blunt' }, skills: ['harmonize', 'resonance'] }
};

// What each crew member gains per level after level 1.
export const GROWTH = {
  captain: { hp: 9, sp: 2, atk: 1.4, def: .5 },
  rook: { hp: 10, sp: 1.5, atk: 1.6, def: .5 },
  tam: { hp: 9, sp: 2, atk: 1.2, def: .7 },
  brushes: { hp: 7, sp: 2.5, atk: 1.1, def: .4 },
  rhea: { hp: 8, sp: 2.2, atk: 1.3, def: .4 },
  lyra: { hp: 8, sp: 2.6, atk: 1.25, def: .4 }
};
export const MAX_LEVEL = 30;
export const xpToNext = lv => 20 + 20 * lv;          // 40 to reach level 2, 60 to reach 3, ...

// Crew who can be picked for the party, and what makes them available.
export const ROSTER = [
  { id: 'rook' }, { id: 'tam' }, { id: 'brushes' }, { id: 'rhea', needs: 'rhea_joined' }, { id: 'lyra', needs: 'lyra_joined' }
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

  harmonize: { n: 'Harmonize', cost: 10, tgt: 'none', d: '+25 Groove, crew hits harder 2 rounds', groove: 25, buff: 2 },
  resonance: { n: 'Resonance', cost: 10, tgt: 'enemies', type: 'blunt', d: 'A sound wave through every enemy', hit: .7, word: 'WHUMM', sfx: 'zap' },

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
  totalfeedback: { n: 'Total Feedback', cost: 22, tgt: 'enemies', type: 'shock', d: 'Big shock to every enemy', hit: 1.55, stun: .3, word: 'SKREEEE', sfx: 'zap' },

  // Lyra's tree
  counterpoint: { n: 'Counterpoint', cost: 7, tgt: 'enemy', type: 'blunt', d: 'Two answering notes', hit: .6, multi: 2, word: 'DA-DUM', sfx: 'tok' },
  lullaby: { n: 'Lullaby', cost: 12, tgt: 'enemies', d: 'May send every enemy to sleep (stun)', stun: .45, word: 'hush...' },
  crescendo: { n: 'Crescendo', cost: 12, tgt: 'none', d: 'Crew hits harder 3 rounds, +15 Groove', buff: 3, groove: 15 },
  perfecttime: { n: 'Perfect Time', cost: 10, tgt: 'party', d: 'Heal the crew 20, +10 SP', heal: 20, sp: 10 },
  fugue: { n: 'Fugue', cost: 14, tgt: 'random', type: 'blunt', d: 'Five overlapping notes at random enemies', hit: .48, multi: 5, word: 'DOO!', sfx: 'tok' },
  silence: { n: 'Silence', cost: 14, tgt: 'enemies', d: 'Enemies take more and hit softer', jam: 3, weaken: 3, word: '......' },
  chorus: { n: 'Chorus', cost: 18, tgt: 'party', d: 'Heal the crew 45', heal: 45 },
  overture: { n: 'Overture', cost: 18, tgt: 'none', d: '+60 Groove', groove: 60 },
  symphony: { n: 'Symphony', cost: 22, tgt: 'enemies', type: 'blunt', d: 'A full orchestra through every enemy, may stun', hit: 1.45, stun: .3, word: 'FORTISSIMO', sfx: 'bang' },
  requiem: { n: 'Requiem', cost: 24, tgt: 'party', d: 'Revive everyone at 60%, heal 40', reviveAll: .6, heal: 40 }
};

// Skill trees: at each tier level, pick one of the two skills.
export const TIERS = [3, 6, 10, 15, 20];
export const TREES = {
  captain: [['trickshot', 'secondwind'], ['pointblank', 'rallyingcry'], ['holdline', 'marked'], ['fullclip', 'secondchance'], ['headliner', 'encore']],
  rook: [['snapshot', 'fanhammer'], ['piercer', 'legshot'], ['deadeye', 'bulletstorm'], ['quickhands', 'smokeround'], ['highnoon', 'luckyseven']],
  tam: [['tuneup', 'wrenchtoss'], ['spareparts', 'overload'], ['blastshield', 'jumpstart'], ['fullservice', 'hammertime'], ['miraclefix', 'wreckingball']],
  brushes: [['snareroll', 'countin'], ['paradiddle', 'brushsweep'], ['cymbalcrash', 'backbeat'], ['drumsolo', 'temposhift'], ['bigfinish', 'thunderkit']],
  rhea: [['ping', 'firewall'], ['overclockhack', 'packetstorm'], ['backdoor', 'blackout'], ['signaljam', 'shortcircuit'], ['zeroday', 'totalfeedback']],
  lyra: [['counterpoint', 'lullaby'], ['crescendo', 'perfecttime'], ['fugue', 'silence'], ['chorus', 'overture'], ['symphony', 'requiem']]
};
export const RELEARN_COST = 300;

// tgt: living (a standing crewmate), downed (a knocked-out one) or party (everyone standing)
export const ITEMS = {
  noodle: { n: 'Noodle Cup', d: 'Heals 45 HP', heal: 45, tgt: 'living', price: 60 },
  coffee: { n: 'Hot Coffee', d: 'Restores 15 SP', sp: 15, tgt: 'living', price: 90 },
  patch: { n: 'Patch Kit', d: 'Revives a downed crewmate at half HP', revive: .5, tgt: 'downed', price: 260 },
  curry: { n: 'Neon Curry', d: 'Heals the whole crew 30 HP', heal: 30, tgt: 'party', price: 180 },
  // crafted in Tam's workshop (enemies: hits every enemy; none: no target needed)
  charge: { n: 'Shock Charge', d: 'Shocks every enemy, ignoring armour', dmg: 40, type: 'shock', tgt: 'enemies', price: 0 },
  cell: { n: 'Groove Cell', d: '+50 Groove', groove: 50, tgt: 'none', price: 0 }
};

// Jam Session arrangements. Big Band is always there; the recording booth unlocks the rest.
//   hit: share of the band's combined attack dealt to each enemy (hits: split into random hits)
export const JAM_STYLES = {
  bigband: { n: 'Big Band', d: 'Everyone hits every enemy hard.', hit: .7 },
  ballad: { n: 'Ballad', d: 'A softer hit on every enemy. Heals the crew a third of their HP and revives anyone down.', hit: .4, heal: .33, revive: true, booth: true },
  bebop: { n: 'Bebop', d: 'Eight fast hits on random enemies, then the Groove meter starts a third full again.', hit: .26, hits: 8, groove: 35, booth: true },
  halcyon: { n: 'Halcyon', d: "Mae Halloway's song, all five bars: a big hit on every enemy, and the crew heals a little.", hit: .62, heal: .15, needs: 'piano_kept' },
  bossa: { n: 'Bossa Nova', d: 'A smooth hit on every enemy. The crew takes less damage and the enemies hit softer for 2 rounds.', hit: .5, shield: 2, weaken: 2, booth: true }
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
  minebot: { id: 'mech', name: 'Mine bot', hp: 220, atk: 32, def: 9, xp: 60, weakTo: ['shock'], resists: ['blunt'], machine: true, word: 'GRRZZK!', verb: 'drills into' },
  rockrat: { id: 'drone', name: 'Rock rat', hp: 125, atk: 28, def: 5, xp: 38, weakTo: ['blunt'], machine: true, word: 'SKRITCH!', verb: 'gnaws at' },
  labdrone: { id: 'drone', name: 'Lab security drone', hp: 210, atk: 33, def: 9, xp: 62, weakTo: ['shock'], resists: ['shot'], machine: true, word: 'ZZT!', verb: 'fires a stun bolt at' },
  labmech: { id: 'mech', name: 'Containment unit', hp: 330, atk: 36, def: 12, xp: 90, weakTo: ['shock'], resists: ['blunt'], machine: true, word: 'KRUNCH!', verb: 'clamps down on' },
  moth: { id: 'holo', name: 'Frost moth', hp: 150, atk: 31, def: 5, xp: 48, weakTo: ['shot'], resists: ['blunt'], word: 'FWSSH', verb: 'beats frozen wings at' },
  usher: { id: 'goon', name: 'Usher', hp: 260, atk: 38, def: 9, xp: 70, weakTo: ['blunt'], word: 'SHHH!', verb: 'escorts' },
  clockwork: { id: 'holo', name: 'Clockwork player', hp: 260, atk: 30, def: 10, xp: 80, weakTo: ['shock'], resists: ['shot'], machine: true, accomp: true, word: 'TICK-TOCK', verb: 'plays a sharp at' },
  holo: { id: 'holo', name: 'Holo-player', hp: 75, atk: 14, def: 2, xp: 20, weakTo: ['shock'], machine: true, word: 'BLIP!' },
  // Act 3: bounty hunters out for the Hi-Hat's crew, and Helix's own security
  collector: { id: 'collector', name: 'Collector', hp: 250, atk: 36, def: 8, xp: 72, weakTo: ['shock'], word: 'GOTCHA!', verb: 'swings a stun baton at' },
  sharpshooter: { id: 'collector2', name: 'Collector sharpshooter', hp: 210, atk: 40, def: 6, xp: 72, weakTo: ['blunt'], resists: ['shot'], word: 'BLAM!', verb: 'takes a shot at' },
  bruiser: { id: 'collector', name: 'Collector bruiser', hp: 300, atk: 34, def: 10, xp: 80, weakTo: ['shot'], resists: ['blunt'], word: 'THWACK!', verb: 'tackles' },
  helixguard: { id: 'helixsec', name: 'Helix security', hp: 300, atk: 37, def: 10, xp: 80, weakTo: ['shock'], resists: ['shot'], word: 'HALT!', verb: 'fires a tagging dart at' }
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

  // ---- Track 04, Targon ----
  minebots: {
    bg: 'mine_deep', intro: 'Two mine bots turn from the junction box, drill bits spinning up. They have been chewing the cables.',
    flag: 'minebots_cleared', reward: { chits: 700, items: { patch: 1 } },
    enemies: [E('minebot'), E('rockrat', { hp: 100 }), E('minebot', { hp: 200 })]
  },
  // The Iron Mantis changes stance every couple of rounds (every round once it's hurt):
  // Guard (weak to Shock), Strike (weak to Blunt, sweeps two of you), Drill (weak to Shot; spins up,
  // then hits everyone unless you stun it first).
  mantis: {
    bg: 'mine_deep', bounty: 'mantis', intro: "The Iron Mantis unfolds to its full height. Its scythes scrape the ceiling. It's humming four bars.",
    noRun: 'The Mantis is between you and every way out.',
    enemies: [
      { id: 'mantis', name: 'Iron Mantis', hp: 1150, atk: 42, def: 10, boss: true, machine: true, ai: 'mantis', xp: 340, weakTo: ['shock'], resists: ['shot', 'blunt'] }
    ]
  },

  // Rook's old partner: Helix contractors come to collect Cass Marlowe. Grows with the crew.
  cass: {
    bg: 'station', intro: "Three Helix contractors step out of the rain. 'Marlowe. And friends. Lovely. Overtime.'",
    noRun: "Rook isn't going anywhere. Neither are you.", scale: true, after: 'cass_choice', reward: { chits: 0, items: { curry: 1 } },
    enemies: [
      E('gunman', { name: 'Helix contractor', hp: 105, atk: 18, def: 4 }),
      E('hacker', { name: 'Helix tracker', hp: 90, atk: 16 }),
      E('gunman', { name: 'Helix contractor', hp: 105, atk: 18, def: 4 })
    ]
  },

  // ---- Track 05, Nyx ----
  labsec: {
    bg: 'lab', intro: 'Two lab drones and a containment unit lock onto you. "UNAUTHORISED PERSONNEL. PLEASE HOLD STILL."',
    flag: 'labsec_cleared', reward: { chits: 900, items: { patch: 1 } },
    enemies: [E('labdrone'), E('labmech'), E('labdrone', { hp: 190 })]
  },
  // The Sentinel is a Warden-class security AI. It starts behind a shield that cuts damage by 40%; a Shock hit
  // knocks the shield down, and it comes back up every third round. It calls a drone when it's alone.
  sentinel: {
    bg: 'dome', bounty: 'proto', intro: "The Sentinel unfolds from the dome's frame, white and silent. A shield hums up around it: it takes less damage until a Shock hit breaks it.",
    noRun: "The dome has sealed itself. Lyra is pressed against the glass behind you.",
    enemies: [
      E('labdrone', { hp: 180 }),
      { id: 'warden', name: 'The Sentinel', hp: 950, atk: 34, def: 8, boss: true, machine: true, ai: 'sentinel', xp: 300, weakTo: ['shock'], resists: ['shot'] }
    ]
  },

  // Mister Nocturne: while either clockwork player is still playing, he takes 40% less damage.
  // Every other round he plays rubato (the next beat ring is harder to hit), and once hurt he calls
  // an encore that brings a player back. He also steals Groove.
  nocturne: {
    bg: 'lyceum', bounty: 'nocturne', intro: 'Mister Nocturne bows to an audience that is screaming. His clockwork players lift their instruments in perfect time.',
    noRun: 'Two thousand people are watching. You are not leaving by the front.',
    enemies: [
      E('clockwork', { name: 'Clockwork violinist' }),
      { id: 'nocturne', name: 'Mister Nocturne', hp: 1100, atk: 36, def: 10, boss: true, ai: 'nocturne', xp: 360, weakTo: ['shot'], resists: ['blunt'] },
      E('clockwork', { name: 'Clockwork cellist', hp: 300 })
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
  rockrats: {
    bg: 'mine', intro: 'A nest of rock rats boils out of the spoil heap. They are small, fast and made of drill.',
    flag: 'rockrats_cleared', reward: { chits: 650, items: { coffee: 1 } },
    enemies: [E('rockrat'), E('rockrat'), E('rockrat')]
  },
  crawler: {
    bg: 'mine_deep', intro: 'A tunnel crawler rears up from the old camp, a rock rat riding on its back like a bad idea.',
    flag: 'crawler_cleared', reward: { chits: 950, items: { curry: 1 } },
    enemies: [E('heavy', { name: 'Tunnel crawler', hp: 440, atk: 37, def: 12, xp: 95 }), E('rockrat', { atk: 30 })]
  },
  labbots: {
    bg: 'lab', intro: 'Cleaning drones, reprogrammed by someone with a grudge. They have decided you are a spill.',
    flag: 'labbots_cleared', reward: { chits: 1000, items: { coffee: 2 } },
    enemies: [E('labdrone', { name: 'Cleaning drone', hp: 160, atk: 30 }), E('labdrone', { name: 'Cleaning drone', hp: 160, atk: 30 }), E('labdrone', { name: 'Cleaning drone', hp: 160, atk: 30 })]
  },
  moths: {
    bg: 'dome', intro: 'A cloud of frost moths lifts off a frozen tree. They are very beautiful and very bitey.',
    flag: 'moths_cleared', reward: { chits: 1100, items: { curry: 1 } },
    enemies: [E('moth'), E('moth', { name: 'Frost queen', hp: 260, atk: 35, def: 7, xp: 80 }), E('moth')]
  },
  ushers: {
    bg: 'titan', intro: "Nocturne's ushers. Velvet ropes, velvet jackets, brass knuckles. 'Tickets, please.'",
    flag: 'ushers_cleared', reward: { chits: 1300, items: { curry: 1, coffee: 1 } },
    enemies: [E('usher'), E('usher', { name: 'Head usher', hp: 320, atk: 41 }), E('usher')]
  },
  // ---- Act 3: Cygnus under lockdown ----
  collectors: {
    bg: 'lockdown', intro: "Collectors. Three of them, and the Hi-Hat's whole crew is on their shopping list.",
    reward: { chits: 900, items: { curry: 1 } },
    enemies: [E('collector'), E('sharpshooter'), E('bruiser')]
  },
  helixsec: {
    bg: 'helix', intro: "Helix security in pressed grey uniforms. 'The Director is not taking visitors. Or prisoners.'",
    flag: 'helixsec_cleared', reward: { chits: 1100, items: { patch: 1 } },
    enemies: [E('helixguard'), E('helixguard', { name: 'Helix shift lead', hp: 340, atk: 40 })]
  },
  helixpatrol: {
    bg: 'helix', intro: 'A Helix security patrol. Their tagging darts are already loaded.',
    reward: { chits: 800, items: { coffee: 1 } },
    enemies: [E('helixguard'), E('helixguard')]
  },
  // Silas Crane, the Metronome: he counts in, then lands a downbeat on everyone. Hits on the beat throw his count off.
  // "assists": who stands with you changes the fight (see ui/battle.js).
  metronome: {
    bg: 'helix', bounty: 'metronome', assists: true,
    intro: "Silas Crane taps his pistol against his leg: tick, tick, tick. 'Four bars, Captain. Then I collect.'",
    noRun: "Crane has the lift and the stairs covered. There's only one way out, and it's through him.",
    enemies: [
      E('collector', { name: 'Collector' }),
      { id: 'crane', name: 'Silas Crane', hp: 1250, atk: 41, def: 12, boss: true, ai: 'metronome', xp: 450, weakTo: ['blunt'], resists: ['shot'] },
      E('sharpshooter')
    ]
  },
  // Brushes' holo-rehearsal on the Hi-Hat: repeatable, grows with the crew, XP only.
  rehearsal: {
    bg: 'lounge', intro: 'Brushes projects a holo-band into the lounge. "Practice makes perfect! Or at least makes slightly less bad."',
    scale: true, xpRate: .6, reward: { chits: 0 },
    enemies: [E('holo', { name: 'Holo-drummer' }), E('holo', { name: 'Holo-bassist', hp: 60, weakTo: ['shot'] })]
  }
};
