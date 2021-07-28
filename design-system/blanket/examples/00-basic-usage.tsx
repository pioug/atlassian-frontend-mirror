/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import type { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import Blanket from '../src';

const eventResultStyles = css({
  margin: '0.5em',
  padding: '0.5em',
  borderColor: token('color.border.neutral', '#ccc'),
  borderStyle: 'dashed',
  borderWidth: '1px',
  color: token('color.text.lowEmphasis', '#ccc'),
});

const LIGHT = 'light';
const DARK = 'dark';

const BasicExample = () => {
  const [themeMode, setThemeMode] = useState<ThemeModes>(LIGHT);

  const [isBlanketVisible, setIsBlanketVisible] = useState(false);
  const [shouldAllowClickThrough, setShouldAllowClickThrough] = useState(true);
  const [onEventResult, setOnEventResult] = useState(
    'Blanket isTinted:false shouldAllowClickThrough:true',
  );

  const toggleMode = useCallback(() => {
    setThemeMode((themeMode) => (themeMode === LIGHT ? DARK : LIGHT));
  }, [setThemeMode]);

  const showBlanketClick = useCallback(() => {
    setOnEventResult('Blanket isTinted: true shouldAllowClickThrough: false');
    setIsBlanketVisible(true);
    setShouldAllowClickThrough(false);
  }, []);

  const onBlanketClicked = useCallback(() => {
    setOnEventResult(
      'onBlanketClicked called with shouldAllowClickThrough: true',
    );
    setIsBlanketVisible(false);
    setShouldAllowClickThrough(true);
  }, []);

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
          shouldAllowClickThrough={shouldAllowClickThrough}
          testId="basic-blanket"
        />
        <div css={eventResultStyles}>{onEventResult}</div>
      </div>
    </AtlaskitThemeProvider>
  );
};

export default BasicExample;
