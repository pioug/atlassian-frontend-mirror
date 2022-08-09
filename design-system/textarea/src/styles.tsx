/** @jsx jsx */
import { CSSObject } from '@emotion/core';

import {
  codeFontFamily as getCodeFontFamily,
  fontFamily as getFontFamily,
  fontSize as getFontSize,
  gridSize,
} from '@atlaskit/theme/constants';

import { ThemeTokens } from './theme';

export interface StyleProps {
  minimumRows: number | undefined;
  resize: string | undefined;
  appearance: string | undefined;
  isMonospaced: boolean | undefined;
  maxHeight: string;
}
const grid = gridSize();
const borderRadius = 3;
const lineHeightBase = grid * 2.5;
const lineHeightCompact = grid * 2;
const compactVerticalPadding = 2;
const verticalPadding = 6;
const horizontalPadding = grid;
const transitionDuration = '0.2s';
const fontSize: number = getFontSize();
const fontFamily = getFontFamily();
const codeFontFamily = getCodeFontFamily();
export const borderWidth = 2;

// Safari puts on some difficult to remove styles, mainly for disabled inputs
// but we want full control so need to override them in all cases
const overrideSafariDisabledStyles: CSSObject = {
  WebkitTextFillColor: 'unset',
  WebkitOpacity: '1',
};

const borderBoxMinHeight = (minimumRows: number, borderHeight: number) => {
  const contentHeight = lineHeightBase * minimumRows;
  return contentHeight + verticalPadding * 2 + borderHeight * 2;
};

const borderBoxMinHeightCompact = (
  minimumRows: number,
  borderHeight: number,
) => {
  const contentHeightCompact = lineHeightCompact * minimumRows;
  return contentHeightCompact + compactVerticalPadding * 2 + borderHeight * 2;
};

const bgAndBorderColorStyles = (props: ThemeTokens): CSSObject => ({
  '&:focus': {
    backgroundColor: props.backgroundColorFocus,
    borderColor: props.borderColorFocus,
  },
  '&:not(:focus)': {
    backgroundColor: props.backgroundColor,
    borderColor: props.borderColor,
  },

  '&:disabled:focus': {
    backgroundColor: props.disabledRules.backgroundColorFocus,
    borderColor: props.disabledRules.borderColorFocus,
  },
  '&:disabled:not(:focus)': {
    backgroundColor: props.disabledRules.backgroundColor,
    borderColor: props.disabledRules.borderColor,
  },
  '&[data-invalid]:focus': {
    backgroundColor: props.invalidRules.backgroundColorFocus,
    borderColor: props.invalidRules.borderColorFocus,
  },
  '&[data-invalid]:not(:focus)': {
    backgroundColor: props.invalidRules.backgroundColor,
    borderColor: props.invalidRules.borderColor,
  },
});

const placeholderStyle = (placeholderTextColor: string) => ({
  '&::placeholder': {
    color: placeholderTextColor,
  },
});

const hoverBackgroundStyle = (props: ThemeTokens) => {
  return {
    '&:hover:not(:read-only):not(:focus)': {
      backgroundColor: props.backgroundColorHover,
      '&:disabled': {
        backgroundColor: props.disabledRules.backgroundColorHover,
      },
      '&[data-invalid]': {
        backgroundColor: props.invalidRules.backgroundColorHover,
      },
    },
  };
};

const resizeStyle = (resize: string | undefined): CSSObject => {
  if (resize === 'horizontal' || resize === 'vertical') {
    return { resize };
  }
  if (resize === 'auto') {
    return { resize: 'both' };
  }
  return { resize: 'none' };
};

const borderStyle = (appearance: string | undefined): CSSObject => ({
  borderStyle: appearance === 'none' ? 'none' : 'solid',
});

const fontFamilyStyle = (isMonospaced: boolean | undefined): CSSObject => ({
  fontFamily: isMonospaced ? codeFontFamily : fontFamily,
});

const borderPaddingAndHeightStyles = (minimumRows = 1): CSSObject => {
  const horizontalPaddingWithoutBorderWidth = horizontalPadding - borderWidth;
  const borderHeight = borderWidth;
  return {
    '&[data-compact]': {
      padding: `${compactVerticalPadding}px ${horizontalPaddingWithoutBorderWidth}px`,
      lineHeight: lineHeightCompact / fontSize,
      minHeight: borderBoxMinHeightCompact(minimumRows, borderHeight),
    },
    '&:not([data-compact])': {
      padding: `${verticalPadding}px ${horizontalPaddingWithoutBorderWidth}px`,
      lineHeight: lineHeightBase / fontSize,
      minHeight: borderBoxMinHeight(minimumRows, borderHeight),
    },
  };
};

const staticStyles: CSSObject = {
  flex: '1 1 100%',
  position: 'relative',
  borderRadius: borderRadius,
  boxSizing: 'border-box',
  overflow: 'auto',
  transition: `background-color ${transitionDuration} ease-in-out`,
  wordWrap: 'break-word',
  fontSize,
  borderWidth: borderWidth,
  maxWidth: '100%',
  display: 'block',
  margin: 0,
  minWidth: 0,
  outline: 'none',
  width: '100%',
  '&:disabled': {
    cursor: 'not-allowed',
    ...overrideSafariDisabledStyles,
  },

  '&::-ms-clear': {
    display: 'none',
  },

  '&:invalid': {
    boxShadow: 'none',
  },
};

export const getBaseStyles = ({
  minimumRows,
  resize,
  appearance,
  isMonospaced,
  maxHeight,
}: StyleProps): CSSObject => ({
  ...staticStyles,
  ...borderPaddingAndHeightStyles(minimumRows),
  ...resizeStyle(resize),
  ...borderStyle(appearance),
  ...fontFamilyStyle(isMonospaced),
  maxHeight,
});

export const themeStyles = (props: ThemeTokens): CSSObject => {
  return {
    ...bgAndBorderColorStyles(props),
    ...hoverBackgroundStyle(props),
    ...placeholderStyle(props.placeholderTextColor),
    color: props.textColor,
    '&:disabled': {
      color: props.disabledRules.textColor,
    },
  };
};
