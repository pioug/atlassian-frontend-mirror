import { css } from '@emotion/react';

import { borderRadius } from '@atlaskit/media-ui';
import { N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { akEditorSelectedBoxShadow } from '@atlaskit/editor-shared-styles/consts';

import { type CardDimensions, type CardAppearance } from '../../types';
import { getCSSUnitValue } from '../../utils/getCSSUnitValue';
import { getDefaultCardDimensions } from '../../utils/cardDimensions';
import { tickBoxClassName, tickboxFixedStyles } from './tickBox/styles';
import {
  fixedPlayButtonStyles,
  playButtonClassName,
} from './playButton/styles';

import { Breakpoint, responsiveSettings } from './common';
import { type MediaCardCursor } from '../../types';

type BreakpointSize = [Breakpoint, number];

const breakpointSizes: Array<BreakpointSize> = [
  [Breakpoint.SMALL, 599],
  [Breakpoint.LARGE, Infinity],
];

export const calcBreakpointSize = (wrapperWidth: number = 0): Breakpoint => {
  const [breakpoint] = breakpointSizes.find(
    ([_breakpoint, limit]) => wrapperWidth <= limit,
  ) || [Breakpoint.SMALL];
  return breakpoint;
};

export const generateResponsiveStyles = (
  breakpoint: Breakpoint = Breakpoint.SMALL,
) => {
  const setting = responsiveSettings[breakpoint];
  return `
    font-size: ${setting.fontSize}px;
    line-height: ${setting.lineHeight}px;
  `;
};

export const getWrapperDimensions = (
  dimensions?: CardDimensions,
  appearance?: CardAppearance,
) => {
  const { width, height } = dimensions || {};
  const { width: defaultWidth, height: defaultHeight } =
    getDefaultCardDimensions(appearance);
  return `
    width: ${getCSSUnitValue(width || defaultWidth)};
    max-width: 100%;
    height: ${getCSSUnitValue(height || defaultHeight)};
    max-height: 100%;
  `;
};

// This is a trick to simulate the blue border without affecting the dimensions.
// CSS outline has no 'radius', therefore we can't achieve the same effect with it
export const getWrapperShadow = (
  disableOverlay: boolean,
  selected: boolean,
) => {
  const withOverlayShadow = !disableOverlay
    ? `${token(
        'elevation.shadow.raised',
        `0 1px 1px ${N60A}, 0 0 1px 0 ${N60A}`,
      )}`
    : '';

  const selectedShadow = selected ? akEditorSelectedBoxShadow : '';
  const shadow = [selectedShadow, withOverlayShadow].filter(Boolean).join(', ');
  return shadow ? `box-shadow: ${shadow};` : '';
};

export const getCursorStyle = (cursor: MediaCardCursor | undefined) =>
  !!cursor ? `cursor: ${cursor};` : '';

export const getClickablePlayButtonStyles = (
  isPlayButtonClickable: boolean,
) => {
  if (!isPlayButtonClickable) {
    return '';
  }
  return `
    &:hover .${playButtonClassName} {
      ${fixedPlayButtonStyles}
    }
  `;
};

export const getSelectableTickBoxStyles = (isTickBoxSelectable: boolean) => {
  if (!isTickBoxSelectable) {
    return '';
  }
  return `
    &:hover .${tickBoxClassName} {
      ${tickboxFixedStyles}
    }
  `;
};

export const cardImageContainerStyles = css(
  {
    display: 'flex',
    position: 'relative',
    maxWidth: '100%',
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
  },
  borderRadius,
);

const defaultTransitionDuration = '.3s';

export const transition = (propertyName = 'all') => `
  transition: ${propertyName} ${defaultTransitionDuration};
`;

const hexToRgb = (hex: any) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
        result[3],
        16,
      )}`
    : null;
};

export const rgba = (hex: any, opacity: any) =>
  `rgba(${hexToRgb(hex)}, ${opacity})`;
