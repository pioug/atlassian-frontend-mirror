import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { messages } from '@atlaskit/editor-common/lists';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { MoreItemsIcon, ToolbarDropdownMenu } from '@atlaskit/editor-toolbar';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';
import { useIndentationState } from '../utils/hooks';

type ListsIndentationMenuProps = {
	children: React.ReactNode;
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	allowHeadingAndParagraphIndentation: boolean;
};

export const ListsIndentationMenu = ({
	children,
	api,
	allowHeadingAndParagraphIndentation,
}: ListsIndentationMenuProps) => {
	const { formatMessage } = useIntl();
	const { editorView } = useEditorToolbar();

	const indentationState = useIndentationState({
		api,
		allowHeadingAndParagraphIndentation,
		state: editorView?.state,
	});
	const { bulletListDisabled, orderedListDisabled } = useSharedPluginStateWithSelector(
		api,
		['list'],
		(states) => ({
			bulletListDisabled: states.listState?.bulletListDisabled,
			orderedListDisabled: states.listState?.orderedListDisabled,
		}),
	);

	const allItemsDisabled =
		bulletListDisabled &&
		orderedListDisabled &&
		indentationState?.indentDisabled &&
		indentationState?.outdentDisabled;

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
