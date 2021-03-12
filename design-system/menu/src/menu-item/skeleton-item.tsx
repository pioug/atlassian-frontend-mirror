/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/core';

import { skeletonItemCSS } from '../internal/styles/menu-item/skeleton-item';
import type { SkeletonItemProps } from '../types';

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
        skeletonItemCSS(hasAvatar, hasIcon, width, isShimmering),
        cssFn(undefined),
      ]}
      data-testid={testId}
    />
  ),
);

export default SkeletonItem;
