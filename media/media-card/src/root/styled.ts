import styled from 'styled-components';
import { borderRadius } from '@atlaskit/theme/constants';
import { CardDimensions, CardAppearance } from '../';
import { getCSSUnitValue } from '../utils/getCSSUnitValue';
import { BreakpointSizeValue, breakpointStyles } from '../utils/breakpoint';
import { getSelectedBorderStyle } from '../styles/getSelectedBorderStyle';

export interface WrapperProps {
  shouldUsePointerCursor?: boolean;
  dimensions?: CardDimensions;
  appearance?: CardAppearance;
  breakpointSize?: BreakpointSizeValue;
}

const getWrapperHeight = (dimensions?: CardDimensions) =>
  dimensions && dimensions.height
    ? `height: ${getCSSUnitValue(dimensions.height)}; max-height: 100%;`
    : '';

const getWrapperWidth = (dimensions?: CardDimensions) =>
  dimensions && dimensions.width
    ? `width: ${getCSSUnitValue(dimensions.width)}; max-width: 100%;`
    : '';

export const Wrapper = styled.div`
  ${({
    dimensions,
    breakpointSize = 'medium',
    shouldUsePointerCursor,
  }: WrapperProps) => {
    return `
      ${breakpointStyles({ breakpointSize })}
      ${getWrapperHeight(dimensions)}
      ${getWrapperWidth(dimensions)}
      cursor: ${shouldUsePointerCursor ? 'pointer' : 'default'};
    `;
  }};
`;

Wrapper.displayName = 'CardViewWrapper';

export const InlinePlayerWrapper = styled.div`
  overflow: hidden;
  border-radius: ${borderRadius()};
  position: relative;

  max-width: 100%;
  max-height: 100%;

  ${getSelectedBorderStyle}

  video {
    width: 100%;
    height: 100%;
  }
`;

InlinePlayerWrapper.displayName = 'InlinePlayerWrapper';
