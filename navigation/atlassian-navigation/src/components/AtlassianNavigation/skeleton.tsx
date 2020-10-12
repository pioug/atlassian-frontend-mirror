/** @jsx jsx */
import { jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

import { defaultTheme, ThemeProvider } from '../../theme';
import { IconButtonSkeleton } from '../IconButton/skeleton';
import { PrimaryItemsContainerSkeleton } from '../PrimaryItemsContainer/skeleton';
import { ProductHomeSkeleton } from '../ProductHome/skeleton';
import { ProfileSkeleton } from '../Profile/skeleton';
import { SearchSkeleton } from '../Search/skeleton';

import { containerCSS, leftCSS, rightCSS } from './styles';
import { NavigationSkeletonProps } from './types';

export const NavigationSkeleton = ({
  primaryItemsCount = 4,
  secondaryItemsCount = 4,
  theme = defaultTheme,
  showSiteName = false,
  shouldShowSearch = true,
}: NavigationSkeletonProps) => {
  return (
    <ThemeProvider value={theme}>
      <div css={containerCSS(theme)}>
        <div css={leftCSS}>
          <IconButtonSkeleton
            marginLeft={0}
            marginRight={5}
            size={gridSize() * 3.25}
          />
          <ProductHomeSkeleton showSiteName={showSiteName} />
          <PrimaryItemsContainerSkeleton count={primaryItemsCount} />
        </div>
        <div css={rightCSS}>
          {shouldShowSearch && <SearchSkeleton />}
          {Array.from({ length: secondaryItemsCount }, (_, index) => (
            <IconButtonSkeleton
              key={index}
              marginLeft={0}
              marginRight={5}
              size={gridSize() * 3.25}
            />
          ))}
          <ProfileSkeleton />
        </div>
      </div>
    </ThemeProvider>
  );
};
