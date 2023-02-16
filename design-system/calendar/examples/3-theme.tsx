import React, { useState } from 'react';

import Button from '@atlaskit/button';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';

import Calendar from '../src';

const LIGHT = 'light';
const DARK = 'dark';
export default function ThemeExample() {
  const [themeMode, setThemeMode] = useState<ThemeModes>(DARK);
  const toggleMode = () => {
    setThemeMode(themeMode === LIGHT ? DARK : LIGHT);
  };

  const disabled = ['2020-12-04'];
  const defaultPreviouslySelected = ['2020-12-06'];
  const defaultSelected = ['2020-12-08'];
  const style = {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    border: '1px solid red',
    display: 'inline-block',
  };

  return (
    <AtlaskitThemeProvider mode={themeMode}>
      <div>
        <Calendar
          disabled={disabled}
          defaultPreviouslySelected={defaultPreviouslySelected}
          defaultSelected={defaultSelected}
          defaultMonth={12}
          defaultYear={2020}
          style={style}
          testId={'calendar'}
        />
        <div style={{ marginTop: gridSize() }}>
          <Button onClick={toggleMode}>
            Toggle theme{' '}
            <span role="img" aria-label="irony">
              😂
            </span>
          </Button>
        </div>
      </div>
    </AtlaskitThemeProvider>
  );
}
