/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'row-reverse',
		gap: token('space.100'),
	},
});

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
export const SpotlightControls: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SpotlightControlsProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, SpotlightControlsProps>(
	({ testId, children }: SpotlightControlsProps, ref) => {
		return (
			<div data-testid={testId} ref={ref} css={styles.root} role="group">
				{children}
			</div>
		);
	},
);
