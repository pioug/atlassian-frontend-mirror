import React, { forwardRef } from 'react';

import { IconButton, type IconButtonProps } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/core/cross';

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
	onClick?: IconButtonProps['onClick'];
}

/**
 * __SpotlightDismissControl__
 *
 * SpotlightDismissControl allows the user to close the `Spotlight`.
 *
 */
export const SpotlightDismissControl = forwardRef<HTMLButtonElement, SpotlightDismissControlProps>(
	({ onClick, testId }: SpotlightDismissControlProps, ref) => {
		return (
			<IconButton
				appearance="default"
				icon={CrossIcon}
				label="Close"
				onClick={onClick}
				ref={ref}
				spacing="compact"
				testId={testId}
			/>
		);
	},
);
