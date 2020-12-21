import React, { ReactNode } from 'react';

import { N0 } from '@atlaskit/theme/colors';
import { AtlaskitThemeProvider, themed } from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';

import { useSystemTheme } from './hooks/useSystemTheme';

const DN0 = '#000000';
const background = themed({ light: N0, dark: DN0 });

interface WithSystemThemeModeProps {
  mode: ThemeModes;
  children?: React.ReactNode[] | React.ReactNode;
}

const WithSystemTheme: React.FunctionComponent<
  ReactNode & WithSystemThemeModeProps
> = props => {
  const { children, mode } = props;

  return (
    <AtlaskitThemeProvider mode={mode} background={background}>
      {children}
    </AtlaskitThemeProvider>
  );
};

export const withSystemTheme = <P extends object>(
  Component: React.ComponentType<P>,
  enableLightDarkTheming?: boolean,
): React.FC<P> => props => {
  const mode = enableLightDarkTheming ? useSystemTheme() : 'light';
  return (
    <WithSystemTheme mode={mode}>
      <Component {...(props as P)} />
    </WithSystemTheme>
  );
};
