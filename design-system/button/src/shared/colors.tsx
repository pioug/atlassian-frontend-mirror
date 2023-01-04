import * as colors from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

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
      default: {
        light: token('color.background.neutral', colors.N20A),
        dark: token('color.background.neutral', colors.DN70),
      },
      hover: {
        light: token('color.background.neutral.hovered', colors.N30A),
        dark: token('color.background.neutral.hovered', colors.DN60),
      },
      active: {
        light: token('color.background.neutral.pressed', fadedB75),
        dark: token('color.background.neutral.pressed', colors.B75),
      },
      disabled: {
        light: token('color.background.disabled', colors.N20A),
        dark: token('color.background.disabled', colors.DN70),
      },
      selected: {
        light: token('color.background.selected', colors.N700),
        dark: token('color.background.selected', colors.DN0),
      },
      focusSelected: {
        light: token('color.background.selected', colors.N700),
        dark: token('color.background.selected', colors.DN0),
      },
    },
    primary: {
      default: {
        light: token('color.background.brand.bold', colors.B400),
        dark: token('color.background.brand.bold', colors.B100),
      },
      hover: {
        light: token('color.background.brand.bold.hovered', colors.B300),
        dark: token('color.background.brand.bold.hovered', colors.B75),
      },
      active: {
        light: token('color.background.brand.bold.pressed', colors.B500),
        dark: token('color.background.brand.bold.pressed', colors.B200),
      },
      disabled: {
        light: token('color.background.disabled', colors.N20A),
        dark: token('color.background.disabled', colors.DN70),
      },
      selected: {
        light: token('color.background.selected', colors.N700),
        dark: token('color.background.selected', colors.DN0),
      },
      focusSelected: {
        light: token('color.background.selected', colors.N700),
        dark: token('color.background.selected', colors.DN0),
      },
    },
    warning: {
      default: {
        light: token('color.background.warning.bold', colors.Y300),
        dark: token('color.background.warning.bold', colors.Y300),
      },
      hover: {
        light: token('color.background.warning.bold.hovered', colors.Y200),
        dark: token('color.background.warning.bold.hovered', colors.Y200),
      },
      active: {
        light: token('color.background.warning.bold.pressed', colors.Y400),
        dark: token('color.background.warning.bold.pressed', colors.Y400),
      },
      disabled: {
        light: token('color.background.disabled', colors.N20A),
        dark: token('color.background.disabled', colors.DN70),
      },
      selected: {
        light: token('color.background.selected', colors.Y400),
        dark: token('color.background.selected', colors.Y400),
      },
      focusSelected: {
        light: token('color.background.selected', colors.Y400),
        dark: token('color.background.selected', colors.Y400),
      },
    },
    danger: {
      default: {
        light: token('color.background.danger.bold', colors.R400),
        dark: token('color.background.danger.bold', colors.R400),
      },
      hover: {
        light: token('color.background.danger.bold.hovered', colors.R300),
        dark: token('color.background.danger.bold.hovered', colors.R300),
      },
      active: {
        light: token('color.background.danger.bold.pressed', colors.R500),
        dark: token('color.background.danger.bold.pressed', colors.R500),
      },
      disabled: {
        light: token('color.background.disabled', colors.N20A),
        dark: token('color.background.disabled', colors.DN70),
      },
      selected: {
        light: token('color.background.selected', colors.R500),
        dark: token('color.background.selected', colors.R500),
      },
      focusSelected: {
        light: token('color.background.selected', colors.R500),
        dark: token('color.background.selected', colors.R500),
      },
    },
    link: {
      default: {
        light: token('color.background.neutral.subtle', 'none'),
        dark: token('color.background.neutral.subtle', 'none'),
      },
      selected: {
        light: token('color.background.selected', colors.N700),
        dark: token('color.background.selected', colors.N20),
      },
      focusSelected: {
        light: token('color.background.selected', colors.N700),
        dark: token('color.background.selected', colors.N20),
      },
    },
    subtle: {
      default: {
        light: token('color.background.neutral.subtle', 'none'),
        dark: token('color.background.neutral.subtle', 'none'),
      },
      hover: {
        light: token('color.background.neutral.subtle.hovered', colors.N30A),
        dark: token('color.background.neutral.subtle.hovered', colors.DN60),
      },
      active: {
        light: token('color.background.neutral.subtle.pressed', fadedB75),
        dark: token('color.background.neutral.subtle.pressed', colors.B75),
      },
      disabled: {
        light: token('color.background.neutral.subtle', 'none'),
        dark: token('color.background.neutral.subtle', 'none'),
      },
      selected: {
        light: token('color.background.selected', colors.N700),
        dark: token('color.background.selected', colors.DN0),
      },
      focusSelected: {
        light: token('color.background.selected', colors.N700),
        dark: token('color.background.selected', colors.DN0),
      },
    },
    'subtle-link': {
      default: {
        light: token('color.background.neutral.subtle', 'none'),
        dark: token('color.background.neutral.subtle', 'none'),
      },
      selected: {
        light: token('color.background.selected', colors.N700),
        dark: token('color.background.selected', colors.N20),
      },
      focusSelected: {
        light: token('color.background.selected', colors.N700),
        dark: token('color.background.selected', colors.N20),
      },
    },
  },

  boxShadowColor: {
    default: {
      focus: {
        light: token('color.border.focused', colors.B100),
        dark: token('color.border.focused', colors.B75),
      },
      focusSelected: {
        light: token('color.border.focused', colors.B100),
        dark: token('color.border.focused', colors.B75),
      },
    },
    primary: {
      focus: {
        light: token('color.border.focused', colors.B100),
        dark: token('color.border.focused', colors.B75),
      },
      focusSelected: {
        light: token('color.border.focused', colors.B100),
        dark: token('color.border.focused', colors.B75),
      },
    },
    warning: {
      focus: {
        light: token('color.border.focused', colors.Y500),
        dark: token('color.border.focused', colors.Y500),
      },
      focusSelected: {
        light: token('color.border.focused', colors.Y500),
        dark: token('color.border.focused', colors.Y500),
      },
    },
    danger: {
      focus: {
        light: token('color.border.focused', colors.R100),
        dark: token('color.border.focused', colors.R100),
      },
      focusSelected: {
        light: token('color.border.focused', colors.R100),
        dark: token('color.border.focused', colors.R100),
      },
    },
    link: {
      focus: {
        light: token('color.border.focused', colors.B100),
        dark: token('color.border.focused', colors.B75),
      },
      focusSelected: {
        light: token('color.border.focused', colors.B100),
        dark: token('color.border.focused', colors.B75),
      },
    },
    subtle: {
      focus: {
        light: token('color.border.focused', colors.B100),
        dark: token('color.border.focused', colors.B75),
      },
      focusSelected: {
        light: token('color.border.focused', colors.B100),
        dark: token('color.border.focused', colors.B75),
      },
    },
    'subtle-link': {
      focus: {
        light: token('color.border.focused', colors.B100),
        dark: token('color.border.focused', colors.B75),
      },
      focusSelected: {
        light: token('color.border.focused', colors.B100),
        dark: token('color.border.focused', colors.B75),
      },
    },
  },
  color: {
    default: {
      default: {
        light: token('color.text', colors.N500),
        dark: token('color.text', colors.DN400),
      },
      active: {
        light: token('color.text', colors.B400),
        dark: token('color.text', colors.B400),
      },
      disabled: {
        light: token('color.text.disabled', colors.N70),
        dark: token('color.text.disabled', colors.DN30),
      },
      selected: {
        light: token('color.text.selected', colors.N20),
        dark: token('color.text.selected', colors.DN400),
      },
      focusSelected: {
        light: token('color.text.selected', colors.N20),
        dark: token('color.text.selected', colors.DN400),
      },
    },
    primary: {
      default: {
        light: token('color.text.inverse', colors.N0),
        dark: token('color.text.inverse', colors.DN30),
      },
      disabled: {
        light: token('color.text.disabled', colors.N70),
        dark: token('color.text.disabled', colors.DN30),
      },
      selected: {
        light: token('color.text.selected', colors.N20),
        dark: token('color.text.selected', colors.DN400),
      },
      focusSelected: {
        light: token('color.text.selected', colors.N20),
        dark: token('color.text.selected', colors.DN400),
      },
    },
    warning: {
      default: {
        light: token('color.text.warning.inverse', colors.N800),
        dark: token('color.text.warning.inverse', colors.N800),
      },
      disabled: {
        light: token('color.text.disabled', colors.N70),
        dark: token('color.text.disabled', colors.DN30),
      },
      selected: {
        light: token('color.text.selected', colors.N800),
        dark: token('color.text.selected', colors.N800),
      },
      focusSelected: {
        light: token('color.text.selected', colors.N800),
        dark: token('color.text.selected', colors.N800),
      },
    },
    danger: {
      default: {
        light: token('color.text.inverse', colors.N0),
        dark: token('color.text.inverse', colors.N0),
      },
      disabled: {
        light: token('color.text.disabled', colors.N70),
        dark: token('color.text.disabled', colors.DN30),
      },
      selected: {
        light: token('color.text.selected', colors.N0),
        dark: token('color.text.selected', colors.N0),
      },
      focusSelected: {
        light: token('color.text.selected', colors.N0),
        dark: token('color.text.selected', colors.N0),
      },
    },
    link: {
      default: {
        light: token('color.link', colors.B400),
        dark: token('color.link', colors.B100),
      },
      hover: {
        light: token('color.link', colors.B300),
        dark: token('color.link', colors.B75),
      },
      active: {
        light: token('color.link.pressed', colors.B500),
        dark: token('color.link.pressed', colors.B200),
      },
      disabled: {
        light: token('color.text.disabled', colors.N70),
        dark: token('color.text.disabled', colors.DN100),
      },
      selected: {
        light: token('color.text.selected', colors.N20),
        dark: token('color.text.selected', colors.N700),
      },
      focusSelected: {
        light: token('color.text.selected', colors.N20),
        dark: token('color.text.selected', colors.N700),
      },
    },
    subtle: {
      default: {
        light: token('color.text', colors.N500),
        dark: token('color.text', colors.DN400),
      },
      active: {
        light: token('color.text', colors.B400),
        dark: token('color.text', colors.B400),
      },
      disabled: {
        light: token('color.text.disabled', colors.N70),
        dark: token('color.text.disabled', colors.DN100),
      },
      selected: {
        light: token('color.text.selected', colors.N20),
        dark: token('color.text.selected', colors.DN400),
      },
      focusSelected: {
        light: token('color.text.selected', colors.N20),
        dark: token('color.text.selected', colors.DN400),
      },
    },
    'subtle-link': {
      default: {
        light: token('color.text.subtle', colors.N200),
        dark: token('color.text.subtle', colors.DN400),
      },
      hover: {
        light: token('color.text.subtle', colors.N90),
        dark: token('color.text.subtle', colors.B50),
      },
      active: {
        light: token('color.text', colors.N400),
        dark: token('color.text', colors.DN300),
      },
      disabled: {
        light: token('color.text.disabled', colors.N70),
        dark: token('color.text.disabled', colors.DN100),
      },
      selected: {
        light: token('color.text.selected', colors.N20),
        dark: token('color.text.selected', colors.DN400),
      },
      focusSelected: {
        light: token('color.text.selected', colors.N20),
        dark: token('color.text.selected', colors.DN400),
      },
    },
  },
};

export default values;
