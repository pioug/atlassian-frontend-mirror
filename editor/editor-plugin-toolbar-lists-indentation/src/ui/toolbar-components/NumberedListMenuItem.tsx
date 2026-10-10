import React from 'react';

import { useIntl } from 'react-intl';

import {
	toggleOrderedList as toggleOrderedListKeymap,
	formatShortcut,
} from '@atlaskit/editor-common/keymaps';
import { messages as listMessages } from '@atlaskit/editor-common/messages/list';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model/types';
import { ListNumberedIcon } from '@atlaskit/editor-toolbar/list-numbered-icon';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import { ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar/toolbar-keyboard-shortcut-hint';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

type NumberedListMenuItemType = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
};

export const NumberedListMenuItem = ({
	api,
	parents,
}: NumberedListMenuItemType): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const { orderedListActive, orderedListDisabled, taskListActive } =
		useSharedPluginStateWithSelector(api, ['list', 'taskDecision'], (states) => ({
			orderedListActive: states.listState?.orderedListActive,
			orderedListDisabled: states.listState?.orderedListDisabled,
			taskListActive: states.taskDecisionState?.isInsideTask,
		}));

	const onClick = () => {
		api?.core.actions.execute(
			taskListActive
				? api?.taskDecision?.commands.toggleTaskList('orderedList')
				: api?.list.commands.toggleOrderedList(getInputMethodFromParentKeys(parents)),
		);
	};

	const shortcut = formatShortcut(toggleOrderedListKeymap);

	return (
		<ToolbarDropdownItem
			elemBefore={<ListNumberedIcon size="small" label="" />}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			isSelected={orderedListActive}
			isDisabled={orderedListDisabled && !taskListActive}
			onClick={onClick}
			ariaKeyshortcuts={shortcut}
		>
			{formatMessage(listMessages.orderedList)}
		</ToolbarDropdownItem>
	);
};
