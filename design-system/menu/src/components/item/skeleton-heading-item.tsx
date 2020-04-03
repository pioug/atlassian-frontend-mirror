/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/core';

import { skeletonHeadingItemCSS } from './styles';
import { SkeletonHeadingItemProps } from '../types';

const SkeletonHeadingItem = ({
  width,
  testId,
  isShimmering,
  cssFn = (currentStyles: CSSObject) => currentStyles,
}: SkeletonHeadingItemProps) => (
  <div
    css={cssFn(skeletonHeadingItemCSS(width, isShimmering))}
    data-testid={testId}
  />
);

export default SkeletonHeadingItem;
