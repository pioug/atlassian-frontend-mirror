/** @jsx jsx */

import { FC } from 'react';

import { css, jsx } from '@emotion/core';

import { AVATAR_RADIUS, AVATAR_SIZES, BORDER_WIDTH } from './constants';
import { AppearanceType, SizeType } from './types';

export interface SkeletonProps {
  /* Skeleton shape */
  appearance?: AppearanceType;
  /* Color of the skeleton. By default, it will inherit the current text color. */
  color?: string;
  /* Skeleton size */
  size?: SizeType;
  /* Skeleton opacity */
  weight?: 'normal' | 'strong';
}

const Skeleton: FC<SkeletonProps> = ({
  size = 'medium',
  appearance = 'circle',
  color = 'currentColor',
  weight = 'normal',
}: SkeletonProps) => (
  <div
    css={css`
      width: ${AVATAR_SIZES[size]}px;
      height: ${AVATAR_SIZES[size]}px;
      display: inline-block;
      border-radius: ${appearance === 'square'
        ? `${AVATAR_RADIUS[size]}px`
        : '50%'};
      background-color: ${color};
      border: ${BORDER_WIDTH}px solid transparent;
      opacity: ${weight === 'strong' ? 0.3 : 0.15};
    `}
  />
);

export default Skeleton;
