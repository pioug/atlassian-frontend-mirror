/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { N20, N200 } from '@atlaskit/theme/colors';
import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';

const borderRadius = getBorderRadius();
const gridSize = getGridSize();

export const Content = ({
  children,
  testId,
}: {
  children: ReactNode;
  testId?: string;
}) => (
  <div
    css={css`
      align-items: center;
      background-color: ${N20};
      border-radius: ${borderRadius}px;
      color: ${N200};
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      font-size: 4em;
      font-weight: 500;
      justify-content: center;
      margin-bottom: ${gridSize}px;
      margin-top: ${gridSize * 2}px;
      padding: ${gridSize * 4}px;
    `}
    data-testid={testId}
  >
    {children}
  </div>
);
