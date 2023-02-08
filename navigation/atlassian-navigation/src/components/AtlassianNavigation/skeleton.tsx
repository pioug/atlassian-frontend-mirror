/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { N30A, N40A, N900 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { gridSize, HORIZONTAL_GLOBAL_NAV_HEIGHT } from '../../common/constants';
import { defaultTheme, hexToRGBA, ThemeProvider } from '../../theme';
import { IconButtonSkeleton } from '../IconButton/skeleton';
import { PrimaryItemsContainerSkeleton } from '../PrimaryItemsContainer/skeleton';
import { ProductHomeSkeleton } from '../ProductHome/skeleton';
import { ProfileSkeleton } from '../Profile/skeleton';
import { SearchSkeleton } from '../Search/skeleton';

import { NavigationSkeletonProps } from './types';

const containerStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  height: HORIZONTAL_GLOBAL_NAV_HEIGHT,
  paddingRight: gridSize * 1.5,
  paddingLeft: gridSize * 1.5,
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '[data-color-mode="light"] &, [data-color-mode="dark"] &': {
    // eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
    borderBottom: `1px solid ${token('color.border')}`,

    // TODO: (DSP-2087) Remove the below once tokens have launched
    '&::after': {
      content: 'none',
    },
  },
  // TODO: (DSP-2087) Remove the below once tokens have launched
  '&::after': {
    height: gridSize / 2,
    position: 'absolute',
    top: '100%',
    right: 0,
    left: 0,
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    background: `linear-gradient(180deg, ${N40A} 0, ${N40A} 1px, ${N30A} 1px, ${hexToRGBA(
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      N900,
      0,
    )} 4px)`,
    content: '""',
  },
});

const leftStyles = css({
  display: 'flex',
  minWidth: 0,
  height: 'inherit',
  alignItems: 'center',
  flexGrow: 1,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > *': {
    flexShrink: 0,
  },
});

const rightStyles = css({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > *': {
    marginRight: gridSize / 2,
    flexShrink: 0,
  },
});

/**
 * __Navigation skeleton__
 *
 * Use loading skeletons to reduce the perceived loading time of heavier
 * full-page experiences. This should only be used when the whole navigation is
 * delayed; if there are only certain dynamically loaded navigation items that
 * slow down the page, you should look into using
 * [skeleton buttons](https://atlassian.design/components/atlassian-navigation/examples#skeleton-button)
 * instead.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#skeleton-loader)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 */
export const NavigationSkeleton = ({
  primaryItemsCount = 4,
  secondaryItemsCount = 4,
  theme = defaultTheme,
  showSiteName = false,
  shouldShowSearch = true,
  testId,
}: NavigationSkeletonProps) => {
  return (
    <ThemeProvider value={theme}>
      <div
        style={theme.mode.navigation as React.CSSProperties}
        css={containerStyles}
        data-testid={testId}
      >
        <div css={leftStyles}>
          <IconButtonSkeleton
            marginLeft={0}
            marginRight={5}
            size={gridSize * 3.25}
          />
          <ProductHomeSkeleton showSiteName={showSiteName} />
          <PrimaryItemsContainerSkeleton count={primaryItemsCount} />
        </div>
        <div css={rightStyles}>
          {shouldShowSearch && <SearchSkeleton />}
          {Array.from({ length: secondaryItemsCount }, (_, index) => (
            <IconButtonSkeleton
              key={index}
              marginLeft={0}
              marginRight={gridSize / 2}
              size={gridSize * 3.25}
            />
          ))}
          <ProfileSkeleton />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default NavigationSkeleton;
