// Sitting in with Old Sol: an eight-beat rhythm game for loose change.
import { state, setFlag } from '../state.js';
import { block, unblock } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { beatWindowBonus } from '../systems/party.js';
import { el, sceneLayer, toast } from './ui.js';
import { Hud } from './hud.js';

const BEATS = 8;

export function busk() {
  return new Promise(resolve => {
    block();
    const root = el(`<div class="busk" role="dialog" aria-label="Busking">
      <div class="panel busk-box">
        <p class="eyebrow">Sitting in with Old Sol</p>
        <h3 class="busk-title">Tap on every beat</h3>
        <div class="busk-stage">
          <div class="ring"><i class="target"></i><i class="shrink"></i><span class="ring-label">Count in...</span></div>
        </div>
        <div class="busk-dots">${Array.from({ length: BEATS }, () => '<i></i>').join('')}</div>
        <p class="busk-hint">Tap anywhere or press Space as the ring closes.</p>
      </div>
    </div>`);
    sceneLayer().append(root);
    const $ = s => root.querySelector(s);
    const dots = [...root.querySelectorAll('.busk-dots i')];
    const window = .2 + beatWindowBonus();
    const start = Math.ceil(Audio.beatPos()) + 4;     // four beats of count-in
    const targets = Array.from({ length: BEATS }, (_, i) => ({ beat: start + i, q: null }));
    let raf = 0, done = false, counted = -1;

    function judge(t, q) {
      t.q = q;
      const i = targets.indexOf(t);
      dots[i].className = q;
      $('.ring-label').textContent = { perfect: 'On the beat!', good: 'In the pocket', miss: 'Clam!' }[q];
      Audio.sfx(q === 'perfect' ? 'perfect' : q === 'good' ? 'tok' : 'clam');
      $('.ring').classList.toggle('perfect', q === 'perfect');
    }
    function press() {
      if (done) return;
      const bp = Audio.beatPos();
      const t = targets.find(x => !x.q && Math.abs(bp - x.beat) <= .45);
      if (!t) return;
      const d = Math.abs(bp - t.beat);
      judge(t, d <= window ? 'perfect' : d <= window * 2 ? 'good' : 'miss');
    }
    function frame() {
      const bp = Audio.beatPos();
      if (bp < start - .5) {
        const n = Math.floor(start - bp);
        if (n !== counted && n >= 1 && n <= 4) { counted = n; $('.ring-label').textContent = String(5 - n); Audio.sfx('tick'); }
      }
      targets.forEach(t => { if (!t.q && bp > t.beat + .45) judge(t, 'miss'); });
      const next = targets.find(t => !t.q);
      if (next) {
        const left = next.beat - bp;
        $('.ring .shrink').style.transform = `scale(${(1 + Math.max(0, Math.min(1, left)) * 1.7).toFixed(3)})`;
      } else if (!done) { finish(); return; }
      raf = requestAnimationFrame(frame);
    }
    function finish() {
      done = true;
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      const perfect = targets.filter(t => t.q === 'perfect').length, good = targets.filter(t => t.q === 'good').length;
      const pay = perfect * 30 + good * 12;
      state.chits += pay;
      setFlag('busked_visit'); setFlag('busked_ever');
      const verdict = perfect >= 7 ? 'The plaza goes wild. Someone throws a shoe. A good shoe.'
        : perfect + good >= 6 ? 'A small crowd gathers. Old Sol nods, which from him is a standing ovation.'
        : perfect + good >= 3 ? 'A few people stop. One of them was waiting for a tram.'
        : 'A pigeon watches you, judgementally.';
      $('.busk-box').innerHTML = `<p class="eyebrow">Set over</p><h3 class="busk-title">${perfect} on the beat · ${good} in the pocket</h3>
        <p class="busk-verdict">${verdict}</p><p class="busk-pay">Tips: <b class="gold">₡ ${pay}</b></p>
        <button class="btn primary" type="button" data-ok>Take a bow</button>`;
      Audio.sfx(pay > 150 ? 'save' : 'confirm');
      $('[data-ok]').focus({ preventScroll: true });
      $('[data-ok]').addEventListener('click', () => {
        root.remove(); unblock(); Hud.refresh();
        if (pay) toast(`Earned ₡ ${pay} busking`);
        resolve(pay);
      });
    }
    const onKey = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); press(); } };
    root.addEventListener('pointerdown', e => { if (!e.target.closest('button')) press(); });
    document.addEventListener('keydown', onKey);
    raf = requestAnimationFrame(frame);
  });
}
