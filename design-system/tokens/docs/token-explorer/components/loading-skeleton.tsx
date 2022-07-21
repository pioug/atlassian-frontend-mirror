/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';

import { borderRadius } from '@atlaskit/theme/constants';

import { token } from '../../../src';

const shimmer = keyframes`
  0% { transform: translate3d(-100%,0,0); }
  100% { transform: translate3d(100%,0,0); }
`;

const skeletonStyles = css({
  display: 'block',
  backgroundColor: token('color.skeleton', '#091E420F'),
  borderRadius: borderRadius(),
  overflow: 'hidden',
  userSelect: 'none',
  ':before': {
    display: 'block',
    width: '100%',
    height: '100%',
    animationDuration: '0.8s',
    animationFillMode: 'forwards',
    animationIterationCount: 'infinite',
    animationName: shimmer,
    animationTimingFunction: 'ease-out',
    backgroundImage: `linear-gradient(
      to right,
      transparent 0%,
      ${token('color.skeleton.subtle', '#091E4208')} 50%,
      transparent 100%
    )`,
    backgroundRepeat: 'no-repeat',
    content: '""',
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
