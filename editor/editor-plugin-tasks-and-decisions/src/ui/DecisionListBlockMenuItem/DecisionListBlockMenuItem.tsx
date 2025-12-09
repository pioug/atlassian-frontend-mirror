import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import DecisionIcon from '@atlaskit/icon/core/decision';

import type { TasksAndDecisionsPlugin } from '../../tasksAndDecisionsPluginType';

export const DecisionListBlockMenuItem = ({
	api,
}: {
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const selection = useSharedPluginStateWithSelector(
		api,
		['selection'],
		(states) => states.selectionState?.selection,
	);
	const isSelected = useMemo(() => {
		return selection && selection.$from.parent.type.name === 'decisionItem';
	}, [selection]);

	const onClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const triggeredFrom =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const inputMethod = INPUT_METHOD.BLOCK_MENU;

		api?.core.actions.execute(({ tr }) => {
			const command = api?.blockMenu?.commands.transformNode(
				tr.doc.type.schema.nodes.decisionList,
				{
					inputMethod,
					triggeredFrom,
					targetTypeName: 'decisionList',
				},
			);
			return command ? command({ tr }) : null;
		});
	};

	return (
		<ToolbarDropdownItem
			isSelected={isSelected}
			onClick={onClick}
			elemBefore={<DecisionIcon label="" />}
		>
			{formatMessage(blockMenuMessages.decisionList)}
		</ToolbarDropdownItem>
	);
};
