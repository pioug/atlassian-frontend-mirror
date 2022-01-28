import styled from 'styled-components';
import { CardDimensions, CardAppearance } from '../..';
import { getCSSUnitValue } from '../../utils/getCSSUnitValue';
import { getDefaultCardDimensions } from '../../utils/cardDimensions';
import { fontFamily } from '@atlaskit/theme/constants';
import { borderRadius } from '@atlaskit/media-ui';
import { N20, N60A } from '@atlaskit/theme/colors';
import { akEditorSelectedBoxShadow } from '@atlaskit/editor-shared-styles/consts';
import { hideNativeBrowserTextSelectionStyles } from '@atlaskit/editor-shared-styles/selection';
import { transition } from '../../styles';
import { tickBoxClassName, tickboxFixedStyles } from './tickBox/styled';
import { fixedBlanketStyles, blanketClassName } from './blanket/styled';
import { fixedActionBarStyles, actionsBarClassName } from './actionsBar/styled';
import {
  fixedPlayButtonStyles,
  playButtonClassName,
} from './playButton/styled';

import { Breakpoint, responsiveSettings } from './common';

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

const generateResponsiveStyles = (
  breakpoint: Breakpoint = Breakpoint.SMALL,
) => {
  const setting = responsiveSettings[breakpoint];
  return `
    font-size: ${setting.fontSize}px;
    line-height: ${setting.lineHeight}px;
  `;
};

const getWrapperDimensions = (
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

const getCursorStyle = (shouldUsePointerCursor: boolean) =>
  `cursor: ${shouldUsePointerCursor ? 'pointer' : 'default'};`;

const getClickablePlayButtonStyles = (isPlayButtonClickable: boolean) => {
  if (!isPlayButtonClickable) {
    return '';
  }
  return `
    &:hover .${playButtonClassName} {
      ${fixedPlayButtonStyles}
    }
  `;
};

const getSelectableTickBoxStyles = (isTickBoxSelectable: boolean) => {
  if (!isTickBoxSelectable) {
    return '';
  }
  return `
    &:hover .${tickBoxClassName} {
      ${tickboxFixedStyles}
    }
  `;
};
export interface NewFileExperienceWrapperProps {
  breakpoint: Breakpoint;
  dimensions?: CardDimensions;
  appearance?: CardAppearance;
  mediaType?: string;
  shouldUsePointerCursor: boolean;
  disableOverlay: boolean;
  displayBackground: boolean;
  selected: boolean;
  isPlayButtonClickable: boolean;
  isTickBoxSelectable: boolean;
  shouldDisplayTooltip: boolean;
}

export const NewFileExperienceWrapper = styled.div`
  ${({
    breakpoint,
    dimensions,
    appearance,
    shouldUsePointerCursor,
    disableOverlay,
    displayBackground,
    selected,
    isPlayButtonClickable,
    isTickBoxSelectable,
    shouldDisplayTooltip,
  }: NewFileExperienceWrapperProps) => `
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
    ${getWrapperShadow(disableOverlay, selected)}
    ${generateResponsiveStyles(breakpoint)}
    ${hideNativeBrowserTextSelectionStyles}

    /* We use classnames from here exceptionally to be able to handle styles when the Card is on hover */
    ${getClickablePlayButtonStyles(isPlayButtonClickable)}
    ${getSelectableTickBoxStyles(isTickBoxSelectable)}
    &:hover .${blanketClassName} {
      ${fixedBlanketStyles}
    }

    &:hover .${actionsBarClassName} {
      ${fixedActionBarStyles}
    }

    /* Tooltip does not support percentage dimensions. We enforce them here */
    ${shouldDisplayTooltip ? `> div { width: 100%; height: 100% }` : ''}
`}
`;

NewFileExperienceWrapper.displayName = 'NewFileExperienceWrapper';

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
