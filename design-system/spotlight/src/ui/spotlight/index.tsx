/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode, useContext } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { SpotlightContext } from '../../controllers/context';

import { Caret } from './caret';

const styles = cssMap({
	root: {
		position: 'relative',
	},
	card: {
		position: 'absolute',
		width: '295px',
		borderRadius: token('border.radius.200'),
		paddingBlock: token('space.150'),
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
	},
});

const placementStyles = cssMap({
	'top-start': {
		bottom: token('space.100'),
		right: token('space.negative.200'),
	},
	'top-end': {
		bottom: token('space.100'),
		left: token('space.negative.200'),
	},
	'right-start': {
		left: token('space.100'),
		bottom: token('space.negative.200'),
	},
	'right-end': {
		left: token('space.100'),
		top: token('space.negative.200'),
	},
	'bottom-start': {
		top: token('space.100'),
		right: token('space.negative.200'),
	},
	'bottom-end': {
		top: token('space.100'),
		left: token('space.negative.200'),
	},
	'left-start': {
		right: token('space.100'),
		bottom: token('space.negative.200'),
	},
	'left-end': {
		right: token('space.100'),
		top: token('space.negative.200'),
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
		const { placement } = useContext(SpotlightContext);

		return (
			<div css={styles.root} data-testid={testId} ref={ref}>
				<Caret />
				<Box
					backgroundColor="color.background.neutral.bold"
					xcss={cx(styles.card, placementStyles[placement])}
				>
					{children}
				</Box>
			</div>
		);
	},
);
