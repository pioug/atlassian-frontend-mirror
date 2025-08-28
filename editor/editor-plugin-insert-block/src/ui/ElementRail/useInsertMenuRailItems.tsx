import { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { insertBlockPlugin } from '../../insertBlockPlugin';
import type { InsertBlockOptions } from '../../types';
import { createItems } from '../ToolbarInsertBlock/create-items';

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<typeof insertBlockPlugin>,
		| 'hyperlink'
		| 'date'
		| 'imageUpload'
		| 'mention'
		| 'emoji'
		| 'blockType'
		| 'media'
		| 'typeAhead'
		| 'placeholderText'
	>,
) => {
	return {
		dateEnabled: states.dateState?.isInitialised,
		canInsertLink: states.hyperlinkState?.canInsertLink,
		activeLinkMark: states.hyperlinkState?.activeLinkMark,
		isTypeAheadAllowed: states.typeAheadState?.isAllowed,
		availableWrapperBlockTypes: states.blockTypeState?.availableWrapperBlockTypes,
		imageUploadEnabled: states.imageUploadState?.enabled,
		placeholderTextAllowInserting: states.placeholderTextState?.allowInserting,
		emojiProvider: states.emojiState?.emojiProvider,
		mentionProvider: states.mentionState?.mentionProvider,
		canInsertMention: states.mentionState?.canInsertMention,
		mediaAllowsUploads: states.mediaState?.allowsUploads,
	};
};

export const useInsertMenuRailItems = (
	editorView: EditorView,
	options: InsertBlockOptions,
	api?: ExtractInjectionAPI<typeof insertBlockPlugin>,
) => {
	const { formatMessage } = useIntl();
	const {
		dateEnabled,
		canInsertLink,
		activeLinkMark,
		isTypeAheadAllowed,
		availableWrapperBlockTypes,
		imageUploadEnabled,
		placeholderTextAllowInserting,
		emojiProvider,
		mentionProvider,
		canInsertMention,
		mediaAllowsUploads,
	} = useSharedPluginStateWithSelector(
		api,
		[
			'hyperlink',
			'date',
			'imageUpload',
			'mention',
			'emoji',
			'blockType',
			'media',
			'typeAhead',
			'placeholderText',
		],
		selector,
	);

	const [_, dropdownItems] = useMemo(() => {
		return createItems({
			isTypeAheadAllowed: Boolean(isTypeAheadAllowed),
			tableSupported: !!editorView.state.schema.nodes.table,
			tableSelectorSupported:
				options.tableSelectorSupported && !!editorView.state.schema.nodes.table,
			mediaUploadsEnabled: mediaAllowsUploads ?? undefined,
			mediaSupported: mediaAllowsUploads !== undefined,
			imageUploadSupported: !!api?.imageUpload,
			imageUploadEnabled: imageUploadEnabled,
			mentionsSupported: !!mentionProvider,
			mentionsDisabled: !canInsertMention,
			actionSupported: !!editorView.state.schema.nodes.taskItem,
			decisionSupported: !!editorView.state.schema.nodes.decisionItem,
			linkSupported: canInsertLink !== undefined,
			linkDisabled: !canInsertLink || !!activeLinkMark,
			emojiDisabled: !emojiProvider,
			nativeStatusSupported: options.nativeStatusSupported,
			dateEnabled: !!dateEnabled,
			placeholderTextEnabled: placeholderTextAllowInserting,
			horizontalRuleEnabled: options.horizontalRuleEnabled,
			layoutSectionEnabled: Boolean(api?.layout),
			expandEnabled: !!options.allowExpand,
			showElementBrowserLink: options.showElementBrowserLink,
			emojiProvider: emojiProvider,
			availableWrapperBlockTypes: availableWrapperBlockTypes,
			insertMenuItems: options.insertMenuItems,
			schema: editorView.state.schema,
			// numberOfButtons controls what items are returned and eventually display in the insert menu - but it relies on the main toolbar width which
			// is not easily available here. I've used 7 as it's the value used for most widths see toolbarSizeToButtons
			numberOfButtons: 7,
			formatMessage,
			isNewMenuEnabled: true,
		});
	}, [
		activeLinkMark,
		api?.imageUpload,
		api?.layout,
		availableWrapperBlockTypes,
		canInsertLink,
		canInsertMention,
		dateEnabled,
		editorView.state.schema,
		emojiProvider,
		formatMessage,
		imageUploadEnabled,
		isTypeAheadAllowed,
		mediaAllowsUploads,
		mentionProvider,
		options.allowExpand,
		options.horizontalRuleEnabled,
		options.insertMenuItems,
		options.nativeStatusSupported,
		options.showElementBrowserLink,
		options.tableSelectorSupported,
		placeholderTextAllowInserting,
	]);

	return dropdownItems;
};
