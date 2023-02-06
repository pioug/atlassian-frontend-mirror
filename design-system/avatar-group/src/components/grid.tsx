/** @jsx jsx */
import { Children, FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const gridSize = getGridSize();
const gutter = gridSize / 2;

const listStyles = css({
  // removes default ul styles. Needs !important to override contextual styles in product.
  display: 'flex',
  margin: token('space.0', '0px'),
  marginRight: -gutter,
  marginLeft: -gutter,
  padding: token('space.0', '0px'),
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  lineHeight: 1,
  listStyleType: 'none !important',
});

const listItemStyles = css({
  margin: token('space.0', '0px'),
  marginBottom: token('space.100', '8px'),
  paddingRight: token('space.050', '4px'),
  paddingLeft: token('space.050', '4px'),
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
