/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
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
	 * Media to be displayed. This can be an image, video, gif that helps communicate spotlight intent.
	 */
	children: ReactNode;
}

/**
 * __SpotlightMedia__
 *
 * `SpotlightMedia` is optional in a `Spotlight`.
 *
 */
export const SpotlightMedia: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SpotlightMediaProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, SpotlightMediaProps>(
	({ children, testId }: SpotlightMediaProps, ref) => {
		return (
			<Box ref={ref} xcss={styles.root} testId={testId}>
				{children}
			</Box>
		);
	},
);
