import React, { forwardRef, type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.150'),
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.150'),
	},
});

export interface SpotlightHeaderProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Elements to be rendered inside the `SpotlightHeader`.
	 */
	children?: ReactNode;
}

/**
 * __SpotlightHeader__
 *
 * `SpotlightHeader` should be placed at the top of a `Spotlight`, and is
 * intended to show the `SpotlightHeadline` component, as well as `SpotLightControls`.
 *
 */
export const SpotlightHeader = forwardRef<HTMLDivElement, SpotlightHeaderProps>(
	({ children, testId }: SpotlightHeaderProps, ref) => {
		return (
			<Flex
				ref={ref}
				testId={testId}
				xcss={styles.root}
				alignItems="center"
				justifyContent="space-between"
				gap="space.100"
			>
				{children}
			</Flex>
		);
	},
);
