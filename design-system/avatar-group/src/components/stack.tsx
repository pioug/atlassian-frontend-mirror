/** @jsx jsx */
import { Children, FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { BORDER_WIDTH } from '@atlaskit/avatar';
import { gridSize } from '@atlaskit/theme/constants';

const gutter = BORDER_WIDTH * 2 + gridSize() / 2;

const Stack: FC<{
  children: ReactNode;
  testId?: string;
  'aria-label': string;
}> = ({ children, testId, 'aria-label': label }) => (
  <ul
    data-testid={testId}
    aria-label={label}
    // eslint-disable-next-line @repo/internal/react/no-css-string-literals
    css={css`
      // removes default ul styles
      list-style-type: none !important;
      margin: 0;
      padding: 0;

      > li {
        margin: 0;
        margin-right: -${gutter}px;
      }

      display: flex;
      line-height: 1;
      margin-right: ${gutter}px;
    `}
  >
    {Children.map(children, (child) => child && <li>{child}</li>)}
  </ul>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Stack;
