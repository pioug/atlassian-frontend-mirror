/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import type { ThemeModes } from '@atlaskit/theme/types';

import Blanket from '../src';

const eventResultStyle = css({
  borderStyle: 'dashed',
  borderWidth: '1px',
  borderColor: '#ccc',
  padding: '0.5em',
  color: '#ccc',
  margin: '0.5em',
});

const LIGHT = 'light';
const DARK = 'dark';

const BasicExample = () => {
  const [themeMode, setThemeMode] = useState<ThemeModes>(LIGHT);

  const [isBlanketVisible, setIsBlanketVisible] = useState(false);
  const [canClickThrough, setCanClickThrough] = useState(true);
  const [onEventResult, setOnEventResult] = useState(
    'Blanket isTinted:false canClickThrough:true',
  );

  const toggleMode = () => {
    setThemeMode(themeMode === LIGHT ? DARK : LIGHT);
  };

  const showBlanketClick = () => {
    setOnEventResult('Blanket isTinted: true canClickThrough: false');
    setIsBlanketVisible(true);
    setCanClickThrough(false);
  };

  const onBlanketClicked = () => {
    setOnEventResult('onBlanketClicked called with canClickThrough: true');
    setIsBlanketVisible(false);
    setCanClickThrough(true);
  };

  return (
    <AtlaskitThemeProvider mode={themeMode}>
      <div>
        <Button
          appearance="default"
          onClick={showBlanketClick}
          testId="show-button"
        >
          Show blanket
        </Button>
        <Button
          style={{ marginLeft: gridSize() }}
          testId="toggle-theme"
          onClick={toggleMode}
        >
          Toggle theme
        </Button>
        <p>
          Click "Show blanket" button to open the blanket & click the blanket to
          dismiss it.
        </p>
        <p>
          Click "Toggle theme" button to toggle between light and dark theme.
        </p>

        <Blanket
          onBlanketClicked={onBlanketClicked}
          isTinted={isBlanketVisible}
          canClickThrough={canClickThrough}
          testId="basic-blanket"
        />
        <div css={eventResultStyle}>{onEventResult}</div>
      </div>
    </AtlaskitThemeProvider>
  );
};

export default BasicExample;
