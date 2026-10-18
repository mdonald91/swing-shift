// Odd jobs: the second tier of the bounty board. Short, repeatable work between Tracks.
//   kind fight:   a marker appears on the map; talk to it to start a fight that grows with your crew
//   kind deliver: pick something up from one person and take it to another
//   needs:        a flag that has to be set before the job is offered (somewhere you've been)
//   pay:          chits at level 1; more is added for each crew level (see systems/jobs.js)
//   rep:          standing with a faction when it's done
// Fight enemies are written at level-1 strength and scale like Brushes' rehearsal.
export const JOBS = [
  {
    id: 'cargo_rats', who: 'ozzie', kind: 'fight', title: 'Rats in the cargo', client: 'Ozzie Banda', where: 'Dock 9',
    needs: 'velvet_done', map: 'docks', at: { x: 20, y: 11, look: 'drone', face: 'down' },
    desc: "Rock rats chewed into a shipment of noodle seasoning. Ozzie would like them gone, and the seasoning back.",
    marker: 'A nest of rock rats is gnawing on a pallet marked SEASONING: DO NOT GNAW.',
    enc: { bg: 'docks', intro: 'The rock rats turn as one. One of them is wearing a noodle like a scarf.',
      enemies: [{ id: 'drone', name: 'Rock rat', hp: 55, atk: 12, def: 2, xp: 16, weakTo: ['blunt'], machine: true, word: 'SKRITCH!', verb: 'gnaws at' },
        { id: 'drone', name: 'Rock rat', hp: 55, atk: 12, def: 2, xp: 16, weakTo: ['blunt'], machine: true, word: 'SKRITCH!', verb: 'gnaws at' },
        { id: 'drone', name: 'Rock rat', hp: 55, atk: 12, def: 2, xp: 16, weakTo: ['blunt'], machine: true, word: 'SKRITCH!', verb: 'gnaws at' }] },
    pay: 250, scrap: 4, rep: { docks: 1 }
  },
  {
    id: 'debt_collectors', who: 'chef', kind: 'fight', title: 'Debt collectors', client: 'Chef Ama', where: 'Cygnus Station',
    needs: 'cygnus_arrived', map: 'cygnus', at: { x: 22, y: 5, look: 'gunman', face: 'left' },
    desc: "Two heavies keep 'collecting' from Neon Noodle. Chef Ama owes them nothing. Explain that to them.",
    marker: "Two heavies are leaning on Chef Ama's stall. Their invoice is a baseball bat.",
    enc: { bg: 'station', intro: "The collectors crack their knuckles. 'Payment's due, hunter. Yours too.'",
      enemies: [{ id: 'gunman', name: 'Collector', hp: 80, atk: 15, def: 3, xp: 20, weakTo: ['stun', 'blunt'], word: 'WHUD!' },
        { id: 'gunman', name: 'Collector', hp: 80, atk: 15, def: 3, xp: 20, weakTo: ['stun', 'blunt'], word: 'WHUD!' }] },
    pay: 300, scrap: 1, rep: { docks: 1 }
  },
  {
    id: 'runaway_loader', who: 'goon', kind: 'fight', title: 'Runaway loader', client: 'Dock 9 harbourmaster', where: 'Dock 9',
    needs: 'velvet_done', map: 'docks', at: { x: 8, y: 3, look: 'mech', face: 'down' },
    desc: 'A cargo loader rebooted itself in the middle of the night and has been rearranging containers by colour.',
    marker: 'The loader is stacking containers by colour. It has run out of colours and started on people.',
    enc: { bg: 'docks', intro: 'The loader turns, slowly, and decides you are blue.',
      enemies: [{ id: 'mech', name: 'Runaway loader', hp: 150, atk: 17, def: 7, xp: 40, weakTo: ['shock'], resists: ['shot'], machine: true, word: 'KRUNCH!', verb: 'slams' }] },
    pay: 320, scrap: 6, rep: { docks: 1 }
  },
  {
    id: 'claim_dispute', who: 'pell', kind: 'fight', title: 'Claim dispute', client: 'Vesta market council', where: 'Vesta',
    needs: 'vesta_arrived', map: 'vesta', at: { x: 20, y: 9, look: 'scav', face: 'left' },
    desc: 'Two prospectors are settling a claim dispute with fists in the middle of the market. Settle it for them.',
    marker: "Two prospectors are mid-punch. They both stop to glare at you, which is progress.",
    enc: { bg: 'vesta', intro: "The prospectors agree on one thing at last: they don't like you.",
      enemies: [{ id: 'scav', name: 'Prospector', hp: 85, atk: 15, def: 3, xp: 20, weakTo: ['shot'], word: 'THUNK!' },
        { id: 'hacker', name: 'Claim lawyer', hp: 60, atk: 13, def: 2, xp: 20, weakTo: ['shot'], resists: ['shock'], ai: 'hacker', word: 'OBJECTION' }] },
    pay: 330, scrap: 1, rep: { office: 1 }
  },
  {
    id: 'helix_snoops', who: 'mags', kind: 'fight', title: 'Signal snoops', client: 'Mags, the Flat Ninth', where: 'Cygnus Station',
    needs: 'ghost_done', map: 'cygnus', at: { x: 4, y: 6, look: 'hacker', face: 'right' },
    desc: "Someone's set up a listening post outside the Flat Ninth. Mags would like it, and them, removed.",
    marker: 'A hacker in a Helix-grey hoodie is tuning an antenna at the bar. A drone hovers beside them.',
    enc: { bg: 'station', intro: "'This frequency is private property,' says the hacker. The drone agrees, loudly.",
      enemies: [{ id: 'hacker', name: 'Snoop', hp: 65, atk: 14, def: 2, xp: 22, weakTo: ['shot'], resists: ['shock'], ai: 'hacker', word: 'GLITCH' },
        { id: 'drone', name: 'Snoop drone', hp: 70, atk: 14, def: 3, xp: 22, weakTo: ['shock'], machine: true, word: 'ZZT!', verb: 'fires a stun bolt at' }] },
    pay: 340, scrap: 3, rep: { helix: -1, office: 1 }
  },
  {
    id: 'spoil_heap', who: 'okada', kind: 'fight', title: 'Spoil heap', client: 'Foreman Okada', where: 'Targon',
    needs: 'targon_arrived', map: 'targon', at: { x: 12, y: 13, look: 'drone', face: 'right' },
    desc: 'The rock rats are back. They always come back. Okada pays by the rat.',
    marker: 'A fresh nest of rock rats, and one mine bot that has decided it is their mum.',
    enc: { bg: 'mine', intro: 'The mine bot whirs protectively. The rock rats chitter in four-four time.',
      enemies: [{ id: 'drone', name: 'Rock rat', hp: 55, atk: 12, def: 2, xp: 16, weakTo: ['blunt'], machine: true, word: 'SKRITCH!', verb: 'gnaws at' },
        { id: 'mech', name: 'Mine bot', hp: 110, atk: 16, def: 6, xp: 30, weakTo: ['shock'], resists: ['blunt'], machine: true, word: 'GRRZZK!', verb: 'drills into' },
        { id: 'drone', name: 'Rock rat', hp: 55, atk: 12, def: 2, xp: 16, weakTo: ['blunt'], machine: true, word: 'SKRITCH!', verb: 'gnaws at' }] },
    pay: 360, scrap: 7, rep: {}
  },
  {
    id: 'cold_storage', who: 'sato', kind: 'fight', title: 'Cold storage', client: 'Dr Imani Sato', where: 'Nyx',
    needs: 'nyx_arrived', map: 'nyx', at: { x: 20, y: 13, look: 'drone', face: 'up' },
    desc: "Something in Nyx's cold storage has learned to open its own tank. Dr Sato would like it to unlearn that.",
    marker: 'A specimen drone, a cleaning bot and something with far too many leaves are having a meeting by the tanks.',
    enc: { bg: 'lab', intro: 'The thing with leaves rattles. The drones take that as an order.',
      enemies: [{ id: 'drone', name: 'Specimen drone', hp: 70, atk: 14, def: 3, xp: 22, weakTo: ['shock'], machine: true, word: 'ZZT!', verb: 'fires a stun bolt at' },
        { id: 'holo', name: 'Leafy thing', hp: 95, atk: 15, def: 2, xp: 26, weakTo: ['shot'], resists: ['blunt'], word: 'THWAP', verb: 'slaps' }] },
    pay: 360, scrap: 3, rep: { office: 1 }
  },
  {
    id: 'noodle_run', who: 'ozzie', kind: 'deliver', title: 'Noodle run', client: 'Ozzie Banda', where: 'Dock 9 to Cygnus Station',
    needs: 'cygnus_arrived', from: { npc: 'ozzie', map: 'docks' }, to: { npc: 'chef', map: 'cygnus' },
    desc: "Ozzie's got a crate of Ganymede chilli oil for Chef Ama. It's urgent. It's also slightly on fire.",
    pickup: "Here. Hold it by the handles, not the lid. Definitely not the lid. Chef Ama's at the noodle stand on Cygnus.",
    drop: "Ozzie's chilli oil! Wonderful. It will make the curry illegal in three systems. Here, for your trouble.",
    item: 'a smoking crate of chilli oil', pay: 220, scrap: 0, rep: { docks: 1 }, gift: { curry: 1 }
  },
  {
    id: 'sealed_letter', who: 'pell', kind: 'deliver', title: 'A sealed letter', client: 'Pell', where: 'Vesta to the Flat Ninth',
    needs: 'vesta_arrived', from: { npc: 'pell', map: 'vesta' }, to: { npc: 'mags', map: 'bar' },
    desc: "Pell needs a letter carried to Mags at the Flat Ninth. He won't say what's in it. He's smiling about it.",
    pickup: "Do not open it. Do not read it. Do not let it get wet. Mags will know if you did any of those things.",
    drop: "From Pell? ...Oh, that man. It's a recipe. For a cocktail. He's been trying to beat my Blue Seventh for years. Drinks are on him.",
    item: "Pell's sealed letter", pay: 240, scrap: 0, rep: {}, gift: { coffee: 2 }
  },
  {
    id: 'spare_parts', who: 'okada', kind: 'deliver', title: 'Spare parts', client: 'Foreman Okada', where: 'Targon to Dock 9',
    needs: 'targon_arrived', from: { npc: 'okada', map: 'targon' }, to: { npc: 'ozzie', map: 'docks' },
    desc: "Okada owes Ozzie a box of drill bits from a card game. He'd like you to deliver them before he changes his mind.",
    pickup: "Drill bits. Ozzie won them off me at cards, fair and square. Mostly fair. Take them before I change my mind.",
    drop: "Okada paid up? I'll be. Tell him he still owes me a rematch. Here, a little something for the courier.",
    item: 'a box of drill bits', pay: 260, scrap: 3, rep: { docks: 1 }
  }
];

// Rook's side story: a special job that appears once he's told you about his old partner.
export const STORY_JOBS = [
  {
    id: 'old_partner', who: 'rook', kind: 'story', title: 'Old partner', client: 'Anonymous, Bounty Office board', where: 'Cygnus Station',
    needs: 'rook_s1', done: 'rook_s2', map: 'cygnus', at: { x: 24, y: 8, look: 'cass', face: 'left', id: 'cass' },
    desc: "Wanted: Cass Marlowe, ex-marshal. 5,000 chits, no questions asked. Rook went very quiet when he saw this.",
    pay: 0, scrap: 0, rep: {}
  }
];
