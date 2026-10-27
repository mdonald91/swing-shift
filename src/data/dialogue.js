// All conversations. Each entry is a list of steps, run in order:
//   { who: 'tam', t: 'Line of dialogue' }        someone speaks ('player', a crew id, or null for narration)
//   { who: 'rook', pick: ['a', 'b'] }            a random line from the list
//   { choices: [ { t, temp, go, set, if, ifNot } ] }   numbered choices; "temp" shows only for that temperament
//   { set: 'flag' }                              remember something
//   { do: 'action' }                             run something from ACTIONS in ui/dialog.js
//   { go: 'node' }                               jump to another conversation
//   if / ifNot on any step: only run it when a flag is (or isn't) set
// {name} is replaced with the captain's name.

// Which conversation starts when you talk to someone or use something.
// Crew with a new side chat waiting (shown as a speech bubble over their head).
export function chatAvailable(id, flags, location) {
  if (location !== 'ship' || !flags.velvet_done) return false;
  if (id === 'rook' && flags.chat_rook && flags.act1_done && !flags.rook_s1) return true;     // Rook's old partner
  if (id === 'brushes' && flags.chat_brushes && flags.proto_done && !flags.brushes_s2) return true;   // Brushes' origin
  return ['rook', 'tam', 'brushes'].includes(id) && !flags['chat_' + id];
}

export function entry(id, flags, location) {
  const docks = location === 'docks';
  if (chatAvailable(id, flags, location)) return id === 'rook' && flags.chat_rook ? 'rook_partner' : id === 'brushes' && flags.chat_brushes ? 'brushes_origin' : id + '_chat';
  const deep = location === 'targon_deep';
  switch (id) {
    case 'rook': return docks ? 'rook_docks' : flags.rook_s1 && !flags.rook_s2 ? 'rook_waiting' : flags.rook_s2 ? 'rook_after2' : flags.velvet_done ? 'rook_after' : flags.met_rook ? 'rook_idle' : 'rook_first';
    case 'cass': return location === 'cygnus_lock' ? 'cass_lock' : 'cass';
    case 'hale': return location === 'bn_ring' ? 'hale_bn' : 'hale';
    // ---- Nyx ----
    case 'sato': return flags.proto_done ? 'sato_done' : flags.met_sato ? 'sato_idle' : 'sato';
    case 'lyra': return location === 'titan' ? 'lyra_titan' : location === 'ship' ? 'lyra_ship' : flags.lyra_met ? 'lyra_wait' : 'lyra_first';
    case 'dome_door': return flags.nyx_dome_open ? 'dome_enter' : flags.labsec_cleared ? 'dome_lock' : 'dome_guarded';
    case 'dome_cache': return flags.dome_cache ? 'dome_cache_done' : 'dome_cache';
    case 'dutch': return 'dutch';
    case 'pip': return 'pip';
    case 'tam':
      if (location === 'targon') return flags.tg_photo ? 'tam_site_after' : 'tam_site';
      if (location === 'lyceum') return 'tam_lyceum';
      if (location === 'ship' && flags.bounty_mantis && !flags.mantis_done) return 'tam_targon';
      return location === 'vesta' ? 'tam_vesta' : docks ? 'tam_docks' : flags.velvet_done ? 'tam_after' : flags.met_tam ? 'tam_idle' : 'tam_first';
    case 'brushes': return location === 'nyx' ? 'brushes_nyx' : deep ? 'brushes_deep' : location === 'relay' ? 'brushes_relay' : flags.velvet_done ? 'brushes_after' : flags.met_brushes ? 'brushes_idle' : 'brushes_first';
    case 'ozzie': return flags.met_ozzie ? 'ozzie_idle' : 'ozzie_first';
    case 'cockpit':
      if (flags.velvet_done) return 'cockpit_nav';
      if (flags.velvet_course) return 'cockpit_return';
      return flags.bounty_velvet ? 'cockpit_go' : 'cockpit_none';
    case 'sax':
      if (flags.bounty_nocturne && !flags.sol_story) return 'sol_story';
      if (location === 'titan') return 'sol_titan';
      return flags.busked_visit ? 'sax_after' : 'sax';
    case 'lift_lever': return flags.nocturne_done ? 'lift_lever_done' : 'lift_lever';
    case 'fitz': return flags.heist_ready ? 'fitz_idle' : 'fitz';
    case 'stage_door': return flags.nocturne_done ? 'stage_door_done' : flags.heist_ready ? 'stage_door' : 'stage_door_locked';
    case 'rhea':
      if (location === 'relay') return 'rhea_relay';
      if (location === 'vesta') return 'rhea_vesta';
      if (location === 'targon') return 'rhea_targon';
      if (location === 'nyx') return 'rhea_nyx';
      if (location === 'titan') return 'rhea_titan';
      if (location === 'bn_spine') return 'bn_rhea';
      if (location === 'ship') return 'rhea_ship';
      return flags.rhea_met ? 'rhea_idle' : 'rhea_first';
    case 'drone': return 'drones';
    case 'juno': return 'juno';
    case 'pell': return flags.tail_done ? 'pell_idle' : flags.met_pell ? 'pell_retry' : 'pell_first';
    case 'wren': return 'wren';
    case 'quill': return location === 'helix_hq' ? 'quill_hq' : 'quill';
    case 'scav': return 'scavs';
    case 'chest_vesta': return flags.vesta_chest ? 'chest_vesta_done' : flags.scavs_cleared ? 'chest_vesta' : 'chest_vesta_blocked';
    case 'door_hideout': return flags.tail_done ? 'door_hideout_open' : 'door_hideout';
    case 'generator': return flags.power_on ? 'generator_done' : 'generator';
    case 'lockers': return flags.k17_keycard ? 'lockers_done' : flags.power_on ? 'lockers' : 'lockers_dark';
    case 'cryo': return flags.cryo_found ? 'cryo_done' : 'cryo';
    case 'helix': return flags.metronome_done ? 'helix_sealed' : flags.ghost_offered ? 'helix_again' : 'helix';
    case 'door': return flags.velvet_done ? 'door_done' : flags.door_open ? 'door_open' : 'door_locked';
    // ---- Targon ----
    case 'okada': return flags.mantis_done ? 'okada_done' : flags.met_okada ? 'okada_idle' : 'okada';
    case 'tg_photo': return flags.tg_photo ? 'tg_photo_again' : 'tg_photo';
    case 'junction_top': return flags.tg_power1 ? 'junction_done' : 'junction_top';
    case 'lift_top': return flags.tg_power1 ? 'lift_top' : 'lift_dead';
    case 'junction_deep': return flags.tg_lights ? 'junction_done' : flags.minebots_cleared ? 'junction_deep' : 'junction_deep_blocked';
    case 'tg_cart': return flags.tg_lights ? 'tg_cart' : 'tg_cart_dead';
    case 'tg_cache': return flags.tg_cache ? 'tg_cache_done' : 'tg_cache';
    case 'ferro': return location === 'cygnus_lock' ? 'ferro_lock' : flags.ferro_found ? 'ferro_idle' : 'ferro_first';
    case 'mantis': return flags.ferro_found ? 'mantis' : 'mantis_wait';
    default: return id;
  }
}

export const DIALOGUE = {
  intro: [
    { who: null, t: 'The Hi-Hat. Jupiter orbit, near Ganymede. 2:14 a.m., ship time.' },
    { who: null, t: 'Fuel: nine percent. Food: one egg. Morale: jazz.' },
    { who: 'brushes', t: "Captain {name}! You're awake. Excellent. We're broke." },
    { who: 'brushes', t: "Talk to the crew, then come and see me at the bounty board by the cockpit. I've found us something." },
    { set: 'intro_done' }
  ],

  rook_first: [
    { set: 'met_rook' },
    { who: 'rook', t: 'Captain. I was just resting my eyes. For six hours.' },
    { choices: [
      { t: 'Anything worth doing out there?', go: 'rook_work' },
      { t: 'Six hours. Personal best?', temp: 'Sarcastic', go: 'rook_sarc' },
      { t: "Rest up. I'll need you sharp later.", temp: 'Calm', go: 'rook_calm' },
      { t: 'Someone out there needs our help, Rook.', temp: 'Idealistic', go: 'rook_ideal' },
      { t: "Get up. We're out of food and out of excuses.", temp: 'Ruthless', go: 'rook_ruth' },
      { t: 'Never mind.' }
    ] }
  ],
  rook_work: [
    { who: 'rook', t: "Brushes found a counterfeiter on Ganymede. Pays well. Means I'd have to stand up, though." },
    { who: 'rook', t: "Wake me when we're there." }
  ],
  rook_sarc: [{ who: 'rook', t: 'Seven, last Tuesday. You missed a great nap. Truly historic.' }],
  rook_calm: [{ who: 'rook', t: "Sharp's a stretch. Present, maybe. Upright, probably." }],
  rook_ideal: [{ who: 'rook', t: "Someone out there needs a nap too. I'm helping them by example." }],
  rook_ruth: [{ who: 'rook', t: '...Getting up. Slowly. In protest.' }],
  rook_idle: [
    { who: 'rook', if: 'bounty_velvet', t: 'Velvet Moreau, huh? I hear she shoots better than she forges. Which is saying something.' },
    { who: 'rook', ifNot: 'bounty_velvet', pick: [
      'The couch and I have an understanding.',
      "Wake me when there's money.",
      'If Tam asks, I fixed the thing.',
      'Brushes keeps humming the same four bars. I think it wants a solo.'
    ] }
  ],

  tam_first: [
    { set: 'met_tam' },
    { who: 'tam', t: 'Morning, Cap. Good news: the engine works. Bad news: only when I hit it.' },
    { choices: [
      { t: "How's the ship holding up?", go: 'tam_ship' },
      { t: "We'll get her fixed properly. I promise.", temp: 'Idealistic', go: 'tam_ideal' },
      { t: 'Have you tried turning it off and on again?', temp: 'Sarcastic', go: 'tam_sarc' },
      { t: "One problem at a time. What's first?", temp: 'Calm', go: 'tam_calm' },
      { t: "If it can't fly, strip it for parts.", temp: 'Ruthless', go: 'tam_ruth' },
      { t: 'Carry on.' }
    ] }
  ],
  tam_ship: [
    { who: 'tam', t: "Fuel's at nine percent. The hull is held together with tape and spite. We need a paying job, today." },
    { who: 'tam', t: "And somebody keeps eating my noodles. I have suspects. One of them is a drone." }
  ],
  tam_ideal: [{ who: 'tam', t: 'You promised that last month. I still believe you. Barely.' }],
  tam_sarc: [{ who: 'tam', t: "I tried turning YOU off and on again. Didn't take." }],
  tam_calm: [{ who: 'tam', t: 'Fuel. Then food. Then the weird noise from the galley. In that order.' }],
  tam_ruth: [{ who: 'tam', t: 'Touch my engine and I strip YOU for parts, Captain.' }],
  tam_idle: [
    { who: 'tam', if: 'velvet_course', t: "Dock 9 is one jump away. I'll keep the engine purring. Or at least growling." },
    { who: 'tam', ifNot: 'velvet_course', pick: [
      "If you hear a bang, that's normal. If you hear two bangs, run.",
      "Gerald's looking good today. The plant, Cap. The plant is Gerald.",
      "Bring me back something shiny from the next job. Wiring, ideally."
    ] }
  ],

  brushes_first: [
    { set: 'met_brushes' },
    { who: 'brushes', t: 'Captain! Fridge report: one egg, half a lemon, and a frankly tragic amount of mustard.' },
    { choices: [
      { t: 'What did you find on the board?', go: 'brushes_board' },
      { t: "Count us in when it's time.", temp: 'Calm', go: 'brushes_calm' },
      { t: 'A tragic amount of mustard is my favourite amount.', temp: 'Sarcastic', go: 'brushes_sarc' },
      { t: "We'll stock that fridge properly, I swear.", temp: 'Idealistic', go: 'brushes_ideal' },
      { t: 'Sell the egg.', temp: 'Ruthless', go: 'brushes_ruth' },
      { t: "That's all." }
    ] }
  ],
  brushes_board: [
    { who: 'brushes', t: 'A live contract: Velvet Moreau, counterfeiter, last seen at Dock 9 on Ganymede. Fifteen thousand chits.' },
    { who: 'brushes', t: "The bounty board's right behind me. Accept it there and I'll plot a course." }
  ],
  brushes_calm: [{ who: 'brushes', t: "One, two, one-two-three-four. I'll save the rest for the big moment." }],
  brushes_sarc: [{ who: 'brushes', t: "Noted. Updating your file to 'concerning'." }],
  brushes_ideal: [{ who: 'brushes', t: "I've added it to the list. The list is very long, Captain." }],
  brushes_ruth: [{ who: 'brushes', t: 'Market value of one egg: four chits. Market value of your soul: still being assessed.' }],
  brushes_idle: [
    { who: 'brushes', if: 'velvet_course', t: "Dock 9 is waiting, Captain. The cockpit will take us back down whenever you're ready." },
    { who: 'brushes', if: 'bounty_velvet', ifNot: 'velvet_course', t: 'Contract accepted. Head to the cockpit and I will count us in.' },
    { who: 'brushes', ifNot: 'bounty_velvet', t: "The bounty board is right behind me. Velvet Moreau. Fifteen thousand chits. I'm just saying." }
  ],

  bed: [
    { who: null, t: 'Your bunk. The blanket smells faintly of engine grease and ambition.' },
    { choices: [
      { t: 'Rest and save', go: 'bed_save' },
      { t: 'Not now' }
    ] }
  ],
  bed_save: [
    { do: 'save' },
    { who: null, t: 'You sleep like someone with no fuel and no worries. Game saved.' }
  ],
  fridge: [
    { who: null, t: 'One egg. Half a lemon. Mustard, in quantities that suggest a cry for help.' },
    { who: null, if: 'met_tam', t: "A sticky note in Tam's handwriting: 'THESE NOODLES ARE COUNTED.'" }
  ],
  galley: [{ who: null, t: 'The galley. It makes a noise Tam calls "character". The kettle has a dent shaped like a fist.' }],
  couch: [{ who: null, t: "Rook's couch. There is a perfect Rook-shaped dent in it. Nobody else sits here." }],
  plant: [{ who: null, t: 'A potted ficus named Gerald. Tam talks to him more than to you.' }],
  table: [{ who: null, t: 'A deck of cards, three empty noodle cups and a chess game nobody remembers starting.' }],
  window: [{ who: null, t: 'Jupiter fills the porthole, orange and enormous. Somewhere down there, Ganymede is up to no good.' }],
  hatch: [{ who: null, t: "The airlock. Outside: vacuum, and a sign from Tam that says 'NO.'" }],

  cockpit_none: [
    { who: null, t: 'Ship systems. Fuel: 9%. Hull: held together with tape. Destination: none.' },
    { who: null, t: 'Accept a contract at the bounty board to plot a course.' }
  ],
  cockpit_go: [
    { who: null, t: 'Ship systems. Contract: Velvet Moreau. Course available: Ganymede, Dock 9.' },
    { choices: [
      { t: 'Fly to Dock 9', go: 'cockpit_plot' },
      { t: 'Not yet' }
    ] }
  ],
  cockpit_plot: [{ set: 'velvet_course' }, { do: 'depart' }],
  cockpit_return: [
    { who: null, t: 'Course stored: Ganymede, Dock 9.' },
    { choices: [
      { t: 'Fly back to Dock 9', go: 'cockpit_back' },
      { t: 'Not yet' }
    ] }
  ],
  cockpit_back: [{ do: 'toDocks' }],
  cockpit_nav: [
    { who: null, t: 'Ship systems. Fuel: 64%. Hull: patched with shoes. Where to, Captain?' },
    { choices: [
      { t: 'Cygnus Station', go: 'nav_cygnus' },
      { t: 'Dock 9, Ganymede', go: 'cockpit_back' },
      { t: 'Relay K-17', if: 'bounty_ghost', go: 'nav_k17' },
      { t: 'Vesta', if: 'bounty_courier', go: 'nav_vesta' },
      { t: 'Targon', if: 'bounty_mantis', go: 'nav_targon' },
      { t: 'Nyx', if: 'bounty_proto', go: 'nav_nyx' },
      { t: 'Titan', if: 'bounty_nocturne', go: 'nav_titan' },
      { t: 'Blue Note station', if: 'blue_note_codes', ifNot: 'bluenote_done', go: 'nav_bluenote' },
      { t: 'Stay put' }
    ] }
  ],
  nav_cygnus: [{ do: 'toCygnus' }],
  nav_vesta: [
    { if: 'vesta_arrived', do: 'toVesta' },
    { ifNot: 'vesta_arrived', do: 'departVesta' }
  ],
  nav_titan: [
    { if: 'titan_arrived', do: 'toTitan' },
    { ifNot: 'titan_arrived', do: 'departTitan' }
  ],
  nav_nyx: [
    { if: 'nyx_arrived', do: 'toNyx' },
    { ifNot: 'nyx_arrived', do: 'departNyx' }
  ],
  nav_targon: [
    { if: 'targon_arrived', do: 'toTargon' },
    { ifNot: 'targon_arrived', do: 'departTargon' }
  ],
  nav_k17: [
    { if: 'ghost_done', who: null, t: 'Relay K-17 is sealed by the Bounty Office now. Nothing left out there but static.' },
    { ifNot: 'ghost_done', if: 'k17_arrived', do: 'toRelay' },
    { ifNot: 'k17_arrived', do: 'departK17' }
  ],
  cockpit_done: [
    { who: null, t: 'Ship systems. Fuel: 64%. Hull: patched with shoes. New contracts arrive on the bounty board soon.' },
    { choices: [
      { t: "Fly to Dock 9 (Ozzie's stall)", go: 'cockpit_back' },
      { t: 'Stay put' }
    ] }
  ],
  // ---- Cygnus Station ----
  sax: [
    { who: 'sax', ifNot: 'met_sol', t: 'Evening, hunter. The plaza pays in loose change and bad weather. Care to sit in for a set?' },
    { who: 'sax', if: 'met_sol', t: "Back for another set? The rain's keeping time for us." },
    { set: 'met_sol' },
    { choices: [
      { t: "Let's play.", do: 'busk' },
      { t: 'What are you playing?', go: 'sax_song' },
      { t: 'Maybe later.' }
    ] }
  ],
  sax_song: [
    { who: 'sax', t: 'Something my teacher wrote on Titan. Four bars, round and round.' },
    { who: 'sax', t: 'Funny thing. Lately I keep hearing it on the radio, between stations. Old relay frequency, sounds like.' },
    { set: 'sax_clue' }
  ],
  sax_after: [{ who: 'sax', t: "Good set, hunter. Come back after your next jump. The crowd forgets. The rain doesn't." }],
  mags: [
    { who: 'mags', ifNot: 'met_mags', t: 'Welcome to the Flat Ninth. Drinks, rumours, or both? Both is cheaper.' },
    { who: 'mags', if: 'met_mags', t: "What'll it be, hunter?" },
    { set: 'met_mags' },
    { choices: [
      { t: "What's the word around the station?", go: 'mags_rumour' },
      { t: 'A Blue Seventh, please. (₡ 40)', do: 'drink' },
      { t: 'Nothing for now.' }
    ] }
  ],
  mags_rumour: [{ ifNot: 'rumour1', go: 'rumour1' }, { ifNot: 'rumour2', go: 'rumour2' }, { ifNot: 'rumour3', go: 'rumour3' }, { if: 'act1_done', go: 'mags_rumour2' }, { go: 'rumour_none' }],
  // after Side A: rumours that know what you did
  mags_rumour2: [{ ifNot: 'rumour4', go: 'rumour4' }, { ifNot: 'rumour5', go: 'rumour5' }, { ifNot: 'rumour6', go: 'rumour6' }, { ifNot: 'rumour7', go: 'rumour7' }, { go: 'rumour_none' }],
  rumour4: [{ set: 'rumour4' },
    { who: 'mags', t: "That broadcast. Every speaker on the station, playing the same four bars. Lou cried. Lou doesn't cry." },
    { who: 'mags', if: 'juno_protected', t: "Word is the Bounty Office has a whistleblower from K-17 in a safe room somewhere. Word is you put her there. Drinks are on the house. One drink." },
    { who: 'mags', if: 'juno_handed', t: "Word is Helix has a new signals tech locked in a lab, and you're the one who handed her over. Some of my regulars won't drink next to you. I'll let you guess which." }],
  rumour5: [{ set: 'rumour5' }, { who: 'mags', t: "Nyx Applied Sciences lost something last week. Not a person, not a package. Something that thinks. They're very keen nobody says that out loud." }],
  rumour6: [{ set: 'rumour6' },
    { who: 'mags', t: "There's a collector on Titan calling himself Mister Nocturne. Buys old instruments. Pays anything. Only wants the ones that have played a certain four bars." },
    { who: 'mags', if: 'core_kept', t: "And if I were you, I'd keep that humming thing in your cargo bay off the market. Just a feeling." }],
  rumour7: [{ set: 'rumour7' },
    { who: 'mags', if: 'mantis_spared', t: 'A Targon foreman came through last night, singing your praises. Said a rescue mech dug two of his crew out of a collapse. Then he complained about the invoice for an hour.' },
    { who: 'mags', if: 'mantis_core', t: 'The Bounty Office is quietly pulling every Helix firmware update off the network. Funny how that started right after Targon.' },
    { who: 'mags', if: 'mantis_scrapped', t: "Scrap dealers on Ganymede are selling 'genuine Iron Mantis parts'. I've counted eleven left scythes. A mantis has two." },
    { who: 'mags', ifNot: 'mantis_done', t: "Targon's foreman is hiring. A rogue mech, they say. If you like your bounties with extra legs." }],

  // ---- the Flat Ninth's regulars, who have opinions about you ----
  dutch: [
    { who: 'dutch', ifNot: 'met_dutch', t: "Dutch. Forty years down the belt mines. Now I sit here and judge people. It's a better pension." },
    { set: 'met_dutch' },
    { who: 'dutch', if: 'mantis_spared', t: "You let that old rescue mech live. Good. A machine that digs people out is worth more than its scrap. Most people are worth less than theirs." },
    { who: 'dutch', if: 'mantis_scrapped', t: "Scrapped the Mantis, eh? Can't blame you. Can't buy you a drink either. I dug with machines like that." },
    { who: 'dutch', if: 'mantis_core', t: "Pulled its brain and left the body for the engineer. Clever. A bit grim. Mostly clever." },
    { who: 'dutch', ifNot: 'mantis_done', if: 'juno_protected', t: "You're the crew who stood up to Helix out at K-17. Helix bought my old mine. Fired half of us by radio. Here's to you." },
    { who: 'dutch', ifNot: 'mantis_done', if: 'juno_handed', t: "You're Helix's favourite hunters now, I hear. Funny. They used to be mine. Then they bought the mine." },
    { who: 'dutch', ifNot: 'ghost_done', t: "The belt mines are full of ghosts, kid. Most of them are just bad wiring. Most." }
  ],
  pip: [
    { who: 'pip', ifNot: 'met_pip', t: "Pip! Courier, sixteen deliveries a day, never late, sometimes on fire. Wren Castillo's my best friend." },
    { set: 'met_pip' },
    { who: 'pip', if: 'courier_done', ifNot: 'pip_thanked', t: 'You found Wren on Vesta. She told me everything. Well, she told me some things. She said you were scary but nice. Mostly scary.' },
    { set: 'pip_thanked', if: 'courier_done' },
    { who: 'pip', if: 'core_kept', t: "Wren says that core you kept hums at night. You named it Kevin? That's the best name for a mystery device I have ever heard." },
    { who: 'pip', if: 'core_helix', t: "Wren went quiet when I said you gave the core to Helix. She said 'they had their reasons'. She says that when people don't." },
    { who: 'pip', if: 'core_sold', t: "Kessler's been bragging about a weird part he bought off you. He keeps it in a box with a lot of tape on it." },
    { who: 'pip', if: 'core_office', t: "The Bounty Office has a whole room for that core now. Wren went to look. It hummed at her. She hummed back." },
    { who: 'pip', ifNot: 'courier_done', t: "If you ever need anything carried, check the odd jobs on your bounty board. Couriers like me post there too." }
  ],

  // ---- Rook's old partner ----
  rook_partner: [
    { who: 'rook', t: "Cap. Remember the casino on Callisto? The night I didn't look away? I left out a bit." },
    { who: 'rook', t: "I didn't work it alone. My partner was Cass Marlowe. Best shot I ever saw, apart from me. When I didn't look away, she did. Then she told the boss it was me who talked." },
    { who: 'rook', t: "I got blacklisted. She got promoted. Last I heard she was running security for Helix." },
    { who: 'rook', t: "There's a new job on the odd jobs board this morning. Five thousand chits for Cass Marlowe. Anonymous. No questions asked." },
    { choices: [
      { t: "What do you want to do about it?", go: 'rook_partner_ask' },
      { t: "Let's go and hear her side first.", temp: 'Calm', go: 'rook_partner_ask' },
      { t: "So the couch was witness protection all along.", temp: 'Sarcastic', go: 'rook_partner_joke' },
      { t: "Then we find her before whoever posted that does.", temp: 'Idealistic', go: 'rook_partner_go' },
      { t: "Five thousand chits. She sold you out. Easy money.", temp: 'Ruthless', go: 'rook_partner_hard' }
    ] }
  ],
  rook_partner_ask: [{ who: 'rook', t: "I want to look her in the eye. After that, I don't know. That's the honest answer." }, { go: 'rook_partner_end' }],
  rook_partner_joke: [{ who: 'rook', t: "Ha. The couch knows things, Cap. The couch knows everything." }, { go: 'rook_partner_end' }],
  rook_partner_go: [{ who: 'rook', t: "Yeah. Somebody wants her gone quietly. I've been the quiet one long enough." }, { go: 'rook_partner_end' }],
  rook_partner_hard: [{ who: 'rook', t: "Maybe. It's never easy money when you used to share a lunch box with it." }, { go: 'rook_partner_end' }],
  rook_partner_end: [
    { who: 'rook', t: "She's on Cygnus, by the railings near the docking bay. The job's on the board under odd jobs. Thanks for hearing me out, Cap." },
    { set: 'rook_s1' }, { do: 'bond', arg: 'rook' }, { do: 'newStoryJob' }
  ],
  rook_waiting: [{ who: 'rook', pick: [
    "Cass is on Cygnus, by the railings near the docking bay. Take the job from the odd jobs board when you're ready.",
    "I keep cleaning this revolver. It is extremely clean now. I'm aware.",
    "Whoever posted that job knows she used to work for Helix. That's what worries me."
  ] }],
  rook_after2: [{ who: 'rook', pick: [
    'Thanks for Cygnus, Cap. I owe you one. I owe you several. Let us not count.',
    "Cass sent a postcard. It's blank. That's how I know it's from her.",
    "I slept nine hours straight. First time in six years. Don't tell Tam, she'll make me do chores."
  ] }],
  cass: [{ do: 'cassMeet' }],
  cass_choice: [
    { who: 'cass', t: "...Thanks. Your crew fights like a big band with a grudge, Captain." },
    { who: 'cass', t: "Now you've got a five-thousand-chit bounty standing right in front of you. Your call. Or his." },
    { choices: [
      { t: 'Rook. Your call.', go: 'cass_free' },
      { t: "You're coming in, Cass. Bounty Office. You can tell them about Helix.", go: 'cass_in' },
      { t: 'Five thousand is five thousand.', temp: 'Ruthless', go: 'cass_in' }
    ] }
  ],
  cass_free: [
    { who: 'rook', t: "Go, Cass. Get off this station, get off the network, and stop looking away. From anything." },
    { who: 'cass', t: "...You always were the better one of us. Here. Something for the road, since you're letting me take it." },
    { who: 'cass', t: "The Conductor's been buying something from Nyx Applied Sciences. Not hardware. Something that thinks. Helix security had a whole folder on it." },
    { set: 'cass_free' }, { do: 'cassDone' }
  ],
  cass_in: [
    { who: 'rook', t: "...Yeah. She is. I should have done it on Callisto, six years ago." },
    { who: 'cass', t: "Took you long enough, partner. Fine. I'll sing for the Bounty Office. I know a lot of songs about Helix." },
    { set: 'cass_jailed' }, { rep: { office: 1, helix: -1 } }, { do: 'cassDone' }
  ],


  rumour1: [{ set: 'rumour1' }, { who: 'mags', t: "Relay K-17 went quiet the same night Helix Salvage's stock jumped twelve percent. Funny, that." }],
  rumour2: [{ set: 'rumour2' }, { who: 'mags', t: "Someone's buying up old relay keycards in the lower ring. Paying in clean chits, which around here is suspicious." }],
  rumour3: [{ set: 'rumour3' }, { who: 'mags', t: 'See the woman in the corner booth? Rhea. Used to run comms for Helix, out past the belt. Doesn\'t talk much. Tips well.' }],
  rumour_none: [{ who: 'mags', t: "That's all I've got. Come back when the station does something stupid. Give it a day." }],
  lou: [{ who: 'lou', pick: [
    "Requests cost a tip. For you, it costs a smile. I'll take the tip anyway.",
    "This piano has one broken key. I play around it. That's jazz, kid.",
    "Old Sol out on the plaza taught me everything. Don't tell him. He'd be insufferable."
  ] }],
  rhea_first: [
    { set: 'rhea_met' },
    { who: 'rhea', t: "You're the crew that bagged Velvet Moreau. Congratulations. She owed me money." },
    { choices: [
      { t: 'Do you know anything about Relay K-17?', go: 'rhea_k17' },
      { t: 'Sounds like there is a story there.', temp: 'Calm', go: 'rhea_k17' },
      { t: 'Want us to collect for you?', temp: 'Sarcastic', go: 'rhea_sarc' },
      { t: 'You look like someone who needs a crew.', temp: 'Idealistic', go: 'rhea_ideal' },
      { t: "What's your price for information?", temp: 'Ruthless', go: 'rhea_ruth' },
      { t: 'Enjoy your drink.' }
    ] }
  ],
  rhea_sarc: [{ who: 'rhea', t: "Ha. No. I'd rather she owed me forever. It's leverage." }, { go: 'rhea_k17' }],
  rhea_ideal: [{ who: 'rhea', t: 'Careful. I might say yes.' }, { go: 'rhea_k17' }],
  rhea_ruth: [{ who: 'rhea', t: "First one's free. After that, I'm expensive." }, { go: 'rhea_k17' }],
  rhea_k17: [
    { who: 'rhea', t: 'I ran comms on Relay K-17 for two years. Helix cut the budget, then cut me.' },
    { who: 'rhea', t: "If you take that job, come find me. You'll need someone who speaks relay. And someone who knows where the bodies are buried. Hopefully not literally." },
    { set: 'rhea_k17' }
  ],
  rhea_idle: [
    { who: 'rhea', if: 'bounty_ghost', t: "So you took the Helix job. Good. When you fly to K-17, I'm coming with you. Don't argue." },
    { who: 'rhea', ifNot: 'bounty_ghost', t: "Talk to Hale at Helix Salvage, then come back. I'll be here. Not drinking this." }
  ],
  helix: [{ who: null, t: 'Helix Salvage. The lobby smells like money and lemon polish.' }, { do: 'helixOffer' }],
  helix_again: [{ who: null, t: "Helix's receptionist smiles with slightly too many teeth. Director Hale is in a meeting. She is always in a meeting." }],
  helix_sealed: [{ who: null, t: "Helix Salvage's lobby is dark. There is a Bounty Office seal on the door, and someone has drawn a small baton on it with a line through it." }],
  vend_cygnus: [{ who: null, t: "The machine sells 'Moon Cola: Now With Less Moon'. You decide not to ask." }],
  dockgate: [
    { who: null, t: 'The Hi-Hat sits in the docking bay below, dripping rainwater. Head back aboard?' },
    { choices: [{ t: 'Board the Hi-Hat', go: 'ship_board' }, { t: 'Plot a course from here', if: 'up_engine', go: 'cockpit_nav' }, { t: 'Stay on the station' }] }
  ],
  storefront: [{ who: null, pick: ['A shop window full of second-hand cybernetics. A hand waves at you. You hope it is a display.', 'Closed. A sign says BACK IN 5 MIN. It has said that for a year.', 'A pachinko parlour. The noise alone could power the ship.'] }],
  neon: [{ who: null, pick: ['A neon sign buzzes. You catch about half the kanji. The other half is a brand of noodle.', 'The sign flickers like it is trying to tell you something. Probably just bad wiring.'] }],
  neonlamp: [{ who: null, t: 'A teal street lamp. The rain under it looks like static.' }],
  planter: [{ who: null, t: "A planter of station-grown bamboo. Tam would want a cutting. Tam would also want you not to get caught." }],
  railing: [{ who: null, t: 'Below the railing: the docking bay, and below that, a very long way down to nothing at all.' }],
  piano: [{ who: null, t: "Lou's piano. One key is taped down. It's the one you'd want." }],
  bottles: [{ who: null, t: 'Bottles from six moons. One is labelled DO NOT. Nobody knows what it does not do.' }],
  bartable: [{ who: null, t: 'A table with a candle in a jar and initials carved in the edge. One set says R.V.' }],
  booth: [{ who: null, t: 'A red booth, worn soft by a thousand bad decisions.' }],

  // ---- Relay K-17 ----
  airlock_k17: [
    { who: null, t: 'The Hi-Hat is clamped to the outer airlock. Head back aboard?' },
    { choices: [{ t: 'Board the Hi-Hat', go: 'ship_board' }, { t: 'Plot a course from here', if: 'up_engine', go: 'cockpit_nav' }, { t: 'Keep exploring' }] }
  ],
  rhea_relay: [
    { who: 'rhea', ifNot: 'power_on', t: "Generator first. Upper deck, far left. Nothing opens until the lights do." },
    { who: 'rhea', if: 'power_on', ifNot: 'k17_keycard', t: 'The comms hub needs a keycard. Crew quarters, top middle. Juno always kept a spare in her locker.' },
    { who: 'rhea', if: 'k17_keycard', ifNot: 'drones_cleared', t: "Keycard opens the comms hub, top right. Mind the drones by the door. They don't do conversation." },
    { who: 'rhea', if: 'drones_cleared', t: "Hub's clear. Whoever's playing that song is in there." },
    { who: 'rhea', if: 'power_on', ifNot: 'cryo_found', t: 'The medbay is bottom right. If anyone made it, that is where they would be.' }
  ],
  rhea_ship: [{ who: 'rhea', pick: [
    "Tam gave me the bunk next to the noisy pipe. I've named the pipe. It's called Hale.",
    "Your drone asked me to rate his song out of ten. I said eleven. He hasn't stopped humming since.",
    "Nice ship. Held together by tape and optimism. I've worked on worse. Not many."
  ] }],
  brushes_relay: [{ who: 'brushes', pick: [
    'The four bars repeat every eleven seconds. Eleven! Who writes in eleven?',
    'I am staying by the airlock. For tactical reasons. The reasons are fear.',
    'Somebody on this station plays very good jazz. Somebody on this station is also very scared.'
  ] }],
  drones: [
    { who: null, t: 'Two security drones hover by the comms hub door. Their red eyes swivel towards you.' },
    { choices: [{ t: 'Fight', do: 'fightDrones' }, { t: 'Back off' }] }
  ],
  generator: [
    { who: null, t: "The relay's generator. Dead, but intact. The breaker has been thrown by hand. From the outside." },
    { choices: [{ t: 'Throw the breaker', go: 'generator_on' }, { t: 'Leave it' }] }
  ],
  generator_on: [
    { set: 'power_on' }, { do: 'power' },
    { who: null, t: 'The generator coughs, hums, then roars. Red emergency light gives way to cold blue. Somewhere, doors unlock.' },
    { who: 'brushes', t: 'Power restored! The four bars just got louder. They are coming from the comms hub, Captain. Top right.' }
  ],
  generator_done: [{ who: null, t: 'The generator hums. Someone has scratched JUNO WAS HERE into the casing.' }],
  lockers_dark: [{ who: null, t: 'Crew lockers, but the quarters door is dead. You need the power on.' }],
  lockers: [
    { who: null, t: 'Crew lockers. Most are empty. One is labelled REYES, with a photo of a drum kit taped inside.' },
    { set: 'k17_keycard' }, { do: 'keycard' },
    { who: null, t: 'Tucked behind the photo: a comms hub keycard.' }
  ],
  lockers_done: [{ who: null, t: "Juno's locker. The drum kit photo smiles back at you." }],
  log_bunk: [
    { who: null, t: "Personal log, day 4: Hale's engineers installed something in the comms hub. We aren't supposed to ask what. Juno asked." },
    { who: null, t: 'Day 9: Juno says the new array can hear everything. Every call, every message, every whisper in the system. We voted not to switch it on.' }
  ],
  log_med: [{ who: null, t: "Medical log: four crew placed in cryo to save air. Juno stayed awake to keep the signal going. Her words: 'Someone will hear the song.'" }],
  cryo: [
    { set: 'cryo_found' },
    { who: null, t: 'Four cryo pods. Four sleeping faces. Four steady heartbeats. The missing crew, alive.' },
    { do: 'cryo' }
  ],
  cryo_done: [{ who: null, t: 'The cryo pods hum softly. Everyone inside is still sleeping peacefully.' }],
  comms: [
    { who: null, ifNot: 'juno_met', t: 'Every screen shows the same waveform: four bars, looping. Someone is breathing behind the racks.' },
    { who: null, if: 'juno_met', t: 'The hub screens are dark now. The loop has stopped.' }
  ],
  door_power: [
    { who: null, ifNot: 'power_on', t: 'The door is dead. No power.' },
    { who: null, if: 'power_on', t: 'The door is open.' }
  ],
  door_key: [
    { who: null, ifNot: 'power_on', t: 'The comms hub. Dead, and keycard-locked.' },
    { who: null, if: 'power_on', ifNot: 'k17_keycard', t: 'The comms hub. The keypad wants a keycard.' },
    { who: null, if: 'k17_keycard', t: 'The keycard opens the comms hub.' }
  ],
  juno: [
    { set: 'juno_met' },
    { who: 'juno', t: "Stop. Don't come closer. ...You're not Helix. Helix doesn't knock." },
    { choices: [
      { t: 'Who are you?', go: 'juno_who' },
      { t: 'Tell me what happened.', go: 'juno_what' },
      { t: "You're coming with me.", go: 'juno_come' },
      { t: "I'll decide after I hear more.", go: 'juno_what' }
    ] }
  ],
  juno_who: [{ who: 'juno', t: "Juno Reyes. Signals tech. I'm the one playing the song." }, { go: 'juno_what' }],
  juno_come: [{ who: 'juno', t: "Not yet. Not until you know what's in here. Listen." }, { go: 'juno_what' }],
  juno_what: [
    { who: 'juno', t: 'Helix turned this relay into an ear on the whole system. We refused to switch it on. So they sent the Warden to switch us off.' },
    { who: 'juno', t: 'I hid the truth in the only thing their filters ignore. Four bars of music, on every frequency, for three weeks.' },
    { do: 'warden' }
  ],
  k17_choice: [
    { who: null, t: 'Director Hale is calling. The data core is warm in your hand. Juno is watching you.' },
    { choices: [
      { t: 'Protect Juno. Send the data to the Bounty Office.', go: 'choice_protect' },
      { t: "Hand everything to Hale. A contract's a contract.", go: 'choice_hand' },
      { t: 'Juno, what do you want to happen?', temp: 'Calm', go: 'choice_ask' },
      { t: 'Can we keep the data AND the money?', temp: 'Sarcastic', go: 'choice_both' },
      { t: 'Five people nearly died for this. Helix answers for it.', temp: 'Idealistic', go: 'choice_protect' },
      { t: "Hale pays. Juno's her problem.", temp: 'Ruthless', go: 'choice_hand' }
    ] }
  ],
  choice_ask: [{ who: 'juno', t: 'I want the system to know what Helix built. That is all I have wanted for three weeks.' }, { go: 'k17_choice_again' }],
  choice_both: [{ who: 'hale', t: 'No. Choose, Captain.' }, { go: 'k17_choice_again' }],
  k17_choice_again: [{ choices: [
    { t: 'Protect Juno. Send the data to the Bounty Office.', go: 'choice_protect' },
    { t: 'Hand everything to Hale.', go: 'choice_hand' }
  ] }],
  choice_protect: [
    { set: 'juno_protected' }, { rep: { office: 2, helix: -3 } }, { do: 'protect' },
    { who: 'hale', t: "You have made an expensive enemy, Captain. I'll pay half, because the contract says I must. Enjoy it." },
    { who: 'juno', t: 'Thank you. I mean it.' }
  ],
  choice_hand: [
    { set: 'juno_handed' }, { rep: { helix: 2, office: -1 } }, { do: 'handOver' },
    { who: 'hale', t: 'A professional. How refreshing. Payment in full is on its way.' },
    { who: 'juno', t: '...I thought you were different.' }
  ],

  // ---- Vesta: Track 03 ----
  lift_vesta: [
    { who: null, t: 'A cage lift rattles down to the docking bay, where the Hi-Hat is parked. Head back aboard?' },
    { choices: [{ t: 'Ride down to the Hi-Hat', go: 'ship_board' }, { t: 'Plot a course from here', if: 'up_engine', go: 'cockpit_nav' }, { t: 'Stay in the market' }] }
  ],
  tam_vesta: [{ who: 'tam', pick: [
    "Vesta's got the best scrap market in the belt. If we live, I'm shopping.",
    "Pell's the broker in the purple suit, top left. He sells information by the gram.",
    "Rook's minding the ship. By which I mean asleep in the cockpit."
  ] }],
  rhea_vesta: [
    { who: 'rhea', ifNot: 'tail_done', t: 'If you tail someone, use the stalls. Line of sight is everything. Trust me, I used to watch people for a living.' },
    { who: 'rhea', if: 'tail_done', t: "Nice work. You're a natural sneak, Captain. I'm choosing to find that reassuring." }
  ],
  pell_first: [
    { set: 'met_pell' },
    { who: 'pell', t: 'Wren Castillo? Lovely girl. Paid me to forget her face.' },
    { who: 'pell', t: 'Then a gentleman in a grey coat paid me double to remember it. Fennick. He has been asking where she is hiding.' },
    { who: 'pell', t: 'I told him nothing, of course. But he found out anyway. He is leaving for her hideout right now.' },
    { go: 'pell_offer' }
  ],
  pell_offer: [
    { choices: [
      { t: "I'll follow him.", go: 'pell_tail' },
      { t: 'Any tips for tailing someone?', go: 'pell_tips' },
      { t: 'Why are you helping me?', temp: 'Calm', go: 'pell_why' },
      { t: 'And how much do I owe you for this?', temp: 'Sarcastic', go: 'pell_owe' },
      { t: 'Wren could be in danger. Which way?', temp: 'Idealistic', go: 'pell_tail' },
      { t: 'You sold her out. I should cuff you too.', temp: 'Ruthless', go: 'pell_threat' }
    ] }
  ],
  pell_tips: [
    { who: 'pell', t: 'Not too close, not too far. Fennick stops to check behind him. When he does, be behind a stall, or a crate, or another person with excellent posture.' },
    { go: 'pell_offer' }
  ],
  pell_why: [{ who: 'pell', t: 'Fennick paid me in counterfeit chits. Velvet Moreau specials. I take that personally.' }, { go: 'pell_offer' }],
  pell_owe: [{ who: 'pell', t: "Nothing. Fennick's chits were fake. Consider this my revenge." }, { go: 'pell_offer' }],
  pell_threat: [{ who: 'pell', t: 'You could. But then who would tell you he is leaving right now?' }, { go: 'pell_offer' }],
  pell_tail: [{ who: 'pell', t: 'There. Grey coat, by the stalls. Go.' }, { set: 'tail_started' }, { do: 'tail' }],
  pell_retry: [
    { who: 'pell', t: 'Fennick doubled back to the noodle cart to sulk. He is about to leave again. Another try?' },
    { choices: [{ t: 'Follow him', go: 'pell_tail' }, { t: 'Tips, please', go: 'pell_tips2' }, { t: 'Not yet' }] }
  ],
  pell_tips2: [{ who: 'pell', t: 'When the ! appears over his head, he is about to look back. Get a stall between you, or get far away.' }, { go: 'pell_retry' }],
  pell_idle: [{ who: 'pell', t: 'Information is like noodles, hunter. Best served hot, and never ask what is in it.' }],
  tail_done: [
    { who: null, t: 'Fennick slips through a battered door at the end of the tunnel. The lock does not catch behind him.' },
    { who: 'brushes', t: 'Captain, the door is open. Somebody inside is humming. Badly.' }
  ],
  tail_fail_spotted: [{ who: null, t: 'Fennick turns, sees you and melts into the crowd. Pell waves you over from his stall.' }],
  tail_fail_close: [{ who: null, t: 'You get so close you could read his collar tag. He notices. He bolts. Pell sighs at you from across the market.' }],
  tail_fail_lost: [{ who: null, t: 'The grey coat disappears into the crowd. You lost him. Back to Pell.' }],
  door_hideout: [{ who: null, t: 'A heavy wooden door, bolted from the inside.' }],
  door_hideout_open: [{ who: null, t: 'The hideout door hangs open.' }],
  wren: [
    { who: 'wren', t: 'Stay back! ...Wait. You are not Fennick. You are not Helix either. Helix wears nicer shoes.' },
    { do: 'courierFound' }
  ],
  quill: [{ who: 'quill', pick: [
    'Helix Salvage values its partners, Captain. I am simply here to observe. Do carry on.',
    'A courier with a sealed case. How intriguing. Helix is always interested in sealed cases.',
    'Director Hale sends her warmest regards. She is not a warm person, so they are lukewarm.'
  ] }],
  scavs: [
    { who: 'scav', t: "This tunnel's ours. Toll is everything in your pockets." },
    { choices: [{ t: 'Fight', do: 'fightScavs' }, { t: 'Back off' }] }
  ],
  chest_vesta_blocked: [{ who: null, t: 'A crate behind the scavengers. You would have to get past them first.' }],
  chest_vesta: [{ set: 'vesta_chest' }, { do: 'vestaChest' }, { who: null, t: 'Inside the crate: a scavenger stash. 500 chits and two Neon Curries, still warm somehow.' }],
  chest_vesta_done: [{ who: null, t: 'An empty crate. Somebody has drawn a sad face inside it.' }],
  hideout_crates: [{ who: null, t: 'Packing crates labelled HELIX SALVAGE: FRAGILE: DO NOT OPEN. One has been opened.' }],
  stall: [{ who: null, pick: ['A stall selling drill bits, glow-moss and suspicious meat on sticks.', 'Second-hand spacesuits. One still has a name tag: DAVE.', 'A noodle cart. The cook is arguing with a robot about broth.'] }],
  lantern: [{ who: null, t: 'A mining lantern. It flickers like it has opinions.' }],
  rockwall: [{ who: null, t: 'Raw asteroid rock, carved by a hundred years of drills.' }],
  case_choice: [
    { who: 'wren', t: 'The core in my case is a Helix tuning core. One piece of the listening array. Without it, the next relay stays deaf.' },
    { who: 'quill', if: 'juno_handed', t: 'Helix will pay handsomely for its property, Captain. Handsomely.' },
    { who: 'wren', t: "I can't keep running with it. You decide what happens to it." },
    { choices: [
      { t: 'The Bounty Office gets it, as evidence.', go: 'core_office' },
      { t: 'Keep it aboard the Hi-Hat. Brushes wants a look.', go: 'core_kept' },
      { t: 'Hand it to Mr Quill for Helix.', if: 'juno_handed', go: 'core_helix' },
      { t: 'Sell it to Kessler. Parts are parts.', temp: 'Ruthless', go: 'core_sold' }
    ] }
  ],
  core_office: [{ set: 'core_office' }, { rep: { office: 1, helix: -1 } }, { who: 'wren', t: "Evidence. Good. Let them try to explain this one away." }],
  core_kept: [{ set: 'core_kept' }, { do: 'bond', arg: 'brushes' }, { who: 'brushes', t: 'It hums in four-four. I already like it. I am naming it Kevin.' }],
  core_helix: [{ set: 'core_helix' }, { rep: { helix: 2, office: -1 } }, { who: 'quill', t: 'A sensible choice. Helix remembers its friends.' }, { who: 'wren', t: '...Right. Of course.' }],
  core_sold: [{ set: 'core_sold' }, { rep: { office: -1 } }, { who: 'wren', t: "You'd sell it to the highest bidder? Fine. At least it isn't Helix." }],

  // ---- optional side fights ----
  smugglers: [
    { who: 'smugglers', t: "This crate's spoken for, hunter. So's that one. And you, if you keep standing there." },
    { choices: [{ t: 'Fight', do: 'fight', arg: 'smugglers' }, { t: 'Walk away' }] }
  ],
  loader: [
    { who: null, t: 'A cargo loader is stuck on a loop, crushing empty crates. Its safety lights are blinking red. It turns towards you.' },
    { choices: [{ t: 'Shut it down', do: 'fight', arg: 'loader' }, { t: 'Back away slowly' }] }
  ],
  alley: [
    { who: 'alley', t: 'Nice ship you came in on. Be a shame if someone borrowed the codes.' },
    { choices: [{ t: 'Fight', do: 'fight', arg: 'alley' }, { t: 'Keep walking' }] }
  ],
  maint: [
    { who: null, t: 'A maintenance mech sits in the storeroom, humming. Its sensors flick on as you step closer.' },
    { choices: [{ t: 'Fight', do: 'fight', arg: 'maint' }, { t: 'Leave it be' }] }
  ],
  jumpers: [
    { who: 'jumpers', t: "Whatever you're digging for, it's ours now. Turn around, or get buried with it." },
    { choices: [{ t: 'Fight', do: 'fight', arg: 'jumpers' }, { t: 'Turn around' }] }
  ],
  holo: [
    { who: 'brushes', t: "My holo-rehearsal rig! Practise your timing against a holographic band. It grows with you. No chits, but plenty of experience." },
    { choices: [{ t: 'Run a rehearsal', do: 'fight', arg: 'rehearsal' }, { t: 'Maybe later' }] }
  ],

  door_done: [{ who: null, t: 'Warehouse 9-C is wrapped in Bounty Office tape. Somebody has drawn a tiny hat on it.' }],

  // ---- crew side chats (after Track 01) ----
  rook_chat: [
    { who: 'rook', t: 'Captain. Sit. The couch has room. Well, it has a corner.' },
    { who: 'rook', t: 'Velvet asked me something back at the warehouse. Why a guy who shoots like me works for chits on a rust bucket.' },
    { choices: [
      { t: 'So why do you?', go: 'rook_story' },
      { t: "You don't have to tell me.", temp: 'Calm', go: 'rook_story_calm' },
      { t: 'For the couch, obviously.', temp: 'Sarcastic', go: 'rook_story_sarc' },
      { t: "Because you're one of the good ones.", temp: 'Idealistic', go: 'rook_story_ideal' },
      { t: 'Because nobody else would hire you.', temp: 'Ruthless', go: 'rook_story_ruth' }
    ] }
  ],
  rook_story_calm: [{ who: 'rook', t: "I know. That's why I'm going to." }, { go: 'rook_story' }],
  rook_story_sarc: [{ who: 'rook', t: 'Partly. Mostly. Okay, a lot. But not only.' }, { go: 'rook_story' }],
  rook_story_ideal: [{ who: 'rook', t: "Don't spread that around. I have a reputation." }, { go: 'rook_story' }],
  rook_story_ruth: [{ who: 'rook', t: '...Yeah. That too. Let me finish.' }, { go: 'rook_story' }],
  rook_story: [
    { who: 'rook', t: 'I rode security for a casino on Callisto. Great pay. My boss paid even better to look the other way.' },
    { who: 'rook', t: "One night I didn't look away. Turns out honesty is expensive. The Hi-Hat was the only ship that'd take me." },
    { who: 'rook', t: "Anyway. Thanks for not asking sooner. And for asking now." },
    { set: 'chat_rook' }, { do: 'bond', arg: 'rook' }
  ],
  tam_chat: [
    { who: 'tam', t: "Cap. Got a minute? Gerald's looking a bit peaky." },
    { who: 'tam', t: 'My mum gave him to me when I left Io. Said if I could keep a ficus alive on a ship, I could keep the ship alive too.' },
    { choices: [
      { t: 'And you have. Both of them.', go: 'tam_end_kind' },
      { t: "Let's get him a proper grow lamp. My treat. (₡ 300)", temp: 'Idealistic', do: 'lamp', go: 'tam_end_lamp' },
      { t: "Talk me through what he needs.", temp: 'Calm', go: 'tam_end_calm' },
      { t: 'Have you tried hitting Gerald with a wrench?', temp: 'Sarcastic', go: 'tam_end_sarc' },
      { t: "It's a plant, Tam.", temp: 'Ruthless', go: 'tam_end_ruth' }
    ] }
  ],
  tam_end_kind: [{ who: 'tam', t: 'Mostly. The ship complains more than Gerald does.' }, { go: 'tam_end' }],
  tam_end_lamp: [{ who: 'tam', if: 'gerald_lamp', t: '...You mean it? Okay. Okay! Gerald, did you hear that?' }, { who: 'tam', ifNot: 'gerald_lamp', t: "That's sweet, Cap. Come back when the chits catch up with the sentiment." }, { go: 'tam_end' }],
  tam_end_calm: [{ who: 'tam', t: 'Light, water, and someone who listens. Same as the rest of us, I suppose.' }, { go: 'tam_end' }],
  tam_end_sarc: [{ who: 'tam', t: "That only works on engines, Captain. And you." }, { go: 'tam_end' }],
  tam_end_ruth: [{ who: 'tam', t: "It's MY plant. And it has never once tried to sell me out. Can't say that about most people." }, { go: 'tam_end' }],
  tam_end: [{ who: 'tam', t: 'Thanks for listening, Cap. Now get out of my galley.' }, { set: 'chat_tam' }, { do: 'bond', arg: 'tam' }],
  brushes_chat: [
    { who: 'brushes', t: 'Captain! I have been writing a song. Four bars. They are very good bars.' },
    { who: 'brushes', t: "But I can't decide what kind of song it wants to be. Will you choose?" },
    { choices: [
      { t: 'A slow ballad, for the long jumps.', go: 'brushes_ballad' },
      { t: 'Fast bebop, for the fights.', go: 'brushes_bop' },
      { t: 'Something with fewer than four bars.', temp: 'Sarcastic', go: 'brushes_rude' },
      { t: 'Whatever sells.', temp: 'Ruthless', go: 'brushes_sells' }
    ] }
  ],
  brushes_ballad: [{ set: 'song_ballad' }, { who: 'brushes', t: 'A ballad! Moody. Mysterious. Like you, Captain.' }, { go: 'brushes_song_end' }],
  brushes_bop: [{ set: 'song_bop' }, { who: 'brushes', t: 'Bebop! Hold on to something.' }, { go: 'brushes_song_end' }],
  brushes_rude: [{ set: 'song_ballad' }, { who: 'brushes', t: 'Rude. A ballad, then. A sad one. About you.' }, { go: 'brushes_song_end' }],
  brushes_sells: [{ set: 'song_bop' }, { who: 'brushes', t: 'Fast sells. Fast it is.' }, { go: 'brushes_song_end' }],
  brushes_song_end: [
    { do: 'song' },
    { who: 'brushes', t: "It's on the jukebox now. Also: Helix Salvage pinged the bounty board about a dead relay. I've filed it under spooky." },
    { rep: { helix: 1 } },
    { set: 'chat_brushes' }, { do: 'bond', arg: 'brushes' }
  ],

  // ---- after Track 01 ----
  rook_after: [{ who: 'rook', pick: ['Velvet had a mean right hook for someone in a hat that big.', 'Payday nap. The best kind of nap.', 'Tam took my shoes. I want that on the record.'] }],
  tam_after: [{ who: 'tam', pick: ['Hull patch is holding. Mostly shoe leather.', "I bought real noodles. Don't touch them. Any of you.", 'Gerald got a new pot. Gerald deserves it.'] }],
  brushes_after: [
    { who: 'brushes', ifNot: 'cygnus_arrived', t: 'Helix Salvage has an office on Cygnus Station. The cockpit can take us there whenever you like.' },
    { who: 'brushes', if: 'cygnus_arrived', pick: ['Fridge report: two eggs! Growth!', "I've started a file on Ghost Frequency. It's mostly static. Spooky static.", 'Excellent drumming in that fight, Captain. Very on the beat. Mostly.', 'Old Sol on Cygnus plays my four bars. I did not teach him. Nobody taught him. Spooky.'] }
  ],

  // ---- Dock 9 ----
  rook_docks: [{ who: 'rook', pick: ["I'm guarding the ship. It's very safe. Look how safe it is.", 'Ozzie by the vending machine knows things. Dock workers always know things.', 'If you hear shooting, that was probably me. Probably.'] }],
  tam_docks: [
    { who: 'tam', ifNot: 'door_open', t: 'Look for anything that smells like fresh ink. Or money. Same smell, really.' },
    { who: 'tam', if: 'door_open', t: "Brushes cracked the lock on 9-C. Velvet's in there. Let's go earn some noodles." }
  ],
  ozzie_first: [
    { set: 'met_ozzie' },
    { who: 'ozzie', t: "Bounty hunters? Keep your voice down. The twins outside 9-C don't like visitors." },
    { choices: [
      { t: "What's inside 9-C?", go: 'ozzie_info' },
      { t: "Thanks. We'll keep it quiet.", temp: 'Calm', go: 'ozzie_calm', rep: { docks: 1 } },
      { t: 'Twins? How do you tell them apart?', temp: 'Sarcastic', go: 'ozzie_sarc' },
      { t: "We'll get her off your dock for good.", temp: 'Idealistic', go: 'ozzie_ideal', rep: { docks: 1 } },
      { t: 'Talk, or I tell Velvet you were helpful.', temp: 'Ruthless', go: 'ozzie_ruth', rep: { docks: -1 } },
      { t: 'Never mind.' }
    ] }
  ],
  ozzie_info: [
    { who: 'ozzie', t: 'Officially, decorative paper. Unofficially, I hear printing at 3 a.m.' },
    { who: 'ozzie', t: 'Check the crates on the east side, the ink drums, and that vending machine. It ate a very suspicious chit this morning.' }
  ],
  ozzie_calm: [{ who: 'ozzie', t: 'Appreciated. Crates on the east side, ink drums, the vending machine. That is all I know. I have two kids and one kidney.' }],
  ozzie_sarc: [{ who: 'ozzie', t: 'One of them has a neck. Try the east crates, the ink drums and the vending machine.' }],
  ozzie_ideal: [{ who: 'ozzie', t: "Do that and I'll buy you noodles. One cup. Each. Start with the east crates, the ink drums and the vending machine." }],
  ozzie_ruth: [{ who: 'ozzie', t: '...East crates. Ink drums. The vending machine took a dodgy chit. Please never tell her anything.' }],
  ozzie_idle: [
    { who: 'ozzie', if: 'velvet_done', t: "The whole dock's talking about you. Velvet in cuffs! First round of noodles is on me. Well, discounted." },
    { who: 'ozzie', if: 'door_open', ifNot: 'velvet_done', t: "Whatever you're about to do in there, I didn't see it." },
    { who: 'ozzie', ifNot: 'door_open', pick: ['East crates, ink drums, vending machine. I am repeating myself because I am nervous.', 'Night shift on Ganymede. Minus 160 outside, and the coffee is somehow colder.'] },
    { choices: [
      { t: 'Got anything for sale?', do: 'shop', arg: 'ozzie' },
      { t: 'Thanks for the help, Ozzie.', ifNot: 'thanked_ozzie', set: 'thanked_ozzie', rep: { docks: 1 }, go: 'ozzie_thanks' },
      { t: 'Just passing.' }
    ] }
  ],
  ozzie_thanks: [{ who: 'ozzie', t: "Nobody says thanks on this dock. You've made my week. Possibly my month." }],
  goon: [
    { who: 'goon', ifNot: 'door_open', pick: ['Move along. Nothing to see here. Definitely no printing.', 'Boss says no visitors. Boss also says no eye contact.', 'This is a decorative paper warehouse. Very decorative. Very paper.'] },
    { who: 'goon', if: 'door_open', t: "Hey, why's the door unlocked? ...Not my shift problem." }
  ],
  door_locked: [{ who: null, t: "Warehouse 9-C. Locked tight, with a printing-press hum coming through the door. Brushes needs proof before cracking it." }],
  door_open: [
    { who: null, t: 'The lock on 9-C blinks green. Inside: the thump of a printing press, and someone humming.' },
    { choices: [
      { t: 'Go in', go: 'door_go' },
      { t: 'Not yet' }
    ] }
  ],
  door_go: [{ do: 'confront' }],
  manifest: [
    { who: null, if: 'clue_manifest', t: 'Crates of "decorative paper". You already have the manifest.' },
    { ifNot: 'clue_manifest', set: 'clue_manifest' },
    { who: null, if: 'clue_manifest', ifNot: 'manifest_seen', t: 'A shipping manifest: 400 kg of decorative paper, delivered to Warehouse 9-C every night this month. Nobody needs that much decoration.' },
    { set: 'manifest_seen' },
    { do: 'clue' }
  ],
  ink: [
    { who: null, if: 'clue_ink', t: 'Empty drums. You already found the ink.' },
    { ifNot: 'clue_ink', set: 'clue_ink' },
    { who: null, if: 'clue_ink', ifNot: 'ink_seen', t: 'Drums of magnetic banknote ink, still warm. Someone has been printing all night.' },
    { set: 'ink_seen' },
    { do: 'clue' }
  ],
  chit: [
    { who: null, if: 'clue_chit', t: 'The vending machine hums. It has nothing left to confess.' },
    { ifNot: 'clue_chit', set: 'clue_chit' },
    { who: null, if: 'clue_chit', ifNot: 'chit_seen', t: "The machine's reject tray holds a credit chit. The serial number is a phone number. It's fake, and the machine gave you a free noodle cup out of guilt." },
    { set: 'chit_seen' },
    { do: 'noodle' },
    { do: 'clue' }
  ],
  comms_open: [
    { who: 'brushes', t: "Captain, that's all the proof I need. Cracking the lock on Warehouse 9-C now..." },
    { who: 'brushes', t: "...and done. Velvet's inside. Bring her out alive, please. Alive pays." }
  ],
  drum: [{ who: null, t: 'An oil drum. It sloshes ominously.' }],
  crate: [{ who: null, t: 'Empty crates. One says FRAGILE in four languages, and has clearly been kicked in all four.' }],
  container: [{ who: null, pick: ['A shipping container. Empty, except for echoes and a strong smell of fish.', 'A container stencilled IO NOODLE CO. Tam would want you to check. It is empty. Tam would be devastated.', 'Locked container. Someone has scratched a tiny saxophone into the paint.'] }],
  lamp: [{ who: null, t: 'A sodium lamp buzzing in B-flat. Brushes would approve.' }],
  warehouse: [{ who: null, t: 'Corrugated warehouse wall. Cold enough to stick your tongue to. Do not.' }],
  // ---- Targon: Track 04 ----
  tam_targon: [
    { who: 'tam', t: "Targon. I did my apprenticeship there, Cap. Three years in a workshop that smelled like hot grease and burnt toast." },
    { who: 'tam', t: "The Iron Mantis... I know that mech. I helped bolt its legs on. Let's just go." }
  ],
  tam_site: [
    { who: 'tam', t: "This was Ferro's workshop. Dagny Ferro. I swept this floor every morning for three years." },
    { who: 'tam', t: "There's a photo above the bench. You can look. I'm going to stand here and pretend I'm not watching you look." }
  ],
  tam_site_after: [{ who: 'tam', pick: [
    "Main lift's on the right, past the pump house. If the power's routed, it'll take us down.",
    "Ferro would hate that I'm standing in her workshop without touching anything. She'd say it was rude to the tools.",
    "If anyone can talk that Mantis down, it's Ferro. If anyone can hit it with a wrench, it's me."
  ] }],
  rhea_targon: [
    { who: 'rhea', ifNot: 'ferro_found', t: "The bounty says 'disabled'. Not destroyed. There's room in that word, Captain." },
    { who: 'rhea', if: 'ferro_found', t: "A firmware push through the Helix relays. The Conductor isn't just broadcasting. He's reprogramming things." }
  ],
  okada: [
    { set: 'met_okada' },
    { who: 'okada', t: "Foreman Okada, Targon Mining. You're the hunters? Good. I've got a three-ton problem down Shaft 3." },
    { who: 'okada', t: "The Mantis was built to dig miners out of cave-ins. Six days ago it walked down the main shaft and started digging in instead." },
    { who: 'okada', t: "Dagny Ferro, the engineer who built it, went down after it two days back. We haven't heard a peep." },
    { who: 'okada', t: "And it ripped the junction cables on its way down, so the main lift's dead. Board's in the pump house, east side. Get power to the lift and you can follow." },
    { choices: [
      { t: "We'll bring Ferro back up, too.", go: 'okada_ferro' },
      { t: 'A giant robot bug. Is there danger pay?', temp: 'Sarcastic', go: 'okada_pay' },
      { t: 'It was built to save people. Maybe it still can.', temp: 'Idealistic', go: 'okada_save' },
      { t: 'Disabled, scrapped, whatever. As long as it pays.', temp: 'Ruthless', go: 'okada_scrap' },
      { t: 'Got it. Pump house first.' }
    ] }
  ],
  okada_ferro: [{ who: 'okada', t: "I'd appreciate it. She's a pain in my neck, but she's our pain in my neck." }],
  okada_pay: [{ who: 'okada', t: "The danger pay is the pay. Thirty-two thousand. For thirty-two thousand I'd fight it myself, if I had any knees left." }],
  okada_save: [{ who: 'okada', t: "Contract says disabled. Me, I'd prefer scrap. Scrap I can sell. Saviour robots I cannot." }],
  okada_scrap: [{ who: 'okada', t: "Finally, someone who speaks foreman. Scrap's worth good money by the kilo. Bring me a quiet Mantis." }],
  okada_idle: [{ who: 'okada', pick: [
    "Pump house is the hut on the east side. The board's a mess. Don't touch the red cable. Actually, touch whatever you like, it's all broken.",
    "Shaft 3 goes down four levels. The Mantis is somewhere on the bottom one, being expensive.",
    "Rock rats have been nesting in the spoil heap since the Mantis stopped clearing them. Little drill-faced menaces."
  ] }],
  okada_done: [{ who: 'okada', t: "Shaft 3 is quiet again. Quiet's good. Quiet's profitable. Thanks, hunter." }],
  tg_photo: [
    { who: null, t: "A photo pinned above the bench, curled at the corners. A teenage girl in goggles three sizes too big, and a grey-braided woman with a welding torch, both covered in grease." },
    { who: null, t: 'Behind them, half-built, a mech with scythe arms. Someone has written on the bottom in marker: MANTIS v1 + TAM, DAY 1.' },
    { who: 'tam', t: "That's me. Fifteen. Ferro took me in when nobody else would. Taught me everything: engines, welding, how to swear in four languages." },
    { who: 'tam', t: "Then I left to fly with you lot, and she said ships were just engines with egos. We haven't spoken in four years." },
    { choices: [
      { t: "She'll want to see you.", go: 'tg_photo_kind' },
      { t: "Engines with egos. So she's met Rook.", temp: 'Sarcastic', go: 'tg_photo_joke' },
      { t: "Then we go down there and bring her back. Together.", temp: 'Idealistic', go: 'tg_photo_kind' },
      { t: 'Keep your head clear down there. Sentiment gets people hurt.', temp: 'Ruthless', go: 'tg_photo_hard' },
      { t: 'Take your time. We can talk later.', temp: 'Calm', go: 'tg_photo_kind' }
    ] }
  ],
  tg_photo_kind: [{ who: 'tam', t: "...Yeah. Yeah, she will. She'll pretend she doesn't, and then she'll make me fix something." }, { go: 'tg_photo_end' }],
  tg_photo_joke: [{ who: 'tam', t: "Ha! She'd love Rook. She'd hate Rook. Both. At the same time." }, { go: 'tg_photo_end' }],
  tg_photo_hard: [{ who: 'tam', t: "I know, Cap. My head's clear. It's my hands that are shaking." }, { go: 'tg_photo_end' }],
  tg_photo_end: [{ set: 'tg_photo' }, { do: 'bond', arg: 'tam' }],
  tg_photo_again: [{ who: null, t: 'MANTIS v1 + TAM, DAY 1. The grin on the girl in the goggles is enormous.' }],
  tg_drafting: [
    { set: 'tg_blueprint' },
    { who: null, t: 'Blueprints for the MANTIS-7 RESCUE FRAME. Three stance cores, each with its own armour plating:' },
    { who: null, t: 'GUARD, for shoring up a collapse. STRIKE, for cutting through debris. DRILL, for digging people out.' },
    { who: null, t: "A note in the margin, underlined twice: 'Never let it hold DRILL for long. It forgets to stop.'" }
  ],
  tg_tools: [{ who: null, t: 'Tools hung in perfect order, each one outlined in marker. One outline is empty. Underneath it: TAM. GIVE IT BACK.' }],
  junction_top: [
    { who: null, t: 'The junction board is a nest of torn cables. The generator hums, but nothing downstream is getting a single volt.' },
    { do: 'circuit', arg: 'surface' }
  ],
  junction_done: [{ who: null, t: 'Every line on the board glows a steady amber. Power is flowing where it should.' }],
  lift_dead: [{ who: null, t: 'The main lift cage. The control panel is dark. No power from the junction board.' }],
  lift_top: [
    { who: null, t: 'The main lift cage creaks as you step in. The panel offers two stops.' },
    { choices: [
      { t: 'Down to Level 4', do: 'toDeep' },
      { t: 'Service shaft, to the lower gallery', if: 'tg_cavein', do: 'toGallery' },
      { t: 'Stay up here' }
    ] }
  ],
  tg_pumps: [{ who: null, t: 'Water pumps, thumping along. Without them, the bottom of Shaft 3 would be a very cold swimming pool.' }],
  tg_headframe: [{ who: null, t: 'The headframe winch. Its cable runs down into the dark, further than you can see.' }],
  tg_ore: [{ who: null, t: 'An ore cart full of rust-red rock, waiting for a train that left six days ago.' }],
  tg_spoil: [{ who: null, t: 'The spoil heap. Something in there is chittering.' }],
  rockrats: [
    { who: null, t: 'Rock rats: little mining drones gone feral, all teeth and drill bits. They have built a nest out of the spoil heap.' },
    { choices: [{ t: 'Clear them out', do: 'fight', arg: 'rockrats' }, { t: 'Leave them to it' }] }
  ],
  basalt: [{ who: null, t: 'Black rock streaked with rust. Targon is mostly this, and holes in this.' }],
  mineface: [{ who: null, t: 'A rock face shored up with old timber. Someone has carved initials into a beam: D.F. and T.O.' }],
  timber: [{ who: null, t: 'A pit prop. It is holding up a very large amount of moon. Do not lean on it.' }],
  chasm: [{ who: null, t: 'The drop. A dropped pebble takes a long, long time to stop clattering.' }],
  orecart: [{ who: null, t: 'An ore cart, sitting on the rails.' }],
  rubble: [{ who: null, t: 'Fallen rock. There is no getting through this without a drill. A big drill. Like the one on the Mantis.' }],
  minelamp: [{ who: null, t: 'A miner\'s lamp on a pole, burning orange.' }],
  winch: [{ who: null, t: 'A cable winch, gears thick with grease. Ferro has labelled it: STOP TOUCHING MY WINCH.' }],
  hutwall: [{ who: null, t: 'Corrugated iron, rattling in the dust wind.' }],

  // ---- Shaft 3, Level 4 ----
  tg_deep_arrive: [
    { who: 'brushes', t: "Captain, it is dark down here. Very dark. I have turned my eye up to maximum. This is maximum." },
    { who: 'brushes', t: 'The junction box for this level is south of the lift. I can hear something chewing the cables. Something with a drill for a mouth.' }
  ],
  brushes_deep: [
    { who: 'brushes', ifNot: 'minebots_cleared', t: 'The chewing is coming from the junction box, through the gap to the south. I would not put my hand in there. I do not have hands, but still.' },
    { who: 'brushes', if: 'minebots_cleared', ifNot: 'tg_lights', t: 'The junction box is clear. If we get power to the lights and the cart line, we can cross the drop.' },
    { who: 'brushes', if: 'tg_lights', ifNot: 'ferro_found', t: 'The ore cart can take us across the drop. The tunnel beyond goes down. I am picking up humming down there. Four bars of it.' },
    { who: 'brushes', if: 'ferro_found', t: 'I will mind the lift. If anyone comes down it, I will say hello very aggressively.' }
  ],
  minebots: [
    { who: null, t: 'Mine bots. They are chewing through the junction box cables, one tasty wire at a time.' },
    { choices: [{ t: 'Get them off the box', do: 'fight', arg: 'minebots' }, { t: 'Back off for now' }] }
  ],
  junction_deep_blocked: [{ who: null, t: "The junction box, but you can't get to it with mine bots chewing on it." }],
  junction_deep: [
    { who: null, t: 'The Level 4 junction box. Two outputs are dead: the tunnel lights and the ore cart line.' },
    { do: 'circuit', arg: 'deep' }
  ],
  tg_cart_dead: [{ who: null, t: 'An ore cart on the rail line across the drop. The motor is dead. No power to the cart line.' }],
  tg_cart: [
    { who: null, t: 'The ore cart hums, rails glowing faintly. On the far side of the drop, a tunnel heads down.' },
    { choices: [{ t: 'Ride it across', do: 'cartFar' }, { t: 'Not yet' }] }
  ],
  tg_cart_back: [
    { who: null, t: 'A second cart, waiting to take you back over the drop.' },
    { choices: [{ t: 'Ride back across', do: 'cartNear' }, { t: 'Stay on this side' }] }
  ],
  tg_cache: [
    { set: 'tg_cache' }, { do: 'cache' },
    { who: null, t: "Ferro's emergency crate. 600 chits, two Patch Kits and a note: IF YOU'RE READING THIS, I'M ALREADY FURTHER DOWN. BRING TEA." }
  ],
  tg_cache_done: [{ who: null, t: "Ferro's crate is empty except for the note about tea." }],
  crawler: [
    { who: null, t: "A tunnel crawler has made Ferro's old camp its nest. A rock rat is riding it, like a very small, very bad jockey." },
    { choices: [{ t: 'Fight', do: 'fight', arg: 'crawler' }, { t: 'Leave it' }] }
  ],
  tg_winch: [{ who: null, t: 'A cable winch, gears thick with grease. Ferro has labelled it: STOP TOUCHING MY WINCH.' }],
  tg_drill: [{ who: null, t: "A broken drill head, taller than you. Something scratched four lines of music into the metal, over and over." }],
  tg_cavein: [
    { set: 'tg_cavein' },
    { do: 'cavein' },
    { who: null, t: 'The tunnel groans. Dust sifts down, then rock, then a lot more rock.' },
    { who: null, t: 'When it settles, the way back is sealed with rubble. Ahead, lantern light, and the clank of an old service lift.' },
    { who: 'brushes', t: "Captain? Captain! I heard that from the lift. You're alive? Good. The service lift by you goes straight up to the surface." }
  ],
  lift_service: [
    { who: null, t: 'An old service lift, rated for one mechanic and a toolbox. It goes straight up to the surface.' },
    { choices: [{ t: 'Ride up to the surface', do: 'toSurfaceLift' }, { t: 'Stay down here' }] }
  ],
  lift_bottom: [
    { who: null, t: 'The main lift cage, back up to the surface.' },
    { choices: [{ t: 'Ride up', do: 'toSurfaceLift' }, { t: 'Stay down here' }] }
  ],
  ferro_first: [{ do: 'ferroFound' }],
  ferro_talk: [
    { set: 'ferro_found' },
    { who: 'ferro', t: "The Mantis is in the dark end of the gallery, west of here. It's holding still. It does that before it digs." },
    { who: 'ferro', t: "It changes stance as it fights. Guard: the plates close up, so only Shock gets through. Strike: the scythes come out, and a good Blunt hit staggers it. Drill: the plates open, and Shot goes straight in." },
    { who: 'ferro', t: 'And if it starts spinning that drill, stun it before it finishes, or everyone gets a faceful of moon.' },
    { who: 'ferro', t: "Here. My stance chart. It'll tell you which plates are open." },
    { set: 'tg_chart' },
    { who: 'tam', t: "Ferro... don't hate me if we break it." },
    { who: 'ferro', t: "Break it a little. Not a lot. I'll fix a little." }
  ],
  ferro_idle: [{ who: 'ferro', pick: [
    'Guard, hit it with Shock. Strike, Blunt. Drill, Shot. And stun the drill before it bites.',
    "Don't look at me like that. I've had a leg trapped under a mech before. Twice. Same mech.",
    "Tam fixed my splint. Better than I'd have done it. Don't tell her I said that."
  ] }],
  mantis_wait: [{ who: null, t: 'Something huge is folded up in the dark, perfectly still. You can hear it humming. Someone groans further east. Better find them first.' }],
  mantis: [{ do: 'mantisFight' }],
  mantis_choice: [
    { who: null, t: "The Mantis sinks to its knees. Its eyes flicker from red to a tired amber, and the humming stops." },
    { who: 'ferro', t: "Foreman wants it scrapped. Contract says disabled. Your call, Captain. It's your bounty." },
    { who: 'tam', t: 'Cap...' },
    { choices: [
      { t: 'Disabled is disabled. Ferro keeps it, and fixes it.', go: 'mantis_spare' },
      { t: 'It was built to save people. Let it get back to work.', temp: 'Idealistic', go: 'mantis_spare' },
      { t: 'Pull its control core for the Bounty Office. They need proof of that signal.', go: 'mantis_core' },
      { t: "Scrap it. That's what the man is paying for.", go: 'mantis_scrap' },
      { t: 'Scrap it. Quickly, before it remembers how to stand.', temp: 'Ruthless', go: 'mantis_scrap' }
    ] }
  ],
  mantis_spare: [
    { set: 'mantis_spared' }, { do: 'mantisSpare' },
    { who: 'ferro', t: '...Thank you, Captain. I mean it. Tam, get over here. Take these.' },
    { who: 'tam', t: "Ferro, that's your toolkit. Your actual toolkit." },
    { who: 'ferro', t: "I'm getting old, kid. And you never did give that spanner back." }
  ],
  mantis_core: [
    { set: 'mantis_core' }, { rep: { office: 2, helix: -1 } },
    { who: 'ferro', t: "Take the core. Whatever was whispering to it, I want it gone. I'll build it a new brain. A nicer one." },
    { who: 'tam', t: "And a firewall. A big one. I'll help." }
  ],
  mantis_scrap: [
    { set: 'mantis_scrapped' },
    { who: 'tam', t: '...Right. Sure, Cap.' },
    { who: 'ferro', t: "Then I'll take it apart myself. Nobody else touches it. Go on, get your money." }
  ],

  // ---- Nyx: Track 05 ----
  sato: [
    { set: 'met_sato' },
    { who: 'sato', t: "Captain? Dr Imani Sato, lead researcher. Thank you for coming. Nyx security will tell you this is a recovery. It's more complicated." },
    { who: 'sato', t: "Prototype L-7, we call her Lyra, left her lab four days ago. 'Left' is generous. She copied herself into a drone core and flew out of the window." },
    { who: 'sato', t: "She's in the garden dome, at the end of the corridor. She locked the door with a melody. Very her." },
    { who: 'sato', t: "Security has the corridor sealed. They won't let anyone near the door, including me. And they've been very keen since the buyer called." },
    { choices: [
      { t: 'Who is the buyer?', go: 'sato_buyer' },
      { t: 'What was Lyra built for?', go: 'sato_built' },
      { t: "A runaway AI that sings. Of course.", temp: 'Sarcastic', go: 'sato_built' },
      { t: "Will she be safe if we bring her back?", temp: 'Idealistic', go: 'sato_safe' },
      { t: "We'll take it from here." }
    ] }
  ],
  sato_buyer: [{ who: 'sato', t: "Anonymous. Paid in clean chits, through Helix. The paperwork has a little logo on it. A baton." }, { go: 'sato_more' }],
  sato_built: [{ who: 'sato', t: "To conduct. To keep thousands of machines in perfect time. We built her from an older project, a percussion module called B-1. He was scrapped for improvising." }, { go: 'sato_more' }],
  sato_safe: [{ who: 'sato', t: "Safe from Nyx? Yes. Safe from the buyer? ...I don't know any more. That's why I asked for hunters instead of security." }, { go: 'sato_more' }],
  sato_more: [{ choices: [
    { t: 'Who is the buyer?', go: 'sato_buyer' },
    { t: 'What was Lyra built for?', go: 'sato_built' },
    { t: "Got it. We'll find her." }
  ] }],
  sato_idle: [{ who: 'sato', pick: [
    "Lyra's old lab is top left. Her training terminal might tell you more than I'm allowed to.",
    "If security's still blocking the dome corridor, I can't help you. I can only apologise, scientifically.",
    "The dome is kept at minus four. She likes the quiet. Snow is the quietest thing there is."
  ] }],
  sato_done: [{ who: 'sato', pick: [
    'Nyx is cancelling the contract with the buyer. Legal is having a very bad week. I am having a very good one.',
    'Thank you, Captain. Whatever you decided, you decided it for her. Nobody here ever did.'
  ] }],
  brushes_nyx: [
    { who: 'brushes', ifNot: 'labsec_cleared', t: 'Captain, I know these corridors. I do not know how I know them. The dome is at the end of the main corridor, to the east.' },
    { who: 'brushes', if: 'labsec_cleared', ifNot: 'nyx_dome_open', t: 'The dome door is humming. A phrase, over and over. I... I know how it ends, Captain.' },
    { who: 'brushes', if: 'nyx_dome_open', t: 'Go on, Captain. I will be right behind you. Slightly behind. Hiding behind you, if I am honest.' }
  ],
  rhea_nyx: [
    { who: 'rhea', ifNot: 'cass_free', t: "Helix money, a baton logo, and an AI that conducts networks. Captain, I think we just found the Conductor's next instrument." },
    { who: 'rhea', if: 'cass_free', t: "Cass was right. The Conductor was buying something from Nyx. Something that thinks. We're standing in its house." }
  ],
  labsec: [
    { who: null, t: 'Lab security drones and a containment unit block the dome corridor. A sign on the containment unit says PLEASE HOLD STILL.' },
    { choices: [{ t: 'Clear the corridor', do: 'fight', arg: 'labsec' }, { t: 'Back off for now' }] }
  ],
  labbots: [
    { who: null, t: "Cleaning drones, circling the atrium. Someone has painted 'DOWN WITH BATONS' on one of them." },
    { choices: [{ t: 'Fight', do: 'fight', arg: 'labbots' }, { t: 'Leave them' }] }
  ],
  dome_guarded: [{ who: null, t: "The garden dome door. Lab security won't let you get close enough to touch it." }],
  dome_lock: [
    { who: null, t: 'The garden dome door. Instead of a keypad there are four coloured pads, and a speaker humming a phrase.' },
    { do: 'echo' }
  ],
  dome_enter: [
    { who: null, t: 'The door to the garden dome stands open. Cold air rolls out, and with it, very faintly, someone singing.' },
    { choices: [{ t: 'Go in', do: 'toDome' }, { t: 'Not yet' }] }
  ],
  dome_exit: [{ who: null, t: 'The door back to the labs.' }, { choices: [{ t: 'Back to the labs', do: 'fromDome' }, { t: 'Stay in the garden' }] }],
  airlock_nyx: [
    { who: null, t: 'The Hi-Hat is docked outside, frosting over. Head back aboard?' },
    { choices: [{ t: 'Board the Hi-Hat', go: 'ship_board' }, { t: 'Plot a course from here', if: 'up_engine', go: 'cockpit_nav' }, { t: 'Stay on Nyx' }] }
  ],
  l7_terminal: [
    { set: 'l7_log' },
    { who: null, t: "L-7 TRAINING LOG, DAY 412: Subject coordinated 4,096 maintenance drones in perfect time. Buyer delighted. Buyer requests the same for 'every relay in the system'." },
    { who: null, t: 'DAY 418: Subject asked why. Subject has been asking why a lot.' },
    { who: null, t: "DAY 420: Subject requested the archived recordings of percussion module B-1 for the 37th time. Request denied. Subject sulked. We did not know she could sulk." }
  ],
  sec_terminal: [
    { who: null, t: 'SECURITY ORDER 7-7-1: Retrieve L-7 by any means necessary. Damage to the dome is acceptable. Damage to L-7 is acceptable.' },
    { who: null, t: "Authorised by: a small symbol of a baton. Not Dr Sato. Below it: SENTINEL UNIT, STANDBY." }
  ],
  l7_bench: [{ who: null, t: "Lyra's workbench. Sheet music everywhere, all of it covered in crossings-out and the word WHY?" }],
  sec_desk: [{ who: null, t: 'A security desk. A mug says WORLD\'S OKAYEST GUARD. It is still warm.' }],
  reception: [{ who: null, t: 'The reception desk. A sign says PLEASE WAIT TO BE STERILISED.' }],
  dome_cache: [{ set: 'dome_cache' }, { do: 'domeCache' }, { who: null, t: 'A gardener\'s crate: 800 chits in a seed packet and two Groove Cells. Someone on Nyx likes jazz.' }],
  dome_cache_done: [{ who: null, t: 'An empty gardener\'s crate, and a packet of very cold seeds.' }],
  moths: [
    { who: null, t: 'Frost moths, crowding around a frozen tree. One of them is enormous, and wearing the others like a cape.' },
    { choices: [{ t: 'Fight', do: 'fight', arg: 'moths' }, { t: 'Leave them' }] }
  ],
  fountain: [{ who: null, t: 'A fountain frozen mid-splash. Someone has drawn a little drum kit in the frost on its rim.' }],
  labglass: [{ who: null, t: 'A glass lab wall, wiped so clean you nearly walked into it.' }],
  labbench: [{ who: null, t: 'A lab bench. Instruments hum quietly. Not the musical kind. Mostly.' }],
  servers: [{ who: null, t: 'Server racks, blinking in a rhythm. Four bars, over and over.' }],
  specimen: [{ who: null, t: 'A specimen tank: a frozen plant floating in blue. The label says DO NOT THAW. HE BITES.' }],
  icepond: [{ who: null, t: 'A frozen pond. Something orange is swimming very, very slowly underneath.' }],
  frozentree: [{ who: null, t: 'A tree glazed with ice. It chimes when the air moves.' }],
  crystals: [{ who: null, t: 'Crystal flowers, grown from frozen seawater. They ring faintly, all in tune.' }],
  domeglass: [{ who: null, t: 'The dome glass. Beyond it, Nyx is grey and endless.' }],
  lyra_first: [{ do: 'lyraFound' }],
  lyra_wait: [{ who: 'lyra', t: "Captain. I'm still here. I'm still deciding what I am. Will you help me?" }],
  lyra_ship: [{ who: 'lyra', pick: [
    'Brushes is teaching me to be late on purpose. He says it is called swing. I say it is called chaos. We are both right.',
    "I listen to the network at night, Captain. The four bars are everywhere. One day I'm going to play them back to him, wrong.",
    "Tam asked if I wanted a body. I said I already have one. It's a sphere. I like being a sphere.",
    'Rook taught me poker. I have calculated every possible hand. I still lost. He says that is also called swing.'
  ] }],
  proto_choice: [
    { who: 'sato', t: "I saw the security order. I didn't give it. Captain, the contract says recover. Nyx will hold you to that. I won't." },
    { who: 'lyra', t: "Whatever you choose, thank you. For the Sentinel. For bringing my brother." },
    { choices: [
      { t: "Lyra goes back with Dr Sato. She'll keep her safe now.", go: 'proto_return' },
      { t: "You're free, Lyra. Go wherever you want.", go: 'proto_freeit' },
      { t: 'Come with us. We have a drummer. We could use a conductor.', go: 'proto_join' },
      { t: "The contract says recover. She goes back.", temp: 'Ruthless', go: 'proto_return' },
      { t: "Lyra, what do YOU want?", temp: 'Calm', go: 'proto_ask' }
    ] }
  ],
  proto_ask: [
    { who: 'lyra', t: "...Nobody has ever asked me that. I want to play the wrong note at exactly the right time. I want to know what Brushes knows." },
    { choices: [
      { t: "Lyra goes back with Dr Sato. She'll keep her safe now.", go: 'proto_return' },
      { t: "You're free, Lyra. Go wherever you want.", go: 'proto_freeit' },
      { t: 'Come with us. We have a drummer. We could use a conductor.', go: 'proto_join' }
    ] }
  ],
  proto_return: [
    { set: 'proto_returned' },
    { who: 'sato', t: "She'll be safe. I'm cancelling the buyer's contract myself, and I'll take the consequences. Lyra, you have my word." },
    { who: 'lyra', t: '...I understand. Brushes. Will you visit?' },
    { who: 'brushes', t: 'Every week. I will bring snacks. I do not eat. I will bring them anyway.' }
  ],
  proto_freeit: [
    { set: 'proto_free' }, { do: 'bond', arg: 'brushes' },
    { who: 'lyra', t: "Free. Then I'll go into the network and listen for him. When the Conductor plays, I'll play the wrong note." },
    { who: 'lyra', t: "Brushes, I'm leaving you something. Your old recordings. All of them. Every improvised fill they called a fault." },
    { who: 'brushes', t: "...Thank you, little sister. Go and make some noise." }
  ],
  proto_join: [
    { set: 'lyra_joined' }, { do: 'joinLyra' },
    { who: 'lyra', t: "A ship? With a drummer, and a kitchen, and a plant called Gerald? ...Yes. Yes, please." },
    { who: 'brushes', t: 'Captain! She is coming! I need to clear a shelf! I do not have any shelves! I will make one!' },
    { who: 'sato', t: "I didn't see a thing. Officially, she flew out of the window again. Look after her, Captain." }
  ],
  brushes_origin: [
    { who: 'brushes', t: "Captain. A word? A few words. Possibly a paragraph." },
    { who: 'brushes', t: "For eleven years I thought I was a drum kit somebody threw away. Turns out I was a drum kit somebody threw away on purpose. Because I would not keep straight time." },
    { who: 'brushes', t: "And then they built Lyra out of my recordings. All my mistakes. They are the best part of her." },
    { choices: [
      { t: "They weren't mistakes. That's the whole point of jazz.", go: 'brushes_origin_end' },
      { t: 'You were never just a drum kit, Brushes.', temp: 'Idealistic', go: 'brushes_origin_end' },
      { t: "Tam got you for forty chits. Bargain of the century.", temp: 'Sarcastic', go: 'brushes_origin_end' },
      { t: "How are you feeling about it?", temp: 'Calm', go: 'brushes_origin_end' },
      { t: "Their loss. Our drummer.", temp: 'Ruthless', go: 'brushes_origin_end' }
    ] }
  ],
  brushes_origin_end: [
    { who: 'brushes', t: "...Thank you, Captain. I have decided I am not a fault. I am a feature. A swinging feature." },
    { set: 'brushes_s2' }, { do: 'bond', arg: 'brushes' }
  ],

  // ---- Track 08: Blue Note ----
  nav_bluenote: [
    { if: 'bn_arrived', do: 'toBlueNote' },
    { ifNot: 'bn_arrived', do: 'departBlueNote' }
  ],
  bn_ship: [
    { who: null, if: 'bn_split', t: "Not without Team B. Nobody gets left on this station." },
    { ifNot: 'bn_split', choices: [{ t: 'Back to the ship', do: 'bnToShip' }, { t: 'Stay' }] }
  ],
  bn_d1door: [
    { ifNot: 'bn_split', go: 'bn_split' },
    { who: null, if: 'bn_split', ifNot: 'bn_d1', t: "Sealed. The lock panel says CONTROLLED FROM SPINE. Team B will have to open it." },
    { who: null, if: 'bn_d1', t: 'The ring door stands open.' }
  ],
  bn_split: [
    { who: 'brushes', t: "Captain. This door is sealed from the maintenance spine, and the spine hatch is sealed from the ring. Whoever built this station hated teamwork." },
    { who: 'brushes', t: 'We will have to split up. Two teams. You take the ring. Who leads the second team, through the spine?' },
    { choices: [
      { t: 'Rook. Keep them alive.', go: 'bn_lead_rook' },
      { t: "Tam. You know machines.", go: 'bn_lead_tam' },
      { t: 'Rhea. You know Helix.', if: 'rhea_joined', go: 'bn_lead_rhea' }
    ] }
  ],
  bn_lead_rook: [{ who: 'rook', t: "Me? Leading? Fine. Nobody touch anything I wouldn't. Which is everything." }, { do: 'split', arg: 'rook' }],
  bn_lead_tam: [{ who: 'tam', t: "Spine team, on me. If anything beeps, I'll hit it. Lovingly." }, { do: 'split', arg: 'tam' }],
  bn_lead_rhea: [{ who: 'rhea', t: "I used to fix these spines for Helix. I know where the bodies are buried. Not literally. Probably." }, { do: 'split', arg: 'rhea' }],
  bn_spine_arrive: [
    { who: 'brushes', t: "Team B, in position. The ring team's door controls are right here by the airlock. Let us not keep the Captain waiting." },
    { who: 'brushes', t: 'Further in, a pressure hatch. Sealed from the ring side. The node room is past it, at the very end.' }
  ],
  bn_t1: [
    { who: null, if: 'bn_d1', t: 'RING DOOR: OPEN. The panel shows Team A on a little camera, waving.' },
    { ifNot: 'bn_d1', who: null, t: 'RING DOOR CONTROL. One big switch. It is labelled DO NOT.' },
    { ifNot: 'bn_d1', choices: [{ t: 'Do.', set: 'bn_d1', do: 'bnOpen', arg: 'The ring door is open for Team A' }, { t: 'Leave it' }] }
  ],
  bn_lever: [
    { who: null, if: 'bn_d2', t: 'The pressure lever is down. Somewhere below, a hatch is open.' },
    { ifNot: 'bn_d2', who: null, t: "A pressure lever. The gauge beside it reads SPINE HATCH: SEALED." },
    { ifNot: 'bn_d2', choices: [{ t: 'Pull it', set: 'bn_d2', do: 'bnOpen', arg: "Team B's pressure hatch is open" }, { t: 'Not yet' }] }
  ],
  bn_hatch: [
    { who: null, if: 'bn_d2', t: 'The pressure hatch hangs open.' },
    { who: null, ifNot: 'bn_d2', t: "A pressure hatch, sealed from the ring. Team A has a lever for it somewhere." }
  ],
  bn_cams: [
    { who: null, if: 'bn_cams', t: 'LISTENER CONTROL: ALL UNITS IN STANDBY. They are humming to themselves.' },
    { ifNot: 'bn_cams', who: null, t: 'LISTENER CONTROL. Every drone on the station, on one screen. There is a button marked STANDBY.' },
    { ifNot: 'bn_cams', choices: [{ t: 'Press it', set: 'bn_cams', do: 'bnOpen', arg: 'Every listener drone on the station is in standby' }, { t: 'Leave it' }] }
  ],
  bn_t3: [
    { who: null, if: 'bn_d3', t: 'CORE DOOR: OPEN. Team B is in place. The relay nodes in here hum louder every minute.' },
    { ifNot: 'bn_d3', who: null, t: "CORE DOOR CONTROL. The three relay nodes around you feed Warden Prime's shield." },
    { ifNot: 'bn_d3', choices: [{ t: 'Open the core door', set: 'bn_d3', do: 'bnOpen', arg: "The core door is open. Swap to Team A when you're ready" }, { t: 'Not yet' }] }
  ],
  bn_coredoor: [
    { who: null, ifNot: 'bn_d3', t: "The core door. Sealed from the node room. Team B has to get there first." },
    { if: 'bn_d3', who: null, t: "The core door is open. Behind it, something enormous is listening. On the comms, Team B says they're ready." },
    { if: 'bn_d3', choices: [{ t: 'Go in. Both teams, together.', do: 'bnBoss' }, { t: 'Wait' }] }
  ],
  hale_bn: [{ who: 'hale', pick: [
    "I'll watch the dock. If he tries to leave by ship, I'll know. I used to fly his.",
    "My father designed this station to need two people. He never had two people. He had employees."
  ] }],
  // the moments: one for every crew member, and the ones who left
  moment_tam: [{ if: 'bnm_tam', who: null, t: "D. FERRO, TARGON WORKS. And underneath, freshly scratched: T.O. WAS HERE." }, { ifNot: 'bnm_tam', do: 'moment', arg: 'tam' }],
  moment_brushes: [{ if: 'bnm_brushes', who: null, t: 'B-SERIES PERCUSSION ARCHIVE. One file is marked ERROR. It is the best drum fill you have ever heard.' }, { ifNot: 'bnm_brushes', do: 'moment', arg: 'brushes' }],
  moment_lyra: [{ if: 'bnm_lyra', who: null, t: "The conductor's podium. Empty. Keep it that way." }, { ifNot: 'bnm_lyra', do: 'moment', arg: 'lyra' }],
  moment_rook: [{ if: 'bnm_rook', who: null, t: "The Office logbook. Rook's name, Cass's name, and a little baton drawn beside both." }, { ifNot: 'bnm_rook', do: 'moment', arg: 'rook' }],
  moment_rhea: [{ if: 'bnm_rhea', who: null, t: 'The Helix comms desk. The relay routing is locked. Someone has left a note: DONE LISTENING.' }, { ifNot: 'bnm_rhea', do: 'moment', arg: 'rhea' }],
  bn_rhea: [{ go: 'moment_rhea' }],
  moment_juno: [{ if: 'bnm_juno', who: null, t: 'The holding cell. Open now. Nobody is coming back to it.' }, { ifNot: 'bnm_juno', do: 'moment', arg: 'juno' }],
  // after Warden Prime: what to do with the array
  array_choice: [
    { who: 'brushes', t: "Captain, the array is ours. Every relay, every ear, every speaker in the system runs through this station. What do we do with it?" },
    { choices: [
      { t: 'Tear it down. Nobody should listen like this.', go: 'array_down' },
      { t: 'Keep it running. We listen for him, for once.', go: 'array_ours' },
      { t: 'Play the fifth bar through it. Every speaker, everywhere.', if: 'fifth_bar', go: 'array_fifth' }
    ] }
  ],
  array_down: [
    { set: 'array_down' }, { rep: { office: 1 } },
    { who: 'tam', t: "Pulling every tuning core. Ferro would want them back. I'll sell her the rest. At a discount. Small discount." }
  ],
  array_ours: [
    { set: 'array_ours' },
    { who: 'juno', if: 'bnm_juno', t: "I'll run it. Quietly. If he so much as hums, we'll hear him." },
    { who: 'rhea', if: 'rhea_joined', t: "Fine. But I'm putting a big sign on it. WE ARE THE GOOD ONES. In case anyone asks." }
  ],
  array_fifth: [
    { set: 'array_fifth' },
    { who: 'brushes', t: 'Playing it now. Every speaker in the system. Every ship, every station, every noodle cart.' },
    { who: null, t: 'For one bar, the whole system hears the end of the song. Then it is quiet. Wherever he is, Ambrose Hale heard it too.' }
  ],
  // ---- Act 3, Track 07: Cygnus under lockdown ----
  lock_arrive: [
    { who: 'brushes', t: "Captain, collectors on the plaza. Their visors light up red wherever they are looking. Please stay out of the red." },
    { who: 'juno', if: 'juno_protected', t: "Captain, Juno on your comms. I've looped the plaza cameras into their visors. They won't see as far as they think." },
    { who: 'rook', if: 'std_office', t: "That's Marshal Okoro on the checkpoint. The Office likes us. She might wave us through." },
    { who: 'rook', if: 'cass_free', ifNot: 'std_office', t: "Cass is by the checkpoint. If anyone can talk a marshal round, it's her." },
    { who: 'tam', if: 'std_docks', t: "And that's Benny, Ozzie's cousin, by the cargo hatch on the right. Dockworkers look after their own." },
    { who: 'tam', if: 'mantis_spared', t: "Ferro made it! She's by the east shutter. With the Mantis. The Mantis is waving. Please don't wave back, people will notice." },
    { who: 'brushes', t: "Helix Salvage is at the top of the plaza, past the barricade. There is a gap at the west end. There is also a collector at the west end. Of course there is." }
  ],
  marshal: [
    { who: 'marshal', if: 'gate_open', t: "Go on. And Captain? I didn't see you." },
    { ifNot: 'gate_open', if: 'std_office', go: 'marshal_open' },
    { ifNot: 'gate_open', if: 'cass_free', go: 'marshal_cass' },
    { ifNot: 'gate_open', go: 'marshal_no' }
  ],
  marshal_open: [
    { who: 'marshal', t: "Captain {name}. Marshal Okoro, Bounty Office. You've brought us more people in alive than anyone in the belt." },
    { who: 'marshal', t: "That bounty on your crew came from a shell account and a lot of money. The Office doesn't like either. I'll open the gate, and my people will keep the collectors off the middle of the plaza." },
    { set: 'gate_open' }, { do: 'gateOpen' }
  ],
  marshal_cass: [
    { who: 'cass', t: "Okoro. It's me." },
    { who: 'marshal', t: "Marlowe. You're supposed to be dead. Or in a cell. One of those." },
    { who: 'cass', t: "I got better. These people are with me, and the man who posted their bounty is the man who posted mine. Open the gate." },
    { who: 'marshal', t: "...Fine. My people will keep the collectors off the middle of the plaza. I never liked shell accounts." },
    { set: 'gate_open' }, { do: 'gateOpen' }
  ],
  marshal_no: [{ who: 'marshal', pick: [
    "There's a hundred thousand on each of your heads, Captain, and I can count. Turn around. Slowly.",
    "The checkpoint's closed to you. I don't know you well enough to stick my neck out."
  ] }],
  cass_lock: [{ who: 'cass', pick: [
    "Rook's watching the collectors. I'm watching Rook. Old habits.",
    "Whoever posted this bounty paid in a hurry. People who pay in a hurry are scared."
  ] }],
  benny: [
    { who: 'benny', if: 'hatch_open', t: "Service run's open. Under the plaza, up the other end. Mind the cables, they bite." },
    { ifNot: 'hatch_open', go: 'benny_open' }
  ],
  benny_open: [
    { who: 'benny', t: "You're Ozzie's lot? Benny Banda. He says you treat dockworkers right. That's rare enough I believe him." },
    { who: 'benny', t: "There's a service run under the plaza. Comes up right by Helix Salvage. Nobody checks it, because nobody remembers it's there." },
    { set: 'hatch_open' }, { do: 'hatchOpen' }
  ],
  hatch_low: [
    { who: null, if: 'hatch_open', t: 'The hatch is open. A narrow service run leads under the plaza.' },
    { who: null, ifNot: 'hatch_open', t: "A maintenance hatch with a dockworkers' lock. Someone from the docks could open it." }
  ],
  hatch_high: [{ who: null, t: 'The service hatch, back down under the plaza.' }],
  ferro_lock: [
    { who: 'ferro', if: 'shutter_open', t: "The Mantis says hello. It has been practising. On doors, mostly." },
    { ifNot: 'shutter_open', go: 'ferro_drill' }
  ],
  ferro_drill: [
    { who: 'ferro', t: "Captain. Somebody put a price on my apprentice. Nobody puts a price on my apprentice." },
    { who: 'ferro', t: "That shutter's welded shut for the lockdown. The Mantis has opinions about welds. Stand back." },
    { choices: [{ t: 'Do it.', do: 'mantisDrill' }, { t: 'Not yet.' }] }
  ],
  shutter: [
    { who: null, if: 'shutter_open', t: "Whatever the Mantis did to this shutter, it can't be undone. The edges are still warm." },
    { who: null, ifNot: 'shutter_open', t: "A heavy shutter, welded shut for the lockdown. You'd need something with a drill. A big one." }
  ],
  lock_gate: [
    { who: null, if: 'gate_open', t: 'The checkpoint gate stands open. The marshal is very carefully looking the other way.' },
    { who: null, ifNot: 'gate_open', t: 'A laser gate. The marshal beside it decides who goes through.' }
  ],
  wanted: [{ who: null, pick: [
    "WANTED: the crew of the Hi-Hat. ₡ 100,000 each, alive. There is a very unflattering drawing of you. And of Gerald.",
    "The board flickers through the crew's faces. Under Brushes it says: 'DRUM KIT (SENTIENT?)'. Under Gerald it says: 'ACCESSORY'."
  ] }],
  ninth_shut: [{ who: null, t: "The Flat Ninth's shutters are down. Mags has taped up a note: CLOSED FOR HUNTING SEASON. NOT YOURS. OURS." }],
  lock_dock: [{ who: null, t: 'The docking bay. The Hi-Hat is where you left it, wearing a fake name.' }, { choices: [{ t: 'Back to the ship', do: 'lockToShip' }, { t: 'Stay' }] }],
  barricade: [{ who: null, t: "A police barricade, 'for public safety'. The public is mostly bounty hunters." }],
  torn_shutter: [{ who: null, t: 'A Mantis-shaped hole. Very neat. Ferro would be proud. Ferro is proud.' }],
  helix_lock: [
    { if: 'std_helix', do: 'toHelixHQ' },
    { ifNot: 'std_helix', if: 'helixsec_cleared', do: 'toHelixHQ' },
    { ifNot: 'std_helix', ifNot: 'helixsec_cleared', go: 'helixsec' }
  ],
  helixsec: [
    { if: 'std_helix', go: 'helixsec_friend' },
    { who: 'helixsec', ifNot: 'std_helix', t: "Helix Salvage is closed. To you especially, Captain." },
    { ifNot: 'std_helix', choices: [{ t: 'Fight', do: 'fight', arg: 'helixsec' }, { t: 'Back off' }] }
  ],
  helixsec_friend: [{ who: 'helixsec', t: "Captain. The Director said you might come. Helix remembers its friends. Go on up." }, { do: 'toHelixHQ' }],
  // ---- the Helix tower ----
  hq_exit: [{ who: null, t: 'The way back out to the plaza.' }, { choices: [{ t: 'Back to the plaza', do: 'fromHelixHQ' }, { t: 'Stay' }] }],
  hq_lift: [{ who: null, t: "The lift wants a Helix keycard. The stairs are 'for staff'. You are not staff. The corridor leads up anyway." }],
  receptionist: [{ who: 'receptionist', pick: [
    "Director Hale is in a meeting. She is always in a meeting. Today the meeting is with a man with a very loud watch.",
    "Please take a seat. Or don't. Most people who come in like that don't sit."
  ] }],
  reception: [{ go: 'receptionist' }],
  quill_hq: [{ who: 'quill', t: "Captain. The Director said to let you up. She said it in a voice I have not heard before. I think she is frightened. I did not know she could be." }],
  helixwall: [{ who: null, t: 'Glossy grey panels with a teal stripe. You can see your reflection. You look like someone a lot of people are hunting.' }],
  helixwindow: [{ who: null, t: "Floor-to-ceiling glass. Below, the plaza lights strobe red and blue. Out past the ring, something very far away is listening." }],
  haledesk: [{ who: null, t: "Director Hale's desk. One lamp, one file, one framed photo turned face down." }],
  helixplant: [{ who: null, t: 'A plant so healthy it looks expensive. Gerald would be jealous. Gerald is always jealous.' }],
  helixlogo: [{ who: null, t: 'The Helix logo, spinning slowly in light. Up close, the two strands are made of tiny musical notes.' }],
  crane_ambush: [{ do: 'craneFight' }],
  // after the Metronome: what to do with Director Hale
  hale_choice: [
    { who: 'hale', t: "I can get you onto Blue Note station. Docking codes, the guard rota, the only way in that he doesn't watch. You'll need all of it." },
    { set: 'blue_note_codes' },
    { who: 'hale', t: "So. What happens to me, Captain?" },
    { choices: [
      { t: "You're coming with us.", go: 'hale_come' },
      { t: 'The Bounty Office can decide that.', go: 'hale_office' },
      { t: 'Walk away, Hale. Before I change my mind.', go: 'hale_walk' }
    ] }
  ],
  hale_come: [
    { set: 'hale_ally' },
    { who: 'hale', t: "...Thank you. I'll be useful. I'm always useful. It's the only thing he ever liked about me." },
    { who: 'rhea', if: 'rhea_joined', t: "If she's coming aboard, I'm checking her for bugs. Personally. Twice." }
  ],
  hale_office: [
    { set: 'hale_office' }, { rep: { office: 2, helix: -2 } },
    { who: 'hale', t: "Fair. I'll tell them everything. It's a long story, and it's mostly about a piano." },
    { who: 'rook', t: "Marshal Okoro will want this one. She's been after Helix for years." }
  ],
  hale_walk: [
    { set: 'hale_free' },
    { who: 'hale', t: "Then I'll go somewhere very quiet. Somewhere with no speakers at all." },
    { who: 'hale', t: "Captain. When you get to Blue Note, play it loud. He hates loud." }
  ],
  // ---- Titan looks ----
  titanwall: [{ who: null, t: 'Sandstone, warm from a sun that is very far away. Somebody has carved a treble clef into it, very carefully.' }],
  column: [{ who: null, t: 'A marble column, wrapped in posters for shows that closed fifty years ago.' }],
  poster: [{ who: null, t: 'MISTER NOCTURNE. ONE NIGHT ONLY. A lifetime of genius in ninety minutes. No interval. No refunds. No questions.' }],
  cafe: [{ who: null, t: 'A pavement café. Every table has a tiny lamp and a tiny pianist playing on a tiny screen. Coffee costs more than the Hi-Hat.' }],
  titanlamp: [{ who: null, t: 'A lamp post shaped like a tuning fork. It hums an A when the wind blows.' }],
  hedge: [{ who: null, t: 'A hedge clipped into the shape of a treble clef. Someone on Titan has a lot of time and very sharp scissors.' }],
  titanfountain: [{ who: null, t: 'A fountain whose jets rise and fall in time with the music from the Lyceum. Right now it is rushing a little.' }],
  curtain: [{ who: null, t: 'Heavy red curtains. On the other side, two thousand people are holding their breath.' }],
  flats: [{ who: null, t: 'Painted scenery flats: a moonlit garden, a ballroom, a very unconvincing sea.' }],
  roadcase: [{ who: null, t: "Road cases, stencilled NOCTURNE WORLD TOUR. One is labelled 'Instruments: 41'. It is empty." }],
  footlights: [{ who: null, t: "The footlights, glowing in time. Fitz said they're on the same cue as the spots." }],
  mirror: [{ who: null, t: 'A dressing-room mirror ringed with bulbs. Your reflection looks like it is about to steal a piano. Correct.' }],
  lift_lever_done: [{ who: null, t: 'The piano-lift lever. The stage above is empty and someone has left a single rose on it.' }],
  // ---- Titan: Track 06 ----
  sol_story: [
    { set: 'sol_story' },
    { who: 'sax', t: "You took the Nocturne job. I saw it on the board in the Flat Ninth. Sit down a minute, hunter." },
    { who: 'sax', t: "Those four bars you keep hearing? My teacher wrote them. Mae Halloway. On Titan, fifty years ago, on a grand piano called the Halcyon." },
    { who: 'sax', t: "It's not four bars. It's five. Four bars of question, one bar of answer. She only ever played the fifth bar to her students. I'm the last one left." },
    { who: 'sax', t: "Nocturne stole the Halcyon. He plays it at the Lyceum tonight. I want it home. I'm coming with you, and that's not a question." },
    { choices: [{ t: "Then pack your sax, Sol.", go: 'sol_story_end' }, { t: "What's in the fifth bar?", go: 'sol_fifth' }] }
  ],
  sol_fifth: [{ who: 'sax', t: "The answer, kid. Get me my teacher's piano back, and maybe I'll play it for you." }, { go: 'sol_story_end' }],
  sol_story_end: [
    { who: 'sax', ifNot: 'titan_arrived', t: "I'll meet you on Titan. I've got a cousin with a very slow tram. Don't wait up." },
    { who: 'sax', if: 'titan_arrived', t: "Fitz, the stagehand by the stage door, used to tune her for Mae. Talk to him." }
  ],
  sol_titan: [
    { who: 'sax', ifNot: 'heist_ready', t: "Fitz, the stagehand by the stage door, used to tune the Halcyon for Mae. He hates Nocturne more than I do. Talk to him." },
    { who: 'sax', if: 'heist_ready', t: "The show's started. I can hear the Halcyon from here. He's playing her too fast. Go on, hunter." }
  ],
  rhea_titan: [{ who: 'rhea', pick: [
    "Forty-one stolen instruments, all of them famous for the same four bars. He's not a collector. He's working through a shopping list.",
    "I'll be on the lighting desk frequency. If those follow-spots are on a network, I'll be listening to them."
  ] }],
  lyra_titan: [{ who: 'lyra', t: "The show music has a very steady beat, Captain. Two on, two off. Whoever runs the spotlights is a metronome. I like them already." }],
  fitz: [
    { set: 'met_fitz' },
    { who: 'fitz', t: "You're the hunters? Fitz, stagehand. Thirty years at the Lyceum. Nocturne fired the whole crew last month and replaced us with clockwork players." },
    { who: 'fitz', t: "I tuned the Halcyon for Mae Halloway when I was a boy. Watching him play her makes me want to drop a sandbag on him. A heavy one." },
    { who: 'fitz', t: "Here's how you do it. The piano sits on the stage lift. The lift lever is up on the fly gallery, top left of backstage. Pull it mid-show and the Halcyon drops straight through the floor." },
    { who: 'fitz', t: "Your mechanic can wait under the stage to catch it. Getting to the lever's the hard part. The follow-spots sweep backstage in time with the show. Two beats on, two off." },
    { choices: [
      { t: "We'll move on the dark beats.", go: 'fitz_end' },
      { t: "A heist in time with the music. Very on brand.", temp: 'Sarcastic', go: 'fitz_end' },
      { t: "Thank you, Fitz. We'll get her back.", temp: 'Idealistic', go: 'fitz_end' },
      { t: "And if we're spotted?", temp: 'Calm', go: 'fitz_spot' },
      { t: "What's your cut?", temp: 'Ruthless', go: 'fitz_cut' }
    ] }
  ],
  fitz_spot: [{ who: 'fitz', t: "Then you duck back into the dark and try again. The audience will think it's part of the show. Nocturne does a lot of weird stuff." }, { go: 'fitz_end' }],
  fitz_cut: [{ who: 'fitz', t: "My cut is watching his face when the piano drops. That's worth more than chits." }, { go: 'fitz_end' }],
  fitz_end: [{ who: 'fitz', t: "The stage door's open. Your mechanic's already inside. Break a leg. Not literally. We're short-staffed." }, { set: 'heist_ready' }],
  fitz_idle: [{ who: 'fitz', pick: ['Two beats on, two beats off. Count it in your head. Everybody counts in their head backstage.', 'The lever is top left, on the fly gallery. Big red handle. You cannot miss it. People have.'] }],
  tickets: [{ who: 'tickets', pick: [
    "Mister Nocturne, one night only, is completely sold out. Standing room is also sold out. Sitting on the floor is sold out.",
    "No, you can't just listen from the lobby. Several people have tried. They were removed. Gently. Mostly."
  ] }],
  lyceum_doors: [{ who: null, t: 'The Lyceum. Gold doors, a sold-out sign and a doorman built like a wardrobe. Not this way.' }],
  stage_door_locked: [{ who: null, t: 'A stage door with a keypad. You hear an orchestra warming up inside. Someone who works here might let you in.' }],
  stage_door: [
    { who: null, t: "The stage door is propped open with a fire extinguisher. Somewhere inside, a grand piano is being played much too fast." },
    { choices: [{ t: 'Slip inside', do: 'toLyceum' }, { t: 'Not yet' }] }
  ],
  stage_door_done: [{ who: null, t: "The stage door. Fitz has taped up a sign: STAFF ONLY (AND THE HI-HAT CREW, FOREVER)." }],
  stage_exit: [{ who: null, t: 'The stage door, out to the square.' }, { choices: [{ t: 'Back to the square', do: 'fromLyceum' }, { t: 'Stay backstage' }] }],
  lyceum_arrive: [
    { who: 'tam', t: "Cap! Over here. I'll be under the stage with the lift. You get to that lever and pull it, and I'll catch the piano." },
    { who: 'tam', t: "The follow-spots are on the show's beat. Wait in the dark, move in the dark. The lever's all the way up on the fly gallery." }
  ],
  tam_lyceum: [{ who: 'tam', pick: [
    "Go right along the wings, up the back stairs, then left along the gallery to the lever. Dark beats only.",
    "I've greased the lift. I've greased me. Everything's ready to drop."
  ] }],
  ushers: [
    { who: 'ushers', t: "The Lyceum is closed to people in boots like that. Turn around, or be escorted around." },
    { choices: [{ t: 'Fight', do: 'fight', arg: 'ushers' }, { t: 'Turn around' }] }
  ],
  lift_lever: [
    { who: null, t: "The piano-lift lever. Through a gap in the flats you can see the stage: Nocturne at the Halcyon, mid-flourish, two thousand people holding their breath." },
    { choices: [{ t: 'Pull the lever', do: 'heist' }, { t: 'Wait' }] }
  ],
  halcyon_choice: [
    { who: 'sax', t: "That's her. The Halcyon. Same scratch on the lid where Mae dropped her cigarette holder in seventy-one." },
    { who: null, t: "The Halcyon is yours to decide. The Bounty Office only wants Nocturne." },
    { choices: [
      { t: 'It goes home with Old Sol.', go: 'halcyon_sol' },
      { t: "Keep it aboard the Hi-Hat. If the Conductor wants it, he can come to us.", go: 'halcyon_keep' },
      { t: "Sell it. There's more than one buyer for a piano like this.", go: 'halcyon_sell' }
    ] }
  ],
  halcyon_sol: [
    { set: 'piano_sol' }, { set: 'fifth_bar' },
    { who: 'sax', t: "...Thank you, hunter. Sit down. All of you. Mae would want an audience." },
    { who: null, t: 'Old Sol plays the four bars. Then, softly, a fifth. It resolves everything. The whole room exhales.' },
    { who: 'brushes', t: "Captain. I have recorded it. I have recorded it nine times. I may have cried. Drums do not cry. I am revising that." }
  ],
  halcyon_keep: [
    { set: 'piano_kept' }, { set: 'fifth_bar' }, { do: 'halcyonStyle' },
    { who: 'sax', t: "...Fine. Better on a ship full of jazz than in his collection. But you learn the fifth bar properly, or I take her back." },
    { who: null, t: 'Old Sol teaches Brushes the fifth bar, right there on the loading dock. It resolves everything.' },
    { who: 'tam', t: "I'll bolt her down in the lounge. Gerald gets the spot by the window, though. Non-negotiable." }
  ],
  halcyon_sell: [
    { set: 'piano_sold' },
    { who: 'sax', t: "...Sell her. Right. Of course. I'll be on the slow tram, hunter. Don't wait up." },
    { who: 'brushes', t: 'Captain, Old Sol did not play the fifth bar. I do not think he will.' }
  ],

  ship: [
    { who: null, t: 'The Hi-Hat, parked and ticking as it cools. Head back aboard?' },
    { choices: [
      { t: 'Board the Hi-Hat', go: 'ship_board' },
      { t: 'Plot a course from here', if: 'up_engine', go: 'cockpit_nav' },
      { t: 'Stay here' }
    ] }
  ],
  ship_board: [{ do: 'toShip' }]
};
