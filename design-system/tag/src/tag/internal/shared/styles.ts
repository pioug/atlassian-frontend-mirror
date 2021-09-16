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
  activeBackgroundColor,
  backgroundColor,
  backgroundColorHover,
  textColor,
  textColorHover,
}: ChromeColors): CSSObject => ({
  backgroundColor: backgroundColor,
  color: textColor,
  pointerEvents: 'none',

  '&:hover': {
    backgroundColor: backgroundColorHover,
    color: textColorHover,
  },

  '&:active': {
    backgroundColor: activeBackgroundColor,
    color: textColorHover,
  },

  '& button:hover': {
    color: textColor,
  },

  '&>span:hover': {
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
  activeBackgroundColor,
  activeBackgroundColorRemoval,
  hoverBackgroundColor,
  hoverTextColor,
  hoverBackgroundColorRemoval,
  focusRingColor,
}: ChromeLinkColors): CSSObject => ({
  '&:hover': {
    backgroundColor: hoverBackgroundColor,
    color: hoverTextColor,
  },

  '&:active': {
    backgroundColor: activeBackgroundColor,
    color: hoverTextColor,
  },

  '&:focus-within': {
    boxShadow: `0 0 0 2px ${focusRingColor}`,
    outline: 'none',
  },

  '&[data-removing="true"]:focus-within': {
    boxShadow: `0 0 0 2px transparent`,
    outline: 'none',
  },

  '&[data-ishoverclosebutton="true"]': {
    backgroundColor: hoverBackgroundColorRemoval,
  },

  '&[data-isHoverCloseButton="true"]:active': {
    backgroundColor: activeBackgroundColorRemoval,
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
  pointerEvents: 'auto',

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
