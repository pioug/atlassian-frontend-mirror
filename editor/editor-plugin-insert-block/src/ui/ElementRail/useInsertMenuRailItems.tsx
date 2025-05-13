import { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { insertBlockPlugin } from '../../insertBlockPlugin';
import type { InsertBlockOptions } from '../../types';
import { createItems } from '../ToolbarInsertBlock/create-items';

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<typeof insertBlockPlugin> | undefined) => {
		const dateEnabled = useSharedPluginStateSelector(api, 'date.isInitialised');
		const canInsertLink = useSharedPluginStateSelector(api, 'hyperlink.canInsertLink');
		const activeLinkMark = useSharedPluginStateSelector(api, 'hyperlink.activeLinkMark');
		const isTypeAheadAllowed = useSharedPluginStateSelector(api, 'typeAhead.isAllowed');
		const availableWrapperBlockTypes = useSharedPluginStateSelector(
			api,
			'blockType.availableWrapperBlockTypes',
		);
		const imageUploadEnabled = useSharedPluginStateSelector(api, 'imageUpload.enabled');
		const placeholderTextAllowInserting = useSharedPluginStateSelector(
			api,
			'placeholderText.allowInserting',
		);
		const emojiProvider = useSharedPluginStateSelector(api, 'emoji.emojiProvider');
		const mentionProvider = useSharedPluginStateSelector(api, 'mention.mentionProvider');
		const canInsertMention = useSharedPluginStateSelector(api, 'mention.canInsertMention');
		const mediaAllowsUploads = useSharedPluginStateSelector(api, 'media.allowsUploads');

		return {
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
		};
	},
	(api: ExtractInjectionAPI<typeof insertBlockPlugin> | undefined) => {
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

		return {
			dateEnabled: dateState?.isInitialised,
			canInsertLink: hyperlinkState?.canInsertLink,
			activeLinkMark: hyperlinkState?.activeLinkMark,
			isTypeAheadAllowed: typeAheadState?.isAllowed,
			availableWrapperBlockTypes: blockTypeState?.availableWrapperBlockTypes,
			imageUploadEnabled: imageUploadState?.enabled,
			placeholderTextAllowInserting: placeholderTextState?.allowInserting,
			emojiProvider: emojiState?.emojiProvider,
			mentionProvider: mentionState?.mentionProvider,
			canInsertMention: mentionState?.canInsertMention,
			mediaAllowsUploads: mediaState?.allowsUploads,
		};
	},
);

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
	} = useSharedState(api);

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
