import React from 'react';

import { useIntl } from 'react-intl';

import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages/tasks-and-decisions';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import { ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar/toolbar-keyboard-shortcut-hint';
import TaskIcon from '@atlaskit/icon/core/task';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

type TaskListMenuItemProps = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents?: ToolbarComponentTypes;
};

export const TaskListMenuItem = ({ api }: TaskListMenuItemProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const { editorView } = useEditorToolbar();
	const { taskListActive } = useSharedPluginStateWithSelector(api, ['taskDecision'], (states) => ({
		taskListActive: states.taskDecisionState?.isInsideTask,
	}));

	if (!editorView?.state.schema.nodes.taskItem) {
		return null;
	}

	const handleClick = () => {
		api?.core.actions.execute(api?.taskDecision?.commands.toggleTaskList());
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
