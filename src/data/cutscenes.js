// Cutscenes. Each shot can set:
//   bg       backdrop: space | lounge | docks | warehouse | black
//   mood     music: title | ship | tense | battle | victory
//   l, r     who stands on the left / right ('player', a crew id, or null to clear)
//   who      who is speaking; line is what they say
//   byTemp   { Calm, Sarcastic, Idealistic, Ruthless } lines that replace "line" for that temperament
//   caption  narration box at the top
//   card     { track, name } a big title card
//   fx       shake | flash
//   sfx      a sound from systems/audio.js
// {name} is replaced with the captain's name.

export const CUTSCENES = {
  depart: [
    { bg: 'lounge', mood: 'ship', l: 'player', r: 'brushes', who: 'brushes', line: 'Course plotted for Ganymede, Dock 9. Captain, would you do the honours?' },
    { who: 'player', line: 'Brushes. Count us in.',
      byTemp: { Sarcastic: 'Brushes. Count us in. Slowly. I want to savour it.', Ruthless: 'Count us in. Then count the money.', Idealistic: "Count us in, Brushes. Let's do some good tonight.", Calm: 'Brushes. Count us in.' } },
    { who: 'brushes', sfx: 'countin', line: 'One... two... one, two, three, four!' },
    { l: null, r: null, card: { track: 'Track 01', name: 'Counterfeit Swing' }, mood: 'title', sfx: 'cymbal', fx: 'flash' },
    { bg: 'space', caption: "Ganymede. Jupiter's biggest moon, and the busiest place in the system to lose a shipment." }
  ],

  arrive: [
    { bg: 'docks', mood: 'tense', l: null, r: null, caption: 'Dock 9, Ganymede. 3:40 a.m. The night shift here is mostly crime.' },
    { l: 'tam', r: 'rook', who: 'tam', line: "Velvet's press is in one of these warehouses. Question is which one." },
    { who: 'rook', line: "Ask around. Look around. Try not to get shot. I'll guard the ship. By leaning on it." },
    { r: 'brushes', who: 'brushes', line: "I'm on comms, Captain. Find me proof of the press and I'll crack the right door." }
  ],

  confront: [
    { bg: 'warehouse', mood: 'tense', l: 'player', r: 'velvet', fx: 'shake', who: 'velvet', line: 'Bounty hunters. You can always tell. Cheap shoes, expensive grudges.' },
    { who: 'player', line: 'Velvet Moreau. You have a bounty.',
      byTemp: {
        Calm: 'Velvet Moreau. Come quietly and nobody needs patching up.',
        Sarcastic: 'Love the hat. Did you print that too?',
        Idealistic: 'Those fake chits ruin real people, Velvet. It ends tonight.',
        Ruthless: 'Fifteen thousand chits says you come with me. Conscious is optional.'
      } },
    { who: 'velvet', line: 'Charming. Boys, make them a counterfeit offer.' },
    { r: 'goon', who: 'goon', fx: 'shake', line: '...That means we hit you.', sfx: 'cymbal' }
  ],

  victory: [
    { bg: 'warehouse', mood: 'ship', l: 'player', r: 'velvet', who: 'velvet', line: 'You know the chits in that press are worth more than your whole ship.' },
    { l: 'tam', who: 'tam', line: "Lady, everything's worth more than our ship." },
    { l: 'rook', who: 'rook', line: 'The cuffs are real, though. I checked.' },
    { r: 'brushes', who: 'brushes', line: 'Bounty confirmed. Now for my favourite part: the deductions.' }
  ],

  ending: [
    { bg: 'lounge', mood: 'ship', l: 'rook', r: 'brushes', who: 'brushes', line: 'Net profit: enough for eggs. Plural.' },
    { who: 'rook', line: 'See? Living the dream.' },
    { r: 'tam', who: 'tam', line: "The dream has a hole in the hull, Captain. I'm patching it with Rook's shoes." },
    { l: 'player', who: 'player', line: 'Good work, everyone.',
      byTemp: { Calm: 'Good work, everyone. Get some rest.', Sarcastic: 'Another flawless operation. Mostly flawless. Partly flawless.', Idealistic: "One less counterfeiter out there. That's worth something.", Ruthless: 'Fifteen grand. Next time, we keep more of it.' } },
    { l: null, r: null, card: { track: 'Next session', name: 'Ghost Frequency' }, mood: 'title', sfx: 'cymbal', fx: 'flash' }
  ],

  cygnus_arrive: [
    { bg: 'station', mood: 'station', l: null, r: null, caption: 'Cygnus Station, upper ring. Two million people under one very leaky umbrella.' },
    { l: 'player', r: 'brushes', who: 'brushes', line: "Docking clamps engaged. Helix Salvage has an office on the plaza. There's also a bar called the Flat Ninth. For research." },
    { r: 'rook', who: 'rook', line: "I'll handle the research." },
    { r: 'tam', who: 'tam', line: "There's a proper outfitter here too, Cap. Kessler's. Bring chits. Bring all the chits." }
  ],

  helix_offer: [
    { bg: 'station', mood: 'tense', l: 'player', r: 'hale', who: 'hale', line: 'Captain {name}. I am told you are effective, discreet and inexpensive. Two out of three will do.' },
    { who: 'hale', line: 'Relay K-17. An old Helix comms relay past the belt. It went dark three weeks ago with five of my people aboard.' },
    { who: 'hale', line: 'Yesterday it started transmitting again. Not words. Music. Four bars, over and over.' },
    { r: 'brushes', who: 'brushes', line: '...Four bars? That is extremely my business now.' },
    { r: 'hale', who: 'player', line: 'What do you want from us?',
      byTemp: { Calm: 'Tell me exactly what you need.', Sarcastic: 'A haunted relay playing jazz. Sure. Why not.', Idealistic: "Five people are missing. We'll find them.", Ruthless: 'Twenty-four thousand is light for a ghost story.' } },
    { who: 'hale', line: 'Find my crew. Find out what happened. Bring back anything that is still transmitting. The contract is on your board.' }
  ]
};
