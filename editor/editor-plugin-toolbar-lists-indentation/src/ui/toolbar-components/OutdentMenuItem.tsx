import React from 'react';

import { useIntl } from 'react-intl';

import { outdent as toggleOutdentKeymap, formatShortcut } from '@atlaskit/editor-common/keymaps';
import { messages as indentationMessages } from '@atlaskit/editor-common/messages/indentation';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model/types';
import { OutdentIcon } from '@atlaskit/editor-toolbar/outdent-icon';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import { ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar/toolbar-keyboard-shortcut-hint';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';
import { useIndentationState } from '../utils/hooks';

type OutdentMenuItemType = {
	allowHeadingAndParagraphIndentation: boolean;
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
	showIndentationButtons: boolean;
};

export const OutdentMenuItem = ({
	api,
	allowHeadingAndParagraphIndentation,
	showIndentationButtons,
	parents,
}: OutdentMenuItemType): React.JSX.Element | null => {
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
			elemBefore={<OutdentIcon size="small" label="" />}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			isDisabled={indentationState?.outdentDisabled}
			ariaKeyshortcuts={shortcut}
			onClick={onClick}
		>
			{formatMessage(indentationMessages.outdent)}
		</ToolbarDropdownItem>
	);
};
