// Odd jobs: which are on offer, the one you've taken, and paying out.
import { JOBS, STORY_JOBS } from '../data/jobs.js';
import { ENCOUNTERS } from '../data/battles.js';
import { DIALOGUE } from '../data/dialogue.js';
import { state, addRep } from '../state.js';
import { partyAverageLevel } from './party.js';

const ALL = [...JOBS, ...STORY_JOBS];
export const jobById = id => ALL.find(j => j.id === id);
export const activeJob = () => state.job ? jobById(state.job.id) : null;

// Rook's story job first (when it's open), then three regular jobs that rotate as you finish them.
export function offers() {
  const f = state.flags;
  const story = STORY_JOBS.filter(j => f[j.needs] && !f[j.done]);
  const pool = JOBS.filter(j => f[j.needs]);
  if (!pool.length) return story;
  const start = ((state.jobsDone || 0) * 2) % pool.length;
  const regular = [...pool.slice(start), ...pool.slice(0, start)].slice(0, 3);
  return [...story, ...regular];
}

export function payFor(j) { return j.pay ? Math.round((j.pay + 45 * (partyAverageLevel() - 1)) / 10) * 10 : 0; }

export function accept(j) {
  state.job = { id: j.id, picked: false };
  if (j.kind === 'fight') registerFight(j);
}

export function abandon() { state.job = null; }

// The fight for the active job, scaled to the crew like the rehearsal.
export function registerFight(j) {
  ENCOUNTERS.job = { ...j.enc, scale: true, job: true, reward: { chits: payFor(j) } };
}

// Markers that stand on the map while a job is active (story jobs use their own person).
export function jobNpcs(location) {
  const j = activeJob();
  if (!j || !j.at || j.map !== location) return [];
  return [{ id: j.at.id || 'job', x: j.at.x, y: j.at.y, look: j.at.look, face: j.at.face || 'down', job: true }];
}

// Conversations for the active job, built on the fly. Returns a dialogue id or null.
export function jobDialogue(npcId) {
  const j = activeJob();
  if (!j) return null;
  if (j.kind === 'fight' && npcId === 'job') {
    if (!ENCOUNTERS.job) registerFight(j);
    DIALOGUE.job_marker = [
      { who: null, t: j.marker },
      { choices: [{ t: 'Deal with it', do: 'fight', arg: 'job' }, { t: 'Not yet' }] }
    ];
    return 'job_marker';
  }
  if (j.kind === 'deliver') {
    if (!state.job.picked && npcId === j.from.npc && state.location === j.from.map) {
      DIALOGUE.job_pickup = [{ who: j.from.npc, t: j.pickup }, { do: 'jobPickup' }];
      return 'job_pickup';
    }
    if (state.job.picked && npcId === j.to.npc && state.location === j.to.map) {
      DIALOGUE.job_drop = [{ who: j.to.npc, t: j.drop }, { do: 'jobDone' }];
      return 'job_drop';
    }
  }
  return null;
}

// What the HUD should say about the active job.
export function jobObjective() {
  const j = activeJob();
  if (!j) return '';
  if (j.kind === 'deliver') return state.job.picked ? `Odd job: take ${j.item} to ${npcName(j.to.npc)}` : `Odd job: collect ${j.item} from ${npcName(j.from.npc)}`;
  return `Odd job: ${j.title} (${j.where})`;
}
const npcName = id => ({ ozzie: 'Ozzie on Dock 9', chef: 'Chef Ama on Cygnus', mags: 'Mags at the Flat Ninth', pell: 'Pell on Vesta', okada: 'Okada on Targon' }[id] || id);

// Pays for the active job and clears it. Returns a line for the toast.
export function completeJob({ paidInFight = false } = {}) {
  const j = activeJob();
  if (!j) return '';
  const pay = paidInFight ? 0 : payFor(j);
  state.chits += pay;
  state.scrap = (state.scrap || 0) + (j.scrap || 0);
  Object.entries(j.gift || {}).forEach(([k, n]) => { state.items[k] = (state.items[k] || 0) + n; });
  if (j.rep && Object.keys(j.rep).length) addRep(j.rep);
  state.jobsDone = (state.jobsDone || 0) + 1;
  state.job = null;
  delete ENCOUNTERS.job;
  const bits = [pay ? `₡ ${pay.toLocaleString('en-AU')}` : '', j.scrap ? `${j.scrap} scrap` : ''].filter(Boolean);
  return `Odd job done: ${j.title}${bits.length ? ' · ' + bits.join(', ') : ''}`;
}
