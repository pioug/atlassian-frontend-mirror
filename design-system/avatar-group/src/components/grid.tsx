/** @jsx jsx */
import { Children, FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';

const gridSize = getGridSize();
const gutter = gridSize / 2;

const listStyles = css({
  // removes default ul styles. Needs !important to override contextual styles in product.
  display: 'flex',
  margin: 0,
  marginRight: -gutter,
  marginLeft: -gutter,
  padding: 0,
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  lineHeight: 1,
  listStyleType: 'none !important',
});

const listItemStyles = css({
  margin: 0,
  marginBottom: gridSize,
  paddingRight: gutter,
  paddingLeft: gutter,
});

const Grid: FC<{
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
export default Grid;
