import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { ToolTipContent, insertTaskList } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages/insert-block';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import { TOOLBAR_BUTTON_TEST_ID } from '@atlaskit/editor-common/toolbar/keys';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { TaskIcon } from '@atlaskit/editor-toolbar/task-icon';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

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
				testId={TOOLBAR_BUTTON_TEST_ID.TASK_LIST}
			/>
		</ToolbarTooltip>
	);
};
