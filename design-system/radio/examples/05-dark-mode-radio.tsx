import React, { SyntheticEvent, useState } from 'react';

import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

import { RadioGroup } from '../src';

const options = [
  { value: 'light', name: 'numbers', label: 'Light Mode' },
  { value: 'dark', name: 'numbers', label: 'Dark Mode' },
];

type ThemeType = 'light' | 'dark';
export default function ThemedRadio() {
  const [themeMode, setThemeMode] = useState<ThemeType>('dark');

  const switchTheme = ({
    currentTarget: { value },
  }: SyntheticEvent<HTMLInputElement>) => {
    setThemeMode(value as ThemeType);
  };

  return (
    <AtlaskitThemeProvider mode={themeMode}>
      <RadioGroup
        defaultValue={themeMode}
        options={options}
        onChange={switchTheme}
      />
    </AtlaskitThemeProvider>
  );
}
