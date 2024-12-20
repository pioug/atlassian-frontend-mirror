import { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { insertBlockPlugin } from '../../insertBlockPlugin';
import type { InsertBlockOptions } from '../../types';
import { createItems } from '../ToolbarInsertBlock/create-items';

export const useInsertMenuRailItems = (
	editorView: EditorView,
	options: InsertBlockOptions,
	api?: ExtractInjectionAPI<typeof insertBlockPlugin>,
) => {
	const { formatMessage } = useIntl();
	const {
		dateState,
		hyperlinkState,
		imageUploadState,
		mentionState,
		emojiState,
		blockTypeState,
		mediaState,
		typeAheadState,
		placeholderTextState,
	} = useSharedPluginState(api, [
		'hyperlink',
		'date',
		'imageUpload',
		'mention',
		'emoji',
		'blockType',
		'media',
		'typeAhead',
		'placeholderText',
	]);

	const [_, dropdownItems] = useMemo(() => {
		return createItems({
			isTypeAheadAllowed: Boolean(typeAheadState?.isAllowed),
			tableSupported: !!editorView.state.schema.nodes.table,
			tableSelectorSupported:
				options.tableSelectorSupported && !!editorView.state.schema.nodes.table,
			mediaUploadsEnabled: (mediaState && mediaState.allowsUploads) ?? undefined,
			mediaSupported: !!mediaState,
			imageUploadSupported: !!api?.imageUpload,
			imageUploadEnabled: imageUploadState?.enabled,
			mentionsSupported: !!(mentionState && mentionState.mentionProvider),
			mentionsDisabled: !!(mentionState && !mentionState.canInsertMention),
			actionSupported: !!editorView.state.schema.nodes.taskItem,
			decisionSupported: !!editorView.state.schema.nodes.decisionItem,
			linkSupported: !!hyperlinkState,
			linkDisabled:
				!hyperlinkState || !hyperlinkState.canInsertLink || !!hyperlinkState.activeLinkMark,
			emojiDisabled: !emojiState || !emojiState.emojiProvider,
			nativeStatusSupported: options.nativeStatusSupported,
			dateEnabled: !!dateState,
			placeholderTextEnabled: placeholderTextState && placeholderTextState.allowInserting,
			horizontalRuleEnabled: options.horizontalRuleEnabled,
			layoutSectionEnabled: Boolean(api?.layout),
			expandEnabled: !!options.allowExpand,
			showElementBrowserLink: options.showElementBrowserLink,
			emojiProvider: emojiState?.emojiProvider,
			availableWrapperBlockTypes: blockTypeState && blockTypeState.availableWrapperBlockTypes,
			insertMenuItems: options.insertMenuItems,
			schema: editorView.state.schema,
			// numberOfButtons controls what items are returned and eventually display in the insert menu - but it relies on the main toolbar width which
			// is not easily available here. I've used 7 as it's the value used for most widths see toolbarSizeToButtons
			numberOfButtons: 7,
			formatMessage,
			isNewMenuEnabled: true,
		});
	}, [
		api?.imageUpload,
		api?.layout,
		blockTypeState,
		dateState,
		editorView.state.schema,
		emojiState,
		formatMessage,
		hyperlinkState,
		imageUploadState?.enabled,
		mediaState,
		mentionState,
		options.allowExpand,
		options.horizontalRuleEnabled,
		options.insertMenuItems,
		options.nativeStatusSupported,
		options.showElementBrowserLink,
		options.tableSelectorSupported,
		placeholderTextState,
		typeAheadState?.isAllowed,
	]);

	return dropdownItems;
};
