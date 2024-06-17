/** @jsx jsx */
import { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const spinnerContainerStyles = css({
	width: token('space.300', '24px'),
	marginInlineStart: token('space.200', '16px'),
});

/**
 * __Spinner container__
 *
 * A spinner container for loading state of Empty State.
 *
 * @internal
 */
const SpinnerContainer: FC<{ children?: ReactNode }> = ({ children }) => (
	<div css={spinnerContainerStyles}>{children}</div>
);

export default SpinnerContainer;
