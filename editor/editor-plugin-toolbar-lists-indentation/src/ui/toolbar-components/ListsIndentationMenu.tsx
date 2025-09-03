import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { messages } from '@atlaskit/editor-common/lists';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { MoreItemsIcon, ToolbarDropdownMenu } from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';
import { useIndentationState } from '../utils/hooks';

type ListsIndentationMenuProps = {
	allowHeadingAndParagraphIndentation: boolean;
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	children: React.ReactNode;
};

export const ListsIndentationMenu = ({
	children,
	api,
	allowHeadingAndParagraphIndentation,
}: ListsIndentationMenuProps) => {
	const { formatMessage } = useIntl();
	const isPatch2Enabled = expValEquals('platform_editor_toolbar_aifc_patch_2', 'isEnabled', true);
	const { editorView } = useEditorToolbar();

	const indentationState = useIndentationState({
		api,
		allowHeadingAndParagraphIndentation,
		state: editorView?.state,
	});
	const { bulletListDisabled, orderedListDisabled, taskListActive } =
		useSharedPluginStateWithSelector(api, ['list', 'taskDecision'], (states) => ({
			bulletListDisabled: states.listState?.bulletListDisabled,
			orderedListDisabled: states.listState?.orderedListDisabled,
			taskListActive: states.taskDecisionState?.isInsideTask,
		}));

	const allItemsDisabled =
		bulletListDisabled &&
		orderedListDisabled &&
		indentationState?.indentDisabled &&
		indentationState?.outdentDisabled &&
		!(isPatch2Enabled && taskListActive);

	return (
		<ToolbarDropdownMenu
			iconBefore={<MoreItemsIcon label={formatMessage(messages.lists)} />}
			isDisabled={allItemsDisabled}
			testId="editor-toolbar__lists-and-indentation-menu"
		>
			{children}
		</ToolbarDropdownMenu>
	);
};
