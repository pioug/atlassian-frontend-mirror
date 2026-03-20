import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { formatShortcut, toggleBlockQuote } from '@atlaskit/editor-common/keymaps';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { ToolbarDropdownItem, ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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

	const isDisabled = expValEquals('platform_editor_small_font_size', 'isEnabled', true)
		? shouldDisableQuoteButton(editorView?.state)
		: false;

	const onClick = () => {
		if (isDisabled) {
			return;
		}
		api?.core?.actions.execute(api?.blockType?.commands?.insertBlockQuote(INPUT_METHOD.TOOLBAR));
	};

	const shortcut = formatShortcut(toggleBlockQuote);

	return (
		<ToolbarDropdownItem
			elemBefore={blockType.icon}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			onClick={onClick}
			isSelected={currentBlockType === blockType}
			isDisabled={isDisabled}
			ariaKeyshortcuts={shortcut}
		>
			{formatMessage(blockType.title)}
		</ToolbarDropdownItem>
	);
};
