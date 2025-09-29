import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import TaskIcon from '@atlaskit/icon/core/task';

import type { TasksAndDecisionsPlugin } from '../../tasksAndDecisionsPluginType';

export const TaskListBlockMenuItem = ({
	api,
}: {
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
}) => {
	const { formatMessage } = useIntl();
	const selection = useSharedPluginStateSelector(api, 'selection.selection');
	const isSelected = useMemo(() => {
		return selection && selection.$from.parent.type.name === 'taskItem';
	}, [selection]);

	const onClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const inputMethod =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const triggeredFrom = INPUT_METHOD.BLOCK_MENU;

		api?.core.actions.execute(
			api?.blockMenu?.commands.formatNode('taskList', { inputMethod, triggeredFrom }),
		);
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
