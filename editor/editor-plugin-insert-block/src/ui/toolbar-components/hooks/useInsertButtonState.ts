import { useIntl } from 'react-intl-next';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { EditorView } from '@atlaskit/editor-prosemirror/dist/types/view';
import type { EmojiProvider } from '@atlaskit/emoji';

import type { InsertBlockPlugin } from '../../../insertBlockPluginType';
import type { BlockMenuItem } from '../../ToolbarInsertBlock/create-items';
import { createItems } from '../../ToolbarInsertBlock/create-items';

interface UseInsertButtonStateProps {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
	editorView?: EditorView;
	expandEnabled?: boolean;
	horizontalRuleEnabled?: boolean;
	insertMenuItems?: MenuItem[];
	nativeStatusSupported?: boolean;
	numberOfButtons?: number;
	showElementBrowserLink?: boolean;
	tableSelectorSupported?: boolean;
}

export interface InsertButtonState {
	dropdownItems: BlockMenuItem[];
	emojiProvider?: EmojiProvider;
	isTypeAheadAllowed?: boolean;
}

export const useInsertButtonState = ({
	api,
	editorView,
	horizontalRuleEnabled,
	insertMenuItems,
	nativeStatusSupported,
	numberOfButtons,
	tableSelectorSupported,
	expandEnabled,
	showElementBrowserLink
}: UseInsertButtonStateProps): InsertButtonState => {
	const { formatMessage } = useIntl();
	const isTypeAheadAllowed = useSharedPluginStateSelector(api, 'typeAhead.isAllowed');
	const imageUploadEnabled = useSharedPluginStateSelector(api, 'imageUpload.enabled');
	const mentionsSupported = !!useSharedPluginStateSelector(api, 'mention.mentionProvider');
	const canInsertMention = useSharedPluginStateSelector(api, 'mention.canInsertMention');
	const dateEnabled = useSharedPluginStateSelector(api, 'date.isInitialised');
	const placeholderTextEnabled = useSharedPluginStateSelector(
		api,
		'placeholderText.allowInserting',
	);
	const mediaAllowsUploads = useSharedPluginStateSelector(api, 'media.allowsUploads');

	const canInsertLink = useSharedPluginStateSelector(api, 'hyperlink.canInsertLink');
	const activeLinkMark = useSharedPluginStateSelector(api, 'hyperlink.activeLinkMark');
	const connectivityMode = useSharedPluginStateSelector(api, 'connectivity.mode');
	const emojiProvider = useSharedPluginStateSelector(api, 'emoji.emojiProvider');
	const availableWrapperBlockTypes = useSharedPluginStateSelector(
		api,
		'blockType.availableWrapperBlockTypes',
	);

	// Computed values
	const mediaUploadsEnabled = mediaAllowsUploads;
	const mediaSupported = mediaAllowsUploads !== undefined;
	const isEditorOffline = connectivityMode === 'offline';
	const imageUploadSupported = !!api?.imageUpload;
	const mentionsDisabled = !canInsertMention;
	const linkSupported = canInsertLink !== undefined;
	const linkDisabled = !canInsertLink || !!activeLinkMark;
	const emojiDisabled = !emojiProvider;
	const actionSupported = !!editorView?.state.schema.nodes.taskItem;
	const decisionSupported = !!editorView?.state.schema.nodes.decisionItem;
	const layoutSectionEnabled = !!api?.layout;

	const [, dropdownItems] = editorView?.state.schema
		? createItems({
				isTypeAheadAllowed: isTypeAheadAllowed,
				tableSupported: !!editorView?.state.schema.nodes.table,
				tableSelectorSupported,
				mediaUploadsEnabled,
				mediaSupported,
				isEditorOffline,
				imageUploadSupported,
				imageUploadEnabled,
				mentionsSupported,
				mentionsDisabled,
				actionSupported,
				decisionSupported,
				linkSupported,
				linkDisabled,
				emojiDisabled,
				hasEmojiPlugin: !!api?.emoji,
				hasMentionsPlugin: !!api?.mention,
				hasMediaPlugin: !!api?.media,
				nativeStatusSupported,
				dateEnabled,
				placeholderTextEnabled,
				horizontalRuleEnabled,
				layoutSectionEnabled,
				expandEnabled,
				showElementBrowserLink,
				emojiProvider,
				availableWrapperBlockTypes,
				insertMenuItems,
				schema: editorView?.state.schema,
				numberOfButtons: numberOfButtons || 0,
				formatMessage,
			})
		: [, []];

	return {
		dropdownItems,
		emojiProvider,
		isTypeAheadAllowed,
	};
};
