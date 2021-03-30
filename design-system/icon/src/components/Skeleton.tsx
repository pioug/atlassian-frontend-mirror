/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { memo, FC } from 'react';

import { sizes } from '../constants';
import { SkeletonProps } from '../types';

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
