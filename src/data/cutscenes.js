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
  ],

  vesta_depart: [
    { bg: 'lounge', mood: 'ship', l: 'player', r: 'brushes', who: 'brushes', line: 'Vesta. Most tunnels per person of any rock in the belt. Also most noodle carts. Coincidence? Yes.' },
    { r: 'tam', who: 'tam', line: "Wren Castillo's a courier. Her sister Ada posted the bounty. Wren went quiet on Vesta four days ago." },
    { r: 'rhea', if: 'rhea_joined', who: 'rhea', line: 'A courier carrying something nobody will name. In my experience, that means it is worth a lot to someone horrible.' },
    { r: 'rook', who: 'rook', line: "I'll mind the ship. Somebody has to." },
    { r: 'brushes', who: 'brushes', sfx: 'countin', line: 'Vesta, locked in. One... two... one, two, three, four!' },
    { l: null, r: null, card: { track: 'Track 03', name: 'The Missing Courier' }, mood: 'title', sfx: 'cymbal', fx: 'flash' },
    { bg: 'vesta', mood: 'vesta', caption: 'Vesta, the market ring. Drill dust, lantern light and a thousand people minding their own business.' }
  ],

  vesta_arrive: [
    { bg: 'vesta', mood: 'vesta', l: 'tam', r: 'brushes', who: 'tam', line: 'Pell the broker trades in gossip. Purple suit, top of the market. Start with him.' },
    { if: 'juno_protected', r: 'juno', who: 'juno', line: "Captain, it's Juno. I owe you. I'm in Vesta's market cameras. Anyone you follow, I'll mark on your map." },
    { if: 'juno_protected', who: 'juno', line: 'Also, I bought you a present. Two Patch Kits, left with your crew. Use them.' },
    { if: 'juno_handed', r: 'quill', who: 'quill', line: 'Captain. Mr Quill, Helix Salvage. Director Hale asked me to observe your work. Please, pretend I am not here.' },
    { if: 'juno_handed', l: 'tam', who: 'tam', line: "He's going to stand right there the whole time, isn't he." }
  ],

  courier_found: [
    { bg: 'tunnel', mood: 'tense', l: 'player', r: 'wren', who: 'wren', line: 'Ada sent you? My sister worries. She is usually right to.' },
    { who: 'wren', line: "Helix hired me to carry a sealed case. I peeked. I wasn't supposed to peek. Now everyone wants me dead." },
    { r: 'sable', fx: 'shake', who: 'sable', line: 'Wren, darling. The Conductor wants his property back.' },
    { r: 'vox', who: 'vox', line: '...And the bounty hunters gone.' },
    { l: 'player', who: 'player', line: "Who's the Conductor?",
      byTemp: { Calm: "Nobody needs to get hurt. Who's the Conductor?", Sarcastic: 'A singer and a bass player. Did we walk into an open mic?', Idealistic: "You're not taking her anywhere.", Ruthless: 'Two more bounties, walking right up to me. Convenient.' } },
    { r: 'sable', who: 'sable', line: 'Someone who appreciates harmony. Vox, darling. From the top.', sfx: 'cymbal' }
  ],

  duet_victory: [
    { bg: 'tunnel', mood: 'tense', l: 'player', r: 'vox', who: 'vox', line: '...Missed the cue.' },
    { r: 'conductor', who: 'conductor', fx: 'shake', line: "Vox. Sable. I do hate loose ends. You're both off the programme." },
    { r: 'sable', who: 'sable', line: "That's the Conductor, on Vox's earpiece. Darling, I think we've been fired." },
    { l: 'rhea', if: 'rhea_joined', who: 'rhea', line: 'That signal routes through Helix. Same encryption as K-17. The Conductor is inside Helix, or owns it.' },
    { l: 'player', r: 'wren', who: 'wren', line: "You saved my life. Now let's talk about the case." }
  ],

  courier_ending: [
    { bg: 'lounge', mood: 'ship', l: 'tam', r: 'brushes', who: 'tam', line: 'Wren is home with Ada. Ada sent noodles. Proper ones.' },
    { if: 'core_kept', who: 'brushes', line: 'Kevin the tuning core is humming in the cargo bay. I believe Kevin is trying to say something.' },
    { if: 'core_office', who: 'brushes', line: "The Bounty Office logged the core as evidence. Someone at Helix is having a very bad day." },
    { if: 'core_helix', who: 'brushes', line: 'Mr Quill took the core and left a fruit basket. The fruit is very expensive and very sad.' },
    { if: 'core_sold', who: 'brushes', line: 'Kessler paid well for the core. He asked no questions. I asked several. He did not answer them.' },
    { l: 'rhea', if: 'rhea_joined', r: 'brushes', who: 'rhea', line: 'The Conductor. Whoever they are, they know our names now.' },
    { l: 'player', who: 'player', line: "Then we'd better get stronger.",
      byTemp: { Calm: 'Then we prepare. Rest up, everyone.', Sarcastic: 'Great. Fan mail.', Idealistic: "Then we'll be ready when they come.", Ruthless: 'Good. Let them come.' } }
  ],

  // Act 1 finale: the Conductor takes over every speaker in the system. Plays once, on the ship, after Track 03.
  act1_finale: [
    { bg: 'lounge', mood: 'tense', l: 'brushes', r: 'tam', who: 'brushes', sfx: 'scratch', line: 'Captain. Every speaker on the ship just switched itself on. I did not do it. I would like that noted.' },
    { r: 'rook', who: 'rook', line: "It's not just us. News feeds, dock radio, the noodle cart. Every channel's playing the same thing." },
    { r: 'tam', who: 'tam', line: "Four bars. Juno's song. Except someone's... conducting it." },
    { bg: 'broadcast', mood: 'finale', l: null, r: 'conductor', who: 'conductor', fx: 'flash', sfx: 'cymbal', line: "Good evening, Captain. Please, don't get up. I prefer an audience that stays in its seats." },
    { who: 'conductor', line: "You have been playing my score all season without reading the programme. Allow me." },
    { who: 'conductor', line: "Velvet Moreau's counterfeit chits came off my presses. A little noise in the economy, to see who was listening. You were." },
    { who: 'conductor', line: 'Relay K-17 was to be my ear. Every call in the system, heard by one man.' },
    { who: 'conductor', if: 'juno_protected', line: 'Your friend Juno closed that ear. Charming. I have others.' },
    { who: 'conductor', if: 'juno_handed', line: 'Thanks to you and Director Hale, it hears beautifully. Juno sends her regards. Well. She would.' },
    { who: 'conductor', line: 'And the tuning core your courier carried? The last string on my instrument.' },
    { who: 'conductor', if: 'core_kept', line: 'Which is sitting in your cargo bay, humming. Do tell Kevin I said hello. I will be along to collect him.' },
    { who: 'conductor', if: 'core_office', line: 'Evidence lockers are such trusting places. It was back in my hands by breakfast.' },
    { who: 'conductor', if: 'core_helix', line: 'Mr Quill delivered it personally. You have been very helpful, Captain. I will remember that.' },
    { who: 'conductor', if: 'core_sold', line: 'Kessler sold it to me for twice what he paid you. Business is business. You taught me that.' },
    { l: 'player', who: 'player', line: "What's the instrument for?",
      byTemp: { Calm: 'What are you building?', Sarcastic: 'Let me guess. A really big kazoo.', Idealistic: "Whatever you're planning, we'll stop it.", Ruthless: "Skip the speech. What's your bounty worth?" } },
    { who: 'conductor', line: 'Harmony. Every relay, every screen, every radio in the system, in tune. One song. Mine.' },
    { who: 'conductor', fx: 'shake', line: 'The Bounty Office has just put a price on my head. Do try to collect it. I will be listening.' },
    { bg: 'lounge', mood: 'tense', l: 'rhea', if: 'rhea_joined', r: 'brushes', who: 'rhea', line: "That signal didn't come through Helix. Helix comes through him. Hale was only ever the front desk." },
    { if: 'juno_protected', l: 'player', r: 'juno', who: 'juno', line: "Captain, it's Juno. I traced the broadcast. It bounced off every relay in the belt and came from... nowhere. I'll keep digging." },
    { if: 'core_kept', l: 'brushes', r: 'tam', who: 'brushes', line: 'Kevin has stopped humming. I do not like it when Kevin stops humming.' },
    { bg: 'lounge', mood: 'ship', l: 'tam', r: 'rook', who: 'tam', line: 'So the bad guy has a radio show now. Love that for us.' },
    { who: 'rook', line: "Quarter of a million chits on his head. I'd get off the couch for that." },
    { l: 'brushes', r: 'tam', who: 'brushes', line: 'Captain, I believe this is what musicians call the end of Side A.' },
    { l: 'player', who: 'player', line: "Then let's flip the record.",
      byTemp: { Calm: "Then let's flip the record. Carefully.", Sarcastic: 'Great. I always hated the B-sides.', Idealistic: 'Then Side B is ours.', Ruthless: "Then let's go collect." } },
    { l: null, r: null, card: { track: 'End of', name: 'Side A' }, mood: 'title', sfx: 'cymbal', fx: 'flash' }
  ]
};
