import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import Button from '@atlaskit/button/standard-button';
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';

import { DynamicTableStateless } from '../src';
import { RowType } from '../src/types';

import { head, rows } from './content/sample-data';

enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

const getOppositeTheme = (themeMode: ThemeMode) =>
  themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
const paddingStyle = { padding: '8px 0' };

const rowsWithTabIndex: Array<RowType> = rows.map((row) => ({
  ...row,
  tabIndex: 0,
}));

const FocusRowExample = () => {
  const [themeMode, setThemeMode] = useState(ThemeMode.LIGHT);
  const [autoFocusDone, setAutoFocusDone] = useState(false);
  const firstRowRef = useRef<HTMLElement>(null);

  const switchTheme = useCallback(() => {
    setThemeMode(getOppositeTheme(themeMode));
  }, [themeMode]);

  rowsWithTabIndex[0].innerRef = firstRowRef;

  useEffect(() => {
    if (firstRowRef.current && !autoFocusDone) {
      firstRowRef.current.focus();
      setAutoFocusDone(true);
    }
  }, [autoFocusDone]);

  return (
    <DeprecatedThemeProvider mode={themeMode} provider={StyledThemeProvider}>
      <h4 style={paddingStyle}>Click on any row to focus on it</h4>
      <div style={paddingStyle}>
        <Button onClick={switchTheme}>
          Switch theme to {getOppositeTheme(themeMode)}
        </Button>
      </div>
      <DynamicTableStateless
        head={head}
        rows={rowsWithTabIndex}
        rowsPerPage={40}
        page={1}
      />
    </DeprecatedThemeProvider>
  );
};

export default FocusRowExample;
