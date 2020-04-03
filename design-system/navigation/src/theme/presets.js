import chromatism from 'chromatism';
import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';
// the following colors have been added at request of Venn. These should either
// be added to theme.colors or moved to specific AK colors. They are using a new
// method to generate colors dynamically based on the background color.
const darkDrawerItemHoverBackground = '#313F57';
const darkDrawerItemActiveBackground = '#2B374D';

const darkItemHoverBackground = '#253247';
const darkItemActiveBackground = '#202B3D';
const darkItemSelectedBackground = '#202B3D';

const derivedGlobalHoverBackground = '#192238';
const derivedGlobalActiveBackground = '#202B3D';
const derivedGlobalSelectedBackground = '#1D2842';

// Currently shared by all the themes - but need not be
const focus = {
  outline: themed({ light: colors.B100, dark: colors.B75 }),
};

function lightenColor(color, alpha) {
  const { r: red, g: green, b: blue } = chromatism.convert(color).rgb;
  return `rgba(${red}, ${green}, ${blue}, 0.${alpha})`;
}

export const container = (() => {
  const primaryBackground = colors.codeBlock;
  const item = {
    default: {
      background: 'transparent',
    },
    hover: {
      background: themed({
        light: colors.N20A,
        dark: darkDrawerItemHoverBackground,
      }),
    },
    active: {
      background: themed({
        light: colors.B50,
        dark: darkDrawerItemActiveBackground,
      }),
    },
    selected: {
      background: colors.N20A,
      text: colors.B400,
    },
    focus,
    dragging: {
      // similar to hover - but without opacity
      background: themed({ light: colors.N30, dark: colors.DN30 }),
    },
  };

  const scrollBar = {
    default: {
      background: themed({
        light: lightenColor(colors.N500, 36),
        dark: lightenColor(colors.DN600, 36),
      }),
    },
    hover: {
      background: themed({
        light: lightenColor(colors.N500, 56),
        dark: lightenColor(colors.DN600, 56),
      }),
    },
  };

  const dropdown = {
    default: {
      background: item.hover.background,
    },
    hover: {
      background: themed({ light: colors.N30A, dark: colors.DN30A }),
    },
    active: item.active,
    selected: item.selected,
    focus: item.focus,
    dragging: item.dragging,
  };

  const theme = {
    background: {
      primary: primaryBackground,
      secondary: primaryBackground,
      tertiary: themed({ light: colors.N0, dark: colors.DN30 }),
    },
    text: themed({ light: colors.N500, dark: colors.DN600 }),
    subText: colors.subtleText,
    keyline: themed({ light: colors.N30A, dark: colors.DN30A }),
    item,
    dropdown,
    scrollBar,
  };

  return theme;
})();

export const dark = (() => {
  const item = {
    default: {
      background: 'transparent',
    },
    hover: {
      background: darkItemHoverBackground,
    },
    active: {
      // Currently there is no ramp for white opacity
      background: darkItemActiveBackground,
      text: colors.B100,
    },
    selected: {
      background: darkItemSelectedBackground,
      text: colors.DN900,
    },
    focus,
    dragging: {
      // Similar to active colour - but without opacity
      background: colors.DN50,
    },
  };
  const scrollBar = {
    default: {
      background: lightenColor(colors.DN400, 36),
    },
    hover: {
      background: lightenColor(colors.DN400, 26),
    },
  };

  const dropdown = {
    default: {
      background: item.hover.background,
    },
    hover: {
      // Going lighter to be different from hover
      background: colors.DN60,
    },
    active: item.active,
    selected: item.selected,
    focus: item.focus,
    dragging: item.dragging,
  };

  const theme = {
    background: {
      primary: colors.DN0,
      secondary: colors.DN20,
      tertiary: colors.DN30,
    },
    text: colors.DN400,
    subText: colors.DN100,
    keyline: colors.DN50,
    item,
    dropdown,
    scrollBar,
  };

  return theme;
})();

export const settings = (() => {
  const primaryBackground = colors.N800;

  const item = {
    default: {
      background: 'transparent',
    },
    hover: {
      background: colors.N700A,
    },
    active: {
      // Currently there is no ramp for white opacity
      background: 'rgba(255, 255, 255, 0.08)',
      text: colors.B100,
    },
    selected: {
      background: colors.N700A,
    },
    focus,
    dragging: {
      // Similar to active colour - but without opacity
      background: colors.N600,
    },
  };

  const scrollBar = {
    default: {
      background: lightenColor(colors.N0, 36),
    },
    hover: {
      background: lightenColor(colors.N0, 26),
    },
  };

  const dropdown = {
    default: {
      background: item.hover.background,
    },
    hover: {
      // Going lighter to be different from hover
      background: colors.N90A,
    },
    active: item.active,
    selected: item.selected,
    focus: item.focus,
    dragging: item.dragging,
  };

  const theme = {
    background: {
      primary: primaryBackground,
      secondary: colors.N700,
      tertiary: colors.N700,
    },
    text: colors.N0,
    subText: colors.N70,
    keyline: colors.N900,
    item,
    dropdown,
    scrollBar,
  };

  return theme;
})();

export const siteSettings = (() => {
  // deep copy settings and re-assign some colors
  const theme = JSON.parse(JSON.stringify(settings));
  theme.background.secondary = colors.N800;
  theme.item.active.text = colors.B100;
  return theme;
})();

export const global = (() => {
  const primaryBackground = colors.B500;
  const activeBackground = colors.B200;
  const item = {
    default: {
      background: primaryBackground,
    },
    hover: {
      background: themed({
        light: colors.N80A,
        dark: derivedGlobalHoverBackground,
      }),
    },
    active: {
      background: themed({
        light: activeBackground,
        dark: derivedGlobalActiveBackground,
      }),
      text: themed({ light: colors.B50, dark: colors.B100 }),
    },
    selected: {
      background: themed({
        light: colors.N50A,
        dark: derivedGlobalSelectedBackground,
      }),
      text: colors.B50,
    },
    focus,
    dragging: {
      // using active colour for this preset
      background: activeBackground,
    },
  };

  const scrollBar = {
    default: {
      background: themed({
        light: lightenColor(colors.B50, 36),
        dark: lightenColor(colors.DN400, 36),
      }),
    },
    hover: {
      background: themed({
        light: lightenColor(colors.B50, 56),
        dark: lightenColor(colors.DN400, 56),
      }),
    },
  };

  const dropdown = {
    default: {
      background: item.hover.background,
    },
    hover: {
      // going darker than standard hover
      background: colors.N90A,
    },
    active: item.active,
    selected: item.selected,
    focus: item.focus,
    dragging: item.dragging,
  };

  const theme = {
    background: {
      primary: themed({ light: primaryBackground, dark: colors.DN0 }),
      secondary: themed({ light: primaryBackground, dark: colors.DN0 }),
      tertiary: themed({ light: primaryBackground, dark: colors.DN0 }),
    },
    hasDarkmode: true,
    text: themed({ light: colors.B50, dark: colors.DN400 }),
    subText: themed({ light: colors.B75, dark: colors.DN100 }),
    keyline: themed({ light: colors.N80A, dark: colors.DN50 }),
    item,
    dropdown,
    scrollBar,
  };

  return theme;
})();
