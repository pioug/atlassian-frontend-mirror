import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import {
	toggleOrderedList as toggleOrderedListKeymap,
	formatShortcut,
} from '@atlaskit/editor-common/keymaps';
import { listMessages } from '@atlaskit/editor-common/messages';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ListNumberedIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

type NumberedListMenuItemType = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
};

export const NumberedListMenuItem = ({ api, parents }: NumberedListMenuItemType) => {
	const { formatMessage } = useIntl();
	const { orderedListActive, orderedListDisabled } = useSharedPluginStateWithSelector(
		api,
		['list'],
		(states) => ({
			orderedListActive: states.listState?.orderedListActive,
			orderedListDisabled: states.listState?.orderedListDisabled,
		}),
	);

	const onClick = () => {
		api?.core.actions.execute(
			api?.list.commands.toggleOrderedList(getInputMethodFromParentKeys(parents)),
		);
	};

	const shortcut = formatShortcut(toggleOrderedListKeymap);

	return (
		<ToolbarDropdownItem
			elemBefore={<ListNumberedIcon label="" />}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			isSelected={orderedListActive}
			isDisabled={orderedListDisabled}
			onClick={onClick}
			ariaKeyshortcuts={shortcut}
		>
			{formatMessage(listMessages.orderedList)}
		</ToolbarDropdownItem>
	);
};
