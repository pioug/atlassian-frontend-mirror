import React, { forwardRef } from 'react';

import { IconButton, type IconButtonProps } from '@atlaskit/button/new';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';

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
	onClick?: IconButtonProps['onClick'];
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
		<IconButton
			appearance="default"
			icon={ShowMoreHorizontalIcon}
			label="Close"
			onClick={onClick}
			ref={ref}
			spacing="compact"
			testId={testId}
		/>
	);
});
