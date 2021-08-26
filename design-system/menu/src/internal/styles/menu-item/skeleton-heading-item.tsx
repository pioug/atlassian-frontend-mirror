import { CSSObject, keyframes } from '@emotion/core';

import { skeleton as skeletonColorFn } from '@atlaskit/theme/colors';
import {
  gridSize as gridSizeFn,
  skeletonShimmer,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import type { Dimension } from '../../../types';

import { headingItemCSS } from './heading-item';

const gridSize = gridSizeFn();

const skeletonTextBorderRadius = 100;
const skeletonHeadingHeight = gridSize;
const skeletonColor = token(
  'color.background.subtleNeutral.resting',
  skeletonColorFn(),
);

const shimmer = skeletonShimmer();
const shimmerKeyframes = keyframes(shimmer.keyframes);

export const skeletonHeadingItemCSS = (
  width?: Dimension,
  isShimmering?: boolean,
): CSSObject => ({
  ...headingItemCSS,
  '&::after': {
    // This renders the skeleton heading "text".
    backgroundColor: skeletonColor,
    ...(isShimmering && {
      ...shimmer.css,
      animationName: `${shimmerKeyframes}`,
    }),
    height: skeletonHeadingHeight,
    width: width || '30%',
    borderRadius: skeletonTextBorderRadius,
    display: 'block',
    content: '""',
  },
});
