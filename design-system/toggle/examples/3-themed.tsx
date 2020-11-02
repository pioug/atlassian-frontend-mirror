import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';

import Toggle from '../src';

const Swapper = () => {
  const [mode, setMode] = useState('light');

  return (
    <AtlaskitThemeProvider mode={mode as ThemeModes}>
      <div>
        <Toggle isDisabled />
        <Toggle />
        <div style={{ marginTop: gridSize() }}>
          <Button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
            Toggle theme{' '}
            <span role="img" aria-label="irony">
              😂
            </span>
          </Button>
        </div>
      </div>
    </AtlaskitThemeProvider>
  );
};

export default Swapper;
