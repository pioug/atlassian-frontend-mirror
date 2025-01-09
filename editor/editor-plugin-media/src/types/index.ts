/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import type { MediaADFAttrs, MediaInlineAttributes } from '@atlaskit/adf-schema';
import type { ProviderFactory, Providers } from '@atlaskit/editor-common/provider-factory';
import type { HandlePositioning } from '@atlaskit/editor-common/resizer';
import type { EditorSelectionAPI } from '@atlaskit/editor-common/selection';
import type { EditorAppearance, GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { FileIdentifier } from '@atlaskit/media-client';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import type { MediaClientConfig } from '@atlaskit/media-core';
import type { MediaFile, UploadParams } from '@atlaskit/media-picker/types';
// FIXME: Once we extract the placeholder-text we should import this type again
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

export interface MediaOptions {
	provider?: Providers['mediaProvider'];
	/**
	 * @experimental
	 * Still under development. Use with caution.
	 */
	allowMediaInlineImages?: boolean;
	allowMediaSingle?: boolean | MediaSingleOptions;
	allowMediaGroup?: boolean;
	customDropzoneContainer?: HTMLElement;
	customMediaPicker?: CustomMediaPicker;
	allowResizing?: boolean;
	allowResizingInTables?: boolean;
	allowLinking?: boolean;
	allowLazyLoading?: boolean;
	allowBreakoutSnapPoints?: boolean;
	allowAdvancedToolBarOptions?: boolean;
	allowMediaSingleEditable?: boolean;
	allowRemoteDimensionsFetch?: boolean;
	allowDropzoneDropLine?: boolean;
	allowMarkingUploadsAsIncomplete?: boolean;
	allowImagePreview?: boolean;
	fullWidthEnabled?: boolean;
	uploadErrorHandler?: (state: MediaState) => void;
	waitForMediaUpload?: boolean;
	isCopyPasteEnabled?: boolean;
	// This enables the option to add an alt-text attribute to images contained in the Editor.
	allowAltTextOnImages?: boolean;
	enableDownloadButton?: boolean;
	// returns array of validation errors based on value, if no errors returned - value is considered to be valid
	altTextValidator?: (value: string) => string[];
	useForgePlugins?: boolean;
	allowTemplatePlaceholders?: boolean | PlaceholderTextOptions;
	alignLeftOnInsert?: boolean;
	editorSelectionAPI?: EditorSelectionAPI;
	featureFlags?: MediaFeatureFlags;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
	allowCaptions?: boolean;
	allowCommentsOnMedia?: boolean;
	editorAppearance?: EditorAppearance;
	// Allows consumer products to always force the positioning of resize handles when resizing media.
	// eg: inline comment editor (chromeless) can force a smaller gap between content and resize handles
	forceHandlePositioning?: HandlePositioning;
	// Allows consumer products to choose if they want referential copies to occur at a context or editor level.
	// default is context
	mediaShallowCopyScope?: MediaCopyScope;
}

export interface MediaSingleOptions {
	disableLayout?: boolean;
}

export interface MediaState {
	id: string;
	status?: MediaStateStatus;
	fileName?: string;
	fileSize?: number;
	fileMimeType?: string;
	collection?: string;
	dimensions?: {
		width: number | undefined;
		height: number | undefined;
	};
	scaleFactor?: number;
	error?: {
		name: string;
		description: string;
	};
	/** still require to support Mobile */
	publicId?: string;
	contextId?: string;
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Listener = (data: any) => void;

export interface CustomMediaPicker {
	on(event: string, cb: Listener): void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	removeAllListeners(event: any): void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	emit(event: string, data: any): void;
	destroy(): void;
	setUploadParams(uploadParams: UploadParams): void;
}

export type MobileUploadEndEventPayload = {
	readonly file: MediaFile & {
		readonly collectionName?: string;
		readonly publicId?: string;
	};
};

export type MediaEditorState = {
	mediaClientConfig?: MediaClientConfig;
	editor?: {
		pos: number;
		identifier: FileIdentifier;
	};
};

export type MediaToolbarBaseConfig = {
	title: string;
	getDomRef?: (view: EditorView) => HTMLElement | undefined;
	nodeType: NodeType | NodeType[];
};

export type MediaFloatingToolbarOptions = {
	providerFactory?: ProviderFactory;
	allowResizing?: boolean;
	allowMediaInline?: boolean;
	allowMediaInlineImages?: boolean;
	allowLinking?: boolean;
	allowAdvancedToolBarOptions?: boolean;
	allowResizingInTables?: boolean;
	allowAltTextOnImages?: boolean;
	allowImagePreview?: boolean;
	altTextValidator?: (value: string) => string[];
	fullWidthEnabled?: boolean;
	allowCommentsOnMedia?: boolean;
	isViewOnly?: boolean;
};

export type MediaDecorationSpec = {
	type: 'media';
	selected: boolean;
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
