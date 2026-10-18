// Full-screen cut-paper backdrops for cutscenes and battles (SVG strings).
import { PAL as P } from './color.js';

const rnd = (a, b) => a + Math.random() * (b - a);
function stars(n, w, h) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<circle cx="${rnd(0, w).toFixed(1)}" cy="${rnd(0, h).toFixed(1)}" r="${rnd(.5, 2).toFixed(2)}" fill="${P.cream}" opacity="${rnd(.25, 1).toFixed(2)}"/>`;
  return s;
}
const jupiter = (cx, cy, r, id) => `
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#b9764b"/><stop offset=".18" stop-color="#e8c49a"/><stop offset=".3" stop-color="#a9653f"/>
    <stop offset=".45" stop-color="#f0d6ae"/><stop offset=".58" stop-color="#c48456"/><stop offset=".72" stop-color="#ead0a6"/>
    <stop offset=".86" stop-color="#9b5b38"/><stop offset="1" stop-color="#d9b088"/></linearGradient></defs>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>
  <ellipse cx="${cx + r * .3}" cy="${cy + r * .25}" rx="${r * .18}" ry="${r * .09}" fill="${P.crimson}" opacity=".8"/>
  <path d="M${cx - r} ${cy} A${r} ${r} 0 0 0 ${cx + r} ${cy} A${r} ${r * .25} 0 0 1 ${cx - r} ${cy}Z" fill="${P.ink}" opacity=".35"/>`;

const SHIP = `<g class="cs-fly"><g transform="translate(0 610)">
  <ellipse cx="0" cy="0" rx="70" ry="16" fill="${P.cream}"/><path d="M-40 -6 C-30 -34 30 -34 40 -6Z" fill="${P.teal}"/>
  <path d="M-62 4 L-96 26 L-50 10Z" fill="${P.crimson}"/><circle cx="-74" cy="0" r="8" fill="${P.mustard}"/>
  <path d="M-84 0 L-150 -6 L-150 6Z" fill="${P.mustard}" opacity=".6"/></g></g>`;

const open = '<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">';
const cache = {};

const BUILD = {
  space: () => `${open}<rect width="1600" height="900" fill="${P.ink}"/>${stars(220, 1600, 900)}
    ${jupiter(1180, 330, 300, 'bdJupA')}
    <circle cx="380" cy="700" r="70" fill="#a8a59a"/><circle cx="356" cy="680" r="14" fill="#8a877d"/><circle cx="404" cy="724" r="10" fill="#8a877d"/>
    ${SHIP}</svg>`,
  lounge: () => `${open}
    <defs><clipPath id="bdPort"><circle cx="1060" cy="360" r="250"/></clipPath></defs>
    <rect width="1600" height="900" fill="#1b2132"/><rect width="1600" height="90" fill="#151a28"/>
    <path d="M0 720 H1600 V900 H0Z" fill="#141826"/>
    <g clip-path="url(#bdPort)"><rect x="800" y="100" width="520" height="520" fill="${P.ink}"/>${stars(70, 1600, 900)}${jupiter(1150, 420, 190, 'bdJupB')}</g>
    <circle cx="1060" cy="360" r="250" fill="none" stroke="#3a4258" stroke-width="34"/>
    <rect x="170" y="150" width="200" height="280" fill="${P.mustard}"/><rect x="170" y="330" width="200" height="40" fill="${P.crimson}"/>
    <circle cx="270" cy="250" r="62" fill="${P.ink}"/><circle cx="270" cy="250" r="12" fill="${P.mustard}"/>
    <text x="270" y="410" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="28" fill="${P.ink}">LIVE AT IO</text>
    <path d="M500 0 V120" stroke="${P.ink}" stroke-width="4"/><path d="M460 120 H540 L520 160 H480Z" fill="${P.teal}"/>
    <path d="M480 160 L380 520 H620 L520 160Z" fill="${P.mustard}" opacity=".07"/>
    <path d="M60 720 V600 Q60 560 100 560 H640 Q680 560 680 600 V720Z" fill="#2c3a4a"/>
    <rect x="40" y="640" width="660" height="90" rx="20" fill="#34465a"/></svg>`,
  docks: () => {
    const cols = ['#1f5f5c', '#7a2a24', '#2f3346', '#5b3f74'];
    let boxes = '';
    for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) {
      if (Math.random() < .25 && r > 0) continue;
      boxes += `<rect x="${i * 180 + (r % 2) * 60 - 40}" y="${700 - r * 80}" width="170" height="78" fill="${cols[Math.floor(Math.random() * 4)]}" stroke="${P.ink}" stroke-width="4"/>`;
    }
    return `${open}
    <defs><linearGradient id="bdHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151827"/><stop offset=".55" stop-color="#4a2a30"/><stop offset=".85" stop-color="#b0662e"/><stop offset="1" stop-color="${P.mustard}"/></linearGradient></defs>
    <rect width="1600" height="900" fill="url(#bdHaze)"/>${stars(60, 1600, 300)}${jupiter(260, 180, 120, 'bdJupC')}
    <g stroke="${P.ink}" stroke-width="10" fill="none"><path d="M1180 760 V120 H1520 M1180 200 L1260 120 M1260 120 V200 M1340 120 L1260 200 M1400 120 V320"/></g>
    <rect x="1370" y="320" width="60" height="40" fill="${P.ink}"/>${boxes}
    <text x="620" y="760" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="64" fill="${P.cream}" opacity=".75">DOCK 9</text>
    <rect y="790" width="1600" height="110" fill="${P.ink}"/>
    <path d="M300 300 V790 M1000 260 V790" stroke="${P.ink}" stroke-width="10"/>
    <path d="M300 300 L180 790 H420Z M1000 260 L860 790 H1140Z" fill="${P.mustard}" opacity=".13"/>
    <circle cx="300" cy="300" r="12" fill="${P.mustard}"/><circle cx="1000" cy="260" r="12" fill="${P.mustard}"/></svg>`;
  },
  warehouse: () => {
    let sheets = '';
    for (let i = 0; i < 26; i++) sheets += `<rect x="${380 + (i % 13) * 66}" y="${560 + Math.floor(i / 13) * 26 - (i % 3) * 4}" width="60" height="20" fill="${i % 4 ? P.cream : '#cfc4a8'}" opacity=".9"/>`;
    return `${open}
    <rect width="1600" height="900" fill="#141824"/>
    <g fill="#1d2232">${Array.from({ length: 20 }, (_, i) => `<rect x="${i * 84}" y="0" width="40" height="640"/>`).join('')}</g>
    <path d="M0 0 H1600 V60 H0Z" fill="#0b0d16"/>
    <path d="M800 60 L560 640 H1040Z" fill="${P.mustard}" opacity=".1"/><rect x="770" y="40" width="60" height="26" fill="${P.mustard}"/>
    <rect x="0" y="640" width="1600" height="260" fill="#0f121c"/>
    <rect x="520" y="380" width="560" height="200" fill="#2f3346" stroke="${P.ink}" stroke-width="6"/>
    <rect x="560" y="300" width="480" height="90" fill="#3a4258" stroke="${P.ink}" stroke-width="6"/>
    <circle cx="640" cy="345" r="30" fill="${P.ink}"/><circle cx="960" cy="345" r="30" fill="${P.ink}"/>
    <circle cx="640" cy="345" r="12" fill="${P.crimson}"/><circle cx="960" cy="345" r="12" fill="${P.crimson}"/>
    <text x="800" y="500" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="54" fill="${P.mustard}">MOREAU FINE PAPER</text>
    ${sheets}
    <g fill="${P.cream}" opacity=".85">${Array.from({ length: 18 }, () => `<rect x="${rnd(100, 1500).toFixed(0)}" y="${rnd(120, 620).toFixed(0)}" width="34" height="16" transform="rotate(${rnd(-40, 40).toFixed(0)} 800 400)"/>`).join('')}</g>
    <rect x="80" y="520" width="240" height="120" fill="#7a2a24" stroke="${P.ink}" stroke-width="5"/><rect x="1280" y="500" width="260" height="140" fill="#1f5f5c" stroke="${P.ink}" stroke-width="5"/></svg>`;
  },
  station: () => {
    let towers = '', windows = '';
    const cols = ['#161a2c', '#1b2036', '#121626'];
    for (let i = 0; i < 16; i++) {
      const x = i * 104 - 20 + rnd(-10, 10), w = rnd(80, 130), h = rnd(260, 620), y = 900 - h;
      towers += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${cols[i % 3]}"/>`;
      for (let k = 0; k < 14; k++) if (Math.random() < .55) windows += `<rect x="${(x + 10 + (k % 4) * (w - 20) / 4).toFixed(0)}" y="${(y + 20 + Math.floor(k / 4) * 40).toFixed(0)}" width="8" height="14" fill="${Math.random() < .2 ? P.mustard : '#3a4a70'}" opacity=".8"/>`;
    }
    const sign = (x, y, w, h, c, t, fs) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0b0d18" stroke="${c}" stroke-width="5"/><rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" fill="${c}" opacity=".12"/>
      <text x="${x + w / 2}" y="${y + h / 2 + fs * .35}" text-anchor="middle" font-family="Noto Sans JP, sans-serif" font-weight="700" font-size="${fs}" fill="${c}">${t}</text>`;
    let rain = '';
    for (let i = 0; i < 120; i++) { const x = rnd(0, 1700), y = rnd(0, 900); rain += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-8 26" stroke="#9fc6e0" stroke-width="2" opacity=".25"/>`; }
    return `${open}
    <defs><linearGradient id="bdNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0d1c"/><stop offset=".7" stop-color="#2a1838"/><stop offset="1" stop-color="#4a1f3a"/></linearGradient></defs>
    <rect width="1600" height="900" fill="url(#bdNight)"/>${stars(60, 1600, 300)}
    <path d="M-100 260 Q800 -60 1700 260" stroke="#3a4258" stroke-width="40" fill="none"/><path d="M-100 260 Q800 -60 1700 260" stroke="#5fe3d4" stroke-width="3" fill="none" opacity=".5"/>
    ${towers}${windows}
    ${sign(160, 420, 120, 220, '#ff5fa2', 'バー', 52)}
    ${sign(620, 360, 360, 90, '#5fe3d4', 'シグナス', 56)}
    ${sign(1240, 470, 150, 170, '#ffd34d', '麺', 96)}
    <rect y="820" width="1600" height="80" fill="#0b0d18"/><rect y="820" width="1600" height="3" fill="#ff5fa2" opacity=".5"/>
    ${rain}</svg>`;
  },
  relay_out: () => `${open}<rect width="1600" height="900" fill="#05060c"/>${stars(260, 1600, 900)}
    <circle cx="1380" cy="160" r="40" fill="#f3c860" opacity=".9"/><circle cx="1380" cy="160" r="90" fill="#f3c860" opacity=".08"/>
    <g transform="translate(800 470)">
      <rect x="-420" y="-18" width="840" height="36" fill="#2f3346"/><rect x="-420" y="-18" width="840" height="6" fill="#46516a"/>
      <rect x="-90" y="-150" width="180" height="300" fill="#262a3a"/><rect x="-60" y="-260" width="120" height="110" fill="#30364a"/>
      <path d="M0 -260 V-380" stroke="#46516a" stroke-width="10"/><circle cx="0" cy="-390" r="16" fill="${P.crimson}"/>
      <rect x="-380" y="-60" width="120" height="120" fill="#30364a"/><rect x="260" y="-60" width="120" height="120" fill="#30364a"/>
      <rect x="-520" y="-90" width="90" height="180" fill="#1b4a6a" stroke="#46516a" stroke-width="6"/><rect x="430" y="-90" width="90" height="180" fill="#1b4a6a" stroke="#46516a" stroke-width="6"/>
      ${Array.from({ length: 10 }, (_, i) => `<rect x="${-70 + (i % 5) * 30}" y="${-120 + Math.floor(i / 5) * 60}" width="14" height="10" fill="${P.crimson}" opacity=".8"/>`).join('')}
      <text x="0" y="40" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="54" fill="#5d6a80">K-17</text>
    </g>${SHIP}</svg>`,
  relay_in: () => `${open}<rect width="1600" height="900" fill="#0e1018"/>
    <path d="M0 0 L520 260 H1080 L1600 0Z" fill="#161a26"/><path d="M0 900 L520 640 H1080 L1600 900Z" fill="#1b1f2c"/>
    <rect x="520" y="260" width="560" height="380" fill="#05060c"/>${stars(40, 1600, 900).replace(/<circle/g, '<circle clip-path="url(#bdWin)"')}
    <defs><clipPath id="bdWin"><rect x="520" y="260" width="560" height="380"/></clipPath></defs>
    <rect x="520" y="260" width="560" height="380" fill="none" stroke="#3a4258" stroke-width="18"/>
    <g fill="#10121a">${[60, 200, 1300, 1440].map(x => `<rect x="${x}" y="300" width="110" height="420"/>`).join('')}</g>
    ${[60, 200, 1300, 1440].map(x => Array.from({ length: 6 }, (_, k) => `<rect x="${x + 16}" y="${330 + k * 60}" width="8" height="8" fill="${k % 2 ? P.crimson : '#5fe3d4'}"/>`).join('')).join('')}
    <rect x="0" y="120" width="1600" height="8" fill="${P.crimson}" opacity=".6"/><rect x="0" y="120" width="1600" height="60" fill="${P.crimson}" opacity=".06"/></svg>`,
  vesta: () => {
    let stalls = '', lamps = '';
    const cols = [[P.crimson, P.cream], [P.teal, P.cream], [P.mustard, '#6b4a2a']];
    for (let i = 0; i < 7; i++) {
      const x = 40 + i * 225, [a, b] = cols[i % 3], y = 600 + (i % 2) * 30;
      stalls += `<rect x="${x}" y="${y}" width="170" height="130" fill="#3a2a20"/>`;
      for (let k = 0; k < 170; k += 34) stalls += `<rect x="${x + k}" y="${y - 40}" width="17" height="44" fill="${a}"/><rect x="${x + k + 17}" y="${y - 40}" width="17" height="44" fill="${b}"/>`;
      stalls += `<rect x="${x + 20}" y="${y + 30}" width="30" height="20" fill="${P.mustard}"/><rect x="${x + 70}" y="${y + 26}" width="40" height="24" fill="#7fe0c8"/>`;
    }
    for (let i = 0; i < 9; i++) { const x = 90 + i * 180, y = 300 + (i % 3) * 40; lamps += `<path d="M${x} 0 V${y}" stroke="#2c1e10" stroke-width="3"/><circle cx="${x}" cy="${y + 12}" r="12" fill="#f3c860"/><circle cx="${x}" cy="${y + 12}" r="46" fill="#f3c860" opacity=".12"/>`; }
    return `${open}<rect width="1600" height="900" fill="#1c1714"/>
      <path d="M0 0 H1600 V260 Q1300 180 1100 240 Q800 140 500 230 Q250 170 0 250Z" fill="#2a221e"/>
      <path d="M0 520 Q400 440 800 500 Q1200 430 1600 510 V900 H0Z" fill="#2e241f"/>
      <path d="M-50 900 V380 Q200 120 520 380 V900Z M1080 900 V380 Q1400 120 1650 380 V900Z" fill="#3a2e28"/>
      <path d="M0 740 H1600 V900 H0Z" fill="#4c3e36"/>${lamps}${stalls}
      <text x="800" y="200" text-anchor="middle" font-family="Noto Sans JP, sans-serif" font-weight="700" font-size="64" fill="${P.mustard}" opacity=".85">ベスタ市場</text></svg>`;
  },
  tunnel: () => `${open}<rect width="1600" height="900" fill="#120e0c"/>
    <path d="M0 0 H1600 V900 H0Z M400 220 Q800 60 1200 220 V900 H400Z" fill="#2a221e" fill-rule="evenodd"/>
    <path d="M400 220 Q800 60 1200 220" stroke="#3a2e28" stroke-width="40" fill="none"/>
    ${[460, 640, 960, 1140].map(x => `<rect x="${x - 14}" y="160" width="28" height="740" fill="#3a2418"/>`).join('')}
    <rect x="420" y="150" width="760" height="30" fill="#3a2418"/>
    <path d="M560 900 L760 420 M1040 900 L840 420" stroke="#8d90a8" stroke-width="10"/>
    ${Array.from({ length: 8 }, (_, i) => { const y = 440 + i * 60, w = 120 + i * 60; return `<rect x="${800 - w / 2}" y="${y}" width="${w}" height="10" fill="#3a2418"/>`; }).join('')}
    <circle cx="800" cy="320" r="22" fill="#f3c860"/><circle cx="800" cy="320" r="120" fill="#f3c860" opacity=".08"/>
    <rect x="160" y="560" width="200" height="200" fill="#6b4a2a" stroke="#120e0c" stroke-width="6"/><rect x="1240" y="600" width="220" height="160" fill="#6b4a2a" stroke="#120e0c" stroke-width="6"/>
    <rect x="1300" y="520" width="90" height="80" fill="#4a5470" stroke="#120e0c" stroke-width="6"/><circle cx="1345" cy="560" r="10" fill="${P.crimson}"/></svg>`,
  // The Conductor's broadcast: an empty concert hall on every screen in the system
  broadcast: () => {
    let seats = '', pipes = '';
    for (let r = 0; r < 4; r++) for (let i = 0; i < 22; i++) {
      const x = -20 + i * 78 + (r % 2) * 39, y = 760 + r * 42;
      seats += `<path d="M${x} ${y} q34 -34 68 0 v40 h-68Z" fill="${r % 2 ? '#1a0f16' : '#22121b'}"/>`;
    }
    for (let i = 0; i < 15; i++) { const x = 560 + i * 34, h = 160 + Math.abs(7 - i) * -14 + 120; pipes += `<rect x="${x}" y="${300 - h / 2}" width="20" height="${h}" fill="#3b2c2a"/><rect x="${x}" y="${300 - h / 2}" width="20" height="10" fill="#6b5a3a"/>`; }
    return `${open}<defs>
        <linearGradient id="bdBcCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1e8d4" stop-opacity=".5"/><stop offset="1" stop-color="#f1e8d4" stop-opacity="0"/></linearGradient>
        <pattern id="bdBcScan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#000" opacity=".25"/></pattern>
        <radialGradient id="bdBcVig" cx="50%" cy="50%" r="70%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".8"/></radialGradient>
      </defs>
      <rect width="1600" height="900" fill="#0c070b"/>
      <path d="M200 900 V160 Q800 -40 1400 160 V900Z" fill="#170d13"/>
      ${pipes}
      <path d="M0 0 H360 Q300 300 330 900 H0Z" fill="#5a1414"/><path d="M1600 0 H1240 Q1300 300 1270 900 H1600Z" fill="#5a1414"/>
      ${[40, 120, 200, 280].map(x => `<path d="M${x} 0 Q${x + 20} 450 ${x - 10} 900" stroke="#3d0c0c" stroke-width="16" fill="none"/>`).join('')}
      ${[1320, 1400, 1480, 1560].map(x => `<path d="M${x} 0 Q${x - 20} 450 ${x + 10} 900" stroke="#3d0c0c" stroke-width="16" fill="none"/>`).join('')}
      <path d="M0 0 H1600 V70 Q800 150 0 70Z" fill="#7a1a1a"/><path d="M0 70 Q800 150 1600 70" stroke="${P.mustard}" stroke-width="6" fill="none"/>
      <path d="M260 640 H1340 L1440 720 H160Z" fill="#2a1a12"/><path d="M160 720 H1440 V760 H160Z" fill="#1a100b"/>
      <path d="M720 0 L540 690 H1060 L880 0Z" fill="url(#bdBcCone)"/>
      <ellipse cx="800" cy="680" rx="270" ry="34" fill="#f1e8d4" opacity=".2"/>
      <path d="M760 690 L775 600 H825 L840 690Z" fill="#0c070b"/><rect x="755" y="592" width="90" height="12" fill="${P.mustard}"/>
      <path d="M800 470 L774 600 M800 470 L826 600" stroke="#0c070b" stroke-width="6"/><rect x="770" y="456" width="60" height="20" fill="#0c070b" transform="rotate(-8 800 466)"/>
      ${seats}
      <g transform="translate(1180 120)"><rect width="200" height="64" fill="#12070a" stroke="${P.crimson}" stroke-width="4"/><circle cx="34" cy="32" r="11" fill="${P.crimson}"/>
        <text x="118" y="44" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="38" fill="${P.crimson}">ON AIR</text></g>
      <text x="800" y="230" text-anchor="middle" font-family="Noto Sans JP, sans-serif" font-weight="700" font-size="58" fill="${P.mustard}" opacity=".5">指揮者</text>
      <rect width="1600" height="900" fill="url(#bdBcScan)"/><rect width="1600" height="900" fill="url(#bdBcVig)"/></svg>`;
  },
  black: () => ''
};

export function backdrop(name) {
  if (!(name in cache)) cache[name] = (BUILD[name] || BUILD.black)();
  return cache[name];
}
