/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { memo, FC } from 'react';

import { sizes } from '../constants';
import { sizeOpts } from '../types';

export type SkeletonProps = {
  /* Sets the color of the skeleton. By default it will inherit the current text color. */
  color?: string;
  /* Controls the size of the skeleton */
  size?: sizeOpts;
  /* Determines the opacity of the skeleton */
  weight?: 'normal' | 'strong';
  /** A unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
};

const Skeleton: FC<SkeletonProps> = ({
  testId,
  size = 'medium',
  color = 'currentColor',
  weight = 'normal',
}) => (
  <div
    data-testid={testId}
    css={css`
      width: ${sizes[size]};
      height: ${sizes[size]};
      display: inline-block;
      border-radius: 50%;
      background-color: ${color};
      opacity: ${weight === 'strong' ? 0.3 : 0.15};
    `}
  />
);
export default memo(Skeleton);
