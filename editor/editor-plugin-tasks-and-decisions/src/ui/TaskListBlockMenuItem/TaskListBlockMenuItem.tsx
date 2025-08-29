import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import TaskIcon from '@atlaskit/icon/core/task';

import type { TasksAndDecisionsPlugin } from '../../tasksAndDecisionsPluginType';

export const TaskListBlockMenuItem = ({
	api,
}: {
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin>;
}) => {
	const { formatMessage } = useIntl();
	const selection = useSharedPluginStateSelector(api, 'selection.selection');
	const isSelected = useMemo(() => {
		return selection && selection.$from.parent.type.name === 'taskItem';
	}, [selection]);

	const onClick = () => {
		api?.core.actions.execute(api?.blockMenu?.commands.formatNode('taskList'));
	};

	return (
		<ToolbarDropdownItem
			isSelected={isSelected}
			onClick={onClick}
			elemBefore={<TaskIcon label="" />}
		>
			{formatMessage(tasksAndDecisionsMessages.taskList)}
		</ToolbarDropdownItem>
	);
};
