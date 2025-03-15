import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/core/migration/close--cross';

import { type OnCloseHandler } from './types';

/**
 * __Close button__
 *
 * The close button is to be used for customized modal headers to ensure that
 * all users have an accessible and obvious way to close the modal dialog.
 */
export const CloseButton = ({
	label,
	onClick,
	testId,
}: {
	label?: string;
	onClick: OnCloseHandler;
	testId?: string;
}) => (
	<IconButton
		testId={testId && `${testId}--close-button`}
		appearance="subtle"
		icon={CrossIcon}
		label={label || 'Close Modal'}
		onClick={onClick}
	/>
);
