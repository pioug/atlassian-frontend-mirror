import React from 'react';

import type { ThemeModes } from '@atlaskit/theme/types';
import AtlaskitTheme from '@atlaskit/theme/components';
import { CHANNEL } from '@atlaskit/theme/constants';
import { ThemeProvider } from '@emotion/react';

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
    <ThemeProvider theme={styledComponentsAndEmotionTheme}>
      <AtlaskitTheme.Provider value={atlaskitTheme}>
        {children}
      </AtlaskitTheme.Provider>
    </ThemeProvider>
  );
}
