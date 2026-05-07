/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode, useContext } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Pressable, type PressableProps, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { SpotlightContext } from '../../controllers/context';

const styles = cssMap({
	root: {
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

export interface SpotlightSecondaryActionProps {
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

	/**
	 * An accessible label to read out in the event that the displayed text does not provide enough context.
	 */
	'aria-label'?: string;
}

/**
 * __Spotlight secondary action__
 *
 * `SpotlightSecondaryAction` is not required for all spotlight components. It should supplement the `SpotlightPrimaryAction`.
 * It is intended to be used to go back to the previous step in multi step spotlight tours, or other similar actions.
 *
 */
export const SpotlightSecondaryAction: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SpotlightSecondaryActionProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, SpotlightSecondaryActionProps>(
	({ 'aria-label': ariaLabel, onClick, children, testId }: SpotlightSecondaryActionProps, ref) => {
		const { secondaryAction } = useContext(SpotlightContext);
		const back: PressableProps['onClick'] = (event) => {
			secondaryAction.action.current(event);
		};

		return (
			<Pressable
				aria-label={ariaLabel}
				ref={ref}
				testId={testId}
				xcss={styles.root}
				onClick={onClick || back}
			>
				<Text as="span">{children}</Text>
			</Pressable>
		);
	},
);
