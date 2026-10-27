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

  // Targon: the Shaft 3 headframe under a rust-coloured sky
  mine: () => {
    let huts = '';
    [[60, 560, 300], [420, 600, 220], [1180, 580, 260]].forEach(([x, y, w]) => {
      huts += `<rect x="${x}" y="${y}" width="${w}" height="${800 - y}" fill="#6a3e26"/>`;
      for (let k = 0; k < w; k += 18) huts += `<rect x="${x + k}" y="${y}" width="6" height="${800 - y}" fill="#5a3420"/>`;
      huts += `<path d="M${x - 14} ${y} L${x + w / 2} ${y - 60} L${x + w + 14} ${y}Z" fill="#3a2418"/><rect x="${x + 30}" y="${y + 50}" width="40" height="30" fill="#f3a850" opacity=".85"/>`;
    });
    return `${open}<defs><linearGradient id="bdMineSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1c18"/><stop offset=".6" stop-color="#a5472a"/><stop offset="1" stop-color="#e08a4a"/></linearGradient></defs>
      <rect width="1600" height="900" fill="url(#bdMineSky)"/>
      <circle cx="1240" cy="190" r="120" fill="#e9b23a" opacity=".35"/><circle cx="1240" cy="190" r="70" fill="#f3c860" opacity=".6"/>
      <path d="M0 520 L180 430 L330 480 L520 380 L700 470 L880 400 L1060 470 L1260 390 L1440 460 L1600 420 V900 H0Z" fill="#5a2c1e"/>
      <path d="M0 600 L240 540 L480 590 L760 520 L1040 580 L1320 530 L1600 570 V900 H0Z" fill="#3e2016"/>
      <g stroke="#1c1210" stroke-width="16" fill="none"><path d="M820 800 L900 230 L980 800"/><path d="M845 620 H955 M862 480 H938 M878 350 H922"/><path d="M845 620 L938 480 M955 620 L862 480"/></g>
      <circle cx="900" cy="220" r="46" fill="none" stroke="#1c1210" stroke-width="14"/><circle cx="900" cy="220" r="10" fill="#1c1210"/>
      <path d="M900 266 V800" stroke="#8d90a8" stroke-width="3"/>
      ${huts}
      <path d="M0 800 H1600 V900 H0Z" fill="#2a1a12"/>
      <g stroke="#a0a4b8" stroke-width="5"><path d="M0 838 H1600"/><path d="M0 872 H1600"/></g>
      ${Array.from({ length: 20 }, (_, i) => `<rect x="${i * 84}" y="830" width="16" height="50" fill="#3a2418"/>`).join('')}
      <text x="900" y="160" text-anchor="middle" font-family="Noto Sans JP, sans-serif" font-weight="700" font-size="54" fill="#f3c860" opacity=".75">第三坑</text></svg>`;
  },
  // Deep in Shaft 3: timbered tunnel, lamps, rails into the dark
  mine_deep: () => `${open}<rect width="1600" height="900" fill="#120d0b"/>
    <path d="M0 0 H1600 V900 H0Z M380 240 Q800 80 1220 240 V900 H380Z" fill="#241a16" fill-rule="evenodd"/>
    <path d="M380 240 Q800 80 1220 240" stroke="#3a2a22" stroke-width="44" fill="none"/>
    ${[420, 620, 980, 1180].map(x => `<rect x="${x - 18}" y="150" width="36" height="750" fill="#5a3a22"/><rect x="${x - 18}" y="150" width="8" height="750" fill="#7a5632"/>`).join('')}
    <rect x="400" y="140" width="800" height="36" fill="#5a3a22"/><rect x="400" y="140" width="800" height="8" fill="#7a5632"/>
    ${Array.from({ length: 7 }, (_, i) => { const y = 470 + i * 64, w = 140 + i * 70; return `<rect x="${800 - w / 2}" y="${y}" width="${w}" height="12" fill="#3a2418"/>`; }).join('')}
    <path d="M560 900 L770 450 M1040 900 L830 450" stroke="#a0a4b8" stroke-width="10"/>
    ${[[520, 300], [1080, 300]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#f3a850"/><circle cx="${x}" cy="${y}" r="110" fill="#f3a850" opacity=".08"/><path d="M${x} 176 V${y - 16}" stroke="#1c1210" stroke-width="4"/>`).join('')}
    <circle cx="800" cy="400" r="40" fill="#d5473b" opacity=".18"/><circle cx="785" cy="398" r="5" fill="#d5473b"/><circle cx="815" cy="398" r="5" fill="#d5473b"/>
    <path d="M120 760 L190 640 L260 700 L320 620 L360 900 H80Z M1280 900 L1320 650 L1400 700 L1460 600 L1540 900Z" fill="#3a2e28"/>
    <rect x="1290" y="560" width="160" height="90" fill="#5a3a24" stroke="#120d0b" stroke-width="6"/><rect x="1300" y="570" width="140" height="22" fill="#7a5a5a"/></svg>`,

  // Nyx labs: white corridors and glass
  lab: () => `${open}<rect width="1600" height="900" fill="#c8cdd8"/>
    <rect width="1600" height="120" fill="#aab0c0"/><rect y="120" width="1600" height="10" fill="#2b8f8a"/>
    ${[0, 1, 2, 3].map(i => `<rect x="${80 + i * 380}" y="200" width="300" height="420" fill="#9fd6e8" opacity=".55"/><rect x="${80 + i * 380}" y="200" width="300" height="420" fill="none" stroke="#7a8094" stroke-width="8"/><path d="M${100 + i * 380} 240 l40 -30 M${110 + i * 380} 300 l70 -60" stroke="#e8f6fb" stroke-width="6"/>`).join('')}
    ${[0, 1, 2, 3].map(i => `<rect x="${150 + i * 380}" y="420" width="160" height="180" fill="#46516a"/><rect x="${165 + i * 380}" y="435" width="130" height="90" fill="#0d3b3a"/><rect x="${180 + i * 380}" y="455" width="80" height="8" fill="#5fe3d4"/><rect x="${180 + i * 380}" y="480" width="60" height="8" fill="#5fe3d4"/>`).join('')}
    <path d="M0 640 H1600 V900 H0Z" fill="#d8dce6"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 200} 640 L${i * 260 - 400} 900" stroke="#b8bdcc" stroke-width="3"/>`).join('')}
    <path d="M0 640 H1600" stroke="#9298aa" stroke-width="6"/>
    <text x="1480" y="90" text-anchor="end" font-family="Noto Sans JP, sans-serif" font-weight="700" font-size="44" fill="#2b8f8a" opacity=".8">ニュクス研究所</text></svg>`,
  // the frozen garden dome
  dome: () => {
    let trees = '', flakes = '';
    [[200, 520, 1], [430, 470, .8], [1160, 500, .9], [1380, 540, 1.1], [760, 430, .6]].forEach(([x, y, k]) => {
      trees += `<path d="M${x} ${y + 260 * k} V${y + 60 * k}" stroke="#5a4a40" stroke-width="${18 * k}"/><ellipse cx="${x}" cy="${y}" rx="${120 * k}" ry="${150 * k}" fill="#cfe4f0"/><ellipse cx="${x - 30 * k}" cy="${y - 40 * k}" rx="${60 * k}" ry="${60 * k}" fill="#e8f6fb"/>`;
    });
    for (let i = 0; i < 70; i++) flakes += `<circle cx="${(i * 233) % 1600}" cy="${(i * 137) % 760}" r="${1 + (i % 3)}" fill="#ffffff" opacity=".8"/>`;
    return `${open}<defs><radialGradient id="bdDomeSky" cx="50%" cy="0%" r="90%"><stop offset="0" stop-color="#2c3b5a"/><stop offset="1" stop-color="#0d1426"/></radialGradient></defs>
      <rect width="1600" height="900" fill="url(#bdDomeSky)"/>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M800 -200 Q${i * 200} 300 ${i * 200 - 50} 900" stroke="#5d8a9a" stroke-width="5" fill="none" opacity=".6"/>`).join('')}
      <path d="M-100 520 Q800 300 1700 520" stroke="#5d8a9a" stroke-width="5" fill="none" opacity=".6"/>
      <circle cx="1240" cy="150" r="70" fill="#d8dce6" opacity=".7"/>
      ${trees}
      <path d="M0 700 Q400 640 800 690 Q1200 650 1600 700 V900 H0Z" fill="#e8eef6"/>
      <ellipse cx="800" cy="760" rx="260" ry="50" fill="#9fc6e0"/><ellipse cx="760" cy="750" rx="120" ry="12" fill="#e8f6fb" opacity=".8"/>
      <path d="M760 700 V560 M840 700 V560" stroke="#c8cdd8" stroke-width="22"/><path d="M720 560 H880 V600 H720Z" fill="#aab0c0"/><path d="M745 540 Q800 470 855 540" fill="#e8f6fb"/>
      ${flakes}</svg>`;
  },
  // Titan: Lyceum Square under an orange sky, Saturn on the horizon
  titan: () => {
    let city = '', lamps = '';
    [[0, 470, 150], [140, 420, 120], [1290, 430, 140], [1420, 480, 180], [250, 500, 110], [1200, 510, 100]].forEach(([x, y, w]) => {
      city += `<rect x="${x}" y="${y}" width="${w}" height="${700 - y}" fill="#6e3a24"/><path d="M${x - 8} ${y} Q${x + w / 2} ${y - 50} ${x + w + 8} ${y}Z" fill="#5a2c1c"/>`;
      for (let k = 18; k < w - 16; k += 30) city += `<rect x="${x + k}" y="${y + 40}" width="14" height="26" fill="#f3c860" opacity=".8"/>`;
    });
    [360, 1240].forEach(x => { lamps += `<path d="M${x} 830 V610" stroke="#2a1a12" stroke-width="10"/><path d="M${x - 16} 600 V560 M${x + 16} 600 V560" stroke="#2a1a12" stroke-width="8"/><circle cx="${x}" cy="604" r="12" fill="#f3c860"/><circle cx="${x}" cy="604" r="60" fill="#f3c860" opacity=".15"/>`; });
    return `${open}<defs><linearGradient id="bdTitanSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b2a1a"/><stop offset=".55" stop-color="#d9772f"/><stop offset="1" stop-color="#f4b860"/></linearGradient></defs>
      <rect width="1600" height="900" fill="url(#bdTitanSky)"/>
      <g opacity=".75"><ellipse cx="1300" cy="200" rx="230" ry="40" fill="none" stroke="#f6d9a0" stroke-width="16" transform="rotate(-12 1300 200)"/>
        <circle cx="1300" cy="200" r="96" fill="#e8b878"/><path d="M1206 186 Q1300 170 1394 186" stroke="#c9905a" stroke-width="10" fill="none"/>
        <path d="M1080 250 Q1300 150 1520 150" stroke="#f6d9a0" stroke-width="16" fill="none" transform="rotate(-12 1300 200)"/></g>
      ${city}
      <path d="M520 700 V330 H1080 V700Z" fill="#c9a074"/><path d="M490 330 L800 170 L1110 330Z" fill="#e0b98a"/><path d="M540 330 L800 200 L1060 330Z" fill="#b48a5e"/>
      ${[560, 660, 760, 840, 940, 1040].map(x => `<rect x="${x - 18}" y="360" width="36" height="300" fill="#ead2a8"/><rect x="${x - 26}" y="348" width="52" height="16" fill="#f4e0bc"/>`).join('')}
      <rect x="740" y="520" width="120" height="180" fill="#3a1c14"/><rect x="752" y="532" width="46" height="168" fill="#d9a94a" opacity=".85"/><rect x="802" y="532" width="46" height="168" fill="#d9a94a" opacity=".85"/>
      <text x="800" y="312" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="40" fill="#5a2c1c">LYCEUM</text>
      <rect x="580" y="410" width="80" height="110" fill="#1d1430"/><text x="620" y="452" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="15" fill="#f3c860">MISTER</text><text x="620" y="476" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="15" fill="#f3c860">NOCTURNE</text>
      <path d="M0 700 H1600 V900 H0Z" fill="#8a5a3a"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 140} 700 L${i * 180 - 200} 900" stroke="#7a4a2e" stroke-width="3"/>`).join('')}
      <path d="M0 700 H1600" stroke="#5a3420" stroke-width="6"/>
      ${lamps}
      <text x="150" y="130" font-family="Noto Sans JP, sans-serif" font-weight="700" font-size="52" fill="#fff1d0" opacity=".55">タイタン</text></svg>`;
  },
  // Backstage at the Lyceum: rigging, flats, follow-spot cones, the show glowing through the wings
  lyceum: () => {
    let ropes = '';
    for (let i = 0; i < 14; i++) ropes += `<path d="M${80 + i * 110} 0 V${260 + (i % 3) * 60}" stroke="#4a3a2a" stroke-width="4"/><rect x="${72 + i * 110}" y="${260 + (i % 3) * 60}" width="16" height="30" fill="#5a4630"/>`;
    return `${open}<defs><linearGradient id="bdLyCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4d0" stop-opacity=".55"/><stop offset="1" stop-color="#fff4d0" stop-opacity="0"/></linearGradient>
        <radialGradient id="bdLyStage" cx="50%" cy="60%" r="50%"><stop offset="0" stop-color="#f3c860" stop-opacity=".55"/><stop offset="1" stop-color="#f3c860" stop-opacity="0"/></radialGradient></defs>
      <rect width="1600" height="900" fill="#0f0a10"/>
      <rect x="0" y="120" width="1600" height="26" fill="#2a1e1a"/><rect x="0" y="146" width="1600" height="6" fill="#4a3a2a"/>
      ${ropes}
      <rect x="440" y="180" width="720" height="560" fill="url(#bdLyStage)"/>
      <path d="M380 0 H520 Q470 400 500 900 H380Z" fill="#6a1616"/><path d="M1220 0 H1080 Q1130 400 1100 900 H1220Z" fill="#6a1616"/>
      <path d="M700 0 L560 740 H1040 L900 0Z" fill="url(#bdLyCone)"/>
      <path d="M690 640 Q690 560 800 560 H930 Q960 560 960 600 V640Z" fill="#0a0608"/><path d="M700 640 V700 M940 640 V700" stroke="#0a0608" stroke-width="10"/>
      <circle cx="780" cy="510" r="22" fill="#0a0608"/><path d="M770 530 L752 600 H812 Z" fill="#0a0608"/><path d="M790 545 L860 580" stroke="#0a0608" stroke-width="10"/>
      <path d="M0 260 H340 V900 H0Z" fill="#3a3046"/><path d="M40 300 H300 V860 H40Z" fill="#4a5a7a" opacity=".55"/><circle cx="170" cy="420" r="60" fill="#e8e0c0" opacity=".5"/>
      <path d="M1260 300 H1600 V900 H1260Z" fill="#2c2420"/><rect x="1300" y="620" width="200" height="140" fill="#1a1412" stroke="#8a7a5a" stroke-width="6"/><text x="1400" y="700" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="22" fill="#8a7a5a">NOCTURNE</text>
      <path d="M0 760 H1600 V900 H0Z" fill="#1c1410"/>${[460, 600, 740, 880, 1020, 1140].map(x => `<ellipse cx="${x}" cy="748" rx="26" ry="8" fill="#f3c860" opacity=".8"/>`).join('')}
      <text x="1540" y="90" text-anchor="end" font-family="Noto Sans JP, sans-serif" font-weight="700" font-size="44" fill="#f3c860" opacity=".6">舞台裏</text></svg>`;
  },
  // Cygnus under lockdown: the plaza in red and blue, barricades, every screen showing the crew's faces
  lockdown: () => {
    let rain = '', shops = '';
    for (let i = 0; i < 90; i++) { const x = (i * 197) % 1600, y = (i * 113) % 900; rain += `<path d="M${x} ${y} l-8 26" stroke="#9fc6e0" stroke-width="2" opacity=".35"/>`; }
    [[0, 260], [270, 230], [520, 250], [1060, 240], [1320, 280]].forEach(([x, w], i) => {
      shops += `<rect x="${x}" y="120" width="${w}" height="460" fill="${i % 2 ? '#1d2133' : '#171b2c'}"/><rect x="${x + 30}" y="380" width="${w - 60}" height="200" fill="#0d1424"/>`;
      shops += `<rect x="${x + 30}" y="380" width="${w - 60}" height="200" fill="#4a5470" opacity=".85"/>${Array.from({ length: 10 }, (_, k) => `<rect x="${x + 30}" y="${384 + k * 20}" width="${w - 60}" height="3" fill="#2c3346"/>`).join('')}`;
    });
    const face = (x, y, c) => `<g transform="translate(${x} ${y})"><rect width="84" height="104" fill="#0d1424"/><circle cx="42" cy="40" r="22" fill="${c}"/><path d="M10 104 C14 74 70 74 74 104Z" fill="${c}"/></g>`;
    return `${open}<defs><linearGradient id="bdLkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0b16"/><stop offset="1" stop-color="#1b1430"/></linearGradient>
        <radialGradient id="bdLkRed" cx="15%" cy="70%" r="45%"><stop offset="0" stop-color="#ff3a3a" stop-opacity=".35"/><stop offset="1" stop-color="#ff3a3a" stop-opacity="0"/></radialGradient>
        <radialGradient id="bdLkBlue" cx="85%" cy="70%" r="45%"><stop offset="0" stop-color="#3a6aff" stop-opacity=".3"/><stop offset="1" stop-color="#3a6aff" stop-opacity="0"/></radialGradient></defs>
      <rect width="1600" height="900" fill="url(#bdLkSky)"/>
      ${shops}
      <g transform="translate(790 150)"><rect width="300" height="200" fill="#0b0d18" stroke="#5fe3d4" stroke-width="6"/><rect x="0" y="0" width="300" height="44" fill="#d5473b"/>
        <text x="150" y="33" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="34" fill="#f1e8d4">WANTED · ₡ 100,000</text>
        ${face(12, 70, '#2b8f8a')}${face(108, 70, '#d5473b')}${face(204, 70, '#e9b23a')}</g>
      <rect width="1600" height="900" fill="url(#bdLkRed)"/><rect width="1600" height="900" fill="url(#bdLkBlue)"/>
      <path d="M0 640 H1600 V900 H0Z" fill="#171b2c"/><path d="M0 640 H1600" stroke="#343a52" stroke-width="6"/>
      ${[80, 420, 1180].map(x => `<g transform="translate(${x} 600)"><rect width="300" height="70" fill="#e9b23a"/>${Array.from({ length: 8 }, (_, k) => `<rect x="${k * 40}" width="20" height="70" fill="#10121e"/>`).join('')}<rect x="20" y="70" width="14" height="80" fill="#3a4258"/><rect x="266" y="70" width="14" height="80" fill="#3a4258"/><circle cx="150" cy="-14" r="14" fill="#ff3a3a"/></g>`).join('')}
      ${rain}
      <text x="1540" y="90" text-anchor="end" font-family="Noto Sans JP, sans-serif" font-weight="700" font-size="48" fill="#ff5f5f" opacity=".75">封鎖中</text></svg>`;
  },
  // Helix Salvage, top floor: white marble, a wall of glass, the ring of Cygnus outside
  helix: () => `${open}<defs><linearGradient id="bdHxFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8ecf4"/><stop offset="1" stop-color="#b8bfcc"/></linearGradient></defs>
    <rect width="1600" height="900" fill="#2c3346"/>
    <rect x="80" y="60" width="1440" height="560" fill="#060a18"/>${stars(140, 1600, 560).replace(/<circle /g, '<circle transform="translate(80 60) scale(.9 1)" ')}
    <path d="M80 470 Q800 330 1520 470 L1520 520 Q800 380 80 520Z" fill="#3a2a48"/>
    ${Array.from({ length: 16 }, (_, i) => `<rect x="${130 + i * 86}" y="${430 - Math.abs(8 - i) * 9}" width="10" height="6" fill="${['#ff5fa2', '#5fe3d4', '#ffd34d'][i % 3]}"/>`).join('')}
    <circle cx="1270" cy="200" r="90" fill="#c9a46a" opacity=".55"/><circle cx="1240" cy="180" r="90" fill="#060a18" opacity=".6"/>
    ${[80, 440, 800, 1160, 1520].map(x => `<rect x="${x - 10}" y="60" width="20" height="560" fill="#46516a"/>`).join('')}
    <rect x="0" y="0" width="1600" height="60" fill="#1b1e30"/><rect x="0" y="52" width="1600" height="8" fill="#2b8f8a"/>
    <path d="M0 620 H1600 V900 H0Z" fill="url(#bdHxFloor)"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 200} 620 L${i * 260 - 400} 900" stroke="#c9ced8" stroke-width="3"/>`).join('')}
    <path d="M520 690 H1080 L1120 760 H480Z" fill="#3a2418"/><path d="M480 760 H1120 V790 H480Z" fill="#24160e"/><rect x="560" y="660" width="60" height="30" fill="#e9b23a"/><rect x="900" y="672" width="90" height="18" fill="#f1e8d4"/>
    <g transform="translate(220 640)"><rect x="-40" y="140" width="80" height="40" fill="#2c3346"/><path d="M-30 140 L-12 -40 M30 140 L12 -40" stroke="#5fe3d4" stroke-width="10" opacity=".7"/>${[0, 40, 80, 120].map(y => `<path d="M-24 ${y} H24" stroke="#5fe3d4" stroke-width="6" opacity=".5"/>`).join('')}</g>
    <text x="1540" y="870" text-anchor="end" font-family="Noto Sans JP, sans-serif" font-weight="700" font-size="40" fill="#2b8f8a" opacity=".7">ヘリックス社</text></svg>`,
  // Blue Note: inside the listening array, dishes turned inwards, Saturn through the glass
  bluenote: () => {
    let dishes = '';
    [[180, 300, 150], [560, 230, 110], [1060, 230, 110], [1420, 300, 150]].forEach(([x, y, r]) => {
      dishes += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .9}" fill="#c9ccd6" opacity=".9"/><ellipse cx="${x}" cy="${y}" rx="${r * .8}" ry="${r * .72}" fill="#8d90a8"/><ellipse cx="${x}" cy="${y}" rx="${r * .35}" ry="${r * .3}" fill="#5d6a80"/>`;
      dishes += `<path d="M${x} ${y} L${x} ${y - r * .9}" stroke="#46516a" stroke-width="6"/><circle cx="${x}" cy="${y}" r="${r * .12}" fill="#5fb8ff"/><circle cx="${x}" cy="${y}" r="${r * .5}" fill="#5fb8ff" opacity=".08"/>`;
    });
    return `${open}<defs><radialGradient id="bdBnGlow" cx="50%" cy="80%" r="60%"><stop offset="0" stop-color="#3a7bff" stop-opacity=".45"/><stop offset="1" stop-color="#3a7bff" stop-opacity="0"/></radialGradient></defs>
      <rect width="1600" height="900" fill="#050a1c"/>${stars(160, 1600, 600)}
      <g opacity=".85"><ellipse cx="800" cy="170" rx="330" ry="54" fill="none" stroke="#d8b878" stroke-width="14" transform="rotate(-8 800 170)"/><circle cx="800" cy="170" r="110" fill="#d8b878"/><path d="M690 160 Q800 140 910 160" stroke="#a8844e" stroke-width="12" fill="none"/><path d="M700 190 Q800 205 900 190" stroke="#c9a46a" stroke-width="8" fill="none"/></g>
      ${dishes}
      <path d="M0 560 Q800 470 1600 560 V900 H0Z" fill="#0d1630"/>
      ${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 150 - 100} 900 L${400 + i * 70} 560" stroke="#13204a" stroke-width="3"/>`).join('')}
      <path d="M0 560 Q800 470 1600 560" stroke="#3a7bff" stroke-width="6" fill="none"/>
      <rect width="1600" height="900" fill="url(#bdBnGlow)"/>
      <g transform="translate(800 700)"><path d="M-90 120 L-60 -70 H60 L90 120Z" fill="#141c36"/><circle cy="-100" r="60" fill="#0a1124" stroke="#5fb8ff" stroke-width="6"/><circle cy="-100" r="22" fill="#d5473b"/><circle cy="-100" r="8" fill="#ffd1c8"/></g>
      <text x="1540" y="870" text-anchor="end" font-family="Noto Sans JP, sans-serif" font-weight="700" font-size="44" fill="#5fb8ff" opacity=".6">ブルーノート</text></svg>`;
  },
  // the Lyceum's auditorium, seen from the stage: two thousand people, one spotlight, one piano
  lyceum_hall: () => {
    let crowd = '';
    for (let r = 0; r < 6; r++) for (let i = 0; i < 26; i++) {
      const x = -20 + i * 66 + (r % 2) * 33, y = 560 + r * 56, s = 1 + r * .12;
      crowd += `<circle cx="${x}" cy="${y}" r="${14 * s}" fill="#1a0e14"/><path d="M${x - 22 * s} ${y + 50 * s} q${22 * s} -44 ${44 * s} 0Z" fill="#1a0e14"/>`;
    }
    return `${open}<defs><linearGradient id="bdHallCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4d0" stop-opacity=".6"/><stop offset="1" stop-color="#fff4d0" stop-opacity="0"/></linearGradient>
        <radialGradient id="bdHallGlow" cx="50%" cy="20%" r="60%"><stop offset="0" stop-color="#d9a94a" stop-opacity=".35"/><stop offset="1" stop-color="#d9a94a" stop-opacity="0"/></radialGradient></defs>
      <rect width="1600" height="900" fill="#12070c"/><rect width="1600" height="900" fill="url(#bdHallGlow)"/>
      ${[260, 560, 1040, 1340].map(x => `<path d="M${x} 0 V120" stroke="#5a4630" stroke-width="3"/><circle cx="${x}" cy="140" r="34" fill="#f3c860" opacity=".25"/><path d="M${x - 40} 130 q40 40 80 0" fill="none" stroke="#f3c860" stroke-width="5" opacity=".6"/>`).join('')}
      <path d="M0 0 H300 Q240 300 280 560 H0Z M1600 0 H1300 Q1360 300 1320 560 H1600Z" fill="#6a1616"/>
      ${[[120, 300], [180, 360], [1420, 300], [1480, 360]].map(([x, y]) => `<rect x="${x - 70}" y="${y}" width="140" height="40" fill="#3a1a14" stroke="#d9a94a" stroke-width="3"/>`).join('')}
      <path d="M720 0 L600 520 H1000 L880 0Z" fill="url(#bdHallCone)"/>
      <path d="M690 500 Q690 420 800 420 H930 Q960 420 960 460 V500Z" fill="#0a0608"/><path d="M700 500 V560 M940 500 V560" stroke="#0a0608" stroke-width="10"/>
      <circle cx="780" cy="370" r="22" fill="#f1e8d4"/><path d="M770 390 L752 460 H812 Z" fill="#0a0608"/><path d="M790 405 L870 360" stroke="#0a0608" stroke-width="10"/><path d="M870 360 L940 300" stroke="#f1e8d4" stroke-width="3"/>
      <path d="M0 520 H1600 V560 H0Z" fill="#2a1408"/>${Array.from({ length: 12 }, (_, i) => `<ellipse cx="${80 + i * 132}" cy="516" rx="24" ry="7" fill="#f3c860" opacity=".8"/>`).join('')}
      ${crowd}
      <text x="1540" y="880" text-anchor="end" font-family="Noto Sans JP, sans-serif" font-weight="700" font-size="44" fill="#f3c860" opacity=".55">最終ステージ</text></svg>`;
  },
  black: () => ''
};

export function backdrop(name) {
  if (!(name in cache)) cache[name] = (BUILD[name] || BUILD.black)();
  return cache[name];
}
