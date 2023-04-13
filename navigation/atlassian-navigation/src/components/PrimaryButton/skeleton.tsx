/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { useTheme } from '../../theme';

import { PrimaryButtonSkeletonProps } from './types';

const paddingAll = 4;
const buttonHeight = 32;

const skeletonStyles = css({
  display: 'inline-flex',
  width: '68px',
  height: `${buttonHeight - paddingAll * 2.5}px`,
  borderRadius: token('border.radius.100', '4px'),
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
