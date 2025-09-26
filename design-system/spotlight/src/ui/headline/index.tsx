/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode, useContext } from 'react';

import { jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';

import { SpotlightContext } from '../../controllers/context';

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
	children: ReactNode;
}

/**
 * __SpotlightHeadline__
 *
 * `SpotlightHeadline` is required in a `Spotlight`. The content should be brief and direct to quickly hook the user on the intent.
 *
 */
export const SpotlightHeadline: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SpotlightHeadlineProps> & React.RefAttributes<HTMLHeadingElement>
> = forwardRef<HTMLHeadingElement, SpotlightHeadlineProps>(
	({ children, testId }: SpotlightHeadlineProps, ref) => {
		const { heading } = useContext(SpotlightContext);

		return (
			<Heading id={heading.id} ref={ref} testId={testId} size="xsmall">
				{children}
			</Heading>
		);
	},
);
