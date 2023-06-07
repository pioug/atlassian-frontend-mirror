/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import { h600 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const headerStyles = css([
  h600(),
  {
    marginTop: token('space.0', '0px'),
    marginBottom: token('space.200', '16px'),
  },
]);

/**
 * __Header__
 *
 * Header of Empty State.
 *
 * @internal
 */
const EmptyStateHeader: FC<{ children: string }> = ({ children }) => (
  <h4 css={headerStyles}>{children}</h4>
);

export default EmptyStateHeader;
