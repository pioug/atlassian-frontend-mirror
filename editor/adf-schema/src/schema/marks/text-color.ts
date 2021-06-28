import { Mark, MarkSpec } from 'prosemirror-model';
import { COLOR } from '../groups';
import {
  rgbToHex,
  N0,
  N80,
  P50,
  P300,
  P500,
  T75,
  T300,
  T500,
  G75,
  G300,
  G500,
  R75,
  R300,
  R500,
  Y75,
  Y200,
  Y400,
  B75,
  B100,
  B500,
} from '../../utils/colors';

export interface TextColorAttributes {
  /**
   * @pattern "^#[0-9a-fA-F]{6}$"
   */
  color: string;
}

/**
 * @name textColor_mark
 */
export interface TextColorDefinition {
  type: 'textColor';
  attrs: TextColorAttributes;
}

export interface TextColorMark extends Mark {
  attrs: TextColorAttributes;
}

export type TextColorKey =
  // row 1 original
  | 'Light gray'
  | 'Purple'
  | 'Teal'
  | 'Green'
  | 'Red'
  | 'Orange'
  // row 1 extended extras
  | 'Dark gray'
  | 'Blue'
  | 'Yellow'
  // row 2
  | 'Dark blue'
  | 'Dark teal'
  | 'Dark green'
  | 'Dark red'
  | 'Dark purple'
  // row 3
  | 'White'
  | 'Light blue'
  | 'Light teal'
  | 'Light green'
  | 'Light yellow'
  | 'Light red'
  | 'Light purple';

const colorArrayPalette: Array<[string, TextColorKey]> = [
  // default row
  // [N800, default],
  [N80, 'Light gray'],
  [P300, 'Purple'],
  [T300, 'Teal'],
  [G300, 'Green'],
  [R300, 'Red'],
  [Y400, 'Orange'],
];

// used for extended palette in text color picker
const colorArrayPaletteExtended: Array<[string, TextColorKey]> = [
  // default row - first color is added programatically
  // [N800, 'Squid ink'], // default dark gray
  [B100, 'Blue'], // Arvo breeze
  [T300, 'Teal'], // Tamarama
  [G300, 'Green'], // Fine pine
  [Y200, 'Yellow'], // Pub mix
  [R300, 'Red'], // Poppy surprise
  [P300, 'Purple'], // Da' juice
  // row 2
  [N80, 'Light gray'], // Spooky ghost
  [B500, 'Dark blue'], // Chore coat
  [T500, 'Dark teal'], // Shabby chic
  [G500, 'Dark green'], // Keen green
  [Y400, 'Orange'], // Cheezy blasters
  [R500, 'Dark red'], // Dragon's blood
  [P500, 'Dark purple'], // Prince
  // row 3
  [N0, 'White'],
  [B75, 'Light blue'], // Schwag
  [T75, 'Light teal'], // Arctic chill
  [G75, 'Light green'], // Mintie
  [Y75, 'Light yellow'], // Dandelion whisper
  [R75, 'Light red'], // Bondi sunburn
  [P50, 'Light purple'], // Lavender secret
];

// @see https://product-fabric.atlassian.net/wiki/spaces/E/pages/55979455/Colour+picker+decisions#Colourpickerdecisions-Visualdesigndecisions
export const colorPalette = new Map<string, TextColorKey>();
export const colorPaletteExtended = new Map<string, TextColorKey>();

colorArrayPalette.forEach(([color, label]) =>
  colorPalette.set(color.toLowerCase(), label),
);
colorArrayPaletteExtended.forEach(([color, label]) =>
  colorPaletteExtended.set(color.toLowerCase(), label),
);

export const textColor: MarkSpec = {
  attrs: { color: {} },
  inclusive: true,
  group: COLOR,
  parseDOM: [
    {
      style: 'color',
      getAttrs: (maybeValue) => {
        const value = maybeValue as string;
        let hexColor;
        if (value.match(/^rgb/i)) {
          hexColor = rgbToHex(value);
        } else if (value[0] === '#') {
          hexColor = value.toLowerCase();
        }
        // else handle other colour formats
        return hexColor &&
          (colorPalette.has(hexColor) || colorPaletteExtended.has(hexColor))
          ? { color: hexColor }
          : false;
      },
    },
  ],
  toDOM(mark) {
    return [
      'span',
      {
        style: `color: ${mark.attrs.color}`,
      },
    ];
  },
};
