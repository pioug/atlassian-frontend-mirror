/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const spinnerContainerStyles = css({
  width: token('spacing.scale.300', '24px'),
  // TODO Delete this comment after verifying spacing token -> previous value ``${2 * gridSize}px``
  marginLeft: token('spacing.scale.200', '16px'),
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
