/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/core/cross';
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

export interface SpotlightDismissControlProps {
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

	/**
	 * @default true
	 *
	 * Specifies whether the dismiss button should be focused when the spotlight is rendered.
	 * For spotlights that are triggered by user-action, this should be `true`. In the event that
	 * a spotlight is rendered on pageload, without explicit user interaction, this should be `false`.
	 */
	autoFocus?: boolean;
}

/**
 * __SpotlightDismissControl__
 *
 * SpotlightDismissControl allows the user to close the `Spotlight`.
 *
 */
export const SpotlightDismissControl: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SpotlightDismissControlProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, SpotlightDismissControlProps>(
	({ autoFocus = true, onClick, testId }: SpotlightDismissControlProps, ref) => {
		return (
			<Pressable
				// eslint-disable-next-line jsx-a11y/no-autofocus -- VERIFIED: autoFocus moving to first focusable element on non-modal modal dialog.
				autoFocus={autoFocus}
				onClick={onClick}
				ref={ref}
				testId={testId}
				xcss={styles.root}
				aria-label="Dismiss"
			>
				<CrossIcon label="Close" />
			</Pressable>
		);
	},
);
