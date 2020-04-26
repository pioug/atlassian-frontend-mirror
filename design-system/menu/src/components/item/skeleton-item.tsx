/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';

import { SkeletonItemProps } from '../types';

import { itemSkeletonCSS } from './styles';

const SkeletonItem = ({
  hasAvatar,
  hasIcon,
  width,
  testId,
  isShimmering,
  cssFn = (currentStyles: CSSObject) => currentStyles,
}: SkeletonItemProps) => (
  <div
    css={cssFn(
      itemSkeletonCSS(hasAvatar, hasIcon, width, isShimmering),
      undefined,
    )}
    data-testid={testId}
  />
);

export default SkeletonItem;
