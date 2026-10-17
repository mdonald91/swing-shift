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
//   if/ifNot only play this shot when a flag is (or isn't) set
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
  ],

  k17_depart: [
    { bg: 'lounge', mood: 'ship', l: 'player', r: 'rhea', who: 'rhea', if: 'rhea_met', line: "Mags said you took the Helix job. I'm coming. I did tell you not to argue." },
    { bg: 'lounge', mood: 'ship', l: 'player', r: 'rhea', who: 'rhea', ifNot: 'rhea_met', line: "Rhea Vance. I ran comms on K-17 for two years. Mags said you'd need me. I'm coming." },
    { r: 'tam', who: 'tam', line: "Another crewmate? Fine. You're sleeping next to the noisy pipe." },
    { r: 'rook', who: 'rook', line: "I'll mind the ship while you lot go chase a haunted radio." },
    { r: 'brushes', who: 'brushes', sfx: 'countin', line: 'Relay K-17, locked in. The four bars are getting louder. One... two... one, two, three, four!' },
    { l: null, r: null, card: { track: 'Track 02', name: 'Ghost Frequency' }, mood: 'title', sfx: 'cymbal', fx: 'flash' },
    { bg: 'relay_out', mood: 'tense', caption: 'Relay K-17. Three weeks dark. Still singing.' }
  ],

  k17_arrive: [
    { bg: 'relay_in', mood: 'tense', l: null, r: null, caption: 'Inside Relay K-17. Every light is emergency red. The air tastes like old batteries.' },
    { l: 'rhea', r: 'brushes', who: 'rhea', line: "Main power's down. The generator room is up the corridor, on the left. Doors won't open without it." },
    { who: 'brushes', line: "I can hear them, Captain. The four bars. They're coming from inside the walls." },
    { l: 'player', who: 'player', line: "Then let's find out who's playing.",
      byTemp: { Calm: "Stay close. We take this one step at a time.", Sarcastic: "Great. A haunted space station. My favourite kind.", Idealistic: "Five people are counting on us. Let's move.", Ruthless: "Whoever's playing, they'd better be worth twenty-four grand." } }
  ],

  k17_warden: [
    { bg: 'relay_in', mood: 'tense', l: 'player', r: 'juno', fx: 'shake', who: 'juno', line: "It's waking up. Helix's Warden. It's been hunting me for three weeks." },
    { r: 'warden', who: 'warden', sfx: 'zap', line: 'UNAUTHORISED CREW DETECTED. CONTRACT TERMINATION IN PROGRESS.' },
    { l: 'rhea', who: 'rhea', line: 'That thing was a maintenance unit when I worked here. Somebody gave it guns.' },
    { who: 'warden', fx: 'shake', line: 'PLEASE REMAIN STILL. THIS WILL BE EFFICIENT.', sfx: 'cymbal' }
  ],

  k17_victory: [
    { bg: 'relay_in', mood: 'ship', l: 'player', r: 'juno', who: 'juno', line: "It's down. It's really down. Thank you." },
    { l: 'rhea', who: 'rhea', line: "Hale hired us to recover 'anything still transmitting'. She meant Juno. And whatever Juno knows." },
    { who: 'juno', line: 'Helix rebuilt this relay to listen to every call in the system. Every call. We refused to switch it on, so they locked us in with that thing.' },
    { r: 'brushes', l: 'player', who: 'brushes', line: 'And the four bars?' },
    { r: 'juno', who: 'juno', line: "A distress call. Helix's filters catch words. Nobody filters jazz." },
    { who: 'juno', if: 'cryo_found', line: 'You found the others in cryo? Then everyone made it. Everyone.' }
  ],

  k17_ending: [
    { bg: 'lounge', mood: 'ship', l: 'rhea', r: 'brushes', if: 'juno_protected', who: 'brushes', line: "The Bounty Office has the relay logs. Helix's stock is falling faster than Rook off the couch." },
    { if: 'juno_protected', who: 'rhea', line: "You did the right thing, Captain. Expensive, but right. I'm staying, if you'll have me." },
    { if: 'juno_protected', r: 'tam', who: 'tam', line: "Juno sent a message from the Bounty Office. Just four bars. I think it means thank you." },
    { bg: 'lounge', mood: 'ship', l: 'rook', r: 'brushes', if: 'juno_handed', who: 'brushes', line: 'Helix paid in full. Juno is... with Helix now. I have stopped playing the four bars.' },
    { if: 'juno_handed', r: 'tam', who: 'tam', line: "Rhea packed her bag at Cygnus. Said to tell you the money's yours. She didn't want it." },
    { if: 'juno_handed', who: 'rook', line: "A contract's a contract, I suppose. Doesn't make it a good one." },
    { l: 'player', who: 'player', line: 'We did what we came to do.',
      byTemp: { Calm: 'We did what we had to. Get some rest, everyone.', Sarcastic: 'Another relaxing day at the office.', Idealistic: 'Whatever comes next, we face it together.', Ruthless: 'Next job pays better. It has to.' } },
    { l: null, r: null, card: { track: 'Next session', name: 'The Missing Courier' }, mood: 'title', sfx: 'cymbal', fx: 'flash' }
  ]
};
