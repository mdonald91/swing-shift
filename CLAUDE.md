# Working on Swing Shift

- After adding or editing any map in `src/data/maps.js`, run `node tools/check-maps.mjs` and fix every problem it reports before shipping. Also walk the new map in a browser with real collisions (not by calling dialogue directly), from the spawn to every object and character.
- Bump `VERSION` in `sw.js` and the build label in `src/ui/title.js` with every release, so installed phones pick up the update.
- Saves must keep working across updates: new state fields need defaults in `src/state.js` (`blank()` and `loadGame()`).
- The roadmap lives in Mitchell's "Swing Shift Roadmap" doc; tick off each build there when it ships.
