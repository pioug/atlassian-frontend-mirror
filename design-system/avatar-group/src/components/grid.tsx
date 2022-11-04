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
  // TODO Delete this comment after verifying spacing token -> previous value `0`
  margin: token('spacing.scale.0', '0px'),
  marginRight: -gutter,
  marginLeft: -gutter,
  // TODO Delete this comment after verifying spacing token -> previous value `0`
  padding: token('spacing.scale.0', '0px'),
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  lineHeight: 1,
  listStyleType: 'none !important',
});

const listItemStyles = css({
  // TODO Delete this comment after verifying spacing token -> previous value `0`
  margin: token('spacing.scale.0', '0px'),
  // TODO Delete this comment after verifying spacing token -> previous value `gridSize`
  marginBottom: token('spacing.scale.100', '8px'),
  // TODO Delete this comment after verifying spacing token -> previous value `gutter`
  paddingRight: token('spacing.scale.050', '4px'),
  // TODO Delete this comment after verifying spacing token -> previous value `gutter`
  paddingLeft: token('spacing.scale.050', '4px'),
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
