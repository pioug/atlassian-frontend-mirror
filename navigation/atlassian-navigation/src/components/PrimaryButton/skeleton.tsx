/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import { buttonHeight, gridSize } from '../../common/constants';
import { useTheme } from '../../theme';

import { PrimaryButtonSkeletonProps } from './types';

const paddingAll = gridSize / 2;

const skeletonStyles = css({
  display: 'inline-flex',
  width: '68px',
  height: `${buttonHeight - paddingAll * 2.5}px`,
  borderRadius: `${gridSize / 2}px`,
  opacity: 0.15,
});

// Not exported to consumers, only used in NavigationSkeleton
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const PrimaryButtonSkeleton = (props: PrimaryButtonSkeletonProps) => {
  const theme = useTheme();

  return (
    <div
      style={theme.mode.skeleton as React.CSSProperties}
      css={skeletonStyles}
      className={props.className}
    />
  );
};
