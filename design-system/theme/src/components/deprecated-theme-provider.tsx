/* eslint-disable @repo/internal/react/no-unsafe-overrides */
import React, { ComponentType, memo, PropsWithChildren } from 'react';

import { CHANNEL, DEFAULT_THEME_MODE } from '../constants';
import type { ThemeModes } from '../types';

import AtlaskitThemeProvider from './atlaskit-theme-provider';

export type DeprecatedThemeProviderProps = PropsWithChildren<{
  mode?: ThemeModes;
  provider: ComponentType<any>;
}>;

/**
 * __Compat Theme Provider__
 *
 * This component is a wrapper over the `AtlaskitThemeProvider`.
 * It's exposed purely to aid migration off `styled-components`.
 *
 * @deprecated
 */
const CompatThemeProvider = memo(
  ({
    mode = DEFAULT_THEME_MODE,
    provider: Provider,
    children,
  }: DeprecatedThemeProviderProps) => (
    <Provider theme={{ [CHANNEL]: { mode } }}>
      <AtlaskitThemeProvider mode={mode}>{children}</AtlaskitThemeProvider>
    </Provider>
  ),
);

export default CompatThemeProvider;
