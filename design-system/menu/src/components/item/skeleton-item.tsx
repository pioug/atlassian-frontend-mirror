/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/core';

import { itemSkeletonCSS } from './styles';
import { SkeletonItemProps } from '../types';

const SkeletonItem = ({
  hasAvatar,
  hasIcon,
  width,
  testId,
  isShimmering,
  cssFn = (currentStyles: CSSObject) => currentStyles,
}: SkeletonItemProps) => (
  <div
    css={cssFn(itemSkeletonCSS(hasAvatar, hasIcon, width, isShimmering))}
    data-testid={testId}
  />
);

export default SkeletonItem;
