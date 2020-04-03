export interface RGBColors {
  [key: string]: RGB;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

const mapping: RGBColors = {
  crimson: {
    r: 220,
    g: 20,
    b: 60,
  },
  lightpink: {
    r: 255,
    g: 182,
    b: 193,
  },
  pink: {
    r: 255,
    g: 192,
    b: 203,
  },
  palevioletred: {
    r: 219,
    g: 112,
    b: 147,
  },
  lavenderblush: {
    r: 255,
    g: 240,
    b: 245,
  },
  hotpink: {
    r: 255,
    g: 105,
    b: 180,
  },
  deeppink: {
    r: 255,
    g: 20,
    b: 147,
  },
  mediumvioletred: {
    r: 199,
    g: 21,
    b: 133,
  },
  orchid: {
    r: 218,
    g: 112,
    b: 214,
  },
  thistle: {
    r: 216,
    g: 191,
    b: 216,
  },
  plum: {
    r: 221,
    g: 160,
    b: 221,
  },
  violet: {
    r: 238,
    g: 130,
    b: 238,
  },
  fuchsia: {
    r: 255,
    g: 0,
    b: 255,
  },
  darkmagenta: {
    r: 139,
    g: 0,
    b: 139,
  },
  purple: {
    r: 128,
    g: 0,
    b: 128,
  },
  mediumorchid: {
    r: 186,
    g: 85,
    b: 211,
  },
  darkviolet: {
    r: 148,
    g: 0,
    b: 211,
  },
  darkorchid: {
    r: 153,
    g: 50,
    b: 204,
  },
  indigo: {
    r: 75,
    g: 0,
    b: 130,
  },
  blueviolet: {
    r: 138,
    g: 43,
    b: 226,
  },
  mediumpurple: {
    r: 147,
    g: 112,
    b: 219,
  },
  darkslateblue: {
    r: 72,
    g: 61,
    b: 139,
  },
  mediumslateblue: {
    r: 123,
    g: 104,
    b: 238,
  },
  slateblue: {
    r: 106,
    g: 90,
    b: 205,
  },
  ghostwhite: {
    r: 248,
    g: 248,
    b: 255,
  },
  lavender: {
    r: 230,
    g: 230,
    b: 250,
  },
  blue: {
    r: 0,
    g: 0,
    b: 255,
  },
  mediumblue: {
    r: 0,
    g: 0,
    b: 205,
  },
  darkblue: {
    r: 0,
    g: 0,
    b: 139,
  },
  navy: {
    r: 0,
    g: 0,
    b: 128,
  },
  midnightblue: {
    r: 25,
    g: 25,
    b: 112,
  },
  royalblue: {
    r: 65,
    g: 105,
    b: 225,
  },
  cornflowerblue: {
    r: 100,
    g: 149,
    b: 237,
  },
  lightsteelblue: {
    r: 176,
    g: 196,
    b: 222,
  },
  lightslategray: {
    r: 119,
    g: 136,
    b: 153,
  },
  slategray: {
    r: 112,
    g: 128,
    b: 144,
  },
  dodgerblue: {
    r: 30,
    g: 144,
    b: 255,
  },
  aliceblue: {
    r: 240,
    g: 248,
    b: 255,
  },
  steelblue: {
    r: 70,
    g: 130,
    b: 180,
  },
  lightskyblue: {
    r: 135,
    g: 206,
    b: 250,
  },
  skyblue: {
    r: 135,
    g: 206,
    b: 235,
  },
  deepskyblue: {
    r: 0,
    g: 191,
    b: 255,
  },
  lightblue: {
    r: 173,
    g: 216,
    b: 230,
  },
  powderblue: {
    r: 176,
    g: 224,
    b: 230,
  },
  cadetblue: {
    r: 95,
    g: 158,
    b: 160,
  },
  darkturquoise: {
    r: 0,
    g: 206,
    b: 209,
  },
  azure: {
    r: 240,
    g: 255,
    b: 255,
  },
  lightcyan: {
    r: 224,
    g: 255,
    b: 255,
  },
  paleturquoise: {
    r: 174,
    g: 238,
    b: 238,
  },
  darkslategray: {
    r: 47,
    g: 79,
    b: 79,
  },
  aqua: {
    r: 0,
    g: 255,
    b: 255,
  },
  darkcyan: {
    r: 0,
    g: 139,
    b: 139,
  },
  teal: {
    r: 0,
    g: 128,
    b: 128,
  },
  mediumturquoise: {
    r: 72,
    g: 209,
    b: 204,
  },
  lightseagreen: {
    r: 32,
    g: 178,
    b: 170,
  },
  turquoise: {
    r: 64,
    g: 224,
    b: 208,
  },
  aquamarine: {
    r: 127,
    g: 255,
    b: 212,
  },
  mediumaquamarine: {
    r: 102,
    g: 205,
    b: 170,
  },
  mediumspringgreen: {
    r: 0,
    g: 250,
    b: 154,
  },
  mintcream: {
    r: 245,
    g: 255,
    b: 250,
  },
  springgreen: {
    r: 0,
    g: 255,
    b: 127,
  },
  mediumseagreen: {
    r: 60,
    g: 179,
    b: 113,
  },
  seagreen: {
    r: 46,
    g: 139,
    b: 87,
  },
  honeydew: {
    r: 240,
    g: 255,
    b: 240,
  },
  darkseagreen: {
    r: 143,
    g: 188,
    b: 143,
  },
  palegreen: {
    r: 152,
    g: 251,
    b: 152,
  },
  lightgreen: {
    r: 144,
    g: 238,
    b: 144,
  },
  limegreen: {
    r: 50,
    g: 205,
    b: 50,
  },
  forestgreen: {
    r: 34,
    g: 139,
    b: 34,
  },
  lime: {
    r: 0,
    g: 255,
    b: 0,
  },
  green: {
    r: 0,
    g: 128,
    b: 0,
  },
  darkgreen: {
    r: 0,
    g: 100,
    b: 0,
  },
  lawngreen: {
    r: 124,
    g: 252,
    b: 0,
  },
  chartreuse: {
    r: 127,
    g: 255,
    b: 0,
  },
  greenyellow: {
    r: 173,
    g: 255,
    b: 47,
  },
  darkolivegreen: {
    r: 85,
    g: 107,
    b: 47,
  },
  olivedrab: {
    r: 107,
    g: 142,
    b: 35,
  },
  yellowgreen: {
    r: 154,
    g: 205,
    b: 50,
  },
  ivory: {
    r: 255,
    g: 255,
    b: 240,
  },
  beige: {
    r: 245,
    g: 245,
    b: 220,
  },
  lightyellow: {
    r: 255,
    g: 255,
    b: 224,
  },
  lightgoldenrodyellow: {
    r: 250,
    g: 250,
    b: 210,
  },
  yellow: {
    r: 255,
    g: 255,
    b: 0,
  },
  olive: {
    r: 128,
    g: 128,
    b: 0,
  },
  darkkhaki: {
    r: 189,
    g: 183,
    b: 107,
  },
  khaki: {
    r: 240,
    g: 230,
    b: 140,
  },
  palegoldenrod: {
    r: 238,
    g: 232,
    b: 170,
  },
  lemonchiffon: {
    r: 255,
    g: 250,
    b: 205,
  },
  gold: {
    r: 255,
    g: 215,
    b: 0,
  },
  cornsilk: {
    r: 255,
    g: 248,
    b: 220,
  },
  goldenrod: {
    r: 218,
    g: 165,
    b: 32,
  },
  darkgoldenrod: {
    r: 184,
    g: 134,
    b: 11,
  },
  orange: {
    r: 255,
    g: 128,
    b: 0,
  },
  floralwhite: {
    r: 255,
    g: 250,
    b: 240,
  },
  oldlace: {
    r: 253,
    g: 245,
    b: 230,
  },
  wheat: {
    r: 245,
    g: 222,
    b: 179,
  },
  moccasin: {
    r: 255,
    g: 228,
    b: 181,
  },
  papayawhip: {
    r: 255,
    g: 239,
    b: 213,
  },
  blanchedalmond: {
    r: 255,
    g: 235,
    b: 205,
  },
  navajowhite: {
    r: 255,
    g: 222,
    b: 173,
  },
  tan: {
    r: 210,
    g: 180,
    b: 140,
  },
  antiquewhite: {
    r: 250,
    g: 235,
    b: 215,
  },
  burlywood: {
    r: 222,
    g: 184,
    b: 135,
  },
  bisque: {
    r: 255,
    g: 228,
    b: 196,
  },
  darkorange: {
    r: 255,
    g: 140,
    b: 0,
  },
  peru: {
    r: 205,
    g: 133,
    b: 63,
  },
  linen: {
    r: 250,
    g: 240,
    b: 230,
  },
  peachpuff: {
    r: 255,
    g: 218,
    b: 185,
  },
  seashell: {
    r: 255,
    g: 245,
    b: 238,
  },
  sandybrown: {
    r: 244,
    g: 164,
    b: 96,
  },
  chocolate: {
    r: 210,
    g: 105,
    b: 30,
  },
  saddlebrown: {
    r: 139,
    g: 69,
    b: 19,
  },
  sienna: {
    r: 160,
    g: 82,
    b: 45,
  },
  lightsalmon: {
    r: 255,
    g: 160,
    b: 122,
  },
  coral: {
    r: 255,
    g: 127,
    b: 80,
  },
  orangered: {
    r: 255,
    g: 69,
    b: 0,
  },
  darksalmon: {
    r: 233,
    g: 150,
    b: 122,
  },
  tomato: {
    r: 255,
    g: 99,
    b: 71,
  },
  salmon: {
    r: 250,
    g: 128,
    b: 114,
  },
  mistyrose: {
    r: 255,
    g: 228,
    b: 225,
  },
  snow: {
    r: 255,
    g: 250,
    b: 250,
  },
  rosybrown: {
    r: 188,
    g: 143,
    b: 143,
  },
  lightcoral: {
    r: 240,
    g: 128,
    b: 128,
  },
  indianred: {
    r: 205,
    g: 92,
    b: 92,
  },
  brown: {
    r: 165,
    g: 42,
    b: 42,
  },
  firebrick: {
    r: 178,
    g: 34,
    b: 34,
  },
  red: {
    r: 255,
    g: 0,
    b: 0,
  },
  darkred: {
    r: 139,
    g: 0,
    b: 0,
  },
  maroon: {
    r: 128,
    g: 0,
    b: 0,
  },
  white: {
    r: 255,
    g: 255,
    b: 255,
  },
  gainsboro: {
    r: 220,
    g: 220,
    b: 220,
  },
  lightgray: {
    r: 211,
    g: 211,
    b: 211,
  },
  silver: {
    r: 192,
    g: 192,
    b: 192,
  },
  darkgray: {
    r: 169,
    g: 169,
    b: 169,
  },
  gray: {
    r: 128,
    g: 128,
    b: 128,
  },
  dimgray: {
    r: 105,
    g: 105,
    b: 105,
  },
  black: {
    r: 0,
    g: 0,
    b: 0,
  },
  whitesmoke: {
    r: 245,
    g: 245,
    b: 245,
  },
};

export default mapping;
