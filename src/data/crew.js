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
  jumpers: { name: 'Claim jumpers', short: 'Claim jumper', color: 'var(--smoke)', blip: 210 },
  // Targon
  ferro: { name: 'Dagny Ferro', short: 'Ferro', color: 'var(--mustard)', blip: 190 },
  okada: { name: 'Foreman Okada', short: 'Okada', color: 'var(--crimson)', blip: 170 },
  mantis: { name: 'The Iron Mantis', short: 'Mantis', color: 'var(--crimson)', blip: 90 },
  minebots: { name: 'Mine bots', short: 'Mine bot', color: 'var(--crimson)', blip: 700 },
  rockrats: { name: 'Rock rats', short: 'Rock rat', color: 'var(--crimson)', blip: 800 },
  crawler: { name: 'Tunnel crawler', short: 'Crawler', color: 'var(--crimson)', blip: 120 },
  // 0.11
  cass: { name: 'Cass Marlowe', short: 'Cass', color: 'var(--violet)', blip: 340 },
  dutch: { name: 'Dutch', short: 'Dutch', color: 'var(--smoke)', blip: 150 },
  pip: { name: 'Pip', short: 'Pip', color: 'var(--mustard)', blip: 600 },
  job: { name: 'Odd job', short: 'Odd job', color: 'var(--teal)', blip: 300 },
  // 0.12: Nyx
  lyra: { name: 'Lyra', short: 'Lyra', role: 'Runaway prototype', color: '#9fd6e8', blip: 640,
    bio: 'Prototype L-7 from Nyx. Trained to conduct a network of machines. Prefers to improvise, like her big brother.', skillKeys: ['harmonize', 'resonance'] },
  sato: { name: 'Dr Imani Sato', short: 'Dr Sato', color: 'var(--cream)', blip: 420 },
  labsec: { name: 'Lab security', short: 'Security', color: 'var(--crimson)', blip: 130 },
  labbots: { name: 'Cleaning drones', short: 'Cleaning drone', color: 'var(--crimson)', blip: 820 },
  moths: { name: 'Frost moths', short: 'Frost moth', color: '#9fd6e8', blip: 900 },
  sentinel: { name: 'The Sentinel', short: 'Sentinel', color: 'var(--crimson)', blip: 110 },
  // 0.13: Titan
  nocturne: { name: 'Mister Nocturne', short: 'Nocturne', color: '#c79bf0', blip: 240 },
  fitz: { name: 'Fitz', short: 'Fitz', color: 'var(--mustard)', blip: 360 },
  tickets: { name: 'Box office', short: 'Box office', color: 'var(--cream)', blip: 500 },
  ushers: { name: "Nocturne's ushers", short: 'Usher', color: 'var(--smoke)', blip: 190 },
  // 0.14: Act 3
  crane: { name: 'Silas Crane', short: 'Crane', color: 'var(--crimson)', blip: 160 },
  marshal: { name: 'Marshal Okoro', short: 'Marshal', color: 'var(--mustard)', blip: 230 },
  benny: { name: 'Benny Banda', short: 'Benny', color: 'var(--mustard)', blip: 320 },
  helixsec: { name: 'Helix security', short: 'Helix guard', color: 'var(--smoke)', blip: 180 },
  collector: { name: 'Collector', short: 'Collector', color: 'var(--crimson)', blip: 210 },
  // 0.16: Last Set
  ambrose: { name: 'Ambrose Hale', short: 'Ambrose', color: 'var(--crimson)', blip: 110 },
  // 0.15: Blue Note
  listener: { name: 'Listener drone', short: 'Listener', color: '#5fb8ff', blip: 880 },
  receptionist: { name: 'Receptionist', short: 'Receptionist', color: 'var(--cream)', blip: 600 },
  clockwork: { name: 'Clockwork player', short: 'Clockwork player', color: 'var(--mustard)', blip: 700 }
};

// What the captain brings to a fight, based on temperament.
export const CAPTAIN_ROLES = {
  Calm: { role: 'Negotiator', skills: ['Steady Aim', 'Talk Down'] },
  Sarcastic: { role: 'Trickster', skills: ['Cheap Shot', 'Heckle'] },
  Idealistic: { role: 'Vanguard', skills: ['Rally', 'Cover Fire'] },
  Ruthless: { role: 'Enforcer', skills: ['Execution', 'Intimidate'] }
};
