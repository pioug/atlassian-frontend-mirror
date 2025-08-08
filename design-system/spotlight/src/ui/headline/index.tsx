import React, { forwardRef, type ReactNode } from 'react';

import Heading from '@atlaskit/heading';

export interface SpotlightHeadlineProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * A brief and direct title to quickly hook the user on the intent.
	 */
	children?: ReactNode;
}

/**
 * __SpotlightHeadline__
 *
 * `SpotlightHeadline` is required in a `Spotlight`. The content should be brief and direct to quickly hook the user on the intent.
 *
 */
export const SpotlightHeadline = forwardRef<HTMLHeadingElement, SpotlightHeadlineProps>(
	({ children, testId }: SpotlightHeadlineProps, ref) => {
		return (
			<Heading ref={ref} testId={testId} color="color.text.inverse" size="xsmall">
				{children}
			</Heading>
		);
	},
);
