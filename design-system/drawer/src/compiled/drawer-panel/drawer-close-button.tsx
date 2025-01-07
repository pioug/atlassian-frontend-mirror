import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import ArrowLeft from '@atlaskit/icon/core/migration/arrow-left';
import ArrowLeftOld from '@atlaskit/icon/glyph/arrow-left';
import { fg } from '@atlaskit/platform-feature-flags';

import { useEnsureIsInsideDrawer, useOnClose } from '../../context';
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
}: DrawerCloseButtonProps) => {
	useEnsureIsInsideDrawer();
	const onClose = useOnClose();

	return (
		<IconButton
			onClick={onClose}
			testId={testId}
			icon={
				Icon
					? (iconProps) => (
							<Icon
								{...iconProps}
								size="large"
								{...(fg('platform-visual-refresh-icon-ads-migration')
									? { LEGACY_size: 'large' }
									: {})}
							/>
						)
					: fg('platform-visual-refresh-icon-ads-migration')
						? ArrowLeft
						: // eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
							ArrowLeftOld
			}
			label={label}
			shape="circle"
			appearance="subtle"
		/>
	);
};
