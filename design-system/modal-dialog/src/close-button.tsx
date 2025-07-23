import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/core/migration/cross';

import { type OnCloseHandler } from './types';

type CloseButtonProps = {
	/**
	 * The accessible name to give to the close button.
	 */
	label?: string;
	/**
	 * The same close handler you give to the top-level modal component.
	 */
	onClick: OnCloseHandler;
	/**
	 * The prefix to use. Renders as `{testId}--close-button`.
	 */
	testId?: string;
};

/**
 * __Close button__
 *
 * The close button is to be used for customized modal headers to ensure that
 * all users have an accessible and obvious way to close the modal dialog.
 *
 * When using this in a custom header, ensure that the close button renders
 * first in the DOM to make sure that users will encounter all elements of the
 * modal dialog, including everything within the modal header. This can be done
 * using a `Flex` primitive as the custom header's container with a flex
 * direction of `row-reverse`.
 */
export const CloseButton = ({ label, onClick, testId }: CloseButtonProps) => (
	<IconButton
		testId={testId && `${testId}--close-button`}
		appearance="subtle"
		icon={CrossIcon}
		label={label || 'Close Modal'}
		onClick={onClick}
	/>
);
