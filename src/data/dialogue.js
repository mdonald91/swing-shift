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
  return ['rook', 'tam', 'brushes'].includes(id) && !flags['chat_' + id];
}

export function entry(id, flags, location) {
  const docks = location === 'docks';
  if (chatAvailable(id, flags, location)) return id + '_chat';
  switch (id) {
    case 'rook': return docks ? 'rook_docks' : flags.velvet_done ? 'rook_after' : flags.met_rook ? 'rook_idle' : 'rook_first';
    case 'tam': return location === 'vesta' ? 'tam_vesta' : docks ? 'tam_docks' : flags.velvet_done ? 'tam_after' : flags.met_tam ? 'tam_idle' : 'tam_first';
    case 'brushes': return location === 'relay' ? 'brushes_relay' : flags.velvet_done ? 'brushes_after' : flags.met_brushes ? 'brushes_idle' : 'brushes_first';
    case 'ozzie': return flags.met_ozzie ? 'ozzie_idle' : 'ozzie_first';
    case 'cockpit':
      if (flags.velvet_done) return 'cockpit_nav';
      if (flags.velvet_course) return 'cockpit_return';
      return flags.bounty_velvet ? 'cockpit_go' : 'cockpit_none';
    case 'sax': return flags.busked_visit ? 'sax_after' : 'sax';
    case 'rhea':
      if (location === 'relay') return 'rhea_relay';
      if (location === 'vesta') return 'rhea_vesta';
      if (location === 'ship') return 'rhea_ship';
      return flags.rhea_met ? 'rhea_idle' : 'rhea_first';
    case 'drone': return 'drones';
    case 'juno': return 'juno';
    case 'pell': return flags.tail_done ? 'pell_idle' : flags.met_pell ? 'pell_retry' : 'pell_first';
    case 'wren': return 'wren';
    case 'quill': return 'quill';
    case 'scav': return 'scavs';
    case 'chest_vesta': return flags.vesta_chest ? 'chest_vesta_done' : flags.scavs_cleared ? 'chest_vesta' : 'chest_vesta_blocked';
    case 'door_hideout': return flags.tail_done ? 'door_hideout_open' : 'door_hideout';
    case 'generator': return flags.power_on ? 'generator_done' : 'generator';
    case 'lockers': return flags.k17_keycard ? 'lockers_done' : flags.power_on ? 'lockers' : 'lockers_dark';
    case 'cryo': return flags.cryo_found ? 'cryo_done' : 'cryo';
    case 'helix': return flags.ghost_offered ? 'helix_again' : 'helix';
    case 'door': return flags.velvet_done ? 'door_done' : flags.door_open ? 'door_open' : 'door_locked';
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
      { t: 'Stay put' }
    ] }
  ],
  nav_cygnus: [{ do: 'toCygnus' }],
  nav_vesta: [
    { if: 'vesta_arrived', do: 'toVesta' },
    { ifNot: 'vesta_arrived', do: 'departVesta' }
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
  mags_rumour: [{ ifNot: 'rumour1', go: 'rumour1' }, { ifNot: 'rumour2', go: 'rumour2' }, { ifNot: 'rumour3', go: 'rumour3' }, { go: 'rumour_none' }],
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
  vend_cygnus: [{ who: null, t: "The machine sells 'Moon Cola: Now With Less Moon'. You decide not to ask." }],
  dockgate: [
    { who: null, t: 'The Hi-Hat sits in the docking bay below, dripping rainwater. Head back aboard?' },
    { choices: [{ t: 'Board the Hi-Hat', go: 'ship_board' }, { t: 'Stay on the station' }] }
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
    { choices: [{ t: 'Board the Hi-Hat', go: 'ship_board' }, { t: 'Keep exploring' }] }
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
    { choices: [{ t: 'Ride down to the Hi-Hat', go: 'ship_board' }, { t: 'Stay in the market' }] }
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
  ship: [
    { who: null, t: 'The Hi-Hat, parked and ticking as it cools. Head back aboard?' },
    { choices: [
      { t: 'Board the Hi-Hat', go: 'ship_board' },
      { t: 'Stay on the dock' }
    ] }
  ],
  ship_board: [{ do: 'toShip' }]
};
