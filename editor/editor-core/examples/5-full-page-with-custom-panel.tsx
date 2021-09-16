import React, { useState, ChangeEvent } from 'react';
import { default as FullPageExample } from './5-full-page';
import { exampleDocument } from '../example-helpers/example-doc-with-custom-panels';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { ThemeModes } from '@atlaskit/theme';

const LIGHT_THEME = 'light',
  DARK_THEME = 'dark';

export default function Example() {
  const [themeMode, setThemeMode] = useState<ThemeModes>(LIGHT_THEME);
  const onThemeToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setThemeMode(event.currentTarget.checked ? DARK_THEME : LIGHT_THEME);
  };
  const toggleDarkMode = (
    <label>
      <input type="checkbox" onChange={onThemeToggle} />
      Dark Mode
    </label>
  );
  return (
    <DeprecatedThemeProvider mode={themeMode} provider={StyledThemeProvider}>
      <FullPageExample
        defaultValue={exampleDocument}
        allowPanel={{ UNSAFE_allowCustomPanel: true }}
      />
      {toggleDarkMode}
    </DeprecatedThemeProvider>
  );
}
