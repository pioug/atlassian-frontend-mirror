import * as colors from '@atlaskit/theme/colors';
import { PaletteColor } from './type';

export const lightModeStatusColorPalette: PaletteColor[] = [
  { label: 'neutral', value: colors.N40, border: colors.N400 },
  { label: 'purple', value: colors.P50, border: colors.P400 },
  { label: 'blue', value: colors.B50, border: colors.B400 },
  { label: 'red', value: colors.R50, border: colors.R400 },
  { label: 'yellow', value: colors.Y75, border: colors.Y400 },
  { label: 'green', value: colors.G50, border: colors.G400 },
];

export const darkModeStatusColorPalette: PaletteColor[] = [
  { label: 'neutral', value: '#7F9BB4', border: colors.N400 },
  { label: 'purple', value: '#282249', border: colors.P400 },
  { label: 'blue', value: '#0C294F', border: colors.B400 },
  { label: 'red', value: '#441C13', border: colors.R400 },
  { label: 'yellow', value: '#413001', border: colors.Y400 },
  { label: 'green', value: '#052E21', border: colors.G400 },
];
