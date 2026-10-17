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
export function entry(id, flags) {
  switch (id) {
    case 'rook': return flags.met_rook ? 'rook_idle' : 'rook_first';
    case 'tam': return flags.met_tam ? 'tam_idle' : 'tam_first';
    case 'brushes': return flags.met_brushes ? 'brushes_idle' : 'brushes_first';
    case 'cockpit':
      if (flags.velvet_course) return 'cockpit_set';
      return flags.bounty_velvet ? 'cockpit_go' : 'cockpit_none';
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
    { who: 'tam', if: 'velvet_course', t: "Course is locked in. I'll keep the engine purring. Or at least growling." },
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
    { who: 'brushes', if: 'velvet_course', t: 'Course plotted for Ganymede, Dock 9. The rest of this track is still being recorded, Captain.' },
    { who: 'brushes', if: 'bounty_velvet', ifNot: 'velvet_course', t: 'Contract accepted. The cockpit is ready when you are.' },
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
      { t: 'Plot the course', go: 'cockpit_plot' },
      { t: 'Not yet' }
    ] }
  ],
  cockpit_plot: [
    { set: 'velvet_course' },
    { do: 'objective' },
    { who: 'brushes', t: 'Course plotted. One, two, one-two-three-four!' },
    { who: null, t: 'The engine coughs, then catches. Dock 9, mission maps and combat land in the next build.' }
  ],
  cockpit_set: [{ who: null, t: 'Course locked: Ganymede, Dock 9. Mission maps and combat land in the next build.' }]
};
