// Cut-paper style character portraits, drawn as SVG.
import { shade, PAL as P } from './color.js';
import { resolveLook, NPC_LOOKS } from '../data/appearance.js';

const svg = body => `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
const INK = P.ink;

const SHOULDERS = 'M14 240 C22 186 62 168 100 168 C138 168 178 186 186 240Z';

function outfitSvg(o) {
  let s = `<path d="${SHOULDERS}" fill="${o.main}"/>`;
  switch (o.style) {
    case 'suit':
      s += `<path d="M70 172 L100 238 L130 172 L117 168 L100 204 L83 168Z" fill="${o.shade}"/><path d="M86 170 L100 204 L114 170Z" fill="${o.acc}"/>`; break;
    case 'bomber':
      s += `<path d="M64 176 Q100 196 136 176" stroke="${o.shade}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M88 172 Q100 184 112 172 L112 168 L88 168Z" fill="${o.acc}"/><path d="M100 188 V240" stroke="${o.shade}" stroke-width="3"/>`; break;
    case 'coat':
      s += `<path d="M66 178 L74 140 L92 150 L100 200 L108 150 L126 140 L134 178 L118 240 L82 240Z" fill="${o.shade}"/><path d="M92 152 L100 200 L108 152 Q100 160 92 152Z" fill="${o.acc}"/>`; break;
    case 'flight':
      s += `<path d="M80 170 L92 188 M120 170 L108 188" stroke="${o.shade}" stroke-width="6" stroke-linecap="round"/><path d="M100 176 V240" stroke="${o.acc}" stroke-width="3"/><circle cx="140" cy="206" r="9" fill="${o.acc}"/><circle cx="140" cy="206" r="4" fill="${o.shade}"/>`; break;
    case 'body':
      s += `<path d="M84 172 L100 230 L116 172 Q100 182 84 172Z" fill="${o.acc}"/><path d="M40 210 L60 196 M160 210 L140 196" stroke="${o.shade}" stroke-width="5" stroke-linecap="round"/>`; break;
    case 'hoodie':
      s += `<path d="M58 182 C58 150 80 140 100 150 C120 140 142 150 142 182 C126 170 112 168 100 172 C88 168 74 170 58 182Z" fill="${o.shade}"/><path d="M90 176 V206 M110 176 V206" stroke="${o.acc}" stroke-width="3" stroke-linecap="round"/><circle cx="90" cy="208" r="3" fill="${o.acc}"/><circle cx="110" cy="208" r="3" fill="${o.acc}"/>`; break;
  }
  return s;
}

const HEADS = [
  'M63 98 C63 62 137 62 137 98 L134 126 C128 142 114 154 100 156 C86 154 72 142 66 126Z',
  'M61 108 C61 80 78 64 100 64 C122 64 139 80 139 108 C139 136 122 154 100 154 C78 154 61 136 61 108Z',
  'M67 100 C67 62 133 62 133 100 C133 130 118 156 100 160 C82 156 67 130 67 100Z',
  'M60 96 C60 62 140 62 140 96 L140 124 C140 146 122 156 100 156 C78 156 60 146 60 124Z'
];

function faceSvg(face, skin, hairDark) {
  const sk2 = shade(skin, -.14);
  let s = `<ellipse cx="${face === 3 ? 58 : 62}" cy="114" rx="7" ry="10" fill="${sk2}"/><ellipse cx="${face === 3 ? 142 : 138}" cy="114" rx="7" ry="10" fill="${sk2}"/>`;
  s += `<rect x="88" y="140" width="24" height="34" fill="${sk2}"/><path d="${HEADS[face]}" fill="${skin}"/>`;
  return s;
}

function eyesSvg(face, hairDark) {
  switch (face) {
    case 0: return `<path d="M78 104 l16 -2 M106 102 l16 2" stroke="${hairDark}" stroke-width="3.5" stroke-linecap="round"/>
      <g class="eyes"><path d="M80 113 h13 M107 113 h13" stroke="${INK}" stroke-width="4" stroke-linecap="round"/></g>`;
    case 1: return `<path d="M78 100 q8 -4 16 0 M106 100 q8 -4 16 0" stroke="${hairDark}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <g class="eyes"><circle cx="86" cy="113" r="5" fill="${INK}"/><circle cx="114" cy="113" r="5" fill="${INK}"/><circle cx="88" cy="111" r="1.6" fill="${P.cream}"/><circle cx="116" cy="111" r="1.6" fill="${P.cream}"/></g>
      <g fill="${shade('#c0704f', 0)}" opacity=".55"><circle cx="76" cy="126" r="1.6"/><circle cx="81" cy="129" r="1.6"/><circle cx="119" cy="129" r="1.6"/><circle cx="124" cy="126" r="1.6"/></g>`;
    case 2: return `<path d="M79 102 l15 2 M106 104 l15 -2" stroke="${hairDark}" stroke-width="3" stroke-linecap="round"/>
      <g class="eyes"><path d="M80 114 q7 -6 15 0 q-7 4 -15 0Z M105 114 q7 -6 15 0 q-7 4 -15 0Z" fill="${INK}"/></g>`;
    default: return `<path d="M76 98 q9 -7 18 -1 M106 97 q9 -6 18 1" stroke="${hairDark}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g class="eyes"><circle cx="86" cy="112" r="4.5" fill="${INK}"/><circle cx="114" cy="112" r="4.5" fill="${INK}"/></g>`;
  }
}

function mouthSvg(face) {
  switch (face) {
    case 0: return `<path class="mouth" d="M90 136 q10 6 20 -2" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    case 1: return `<path class="mouth" d="M88 132 q12 11 24 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    case 2: return `<path class="mouth" d="M92 138 h16" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    default: return `<path class="mouth" d="M86 132 q14 14 28 0Z" fill="${INK}"/><path d="M89 133 h22 l-2 3 h-18Z" fill="${P.cream}"/>`;
  }
}

function hairBack(style, h) {
  if (style === 'long') return `<path d="M56 100 C48 160 58 198 70 206 L130 206 C142 198 152 160 144 100Z" fill="${h}"/>`;
  if (style === 'topknot') return `<circle cx="100" cy="50" r="17" fill="${h}"/>`;
  return '';
}

function hairFront(style, h, h2) {
  switch (style) {
    case 'swept': return `<path d="M58 106 C48 64 74 42 104 44 C136 42 158 66 142 104 C140 86 132 74 118 68 C104 64 88 66 76 74 C66 84 60 94 58 106Z" fill="${h}"/>
      <path d="M78 60 Q100 52 124 60 M84 68 Q104 60 126 70" stroke="${h2}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    case 'buzz': return `<path d="M62 98 C62 60 138 60 138 98 C132 80 118 72 100 72 C82 72 68 80 62 98Z" fill="${h}"/>`;
    case 'long': return `<path d="M60 106 C58 62 142 62 140 106 C132 90 122 84 112 86 L100 98 L96 84 C84 84 70 90 60 106Z" fill="${h}"/>`;
    case 'curls': {
      const c = [[64, 92, 14], [76, 74, 16], [100, 64, 19], [124, 74, 16], [136, 92, 14], [88, 68, 13], [112, 68, 13], [60, 108, 10], [140, 108, 10]];
      return c.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${h}"/>`).join('')
        + `<circle cx="96" cy="62" r="4" fill="${h2}"/><circle cx="120" cy="72" r="3.5" fill="${h2}"/><circle cx="74" cy="78" r="3.5" fill="${h2}"/>`;
    }
    case 'mohawk': return `<path d="M64 96 C64 66 136 66 136 96 C130 82 116 76 100 76 C84 76 70 82 64 96Z" fill="${h2}" opacity=".55"/>
      <path d="M86 90 C82 56 90 24 100 14 C110 24 118 56 114 90Z" fill="${h}"/>`;
    case 'topknot': return `<path d="M61 102 C58 62 142 62 139 102 C130 82 116 76 100 76 C84 76 70 82 61 102Z" fill="${h}"/><rect x="90" y="62" width="20" height="6" rx="3" fill="${h2}"/>`;
  }
  return '';
}

function accSvg(acc, face) {
  switch (acc) {
    case 'Goggles': return `<rect x="60" y="76" width="80" height="8" fill="${INK}"/><circle cx="84" cy="80" r="11" fill="${P.mustard}" stroke="${INK}" stroke-width="4"/><circle cx="116" cy="80" r="11" fill="${P.mustard}" stroke="${INK}" stroke-width="4"/><circle cx="81" cy="77" r="3" fill="${P.cream}"/>`;
    case 'Scarf': return `<path d="M72 158 Q100 178 128 158 L132 176 Q100 196 68 176Z" fill="${P.crimson}"/><path d="M114 178 L124 222 L108 220 L104 182Z" fill="${shade(P.crimson, -.2)}"/>`;
    case 'Shades': return `<path d="M74 106 H126 L124 120 Q112 124 104 116 H96 Q88 124 76 120Z" fill="${INK}"/><path d="M80 109 l8 0" stroke="${P.smoke}" stroke-width="2" stroke-linecap="round"/>`;
    case 'Earring': { const x = face === 3 ? 58 : 62; return `<circle cx="${x}" cy="128" r="4" fill="${P.mustard}"/><circle cx="${200 - x}" cy="128" r="4" fill="${P.mustard}"/>`; }
    case 'Headband': return `<path d="M60 88 Q100 74 140 88 L140 96 Q100 82 60 96Z" fill="${P.crimson}"/><path d="M140 90 L156 84 L152 100Z" fill="${P.crimson}"/>`;
  }
  return '';
}

export function lookPortrait(look) {
  const h = look.hair, h2 = shade(h, -.3), hd = shade(h, -.35);
  return svg(
    hairBack(look.style, h) +
    outfitSvg(look.outfit) +
    faceSvg(look.face, look.skin) +
    hairFront(look.style, h, h2) +
    eyesSvg(look.face, hd) +
    mouthSvg(look.face) +
    accSvg(look.acc, look.face)
  );
}

export function playerPortrait(p) { return lookPortrait(resolveLook(p)); }

// Fixed cast portraits.
export function npcPortrait(id) {
  switch (id) {
    case 'rook': return svg(`
      <path d="${SHOULDERS}" fill="${P.teal}"/>
      <path d="M70 172 L100 238 L130 172 L117 168 L100 204 L83 168Z" fill="#1c5d5a"/>
      <path d="M86 170 L100 204 L114 170Z" fill="${P.mustard}"/>
      <rect x="88" y="138" width="24" height="36" fill="#b07a5a"/>
      <ellipse cx="100" cy="108" rx="37" ry="45" fill="#c99272"/>
      <path d="M58 106 C46 70 64 36 100 38 C140 34 162 70 146 106 C142 90 138 82 130 76 L134 94 C122 80 110 76 96 78 L102 94 C88 84 78 80 70 86 L74 74 C66 82 60 92 58 106Z" fill="#1d2a3a"/>
      <g class="eyes"><path d="M79 112 h14 M107 112 h14" stroke="${INK}" stroke-width="4" stroke-linecap="round"/></g>
      <path d="M78 104 l16 -2 M106 102 l16 2" stroke="#1d2a3a" stroke-width="3" stroke-linecap="round"/>
      <path class="mouth" d="M90 134 q10 6 20 -2" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M108 132 l24 -7" stroke="${P.cream}" stroke-width="2.5" stroke-linecap="round"/>`);
    case 'tam': return svg(`
      <path d="M14 240 C24 188 60 170 100 170 C140 170 176 188 186 240Z" fill="${P.crimson}"/>
      <path d="M76 172 L100 198 L124 172" stroke="#8a2a22" stroke-width="6" fill="none"/>
      <rect x="128" y="196" width="26" height="18" fill="#8a2a22"/>
      <rect x="89" y="142" width="22" height="32" fill="#6e4129"/>
      <circle cx="60" cy="64" r="24" fill="#2a1a14"/><circle cx="140" cy="64" r="24" fill="#2a1a14"/>
      <ellipse cx="100" cy="110" rx="36" ry="43" fill="#82502f"/>
      <path d="M64 102 C62 64 138 64 136 102 C126 86 74 86 64 102Z" fill="#2a1a14"/>
      <rect x="62" y="74" width="76" height="8" fill="${INK}"/>
      <circle cx="84" cy="78" r="11" fill="${P.mustard}" stroke="${INK}" stroke-width="4"/>
      <circle cx="116" cy="78" r="11" fill="${P.mustard}" stroke="${INK}" stroke-width="4"/>
      <g class="eyes"><circle cx="86" cy="112" r="4.5" fill="${INK}"/><circle cx="114" cy="112" r="4.5" fill="${INK}"/></g>
      <path class="mouth" d="M88 130 q12 13 24 0Z" fill="${INK}"/>
      <path d="M116 124 l13 -3" stroke="#3a2418" stroke-width="3" stroke-linecap="round" opacity=".7"/>`);
    case 'brushes': return svg(`<g class="bob">
      <path d="M72 76 L54 26 M128 76 L146 26" stroke="${P.smoke}" stroke-width="4" stroke-linecap="round"/>
      <g stroke="${P.mustard}" stroke-width="2.5" stroke-linecap="round"><path d="M54 26 L38 10 M54 26 L46 6 M54 26 L56 4 M54 26 L64 8"/><path d="M146 26 L162 10 M146 26 L154 6 M146 26 L144 4 M146 26 L136 8"/></g>
      <circle cx="100" cy="126" r="62" fill="#5d6a80"/>
      <path d="M38 126 a62 62 0 0 0 124 0Z" fill="#46516a"/>
      <circle cx="100" cy="114" r="29" fill="${INK}"/>
      <g class="eyes"><circle cx="100" cy="114" r="19" fill="${P.mustard}"/><circle cx="100" cy="114" r="8" fill="${INK}"/><circle cx="106" cy="108" r="4" fill="${P.cream}"/></g>
      <g class="mouth"><rect x="78" y="160" width="44" height="9" rx="4" fill="${P.teal}"/><path d="M86 160 v9 M94 160 v9 M102 160 v9 M110 160 v9" stroke="${INK}" stroke-width="2"/></g></g>`);
    case 'velvet': return svg(`
      <path d="M10 240 C22 182 60 166 100 166 C140 166 178 182 190 240Z" fill="${P.violet}"/>
      <path d="M70 168 L100 240 L130 168 L120 156 L100 192 L80 156Z" fill="#3c2850"/>
      <path d="M60 96 C52 160 62 192 72 200 L128 200 C138 192 148 160 140 96Z" fill="#14101c"/>
      <rect x="91" y="140" width="18" height="30" fill="#e0b9a0"/>
      <ellipse cx="100" cy="112" rx="32" ry="42" fill="#efcbb2"/>
      <path d="M68 112 C66 92 84 80 104 82 C90 90 80 100 68 112Z" fill="#14101c"/>
      <ellipse cx="100" cy="78" rx="86" ry="14" fill="${P.crimson}"/>
      <path d="M60 78 C58 40 142 40 140 78Z" fill="${P.crimson}"/>
      <rect x="60" y="64" width="80" height="8" fill="${INK}"/>
      <g class="eyes"><path d="M80 114 q8 -6 16 0 M106 114 q8 -6 16 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>
      <path class="mouth" d="M90 134 q10 7 20 0 q-10 3 -20 0Z" fill="${P.crimson}" stroke="${P.crimson}" stroke-width="2"/>`);
    case 'warden': return svg(`
      <path d="M10 240 L30 170 L170 170 L190 240Z" fill="#3a4258"/><path d="M30 170 L60 150 L140 150 L170 170Z" fill="#4a5470"/>
      <rect x="40" y="186" width="120" height="10" fill="${P.mustard}"/>
      <rect x="56" y="54" width="88" height="96" rx="10" fill="#262a3a"/><rect x="50" y="76" width="100" height="22" fill="#10121e"/>
      <g class="eyes"><rect x="60" y="80" width="80" height="14" fill="${P.crimson}"/><rect x="92" y="80" width="16" height="14" fill="#ff8a7a"/></g>
      <rect x="70" y="112" width="60" height="6" fill="#3a4258"/><rect x="70" y="124" width="60" height="6" fill="#3a4258"/>
      <path d="M100 54 V24" stroke="#5d6a80" stroke-width="5"/><circle cx="100" cy="20" r="7" fill="${P.crimson}"/>
      <rect class="mouth" x="80" y="136" width="40" height="5" fill="${P.crimson}" opacity=".7"/>`);
    case 'drone': return svg(`<g class="bob">
      <ellipse cx="100" cy="128" rx="74" ry="44" fill="#3a4258"/><ellipse cx="100" cy="120" rx="74" ry="40" fill="#4a5470"/>
      <path d="M26 112 H174" stroke="#262a3a" stroke-width="6"/><rect x="20" y="104" width="22" height="12" fill="#262a3a"/><rect x="158" y="104" width="22" height="12" fill="#262a3a"/>
      <circle cx="100" cy="122" r="26" fill="#10121e"/><g class="eyes"><circle cx="100" cy="122" r="15" fill="${P.crimson}"/><circle cx="104" cy="118" r="4" fill="#ffb0a0"/></g>
      <path d="M70 160 L60 190 M130 160 L140 190" stroke="#5d6a80" stroke-width="5"/><rect class="mouth" x="90" y="152" width="20" height="4" fill="${P.crimson}"/></g>`);
    case 'goon': return svg(`
      <path d="M0 240 C10 180 50 160 100 160 C150 160 190 180 200 240Z" fill="#2f3346"/>
      <path d="M60 176 C60 150 80 142 100 150 C120 142 140 150 140 176Z" fill="#1f2232"/>
      <rect x="82" y="134" width="36" height="30" fill="#93725e"/>
      <rect x="56" y="62" width="88" height="88" rx="18" fill="#b08a72"/>
      <path d="M54 84 C54 38 146 38 146 84Z" fill="#7a2a24"/>
      <rect x="52" y="76" width="96" height="12" fill="#5a1d19"/>
      <g class="eyes"><rect x="62" y="100" width="76" height="14" rx="4" fill="${INK}"/></g>
      <path class="mouth" d="M84 132 h32" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`);
    case 'ozzie': return svg(`
      <path d="${SHOULDERS}" fill="#d39a2a"/>
      <path d="M40 200 L160 200 M30 222 L170 222" stroke="${P.cream}" stroke-width="7"/>
      <rect x="88" y="140" width="24" height="32" fill="#8a5a3c"/>
      <path d="M61 108 C61 80 78 64 100 64 C122 64 139 80 139 108 C139 136 122 154 100 154 C78 154 61 136 61 108Z" fill="#a8714f"/>
      <path d="M62 96 C62 58 138 58 138 96 L132 92 C120 80 80 80 68 92Z" fill="${P.mustard}"/>
      <rect x="54" y="88" width="92" height="8" rx="4" fill="#c48a1e"/>
      <path d="M78 104 l14 0 M108 104 l14 0" stroke="#3a2418" stroke-width="3" stroke-linecap="round"/>
      <g class="eyes"><circle cx="86" cy="114" r="4.5" fill="${INK}"/><circle cx="114" cy="114" r="4.5" fill="${INK}"/></g>
      <path d="M78 136 q22 18 44 0 q-4 18 -22 18 q-18 0 -22 -18Z" fill="#4a2e1e"/>
      <path class="mouth" d="M90 136 q10 6 20 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`);
    default:
      if (NPC_LOOKS[id]) return lookPortrait(NPC_LOOKS[id]);
      return svg(`
      <path d="${SHOULDERS}" fill="#2a2e44"/>
      <ellipse cx="100" cy="108" rx="38" ry="46" fill="#2a2e44"/>
      <text x="100" y="128" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="64" fill="${P.smoke}">?</text>`);
  }
}
