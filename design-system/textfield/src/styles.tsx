import { R400 } from '@atlaskit/theme/colors';
import {
  codeFontFamily,
  fontFamily,
  fontSize as getFontSize,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import * as componentTokens from './component-tokens';
import { Appearance } from './types';

const fontSize = getFontSize();
const gridSize = getGridSize();

const disabledRules = {
  light: {
    backgroundColor: componentTokens.disabledBackgroundColor.light,
    backgroundColorHover: componentTokens.disabledBackgroundColor.light,
    borderColor: componentTokens.disabledBackgroundColor.light,
    textColor: componentTokens.disabledTextColor.light,
  },
  dark: {
    backgroundColor: componentTokens.disabledBackgroundColor.dark,
    backgroundColorHover: componentTokens.disabledBackgroundColor.dark,
    borderColor: componentTokens.disabledBackgroundColor.dark,
    textColor: componentTokens.disabledTextColor.dark,
  },
};

const invalidRules = {
  light: {
    // ----
    backgroundColor: componentTokens.defaultBackgroundColor.light,
    backgroundColorHover: componentTokens.defaultBackgroundColorHover.light,
    // ^--- the above values aren't used directly they remain because its exposed by the `textFieldColors` export
    backgroundColorFocus: componentTokens.defaultBackgroundColorFocus.light,
    borderColor: token('color.iconBorder.danger', R400),
    borderColorFocus: componentTokens.defaultBorderColorFocus.light,
  },
  dark: {
    // ----
    backgroundColor: componentTokens.defaultBackgroundColor.dark,
    backgroundColorHover: componentTokens.defaultBackgroundColorHover.dark,
    // ^--- the above values aren't used directly they remain because its exposed by the `textFieldColors` export
    backgroundColorFocus: componentTokens.defaultBackgroundColorFocus.dark,
    borderColor: token('color.iconBorder.danger', R400),
    borderColorFocus: componentTokens.defaultBorderColorFocus.dark,
  },
};

const backgroundColor = {
  standard: componentTokens.defaultBackgroundColor,
  subtle: componentTokens.transparent,
  none: componentTokens.transparent,
};

const backgroundColorFocus = {
  standard: componentTokens.defaultBackgroundColorFocus,
  subtle: componentTokens.defaultBackgroundColorFocus,
  none: componentTokens.transparent,
};

const backgroundColorHover = {
  standard: componentTokens.defaultBackgroundColorHover,
  subtle: componentTokens.subtleBackgroundColorHover,
  none: componentTokens.transparent,
};

const borderColor = {
  standard: componentTokens.defaultBorderColor,
  subtle: componentTokens.transparent,
  none: componentTokens.transparent,
};

const borderColorFocus = {
  standard: componentTokens.defaultBorderColorFocus,
  subtle: componentTokens.defaultBorderColorFocus,
  none: componentTokens.transparent,
};

const getContainerTextBgAndBorderColor = (
  appearance: Appearance,
  mode: ThemeModes,
) => ({
  backgroundColor: backgroundColor[appearance][mode],
  borderColor: borderColor[appearance][mode],
  color: componentTokens.textColor[mode],
  cursor: 'text',
  '&:hover': {
    backgroundColor: backgroundColorHover[appearance][mode],
  },
  '&:focus-within': {
    backgroundColor: backgroundColorFocus[appearance][mode],
    borderColor: borderColorFocus[appearance][mode],
  },
  '&[data-disabled]': {
    backgroundColor: disabledRules[mode].backgroundColor,
    borderColor: disabledRules[mode].borderColor,
    color: disabledRules[mode].textColor,
    cursor: 'not-allowed',
  },
  '&[data-invalid]': {
    borderColor: invalidRules[mode].borderColor,
  },
  '&[data-invalid]:focus-within': {
    backgroundColor: invalidRules[mode].backgroundColorFocus,
    borderColor: invalidRules[mode].borderColorFocus,
  },
  '@media screen and (-ms-high-contrast: active)': {
    '&[data-invalid]:focus-within': {
      borderColor: 'Highlight',
    },
    '&:focus-within': {
      borderColor: 'Highlight',
    },
    '&[data-disabled]': {
      borderColor: 'GrayText',
    },
  },
});

const widthMap: { [key: string]: number } = {
  xsmall: 80,
  small: 160,
  medium: 240,
  large: 320,
  xlarge: 480,
};

const getMaxWidth = (width: string | number | undefined): number | string =>
  !width ? `100%` : width in widthMap ? widthMap[width] : +width;

export const containerStyles = (
  appearance: Appearance,
  mode: ThemeModes,
  width?: string | number,
) =>
  ({
    alignItems: 'center',
    ...getContainerTextBgAndBorderColor(appearance, mode),
    borderRadius: 3,
    borderWidth: 2,
    borderStyle: appearance === 'none' ? 'none' : 'solid',
    boxSizing: 'border-box',
    display: 'flex',
    flex: '1 1 100%',
    fontSize,
    justifyContent: 'space-between',
    maxWidth: getMaxWidth(width),
    overflow: 'hidden',
    transition: `background-color 0.2s ease-in-out, border-color 0.2s ease-in-out`,
    wordWrap: 'break-word',
    verticalAlign: 'top',
    pointerEvents: 'auto',
  } as const);

export const inputStyles = (mode: ThemeModes) =>
  ({
    backgroundColor: 'transparent',
    border: 0,
    boxSizing: 'border-box',
    color: 'inherit',
    cursor: 'inherit',
    fontSize,
    minWidth: '0',
    outline: 'none',
    width: '100%',
    lineHeight: (gridSize * 2.5) / fontSize,
    fontFamily: fontFamily(),
    '&[data-monospaced]': {
      fontFamily: codeFontFamily(),
    },
    '&[data-compact]': {
      padding: `${gridSize / 2}px ${gridSize - 2}px`,
      height: `${((gridSize * 3.5) / fontSize).toFixed(2)}em`,
    },
    '&:not([data-compact])': {
      padding: `${gridSize}px ${gridSize - 2}px`,
      height: `${((gridSize * 4.5) / fontSize).toFixed(2)}em`,
    },
    '&[disabled]': {
      // Safari (WebKit) adds a -webkit-text-fill-color style to disabled inputs
      // which takes priority over color and makes the text unreadable. Need to
      // override it with the color we want.
      WebkitTextFillColor: disabledRules[mode].textColor,
    },
    // Hide the clear indicator on Edge (Windows only)
    '&::-ms-clear': {
      display: 'none',
    },
    '&:invalid': {
      boxShadow: 'none',
    },
    '&::placeholder': {
      color: componentTokens.placeholderTextColor[mode],
      '&:disabled': {
        color: disabledRules[mode].textColor,
      },
    },
    '@media screen and (-ms-high-contrast: active)': {
      '&[disabled]': {
        color: 'GrayText',
      },
    },
  } as const);

// TODO: Remove when removing legacy theming.
export const textFieldColors = {
  backgroundColor,
  backgroundColorFocus,
  backgroundColorHover,
  borderColor,
  borderColorFocus,
  placeholderTextColor: componentTokens.placeholderTextColor,
  textColor: componentTokens.textColor,
  invalidRules,
  disabledRules,
};
