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
| `battle.mp3` | Combat | 192 bpm |
| `victory.mp3` | Payday | 150 bpm |

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

**Editing the ship:** `src/data/maps.js` draws the map with one character per tile. The key is at the top of that file.

Saves are kept in the browser on each device (3 slots).

## Roadmap

- [x] **0.2 Foundation:** title, save slots, character creator, the Hi-Hat, crew dialogue with temperament choices, bounty board, ship menu, settings, jukebox, phone install
- [x] **0.3 Track 01, Counterfeit Swing:** cutscenes, the Dock 9 mission map with clues to find, party combat (Attack / Skill / Item / Defend / Run, on-the-beat timing, Jam Session), captain skills by temperament, the payday ledger
- [ ] **0.4 Hub life:** shops, buying items with chits, reputation, crew side chats
- [ ] **0.5 Cygnus Station:** explore, bar, shops, rumours
- [ ] **Track 02:** Ghost Frequency (Relay K-17)

Built with [Phaser 3](https://phaser.io) (MIT licence), included in `vendor/`.
