import React from 'react';

import { useIntl } from 'react-intl-next';

import { indent as toggleIndentKeymap, formatShortcut } from '@atlaskit/editor-common/keymaps';
import { indentationMessages } from '@atlaskit/editor-common/messages';
import { getInputMethodFromParentKeys, useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	IndentIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';
import { useIndentationState } from '../utils/hooks';

type IndentMenuItemType = {
	allowHeadingAndParagraphIndentation: boolean;
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
	showIndentationButtons: boolean;
};

export const IndentMenuItem = ({
	api,
	showIndentationButtons,
	allowHeadingAndParagraphIndentation,
	parents,
}: IndentMenuItemType): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const { editorView } = useEditorToolbar();

	const indentationState = useIndentationState({
		api,
		allowHeadingAndParagraphIndentation,
		state: editorView?.state,
	});

	if (!showIndentationButtons) {
		return null;
	}

	const onClick = () => {
		const inputMethod = getInputMethodFromParentKeys(parents);

		const node = indentationState?.node;
		if (node === 'paragraph_heading') {
			if (editorView?.state) {
				api?.indentation?.actions.indentParagraphOrHeading(inputMethod)(
					editorView?.state,
					editorView?.dispatch,
				);
			}
		}
		if (node === 'list') {
			api?.core?.actions.execute(api?.list?.commands.indentList(inputMethod));
		}
		if (node === 'taskList') {
			if (editorView?.state) {
				api?.taskDecision?.actions.indentTaskList(inputMethod)(
					editorView?.state,
					editorView?.dispatch,
				);
			}
		}
	};

	const shortcut = formatShortcut(toggleIndentKeymap);

	return (
		<ToolbarDropdownItem
			elemBefore={<IndentIcon size="small" label="" />}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			isDisabled={indentationState?.indentDisabled}
			ariaKeyshortcuts={shortcut}
			onClick={onClick}
		>
			{formatMessage(indentationMessages.indent)}
		</ToolbarDropdownItem>
	);
};
