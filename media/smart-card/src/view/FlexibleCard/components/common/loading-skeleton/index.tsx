/** @jsx jsx */
import React from 'react';

import { css, jsx, keyframes } from '@emotion/core';
import { token } from '@atlaskit/tokens';
import { LoadingSkeletonProps } from './types';

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  testId,
  width,
  height,
}) => {
  const animationWidth = width ? `${width}rem` : '20px';
  const animationNameStyles = keyframes`
    0% { background-position: -${animationWidth}  0; }
    100% { background-position: ${animationWidth} 0; }
  `;

  const styles = css`
    width: ${width}rem;
    height: ${height}rem;
    border-radius: 2px;
    user-select: none;
    background: ${token('color.skeleton.subtle', '#f6f7f8')};
    // TODO: https://product-fabric.atlassian.net/browse/DSP-4236
    background-image: linear-gradient(
      to right,
      ${token('color.skeleton.subtle', '#f6f7f8')} 0%,
      ${token('color.skeleton', '#edeef1')} 20%,
      ${token('color.skeleton.subtle', '#f6f7f8')} 40%,
      ${token('color.skeleton.subtle', '#f6f7f8')}100%
    );
    background-repeat: no-repeat;
    background-size: 280% 100%;
    display: inline-block;

    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: ${animationNameStyles};
    animation-timing-function: linear;
  `;

  return <span css={styles} data-testid={testId} />;
};

export default LoadingSkeleton;
