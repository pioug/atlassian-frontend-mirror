import { CSSObject } from '@emotion/core';

import {
  buttonWidthUnitless,
  defaultBorderRadius,
  defaultMargin,
  defaultRoundedBorderRadius,
  defaultTextPadding,
  maxTextWidth,
  maxTextWidthUnitless,
  tagHeight,
  textFontSize,
  textMarginLeft,
  textPaddingRight,
} from '../../../constants';
import { ChromeColors, ChromeLinkColors } from '../../../types';

export const roundedBorderStyles: CSSObject = {
  borderRadius: `${defaultRoundedBorderRadius}`,
};

export const beforeElementStyles = ({
  textColor,
}: ChromeColors): CSSObject => ({
  position: 'absolute',
  left: 0,
  borderRadius: `${defaultBorderRadius}`,
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  color: textColor,
});

export const chromeStyles = ({
  backgroundColor,
  backgroundColorHover,
  textColor,
  textColorHover,
}: ChromeColors): CSSObject => ({
  backgroundColor: backgroundColor,
  color: textColor,

  '&:hover': {
    backgroundColor: backgroundColorHover,
    color: textColorHover,
  },

  '& button:hover': {
    backgroundColor: backgroundColor,
    color: textColor,
  },

  '&>span:hover': {
    backgroundColor: backgroundColor,
    color: textColor,
  },

  borderRadius: `${defaultBorderRadius}`,
  cursor: 'default',
  display: 'inline-flex',
  position: 'relative',
  height: `${tagHeight}`,
  lineHeight: 1,
  margin: `${defaultMargin}`,
  padding: 0,
  overflow: 'hidden',
});

export const chromeLinkStyles = ({
  hoverBackgroundColor,
  hoverTextColor,
  hoverBackgroundColorRemoval,
  hoverTextColorRemoval,
  focusRingColor,
}: ChromeLinkColors): CSSObject => ({
  '&>a:hover': {
    backgroundColor: hoverBackgroundColor,
    color: hoverTextColor,
  },

  '&[data-removable="true"]:hover': {
    backgroundColor: hoverBackgroundColorRemoval,
    color: hoverTextColorRemoval,
  },

  '&:focus-within': {
    boxShadow: `0 0 0 2px ${focusRingColor}`,
    outline: 'none',
  },

  '&[data-removing="true"]:focus-within': {
    boxShadow: `0 0 0 2px transparent`,
    outline: 'none',
  },
});

export const hasAfterStyles: CSSObject = {
  paddingRight: `${textPaddingRight}`,
  maxWidth: `${maxTextWidthUnitless - buttonWidthUnitless}px`,
};

export const hasBeforeStyles: CSSObject = {
  marginLeft: `${textMarginLeft}`,
};

export const textStyles: CSSObject = {
  fontSize: textFontSize,
  fontWeight: 'normal',
  lineHeight: 1,
  paddingLeft: defaultTextPadding,
  paddingRight: defaultTextPadding,
  paddingTop: '2px',
  paddingBottom: '2px',
  borderRadius: defaultBorderRadius,
  maxWidth: maxTextWidth,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const linkStyles = (linkHoverColor: string): CSSObject => ({
  ...textStyles,

  ':not([data-color="standard"])': {
    color: 'inherit',
    textDecoration: 'underline',
  },

  textDecoration: 'none',

  '&:hover': {
    color: linkHoverColor,
  },

  '&:focus': {
    outline: 'none',
  },
});
