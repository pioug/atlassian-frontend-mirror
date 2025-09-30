import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { formatShortcut, toggleTaskList } from '@atlaskit/editor-common/keymaps';
import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
	TaskIcon,
} from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import type { TasksAndDecisionsPlugin } from '../../tasksAndDecisionsPluginType';

type TaskListMenuItemProps = {
	api?: ExtractInjectionAPI<TasksAndDecisionsPlugin>;
	parents?: ToolbarComponentTypes;
};

export const TaskListMenuItem = ({ api }: TaskListMenuItemProps) => {
	const { formatMessage } = useIntl();
	const { isInsideTask } = useSharedPluginStateWithSelector(api, ['taskDecision'], (states) => ({
		isInsideTask: states.taskDecisionState?.isInsideTask,
	}));

	const handleClick = () => {
		api?.core.actions.execute(api?.taskDecision?.commands.toggleTaskList());
	};

	return (
		<ToolbarDropdownItem
			elemBefore={<TaskIcon size="small" label="" />}
			elemAfter={
				<ToolbarKeyboardShortcutHint shortcut={formatShortcut(toggleTaskList) as string} />
			}
			isSelected={isInsideTask}
			isDisabled={false}
			onClick={handleClick}
			ariaKeyshortcuts={formatShortcut(toggleTaskList)}
		>
			{formatMessage(tasksAndDecisionsMessages.taskList)}
		</ToolbarDropdownItem>
	);
};
