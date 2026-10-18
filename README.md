# Swing Shift

A bounty-hunter JRPG with a jazz soundtrack. Create your captain, walk the decks of the Hi-Hat, talk to your crew and take contracts from the bounty board.

Plays in any modern browser and installs on your phone as an app.

## Play it

Once GitHub Pages is on (see below), open `https://<your-username>.github.io/swing-shift/`.

**Install on your phone:** open the link, then use *Add to Home Screen* (iPhone: Share button; Android: browser menu). It opens full screen, landscape, and works offline.

**Controls**

| | Keyboard | Touch |
|---|---|---|
| Move | Arrow keys or WASD | Drag anywhere on the left half of the screen |
| Talk / use | Space, E or Enter | **A** button |
| Pick a choice | 1–4, or arrows + Space | Tap it |
| Menu | Esc or M | **Menu** button |

## Turn on GitHub Pages

1. In the repo on GitHub: **Settings → Pages**.
2. Under *Build and deployment*, set **Source** to *Deploy from a branch*, branch **main**, folder **/ (root)**. Save.
3. After a minute or two the link appears at the top of that page.

No build step: the files in this repo are the game.

## Publishing an update

After changing files, open `sw.js` and bump `VERSION` (for example `swing-shift-v0.2.0` → `swing-shift-v0.2.1`). Installed copies on phones pick up the new version the next time they're opened with a connection (sometimes it takes a second launch).

## Your Suno soundtrack

Put MP3s in the `music/` folder with these names:

| File | Where it plays | Default tempo |
|---|---|---|
| `title.mp3` | Title screen | 168 bpm |
| `ship.mp3` | Aboard the Hi-Hat | 76 bpm |
| `tense.mp3` | Stakeouts and standoffs | 100 bpm |
| `station.mp3` | Cygnus Station plaza | 112 bpm |
| `vesta.mp3` | Vesta market and tunnels | 96 bpm |
| `battle.mp3` | Combat | 192 bpm |
| `victory.mp3` | Payday | 150 bpm |
| `brushes.mp3` | Brushes' song (jukebox, after his side chat) | 120 bpm |
| `targon.mp3` | Targon mine surface | 104 bpm |
| `nyx.mp3` | Nyx labs and the garden dome | 88 bpm |
| `titan.mp3` | Titan, Lyceum Square | 116 bpm |
| `nocturne.mp3` | Mister Nocturne's show, backstage (the spotlights follow its beat) | 84 bpm |
| `lockdown.mp3` | Cygnus Station under lockdown (Act 3) | 100 bpm |
| `helix.mp3` | Helix Salvage, the top floor | 92 bpm |
| `finale.mp3` | The Conductor's broadcasts (Act 1 and Act 2 finales) | 66 bpm |

Any file that's missing is covered by the built-in generated jazz combo. If a track's tempo is different, change its `bpm` in `src/data/music.js` so the combat beat timing lines up with the song. You can switch your tracks off under **Settings → Use my Suno tracks**, and audition every slot on the ship's jukebox.

## Where things live

| Folder | What's in it |
|---|---|
| `src/data/` | The content: dialogue, cutscenes, battles, bounties, crew, maps, character-creator options, music slots. Most new story goes here. |
| `src/ui/` | Title screen, New Game screen, dialogue box, menus, HUD and touch controls. |
| `src/scenes/` | The walkable world (Phaser). |
| `src/art/` | All art, drawn in code: pixel sprites and tiles, SVG portraits and cutscene backdrops. |
| `src/systems/` | Music engine and input. |

**Writing dialogue:** see the notes at the top of `src/data/dialogue.js`. Choices can be tied to a temperament (`temp: 'Sarcastic'`) so only captains with that temperament see them.

**Editing maps:** `src/data/maps.js` draws each map with one character per tile. The key is at the top of that file. After changing a map, run `node tools/check-maps.mjs`: it walks every map from its spawn points and reports anything a player can't reach.

**Balancing fights:** `node tools/balance.mjs` simulates every fight hundreds of times at different crew levels and prints the win rate and how much HP is left. Enemy stats live in `src/data/battles.js`.

Saves are kept in the browser on each device (3 slots).

## Roadmap

- [x] **0.2 Foundation:** title, save slots, character creator, the Hi-Hat, crew dialogue with temperament choices, bounty board, ship menu, settings, jukebox, phone install
- [x] **0.3 Track 01, Counterfeit Swing:** cutscenes, the Dock 9 mission map with clues to find, party combat (Attack / Skill / Item / Defend / Run, on-the-beat timing, Jam Session), captain skills by temperament, the payday ledger
- [x] **0.4 Hub life:** supply terminal and Ozzie's stall, new items (Hot Coffee, Patch Kit), gear upgrades, faction standing, crew side chats with bond perks, Brushes' song
- [x] **0.5 Cygnus Station:** neon plaza in the rain, the Flat Ninth bar (rumours, Lou, Rhea), Kessler's Outfitters and Neon Noodle, busking with Old Sol, Helix Salvage offers Ghost Frequency
- [x] **0.6 Track 02, Ghost Frequency:** Relay K-17 (dark until you restore power, doors, keycard, minimap), Rhea joins with her own skills, party selection, drone skirmish, the Warden boss, a choice with real consequences
- [x] **0.7 Track 03, The Missing Courier:** Vesta's market and mine tunnels, tailing a suspect using stalls as cover, the Sable and Vox duet boss, the first sign of the Conductor, what to do with the Helix tuning core
- [x] **0.8 Levels and skills:** XP and levels to 30, a 5-tier skill tree per crew member, Shot/Blunt/Shock weaknesses, gunmen, hackers and heavy mechs, optional side fights on every map, Brushes' holo-rehearsal, rebalanced bosses
- [x] **0.9 Act 1 polish:** beat calibration, Relaxed and Auto rhythm modes, bigger text, less screen shake, tutorial tips, save anywhere plus autosave, the Act 1 finale and a Story so far screen
- [x] **0.10 Track 04, Iron Mantis:** Targon's mine and Shaft 3, power-routing puzzles, lifts and the ore-cart line, a cave-in, Tam's mentor Dagny Ferro, the stance-shifting Iron Mantis boss and what to do with it
- [x] **0.11 Hi-Hat upgrades and side jobs:** an upgrades terminal (Tam's workshop for crafting with scrap, a recording booth with new Jam Session styles, a bigger engine), odd jobs on the bounty board, Rook's old partner, the Flat Ninth's regulars and new rumours
- [x] **0.12 Track 05, Runaway Prototype:** Nyx's labs and the frozen garden dome, the echo lock, Lyra and Brushes' origin, the Sentinel boss, and Lyra joining as a fifth crew member with her own skill tree
- [x] **0.13 Track 06, Mister Nocturne:** Titan's Lyceum Square, a backstage heist timed to the show's beat, Old Sol's teacher and the fifth bar, the Mister Nocturne boss, the Halcyon choice, and the end of Act 2
- [x] **0.14 Track 07, The Conductor:** Act 3 opens with a bounty on the crew, Cygnus Station under lockdown with collectors on patrol, shortcuts opened by your standing and old friends, the Metronome boss, who stands with you in the fight, and the Conductor's name
- [ ] **0.15 and on: Blue Note and Last Set** (see the full roadmap doc)

Built with [Phaser 3](https://phaser.io) (MIT licence), included in `vendor/`.
