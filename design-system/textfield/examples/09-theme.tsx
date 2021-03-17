import React, { useState } from 'react';

import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';
import Toggle from '@atlaskit/toggle';

import TextField from '../src';
const LIGHT = 'light';
const DARK = 'dark';
export default function ThemeExample() {
  const [themeMode, setThemeMode] = useState<ThemeModes>('light');
  const toggleMode = () => {
    setThemeMode(themeMode === LIGHT ? DARK : LIGHT);
  };

  return (
    <AtlaskitThemeProvider mode={themeMode}>
      <TextField
        aria-label="themed text field"
        name="event-handlers"
        onChange={() => {}}
        readOnly
        width="large"
        value={`${themeMode} mode`}
        elemAfterInput={
          <Toggle isChecked={themeMode === LIGHT} onChange={toggleMode} />
        }
      />
    </AtlaskitThemeProvider>
  );
}
