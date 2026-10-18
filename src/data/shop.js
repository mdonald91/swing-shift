// Shops, gear upgrades and factions.

// Gear is bought once and stays with the crew. who: captain | rook | tam | brushes | all
export const GEAR = [
  { id: 'barrel', n: 'Long-barrel pistol', who: 'captain', atk: 3, price: 1500, d: '+3 ATK for the captain' },
  { id: 'grips', n: 'Custom grips', who: 'rook', atk: 3, price: 1400, d: "+3 ATK for Rook" },
  { id: 'wrench', n: 'Titanium wrench', who: 'tam', atk: 3, price: 1200, d: '+3 ATK for Tam' },
  { id: 'carbon', n: 'Carbon-fibre brushes', who: 'brushes', atk: 3, price: 1100, d: '+3 ATK for Brushes' },
  { id: 'vests', n: 'Flak vests', who: 'all', def: 2, price: 2600, d: '+2 DEF for the whole crew' },
  { id: 'amp', n: 'Pocket amp', who: 'all', groove: 25, price: 2200, d: 'Start every fight with 25 Groove' },
  // Kessler's Outfitters on Cygnus Station
  { id: 'coat', n: 'Armoured longcoat', who: 'captain', def: 3, price: 2200, d: '+3 DEF for the captain' },
  { id: 'scope', n: 'Ricochet scope', who: 'rook', atk: 4, price: 2800, d: '+4 ATK for Rook' },
  { id: 'servo', n: 'Servo wrench', who: 'tam', atk: 4, price: 2600, d: '+4 ATK for Tam' },
  { id: 'tuner', n: 'Resonance tuner', who: 'brushes', atk: 4, price: 2400, d: '+4 ATK for Brushes' },
  { id: 'metronome', n: 'Pocket metronome', who: 'all', window: .05, price: 3000, d: 'A more forgiving beat window for every attack' },
  // gifts, never sold
  { id: 'ferrokit', n: "Ferro's toolkit", who: 'tam', atk: 3, def: 2, price: 0, gift: true, d: '+3 ATK and +2 DEF for Tam. Her mentor\'s own tools.' }
];

export const SHOPS = {
  supply: {
    name: 'Supply terminal', jp: '補給', keeper: 'tam',
    greet: 'Order anything you like. Delivery is by drone. The drone is Brushes.',
    items: ['noodle', 'coffee', 'patch'],
    gear: ['barrel', 'grips', 'wrench', 'carbon', 'vests', 'amp']
  },
  ozzie: {
    name: "Ozzie's stall", jp: '屋台', keeper: 'ozzie',
    greet: "Dockworker prices. Cheap, and please don't ask where it fell off.",
    items: ['noodle', 'coffee', 'patch'],
    gear: [],
    discount: { rep: 'docks', min: 2, off: .2 }   // 20% off once the Dockworkers trust you
  },
  outfitters: {
    name: "Kessler's Outfitters", jp: '装備屋', keeper: 'kessler',
    greet: "Everything here is legal on at least one moon. Pay in chits, not stories.",
    items: ['patch', 'curry'],
    gear: ['coat', 'scope', 'servo', 'tuner', 'metronome', 'vests', 'amp']
  },
  stand: {
    name: 'Neon Noodle', jp: 'ネオン麺', keeper: 'chef',
    greet: 'Hot food for cold hunters. The curry is famous. The noodles are infamous.',
    items: ['noodle', 'coffee', 'curry'],
    gear: []
  }
};

export const FACTIONS = {
  office: { n: 'Bounty Office', d: 'Licences, contracts and paperwork. Pays on time, mostly.' },
  docks: { n: 'Ganymede Dockworkers', d: 'Ozzie and friends. They notice who treats them right.' },
  helix: { n: 'Helix Salvage', d: 'The client behind Ghost Frequency. Quiet, rich, a little strange.' }
};

export const TIERS = [
  { min: -99, n: 'Distrusted' }, { min: 0, n: 'Unknown' }, { min: 1, n: 'Familiar' }, { min: 3, n: 'Trusted' }, { min: 5, n: 'Respected' }
];
export function tier(v) { return [...TIERS].reverse().find(t => v >= t.min).n; }
