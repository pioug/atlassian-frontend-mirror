import React, { forwardRef } from 'react';

import { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/core/cross';

export interface SpotlightDismissControlProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
}

/**
 * __SpotlightDismissControl__
 *
 * SpotlightDismissControl allows the user to close the `Spotlight`.
 *
 */
export const SpotlightDismissControl = forwardRef<HTMLButtonElement, SpotlightDismissControlProps>(
	({ testId }: SpotlightDismissControlProps, ref) => {
		return (
			<IconButton
				testId={testId}
				ref={ref}
				appearance="default"
				spacing="compact"
				icon={CrossIcon}
				label="Close"
			/>
		);
	},
);
