/** @jsx jsx */
import type { CSSProperties } from 'react';

import { css, jsx } from '@emotion/react';

import { propDeprecationWarning } from '@atlaskit/ds-lib/deprecation-warning';
import noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { N20A } from '@atlaskit/theme/colors';
import {
  borderRadius as borderRadiusFn,
  // eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
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
const skeletonItemElemSize = gridSize * 2.5;
const itemElemSkeletonOffset =
  (itemExpectedElemSize - skeletonItemElemSize) / 2;
const skeletonTextBorderRadius = 100;
const skeletonContentHeight = 9;
const skeletonColor = token('color.skeleton', N20A);

const skeletonStyles = css({
  display: 'flex',
  minHeight: itemMinHeight,
  padding: `0 ${token('space.250', '20px')}`,
  alignItems: 'center',
  pointerEvents: 'none',
  '::after': {
    height: skeletonContentHeight,
    backgroundColor: skeletonColor,
    borderRadius: skeletonTextBorderRadius,
    content: '""',
    // This is a little bespoke but we need to push everything down 1px
    // because the skeleton content should align to the bottom of the text.
    // Confirm VR test failures before accepting a change.
    marginBlockStart: 1,
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
    flexShrink: 0,
    backgroundColor: skeletonColor,
    content: '""',
    marginInlineEnd: itemElemSpacing + itemElemSkeletonOffset,
    marginInlineStart: token('space.025', '2px'),
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
}: SkeletonItemProps) => {
  propDeprecationWarning(
    process.env._PACKAGE_NAME_ || '',
    'cssFn',
    cssFn !== (noop as any),
    '', // TODO: Create DAC post when primitives/xcss are available as alternatives
  );

  const UNSAFE_overrides = getBooleanFF(
    'platform.design-system-team.unsafe-overrides-killswitch_c8j9m',
  )
    ? undefined
    : css(cssFn());

  return (
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
            // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
            UNSAFE_overrides,
          ]}
          data-testid={testId}
        />
      )}
    </SkeletonShimmer>
  );
};

export default SkeletonItem;
