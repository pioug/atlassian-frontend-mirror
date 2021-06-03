import React from 'react';

import { light, ThemeProvider, withGlobalTheme } from '../../../theme';

import BaseGlobalNavigationSkeleton from './GlobalNavigationSkeleton';

const GlobalNavigationSkeletonWithGlobalTheme = withGlobalTheme(
  BaseGlobalNavigationSkeleton,
);

const GlobalNavigationSkeleton = (props) => (
  <ThemeProvider
    theme={(ancestorTheme) => ({
      mode: light,
      ...ancestorTheme,
      context: 'product',
    })}
  >
    <GlobalNavigationSkeletonWithGlobalTheme {...props} />
  </ThemeProvider>
);

export default GlobalNavigationSkeleton;
