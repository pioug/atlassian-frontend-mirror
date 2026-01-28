import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { ToolTipContent, insertTaskList } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButton, ToolbarTooltip, TaskIcon } from '@atlaskit/editor-toolbar';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

type TaskListButtonProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};

export const TaskListButton = ({ api }: TaskListButtonProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();

	const { editorView } = useEditorToolbar();

	if (!api?.taskDecision) {
		return null;
	}

	const onClick = () => {
		if (editorView) {
			const { state, dispatch } = editorView;
			api?.taskDecision?.actions.insertTaskDecision('taskList', INPUT_METHOD.TOOLBAR)(
				state,
				dispatch,
			);
		}
	};

	return (
		<ToolbarTooltip
			content={
				<ToolTipContent description={formatMessage(messages.action)} keymap={insertTaskList} />
			}
		>
			<ToolbarButton
				iconBefore={<TaskIcon label={formatMessage(messages.action)} size="small" />}
				onClick={onClick}
				ariaKeyshortcuts="[ ] Space"
			/>
		</ToolbarTooltip>
	);
};
