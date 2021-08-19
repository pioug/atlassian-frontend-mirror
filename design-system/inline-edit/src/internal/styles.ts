import { CSSObject } from '@emotion/core';

import {
  B100,
  DN50A,
  DN60A,
  N0,
  N30,
  N50A,
  N60A,
} from '@atlaskit/theme/colors';
import { borderRadius, fontSize, gridSize } from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

const spacingUnit = gridSize();
const fontSizeUnit = fontSize();

const elevations = {
  light: token('shadow.overlay', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`),
  dark: token('shadow.overlay', `0 4px 8px -2px ${DN50A}, 0 0 1px ${DN60A}`),
};

export const buttonsContainerStyles: CSSObject = {
  display: 'flex',
  flexShrink: 0,
  marginTop: spacingUnit - 2,
  position: 'absolute',
  right: 0,
  top: '100%',
};

export const getButtonWrapperStyles = (mode: ThemeModes): CSSObject => ({
  boxShadow: elevations[mode],
  backgroundColor: token('color.background.overlay', N0),
  width: spacingUnit * 4,
  zIndex: 200,
  borderRadius: spacingUnit / 2 - 1,
  boxSizing: 'border-box',
  fontSize: fontSizeUnit,

  '&:last-child': {
    marginLeft: spacingUnit / 2,
  },
});

export const editButtonStyles = {
  appearance: 'none' as const,
  background: 'transparent',
  border: 0,
  display: 'block',
  lineHeight: 1,
  margin: '0',
  padding: '0',
  outline: '0',

  '&:focus + div': {
    border: `2px solid ${token('color.border.focus', B100)}`,
  },
};

export const errorIconContainerStyles: CSSObject = {
  lineHeight: '100%',
  paddingRight: spacingUnit - 2,
};

export const readViewForTextFieldStyles: CSSObject = {
  display: 'flex',
  fontSize: fontSize(),
  lineHeight: (spacingUnit * 2.5) / fontSizeUnit,
  maxWidth: '100%',
  minHeight: `${(spacingUnit * 2.5) / fontSizeUnit}em`,

  padding: `${spacingUnit}px ${spacingUnit - 2}px`,

  '&[data-compact="true"]': {
    padding: `${spacingUnit / 2}px ${spacingUnit - 2}px`,
  },

  wordBreak: 'break-word',
};

export const readViewContainerStyles: CSSObject = {
  lineHeight: 1,
};

export const readViewWrapperStyles: CSSObject = {
  boxSizing: 'border-box',
  border: '2px solid transparent',
  borderRadius: borderRadius(),
  display: 'inline-block',
  maxWidth: '100%',
  transition: 'background 0.2s',
  width: 'auto',

  '&[data-read-view-fit-container-width="true"]': {
    width: '100%',
  },

  '&:hover': {
    background: token('color.background.transparentNeutral.hover', N30),
  },
};
