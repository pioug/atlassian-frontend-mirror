import React, { forwardRef, type ReactNode } from 'react';

import Button, { type ButtonProps } from '@atlaskit/button/new';
import { Text } from '@atlaskit/primitives/compiled';

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
	onClick?: ButtonProps['onClick'];
}

/**
 * __Spotlight secondary action__
 *
 * `SpotlightSecondaryAction` is not required for all `Spotlight` components. It should supplement the SpotlightPrimaryAction.
 * It is intended to be used to go back to the previous step in multi step spotlight tours, or other similar actions.
 *
 */
export const SpotlightSecondaryAction = forwardRef<
	HTMLButtonElement,
	SpotlightSecondaryActionProps
>(({ onClick, children, testId }: SpotlightSecondaryActionProps, ref) => {
	return (
		<Button ref={ref} spacing="compact" testId={testId} appearance="subtle" onClick={onClick}>
			<Text as="span">{children}</Text>
		</Button>
	);
});
