/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/core';

import { skeletonItemCSS } from '../internal/styles/menu-item/skeleton-item';
import type { SkeletonItemProps } from '../types';

/**
 * __Skeleton item__
 *
 * A skeleton item is used in place of an item when its contents it not ready.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/skeleton-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const SkeletonItem = memo(
  ({
    hasAvatar,
    hasIcon,
    width,
    testId,
    isShimmering,
    cssFn = () => ({}),
  }: SkeletonItemProps) => (
    <div
      css={[
        // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
        skeletonItemCSS(hasAvatar, hasIcon, width, isShimmering),
        // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
        cssFn(undefined),
      ]}
      data-testid={testId}
    />
  ),
);

export default SkeletonItem;
