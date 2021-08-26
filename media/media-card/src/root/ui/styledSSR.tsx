import styled from 'styled-components';

import { akEditorSelectedBoxShadow } from '@atlaskit/editor-shared-styles/consts';
import { N20, N60A } from '@atlaskit/theme/colors';
import { fontFamily } from '@atlaskit/theme/constants';
import { hideNativeBrowserTextSelectionStyles } from '@atlaskit/editor-shared-styles/selection';
import { borderRadius } from '@atlaskit/media-ui';

import { CardDimensions, CardAppearance } from '../..';
import { transition } from '../../styles';
import { getDefaultCardDimensions } from '../../utils/cardDimensions';
import { getCSSUnitValue } from '../../utils/getCSSUnitValue';

import { fixedBlanketStyles, blanketClassName } from './blanket/styled';
import { responsiveSettings } from './common';
import { Breakpoint } from './Breakpoint';

export interface BaseNewFileExperienceWrapperProps {
  breakpoint: Breakpoint;
  dimensions?: CardDimensions;
  appearance?: CardAppearance;
  shouldUsePointerCursor: boolean;
  displayBackground: boolean;
  disableOverlay: boolean;
  selected: boolean;
}

export const SSRFileExperienceWrapper = styled.div`
  ${({
    breakpoint,
    dimensions,
    appearance,
    shouldUsePointerCursor,
    displayBackground,
    disableOverlay,
    selected,
  }: BaseNewFileExperienceWrapperProps) => `
  ${transition()}
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  position: relative;
  font-family: ${fontFamily()};
  ${getWrapperDimensions(dimensions, appearance)}
  ${displayBackground ? `background-color: ${N20};` : ''}
  ${borderRadius}
  ${getCursorStyle(shouldUsePointerCursor)}
  ${generateResponsiveStyles(breakpoint)}
  ${hideNativeBrowserTextSelectionStyles}
  ${getWrapperShadow(disableOverlay, selected)}
  `}
  &:hover .${blanketClassName} {
    ${fixedBlanketStyles}
  }
`;
SSRFileExperienceWrapper.displayName = 'SSRFileExperienceWrapper';

export const getWrapperDimensions = (
  dimensions?: CardDimensions,
  appearance?: CardAppearance,
) => {
  const { width, height } = dimensions || {};
  const {
    width: defaultWidth,
    height: defaultHeight,
  } = getDefaultCardDimensions(appearance);
  return `
    width: ${getCSSUnitValue(width || defaultWidth)};
    max-width: 100%;
    height: ${getCSSUnitValue(height || defaultHeight)};
    max-height: 100%;
  `;
};

const generateResponsiveStyles = (
  breakpoint: Breakpoint = Breakpoint.SMALL,
) => {
  const setting = responsiveSettings[breakpoint];
  return `
    font-size: ${setting.fontSize}px;
    line-height: ${setting.lineHeight}px;
  `;
};

const getCursorStyle = (shouldUsePointerCursor: boolean) =>
  `cursor: ${shouldUsePointerCursor ? 'pointer' : 'default'};`;

// This is a trick to simulate the blue border without affecting the dimensions.
// CSS outline has no 'radius', therefore we can't achieve the same effect with it
const getWrapperShadow = (disableOverlay: boolean, selected: boolean) => {
  const withOverlayShadow = !disableOverlay
    ? `0 1px 1px ${N60A}, 0 0 1px 0 ${N60A}`
    : '';
  const selectedShadow = selected ? akEditorSelectedBoxShadow : '';
  const shadow = [selectedShadow, withOverlayShadow].filter(Boolean).join(', ');
  return shadow ? `box-shadow: ${shadow};` : '';
};

export const CardImageContainer = styled.div`
  display: flex;
  position: relative;
  max-width: 100%;
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  ${borderRadius}
`;

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
