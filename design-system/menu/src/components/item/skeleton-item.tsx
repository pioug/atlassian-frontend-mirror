/** @jsx jsx */
import { jsx } from '@emotion/core';

import { SkeletonItemProps } from '../types';

import { itemSkeletonCSS } from './styles';

const SkeletonItem = ({
  hasAvatar,
  hasIcon,
  width,
  testId,
  isShimmering,
  cssFn = () => ({}),
}: SkeletonItemProps) => (
  <div
    css={[
      itemSkeletonCSS(hasAvatar, hasIcon, width, isShimmering),
      cssFn(undefined),
    ]}
    data-testid={testId}
  />
);

export default SkeletonItem;
