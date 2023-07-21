/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { CREATE_BREAKPOINT } from '../../common/constants';
import { useTheme } from '../../theme';
import { IconButtonSkeleton } from '../IconButton/skeleton';

const searchInputContainerStyles = css({
  marginRight: token('space.100', '8px'),
  marginLeft: token('space.250', '20px'),
  position: 'relative',
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  [`@media (max-width: ${CREATE_BREAKPOINT - 1}px)`]: {
    display: 'none !important',
  },
});

const searchInputSkeletonStyles = css({
  boxSizing: 'border-box',
  width: '220px',
  height: token('space.400', '32px'),
  padding: `0 ${token('space.100', '8px')} 0 ${token('space.500', '40px')}`,
  borderRadius: token('border.radius.200', '6px'),
  opacity: 0.15,
});

const searchIconStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
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
      <IconButtonSkeleton css={searchIconStyles} marginRight={5} size={26} />
    </Fragment>
  );
};
