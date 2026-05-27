import React from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { formatShortcut, toggleTaskList } from '@atlaskit/editor-common/keymaps';
import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
	TaskIcon,
} from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { TasksAndDecisionsPlugin } from '../../tasksAndDecisionsPluginType';

type TaskListMenuItemProps = {
	api?: ExtractInjectionAPI<TasksAndDecisionsPlugin>;
	parents?: ToolbarComponentTypes;
};

export const TaskListMenuItem = ({ api }: TaskListMenuItemProps): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const isMarkdownToolbarEnabled =
		expValEqualsNoExposure('cc-markdown-mode', 'isEnabled', true) &&
		fg('platform_editor_markdown_compatible_toolbar');
	const { isInsideTask, markdownView, sourceBlockFormatState, sourceListFormatState } =
		useSharedPluginStateWithSelector(api, ['taskDecision', 'markdownMode'], (states) => ({
			isInsideTask: states.taskDecisionState?.isInsideTask,
			markdownView: isMarkdownToolbarEnabled ? states.markdownModeState?.view : undefined,
			sourceBlockFormatState: isMarkdownToolbarEnabled
				? states.markdownModeState?.sourceBlockFormatState
				: null,
			sourceListFormatState: isMarkdownToolbarEnabled
				? states.markdownModeState?.sourceListFormatState
				: null,
		}));

	const isInSourceView = isMarkdownToolbarEnabled && markdownView === 'syntax';
	const isSelected = isInSourceView ? sourceListFormatState?.inTaskList : isInsideTask;
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
			elemAfter={
				<ToolbarKeyboardShortcutHint shortcut={formatShortcut(toggleTaskList) as string} />
			}
			isSelected={isSelected}
			isDisabled={isDisabled}
			onClick={handleClick}
			ariaKeyshortcuts={formatShortcut(toggleTaskList)}
		>
			{formatMessage(tasksAndDecisionsMessages.taskList)}
		</ToolbarDropdownItem>
	);
};
