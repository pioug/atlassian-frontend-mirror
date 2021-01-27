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

const spacingUnit = gridSize();
const fontSizeUnit = fontSize();

const elevations = {
  light: [N50A, N60A],
  dark: [DN50A, DN60A],
};

const getElevationStyleForMode = (mode: ThemeModes): CSSObject => {
  const colors = elevations[mode];
  return {
    boxShadow: `0 4px 8px -2px ${colors[0]}, 0 0 1px ${colors[1]}`,
  };
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
  ...getElevationStyleForMode(mode),
  backgroundColor: N0,
  borderRadius: spacingUnit / 2 - 1,
  boxSizing: 'border-box',
  fontSize: fontSizeUnit,
  width: spacingUnit * 4,
  zIndex: 200,

  '&:last-child': {
    marginLeft: spacingUnit / 2,
  },
});

export const editButtonStyles = {
  appearance: 'none' as const,
  background: 'transparent',
  border: 0,
  display: 'inline-block',
  lineHeight: 1,
  margin: '0',
  padding: '0',
  outline: '0',

  '&:focus + div': {
    border: `2px solid ${B100}`,
    background: N0,
  },
};

export const errorIconContainerStyles: CSSObject = {
  lineHeight: '100%',
  paddingRight: spacingUnit - 2,
};

export const readViewContainerStyles: CSSObject = {
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

export const readViewContentWrapperStyles: CSSObject = {
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
    background: N30,
  },
};
