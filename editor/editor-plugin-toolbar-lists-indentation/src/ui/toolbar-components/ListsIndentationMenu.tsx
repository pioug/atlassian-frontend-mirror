import React from 'react';

import { useIntl } from 'react-intl';

import { messages } from '@atlaskit/editor-common/lists/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { MoreItemsIcon } from '@atlaskit/editor-toolbar/more-items-icon';
import { ToolbarDropdownMenu } from '@atlaskit/editor-toolbar/toolbar-dropdown-menu';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

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

	return (
		<ToolbarDropdownMenu
			iconBefore={<MoreItemsIcon label={formatMessage(messages.lists)} />}
			isDisabled={allItemsDisabled}
			testId="editor-toolbar__lists-and-indentation-menu"
			label={formatMessage(messages.lists)}
			tooltipComponent={<ToolbarTooltip content={formatMessage(messages.lists)} />}
		>
			{children}
		</ToolbarDropdownMenu>
	);
};
