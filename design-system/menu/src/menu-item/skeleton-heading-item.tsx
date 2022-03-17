/** @jsx jsx */
import type { CSSProperties } from 'react';

import { css, jsx } from '@emotion/core';

import noop from '@atlaskit/ds-lib/noop';
import { skeleton as skeletonColorFn } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import SkeletonShimmer from '../internal/components/skeleton-shimmer';
import type { SkeletonHeadingItemProps } from '../types';

const skeletonStyles = css({
  padding: `0 ${gridSize() * 2.5}px`,
  '::after': {
    display: 'block',
    width: '30%',
    height: gridSize(),
    backgroundColor: token('color.background.neutral', skeletonColorFn()),
    borderRadius: 100,
    content: '""',
  },
});

const defaultWidthStyles = css({
  '::after': {
    width: '30%',
  },
});

const customWidthStyles = css({
  '::after': {
    width: 'var(--width)',
  },
});

/**
 * __Skeleton heading item__
 *
 * A skeleton heading item is used in place of a heading item when its contents it not ready.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/skeleton-heading-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const SkeletonHeadingItem = ({
  isShimmering = false,
  testId,
  width,
  cssFn = noop as any,
}: SkeletonHeadingItemProps) => (
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
          width ? customWidthStyles : defaultWidthStyles,
          // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
          cssFn(undefined),
        ]}
        data-ds--menu--skeleton-heading-item
        data-testid={testId}
      />
    )}
  </SkeletonShimmer>
);

export default SkeletonHeadingItem;
