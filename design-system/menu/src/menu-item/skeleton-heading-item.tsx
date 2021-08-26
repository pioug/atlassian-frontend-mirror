/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/core';

import { skeletonHeadingItemCSS } from '../internal/styles/menu-item/skeleton-heading-item';
import type { SkeletonHeadingItemProps } from '../types';

/**
 * __Skeleton heading item__
 *
 * A skeleton heading item is used in place of a heading item when its contents it not ready.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/skeleton-heading-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const SkeletonHeadingItem = memo(
  ({
    width,
    testId,
    isShimmering,
    cssFn = () => ({}),
  }: SkeletonHeadingItemProps) => (
    <div
      // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
      css={[skeletonHeadingItemCSS(width, isShimmering), cssFn(undefined)]}
      data-ds--menu--skeleton-heading-item
      data-testid={testId}
    />
  ),
);

export default SkeletonHeadingItem;
