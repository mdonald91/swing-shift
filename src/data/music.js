// Your Suno tracks. Drop an MP3 into the music/ folder with the matching file name
// and it plays instead of the generated house band. Leave a file missing and the
// house band covers that spot.
//
// bpm: set it to the track's tempo so combat beat-timing lines up with the song.
export const TRACKS = {
  title:   { file: 'music/title.mp3',   bpm: 168, label: 'Title theme', where: 'The title screen' },
  ship:    { file: 'music/ship.mp3',    bpm: 76,  label: 'The Hi-Hat lounge', where: 'Aboard the Hi-Hat' },
  tense:   { file: 'music/tense.mp3',   bpm: 100, label: 'Night shift', where: 'Dock 9 and the night jobs' },
  station: { file: 'music/station.mp3', bpm: 112, label: 'Cygnus in the rain', where: 'Cygnus Station plaza' },
  vesta:   { file: 'music/vesta.mp3',   bpm: 96,  label: 'Vesta market', where: 'The Vesta market ring' },
  targon:  { file: 'music/targon.mp3',  bpm: 104, label: 'Shaft 3', where: 'The Targon mine' },
  nyx:     { file: 'music/nyx.mp3',     bpm: 88,  label: 'Nyx, under glass', where: 'The Nyx research moon' },
  titan:   { file: 'music/titan.mp3',   bpm: 116, label: 'Lyceum Square', where: 'Lyceum Square, Titan' },
  nocturne: { file: 'music/nocturne.mp3', bpm: 84, label: "Mister Nocturne's show (the heist keeps its beat)", where: 'The Lyceum heist and Mister Nocturne' },
  lockdown: { file: 'music/lockdown.mp3', bpm: 100, label: 'Cygnus under lockdown', where: 'Cygnus under lockdown' },
  helix:   { file: 'music/helix.mp3',   bpm: 92,  label: 'Helix Salvage, top floor', where: 'Helix Salvage tower' },
  bluenote: { file: 'music/bluenote.mp3', bpm: 96, label: 'Blue Note, the listening array', where: 'Blue Note station' },
  lastset: { file: 'music/lastset.mp3', bpm: 132, label: 'Last Set (the final movement)', where: 'The last movement of the finale', unlock: 'bluenote_done' },
  battle:  { file: 'music/battle.mp3',  bpm: 192, label: 'Big band brawl', where: 'Every fight' },
  victory: { file: 'music/victory.mp3', bpm: 150, label: 'Payday', where: 'The payday ledger' },
  brushes: { file: 'music/brushes.mp3', bpm: 120, label: "Brushes' song", where: 'Brushes\' song, in the lounge', unlock: 'song_done' },
  finale:  { file: 'music/finale.mp3',  bpm: 66,  label: "The Conductor's broadcast", where: 'The Conductor\'s broadcasts', unlock: 'act1_done' }
};
