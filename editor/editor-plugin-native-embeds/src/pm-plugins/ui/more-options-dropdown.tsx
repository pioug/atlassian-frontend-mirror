import React from 'react';

import type {
	Command,
	DropdownOptionT,
	FloatingToolbarOverflowDropdown,
} from '@atlaskit/editor-common/types';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import DatabaseIcon from '@atlaskit/icon/core/database';
import DeleteIcon from '@atlaskit/icon/core/delete';
import EyeOpenIcon from '@atlaskit/icon/core/eye-open';
import LinkIcon from '@atlaskit/icon/core/link';
import Toggle from '@atlaskit/toggle';

import { createCopyLinkCommand, createDeleteCommand } from '../commands';

/**
 * No-op command that returns true without dispatching any action.
 * Used as a placeholder for menu items that don't have functionality yet.
 */
const noopCommand: Command = () => {
	return true;
};

type DeleteHoverProps = Pick<
	DropdownOptionT<Command>,
	'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur'
>;

/**
 * Returns the "More options" overflow dropdown configuration for the native embed floating toolbar.
 */
export const getMoreOptionsDropdown = (
	selectedNativeEmbed: ContentNodeWithPos,
	deleteHoverProps: DeleteHoverProps,
): FloatingToolbarOverflowDropdown<Command> => {
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
				onClick: createCopyLinkCommand(selectedNativeEmbed),
			},
			{
				id: 'native-embed-delete',
				title: 'Delete',
				icon: <DeleteIcon color="currentColor" spacing="spacious" label="" />,
				onClick: createDeleteCommand(selectedNativeEmbed),
				...deleteHoverProps,
			},
		],
	};
};
