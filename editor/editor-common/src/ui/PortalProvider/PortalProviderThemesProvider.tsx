import React from 'react';

import { ThemeProvider } from '@emotion/react';

import AtlaskitTheme from '@atlaskit/theme/components';
import { CHANNEL } from '@atlaskit/theme/constants';
import type { ThemeModes } from '@atlaskit/theme/types';

export function PortalProviderThemeProviders(props: {
  mode: ThemeModes;
  children: React.ReactNode;
}) {
  const { children, mode } = props;

  const styledComponentsAndEmotionTheme = React.useMemo(
    // This return value should only be one of the following
    // - { [CHANNEL]: { mode },
    // - { theme: { [CHANNEL]: { mode } }
    // However, it appears that consumers have inconsistent expectations
    // regarding the shape.
    // This can be revisited in future work, and for the purposes of
    // fixing https://product-fabric.atlassian.net/browse/ED-14956
    // we are merging the two shapes consumers expect.
    () => ({ [CHANNEL]: { mode }, theme: { [CHANNEL]: { mode } } }),
    [mode],
  );
  const atlaskitTheme = React.useCallback(() => ({ mode }), [mode]);

  return (
    // TODO: ED-15585
    // import { ThemeProvider as DeprectateStyledComponentsProvider } from 'styled-components';
    // <DeprectateStyledComponentsProvider theme={styledComponentsAndEmotionTheme}>
    // </DeprectateStyledComponentsProvider>
    <ThemeProvider theme={styledComponentsAndEmotionTheme}>
      <AtlaskitTheme.Provider value={atlaskitTheme}>
        {children}
      </AtlaskitTheme.Provider>
    </ThemeProvider>
  );
}
