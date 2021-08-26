/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { h600 } from '@atlaskit/theme/typography';

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const headerStyles = css([
  h600(),
  {
    marginTop: 0,
    marginBottom: `${getGridSize() * 2}px`,
  },
]);

/**
 * __Header__
 *
 * Header of Empty State.
 *
 * @internal
 */
const EmptyStateHeader: FC = ({ children }) => (
  <h4 css={headerStyles}>{children}</h4>
);

export default EmptyStateHeader;
