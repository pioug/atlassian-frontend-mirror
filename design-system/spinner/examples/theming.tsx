/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import Lozenge from '@atlaskit/lozenge';
import { N0, N500 } from '@atlaskit/theme/colors';
import GlobalTheme from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import Spinner from '../src';

const grid: number = gridSize();
const dark: string = token('color.text.highEmphasis', N500);
const light: string = token('color.text.highEmphasis', N0);

const container = css`
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function Example() {
  const [mode, setMode] = useState<ThemeModes>('light');

  const getMode = useCallback(() => ({ mode }), [mode]);

  return (
    <GlobalTheme.Provider value={getMode}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <Button
          onClick={() =>
            setMode((current) => (current === 'light' ? 'dark' : 'light'))
          }
        >
          Mode: <strong>{mode}</strong>
        </Button>
        <div
          css={css`
            display: flex;
            margin-top: ${grid}px;
          `}
        >
          <div
            css={[
              container,
              css`
                background: ${mode === 'light' ? light : dark};
              `,
            ]}
          >
            <Lozenge appearance="success">Inherit</Lozenge>
            <span
              css={css`
                margin-top: ${grid}px;
              `}
            >
              <Spinner appearance="inherit" />
            </span>
          </div>
          <div
            css={[
              container,
              css`
                background: ${mode === 'light' ? dark : light};
              `,
            ]}
          >
            <Lozenge appearance="new">Inverted</Lozenge>
            <span
              css={css`
                margin-top: ${grid}px;
              `}
            >
              <Spinner appearance="invert" />
            </span>
          </div>
        </div>
      </div>
    </GlobalTheme.Provider>
  );
}

export default () => <Example />;
