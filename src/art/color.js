// Colour helpers shared by the portrait and pixel-art generators.
export function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round(r + (t - r) * p);
  g = Math.round(g + (t - g) * p);
  b = Math.round(b + (t - b) * p);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

export const PAL = {
  ink: '#10121e', ink2: '#1b1e30', ink3: '#262a40',
  cream: '#f1e8d4', mustard: '#e9b23a', teal: '#2b8f8a',
  crimson: '#d5473b', smoke: '#8d90a8', violet: '#5b3f74'
};
