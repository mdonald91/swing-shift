// Crew roster. Stats are placeholders until the combat build tunes them.
export const CREW = {
  rook: { name: 'Rook Calloway', short: 'Rook', role: 'Gunslinger', color: 'var(--teal)', blip: 260,
    hp: 120, sp: 40, bio: 'Fastest draw on the Hi-Hat. Slowest to get off the couch.', skills: ['Quick Draw', 'Ricochet'] },
  tam: { name: 'Tam Okafor', short: 'Tam', role: 'Mechanic', color: 'var(--crimson)', blip: 420,
    hp: 105, sp: 60, bio: 'Keeps the ship flying with a wrench, tape and spite.', skills: ['Patch Job', 'Overclock'] },
  brushes: { name: 'Brushes', short: 'Brushes', role: 'Ship drone', color: 'var(--mustard)', blip: 720,
    hp: 85, sp: 70, bio: 'Ship AI in a flying drum kit. Counts everyone in.', skills: ['Static Brush', 'Jam Signal'] },
  velvet: { name: 'Velvet Moreau', short: 'Velvet', color: 'var(--violet)', blip: 360 },
  goon: { name: 'Dock Goon', short: 'Goon', color: 'var(--smoke)', blip: 180 },
  ozzie: { name: 'Ozzie Banda', short: 'Ozzie', color: 'var(--mustard)', blip: 300 }
};

// What the captain brings to a fight, based on temperament.
export const CAPTAIN_ROLES = {
  Calm: { role: 'Negotiator', skills: ['Steady Aim', 'Talk Down'] },
  Sarcastic: { role: 'Trickster', skills: ['Cheap Shot', 'Heckle'] },
  Idealistic: { role: 'Vanguard', skills: ['Rally', 'Cover Fire'] },
  Ruthless: { role: 'Enforcer', skills: ['Execution', 'Intimidate'] }
};
