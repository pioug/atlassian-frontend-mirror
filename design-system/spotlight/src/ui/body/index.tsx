import React, { forwardRef, type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingInline: token('space.200'),
	},
});

export interface SpotlightBodyProps {
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
 * __SpotlightBody__
 *
 * `SpotlightBody` is required in a `Spotlight`. The content should be brief and direct to elaborate on the intent.
 *
 */
export const SpotlightBody = forwardRef<HTMLDivElement, SpotlightBodyProps>(
	({ children, testId }: SpotlightBodyProps, ref) => {
		return (
			<Box ref={ref} xcss={styles.root} testId={testId}>
				{children}
			</Box>
		);
	},
);
