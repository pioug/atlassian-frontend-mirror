import React, { forwardRef, type ReactNode } from 'react';

import Button, { type ButtonProps } from '@atlaskit/button/new';

export interface PrimaryActionProps {
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
 * __Spotlight primary action__
 *
 * `SpotlightPrimaryAction` is required for all `Spotlight` components. It should be used to dismiss the spotlight
 * for single step spotlights, or to show the next step on multi step spotlight tours.
 *
 */
export const SpotlightPrimaryAction = forwardRef<HTMLButtonElement, PrimaryActionProps>(
	({ onClick, children, testId }: PrimaryActionProps, ref) => {
		return (
			<Button ref={ref} spacing="compact" testId={testId} appearance="primary" onClick={onClick}>
				{children}
			</Button>
		);
	},
);
