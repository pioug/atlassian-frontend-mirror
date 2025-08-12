import React, { forwardRef, type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	root: {
		width: '295px',
		height: '135px',
	},
});

export interface SpotlightMediaProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Textual content is required for all spotlights. It should be brief and direct
	 * to quickly elaborate on the intent.
	 */
	children: ReactNode;
}

/**
 * __SpotlightMedia__
 *
 * `SpotlightMedia` is optional in a `Spotlight`.
 *
 */
export const SpotlightMedia = forwardRef<HTMLDivElement, SpotlightMediaProps>(
	({ children, testId }: SpotlightMediaProps, ref) => {
		return (
			<Box ref={ref} xcss={styles.root} testId={testId}>
				{children}
			</Box>
		);
	},
);
