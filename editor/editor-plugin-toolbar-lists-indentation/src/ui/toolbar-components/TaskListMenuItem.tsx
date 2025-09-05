import React from 'react';

import { useIntl } from 'react-intl-next';

import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarDropdownItem, ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import TaskIcon from '@atlaskit/icon/core/task';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

type TaskListMenuItemProps = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
};

export const TaskListMenuItem = ({ api, parents }: TaskListMenuItemProps) => {
	const { formatMessage } = useIntl();
	const taskListActive = useSharedPluginStateSelector(api, 'taskDecision.isInsideTask');

	const handleClick = () => {
		// Placeholder onClick - no logic as per requirements
		// This will be implemented in a separate ticket
	};

	return (
		<ToolbarDropdownItem
			elemBefore={<TaskIcon size="small" label="" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut="[]" />}
			isSelected={taskListActive}
			isDisabled={false}
			onClick={handleClick}
		>
			{formatMessage(tasksAndDecisionsMessages.taskList)}
		</ToolbarDropdownItem>
	);
};
