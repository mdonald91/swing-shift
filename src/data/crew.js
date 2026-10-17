// Crew roster. Stats are placeholders until the combat build tunes them.
export const CREW = {
  rook: { name: 'Rook Calloway', short: 'Rook', role: 'Gunslinger', color: 'var(--teal)', blip: 260,
    hp: 120, sp: 40, bio: 'Fastest draw on the Hi-Hat. Slowest to get off the couch.', skills: ['Quick Draw', 'Ricochet'], skillKeys: ['quickdraw', 'ricochet'] },
  tam: { name: 'Tam Okafor', short: 'Tam', role: 'Mechanic', color: 'var(--crimson)', blip: 420,
    hp: 105, sp: 60, bio: 'Keeps the ship flying with a wrench, tape and spite.', skills: ['Patch Job', 'Overclock'], skillKeys: ['patch', 'overclock'] },
  brushes: { name: 'Brushes', short: 'Brushes', role: 'Ship drone', color: 'var(--mustard)', blip: 720,
    hp: 85, sp: 70, bio: 'Ship AI in a flying drum kit. Counts everyone in.', skills: ['Static Brush', 'Jam Signal'], skillKeys: ['static', 'jamsignal'] },
  velvet: { name: 'Velvet Moreau', short: 'Velvet', color: 'var(--violet)', blip: 360 },
  goon: { name: 'Dock Goon', short: 'Goon', color: 'var(--smoke)', blip: 180 },
  ozzie: { name: 'Ozzie Banda', short: 'Ozzie', color: 'var(--mustard)', blip: 300 },
  sax: { name: 'Old Sol', short: 'Old Sol', color: 'var(--crimson)', blip: 200 },
  mags: { name: 'Mags', short: 'Mags', color: 'var(--violet)', blip: 380 },
  lou: { name: 'Lou', short: 'Lou', color: 'var(--teal)', blip: 280 },
  rhea: { name: 'Rhea Vance', short: 'Rhea', color: 'var(--teal)', blip: 460 },
  hale: { name: 'Director Hale', short: 'Hale', color: 'var(--cream)', blip: 330 },
  chef: { name: 'Chef Ama', short: 'Chef Ama', color: 'var(--crimson)', blip: 400 },
  kessler: { name: 'Kessler', short: 'Kessler', color: 'var(--mustard)', blip: 240 }
};

// What the captain brings to a fight, based on temperament.
export const CAPTAIN_ROLES = {
  Calm: { role: 'Negotiator', skills: ['Steady Aim', 'Talk Down'] },
  Sarcastic: { role: 'Trickster', skills: ['Cheap Shot', 'Heckle'] },
  Idealistic: { role: 'Vanguard', skills: ['Rally', 'Cover Fire'] },
  Ruthless: { role: 'Enforcer', skills: ['Execution', 'Intimidate'] }
};
