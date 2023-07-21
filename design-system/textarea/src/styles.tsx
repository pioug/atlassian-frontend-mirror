/** @jsx jsx */
import { css, CSSObject } from '@emotion/react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import {
  codeFontFamily as getCodeFontFamily,
  fontFamily as getFontFamily,
  fontSize as getFontSize,
  // eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
  gridSize,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { ThemeTokens } from './theme';
import { TextAreaProps } from './types';

export interface StyleProps {
  minimumRows: number | undefined;
  resize: string | undefined;
  appearance: string | undefined;
  isMonospaced: boolean | undefined;
  maxHeight: string;
}
const grid = gridSize();
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

const bgAndBorderColorStyles = (
  props: ThemeTokens,
  appearance: TextAreaProps['appearance'],
) =>
  css({
    '&:focus': {
      backgroundColor: props.backgroundColorFocus,
      borderColor: props.borderColorFocus,
      boxShadow: getBooleanFF(
        'platform.design-system-team.border-checkbox_nyoiu',
      )
        ? `inset 0 0 0 ${token('border.width', '1px')} ${
            props.borderColorFocus
          }`
        : undefined,
    },
    '&:not(:focus)': {
      backgroundColor: props.backgroundColor,
      borderColor: props.borderColor,
    },
    // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
    '&[data-invalid]:focus': {
      backgroundColor: props.invalidRules.backgroundColorFocus,
      borderColor: props.invalidRules.borderColorFocus,
      boxShadow: getBooleanFF(
        'platform.design-system-team.border-checkbox_nyoiu',
      )
        ? `inset 0 0 0 ${token('border.width', '1px')} ${
            props.invalidRules.borderColorFocus
          }`
        : undefined,
    },
    // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
    '&[data-invalid]:not(:focus)': {
      backgroundColor: props.invalidRules.backgroundColor,
      borderColor: props.invalidRules.borderColor,
      boxShadow: getBooleanFF(
        'platform.design-system-team.border-checkbox_nyoiu',
      )
        ? `inset 0 0 0 ${token('border.width', '1px')} ${
            props.invalidRules.borderColor
          }`
        : undefined,
    },
    // Disabled background and border styles should not be applied to components that
    // have either no background or transparent background to begin with
    ...(appearance === 'standard'
      ? {
          '&:disabled:focus': {
            backgroundColor: props.disabledRules.backgroundColorFocus,
            borderColor: props.disabledRules.borderColorFocus,
          },
          '&:disabled:not(:focus)': {
            backgroundColor: props.disabledRules.backgroundColor,
            borderColor: props.disabledRules.borderColor,
          },
        }
      : {}),
  });

const placeholderStyle = (placeholderTextColor: string) =>
  css({
    '&::placeholder': {
      color: placeholderTextColor,
    },
  });

const hoverBackgroundAndBorderStyles = (props: ThemeTokens) =>
  css({
    '&:hover:not(:read-only):not(:focus)': {
      backgroundColor: props.backgroundColorHover,
      borderColor: props.borderColorHover,
      '&:disabled': {
        backgroundColor: props.disabledRules.backgroundColorHover,
      },
      // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
      '&[data-invalid]': {
        backgroundColor: props.invalidRules.backgroundColorHover,
        borderColor: props.invalidRules.borderColor,
        boxShadow: getBooleanFF(
          'platform.design-system-team.border-checkbox_nyoiu',
        )
          ? `inset 0 0 0 ${token('border.width', '1px')} ${
              props.invalidRules.borderColor
            }`
          : undefined,
      },
    },
  });

const resizeStyle = (resize: string | undefined) => {
  if (resize === 'horizontal' || resize === 'vertical') {
    return css({ resize });
  }
  if (resize === 'auto') {
    return css({ resize: 'both' });
  }
  return css({ resize: 'none' });
};

const borderStyle = (appearance: string | undefined) =>
  css({
    borderStyle: appearance === 'none' ? 'none' : 'solid',
  });

const fontFamilyStyle = (isMonospaced: boolean | undefined) =>
  css({
    fontFamily: isMonospaced ? codeFontFamily : fontFamily,
  });

const borderPaddingAndHeightStyles = (
  minimumRows = 1,
  appearance: string | undefined,
) => {
  const borderWidth =
    getBooleanFF('platform.design-system-team.border-checkbox_nyoiu') &&
    appearance !== 'none'
      ? 1
      : 2;
  const horizontalPaddingWithoutBorderWidth = horizontalPadding - borderWidth;
  const borderHeight = borderWidth;
  return css({
    // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
    '&[data-compact]': {
      minHeight: borderBoxMinHeightCompact(minimumRows, borderHeight),
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      padding: `${compactVerticalPadding}px ${horizontalPaddingWithoutBorderWidth}px`,
      lineHeight: lineHeightCompact / fontSize,
    },
    '&:not([data-compact])': {
      minHeight: borderBoxMinHeight(minimumRows, borderHeight),
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      padding: `${verticalPadding}px ${horizontalPaddingWithoutBorderWidth}px`,
      lineHeight: lineHeightBase / fontSize,
    },
  });
};

const staticStyles = css({
  display: 'block',
  boxSizing: 'border-box',
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  margin: 0,
  position: 'relative',
  flex: '1 1 100%',
  borderRadius: token('border.radius', '3px'),
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  borderWidth: getBooleanFF('platform.design-system-team.border-checkbox_nyoiu')
    ? 1
    : borderWidth,
  fontSize: fontSize,
  outline: 'none',
  overflow: 'auto',
  transition: `background-color ${transitionDuration} ease-in-out,
               border-color ${transitionDuration} ease-in-out`,
  wordWrap: 'break-word',
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
});

export const getBaseStyles = ({
  minimumRows,
  resize,
  appearance,
  isMonospaced,
  maxHeight,
}: StyleProps) =>
  // eslint-disable-next-line @repo/internal/styles/no-exported-styles
  css([
    staticStyles,
    borderPaddingAndHeightStyles(minimumRows, appearance),
    resizeStyle(resize),
    borderStyle(appearance),
    fontFamilyStyle(isMonospaced),
    { maxHeight },
  ]);

export const themeStyles = (
  props: ThemeTokens,
  appearance: TextAreaProps['appearance'],
) =>
  // eslint-disable-next-line @repo/internal/styles/no-exported-styles
  css([
    bgAndBorderColorStyles(props, appearance),
    hoverBackgroundAndBorderStyles(props),
    placeholderStyle(props.placeholderTextColor),
    {
      color: props.textColor,
      '&:disabled': {
        color: props.disabledRules.textColor,
      },
    },
  ]);
