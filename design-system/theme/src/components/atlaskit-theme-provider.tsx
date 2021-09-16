import React, { FC, memo } from 'react';

import { background as bg } from '../colors';
import { DEFAULT_THEME_MODE } from '../constants';
import type { AKThemeProviderProps, ThemeModes } from '../types';

// For forward-compat until everything is upgraded.
import useThemeResetStyles, { SELECTOR } from './hooks/use-theme-reset-styles';
import Theme from './theme';

type GetMode = () => { mode: ThemeModes };

const themeFnMap: Record<ThemeModes, GetMode> = {
  dark: () => ({ mode: 'dark' }),
  light: () => ({ mode: 'light' }),
};

/**
 * __Atlaskit Theme Provider__
 *
 * The global theme provider is used to provide theme context to an application.
 * It should be used once in application code at the root, or as near to the root as possible,
 * to inject the global theme via React context.
 *
 * - [Examples](https://atlaskit.atlassian.com/examples/design-system/theme)
 *
 * @example
 * ```jsx
 * import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
 *
 * const App = () => (
 *  <AtlaskitThemeProvider mode="dark">
 *   <App />
 *  </AtlaskitThemeProvider>
 * );
 * ```
 */
const AtlaskitThemeProvider: FC<AKThemeProviderProps> = memo<
  AKThemeProviderProps
>(({ mode = DEFAULT_THEME_MODE, background = bg, children }) => {
  // background color is extracted here is it conditionally applied on the <body>
  const themeObj = { theme: { mode } };
  const backgroundColor = background(themeObj);

  useThemeResetStyles(backgroundColor);
  return (
    <Theme.Provider value={themeFnMap[mode]}>
      <div className={`${mode}-${SELECTOR}`} style={{ backgroundColor }}>
        {children}
      </div>
    </Theme.Provider>
  );
});

export default AtlaskitThemeProvider;
