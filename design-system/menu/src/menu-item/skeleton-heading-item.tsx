/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/core';

import { skeletonHeadingItemCSS } from '../internal/styles/menu-item/skeleton-heading-item';
import type { SkeletonHeadingItemProps } from '../types';

const SkeletonHeadingItem = memo(
  ({
    width,
    testId,
    isShimmering,
    cssFn = () => ({}),
  }: SkeletonHeadingItemProps) => (
    <div
      css={[skeletonHeadingItemCSS(width, isShimmering), cssFn(undefined)]}
      data-ds--menu--skeleton-heading-item
      data-testid={testId}
    />
  ),
);

export default SkeletonHeadingItem;
