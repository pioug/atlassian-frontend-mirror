import * as colors from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';

import { Appearance } from '../types';

export type ColorRule = {
  [key in ThemeModes]: string;
};

export type ColorGroup = {
  default: ColorRule;
  hover?: ColorRule;
  active?: ColorRule;
  disabled?: ColorRule;
  selected?: ColorRule;
  focus?: ColorRule;
  focusSelected?: ColorRule;
};

export type ColorPreset = {
  [key in Appearance]: ColorGroup;
};

export type BoxShadowColorGroup = {
  focus: ColorRule;
  focusSelected: ColorRule;
};

type BoxShadowColorPreset = {
  [key in Appearance]: BoxShadowColorGroup;
};

type Values = {
  background: ColorPreset;
  boxShadowColor: BoxShadowColorPreset;
  color: ColorPreset;
};

// Hard coding the active rgba color value rather than using a helper to convert it
// With helper it would be: hex2rgba(colors.B75, 0.6)
const fadedB75: string = 'rgba(179, 212, 255, 0.6)';

const values: Values = {
  // Default appearance
  background: {
    default: {
      default: { light: colors.N20A, dark: colors.DN70 },
      hover: { light: colors.N30A, dark: colors.DN60 },
      active: { light: fadedB75, dark: colors.B75 },
      disabled: { light: colors.N20A, dark: colors.DN70 },
      selected: { light: colors.N700, dark: colors.DN0 },
      focusSelected: { light: colors.N700, dark: colors.DN0 },
    },
    primary: {
      default: { light: colors.B400, dark: colors.B100 },
      hover: { light: colors.B300, dark: colors.B75 },
      active: { light: colors.B500, dark: colors.B200 },
      disabled: { light: colors.N20A, dark: colors.DN70 },
      selected: { light: colors.N700, dark: colors.DN0 },
      focusSelected: { light: colors.N700, dark: colors.DN0 },
    },
    warning: {
      default: { light: colors.Y300, dark: colors.Y300 },
      hover: { light: colors.Y200, dark: colors.Y200 },
      active: { light: colors.Y400, dark: colors.Y400 },
      disabled: { light: colors.N20A, dark: colors.DN70 },
      selected: { light: colors.Y400, dark: colors.Y400 },
      focusSelected: { light: colors.Y400, dark: colors.Y400 },
    },
    danger: {
      default: { light: colors.R400, dark: colors.R400 },
      hover: { light: colors.R300, dark: colors.R300 },
      active: { light: colors.R500, dark: colors.R500 },
      disabled: { light: colors.N20A, dark: colors.DN70 },
      selected: { light: colors.R500, dark: colors.R500 },
      focusSelected: { light: colors.R500, dark: colors.R500 },
    },
    link: {
      default: { light: 'none', dark: 'none' },
      selected: { light: colors.N700, dark: colors.N20 },
      focusSelected: { light: colors.N700, dark: colors.N20 },
    },
    subtle: {
      default: { light: 'none', dark: 'none' },
      hover: { light: colors.N30A, dark: colors.DN60 },
      active: { light: fadedB75, dark: colors.B75 },
      disabled: { light: 'none', dark: 'none' },
      selected: { light: colors.N700, dark: colors.DN0 },
      focusSelected: { light: colors.N700, dark: colors.DN0 },
    },
    'subtle-link': {
      default: { light: 'none', dark: 'none' },
      selected: { light: colors.N700, dark: colors.N20 },
      focusSelected: { light: colors.N700, dark: colors.N20 },
    },
  },

  boxShadowColor: {
    default: {
      focus: { light: colors.B100, dark: colors.B75 },
      focusSelected: {
        light: colors.B100,
        dark: colors.B75,
      },
    },
    primary: {
      focus: { light: colors.B100, dark: colors.B75 },
      focusSelected: {
        light: colors.B100,
        dark: colors.B75,
      },
    },
    warning: {
      focus: { light: colors.Y500, dark: colors.Y500 },
      focusSelected: { light: colors.Y500, dark: colors.Y500 },
    },
    danger: {
      focus: { light: colors.R100, dark: colors.R100 },
      focusSelected: { light: colors.R100, dark: colors.R100 },
    },
    link: {
      focus: { light: colors.B100, dark: colors.B75 },
      focusSelected: {
        light: colors.B100,
        dark: colors.B75,
      },
    },
    subtle: {
      focus: { light: colors.B100, dark: colors.B75 },
      focusSelected: {
        light: colors.B100,
        dark: colors.B75,
      },
    },
    'subtle-link': {
      focus: { light: colors.B100, dark: colors.B75 },
      focusSelected: {
        light: colors.B100,
        dark: colors.B75,
      },
    },
  },

  color: {
    default: {
      default: { light: colors.N500, dark: colors.DN400 },
      active: { light: colors.B400, dark: colors.B400 },
      disabled: { light: colors.N70, dark: colors.DN30 },
      selected: { light: colors.N20, dark: colors.DN400 },
      focusSelected: { light: colors.N20, dark: colors.DN400 },
    },
    primary: {
      default: { light: colors.N0, dark: colors.DN30 },
      disabled: { light: colors.N70, dark: colors.DN30 },
      selected: { light: colors.N20, dark: colors.DN400 },
      focusSelected: { light: colors.N20, dark: colors.DN400 },
    },
    warning: {
      default: { light: colors.N800, dark: colors.N800 },
      disabled: { light: colors.N70, dark: colors.DN30 },
      selected: { light: colors.N800, dark: colors.N800 },
      focusSelected: { light: colors.N800, dark: colors.N800 },
    },
    danger: {
      default: { light: colors.N0, dark: colors.N0 },
      disabled: { light: colors.N70, dark: colors.DN30 },
      selected: { light: colors.N0, dark: colors.N0 },
      focusSelected: { light: colors.N0, dark: colors.N0 },
    },
    link: {
      default: { light: colors.B400, dark: colors.B100 },
      hover: { light: colors.B300, dark: colors.B75 },
      active: { light: colors.B500, dark: colors.B200 },
      disabled: { light: colors.N70, dark: colors.DN100 },
      selected: { light: colors.N20, dark: colors.N700 },
      focusSelected: { light: colors.N20, dark: colors.N700 },
    },
    subtle: {
      default: { light: colors.N500, dark: colors.DN400 },
      active: { light: colors.B400, dark: colors.B400 },
      disabled: { light: colors.N70, dark: colors.DN100 },
      selected: { light: colors.N20, dark: colors.DN400 },
      focusSelected: { light: colors.N20, dark: colors.DN400 },
    },
    'subtle-link': {
      default: { light: colors.N200, dark: colors.DN400 },
      hover: { light: colors.N90, dark: colors.B50 },
      active: { light: colors.N400, dark: colors.DN300 },
      disabled: { light: colors.N70, dark: colors.DN100 },
      selected: { light: colors.N20, dark: colors.DN400 },
      focusSelected: { light: colors.N20, dark: colors.DN400 },
    },
  },
};

export default values;
