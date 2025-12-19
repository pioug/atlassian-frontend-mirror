import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import TaskIcon from '@atlaskit/icon/core/task';

import type { TasksAndDecisionsPlugin } from '../../tasksAndDecisionsPluginType';

const nodeName = 'taskList';

export const TaskListBlockMenuItem = ({
	api,
}: {
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
}): React.JSX.Element | null => {
	const { formatMessage } = useIntl();

	const onClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const triggeredFrom =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const inputMethod = INPUT_METHOD.BLOCK_MENU;

		api?.core.actions.execute(({ tr }) => {
			const command = api?.blockMenu?.commands.transformNode(tr.doc.type.schema.nodes.taskList, {
				inputMethod,
				triggeredFrom,
				targetTypeName: nodeName,
			});
			return command ? command({ tr }) : null;
		});
	};

	const isTransfromToPanelDisabled = api?.blockMenu?.actions.isTransformOptionDisabled(nodeName);
	if (isTransfromToPanelDisabled) {
		return null;
	}

	return (
		<ToolbarDropdownItem onClick={onClick} elemBefore={<TaskIcon label="" />}>
			{formatMessage(tasksAndDecisionsMessages.taskList)}
		</ToolbarDropdownItem>
	);
};
