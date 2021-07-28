/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { memo } from 'react';

import type { SkeletonProps } from '../types';
import { sizeStyleMap } from './styles';

const skeletonStyles = css({
  display: 'inline-block',
  borderRadius: '50%',
});

const subtleOpacityStyles = css({
  opacity: 0.15,
});

const strongOpacityStyles = css({
  opacity: 0.3,
});

/**
 * __Skeleton__
 */
const Skeleton = memo(function Skeleton({
  testId,
  size = 'medium',
  color = 'currentColor',
  weight = 'normal',
}: SkeletonProps) {
  return (
    <div
      data-testid={testId}
      style={{ backgroundColor: color }}
      css={[
        skeletonStyles,
        weight === 'strong' ? strongOpacityStyles : subtleOpacityStyles,
        sizeStyleMap[size],
      ]}
    />
  );
});

export default Skeleton;
