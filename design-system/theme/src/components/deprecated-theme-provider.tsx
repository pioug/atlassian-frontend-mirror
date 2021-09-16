/* eslint-disable @repo/internal/react/no-unsafe-overrides */
import React, { ComponentType, FC, memo } from 'react';

import { CHANNEL, DEFAULT_THEME_MODE } from '../constants';
import type { ThemeModes } from '../types';

import AtlaskitThemeProvider from './atlaskit-theme-provider';

export interface DeprecatedThemeProviderProps {
  mode?: ThemeModes;
  provider: ComponentType<any>;
}

/**
 * __Compat Theme Provider__
 *
 * This component is a wrapper over the `AtlaskitThemeProvider`.
 * It's exposed purely to aid migration off `styled-components`.
 *
 * @deprecated
 */
const CompatThemeProvider: FC<DeprecatedThemeProviderProps> = memo(
  ({ mode = DEFAULT_THEME_MODE, provider: Provider, children }) => (
    <Provider theme={{ [CHANNEL]: { mode } }}>
      <AtlaskitThemeProvider mode={mode}>{children}</AtlaskitThemeProvider>
    </Provider>
  ),
);

export default CompatThemeProvider;
