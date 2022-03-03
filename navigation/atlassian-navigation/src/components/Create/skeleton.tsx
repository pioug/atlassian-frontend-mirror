/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/core';

import { CREATE_BREAKPOINT, gridSize } from '../../common/constants';
import { useTheme } from '../../theme';
import { IconButtonSkeleton } from '../IconButton/skeleton';

const buttonHeight = gridSize * 4;

const skeletonStyles = css({
  width: 68,
  height: buttonHeight,
  marginLeft: 12,
  borderRadius: 3,
  opacity: 0.15,
});

const mobileStyles = css({
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  [`@media (max-width: ${CREATE_BREAKPOINT - 1}px)`]: {
    display: 'none !important',
  },
});

export const CreateSkeleton = () => {
  const theme = useTheme();
  return (
    <Fragment>
      <div
        style={theme.mode.skeleton as React.CSSProperties}
        css={[skeletonStyles, mobileStyles]}
      />
      <IconButtonSkeleton css={mobileStyles} size={gridSize * 3.25} />
    </Fragment>
  );
};
