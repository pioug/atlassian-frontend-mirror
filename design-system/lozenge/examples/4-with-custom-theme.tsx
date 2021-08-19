/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button';
import {
  B50,
  B500,
  G50,
  G500,
  N0,
  N100,
  N800,
  P400,
  R50,
  R500,
  Y75,
} from '@atlaskit/theme/colors';
import {
  AtlaskitThemeProvider,
  useGlobalTheme,
} from '@atlaskit/theme/components';
import type { ThemeModes } from '@atlaskit/theme/types';

import Lozenge, { LozengeProps } from '../src/Lozenge';

const customDarkTheme = {
  backgroundColor: {
    default: N100,
    inprogress: B50,
    moved: Y75,
    new: P400,
    removed: R50,
    success: G50,
  },
  textColor: {
    default: N0,
    inprogress: B500,
    moved: N800,
    new: N0,
    removed: R500,
    success: G500,
  },
};

const CustomLozenge = ({ children, appearance = 'default' }: LozengeProps) => {
  const { mode } = useGlobalTheme();
  const theme = mode === 'dark' ? customDarkTheme : null;

  return (
    <Lozenge
      appearance={appearance}
      style={{
        backgroundColor: theme?.backgroundColor[appearance],
        color: theme?.textColor[appearance],
      }}
    >
      {children}
    </Lozenge>
  );
};
export default function Example() {
  const [themeMode, setThemeMode] = useState<ThemeModes>('dark');
  const toggle = useCallback(() => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  }, [themeMode]);

  return (
    <AtlaskitThemeProvider mode={themeMode}>
      <div>
        <p>
          Default: <CustomLozenge>default</CustomLozenge>
        </p>
        <p>
          Appearance: new <CustomLozenge appearance="new">new</CustomLozenge>
        </p>
      </div>
      <br />
      <Button onClick={toggle}>
        {themeMode === 'dark'
          ? 'Click to apply default badge light theme'
          : 'Click to apply custom dark theme'}
      </Button>
    </AtlaskitThemeProvider>
  );
}
