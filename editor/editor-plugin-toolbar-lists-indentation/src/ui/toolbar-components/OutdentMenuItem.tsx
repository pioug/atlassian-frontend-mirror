import React from 'react';

import { useIntl } from 'react-intl-next';

import { outdent as toggleOutdentKeymap, formatShortcut } from '@atlaskit/editor-common/keymaps';
import { indentationMessages } from '@atlaskit/editor-common/messages';
import { getInputMethodFromParentKeys, useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	OutdentIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';
import { useIndentationState } from '../utils/hooks';

type OutdentMenuItemType = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	allowHeadingAndParagraphIndentation: boolean;
	showIndentationButtons: boolean;
	parents: ToolbarComponentTypes;
};

export const OutdentMenuItem = ({
	api,
	allowHeadingAndParagraphIndentation,
	showIndentationButtons,
	parents,
}: OutdentMenuItemType) => {
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
				api?.indentation?.actions.outdentParagraphOrHeading(inputMethod)(
					editorView?.state,
					editorView?.dispatch,
				);
			}
		}
		if (node === 'list') {
			api?.core.actions.execute(api?.list.commands.outdentList(inputMethod));
		}
		if (node === 'taskList') {
			if (editorView?.state) {
				api?.taskDecision?.actions.outdentTaskList(inputMethod)(
					editorView?.state,
					editorView?.dispatch,
				);
			}
		}
	};

	const shortcut = formatShortcut(toggleOutdentKeymap);

	return (
		<ToolbarDropdownItem
			elemBefore={<OutdentIcon label="" />}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			isDisabled={indentationState?.outdentDisabled}
			ariaKeyshortcuts={shortcut}
			onClick={onClick}
		>
			{formatMessage(indentationMessages.outdent)}
		</ToolbarDropdownItem>
	);
};
