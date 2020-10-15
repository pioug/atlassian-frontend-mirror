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

export {
  CHANNEL,
  DEFAULT_THEME_MODE,
  FLATTENED,
  THEME_MODES,
  assistive,
  borderRadius,
  codeFontFamily,
  focusRing,
  fontFamily,
  fontSize,
  fontSizeSmall,
  gridSize,
  layers,
  noFocusRing,
  skeletonShimmer,
  visuallyHidden,
} from './constants';
export { Reset, ResetTheme } from './components/Reset';
export type { ResetThemeProps, ResetThemeTokens } from './components/Reset';
export { default } from './components/Theme';
export { withTheme } from './hoc';
export { createTheme } from './utils/createTheme';
export type { ThemeProp } from './utils/createTheme';
export type {
  AtlaskitThemeProps,
  CustomThemeProps,
  DefaultValue,
  Elevation,
  GlobalThemeTokens,
  NoThemeProps,
  Theme,
  ThemeModes,
  ThemeProps,
  ThemedValue,
  colorPaletteType,
} from './types';
