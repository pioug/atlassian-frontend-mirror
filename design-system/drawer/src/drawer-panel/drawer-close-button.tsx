import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import ArrowLeft from '@atlaskit/icon/core/arrow-left';

import { useEnsureIsInsideDrawer, useOnClose } from '../context';
import { type DrawerCloseButtonProps } from '../types';

/**
 * __Drawer close button
 *
 * A button that closes the drawer.
 */
export const DrawerCloseButton = ({
	icon: Icon,
	label = 'Close drawer',
	testId = 'DrawerCloseButton',
}: DrawerCloseButtonProps): React.JSX.Element => {
	useEnsureIsInsideDrawer();
	const onClose = useOnClose();

	return (
		<IconButton
			onClick={onClose}
			testId={testId}
			icon={
				Icon ? (iconProps) => <Icon {...iconProps} size="large" LEGACY_size="large" /> : ArrowLeft
			}
			label={label}
			shape="circle"
			appearance="subtle"
		/>
	);
};
