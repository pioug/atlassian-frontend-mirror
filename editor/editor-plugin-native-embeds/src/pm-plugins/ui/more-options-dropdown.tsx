import React from 'react';

import type { Command, FloatingToolbarOverflowDropdown } from '@atlaskit/editor-common/types';
import DatabaseIcon from '@atlaskit/icon/core/database';
import DeleteIcon from '@atlaskit/icon/core/delete';
import EyeOpenIcon from '@atlaskit/icon/core/eye-open';
import LinkIcon from '@atlaskit/icon/core/link';
import Toggle from '@atlaskit/toggle';

/**
 * No-op command that returns true without dispatching any action.
 * Used as a placeholder for menu items that don't have functionality yet.
 */
const noopCommand: Command = () => {
	return true;
};

/**
 * Returns the "More options" overflow dropdown configuration for the native embed floating toolbar.
 */
export const getMoreOptionsDropdown = (): FloatingToolbarOverflowDropdown<Command> => {
	return {
		id: 'native-embed-more-options-button',
		type: 'overflow-dropdown',
		dropdownWidth: 250,
		options: [
			{
				id: 'native-embed-always-show-title',
				title: 'Always show title',
				icon: <EyeOpenIcon color="currentColor" spacing="spacious" label="" />,
			    elemAfter: <Toggle isChecked={true} label="Always show title" />,
				onClick: noopCommand,
			},
			{
				id: 'native-embed-set-embed-type',
				title: 'Set embed type',
				icon: <DatabaseIcon color="currentColor" spacing="spacious" label="" />,
				onClick: noopCommand,
			},
			{ type: 'separator' },
			{
				id: 'native-embed-copy-link',
				title: 'Copy link',
				icon: <LinkIcon color="currentColor" spacing="spacious" label="" />,
				onClick: noopCommand,
			},
			{
				id: 'native-embed-delete',
				title: 'Delete',
				icon: <DeleteIcon color="currentColor" spacing="spacious" label="" />,
				onClick: noopCommand,
			},
		],
	};
};
