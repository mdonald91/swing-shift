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
    id: 'mantis', name: 'Iron Mantis', sub: 'Security mech · Targon',
    reward: 32000, risk: 'A', portrait: 'unknown', track: 'Track 04',
    client: 'Targon Mining Co.', wanted: 'Disabled', unlock: 'Track 04 arrives in a later build',
    desc: 'A mining security mech has gone rogue and claimed a whole shaft as its own.'
  },
  {
    id: 'proto', name: 'Runaway Prototype', sub: 'Experimental AI · Nyx',
    reward: 26000, risk: 'B', portrait: 'unknown', track: 'Track 05',
    client: 'Nyx Applied Sciences', wanted: 'Recovered', unlock: 'Opens later',
    desc: 'An experimental AI walked out of a lab on Nyx. Brushes would like to talk to it first.'
  }
];
