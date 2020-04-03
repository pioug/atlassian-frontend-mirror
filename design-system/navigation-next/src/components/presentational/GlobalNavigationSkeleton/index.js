import React from 'react';
import { withGlobalTheme, light, ThemeProvider } from '../../../theme';
import BaseGlobalNavigationSkeleton from './GlobalNavigationSkeleton';

const GlobalNavigationSkeletonWithGlobalTheme = withGlobalTheme(
  BaseGlobalNavigationSkeleton,
);

const GlobalNavigationSkeleton = props => (
  <ThemeProvider
    theme={ancestorTheme => ({
      mode: light,
      ...ancestorTheme,
      context: 'product',
    })}
  >
    <GlobalNavigationSkeletonWithGlobalTheme {...props} />
  </ThemeProvider>
);

export default GlobalNavigationSkeleton;
