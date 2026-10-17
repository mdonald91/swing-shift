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
    case 'tam': return docks ? 'tam_docks' : flags.velvet_done ? 'tam_after' : flags.met_tam ? 'tam_idle' : 'tam_first';
    case 'brushes': return flags.velvet_done ? 'brushes_after' : flags.met_brushes ? 'brushes_idle' : 'brushes_first';
    case 'ozzie': return flags.met_ozzie ? 'ozzie_idle' : 'ozzie_first';
    case 'cockpit':
      if (flags.velvet_done) return 'cockpit_nav';
      if (flags.velvet_course) return 'cockpit_return';
      return flags.bounty_velvet ? 'cockpit_go' : 'cockpit_none';
    case 'sax': return flags.busked_visit ? 'sax_after' : 'sax';
    case 'rhea': return flags.rhea_met ? 'rhea_idle' : 'rhea_first';
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
      { t: 'Stay put' }
    ] }
  ],
  nav_cygnus: [{ do: 'toCygnus' }],
  nav_k17: [
    { who: 'brushes', t: "Relay K-17 is a long, cold jump past the belt. I've plotted it. The four bars are getting louder." },
    { who: null, t: 'Track 02 is still being recorded. Relay K-17 opens in the next build.' }
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
