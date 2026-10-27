// How the record ends. Five endings, chosen by the last choice, how close the crew is and how you've played.
//   encore    play him the fifth bar, with a crew who'd follow you anywhere
//   halftime  play him the fifth bar, but the band isn't tight enough to play it together
//   duet      let Imogen Hale talk to her father
//   lastcall  bring him in, the honest way
//   solo      bring him in, after a record full of cold choices

export const ENDINGS = {
  encore: { n: 'Encore', d: 'The whole band played the fifth bar. Ambrose Hale heard the end of the song.' },
  halftime: { n: 'Half Time', d: 'Brushes played the fifth bar alone. It was enough to end the song, not to keep the band.' },
  duet: { n: 'Duet', d: 'Imogen Hale talked her father down from the stage.' },
  lastcall: { n: 'Last Call', d: 'You brought the Conductor in, alive, and the song stayed unfinished.' },
  solo: { n: 'Solo', d: 'You brought the Conductor in and got paid. The band went its separate ways.' }
};

const CREW = ['rook', 'tam', 'brushes', 'rhea', 'lyra'];

// how close the crew is: bond levels across everyone aboard
export function bondTotal(state, available) {
  return CREW.filter(k => available(k)).reduce((s, k) => s + (state.bonds[k] || 0), 0);
}
// the cold choices: every time the job came before the people
export function coldChoices(f) {
  return ['juno_handed', 'core_sold', 'core_helix', 'piano_sold', 'mantis_scrapped', 'cass_jailed', 'hale_office'].filter(k => f[k]).length;
}

export function pickEnding(state, available) {
  const f = state.flags;
  if (f.final_fifth) return bondTotal(state, available) >= 6 ? 'encore' : 'halftime';
  if (f.final_hale) return 'duet';
  return coldChoices(f) >= 3 ? 'solo' : 'lastcall';
}

// "Where are they now": one line for everyone you met, depending on what you did.
export function whereNow(state, ending) {
  const f = state.flags, out = [];
  const add = (who, line) => line && out.push([who, line]);
  add('Ambrose Hale', {
    encore: 'Ambrose Hale teaches piano in a Bounty Office prison. He makes every student learn all five bars.',
    halftime: 'Ambrose Hale is serving his sentence on Ganymede. He hums the fifth bar, quietly, to nobody.',
    duet: "Ambrose Hale turned himself in, holding his daughter's hand. They write to each other every week.",
    lastcall: "Ambrose Hale is in a maximum-security cell with no speakers in it. He still conducts the silence.",
    solo: 'Ambrose Hale is in prison. He has hired three lawyers and a string quartet.'
  }[ending]);
  add('Imogen Hale', f.hale_ally ? 'Imogen Hale runs what is left of Helix Salvage as a rescue company. The pipe on the Hi-Hat is still named after her father.'
    : f.hale_office ? 'Imogen Hale testified for six days. She asked for a piano in her cell. This time, they said yes.'
    : f.hale_free ? 'Imogen Hale lives somewhere very quiet, with no speakers at all.' : null);
  add('Juno Reyes', f.juno_protected ? 'Juno runs a pirate radio station that only plays requests.'
    : f.bnm_juno ? "Juno is free, and she is Helix's worst nightmare. She sends the crew a song every month." : 'Nobody has heard from Juno Reyes.');
  if (!f.rhea_joined) add('Rhea Vance', f.bnm_rhea ? 'Rhea teaches signals at the Cygnus tech college. Sarcastically.' : 'Rhea Vance left the system for good.');
  add('Lyra', f.lyra_joined ? null : f.proto_free ? 'Lyra lives in the network, playing the wrong note at exactly the right time.'
    : f.proto_returned ? "Dr Sato and Lyra run Nyx's music department. It is the loudest lab on the moon." : null);
  add('Old Sol', f.piano_sol ? 'Old Sol plays the Halcyon every Friday at the Flat Ninth. All five bars.'
    : f.piano_kept ? 'Old Sol visits the Hi-Hat once a month to check the Halcyon is in tune. It always is.'
    : 'Old Sol still busks on the Cygnus plaza. He never mentions the piano.');
  add('Dagny Ferro', f.mantis_spared ? 'Dagny Ferro and the Iron Mantis run a mine rescue team on Targon. The Mantis has a fan club.'
    : f.mantis_core ? 'Dagny Ferro builds telescopes now. Real ones.' : 'Dagny Ferro retired. She keeps one scythe over her workbench.');
  add('Cass Marlowe', f.cass_free ? 'Cass Marlowe opened a detective agency. Rook is a silent partner. Very silent.'
    : f.cass_jailed ? 'Cass Marlowe got out early for good behaviour. Rook was waiting at the gate.' : null);
  add('Velvet Moreau', 'Velvet Moreau is out on parole, forging nothing more dangerous than concert tickets.');
  add('Ozzie Banda', f.thanked_ozzie ? 'Ozzie runs Dock 9 now. The noodle cart is unionised.' : 'Ozzie still works the night shift on Dock 9.');
  add('Wren and Pip', 'Wren Castillo and Pip run the fastest courier service on Cygnus. Rarely on fire.');
  add('Sable and Vox', 'Sable and Vox play a lounge on Vesta as a duo. They argue between every song.');
  add('Mister Nocturne', 'Mister Nocturne plays piano in the prison band. Everyone agrees he is very good. He agrees loudest.');
  add('Fitz', 'Fitz is the Lyceum\'s stage manager again. He has not dropped a sandbag on anyone. Yet.');
  add('Silas Crane', 'Silas Crane teaches tap at a dance school on Cygnus. Strictly in time.');
  add('Marshal Okoro', 'Marshal Okoro runs the Bounty Office on Cygnus. Her first rule: no shell accounts.');
  if (f.hatch_open) add('Benny Banda', 'Benny Banda unionised every hatch on Cygnus Station.');
  add('Mags', 'Mags still runs the Flat Ninth. There is a photo of the Hi-Hat crew behind the bar, slightly crooked.');
  add('Kessler', "Kessler's Outfitters now sells Hi-Hat crew jackets. Unlicensed.");
  add('Gerald', 'Gerald the plant is thriving.');
  return out;
}

// What became of the crew, by ending.
export function crewNow(ending) {
  return {
    encore: 'The Hi-Hat still takes bounties. On Fridays, the crew plays a set at the Flat Ninth, all five bars, and the place is packed.',
    halftime: "The Hi-Hat still flies. Brushes plays the fifth bar every night in the lounge. Not everyone stays to listen any more.",
    duet: 'The Hi-Hat flies with one extra passenger now and then: Imogen Hale, who sits by the Halcyon and says nothing for hours.',
    lastcall: 'The Hi-Hat still takes bounties, still breaks even, just. Rook is asleep on the couch. Tam is hitting the engine. It works.',
    solo: 'A quarter of a million chits bought a better ship. One by one, the crew found other places to be. The new ship is very quiet.'
  }[ending];
}
