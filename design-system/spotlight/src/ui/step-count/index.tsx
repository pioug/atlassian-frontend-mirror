/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import VisuallyHidden from '@atlaskit/visually-hidden';

const styles = cssMap({
	root: {
		minWidth: 'max-content',
	},
});

export interface SpotlightStepCountProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Elements to be rendered inside the `SpotlightStepCount`.
	 */
	children?: ReactNode;
}

/**
 * __Spotlight StepCount__
 *
 * `SpotlightStepCount` groups `SpotlightAction` components.
 *
 */
export const SpotlightStepCount: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SpotlightStepCountProps> & React.RefAttributes<HTMLSpanElement>
> = forwardRef<HTMLSpanElement, SpotlightStepCountProps>(
	({ children, testId }: SpotlightStepCountProps, ref) => {
		return (
			<Flex xcss={styles.root}>
				<Text ref={ref} testId={testId}>
					{children} <VisuallyHidden>steps</VisuallyHidden>
				</Text>
			</Flex>
		);
	},
);
