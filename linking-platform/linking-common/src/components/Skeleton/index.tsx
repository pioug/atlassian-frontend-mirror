import React from 'react';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import { B50, N30, N40, N50, N60 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { type SkeletonProps } from './types';

const placeholderShimmer = keyframes({
  '0%': {
    backgroundPosition: '-20px 0',
  },
  '100%': {
    backgroundPosition: '60px 0',
  },
});

const appearanceValues = {
  darkGray: {
    background: token('color.background.accent.gray.subtler', N50),
    animation: token('color.background.accent.gray.subtle', N60),
  },
  gray: {
    background: token('color.background.accent.gray.subtlest', N30),
    animation: token('color.skeleton', N40),
  },
  blue: {
    background: token('color.background.accent.blue.subtlest', B50),
    animation: token('color.background.information.hovered', '#cce0ff'),
  },
};

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ShimmerSkeleton = styled.div<SkeletonProps>`
  height: ${({ height }) => height || 'auto'};
  width: ${({ width }) => width || 'auto'};
  border-radius: ${({ borderRadius }) => borderRadius || 0};
  user-select: none;
  background: ${({ appearance = 'gray' }) =>
    appearanceValues[appearance].background};

  background-image: ${({ appearance = 'gray' }) => `linear-gradient(
    to right,
    transparent 0%,
   ${appearanceValues[appearance].animation} 20%,
    transparent 40%,
    transparent 100%
  )`};
  background-repeat: no-repeat;
  background-size: ${({ height, isShimmering }) =>
    isShimmering ? `40px ${height};` : '0px'};

  animation: ${placeholderShimmer} 1s linear infinite forwards;
`;

export const Skeleton = ({
  width,
  appearance = 'gray',
  height = 14,
  borderRadius = 0,
  isShimmering = true,
  testId,
  style = {},
}: SkeletonProps) => (
  <ShimmerSkeleton
    width={typeof width === 'number' ? `${width}px` : width}
    height={typeof height === 'number' ? `${height}px` : height}
    borderRadius={
      typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius
    }
    appearance={appearance}
    isShimmering={isShimmering}
    data-testid={testId}
    style={style}
  />
);

export default Skeleton;
