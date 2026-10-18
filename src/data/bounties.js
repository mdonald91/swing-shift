// Contracts on the bounty board. "unlock" text shows on contracts that aren't open yet.
export const BOUNTIES = [
  {
    id: 'velvet', name: 'Velvet Moreau', sub: 'Counterfeiter · Ganymede, Dock 9',
    reward: 15000, risk: 'B', portrait: 'velvet', track: 'Track 01',
    client: 'Ganymede Credit Union', wanted: 'Alive',
    desc: 'Prints credit chits good enough to fool three banks and one ex-husband. Moving a shipment out of Dock 9 tonight.'
  },
  {
    id: 'ghost', name: 'Ghost Frequency', sub: 'Missing crew · Relay K-17',
    reward: 24000, risk: 'B', portrait: 'unknown', track: 'Track 02',
    client: 'Helix Salvage', wanted: 'Crew of 5 (missing)', requires: 'ghost_offered', unlock: 'Meet Helix Salvage on Cygnus Station',
    desc: 'An old relay station went dark three weeks ago. A faint transmission has been detected. Find the crew and work out what happened.'
  },
  {
    id: 'courier', name: 'The Missing Courier', sub: 'Person of interest · Vesta',
    reward: 18000, risk: 'C', portrait: 'wren', track: 'Track 03',
    client: 'Ada Castillo, her sister', wanted: 'Found and returned', requires: 'ghost_done', unlock: 'Finish Track 02 first',
    desc: 'Wren Castillo, a courier, vanished on Vesta with a sealed case nobody will describe. Her sister wants her home.'
  },
  {
    id: 'conductor', name: 'The Conductor', sub: 'Wanted · Whereabouts unknown',
    reward: 250000, risk: 'S', portrait: 'conductor', track: 'Side B',
    client: 'Bounty Office, system-wide', wanted: 'Alive, preferably', showIf: 'act1_done', unlock: 'The hunt continues on Side B', lockedText: 'Hunted in the Encore, Act 3',
    desc: 'Hijacked every speaker in the system to introduce himself. Linked to the counterfeit chits, Relay K-17 and the Helix tuning core. Nobody has seen his face.'
  },
  {
    id: 'nocturne', name: 'Mister Nocturne', sub: 'Instrument thief · Titan',
    reward: 34000, risk: 'A', portrait: 'nocturne', track: 'Track 06',
    client: 'Bounty Office (and Old Sol)', wanted: 'Alive, and the piano back', requires: 'proto_done', unlock: 'Finish Track 05 first',
    desc: 'A collector who steals instruments: forty-one so far, every one of them famous for playing the same four bars. Tonight he plays a stolen grand piano live at the Lyceum on Titan.'
  },
  {
    id: 'mantis', name: 'Iron Mantis', sub: 'Rogue rescue mech · Targon',
    reward: 32000, risk: 'A', portrait: 'mantis', track: 'Track 04',
    client: 'Targon Mining Co.', wanted: 'Disabled', requires: 'act1_done', unlock: 'Finish Side A first',
    desc: 'A mining rescue mech has gone rogue and claimed Shaft 3 as its own. The engineer who built it went down after it two days ago.'
  },
  {
    id: 'proto', name: 'Runaway Prototype', sub: 'Experimental AI · Nyx',
    reward: 26000, risk: 'B', portrait: 'lyra', track: 'Track 05',
    client: 'Nyx Applied Sciences', wanted: 'Recovered', requires: 'mantis_done', unlock: 'Finish Track 04 first',
    desc: 'An experimental AI walked out of a lab on Nyx. Brushes would like to talk to it first.'
  }
];
