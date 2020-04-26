/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';

import { SkeletonHeadingItemProps } from '../types';

import { skeletonHeadingItemCSS } from './styles';

const SkeletonHeadingItem = ({
  width,
  testId,
  isShimmering,
  cssFn = (currentStyles: CSSObject) => currentStyles,
}: SkeletonHeadingItemProps) => (
  <div
    css={cssFn(skeletonHeadingItemCSS(width, isShimmering), undefined)}
    data-testid={testId}
  />
);

export default SkeletonHeadingItem;
