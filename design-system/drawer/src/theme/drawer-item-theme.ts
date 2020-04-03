import { itemThemeNamespace } from '@atlaskit/item';
import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';
import chromatism from 'chromatism';
import { DrawerTheme, Background, ItemTheme, ScrollBarTheme } from './types';
import {
  gridSize,
  darkDrawerItemHoverBackground,
  darkDrawerItemActiveBackground,
} from '../constants';

// These themes are copied over from @atlaskit/global-navigation to preserve the theming
// of search and starred drawers.

const focus = {
  outline: themed({ light: colors.B100, dark: colors.B75 }),
};

function lightenColor(color: string, alpha: number) {
  const { r: red, g: green, b: blue } = chromatism.convert(color).rgb;
  return `rgba(${red}, ${green}, ${blue}, 0.${alpha})`;
}

const navigationTheme: DrawerTheme = ((): DrawerTheme => {
  const primaryBackground: Background = colors.codeBlock;
  const item: ItemTheme = {
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

  const scrollBar: ScrollBarTheme = {
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

  const dropdown: ItemTheme = {
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

  const theme: DrawerTheme = {
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

export default {
  [itemThemeNamespace]: {
    padding: {
      compact: {
        bottom: gridSize,
        left: gridSize,
        right: gridSize,
        top: gridSize,
      },
      default: {
        bottom: gridSize,
        left: gridSize * 1.5,
        right: gridSize * 1.5,
        top: gridSize,
      },
    },
    borderRadius: 3,
    height: {
      compact: gridSize * 4.5,
      default: gridSize * 5,
    },
    beforeItemSpacing: {
      compact: gridSize,
      default: gridSize * 2,
    },
    default: {
      background: navigationTheme.item.default.background,
      text: navigationTheme.text,
      secondaryText: navigationTheme.subText,
    },
    hover: {
      background: navigationTheme.item.hover.background,
      text: navigationTheme.text,
      secondaryText: navigationTheme.subText,
    },
    active: {
      background: navigationTheme.item.active.background,
      text: navigationTheme.item.active.text || navigationTheme.text,
      secondaryText: navigationTheme.subText,
    },
    selected: {
      background: navigationTheme.item.selected.background,
      text: navigationTheme.item.selected.text || '',
      secondaryText: navigationTheme.subText,
    },
    focus: {
      outline: navigationTheme.item.focus.outline,
    },
    dragging: {
      background: navigationTheme.item.dragging.background,
    },
  },
};
