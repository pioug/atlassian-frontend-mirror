/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button';
import {
  AtlaskitThemeProvider,
  useGlobalTheme,
} from '@atlaskit/theme/components';
import type { ThemeModes } from '@atlaskit/theme/types';

import Badge, { BadgeProps } from '../src';

const customDarkTheme = {
  backgroundColor: {
    added: 'red',
    default: 'blue',
    important: 'green',
    primary: 'yellow',
    primaryInverted: 'grey',
    removed: 'black',
  },
  color: {
    added: 'white',
    default: 'white',
    important: 'white',
    primary: 'black',
    primaryInverted: 'black',
    removed: 'white',
  },
};

function CustomBadge({ children, appearance = 'default' }: BadgeProps) {
  const { mode } = useGlobalTheme();
  const theme = mode === 'dark' ? customDarkTheme : null;

  return (
    <Badge
      appearance={appearance}
      style={{
        backgroundColor: theme?.backgroundColor[appearance],
        color: theme?.color[appearance],
      }}
    >
      {children}
    </Badge>
  );
}

export default function Example() {
  const [themeMode, setThemeMode] = useState<ThemeModes>('dark');
  const toggle = useCallback(() => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  }, [themeMode]);

  return (
    <AtlaskitThemeProvider mode={themeMode}>
      <div>
        <p>
          Default: <CustomBadge>{1}</CustomBadge>
        </p>
        <p>
          appearance: important{' '}
          <CustomBadge appearance="important">{1}</CustomBadge>
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
