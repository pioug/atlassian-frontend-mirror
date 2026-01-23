import React from 'react';

import { IconButton } from "@atlaskit/button/new";
import CrossIcon from "@atlaskit/icon/core/cross";

type CloseButtonProps = {
	/**
	 * The accessible name to give to the close button.
	 *
	 * Used as the aria-label for the close button to ensure screen reader
		 * accessibility.
	 */
	label: string;

	/**
	 * The handler called when the close button is clicked. Typically, this
	 * should trigger the same close logic as the top-level flyout menu
	 * component.
	 */
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

	/**
	 * A unique string that appears as data attribute data-testid in the
		 * rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
};

/**
 * __Close button__
 *
 * The close button is to be used for flyout menu item headers to ensure that
 * all users have an accessible and obvious way to close the flyout menu.
 *
 * Ensure that the close button renders first in the DOM to make sure that
 * users will encounter all elements of the flyout menu, including everything
 * within the flyout menu header. This can be done using a `Flex` primitive as
 * the custom header's container with a flex direction of `row-reverse`.
 */
export const CloseButton: (props: CloseButtonProps) => React.JSX.Element = ({
	label,
	onClick,
	testId,
}) => (
	<IconButton
		testId={testId}
		appearance="subtle"
		icon={CrossIcon}
		label={label}
		onClick={onClick}
	/>
);
