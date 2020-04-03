import * as colors from './colors';
import * as colorPalettes from './color-palettes';
import * as elevation from './elevation';
import * as typography from './typography';
import * as math from './utils/math';
import getTheme from './utils/getTheme';
import themed from './utils/themed';
import AtlaskitThemeProvider from './components/AtlaskitThemeProvider';

export {
  colors,
  colorPalettes,
  elevation,
  typography,
  math,
  getTheme,
  themed,
  AtlaskitThemeProvider,
};
export { default as Appearance } from './components/Appearance';

// backwards-compatible export with old Atlaskit case
export const AtlasKitThemeProvider = AtlaskitThemeProvider;

export * from './constants';
// New API
export * from './components/Reset';
export { default } from './components/Theme';
export * from './hoc';
export * from './utils/createTheme';
export * from './types';
