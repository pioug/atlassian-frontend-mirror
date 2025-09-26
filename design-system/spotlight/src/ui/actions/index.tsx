/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Flex } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	root: {
		width: '100%',
	},
});

export interface SpotlightActionsProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Elements to be rendered inside the `SpotlightActions`.
	 */
	children?: ReactNode;
}

/**
 * __Spotlight actions__
 *
 * `SpotlightActions` groups `SpotlightAction` components.
 *
 */
export const SpotlightActions: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SpotlightActionsProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, SpotlightActionsProps>(
	({ children, testId }: SpotlightActionsProps, ref) => {
		return (
			<Flex
				ref={ref}
				testId={testId}
				xcss={styles.root}
				role="group"
				justifyContent="end"
				gap="space.050"
			>
				{children}
			</Flex>
		);
	},
);
