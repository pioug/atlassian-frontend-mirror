import styled from 'styled-components';
import { borderRadius } from '@atlaskit/theme/constants';
import { CardDimensions } from '../';
import { getCSSUnitValue } from '../utils/getCSSUnitValue';
import { BreakpointSizeValue, breakpointStyles } from '../utils/breakpoint';
import { getSelectedBorderStyle } from '../styles/getSelectedBorderStyle';
import { getDimensionsWithDefault } from '../utils/lightCards/getDimensionsWithDefault';

export interface WrapperProps {
  shouldUsePointerCursor?: boolean;
  dimensions?: CardDimensions;
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

type InlinePlayerWrapper = {
  dimensions?: CardDimensions;
  selected?: boolean;
};

export const InlinePlayerWrapper = styled.div<InlinePlayerWrapper>`
  width: ${(props) =>
    getDimensionsWithDefault(props.dimensions).width || '100%'};
  height: ${(props) =>
    getDimensionsWithDefault(props.dimensions).height || 'auto'};
  overflow: hidden;
  border-radius: ${borderRadius()}px;
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
