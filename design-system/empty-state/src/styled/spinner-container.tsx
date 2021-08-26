/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';

const gridSize = getGridSize();

const spinnerContainerStyles = css({
  width: `${3 * gridSize}px`,
  marginLeft: `${2 * gridSize}px`,
});

/**
 * __Spinner container__
 *
 * A spinner container for loading state of Empty State.
 *
 * @internal
 */
const SpinnerContainer: FC = ({ children }) => (
  <div css={spinnerContainerStyles}>{children}</div>
);

export default SpinnerContainer;
