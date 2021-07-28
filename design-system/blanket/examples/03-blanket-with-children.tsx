/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import { DN50, N0 } from '@atlaskit/theme/colors';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import type { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import Blanket from '../src';

const blanketChildStyles = css({
  width: '50%',
  margin: `${gridSize() * 3}px auto`,
  padding: `${gridSize() * 5}px`,
  backgroundColor: token('color.background.default', N0),
});

const darkBackgroundStyles = css({
  backgroundColor: token('color.background.default', DN50),
});

const LIGHT = 'light';
const DARK = 'dark';

const BasicExample = () => {
  const [themeMode, setThemeMode] = useState<ThemeModes>(LIGHT);

  const [isBlanketVisible, setIsBlanketVisible] = useState(false);
  const [shouldAllowClickThrough, setShouldAllowClickThrough] = useState(true);

  const toggleMode = useCallback(() => {
    setThemeMode((themeMode) => (themeMode === LIGHT ? DARK : LIGHT));
  }, [setThemeMode]);

  const showBlanketClick = useCallback(() => {
    setIsBlanketVisible(true);
    setShouldAllowClickThrough(false);
  }, []);

  const onBlanketClicked = useCallback(() => {
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
          testId="blanket-with-children"
        >
          <Lorem
            css={[
              blanketChildStyles,
              themeMode === DARK && darkBackgroundStyles,
            ]}
            count={20}
          />
        </Blanket>
      </div>
    </AtlaskitThemeProvider>
  );
};

export default BasicExample;
