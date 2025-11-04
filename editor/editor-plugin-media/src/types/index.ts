/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import type { MediaADFAttrs, MediaInlineAttributes } from '@atlaskit/adf-schema';
import type {
	MediaProvider,
	ProviderFactory,
	Providers,
} from '@atlaskit/editor-common/provider-factory';
import type { HandlePositioning } from '@atlaskit/editor-common/resizer';
import type { EditorSelectionAPI } from '@atlaskit/editor-common/selection';
import type { EditorAppearance, GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { FileIdentifier } from '@atlaskit/media-client';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import type { MediaClientConfig } from '@atlaskit/media-core';
import type { MediaFile, UploadParams } from '@atlaskit/media-picker/types';
// TODO: ED-26962 - Once we extract the placeholder-text we should import this type again
//import type { PlaceholderTextOptions } from '../../plugins/placeholder-text/types';

interface PlaceholderTextOptions {
	allowInserting?: boolean;
}

export type MediaStateStatus =
	| 'unknown'
	| 'ready'
	| 'cancelled'
	| 'preview'
	| 'error'
	| 'mobile-upload-end';

export type MediaSingleWithType = 'pixel' | 'percentage';

export type MediaCopyScope = 'editor' | 'context';

export interface MediaPluginOptions {
	alignLeftOnInsert?: boolean;
	allowAdvancedToolBarOptions?: boolean;
	// This enables the option to add an alt-text attribute to images contained in the Editor.
	allowAltTextOnImages?: boolean;
	allowBreakoutSnapPoints?: boolean;
	allowCaptions?: boolean;
	allowCommentsOnMedia?: boolean;
	allowDropzoneDropLine?: boolean;
	allowImagePreview?: boolean;
	allowLazyLoading?: boolean;
	allowLinking?: boolean;
	allowMarkingUploadsAsIncomplete?: boolean;
	allowMediaGroup?: boolean;
	/**
	 * @experimental
	 * Still under development. Use with caution.
	 */
	allowMediaInlineImages?: boolean;
	allowMediaSingle?: boolean | MediaSingleOptions;
	allowMediaSingleEditable?: boolean;
	/**
	 * @caution
	 * This attribute is used to enable the pixel resizing experience.
	 * When enabled it cannot be rolled back -> see PIR-27544 https://ops.internal.atlassian.com/jira/browse/PIR-27544
	 * Rollback action causes dataloss, no way to retrieve the original width, as fallback will always be 100
	 */
	allowPixelResizing?: boolean;
	allowRemoteDimensionsFetch?: boolean;
	allowResizing?: boolean;
	allowResizingInTables?: boolean;
	allowTemplatePlaceholders?: boolean | PlaceholderTextOptions;
	// returns array of validation errors based on value, if no errors returned - value is considered to be valid
	altTextValidator?: (value: string) => string[];
	customDropzoneContainer?: HTMLElement;
	customMediaPicker?: CustomMediaPicker;
	disableQuickInsert?: boolean;
	editorAppearance?: EditorAppearance;
	editorSelectionAPI?: EditorSelectionAPI;
	enableDownloadButton?: boolean;
	featureFlags?: MediaFeatureFlags;
	// Allows consumer products to always force the positioning of resize handles when resizing media.
	// eg: inline comment editor (chromeless) can force a smaller gap between content and resize handles
	forceHandlePositioning?: HandlePositioning;
	fullWidthEnabled?: boolean;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
	isCopyPasteEnabled?: boolean;
	/**
	 * Enabling this will prevent this plugin from automatically trying to upload external images to the Media service.
	 * This can be used in conjunction with the `isOnlyExternalLinks` config for `media-insert-plugin` to limit images
	 * to external URLs in the UI as well.
	 *
	 * @example
	 * ```typescript
	 *  createDefaultPreset({ featureFlags: {}, paste: {} })
	 *      .add(listPlugin)
	 *      .add(gridPlugin)
	 *      .add([mediaPlugin, { provider, allowMediaSingle: true, isExternalMediaUploadDisabled: true }])
	 *      .add(insertBlockPlugin)
	 *      .add(contentInsertionPlugin)
	 *      .add([mediaInsertPlugin, { isOnlyExternalLinks: true }])
	 * ```
	 */
	isExternalMediaUploadDisabled?: boolean;
	// Allows consumer products to choose if they want referential copies to occur at a context or editor level.
	// default is context
	mediaShallowCopyScope?: MediaCopyScope;
	onCommentButtonMount?: () => void;
	/**
	 * When enabled, prevents automatic focus/selection of media nodes after upload completion.
	 * The existing focus will be preserved instead of switching to the uploaded media.
	 * @default false
	 */
	preventAutoFocusOnUpload?: boolean;
	provider?: Providers['mediaProvider'];
	syncProvider?: MediaProvider;
	uploadErrorHandler?: (state: MediaState) => void;
	useForgePlugins?: boolean;
	waitForMediaUpload?: boolean;
}

/**
 * @private
 * @deprecated Use {@link MediaPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type MediaOptions = MediaPluginOptions;

export interface MediaSingleOptions {
	disableLayout?: boolean;
}

export interface MediaState {
	collection?: string;
	contextId?: string;
	dimensions?: {
		height: number | undefined;
		width: number | undefined;
	};
	error?: {
		description: string;
		name: string;
	};
	fileMimeType?: string;
	fileName?: string;
	fileSize?: number;
	id: string;
	/** still require to support Mobile */
	publicId?: string;
	scaleFactor?: number;
	status?: MediaStateStatus;
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Listener = (data: any) => void;

export interface CustomMediaPicker {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	destroy(): void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/method-signature-style -- method-signature-style ignored via go/ees013 (to be fixed)
	emit(event: string, data: any): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	on(event: string, cb: Listener): void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/method-signature-style -- method-signature-style ignored via go/ees013 (to be fixed)
	removeAllListeners(event: any): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	setUploadParams(uploadParams: UploadParams): void;
}

export type MobileUploadEndEventPayload = {
	readonly file: MediaFile & {
		readonly collectionName?: string;
		readonly publicId?: string;
	};
};

export type MediaEditorState = {
	editor?: {
		identifier: FileIdentifier;
		pos: number;
	};
	mediaClientConfig?: MediaClientConfig;
};

export type MediaToolbarBaseConfig = {
	getDomRef?: (view: EditorView) => HTMLElement | undefined;
	nodeType: NodeType | NodeType[];
	title: string;
};

export type MediaFloatingToolbarOptions = {
	allowAdvancedToolBarOptions?: boolean;
	allowAltTextOnImages?: boolean;
	allowCommentsOnMedia?: boolean;
	allowImagePreview?: boolean;
	allowLinking?: boolean;
	allowMediaInline?: boolean;
	allowMediaInlineImages?: boolean;
	/**
	 * @caution
	 * This attribute is used to enable the pixel resizing experience.
	 * When enabled it cannot be rolled back -> see PIR-27544 https://ops.internal.atlassian.com/jira/browse/PIR-27544
	 * Rollback action causes dataloss, no way to retrieve the original width, as fallback will always be 100
	 **/
	allowPixelResizing?: boolean;
	allowResizing?: boolean;
	allowResizingInTables?: boolean;
	altTextValidator?: (value: string) => string[];
	fullWidthEnabled?: boolean;
	isViewOnly?: boolean;
	onCommentButtonMount?: () => void;
	providerFactory?: ProviderFactory;
};

export type MediaDecorationSpec = {
	selected: boolean;
	type: 'media';
};

export type SupportedMediaAttributes = MediaADFAttrs | MediaInlineAttributes;

export type ProsemirrorGetPosHandler = getPosHandlerNode;
export type getPosHandler = getPosHandlerNode;
export type getPosHandlerNode = () => number | undefined;

export interface ReactNodeProps {
	selected: boolean;
}

export type ForwardRef = (node: HTMLElement | null) => void;

export type { InsertMediaAsMediaSingle } from '../pm-plugins/utils/media-single';
export type { MediaPluginState } from '../pm-plugins/types';

type MediaStateEvent = MediaState;
export type MediaStateEventListener = (evt: MediaStateEvent) => void;
export type MediaStateEventSubscriber = (listener: MediaStateEventListener) => void;
