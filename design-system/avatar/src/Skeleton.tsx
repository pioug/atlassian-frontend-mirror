/** @jsx jsx */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { FC } from 'react';

import { CSSObject, jsx } from '@emotion/core';

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

const getStyles = ({
  size = 'medium',
  appearance = 'circle',
  color = 'currentColor',
  weight = 'normal',
}: SkeletonProps): CSSObject => ({
  width: `${AVATAR_SIZES[size]}px`,
  height: `${AVATAR_SIZES[size]}px`,
  display: 'inline-block',
  borderRadius: `${
    appearance === 'square' ? `${AVATAR_RADIUS[size]}px` : '50%'
  }`,
  backgroundColor: color,
  border: `${BORDER_WIDTH}px solid transparent`,
  opacity: `${weight === 'strong' ? 0.3 : 0.15}`,
});

/**
 * __Skeleton__
 *
 * A skeleton is the loading state for the avatar component.
 *
 * - [Examples](https://atlassian.design/components/avatar/avatar-skeleton/examples)
 * - [Code](https://atlassian.design/components/avatar/avatar-skeleton/code)
 */
const Skeleton: FC<SkeletonProps> = ({
  size,
  appearance,
  color,
  weight,
}: SkeletonProps) => (
  <div
    // TODO: Refactor styles to follow css prop rules
    // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
    css={getStyles({
      size,
      appearance,
      color,
      weight,
    })}
  />
);

export default Skeleton;
