import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { formatShortcut, toggleBlockQuote } from '@atlaskit/editor-common/keymaps';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/useSharedPluginStateSelector';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import { ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar/toolbar-keyboard-shortcut-hint';

import type { BlockTypePlugin } from '../../../blockTypePluginType';
import type { BlockTypeWithRank } from '../../types';
import { isSelectionInsideListNode } from '../../utils';

type QuoteButtonProps = {
	api?: ExtractInjectionAPI<BlockTypePlugin>;
	blockType: BlockTypeWithRank;
};

const shouldDisableQuoteButton = (state: EditorState | undefined) => {
	if (!state) {
		return false;
	}

	return isSelectionInsideListNode(state);
};

export const QuoteButton = ({ blockType, api }: QuoteButtonProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const availableBlockTypesInDropdown = useSharedPluginStateSelector(
		api,
		'blockType.availableBlockTypesInDropdown',
	);
	const currentBlockType = useSharedPluginStateSelector(api, 'blockType.currentBlockType');
	const { editorView } = useEditorToolbar();

	if (
		!availableBlockTypesInDropdown?.some(
			(availableBlockType) => availableBlockType.name === blockType.name,
		)
	) {
		return null;
	}

	const isDisabled = shouldDisableQuoteButton(editorView?.state);

	const onClick = () => {
		if (isDisabled) {
			return;
		}
		api?.core?.actions.execute(api?.blockType?.commands?.insertBlockQuote(INPUT_METHOD.TOOLBAR));
	};

	const shortcut = formatShortcut(toggleBlockQuote);
	const isSelected = currentBlockType === blockType;

	return (
		<ToolbarDropdownItem
			elemBefore={blockType.icon}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			onClick={onClick}
			isSelected={isSelected}
			isDisabled={isDisabled}
			ariaKeyshortcuts={shortcut}
		>
			{formatMessage(blockType.title)}
		</ToolbarDropdownItem>
	);
};
