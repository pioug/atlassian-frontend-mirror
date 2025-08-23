import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { MacroProvider } from '@atlaskit/editor-common/provider-factory';
import type {
	Command,
	EditorActionsOptions as EditorActions,
	EditorAppearance,
	ExtractInjectionAPI,
	ImageUploadPluginReferenceEvent,
} from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { BlockType } from '@atlaskit/editor-plugin-block-type';
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
