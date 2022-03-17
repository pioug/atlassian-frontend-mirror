import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const spotlightTheme = {
  default: {
    background: {
      default: token('color.background.neutral', colors.P400),
      hover: token('color.background.neutral.hovered', colors.P200),
      active: token('color.background.neutral.pressed', colors.P500),
      disabled: token('color.background.disabled', colors.P400),
      selected: token('color.background.neutral.pressed', colors.R500),
      focus: token('color.background.neutral', colors.P400),
    },
    boxShadow: {
      focus: `0 0 0 2px ${token('color.border.discovery', colors.P100)}`,
    },
    color: {
      default: token('color.text.inverse', colors.N0),
      hover: token('color.text.inverse', colors.N0),
      active: token('color.text.inverse', colors.N0),
      disabled: {
        light: token('color.text.disabled', colors.N0),
        dark: token('color.text.disabled', colors.DN30),
      },
      selected: token('color.text.inverse', colors.N0),
      focus: token('color.text.inverse', colors.N0),
    },
    outline: {
      focus: 'none',
    },
  },
  subtle: {
    background: {
      default: 'none',
      hover: token('color.background.neutral.hovered', colors.P200),
      active: token('color.background.neutral.pressed', colors.P500),
      disabled: 'none',
      selected: {
        light: token('color.background.selected.hovered', colors.N700),
        dark: token('color.background.selected.hovered', colors.DN0),
      },
      focusSelected: {
        light: token('color.background.selected.hovered', colors.N700),
        dark: token('color.background.selected.hovered', colors.DN0),
      },
    },
    boxShadow: {
      focus: `0 0 0 2px ${token('color.icon.discovery', colors.P100)}`,
    },
    color: {
      default: token('color.text.inverse', colors.N0),
      hover: token('color.text.inverse', colors.N0),
      active: token('color.text.inverse', colors.N0),
      disabled: token('color.text.disabled', colors.N0),
      selected: token('color.text.inverse', colors.N0),
      focus: token('color.text.inverse', colors.N0),
    },
    outline: {
      focus: 'none',
    },
  },
  'subtle-link': {
    textDecoration: {
      hover: `underline ${token('color.text.discovery', colors.P75)}`,
    },
    textDecorationLine: {
      active: 'none',
    },
    boxShadow: {
      focus: `0 0 0 2px ${token('color.border.discovery', colors.P100)}`,
    },
    color: {
      default: token('color.text.inverse', colors.N0),
      hover: token('color.text.inverse', colors.P75),
      active: token('color.text.inverse', colors.P100),
      disabled: token('color.text.discovery', colors.P500),
      selected: token('color.text.selected', colors.N0),
      focus: token('color.text.inverse', colors.N0),
    },
  },
};

const modalTheme = {
  primary: {
    background: {
      default: token('color.background.discovery.bold', colors.P400),
      hover: token('color.background.discovery.bold.hovered', colors.P200),
      active: token('color.background.discovery.bold.pressed', colors.P500),
      disabled: {
        light: token('color.background.disabled', colors.N30),
        dark: token('color.background.disabled', colors.DN70),
      },
      selected: token('color.background.selected.hovered', colors.R500),
      focus: token('color.background.discovery.bold.hovered', colors.P400),
    },
    boxShadow: {
      focus: {
        light: `0 0 0 2px ${token('color.border.discovery', colors.P100)}`,
        dark: `0 0 0 2px ${token('color.border.discovery', colors.P100)}`,
      },
    },
    color: {
      default: token('color.text.inverse', colors.N0),
      disabled: {
        light: token('color.text.disabled', colors.N0),
        dark: token('color.text.disabled', colors.DN30),
      },
      selected: token('color.text.selected', colors.N0),
      focus: token('color.text.inverse', colors.N0),
    },
  },
};

function extract(
  newTheme: any,
  { mode, appearance, state }: Record<string, any>,
) {
  if (!newTheme[appearance]) {
    return undefined;
  }

  const root = newTheme[appearance];

  return Object.keys(root).reduce((acc: { [index: string]: string }, val) => {
    let node = root;
    [val, state, mode].forEach((item) => {
      if (!node[item]) {
        return undefined;
      }
      if (typeof node[item] !== 'object') {
        acc[val] = node[item];
        return undefined;
      }
      node = node[item];
      return undefined;
    });
    return acc;
  }, {});
}

export const spotlightButtonTheme = (
  current: any,
  themeProps: Record<string, any>,
) => {
  const { buttonStyles, ...rest } = current(themeProps);

  return {
    buttonStyles: {
      ...buttonStyles,
      ...extract(spotlightTheme, themeProps),
    },
    ...rest,
  };
};

export const modalButtonTheme = (
  current: any,
  themeProps: Record<string, any>,
) => {
  const { buttonStyles, ...rest } = current(themeProps);
  return {
    buttonStyles: {
      ...buttonStyles,
      ...extract(modalTheme, themeProps),
    },
    ...rest,
  };
};
