/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		position: 'relative',
		width: '295px',
		borderRadius: token('border.radius.200'),
	},
});

export interface SpotlightProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Elements to be rendered inside the spotlight.
	 */
	children?: ReactNode;
}

/**
 * __Spotlight__
 *
 * The base UI card that wraps composable spotlight components.
 *
 */
export const Spotlight = forwardRef<HTMLDivElement, SpotlightProps>(
	({ children, testId }: SpotlightProps, ref) => {
		return (
			<Box
				ref={ref}
				xcss={styles.root}
				backgroundColor="color.background.neutral.bold"
				testId={testId}
			>
				{children}
			</Box>
		);
	},
);
