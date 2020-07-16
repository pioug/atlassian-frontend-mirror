/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

const gutter = gridSize() / 2;

const Grid: FC<{ children: ReactNode; testId?: string }> = ({
  children,
  testId,
}) => (
  <div
    data-testid={testId}
    css={css`
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      line-height: 1;
      margin-left: -${gutter}px;
      margin-right: -${gutter}px;

      > * {
        margin-bottom: ${gridSize()}px;
        padding-left: ${gutter}px;
        padding-right: ${gutter}px;
      }
    `}
  >
    {children}
  </div>
);

export default Grid;
