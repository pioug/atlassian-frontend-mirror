/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/core';

import { SkeletonHeadingItemProps } from '../types';

import { skeletonHeadingItemCSS } from './styles';

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
