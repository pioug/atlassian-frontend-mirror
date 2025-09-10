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
		borderRadius: token('radius.large'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.150'),
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		boxShadow: token('elevation.shadow.overflow'),
	},
});

const placementStyles = cssMap({
	'top-start': {
		insetBlockEnd: token('space.075'),
		insetInlineEnd: token('space.negative.250'),
	},
	'top-end': {
		insetBlockEnd: token('space.075'),
		insetInlineStart: token('space.negative.250'),
	},
	'right-start': {
		insetInlineStart: token('space.075'),
		insetBlockEnd: token('space.negative.200'),
	},
	'right-end': {
		insetInlineStart: token('space.075'),
		insetBlockStart: token('space.negative.200'),
	},
	'bottom-start': {
		insetBlockStart: token('space.075'),
		insetInlineEnd: token('space.negative.250'),
	},
	'bottom-end': {
		insetBlockStart: token('space.075'),
		insetInlineStart: token('space.negative.250'),
	},
	'left-start': {
		insetInlineEnd: token('space.075'),
		insetBlockEnd: token('space.negative.200'),
	},
	'left-end': {
		insetInlineEnd: token('space.075'),
		insetBlockStart: token('space.negative.200'),
	},
});

export interface SpotlightCardProps {
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
export const SpotlightCard = forwardRef<HTMLDivElement, SpotlightCardProps>(
	({ children, testId }: SpotlightCardProps, ref) => {
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
