import React, { forwardRef, type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.150'),
		width: '100%',
	},
});

export interface SpotlightFooterProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Elements to be rendered inside the `SpotlightFooter`.
	 */
	children?: ReactNode;
}

/**
 * __SpotlightFooter__
 *
 * `SpotlightFooter` is intended to display the `SpotlightActions` and `SpotLightStepCount` components.
 *
 */
export const SpotlightFooter = forwardRef<HTMLDivElement, SpotlightFooterProps>(
	({ children, testId }: SpotlightFooterProps, ref) => {
		return (
			<Flex
				ref={ref}
				testId={testId}
				xcss={styles.root}
				alignItems="center"
				justifyContent="space-between"
			>
				{children}
			</Flex>
		);
	},
);
