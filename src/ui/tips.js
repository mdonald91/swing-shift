// First-time tutorial cards. Each one shows once per save; they can be switched off in Settings.
import { state, settings } from '../state.js';
import { block, unblock } from '../systems/input.js';
import { Audio } from '../systems/audio.js';
import { el, esc, sceneLayer } from './ui.js';

const touch = () => matchMedia('(pointer: coarse)').matches;

export const TIPS = {
  controls: () => ({
    title: 'Getting around',
    lines: touch()
      ? ['Drag the stick on the left to walk.', 'Tap <b>A</b> to talk to people and examine things. A prompt appears when you are close enough.', 'The <b>Menu</b> button has your crew, bag, saves and settings.']
      : ['Walk with <b>WASD</b> or the arrow keys.', 'Press <b>Space</b> or <b>E</b> to talk to people and examine things.', 'Press <b>Esc</b> or <b>M</b> for your crew, bag, saves and settings.']
  }),
  battle: () => ({
    title: 'Combat',
    lines: ['Everyone takes a turn, then the other side plays their solo.', 'Pick an attack, a <b>Skill</b> (costs SP), an <b>Item</b>, or <b>Defend</b> to take less damage and recover SP.', 'Tap an enemy card to choose who to hit.']
  }),
  rhythm: () => ({
    title: 'Play on the beat',
    lines: settings.rhythm === 'auto'
      ? ['Every move has a beat ring. Auto rhythm is on, so the band plays it for you.', 'You can change this in Settings, under Rhythm.']
      : ['Every move has a beat ring. Tap anywhere (or press Space) as the outer ring closes on the circle.', '<b>On the beat</b> hits harder and fills the Groove meter fastest. Early or late still works, just less well.', 'If taps feel off, especially with Bluetooth, use <b>Calibrate</b> in Settings.']
  }),
  types: () => ({
    title: 'Weak spots',
    lines: ['Attacks are <b>Shot</b>, <b>Blunt</b> or <b>Shock</b>. Each crew member hits with a different one.', '<b>Weak</b> tags on an enemy card show what hurts it most (half as much again). <b>Resist</b> tags show what it shrugs off.']
  }),
  jam: () => ({
    title: 'Jam Session',
    lines: ['The Groove meter is full, so <b>Jam Session</b> has joined the command list.', 'The whole crew plays at once and hits every enemy. Land the beat for the biggest finish.']
  }),
  skills: () => ({
    title: 'New skills',
    lines: ['Someone has reached a new tier of their skill tree.', 'Open the <b>Menu</b>, then <b>Crew</b>, then <b>Learn a new skill</b>. Each tier has two choices.']
  }),
  spots: () => ({
    title: 'Spotlights',
    lines: settings.rhythm === 'normal'
      ? ['The follow-spots move with the beat of the show: two beats on, two beats off. A light flickers just before it switches on.', 'Wait in the dark between lights, then move on the dark beats. If a light catches you, you start that stretch again.']
      : ['The follow-spots move with the beat of the show. A light flickers just before it switches on.', 'Your rhythm setting is easier, so each light only stays on for one beat. Wait in the dark, then move.']
  }),
  echo: () => ({
    title: 'Echo lock',
    lines: ['Someone sings a short phrase on the four pads. Watch and listen, then tap the same pads in the same order.', 'Each pad has its own colour, shape and number (keys 1 to 4), so you can follow it without sound too. A wrong note just plays the phrase again.']
  }),
  busk: () => ({
    title: 'Sitting in',
    lines: ['Four clicks count you in, then eight beats. Tap as each ring closes.', 'Every beat you land earns tips. Perfect ones earn more.']
  })
};

// Shows the tip if it hasn't been seen on this save. Resolves when it's dismissed (or straight away).
export function tip(id, parent) {
  if (!settings.tutorials || !state.flags || state.flags['tut_' + id] || !TIPS[id]) return Promise.resolve(false);
  state.flags['tut_' + id] = true;
  const t = TIPS[id]();
  return new Promise(res => {
    block();
    const node = el(`<div class="tip" role="dialog" aria-modal="true" aria-label="${esc(t.title)}">
      <div class="tip-card">
        <p class="eyebrow">How to play</p>
        <h3>${esc(t.title)}</h3>
        ${t.lines.map(l => `<p>${l}</p>`).join('')}
        <button class="btn primary" type="button">Got it</button>
      </div>
    </div>`);
    (parent || sceneLayer()).append(node);
    Audio.sfx('blip', 700);
    const btn = node.querySelector('button');
    setTimeout(() => btn.focus({ preventScroll: true }), 30);
    node.addEventListener('pointerdown', e => e.stopPropagation());
    btn.addEventListener('click', e => {
      e.stopPropagation();
      Audio.sfx('confirm');
      node.remove(); unblock();
      setTimeout(() => res(true), 120);
    });
  });
}
