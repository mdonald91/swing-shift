// Everything the New Game screen lets you pick.
export const FACES = [
  { n: 'Sharp' }, { n: 'Round' }, { n: 'Narrow' }, { n: 'Broad' }
];

export const SKINS = [
  { n: 'Porcelain', c: '#f2cdb4' }, { n: 'Sand', c: '#e3b38f' }, { n: 'Honey', c: '#c99272' },
  { n: 'Copper', c: '#a8714f' }, { n: 'Umber', c: '#82502f' }, { n: 'Espresso', c: '#5c3620' }
];

export const HAIRSTYLES = [
  { n: 'Swept back', key: 'swept' }, { n: 'Buzz cut', key: 'buzz' }, { n: 'Long', key: 'long' },
  { n: 'Curls', key: 'curls' }, { n: 'Mohawk', key: 'mohawk' }, { n: 'Topknot', key: 'topknot' }
];

export const HAIR_COLOURS = [
  { n: 'Ink', c: '#1d2230' }, { n: 'Chestnut', c: '#4a2e1e' }, { n: 'Auburn', c: '#8a3a22' },
  { n: 'Gold', c: '#d9b25a' }, { n: 'Silver', c: '#c9ccd6' }, { n: 'Teal', c: '#2b8f8a' },
  { n: 'Violet', c: '#6a4a8e' }, { n: 'Crimson', c: '#c23a30' }
];

export const OUTFITS = [
  { n: 'Navy suit', main: '#2c3b5a', shade: '#1e2940', acc: '#e9b23a', style: 'suit' },
  { n: 'Mustard bomber', main: '#d39a2a', shade: '#a5741a', acc: '#10121e', style: 'bomber' },
  { n: 'Crimson longcoat', main: '#b83a30', shade: '#8a2a22', acc: '#f1e8d4', style: 'coat' },
  { n: 'Teal flight suit', main: '#2b8f8a', shade: '#1d6663', acc: '#e9b23a', style: 'flight' },
  { n: 'Violet bodysuit', main: '#5b3f74', shade: '#3f2b52', acc: '#f1e8d4', style: 'body' },
  { n: 'Slate hoodie', main: '#5d6a80', shade: '#46516a', acc: '#d5473b', style: 'hoodie' }
];

export const ACCESSORIES = [
  { n: 'None' }, { n: 'Goggles' }, { n: 'Scarf' }, { n: 'Shades' }, { n: 'Earring' }, { n: 'Headband' }
];

export const TEMPERAMENTS = [
  { n: 'Calm', d: 'Cool under pressure. Talks people down before things get loud.' },
  { n: 'Sarcastic', d: 'Jokes first. Asks questions later, if ever.' },
  { n: 'Idealistic', d: 'Still believes bounty hunting can do some good.' },
  { n: 'Ruthless', d: 'The job is the job. Feelings cost extra.' }
];

// Starting points on the New Game screen. Every field can still be changed.
export const PRESETS = [
  { label: 'Drifter', name: 'Ash', face: 0, skin: 2, hair: 0, hairColour: 4, outfit: 2, acc: 2, temp: 0 },
  { label: 'Ace', name: 'Kit', face: 1, skin: 4, hair: 3, hairColour: 0, outfit: 1, acc: 1, temp: 1 },
  { label: 'Ghost', name: 'Noor', face: 2, skin: 1, hair: 2, hairColour: 6, outfit: 4, acc: 3, temp: 3 },
  { label: 'Wildcard', name: 'Dez', face: 3, skin: 3, hair: 4, hairColour: 7, outfit: 3, acc: 4, temp: 2 }
];

// The rows on the New Game screen, in order.
export const ROWS = [
  { key: 'face', label: 'Face', list: FACES },
  { key: 'skin', label: 'Skin', list: SKINS },
  { key: 'hair', label: 'Hairstyle', list: HAIRSTYLES },
  { key: 'hairColour', label: 'Hair colour', list: HAIR_COLOURS },
  { key: 'outfit', label: 'Outfit', list: OUTFITS },
  { key: 'acc', label: 'Accessory', list: ACCESSORIES }
];

// Turns saved choices (list indexes) into colours and keys the art code can draw.
export function resolveLook(p) {
  return {
    face: p.face,
    skin: SKINS[p.skin].c,
    hair: HAIR_COLOURS[p.hairColour].c,
    style: HAIRSTYLES[p.hair].key,
    outfit: OUTFITS[p.outfit],
    acc: ACCESSORIES[p.acc].n
  };
}

export function temperament(p) { return TEMPERAMENTS[p.temp].n; }

// Pixel-art looks for crew who walk around the ship.
export const NPC_LOOKS = {
  rook: { face: 0, skin: '#c99272', hair: '#1d2a3a', style: 'swept', acc: 'None',
    outfit: { main: '#2b8f8a', shade: '#1d6663', acc: '#e9b23a', style: 'suit' } },
  tam: { face: 1, skin: '#82502f', hair: '#2a1a14', style: 'curls', acc: 'Goggles', pants: '#8a2a22',
    outfit: { main: '#d5473b', shade: '#8a2a22', acc: '#e9b23a', style: 'flight' } },
  ozzie: { face: 1, skin: '#a8714f', hair: '#e9b23a', style: 'buzz', acc: 'None', pants: '#3a4258',
    outfit: { main: '#d39a2a', shade: '#a5741a', acc: '#f1e8d4', style: 'flight' } },
  goon: { face: 3, skin: '#b08a72', hair: '#7a2a24', style: 'buzz', acc: 'Shades',
    outfit: { main: '#2f3346', shade: '#1f2232', acc: '#7a2a24', style: 'hoodie' } },
  sax: { face: 3, skin: '#5c3620', hair: '#c9ccd6', style: 'buzz', acc: 'Shades',
    outfit: { main: '#7a2a24', shade: '#5a1d19', acc: '#e9b23a', style: 'suit' } },
  mags: { face: 2, skin: '#e3b38f', hair: '#8a3a22', style: 'topknot', acc: 'Earring',
    outfit: { main: '#1b1e30', shade: '#10121e', acc: '#f1e8d4', style: 'body' } },
  lou: { face: 1, skin: '#c99272', hair: '#4a2e1e', style: 'curls', acc: 'None',
    outfit: { main: '#2c3b5a', shade: '#1e2940', acc: '#d5473b', style: 'suit' } },
  rhea: { face: 2, skin: '#a8714f', hair: '#9fc6e0', style: 'swept', acc: 'Earring',
    outfit: { main: '#22706c', shade: '#18524f', acc: '#e9b23a', style: 'bomber' } },
  hale: { face: 0, skin: '#82502f', hair: '#1d2230', style: 'long', acc: 'None',
    outfit: { main: '#e8e0cc', shade: '#bdb3a0', acc: '#2b8f8a', style: 'coat' } },
  chef: { face: 3, skin: '#e3b38f', hair: '#f1e8d4', style: 'topknot', acc: 'Headband',
    outfit: { main: '#f1e8d4', shade: '#c9c0aa', acc: '#d5473b', style: 'flight' } },
  kessler: { face: 0, skin: '#c99272', hair: '#8d90a8', style: 'buzz', acc: 'Goggles',
    outfit: { main: '#4a321c', shade: '#2c1e10', acc: '#e9b23a', style: 'hoodie' } },
  juno: { face: 2, skin: '#c99272', hair: '#d8dbe4', style: 'long', acc: 'None',
    outfit: { main: '#46516a', shade: '#2f3346', acc: '#e9b23a', style: 'flight' } },
  wren: { face: 1, skin: '#a8714f', hair: '#c23a30', style: 'curls', acc: 'Goggles',
    outfit: { main: '#d39a2a', shade: '#a5741a', acc: '#10121e', style: 'bomber' } },
  pell: { face: 0, skin: '#e3b38f', hair: '#1d2230', style: 'swept', acc: 'Shades',
    outfit: { main: '#5b3f74', shade: '#3f2b52', acc: '#e9b23a', style: 'suit' } },
  fennick: { face: 2, skin: '#c99272', hair: '#4a2e1e', style: 'buzz', acc: 'Scarf',
    outfit: { main: '#5d6a80', shade: '#46516a', acc: '#8d90a8', style: 'coat' } },
  sable: { face: 2, skin: '#5c3620', hair: '#c9ccd6', style: 'long', acc: 'Earring',
    outfit: { main: '#2c2440', shade: '#1b1430', acc: '#d5473b', style: 'body' } },
  vox: { face: 3, skin: '#e3b38f', hair: '#2b8f8a', style: 'mohawk', acc: 'Shades',
    outfit: { main: '#1b1e30', shade: '#10121e', acc: '#2b8f8a', style: 'coat' } },
  quill: { face: 0, skin: '#f2cdb4', hair: '#d9b25a', style: 'swept', acc: 'None',
    outfit: { main: '#e8e0cc', shade: '#bdb3a0', acc: '#2b8f8a', style: 'suit' } },
  scav: { face: 3, skin: '#82502f', hair: '#4a2e1e', style: 'buzz', acc: 'Goggles',
    outfit: { main: '#6b4a2a', shade: '#4a321c', acc: '#e9b23a', style: 'hoodie' } },
  scav2: { face: 2, skin: '#c99272', hair: '#1d2230', style: 'topknot', acc: 'Scarf',
    outfit: { main: '#5a647e', shade: '#3a4258', acc: '#d5473b', style: 'hoodie' } },
  v1: { face: 1, skin: '#c99272', hair: '#4a2e1e', style: 'curls', acc: 'Goggles', outfit: { main: '#d39a2a', shade: '#a5741a', acc: '#10121e', style: 'flight' } },
  v2: { face: 0, skin: '#82502f', hair: '#1d2230', style: 'buzz', acc: 'None', outfit: { main: '#6b4a2a', shade: '#4a321c', acc: '#e9b23a', style: 'hoodie' } },
  v3: { face: 2, skin: '#f2cdb4', hair: '#8a3a22', style: 'topknot', acc: 'Scarf', outfit: { main: '#22706c', shade: '#18524f', acc: '#f1e8d4', style: 'coat' } },
  // passers-by on the station plaza
  w1: { face: 1, skin: '#f2cdb4', hair: '#c23a30', style: 'long', acc: 'None', outfit: { main: '#5b3f74', shade: '#3f2b52', acc: '#f1e8d4', style: 'coat' } },
  w2: { face: 3, skin: '#82502f', hair: '#1d2230', style: 'buzz', acc: 'Shades', outfit: { main: '#2b8f8a', shade: '#1d6663', acc: '#e9b23a', style: 'hoodie' } },
  w3: { face: 0, skin: '#c99272', hair: '#d9b25a', style: 'swept', acc: 'Scarf', outfit: { main: '#2c3b5a', shade: '#1e2940', acc: '#e9b23a', style: 'suit' } },
  w4: { face: 2, skin: '#5c3620', hair: '#6a4a8e', style: 'curls', acc: 'Earring', outfit: { main: '#d39a2a', shade: '#a5741a', acc: '#10121e', style: 'bomber' } },
  goon2: { face: 3, skin: '#93725e', hair: '#7a2a24', style: 'buzz', acc: 'Shades',
    outfit: { main: '#2f3346', shade: '#1f2232', acc: '#7a2a24', style: 'hoodie' } }
};
