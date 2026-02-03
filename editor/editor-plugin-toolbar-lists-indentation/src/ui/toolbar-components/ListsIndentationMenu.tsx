import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { messages } from '@atlaskit/editor-common/lists';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { MoreItemsIcon, ToolbarDropdownMenu, ToolbarTooltip } from '@atlaskit/editor-toolbar';
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
}: ListsIndentationMenuProps): React.JSX.Element => {
	const { formatMessage } = useIntl();
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
		!taskListActive;

	if (expValEquals('platform_editor_hide_toolbar_tooltips_fix', 'isEnabled', true)) {
		return (
			<ToolbarDropdownMenu
				iconBefore={<MoreItemsIcon label={formatMessage(messages.lists)} />}
				isDisabled={allItemsDisabled}
				testId="editor-toolbar__lists-and-indentation-menu"
				label={formatMessage(messages.lists)}
				tooltipComponent={<ToolbarTooltip content={formatMessage(messages.lists)}/>}
			>
				{children}
			</ToolbarDropdownMenu>
		);
	}

	return (
		<ToolbarTooltip content={formatMessage(messages.lists)}>
			<ToolbarDropdownMenu
				iconBefore={<MoreItemsIcon label={formatMessage(messages.lists)} />}
				isDisabled={allItemsDisabled}
				testId="editor-toolbar__lists-and-indentation-menu"
				label={formatMessage(messages.lists)}
			>
				{children}
			</ToolbarDropdownMenu>
		</ToolbarTooltip>
	);
};
