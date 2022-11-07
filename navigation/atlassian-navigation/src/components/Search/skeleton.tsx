/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { CREATE_BREAKPOINT, gridSize } from '../../common/constants';
import { useTheme } from '../../theme';
import { IconButtonSkeleton } from '../IconButton/skeleton';

const searchInputContainerStyles = css({
  marginRight: gridSize,
  marginLeft: 20,
  position: 'relative',
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  [`@media (max-width: ${CREATE_BREAKPOINT - 1}px)`]: {
    display: 'none !important',
  },
});

const searchInputSkeletonStyles = css({
  boxSizing: 'border-box',
  width: '220px',
  height: `${gridSize * 4}px`,
  padding: `0 ${gridSize}px 0 40px`,
  borderRadius: 6,
  opacity: 0.15,
});

const searchIconStyles = css({
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  [`@media (min-width: ${CREATE_BREAKPOINT}px)`]: {
    display: 'none !important',
  },
});

// Not exported to consumers, only used in NavigationSkeleton
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SearchSkeleton = () => {
  const theme = useTheme();

  return (
    <Fragment>
      <div css={searchInputContainerStyles}>
        <div
          style={theme.mode.skeleton as React.CSSProperties}
          css={searchInputSkeletonStyles}
        />
      </div>
      <IconButtonSkeleton
        css={searchIconStyles}
        marginRight={5}
        size={gridSize * 3.25}
      />
    </Fragment>
  );
};
