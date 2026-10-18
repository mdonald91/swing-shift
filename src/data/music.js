// Your Suno tracks. Drop an MP3 into the music/ folder with the matching file name
// and it plays instead of the generated house band. Leave a file missing and the
// house band covers that spot.
//
// bpm: set it to the track's tempo so combat beat-timing lines up with the song.
export const TRACKS = {
  title:   { file: 'music/title.mp3',   bpm: 168, label: 'Title theme' },
  ship:    { file: 'music/ship.mp3',    bpm: 76,  label: 'The Hi-Hat lounge' },
  tense:   { file: 'music/tense.mp3',   bpm: 100, label: 'Night shift' },
  station: { file: 'music/station.mp3', bpm: 112, label: 'Cygnus in the rain' },
  vesta:   { file: 'music/vesta.mp3',   bpm: 96,  label: 'Vesta market' },
  targon:  { file: 'music/targon.mp3',  bpm: 104, label: 'Shaft 3' },
  nyx:     { file: 'music/nyx.mp3',     bpm: 88,  label: 'Nyx, under glass' },
  titan:   { file: 'music/titan.mp3',   bpm: 116, label: 'Lyceum Square' },
  nocturne: { file: 'music/nocturne.mp3', bpm: 84, label: "Mister Nocturne's show (the heist keeps its beat)" },
  battle:  { file: 'music/battle.mp3',  bpm: 192, label: 'Big band brawl' },
  victory: { file: 'music/victory.mp3', bpm: 150, label: 'Payday' },
  brushes: { file: 'music/brushes.mp3', bpm: 120, label: "Brushes' song", unlock: 'song_done' },
  finale:  { file: 'music/finale.mp3',  bpm: 66,  label: "The Conductor's broadcast", unlock: 'act1_done' }
};
