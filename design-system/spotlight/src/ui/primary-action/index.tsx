import React, { forwardRef, type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Pressable, type PressableProps, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		color: token('color.text.inverse'),
		borderRadius: token('border.radius.100'),
		backgroundColor: token('color.background.neutral.bold'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.accent.gray'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.bold.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.bold.pressed'),
		},
	},
});

export interface SpotlightPrimaryActionProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Text to be rendered inside the `SpotlightActions`.
	 */
	children: ReactNode;

	/**
	 * The action to take when the button is clicked.
	 */
	onClick?: PressableProps['onClick'];
}

/**
 * __Spotlight primary action__
 *
 * `SpotlightPrimaryAction` is required for all `Spotlight` components. It should be used to dismiss the spotlight
 * for single step spotlights, or to show the next step on multi step spotlight tours.
 *
 */
export const SpotlightPrimaryAction = forwardRef<HTMLButtonElement, SpotlightPrimaryActionProps>(
	({ onClick, children, testId }: SpotlightPrimaryActionProps, ref) => {
		return (
			<Pressable ref={ref} testId={testId} xcss={styles.root} onClick={onClick}>
				<Text as="span">{children}</Text>
			</Pressable>
		);
	},
);
