import React from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem, ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import TaskIcon from '@atlaskit/icon/core/task';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';
import { isMarkdownCompatibleToolbarEnabled } from '../utils/markdown-compatible-toolbar';

type TaskListMenuItemProps = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents?: ToolbarComponentTypes;
};

export const TaskListMenuItem = ({ api }: TaskListMenuItemProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const { editorView } = useEditorToolbar();
	const isMarkdownToolbarEnabled = isMarkdownCompatibleToolbarEnabled();
	// Mirror the sibling BulletedListMenuItem / NumberedListMenuItem pattern:
	// gate the markdown-mode field reads behind the feature flag inside the
	// selector so we don't trigger re-renders on CM6 state changes for users
	// who don't have the markdown-compatible toolbar enabled.
	const { taskListActive, markdownView, sourceBlockFormatState, sourceListFormatState } =
		useSharedPluginStateWithSelector(api, ['taskDecision', 'markdownMode'], (states) => ({
			taskListActive: states.taskDecisionState?.isInsideTask,
			markdownView: isMarkdownToolbarEnabled ? states.markdownModeState?.view : undefined,
			sourceBlockFormatState: isMarkdownToolbarEnabled
				? states.markdownModeState?.sourceBlockFormatState
				: null,
			sourceListFormatState: isMarkdownToolbarEnabled
				? states.markdownModeState?.sourceListFormatState
				: null,
		}));

	if (!editorView?.state.schema.nodes.taskItem) {
		return null;
	}

	const isInSourceView = isMarkdownToolbarEnabled && markdownView === 'syntax';
	const isSelected = isInSourceView ? sourceListFormatState?.inTaskList : taskListActive;
	const isDisabled = Boolean(isInSourceView && sourceBlockFormatState?.inCodeBlock);

	const handleClick = () => {
		if (isDisabled) {
			return;
		}
		if (isInSourceView) {
			api?.markdownMode?.actions.toggleSourceTaskList();
			return;
		}
		api?.core.actions.execute(api?.taskDecision?.commands.toggleTaskList());
	};

	return (
		<ToolbarDropdownItem
			elemBefore={<TaskIcon size="small" label="" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut="[]" />}
			isSelected={isSelected}
			isDisabled={isDisabled}
			onClick={handleClick}
		>
			{formatMessage(tasksAndDecisionsMessages.taskList)}
		</ToolbarDropdownItem>
	);
};
