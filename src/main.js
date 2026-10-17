// Swing Shift: boots the game canvas and the interface.
import { loadSettings } from './state.js';
import { WorldScene } from './scenes/WorldScene.js';
import { UI } from './ui/ui.js';

class BootScene extends Phaser.Scene {
  constructor() { super('boot'); }
  create() {}
}

loadSettings();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#07080f',
  pixelArt: true,
  roundPixels: true,
  scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
  physics: { default: 'arcade', arcade: { debug: false } },
  input: { keyboard: true, mouse: false, touch: false },
  audio: { noAudio: true },
  banner: false,
  scene: [BootScene, WorldScene]
});

UI.init(game);
window.SwingShift = { game };

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
