/** @jsx jsx */
import { Children, FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { BORDER_WIDTH } from '@atlaskit/avatar';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const gutter = BORDER_WIDTH * 2 + gridSize() / 2;

const listStyles = css({
  display: 'flex',
  margin: token('space.0', '0px'),
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  marginRight: gutter,
  padding: token('space.0', '0px'),
  lineHeight: 1,
  listStyleType: 'none !important',
});

const listItemStyles = css({
  margin: token('space.0', '0px'),
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
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
