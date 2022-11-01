/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import Lozenge from '@atlaskit/lozenge';
import { N0, N500 } from '@atlaskit/theme/colors';
import GlobalTheme from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import Spinner from '../src';

const dark: string = token('color.text', N500);
const light: string = token('color.text', N0);

const layoutStyles = css({
  display: 'grid',
  // TODO Delete this comment after verifying spacing token -> previous value `grid`
  gap: token('spacing.scale.100', '8px'),
  placeItems: 'center',
});

const boxContainerStyles = css({ display: 'flex' });

const boxStyles = css({
  display: 'flex',
  width: 100,
  height: 100,
  alignItems: 'center',
  justifyContent: 'center',
  // TODO Delete this comment after verifying spacing token -> previous value `grid`
  gap: token('spacing.scale.100', '8px'),
  flexDirection: 'column',
});

function Example() {
  const [mode, setMode] = useState<ThemeModes>('light');

  const getMode = useCallback(() => ({ mode }), [mode]);

  return (
    <GlobalTheme.Provider value={getMode}>
      <div css={layoutStyles}>
        <Button
          onClick={() =>
            setMode((current) => (current === 'light' ? 'dark' : 'light'))
          }
        >
          Mode: <strong>{mode}</strong>
        </Button>
        <div css={boxContainerStyles}>
          <div
            css={boxStyles}
            style={{ background: mode === 'light' ? light : dark }}
          >
            <Lozenge appearance="success">Inherit</Lozenge>
            <Spinner appearance="inherit" />
          </div>
          <div
            css={boxStyles}
            style={{ background: mode === 'light' ? dark : light }}
          >
            <Lozenge appearance="new">Inverted</Lozenge>
            <Spinner appearance="invert" />
          </div>
        </div>
      </div>
    </GlobalTheme.Provider>
  );
}

export default () => <Example />;
