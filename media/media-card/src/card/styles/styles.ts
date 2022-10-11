import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import { CardDimensions } from '../../types';
import { getCSSUnitValue } from '../../utils/getCSSUnitValue';
import { breakpointStyles } from '../../utils/breakpoint';
import { getSelectedBorderStyle } from './getSelectedBorderStyle';
import { getDimensionsWithDefault } from '../../utils/lightCards/getDimensionsWithDefault';
import { InlinePlayerWrapperProps, WrapperProps } from '../types';

export const inlinePlayerClassName = 'media-card-inline-player';

const getWrapperHeight = (dimensions?: CardDimensions) =>
  dimensions && dimensions.height
    ? `height: ${getCSSUnitValue(dimensions.height)}; max-height: 100%;`
    : '';

const getWrapperWidth = (dimensions?: CardDimensions) =>
  dimensions && dimensions.width
    ? `width: ${getCSSUnitValue(dimensions.width)}; max-width: 100%;`
    : '';

export const wrapperStyles = ({
  dimensions,
  breakpointSize = 'medium',
  shouldUsePointerCursor,
}: WrapperProps) => css`
  ${breakpointStyles({ breakpointSize })}
  ${getWrapperHeight(dimensions)}
      ${getWrapperWidth(
    dimensions,
  )}
  cursor: ${shouldUsePointerCursor ? 'pointer' : 'default'};
`;

wrapperStyles.displayName = 'CardViewWrapper';

export const inlinePlayerWrapperStyles = ({
  dimensions,
  selected,
}: InlinePlayerWrapperProps) => css`
  width: ${getDimensionsWithDefault(dimensions).width || '100%'};
  height: ${getDimensionsWithDefault(dimensions).height || 'auto'};
  overflow: hidden;
  border-radius: ${borderRadius()}px;
  position: relative;
  max-width: 100%;
  max-height: 100%;

  ${getSelectedBorderStyle(selected)}

  video {
    width: 100%;
    height: 100%;
  }
`;

inlinePlayerWrapperStyles.displayName = 'InlinePlayerWrapper';
