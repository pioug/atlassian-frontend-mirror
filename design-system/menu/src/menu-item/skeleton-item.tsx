/** @jsx jsx */
import type { CSSProperties } from 'react';

import { css, jsx } from '@emotion/core';

import noop from '@atlaskit/ds-lib/noop';
import { skeleton as skeletonColorFn } from '@atlaskit/theme/colors';
import {
  borderRadius as borderRadiusFn,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import SkeletonShimmer from '../internal/components/skeleton-shimmer';
import type { SkeletonItemProps } from '../types';

const gridSize = gridSizeFn();
const borderRadius = borderRadiusFn();
const itemElemSpacing = gridSize * 1.5;
const itemExpectedElemSize = gridSize * 3;
const itemMinHeight = gridSize * 5;
const itemPadding = gridSize * 2.5;
const skeletonItemElemSize = gridSize * 2.5;
const itemElemSkeletonOffset =
  (itemExpectedElemSize - skeletonItemElemSize) / 2;
const skeletonTextBorderRadius = 100;
const skeletonContentHeight = 9;
const skeletonColor = token('color.background.neutral', skeletonColorFn());

const skeletonStyles = css({
  display: 'flex',
  minHeight: itemMinHeight,
  padding: `0 ${itemPadding}px`,
  alignItems: 'center',
  pointerEvents: 'none',
  '::after': {
    height: skeletonContentHeight,
    // This is a little bespoke but we need to push everything down 1px
    // because the skeleton content should align to the bottom of the text.
    // Confirm VR test failures before accepting a change.
    marginTop: 1,
    backgroundColor: skeletonColor,
    borderRadius: skeletonTextBorderRadius,
    content: '""',
  },
});

const defaultWidthStyles = css({
  ':nth-of-type(1n)::after': {
    flexBasis: '70%',
  },
  ':nth-of-type(2n)::after': {
    flexBasis: '50%',
  },
  ':nth-of-type(3n)::after': {
    flexBasis: '60%',
  },
  ':nth-of-type(4n)::after': {
    flexBasis: '90%',
  },
  ':nth-of-type(5n)::after': {
    flexBasis: '35%',
  },
  ':nth-of-type(6n)::after': {
    flexBasis: '77%',
  },
});

const customWidthStyles = css({
  '::after': {
    flexBasis: 'var(--width)',
  },
});

const beforeElementStyles = css({
  '::before': {
    width: skeletonItemElemSize,
    height: skeletonItemElemSize,
    marginRight: itemElemSpacing + itemElemSkeletonOffset,
    marginLeft: itemElemSkeletonOffset,
    flexShrink: 0,
    backgroundColor: skeletonColor,
    content: '""',
  },
});

const avatarStyles = css({
  '::before': {
    borderRadius: '100%',
  },
});

const iconStyles = css({
  '::before': {
    borderRadius,
  },
});

/**
 * __Skeleton item__
 *
 * A skeleton item is used in place of an item when its contents it not ready.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/skeleton-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const SkeletonItem = ({
  hasAvatar,
  hasIcon,
  isShimmering = false,
  testId,
  width,
  cssFn = noop as any,
}: SkeletonItemProps) => (
  <SkeletonShimmer isShimmering={isShimmering}>
    {({ className }) => (
      <div
        className={className}
        style={
          {
            '--width': width,
          } as CSSProperties
        }
        css={[
          skeletonStyles,
          (hasAvatar || hasIcon) && beforeElementStyles,
          hasAvatar && avatarStyles,
          hasIcon && iconStyles,
          width ? customWidthStyles : defaultWidthStyles,
          // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
          cssFn(),
        ]}
        data-testid={testId}
      />
    )}
  </SkeletonShimmer>
);

export default SkeletonItem;
