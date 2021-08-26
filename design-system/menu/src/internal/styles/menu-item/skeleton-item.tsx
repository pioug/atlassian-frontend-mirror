import { CSSObject, keyframes } from '@emotion/core';

import { skeleton as skeletonColorFn } from '@atlaskit/theme/colors';
import {
  borderRadius as borderRadiusFn,
  gridSize as gridSizeFn,
  skeletonShimmer,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { baseItemCSS } from './base-item';

const gridSize = gridSizeFn();
const borderRadius = borderRadiusFn();

const itemElemSpacing = gridSize * 1.5;
const itemExpectedElemSize = gridSize * 3;
const itemMinHeight = gridSize * 5;

const skeletonItemElemSize = gridSize * 2.5;
const itemElemSkeletonOffset =
  (itemExpectedElemSize - skeletonItemElemSize) / 2;
const skeletonTextBorderRadius = 100;
const skeletonContentHeight = 9;
const skeletonColor = token(
  'color.background.subtleNeutral.resting',
  skeletonColorFn(),
);

const shimmer = skeletonShimmer();
const shimmerKeyframes = keyframes(shimmer.keyframes);

export const skeletonItemCSS = (
  hasAvatar?: boolean,
  hasIcon?: boolean,
  width?: string | number,
  isShimmering?: boolean,
): CSSObject => ({
  ...baseItemCSS(false, false),
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  minHeight: itemMinHeight,

  // Stagger alternate skeleton items if no width is passed
  ...(!width && {
    '&:nth-child(1n)::after': {
      flexBasis: '70%',
    },
    '&:nth-child(2n)::after': {
      flexBasis: '50%',
    },
    '&:nth-child(3n)::after': {
      flexBasis: '60%',
    },
    '&:nth-child(4n)::after': {
      flexBasis: '90%',
    },
    '&:nth-child(5n)::after': {
      flexBasis: '35%',
    },
    '&:nth-child(6n)::after': {
      flexBasis: '77%',
    },
  }),

  ...((hasAvatar || hasIcon) && {
    '&::before': {
      // This will render a skeleton in the "elemBefore" position.
      content: '""',
      backgroundColor: skeletonColor,
      ...(isShimmering && {
        ...shimmer.css,
        animationName: `${shimmerKeyframes}`,
      }),
      marginRight: itemElemSpacing + itemElemSkeletonOffset,
      width: skeletonItemElemSize,
      height: skeletonItemElemSize,
      marginLeft: itemElemSkeletonOffset,
      borderRadius: hasAvatar ? '100%' : borderRadius,
      flexShrink: 0,
    },
  }),

  '&::after': {
    // This will render the skeleton "text".
    content: '""',
    backgroundColor: skeletonColor,
    ...(isShimmering && {
      ...shimmer.css,
      animationName: `${shimmerKeyframes}`,
    }),
    // This is a little bespoke but we need to push everything down 1px
    //  because the skeleton content should align to the bottom of the text.
    // Confirm VR test failures before accepting a change.
    marginTop: 1,
    height: skeletonContentHeight,
    borderRadius: skeletonTextBorderRadius,
    flexBasis: width || '100%',
  },
});
