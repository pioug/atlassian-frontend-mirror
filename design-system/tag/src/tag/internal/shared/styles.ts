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
  textPaddingLeft,
  textPaddingRight,
} from '../../../constants';
import { ChromeColors, ChromeLinkColors, TagColor } from '../../../types';

export const roundedBorderStyles: CSSObject = {
  borderRadius: `${defaultRoundedBorderRadius}`,
};

export const beforeElementStyles: CSSObject = {
  position: 'absolute',
  left: 0,
  borderRadius: `${defaultBorderRadius}`,
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
};

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

  '&>a:hover': {
    backgroundColor: backgroundColor,
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
  hoverBackgroundColorRemoval,
  hoverTextColorRemoval,
  focusRingColor,
}: ChromeLinkColors): CSSObject => ({
  '&:hover': {
    backgroundColor: hoverBackgroundColorRemoval,
    color: hoverTextColorRemoval,
  },

  '&>a:focus': {
    boxShadow: `0 0 0 2px ${focusRingColor}`,
    outline: 'none',
  },
});

export const hasAfterStyles: CSSObject = {
  paddingRight: `${textPaddingRight}`,
  maxWidth: `${maxTextWidthUnitless - buttonWidthUnitless}px`,
};

export const hasBeforeStyles: CSSObject = {
  paddingLeft: `${textPaddingLeft}`,
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

export const linkStyles = (
  color: TagColor,
  linkHoverColor: string,
): CSSObject => ({
  ...textStyles,
  color: `${color !== 'standard' ? 'inherit' : null}`,
  textDecoration: `${color === 'standard' ? 'none' : 'underline'}`,

  '&:hover': {
    color: linkHoverColor,
  },

  '&:focus': {
    outline: 'none',
  },
});
