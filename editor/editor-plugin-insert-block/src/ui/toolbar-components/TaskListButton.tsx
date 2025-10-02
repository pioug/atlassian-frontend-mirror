import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { ToolTipContent, insertTaskList } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButton, ToolbarTooltip, TaskIcon } from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

type TaskListButtonProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};

export const TaskListButton = ({ api }: TaskListButtonProps) => {
	const { formatMessage } = useIntl();

	const { editorView } = useEditorToolbar();

	if (!editorView?.state.schema.nodes.taskItem) {
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
				expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true) ? (
					<ToolTipContent description={formatMessage(messages.action)} keymap={insertTaskList} />
				) : (
					formatMessage(messages.action)
				)
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
