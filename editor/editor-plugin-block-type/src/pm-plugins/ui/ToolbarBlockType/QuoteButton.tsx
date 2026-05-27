import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { formatShortcut, toggleBlockQuote } from '@atlaskit/editor-common/keymaps';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { ToolbarDropdownItem, ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

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
	const isMarkdownBridgeEnabled =
		expValEqualsNoExposure('cc-markdown-mode', 'isEnabled', true) &&
		fg('platform_editor_markdown_compatible_toolbar');
	const { markdownView, sourceBlockFormatState } = useSharedPluginStateWithSelector(
		api,
		['markdownMode'],
		(states) => ({
			markdownView: isMarkdownBridgeEnabled ? states.markdownModeState?.view : undefined,
			sourceBlockFormatState: isMarkdownBridgeEnabled
				? states.markdownModeState?.sourceBlockFormatState
				: null,
		}),
	);

	if (
		!availableBlockTypesInDropdown?.some(
			(availableBlockType) => availableBlockType.name === blockType.name,
		)
	) {
		return null;
	}

	// markdownView is authoritative for "in source view" — it flips synchronously
	// on setView. sourceBlockFormatState is null between the view switch and the
	// first CM6 update listener fire, so we can't rely on it as the sentinel.
	const isMarkdownBridgeActive = markdownView === 'syntax';

	const isDisabled = isMarkdownBridgeActive
		? Boolean(sourceBlockFormatState?.inCodeBlock)
		: expValEquals('platform_editor_small_font_size', 'isEnabled', true)
			? shouldDisableQuoteButton(editorView?.state)
			: false;

	const onClick = () => {
		if (isDisabled) {
			return;
		}
		if (isMarkdownBridgeActive) {
			api?.markdownMode?.actions.toggleSourceBlockquote();
			return;
		}
		api?.core?.actions.execute(api?.blockType?.commands?.insertBlockQuote(INPUT_METHOD.TOOLBAR));
	};

	const shortcut = formatShortcut(toggleBlockQuote);
	const isSelected = isMarkdownBridgeActive
		? Boolean(sourceBlockFormatState?.inBlockquote)
		: currentBlockType === blockType;

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
