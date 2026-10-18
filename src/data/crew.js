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
  hale: { name: 'Director Hale', short: 'Hale', color: 'var(--cream)', blip: 330 },
  chef: { name: 'Chef Ama', short: 'Chef Ama', color: 'var(--crimson)', blip: 400 },
  kessler: { name: 'Kessler', short: 'Kessler', color: 'var(--mustard)', blip: 240 },
  rhea: { name: 'Rhea Vance', short: 'Rhea', role: 'Signals specialist', color: 'var(--teal)', blip: 460,
    bio: 'Ex-Helix comms tech. Speaks fluent relay, sarcasm and three kinds of static.', skillKeys: ['tap', 'feedback'] },
  juno: { name: 'Juno Reyes', short: 'Juno', color: 'var(--smoke)', blip: 520 },
  drone: { name: 'Security drone', short: 'Drone', color: 'var(--crimson)', blip: 900 },
  warden: { name: 'The Warden', short: 'Warden', color: 'var(--crimson)', blip: 120 },
  wren: { name: 'Wren Castillo', short: 'Wren', color: 'var(--mustard)', blip: 480 },
  pell: { name: 'Pell', short: 'Pell', color: 'var(--violet)', blip: 300 },
  fennick: { name: 'Fennick', short: 'Fennick', color: 'var(--smoke)', blip: 220 },
  sable: { name: 'Sable', short: 'Sable', color: 'var(--crimson)', blip: 560 },
  vox: { name: 'Vox', short: 'Vox', color: 'var(--teal)', blip: 150 },
  quill: { name: 'Mr Quill', short: 'Quill', color: 'var(--cream)', blip: 380 },
  scav: { name: 'Tunnel scavenger', short: 'Scavenger', color: 'var(--smoke)', blip: 200 },
  conductor: { name: 'The Conductor', short: '???', color: 'var(--crimson)', blip: 110 },
  smugglers: { name: 'Smugglers', short: 'Smuggler', color: 'var(--smoke)', blip: 200 },
  loader: { name: 'Rogue loader', short: 'Loader', color: 'var(--crimson)', blip: 120 },
  alley: { name: 'Hired guns', short: 'Hired gun', color: 'var(--smoke)', blip: 260 },
  maint: { name: 'Maintenance mech', short: 'Mech', color: 'var(--crimson)', blip: 120 },
  jumpers: { name: 'Claim jumpers', short: 'Claim jumper', color: 'var(--smoke)', blip: 210 }
};

// What the captain brings to a fight, based on temperament.
export const CAPTAIN_ROLES = {
  Calm: { role: 'Negotiator', skills: ['Steady Aim', 'Talk Down'] },
  Sarcastic: { role: 'Trickster', skills: ['Cheap Shot', 'Heckle'] },
  Idealistic: { role: 'Vanguard', skills: ['Rally', 'Cover Fire'] },
  Ruthless: { role: 'Enforcer', skills: ['Execution', 'Intimidate'] }
};
