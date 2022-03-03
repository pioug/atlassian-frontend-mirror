/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { gridSize } from '../../common/constants';
import { useTheme } from '../../theme';

import { IconButtonSkeletonProps } from './types';

const buttonHeight = gridSize * 4;

const skeletonStyles = css({
  borderRadius: '50%',
  opacity: 0.15,
});

export const IconButtonSkeleton = ({
  className,
  marginLeft,
  marginRight,
  size,
}: IconButtonSkeletonProps) => {
  const theme = useTheme();

  const dynamicStyles = {
    marginLeft: typeof marginLeft === 'number' ? marginLeft : gridSize / 2,
    marginRight: typeof marginRight === 'number' ? marginRight : 0,
    width: typeof size === 'number' ? size : buttonHeight,
    height: typeof size === 'number' ? size : buttonHeight,
    ...theme.mode.skeleton,
  };

  return (
    <div
      className={className}
      style={dynamicStyles as React.CSSProperties}
      css={skeletonStyles}
    />
  );
};
