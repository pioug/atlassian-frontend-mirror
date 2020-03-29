import { colorPaletteType } from './types';
import * as colors from './colors';

// Jira Portfolio
export const colorPalette8 = [
  { background: colors.N800, text: colors.N0 },
  { background: colors.R400, text: colors.N0 },
  { background: colors.P400, text: colors.P50 },
  { background: colors.B400, text: colors.B75 },
  { background: colors.T300, text: colors.N800 },
  { background: colors.G400, text: colors.N0 },
  { background: colors.Y400, text: colors.N800 },
  { background: colors.N70, text: colors.N800 },
];

export const colorPalette16 = [
  ...colorPalette8,
  { background: colors.N500, text: colors.N0 },
  { background: colors.R100, text: colors.N800 },
  { background: colors.P75, text: colors.N800 },
  { background: colors.B100, text: colors.N800 },
  { background: colors.T100, text: colors.N800 },
  { background: colors.G100, text: colors.G500 },
  { background: colors.Y200, text: colors.N800 },
  { background: colors.N0, text: colors.N800 },
];

export const colorPalette24 = [
  ...colorPalette16,
  { background: colors.N100, text: colors.N0 },
  { background: colors.N40, text: colors.N800 },
  { background: colors.N50, text: colors.R500 },
  { background: colors.P50, text: colors.P500 },
  { background: colors.B50, text: colors.B500 },
  { background: colors.T75, text: colors.N800 },
  { background: colors.G50, text: colors.G500 },
  { background: colors.Y75, text: colors.N800 },
];

export const colorPalette = (palette: colorPaletteType = '8') => {
  switch (palette) {
    case '8':
      return colorPalette8;
    case '16':
      return colorPalette16;
    case '24':
      return colorPalette24;
    default:
      throw new Error('The only available color palette is 8, 16, 24');
  }
};
