/** @jsx jsx */
import React from 'react';

import { css, jsx, keyframes } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { LoadingSkeletonProps } from './types';

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  testId,
  width,
  height,
}) => {
  const animationNameStyles = keyframes({
    '0%': {
      backgroundPosition: '50% 0',
    },
    '100%': {
      backgroundPosition: '-50% 0',
    },
  });

  const styles = css({
    width: `${width}rem`,
    height: `${height}rem`,
    borderRadius: '2px',
    userSelect: 'none',
    background: token('color.skeleton.subtle', '#f6f7f8'),
    backgroundImage: `linear-gradient( to right, transparent 0%, ${token(
      'color.skeleton',
      '#edeef1',
    )} 20%, transparent 40%, transparent 100% )`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '280% 100%',
    display: 'inline-block',
    animationDuration: '1s',
    animationFillMode: 'forwards',
    animationIterationCount: 'infinite',
    animationName: animationNameStyles,
    animationTimingFunction: 'linear',
  });

  // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- needs dynamic css
  return <span css={styles} data-testid={testId} />;
};

export default LoadingSkeleton;
