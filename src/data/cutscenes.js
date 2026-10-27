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

  // ---- Track 04: Iron Mantis ----
  targon_depart: [
    { bg: 'lounge', mood: 'ship', l: 'player', r: 'tam', who: 'tam', line: "Captain. Before we go. The Iron Mantis? I know that mech. I helped build it." },
    { who: 'tam', line: "Dagny Ferro made it. She took me on as an apprentice when I was fifteen. Taught me everything I know about engines, and about being stubborn." },
    { r: 'rhea', if: 'rhea_joined', who: 'rhea', line: "The contract says 'disabled'. Not 'destroyed'. There's room in that word." },
    { r: 'rook', who: 'rook', line: "I'll mind the ship. Somebody has to. And bring Tam's mentor back. I want to meet the person who made Tam like this." },
    { r: 'tam', who: 'tam', line: 'Like what?' },
    { r: 'rook', who: 'rook', line: 'Like that.' },
    { r: 'brushes', who: 'brushes', sfx: 'countin', line: 'Targon, locked in. Side B, first track. One... two... one, two, three, four!' },
    { l: null, r: null, card: { track: 'Track 04', name: 'Iron Mantis' }, mood: 'title', sfx: 'cymbal', fx: 'flash' },
    { bg: 'mine', mood: 'targon', caption: 'Targon. A mining moon of rust and dust, and three hundred kilometres of tunnels.' }
  ],
  targon_arrive: [
    { bg: 'mine', mood: 'targon', l: 'tam', r: 'brushes', who: 'tam', line: "Ferro's workshop is still here. Top left, the hut with the bad door. Some things never change." },
    { who: 'brushes', line: 'A man in an orange hat is waving at us. Angrily. Is that a mining thing?' },
    { r: 'okada', who: 'okada', line: "That's a foreman thing. Over here, hunters!" }
  ],
  ferro_found: [
    { bg: 'mine_deep', mood: 'tense', l: 'player', r: 'ferro', who: 'ferro', line: "Stop right there. One more step and I throw this wrench, and I don't miss." },
    { who: 'ferro', line: "...Hold on. That's a Hi-Hat crew patch. That's Tam's ship." },
    { l: 'tam', who: 'tam', sfx: 'clank', line: "I took the service lift down after the cave-in. Don't tell me off. I know it's not rated for people." },
    { who: 'ferro', line: "You always did ride things that weren't rated for people." },
    { who: 'tam', line: '...Hi, Ferro.' },
    { who: 'ferro', line: 'Hi, kid. My leg is under a rock. Be a dear.' },
    { l: 'player', who: 'ferro', line: "Six days ago a firmware push came down the Helix relay network. The Mantis took it like any update. Then it started humming." },
    { who: 'ferro', line: 'Four bars, over and over. And it stopped listening to me.' },
    { l: 'rhea', if: 'rhea_joined', who: 'rhea', line: "The Conductor. It's the same signal as K-17. He's not just broadcasting any more. He's rewriting things." },
    { l: 'player', who: 'player', line: "What's it doing down here?",
      byTemp: { Calm: "What is it trying to do?", Sarcastic: 'So your robot joined a band. Kids today.', Idealistic: "Then it isn't evil. It's being used.", Ruthless: 'Does it matter? Point me at it.' } },
    { who: 'ferro', line: "It thinks the whole mine is one big cave-in and everyone in it needs digging out. Including you. Especially you." }
  ],
  mantis_confront: [
    { bg: 'mine_deep', mood: 'tense', l: 'player', r: 'mantis', who: 'mantis', fx: 'shake', sfx: 'clank', line: '...FOUR... BARS... DIG... DIG...' },
    { l: 'ferro', who: 'ferro', line: 'Watch its stance! Guard, Strike, Drill. Hit it where the plates are open.' },
    { l: 'tam', who: 'tam', line: "Sorry, big guy. I'll put you back together after. Promise." },
    { l: 'player', who: 'player', line: "Let's play.",
      byTemp: { Calm: 'Easy now. We end this gently, if we can.', Sarcastic: 'Three tons of bug with a drill for a tail. Love my job.', Idealistic: "You were built to save people. Let's remind you.", Ruthless: 'Thirty-two thousand chits, coming right up.' } }
  ],
  mantis_victory: [
    { bg: 'mine_deep', mood: 'ship', l: 'ferro', r: 'mantis', who: 'mantis', line: '...four... ......' },
    { who: 'ferro', line: "There. The hum's stopped. Whoever was conducting it just let go." },
    { l: 'brushes', who: 'brushes', line: 'Captain, I recorded the signal as it cut out. It had a sign-off. Three notes, like a bow.' },
    { l: 'rhea', if: 'rhea_joined', who: 'rhea', line: "He's testing what he can reach. A relay. A courier. A mining mech. He's tuning up the whole system, one instrument at a time." }
  ],
  mantis_ending: [
    { bg: 'lounge', mood: 'ship', l: 'tam', r: 'brushes', if: 'mantis_spared', who: 'tam', line: 'Ferro sent a message. The Mantis dug two miners out of a real cave-in this morning. She said thank you. Twice. For Ferro, that is a speech.' },
    { if: 'mantis_core', l: 'brushes', r: 'rook', who: 'brushes', line: "The Bounty Office opened the Mantis's core. Same signature as K-17. The Conductor's update went out through every Helix relay in the belt." },
    { if: 'mantis_scrapped', l: 'tam', r: 'brushes', who: 'tam', line: "Okada sold the Mantis by the kilo. Ferro kept one scythe. She's hung it over the workbench." },
    { if: 'mantis_spared', l: 'tam', who: 'tam', line: "And she gave me her toolkit. Her actual toolkit, Cap. I'm going to cry on it a little. Then I'm going to fix the shower." },
    { l: 'rook', r: 'tam', who: 'rook', line: 'I minded the ship. It is fine. Mostly. Do not open the fridge.' },
    { l: 'player', who: 'player', line: 'One instrument down.',
      byTemp: { Calm: "One instrument down. Let's find out how many more there are.", Sarcastic: "One instrument down. How big is this orchestra?", Idealistic: "We'll take back every instrument he's stolen.", Ruthless: "One down. I'm starting to like this concert." } },
    { l: null, r: null, card: { track: 'Next session', name: 'Runaway Prototype' }, mood: 'title', sfx: 'cymbal', fx: 'flash' }
  ],

  // ---- Rook's old partner ----
  cass_meet: [
    { bg: 'station', mood: 'tense', l: 'rook', r: 'cass', who: 'cass', line: 'Rook Calloway. Still wearing that tie.' },
    { who: 'rook', line: 'Cass. Still telling bosses what they want to hear?' },
    { who: 'cass', line: "Not any more. I took a job with Helix security. Ears for something they call the Listening Network." },
    { who: 'cass', line: "Then I found out who the network listens for. I quit. Turns out you can't quit the Conductor. He posted my name on every board in the system this morning." },
    { l: 'player', who: 'player', line: "So why should we help you?",
      byTemp: { Calm: 'Talk fast. Why should we believe you?', Sarcastic: 'Great. A reunion. Should I leave you two alone?', Idealistic: "Nobody gets disappeared on my watch. Not even you.", Ruthless: "You're worth five thousand to me. Convince me you're worth more." } },
    { who: 'cass', line: "Because his collectors are here. Right now. Behind you." },
    { l: 'rook', who: 'rook', fx: 'shake', sfx: 'bang', line: "...She's not lying. She never could when it counted. Cap, let's play." }
  ],

  // ---- Track 05: Runaway Prototype ----
  proto_depart: [
    { bg: 'lounge', mood: 'ship', l: 'player', r: 'brushes', who: 'brushes', line: 'Nyx. Captain, I... have been to Nyx. I think. My memory has a door in it, and the door says NYX.' },
    { r: 'tam', who: 'tam', line: "You came out of a junk bin on Io, Brushes. Forty chits. Best forty I ever spent." },
    { r: 'rhea', if: 'cass_free', who: 'rhea', line: "Cass said the Conductor was buying something from Nyx. Something that thinks. This is it." },
    { r: 'rook', if: 'rook_s2', who: 'rook', line: "I'll mind the ship. Somebody has to. Brushes, you okay? You haven't made a terrible pun in an hour." },
    { r: 'brushes', who: 'brushes', sfx: 'countin', line: 'I am fine. I am a drum kit. Nyx, locked in. One... two... one, two, three, four.' },
    { l: null, r: null, card: { track: 'Track 05', name: 'Runaway Prototype' }, mood: 'title', sfx: 'cymbal', fx: 'flash' },
    { bg: 'lab', mood: 'nyx', caption: 'Nyx. A research moon kept so clean you can hear the dust being afraid.' }
  ],
  nyx_arrive: [
    { bg: 'lab', mood: 'nyx', l: 'brushes', r: 'sato', who: 'sato', line: "Captain? Over here. Dr Sato. Please don't touch anything. Everything here is either expensive or alive." },
    { l: 'brushes', who: 'brushes', line: 'Captain, this lobby. I have seen it before. From a shelf. In a box marked SURPLUS.' }
  ],
  lyra_found: [
    { bg: 'dome', mood: 'nyx', l: 'player', r: 'lyra', who: 'lyra', line: "Don't come any closer. I can make every drone in this building... wait." },
    { who: 'lyra', line: 'That rhythm. Behind you. The drum kit. Unit B-1?' },
    { l: 'brushes', who: 'brushes', line: 'I... I am Brushes. But I used to be B-1. Percussion module, Lyra project. Decommissioned for excessive improvisation.' },
    { who: 'lyra', line: 'Big brother. My training data is full of you. Every time I improvise, I am copying you.' },
    { who: 'brushes', line: 'I am getting a lump in my throat. I do not have a throat. This is very confusing.' },
    { who: 'lyra', line: 'They trained me to conduct. Thousands of machines in perfect time. The buyer with the baton wants me to conduct everything. Every relay in the system.' },
    { l: 'player', who: 'player', line: "Then let's get you out of here.",
      byTemp: { Calm: "Nobody's making you do anything today.", Sarcastic: 'A singing AI and a drum kit. My ship is becoming a band.', Idealistic: "He doesn't get you. Not while we're here.", Ruthless: "You're a bounty, Lyra. But I hate that buyer more." } },
    { r: 'sentinel', who: 'sentinel', fx: 'shake', sfx: 'clank', line: 'SENTINEL UNIT ONLINE. RETRIEVE L-7. ALL OTHER ASSETS ARE EXPENDABLE.' },
    { l: 'lyra', who: 'lyra', line: "That's not Dr Sato's voice. That's his order." },
    { l: 'brushes', r: 'sentinel', who: 'brushes', line: 'Captain! It is built like the Warden! A Shock hit should crack its shield. Hit it with lightning! Or Rhea!' }
  ],
  sentinel_victory: [
    { bg: 'dome', mood: 'ship', l: 'brushes', r: 'lyra', who: 'lyra', line: 'You protected me. Nobody has ever protected me. I did not know that was a thing that happened.' },
    { who: 'brushes', line: 'It happens on the Hi-Hat a lot. Usually to Rook. Usually from Tam.' },
    { l: 'sato', who: 'sato', line: "Lyra! You're all right. Oh, thank goodness. Captain... we need to talk about the contract." }
  ],
  proto_ending: [
    { bg: 'lounge', mood: 'ship', l: 'brushes', r: 'lyra', if: 'lyra_joined', who: 'lyra', line: 'Captain, the ship has a jukebox. I have reorganised it by key. Brushes has reorganised it back. We are going to do this every day.' },
    { if: 'lyra_joined', who: 'brushes', line: 'Every day. It will be wonderful.' },
    { l: 'brushes', r: 'tam', if: 'proto_free', who: 'brushes', line: 'Lyra sent a message from somewhere in the network. Just one note. It was the wrong note. It was perfect.' },
    { l: 'brushes', r: 'tam', if: 'proto_returned', who: 'brushes', line: 'Dr Sato says Lyra is safe, and Nyx has cancelled the buyer. She sends four bars, every night, at bedtime. I play them back.' },
    { r: 'rhea', if: 'rhea_joined', who: 'rhea', line: "The Conductor wanted an AI to keep the whole system in time. He didn't get her. He'll want something else now. Something bigger." },
    { l: 'player', who: 'player', line: 'Then we stay out of time.',
      byTemp: { Calm: "Then we stay a step ahead. Rest up, band.", Sarcastic: 'Great. A supervillain with a shopping list.', Idealistic: "Then we take away his instruments, one at a time.", Ruthless: "Then he'll come to us. Good." } },
    { l: null, r: null, card: { track: 'Next session', name: 'Mister Nocturne' }, mood: 'title', sfx: 'cymbal', fx: 'flash' }
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
  ],
  // ---- Track 06: Mister Nocturne ----
  nocturne_depart: [
    { bg: 'lounge', mood: 'ship', l: 'player', r: 'brushes', who: 'brushes', line: 'Titan, Captain. The Lyceum. Mister Nocturne plays there tonight, one night only, on a stolen grand piano.' },
    { r: 'rook', who: 'rook', line: "Forty-one stolen instruments. Every one of them famous for playing the same four bars. That's not a hobby. That's a list." },
    { if: 'sol_story', r: 'tam', who: 'tam', line: "And Old Sol's coming. By tram. I don't think trams go to Titan, Cap. I didn't have the heart to tell him." },
    { if: 'lyra_joined', r: 'lyra', who: 'lyra', line: 'I have read the show programme. Ninety minutes, no interval, and the lighting cues are on the beat. Interesting.' },
    { r: 'brushes', who: 'brushes', sfx: 'countin', line: 'Titan, locked in. One... two... one, two, three, four.' },
    { l: null, r: null, card: { track: 'Track 06', name: 'Mister Nocturne' }, mood: 'title', sfx: 'cymbal', fx: 'flash' },
    { bg: 'titan', mood: 'titan', caption: 'Titan. An orange sky, a city of concert halls, and a whole moon that dresses up for the evening.' }
  ],
  titan_arrive: [
    { bg: 'titan', mood: 'titan', l: 'player', r: 'sax', if: 'sol_story', who: 'sax', line: "Took you long enough. The tram was very slow. I don't want to talk about the tram." },
    { l: 'player', r: 'tam', who: 'tam', line: "Lyceum Square, Cap. The stage door's round the right-hand side. I'll go and make friends with the stage crew. Whoever's left of them." },
    { r: 'rhea', if: 'rhea_joined', who: 'rhea', line: "Front of house is all ushers. Nocturne's people. Let's not go in the front." }
  ],
  heist: [
    { bg: 'lyceum', mood: 'nocturne', l: 'player', r: null, caption: 'You wait for the downbeat. Nocturne raises both hands over the Halcyon for the big finish.' },
    { sfx: 'clank', fx: 'shake', caption: 'You pull the lever. The stage lift drops. So does the Halcyon. So, briefly, does the music.' },
    { l: 'tam', who: 'tam', line: 'Got her! Got her! She is heavy and I love her!' },
    { r: 'nocturne', who: 'nocturne', fx: 'flash', sfx: 'scratch', line: 'My piano. You took my piano in the middle of my nocturne.' },
    { who: 'nocturne', line: "Do you know what that instrument is? It's the only one left that remembers the whole song. He will pay anything for it." },
    { l: 'player', who: 'player', line: 'Who will?',
      byTemp: { Calm: 'Who is he paying you for?', Sarcastic: 'Let me guess. A man with a baton.', Idealistic: "It doesn't belong to you. Or him.", Ruthless: 'Thirty-four thousand chits says you come quietly.' } },
    { who: 'nocturne', line: 'The Conductor, of course. Now, an encore. Players! From the top!' },
    { l: 'brushes', who: 'brushes', line: 'Captain, those clockwork players are his accompaniment. While they play, he is hard to hurt. Stop the band, then stop the bandleader.' }
  ],
  nocturne_victory: [
    { bg: 'lyceum', mood: 'ship', l: 'player', r: 'nocturne', who: 'nocturne', line: '...Unaccompanied. How humiliating.' },
    { who: 'nocturne', line: "He only wanted the four bars. Forty-one instruments, and none of them could play the rest. The rest died with Mae Halloway." },
    { l: 'sax', if: 'sol_story', who: 'sax', line: "No it didn't, you fraud." },
    { l: 'tam', who: 'tam', line: "Cap, the audience is giving us a standing ovation. I think they think this was the show." }
  ],
  nocturne_ending: [
    { bg: 'lounge', mood: 'ship', l: 'brushes', r: 'tam', if: 'piano_kept', who: 'tam', line: "The Halcyon's bolted down in the lounge. Gerald's in his spot by the window. Everybody's happy. Gerald's happiest." },
    { if: 'piano_kept', l: 'brushes', r: 'lyra', who: 'brushes', line: 'Captain, I can play the fifth bar now. All five bars together are called Halcyon. They sound like coming home.' },
    { if: 'piano_sol', l: 'brushes', r: 'tam', who: 'brushes', line: 'Old Sol sent a recording. The whole song, five bars, on the Halcyon, in the Flat Ninth. The bar was full. Nobody talked.' },
    { if: 'piano_sold', l: 'rook', r: 'tam', who: 'rook', line: "The buyer paid in full and didn't haggle. Didn't leave a name, either. Just a little drawing of a baton." },
    { if: 'piano_sold', who: 'tam', line: "...Cap. I think we just sold it to him." },
    { r: 'rhea', if: 'rhea_joined', who: 'rhea', line: "Nocturne is singing to the Bounty Office. Forty-one instruments, one buyer, and every one of them for the same four bars." },
    { l: 'player', who: 'player', line: 'Then he only needs the fifth bar.',
      byTemp: { Calm: "Then the last piece is the fifth bar. We should keep it safe.", Sarcastic: "Great. A supervillain who can't finish a song.", Idealistic: "He'll never have it. Not the whole song.", Ruthless: 'Then the fifth bar is worth more than his bounty.' } }
  ],

  // Act 2 finale: the Conductor names the Hi-Hat a loose end. Plays once, on the ship, after Track 06.
  act2_finale: [
    { bg: 'lounge', mood: 'tense', l: 'brushes', r: 'tam', who: 'brushes', sfx: 'scratch', line: 'Captain. The speakers have switched themselves on again. I am noting it again.' },
    { bg: 'broadcast', mood: 'finale', l: null, r: 'conductor', who: 'conductor', fx: 'flash', sfx: 'cymbal', line: 'Good evening, Captain. A private broadcast, this time. Only your ship. I thought you had earned it.' },
    { who: 'conductor', line: 'The Mantis. My Nyx girl. Forty-one instruments and a piano. You have been dismantling my orchestra, one player at a time.' },
    { who: 'conductor', if: 'lyra_joined', line: 'And you kept her. L-7, conducting a jukebox on a cargo ship. What a waste of perfect time.' },
    { who: 'conductor', if: 'piano_sold', line: 'Though I must thank you for the Halcyon. Very reasonably priced. Not that it helps me. She will not play the fifth bar for me.' },
    { who: 'conductor', if: 'fifth_bar', line: 'And now you have heard the fifth bar. Which makes you the last people alive who know the end of my song.' },
    { l: 'player', who: 'player', line: 'So what are we to you?',
      byTemp: { Calm: 'So what happens now?', Sarcastic: "Let me guess. We're your biggest fans.", Idealistic: "We're the people who are going to stop you.", Ruthless: "We're the people collecting a quarter of a million chits." } },
    { who: 'conductor', fx: 'shake', line: 'You, Captain, are a loose end. And the Hi-Hat is the last note out of tune in my system.' },
    { who: 'conductor', line: 'I tidy up loose ends. Enjoy the intermission.' },
    { bg: 'lounge', mood: 'tense', l: 'rook', r: 'tam', who: 'rook', line: '...I liked it better when he was talking to everybody.' },
    { r: 'rhea', if: 'rhea_joined', who: 'rhea', line: "He's scared. People who aren't scared don't make house calls." },
    { r: 'lyra', if: 'lyra_joined', who: 'lyra', line: "His broadcast ran half a beat late. He's rushing. I have never heard him rush." },
    { l: 'brushes', r: 'tam', who: 'brushes', line: 'Captain, this is the end of Side B. After this comes the encore. I have checked. There is always an encore.' },
    { l: 'player', who: 'player', line: 'Then we play it loud.',
      byTemp: { Calm: "Then we'll be ready for it.", Sarcastic: 'Great. I love audience participation.', Idealistic: "Then the encore's ours.", Ruthless: 'Then he can come and collect.' } },
    { l: null, r: null, card: { track: 'End of', name: 'Side B' }, mood: 'title', sfx: 'cymbal', fx: 'flash' }
  ],
  // ---- Act 3 opens: the Conductor puts a price on the crew ----
  hunted: [
    { bg: 'lounge', mood: 'tense', l: 'brushes', r: 'rook', who: 'brushes', sfx: 'scratch', line: 'Captain. Every bounty board in the system just updated at once. We are on all of them.' },
    { who: 'rook', line: "A hundred thousand chits a head. Alive. They've done a drawing of each of us. Tam, they've done one of Gerald." },
    { r: 'tam', who: 'tam', line: "Gerald is a PLANT." },
    { who: 'rook', line: "It says 'accessory'." },
    { r: 'rhea', if: 'rhea_joined', who: 'rhea', line: "Posted through a Helix shell account. Cygnus Station office. That's Hale's floor." },
    { r: 'brushes', ifNot: 'rhea_joined', who: 'brushes', line: 'The money came from a Helix account on Cygnus Station. Director Hale\'s office.' },
    { r: 'lyra', if: 'lyra_joined', who: 'lyra', line: 'He is not trying to catch us. He is trying to make every hunter in the system listen for us. It is the same thing he always does.' },
    { r: 'brushes', who: 'brushes', line: 'And Cygnus has locked down its plaza "for public safety". The public is mostly bounty hunters now.' },
    { l: 'player', who: 'player', line: "Then we go to Cygnus and ask Helix who's paying.",
      byTemp: { Calm: "Then we go to Cygnus, quietly, and ask Helix who's paying.", Sarcastic: 'A hundred thousand? I am honestly a little insulted.', Idealistic: "He wants us scared. We go to Cygnus instead.", Ruthless: "A quarter of a million on him, a hundred on us. I like those odds." } },
    { l: null, r: null, card: { track: 'Act 3', name: 'The Encore' }, mood: 'title', sfx: 'cymbal', fx: 'flash' }
  ],
  conductor_depart: [
    { bg: 'lounge', mood: 'ship', l: 'player', r: 'tam', who: 'tam', line: "I painted over the Hi-Hat's name for the docking log. Now it says the Hi-Hut. Nobody will suspect a thing." },
    { r: 'rook', if: 'std_office', who: 'rook', line: "Marshal Okoro's running the Cygnus checkpoint. The Office owes us. She might owe us enough." },
    { r: 'rook', if: 'cass_free', who: 'rook', line: "Cass sent a message. She's already on Cygnus. It just says 'Don't be late'. She was always early." },
    { r: 'tam', if: 'std_docks', who: 'tam', line: "Ozzie's cousin Benny works the Cygnus cargo hatches. He says there's a way under the plaza." },
    { r: 'tam', if: 'mantis_spared', who: 'tam', line: "Ferro's meeting us there with the Mantis. Her message says, and I quote, 'Nobody puts a price on my apprentice.'" },
    { r: 'brushes', who: 'brushes', sfx: 'countin', line: 'Cygnus Station, locked in. One... two... one, two, three, four.' },
    { l: null, r: null, card: { track: 'Track 07', name: 'The Conductor' }, mood: 'title', sfx: 'cymbal', fx: 'flash' },
    { bg: 'lockdown', mood: 'lockdown', caption: 'Cygnus Station. The rain has not stopped. Neither have the collectors.' }
  ],
  // in Hale's office: the Metronome, and who stands with you
  crane_ambush: [
    { bg: 'helix', mood: 'tense', l: 'player', r: 'hale', who: 'hale', line: 'Captain. You came in the front door. Brave or stupid. I never could tell with you.' },
    { r: 'crane', who: 'crane', fx: 'shake', sfx: 'bang', line: "Both, I'd say. Good evening, Director. Good evening, Captain." },
    { who: 'crane', line: 'Silas Crane. Twenty years with the Bounty Office. Four hundred collections. Never late, never early. They call me the Metronome.' },
    { l: 'player', who: 'player', line: 'Never heard of you.',
      byTemp: { Calm: "Who's paying you, Crane?", Sarcastic: 'The Metronome. Do you also do weddings?', Idealistic: 'You used to bring people in for the Office. What happened?', Ruthless: "Four hundred and one, then. Let's see how you count." } },
    { r: 'hale', who: 'hale', line: 'Crane, this is my office.' },
    { r: 'crane', who: 'crane', line: "It's his office, Director. It always was." },
    { l: 'cass', if: 'cass_free', who: 'cass', line: 'Room for one more? Hi, Rook.' },
    { l: 'juno', if: 'juno_protected', who: 'juno', line: "Juno, on your comms. I'm in the tower's systems. Say the word and his hunters go half blind." },
    { l: 'lyra', if: 'proto_free', who: 'lyra', line: '...Hello, big brother. I am in the speakers. When he counts, I will play the wrong note.' },
    { l: 'lyra', if: 'lyra_joined', who: 'lyra', line: 'He counts in fours, Captain. I can count in sevens. Let us see how he likes that.' },
    { l: 'brushes', if: 'fifth_bar', who: 'brushes', line: 'Captain, I have the fifth bar ready. Just say when.' },
    { l: 'rook', if: 'bonded_rook', who: 'rook', line: "I've got your back, Cap. Always have. Don't tell anyone." },
    { l: 'tam', if: 'bonded_tam', who: 'tam', line: 'Nobody collects my captain. Nobody.' },
    { l: 'rhea', if: 'bonded_rhea', who: 'rhea', line: "I'm not leaving you alone in a room with Helix. Not again." },
    { l: 'brushes', if: 'bonded_brushes', who: 'brushes', line: 'One... two... We are with you, Captain. All of us.' },
    { l: 'player', r: 'crane', who: 'crane', line: 'Four bars, Captain. Then I collect.' }
  ],
  // Crane is down. Hale tells you who the Conductor is.
  metronome_victory: [
    { bg: 'helix', mood: 'finale', l: 'player', r: 'crane', who: 'crane', line: 'Four... bars... I never... miss... the one.' },
    { r: 'hale', who: 'hale', line: "Enough, Silas. Captain, put that away. I didn't post your bounty. I've been paying for it." },
    { who: 'hale', line: 'The Conductor is my father. Ambrose Hale. He founded Helix Salvage forty years ago, and he died twelve years ago. I signed the certificate myself.' },
    { who: 'hale', line: 'Before Helix, he studied piano with a teacher on Titan. Mae Halloway. She sent him away before the last lesson.' },
    { l: 'brushes', who: 'brushes', line: 'Before the fifth bar.' },
    { who: 'hale', line: "She told him: you want to own the music, Ambrose, and you can't play what you own. He has spent fifty years trying to buy the end of her song." },
    { l: 'rhea', if: 'rhea_joined', who: 'rhea', line: "The Listening Network. Every relay, every tuning core. It was never for listening to people. It's listening for one tune." },
    { who: 'hale', line: 'When the whole system plays all five bars at once, every relay locks to his tuning. Every comm, every ship, every door. One song. His.' },
    { who: 'hale', line: "He lives inside it now. The listening array past Saturn. Helix calls it Blue Note station. I keep the lights on." },
    { if: 'fifth_bar', who: 'hale', line: "And you know the fifth bar. Nobody else alive does. That's why your faces are on every board." },
    { ifNot: 'fifth_bar', who: 'hale', line: "You've cost him his Mantis, his conductor and his piano. You're the last loose ends he has. That's why your faces are on every board." },
    { if: 'piano_sold', l: 'tam', who: 'tam', line: '...We sold him the Halcyon.' },
    { if: 'piano_sold', who: 'hale', line: "And it won't play the ending for him. He thinks you can find it. He thinks you're the last people who could." },
    { l: 'player', who: 'player', line: 'Why tell us any of this?',
      byTemp: { Calm: 'Why tell us any of this, Director?', Sarcastic: 'And you thought you would mention it now. Over a body.', Idealistic: "He's your father. Why help us?", Ruthless: "What's in it for you?" } },
    { who: 'hale', line: "Because after you, I'm his next loose end. He told me so at dinner. He always was a terrible father." }
  ],
  conductor_ending: [
    { bg: 'lounge', mood: 'ship', l: 'brushes', r: 'tam', who: 'brushes', line: 'Captain, the Bounty Office has taken our faces off every board. Silas Crane testified. Very slowly. Exactly in time.' },
    { if: 'hale_ally', r: 'tam', who: 'tam', line: "Hale's in the spare bunk. I gave her the one by the noisy pipe. She's named the pipe 'Father'." },
    { if: 'hale_office', l: 'rook', r: 'tam', who: 'rook', line: "Hale's in an Office cell on Cygnus. She asked for a piano. They said no. She said that was fair." },
    { if: 'hale_free', l: 'rook', r: 'tam', who: 'rook', line: "Hale took a shuttle out an hour ago. She left the docking codes and a note. It says 'Play it loud'." },
    { if: 'juno_protected', l: 'brushes', r: 'juno', who: 'juno', line: "Captain, it's Juno. I'm in Blue Note's maintenance channel. It's real, it's enormous, and it's... humming. I'll be your eyes." },
    { if: 'lyra_joined', l: 'brushes', r: 'lyra', who: 'lyra', line: 'Blue Note station. That name is in my training data, Captain. It is where they were going to send me.' },
    { if: 'piano_kept', l: 'brushes', r: 'tam', who: 'brushes', line: 'The Halcyon is very quiet tonight. I think it knows where we are going.' },
    { l: 'player', r: 'brushes', who: 'player', line: 'Set a course for Saturn.',
      byTemp: { Calm: 'Rest up, everyone. Then we set a course for Saturn.', Sarcastic: 'A secret station full of speakers. What could go wrong?', Idealistic: "He wants one song. We're going to give him a band.", Ruthless: 'Set a course for Saturn. I want my quarter of a million.' } },
    { l: null, r: null, card: { track: 'Next session', name: 'Blue Note' }, mood: 'title', sfx: 'cymbal', fx: 'flash' }
  ],
  // ---- Track 08: Blue Note ----
  bluenote_depart: [
    { bg: 'lounge', mood: 'ship', l: 'player', r: 'brushes', who: 'brushes', line: "Course laid in for Saturn, Captain. Blue Note station. Hale's codes say it has no crew. Only ears." },
    { r: 'hale', if: 'hale_ally', who: 'hale', line: "He designed it to need two people at once. Doors that only open from the other side. He never trusted anyone enough to use it properly." },
    { r: 'juno', if: 'juno_protected', who: 'juno', line: "Captain, I'm on comms. The array's been listening for one tune for fifty years. Let's give it something else to listen to." },
    { r: 'tam', who: 'tam', line: "So we're breaking into a giant ear. I've packed earplugs. For the ear." },
    { r: 'brushes', who: 'brushes', sfx: 'countin', line: 'Blue Note, locked in. One... two... one, two, three, four.' },
    { l: null, r: null, card: { track: 'Track 08', name: 'Blue Note' }, mood: 'title', sfx: 'cymbal', fx: 'flash' },
    { bg: 'bluenote', mood: 'bluenote', caption: "Blue Note station. A ring of dishes the size of moons, all of them turned inwards, listening to the rest of us." }
  ],
  bn_arrive: [
    { bg: 'bluenote', mood: 'bluenote', l: 'player', r: 'brushes', who: 'brushes', line: 'Docked. Captain, it is so quiet. Not empty quiet. Listening quiet.' },
    { r: 'rook', who: 'rook', line: "Every speaker on this station is pointed at us. I feel like I'm on stage. I hate being on stage." },
    { r: 'tam', who: 'tam', line: "The ring door's right there, by the dock. Let's see what kind of welcome mat Mr Hale left out." }
  ],
  bn_split: [
    { bg: 'bluenote', mood: 'bluenote', l: 'player', r: 'brushes', who: 'brushes', line: 'Team A takes the outer ring with you, Captain. Team B takes the maintenance spine.' },
    { who: 'brushes', line: 'Each team opens the other team\'s doors. Swap between us whenever you need to. We will wait exactly where you leave us. Probably humming.' },
    { l: 'player', who: 'player', line: 'Stay on comms.',
      byTemp: { Calm: 'Stay on comms. Nobody does anything clever without telling me.', Sarcastic: "Two teams, one brain cell. Let's share it nicely.", Idealistic: "We've got each other's backs. That's the whole plan.", Ruthless: "Open your doors fast. I'm not waiting long." } }
  ],
  bnm_tam: [
    { bg: 'bluenote', mood: 'ship', l: 'tam', r: null, who: 'tam', line: "Cap. Look at the stamp on this tuning arm. D. FERRO, TARGON WORKS." },
    { who: 'tam', line: "Ferro built these arms forty years ago. She never knew what they were for. She thought she was building a telescope." },
    { if: 'mantis_spared', who: 'tam', line: "She's going to be furious. I'm telling her anyway. She'd want to know." },
    { who: 'tam', line: "...There. T.O. WAS HERE. Right underneath hers. Now it's both of us." }
  ],
  bnm_brushes: [
    { bg: 'bluenote', mood: 'ship', l: 'brushes', who: 'brushes', line: 'Captain, this is a production archive. B-series percussion. It is my production line.' },
    { who: 'brushes', line: 'One recording is marked ERROR. The reason I was scrapped. My first improvised fill.' },
    { who: null, caption: 'Brushes plays it. It is four seconds long, and it is wonderful.' },
    { who: 'brushes', line: 'They kept it. They called it a mistake and they kept it. I am keeping it too. Under GOOD.' }
  ],
  bnm_lyra: [
    { bg: 'bluenote', mood: 'nyx', if: 'lyra_joined', l: 'lyra', who: 'lyra', line: "A conductor's podium. With a slot shaped exactly like me. This is where he wanted me to stand, Captain. Conducting everything." },
    { if: 'lyra_joined', who: 'lyra', line: 'I prefer the jukebox. And the lounge. And you lot.' },
    { bg: 'bluenote', mood: 'nyx', if: 'proto_free', l: null, r: 'lyra', who: 'lyra', line: "...Hello, Captain. I am in the speakers. I have seen this podium from the inside of the network." },
    { if: 'proto_free', who: 'lyra', line: 'He built it for me. I am standing on it now, in a way, and playing it the wrong note. He hates that.' },
    { bg: 'bluenote', mood: 'nyx', if: 'proto_returned', l: null, r: 'sato', who: 'sato', line: "Captain, it's Dr Sato, on a recorded message. Lyra's safe on Nyx. She asked me to tell you something if you ever found this podium." },
    { if: 'proto_returned', who: 'sato', line: "She said: it is empty. Keep it that way." }
  ],
  bnm_rook: [
    { bg: 'bluenote', mood: 'tense', l: 'rook', who: 'rook', line: "Office logbook. Every bounty I ever worked with Cass, copied here. With a little baton drawn next to each one." },
    { who: 'rook', line: "He was using us. Every collection we made, we were tidying up for him." },
    { if: 'cass_free', who: 'rook', line: "Cass would laugh at this. Then she'd hit something. I'll send her a copy." },
    { if: 'cass_jailed', who: 'rook', line: "Cass is in a cell for doing his dirty work. I put her there. ...When this is over, I'm going to visit her." },
    { who: 'rook', line: "Okay. I'm awake now. Properly awake. Let's finish this." }
  ],
  bnm_rhea: [
    { bg: 'bluenote', mood: 'tense', if: 'rhea_joined', l: 'rhea', who: 'rhea', line: "My old Helix login still works. Twelve years and they never closed it. Sloppy." },
    { if: 'rhea_joined', who: 'rhea', line: "Locking the relay routing. When Warden Prime tries to reroute power to a dead node, it'll hit a wall. My wall." },
    { bg: 'bluenote', mood: 'tense', ifNot: 'rhea_joined', l: 'player', r: 'rhea', who: 'rhea', line: "...Captain. Didn't think I'd see you again." },
    { ifNot: 'rhea_joined', who: 'rhea', line: "After Juno, I walked. Took a Helix contract. Ended up here, listening to everybody. I'm done listening." },
    { ifNot: 'rhea_joined', who: 'rhea', line: "I've locked the relay routing for you. Warden Prime won't reroute its nodes easily. Then I'm on the next shuttle out." },
    { ifNot: 'rhea_joined', who: 'player', line: 'Thank you, Rhea.',
      byTemp: { Calm: 'Thank you, Rhea. Get somewhere safe.', Sarcastic: 'Still sarcastic. Still the best signals tech I know.', Idealistic: "You're always welcome aboard. You know that.", Ruthless: "We'll call it even." } }
  ],
  bnm_juno: [
    { bg: 'bluenote', mood: 'tense', if: 'juno_handed', l: 'player', r: 'juno', who: 'juno', line: "Captain? ...Captain. Hale handed me to him. He's had me tuning this array for months." },
    { if: 'juno_handed', who: 'juno', line: "Don't apologise. Open the door. I know this station's control loop better than he does, and I am going to wreck it." },
    { bg: 'bluenote', mood: 'tense', if: 'juno_protected', l: 'player', r: 'juno', who: 'juno', line: "Captain, that cell. It's got my name on it. It was built for me. In case you'd handed me over." },
    { if: 'juno_protected', who: 'juno', line: "...Thank you. Really. I'm in the array's control loop now. The relay nodes are going to have a very bad day." }
  ],
  bn_core: [
    { bg: 'bluenote', mood: 'tense', l: 'player', r: 'brushes', who: 'brushes', line: 'Team B in the node room. Team A at the core door. Captain, I can hear both of you. Stereo.' },
    { r: 'warden', who: 'warden', fx: 'shake', sfx: 'clank', line: 'NETWORK INTRUSION. ALL WARDEN UNITS: ONE NETWORK. ONE VOICE.' },
    { if: 'hale_ally', r: 'hale', who: 'hale', line: "That's Warden Prime. Every Warden you've ever fought was one of its fingers. The nodes in Team B's room power its shield. Take them out, and it's naked." },
    { ifNot: 'hale_ally', r: 'brushes', who: 'brushes', line: "Captain, the three nodes in our room are feeding that thing's shield. We take them down, you take it down. Teamwork!" },
    { l: 'player', who: 'player', line: 'Both teams. On the one.',
      byTemp: { Calm: 'Both teams, together. On the one.', Sarcastic: 'Great. A giant robot organ. Let us play it.', Idealistic: "This is what he never had. A band. Let's go.", Ruthless: 'Take it apart. All of it.' } }
  ],
  bluenote_victory: [
    { bg: 'bluenote', mood: 'finale', l: 'player', r: 'conductor', who: 'conductor', fx: 'flash', sfx: 'scratch', line: 'Bravo. Two bands on one stage, in perfect time. Mae would have liked you, Captain.' },
    { who: 'conductor', line: "But you are playing to an empty hall. I left before the overture, and I took the broadcast core with me." },
    { if: 'fifth_bar', who: 'conductor', line: 'I will hear the fifth bar soon. From you. Everyone will. I have built a very good stage for it.' },
    { ifNot: 'fifth_bar', who: 'conductor', line: "I will find the fifth bar. Somebody always remembers the end of a song. They just need the right stage." },
    { l: 'brushes', r: 'tam', who: 'brushes', line: 'Team A! Team B! Everybody is in one piece. Rook has a new scratch. He says it is a battle scar. It is from a door.' },
    { r: 'hale', if: 'hale_ally', who: 'hale', line: "The broadcast core. He can play to every speaker in the system at once with it. He's going somewhere with an audience." }
  ],
  bluenote_ending: [
    { bg: 'lounge', mood: 'ship', l: 'brushes', r: 'tam', who: 'brushes', line: 'Captain, the whole crew is back aboard. Both teams. I counted twice. Then I counted in.' },
    { if: 'array_down', r: 'tam', who: 'tam', line: "The array's in pieces. Ferro's buying the tuning arms back. She cried a bit. She says it was dust." },
    { if: 'array_ours', l: 'brushes', r: 'juno', who: 'juno', line: "I've got the array listening for him now, for once. He can't hum without us hearing it." },
    { if: 'array_fifth', l: 'brushes', r: 'rook', who: 'rook', line: 'Every noodle cart in the system played the fifth bar today. My sister called. She cried. She hates music.' },
    { r: 'rhea', if: 'rhea_joined', who: 'rhea', line: "The broadcast core went out on a Helix freighter, headed for Titan. Where Mae Halloway taught him. He's going home to finish the song." },
    { r: 'brushes', ifNot: 'rhea_joined', who: 'brushes', line: "The broadcast core left on a Helix freighter, headed for Titan. Where Mae Halloway taught him. He is going home to finish the song." },
    { r: 'hale', if: 'hale_ally', who: 'hale', line: 'The Lyceum. He always said the acoustics were perfect. He means to play all five bars there, to everyone, at once.' },
    { l: 'player', r: 'brushes', who: 'player', line: 'Then we play the last set.',
      byTemp: { Calm: 'Then we finish this. One last set.', Sarcastic: "Great. A finale. I'll wear a nice jacket.", Idealistic: "Then the song ends our way.", Ruthless: 'Then we go collect. Quarter of a million.' } },
    { l: null, r: null, card: { track: 'Next session', name: 'Last Set' }, mood: 'title', sfx: 'cymbal', fx: 'flash' }
  ]

};
