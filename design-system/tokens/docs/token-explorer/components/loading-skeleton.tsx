/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';

import { borderRadius } from '@atlaskit/theme/constants';

import { token } from '../../../src';

const shimmer = keyframes`
  0% { transform: translate3d(-100%,0,0); }
  100% { transform: translate3d(100%,0,0); }
`;

const skeletonStyles = css({
  borderRadius: borderRadius(),
  userSelect: 'none',
  backgroundColor: token('color.skeleton', '#091E420F'),
  display: 'block',
  overflow: 'hidden',

  ':before': {
    content: '""',
    height: '100%',
    width: '100%',
    display: 'block',

    backgroundImage: `linear-gradient(
      to right,
      transparent 0%,
      ${token('color.skeleton.subtle', '#091E4208')} 50%,
      transparent 100%
    )`,
    backgroundRepeat: 'no-repeat',

    animationName: shimmer,
    animationDuration: '0.8s',
    animationFillMode: 'forwards',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-out',
  },
});

interface LoadingSkeletonProps {
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  className?: string;
}

const LoadingSkeleton = ({
  width = '100%',
  height = 30,
  className,
}: LoadingSkeletonProps) => (
  <span className={className} css={[skeletonStyles, { width, height }]} />
);

export default LoadingSkeleton;
