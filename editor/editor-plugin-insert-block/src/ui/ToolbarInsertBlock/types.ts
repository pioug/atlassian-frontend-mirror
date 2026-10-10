import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics/types/dispatch-analytics-event';
import type { MacroProvider } from '@atlaskit/editor-common/provider-factory/macro-provider';
import type { Command } from '@atlaskit/editor-common/types/command';
import type { EditorActionsOptions as EditorActions } from '@atlaskit/editor-common/types/editor-actions';
import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';
import type { ImageUploadPluginReferenceEvent } from '@atlaskit/editor-common/types/image-upload-reference-event';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu/DropdownMenu/types';
import type { BlockType } from '@atlaskit/editor-plugin-block-type/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { EmojiProvider } from '@atlaskit/emoji';

import type { InsertBlockPlugin } from '../../index';
import type { BlockMenuItem } from './create-items';

export interface Props {
	actionSupported?: boolean;
	availableWrapperBlockTypes?: BlockType[];
	buttons: number;
	dateEnabled?: boolean;
	decisionSupported?: boolean;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorActions?: EditorActions;
	editorAppearance?: EditorAppearance;
	editorView: EditorView;
	emojiContentId?: string;
	emojiDisabled?: boolean;
	emojiProvider?: Promise<EmojiProvider>;
	expandEnabled?: boolean;
	handleImageUpload?: (event?: ImageUploadPluginReferenceEvent) => Command;
	horizontalRuleEnabled?: boolean;
	imageUploadEnabled?: boolean;
	imageUploadSupported?: boolean;
	insertMenuItems?: MenuItem[];
	isDisabled?: boolean;
	isEditorOffline?: boolean;
	isReducedSpacing: boolean;
	isTypeAheadAllowed?: boolean;
	/** @see InsertBlockPluginOptions.itemFilter */
	itemFilter?: (item: MenuItem) => boolean;
	layoutSectionEnabled?: boolean;
	linkDisabled?: boolean;
	linkSupported?: boolean;
	mediaSupported?: boolean;
	mediaUploadsEnabled?: boolean;
	mentionsDisabled?: boolean;
	mentionsSupported?: boolean;
	nativeStatusSupported?: boolean;
	onInsertBlockType?: (name: string) => Command;
	onInsertMacroFromMacroBrowser?: (
		macroProvider: MacroProvider,
		node?: PMNode,
		isEditing?: boolean,
	) => (view: EditorView) => void;
	onShowMediaPicker?: (mountInfo?: { mountPoint: HTMLElement; ref: HTMLElement }) => void;
	placeholderTextEnabled?: boolean;
	pluginInjectionApi: ExtractInjectionAPI<InsertBlockPlugin> | undefined;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	showElementBrowser: boolean;
	showElementBrowserLink?: boolean;
	showSeparator?: boolean;
	tableSelectorSupported?: boolean;
	tableSupported?: boolean;
}

export interface State {
	buttons: BlockMenuItem[];
	dropdownItems: BlockMenuItem[];
	emojiPickerOpen: boolean;
	isOpenedByKeyboard: boolean;
	isPlusMenuOpen: boolean;
	isTableSelectorOpen: boolean;
	isTableSelectorOpenedByKeyboard: boolean;
}
