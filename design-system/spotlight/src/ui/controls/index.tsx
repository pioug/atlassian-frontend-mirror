import React, { forwardRef, type ReactNode } from 'react';

import { Flex } from '@atlaskit/primitives/compiled';

export interface SpotlightControlsProps {
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
 * __Spotlight controls__
 *
 * `SpotlightControls` groups spotlight control components.
 */
export const SpotlightControls = forwardRef<HTMLDivElement, SpotlightControlsProps>(
	({ testId, children }: SpotlightControlsProps, ref) => {
		return (
			<Flex testId={testId} ref={ref} gap="space.100" role="group">
				{children}
			</Flex>
		);
	},
);
