/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { BORDER_WIDTH } from '@atlaskit/avatar';
import { gridSize } from '@atlaskit/theme/constants';

const gutter = BORDER_WIDTH * 2 + gridSize() / 2;

const Stack: FC<{ children: ReactNode; testId?: string }> = ({
  children,
  testId,
}) => (
  <div
    data-testid={testId}
    css={css`
      display: flex;
      line-height: 1;
      margin-right: ${gutter}px;

      > * {
        margin-right: -${gutter}px;
      }
    `}
  >
    {children}
  </div>
);

export default Stack;
