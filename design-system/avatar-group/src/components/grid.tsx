/** @jsx jsx */
import { Children, FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

const gutter = gridSize() / 2;

const Grid: FC<{
  children: ReactNode;
  testId?: string;
  'aria-label': string;
}> = ({ children, testId, 'aria-label': label }) => (
  <ul
    data-testid={testId}
    aria-label={label}
    // eslint-disable-next-line @repo/internal/react/no-css-string-literals
    css={css`
      // removes default ul styles. Needs !important to override contextual styles in product.
      list-style-type: none !important;
      margin: 0;
      padding: 0;

      > li {
        margin: 0;
        margin-bottom: ${gridSize()}px;
        padding-left: ${gutter}px;
        padding-right: ${gutter}px;
      }

      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      line-height: 1;
      margin-left: -${gutter}px;
      margin-right: -${gutter}px;
    `}
  >
    {Children.map(children, (child) => child && <li>{child}</li>)}
  </ul>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Grid;
