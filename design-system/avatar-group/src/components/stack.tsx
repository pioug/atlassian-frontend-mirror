/** @jsx jsx */
import { Children, FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { BORDER_WIDTH } from '@atlaskit/avatar';
import { gridSize } from '@atlaskit/theme/constants';

const gutter = BORDER_WIDTH * 2 + gridSize() / 2;

const listStyles = css({
  display: 'flex',
  margin: 0,
  marginRight: gutter,
  padding: 0,
  lineHeight: 1,
  listStyleType: 'none !important',
});

const listItemStyles = css({
  margin: 0,
  marginRight: -gutter,
});

const Stack: FC<{
  children: ReactNode;
  testId?: string;
  'aria-label': string;
}> = ({ children, testId, 'aria-label': label }) => (
  <ul data-testid={testId} aria-label={label} css={listStyles}>
    {Children.map(
      children,
      (child) => child && <li css={listItemStyles}>{child}</li>,
    )}
  </ul>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Stack;
