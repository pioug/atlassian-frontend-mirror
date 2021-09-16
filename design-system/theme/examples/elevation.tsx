/* eslint-disable @repo/internal/react/no-unsafe-overrides */
import React, { useCallback, useState } from 'react';

import styled from '@emotion/styled';

import Button from '@atlaskit/button/custom-theme-button';

import Theme, {
  elevation as AkElevations,
  AtlaskitThemeProvider,
  themed,
  Theme as ThemeType,
} from '../src';
import { Elevation, ThemeModes } from '../src/types';

const elevations = { ...AkElevations };

// the below adaptation may be written statically like ${akElevationMixins.e100}
const Box = styled.div<{ elevation: Elevation; theme: ThemeType }>`
  ${({ elevation }) => elevations[elevation]}
  background-color: ${(props) =>
    themed({ light: 'white', dark: '#283447' })(props)};
  border-radius: 3px;
  margin-bottom: 2em;
  min-width: 240px;
  padding: 16px 24px;
  text-align: center;
`;

const Wrapper = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [themeMode, setThemeMode] = useState<ThemeModes>('light');
  const switchTheme = useCallback(
    () => setThemeMode((old) => (old === 'light' ? 'dark' : 'light')),
    [],
  );

  return (
    <AtlaskitThemeProvider mode={themeMode}>
      <Theme.Consumer>
        {(theme) => (
          <div>
            <Wrapper>
              <Box theme={theme} elevation="e100">
                Cards on a board (e100)
              </Box>
              <Box theme={theme} elevation="e200">
                Inline dialogs (e200)
              </Box>
              <Box theme={theme} elevation="e300">
                Modals (e300)
              </Box>
              <Box theme={theme} elevation="e400">
                Panels (e400)
              </Box>
              <Box theme={theme} elevation="e500">
                Flag messages (e500)
              </Box>
            </Wrapper>

            <div style={{ padding: 8, textAlign: 'center' }}>
              <Button appearance="primary" onClick={switchTheme}>
                Switch theme ({themeMode})
              </Button>
            </div>
          </div>
        )}
      </Theme.Consumer>
    </AtlaskitThemeProvider>
  );
};
