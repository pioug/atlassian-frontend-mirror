import React, { forwardRef } from 'react';

import { cssMap } from '@atlaskit/css';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { Pressable, type PressableProps } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingBlock: token('space.075'),
		color: token('color.text.inverse'),
		borderRadius: token('radius.small'),
		backgroundColor: token('color.background.neutral.bold'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.bold.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.bold.pressed'),
		},
	},
});

export interface SpotlightShowMoreControlProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * The action to take when the button is clicked.
	 */
	onClick?: PressableProps['onClick'];
}

/**
 * __SpotlightShowMoreControl__
 *
 * SpotlightShowMoreControl allows the user to close the `Spotlight`.
 *
 */
export const SpotlightShowMoreControl = forwardRef<
	HTMLButtonElement,
	SpotlightShowMoreControlProps
>(({ onClick, testId }: SpotlightShowMoreControlProps, ref) => {
	return (
		<Pressable xcss={styles.root} onClick={onClick} ref={ref} testId={testId}>
			<ShowMoreHorizontalIcon label="Show more" />
		</Pressable>
	);
});
