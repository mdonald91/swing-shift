// Offline support. Bump VERSION whenever you publish an update so phones pick it up.
const VERSION = 'swing-shift-v0.7.0';
const SHELL = [
  './', 'index.html', 'styles.css', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'vendor/phaser.min.js',
  'src/main.js', 'src/bus.js', 'src/state.js',
  'src/art/backdrops.js', 'src/art/color.js', 'src/art/pixel.js', 'src/art/portrait.js',
  'src/data/appearance.js', 'src/data/battles.js', 'src/data/bounties.js', 'src/data/crew.js', 'src/data/cutscenes.js',
  'src/data/dialogue.js', 'src/data/maps.js', 'src/data/music.js', 'src/data/shop.js',
  'src/scenes/WorldScene.js', 'src/systems/audio.js', 'src/systems/input.js', 'src/systems/party.js',
  'src/ui/ui.js', 'src/ui/title.js', 'src/ui/creator.js', 'src/ui/dialog.js',
  'src/ui/menus.js', 'src/ui/hud.js', 'src/ui/cutscene.js', 'src/ui/battle.js', 'src/ui/busk.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Serve from cache straight away, refresh the cache in the background.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(VERSION).then(async cache => {
      const hit = await cache.match(e.request);
      const net = fetch(e.request).then(res => {
        if (res && (res.ok || res.type === 'opaque')) cache.put(e.request, res.clone());
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
