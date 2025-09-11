import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import {
	toggleBulletList as toggleBulletListKeymap,
	formatShortcut,
} from '@atlaskit/editor-common/keymaps';
import { listMessages } from '@atlaskit/editor-common/messages';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ListBulletedIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

type BulletedListMenuItemType = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
};

export const BulletedListMenuItem = ({ api, parents }: BulletedListMenuItemType) => {
	const { formatMessage } = useIntl();
	const isTaskListItemEnabled = expValEquals(
		'platform_editor_toolbar_task_list_menu_item',
		'isEnabled',
		true,
	);
	const { bulletListActive, bulletListDisabled, taskListActive } = useSharedPluginStateWithSelector(
		api,
		['list', 'taskDecision'],
		(states) => ({
			bulletListActive: states.listState?.bulletListActive,
			bulletListDisabled: states.listState?.bulletListDisabled,
			taskListActive: states.taskDecisionState?.isInsideTask,
		}),
	);

	const onClick = () => {
		api?.core.actions.execute(
			isTaskListItemEnabled && taskListActive
				? api?.taskDecision?.commands.toggleTaskList('bulletList')
				: api?.list.commands.toggleBulletList(getInputMethodFromParentKeys(parents)),
		);
	};

	const shortcut = formatShortcut(toggleBulletListKeymap);

	return (
		<ToolbarDropdownItem
			elemBefore={<ListBulletedIcon size="small" label="" />}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			isSelected={bulletListActive}
			isDisabled={
				isTaskListItemEnabled ? bulletListDisabled && !taskListActive : bulletListDisabled
			}
			onClick={onClick}
			ariaKeyshortcuts={shortcut}
		>
			{formatMessage(listMessages.bulletedList)}
		</ToolbarDropdownItem>
	);
};
