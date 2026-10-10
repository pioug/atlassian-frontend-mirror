import React from 'react';

import { useIntl } from 'react-intl';

import { formatShortcut, toggleTaskList } from '@atlaskit/editor-common/keymaps';
import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages/tasks-and-decisions';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model/types';
import { TaskIcon } from '@atlaskit/editor-toolbar/task-icon';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import { ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar/toolbar-keyboard-shortcut-hint';

import type { TasksAndDecisionsPlugin } from '../../tasksAndDecisionsPluginType';

type TaskListMenuItemProps = {
	api?: ExtractInjectionAPI<TasksAndDecisionsPlugin>;
	parents?: ToolbarComponentTypes;
};

export const TaskListMenuItem = ({ api }: TaskListMenuItemProps): React.JSX.Element => {
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
			onClick={handleClick}
			ariaKeyshortcuts={formatShortcut(toggleTaskList)}
		>
			{formatMessage(tasksAndDecisionsMessages.taskList)}
		</ToolbarDropdownItem>
	);
};
