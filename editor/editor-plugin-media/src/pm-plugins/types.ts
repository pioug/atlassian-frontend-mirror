import type { MediaADFAttrs, RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import { type InsertMediaVia } from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { Identifier } from '@atlaskit/media-client';
import type { MediaClientConfig } from '@atlaskit/media-core';

import type {
	MediaOptions,
	MediaState,
	MediaStateEventSubscriber,
	ProsemirrorGetPosHandler,
} from '../types';
import type { MediaPluginOptions } from '../types/media-plugin-options';

import type PickerFacade from './picker-facade';

export interface MediaNodeWithPosHandler {
	getPos: ProsemirrorGetPosHandler;
	node: PMNode;
}

export interface MediaPluginState {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addPendingTask: (promise: Promise<any>) => void;
	allowInlineImages?: boolean;
	allowsUploads: boolean;
	allUploadsFinished: boolean;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	clone(): MediaPluginState;
	currentMaxWidth?: number;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	destroy(): void;
	dispatch?: Dispatch;
	editingMediaSinglePos?: number;
	element?: HTMLElement;
	findMediaNode: (id: string) => MediaNodeWithPosHandler | null;
	getMediaOptions: () => MediaPluginOptions;
	handleDrag: (dragState: 'enter' | 'leave') => void;
	handleMediaGroupUpdate: (oldNodes: PMNode[], newNodes: PMNode[]) => void;
	handleMediaNodeMount: (node: PMNode, getPos: ProsemirrorGetPosHandler) => void;
	handleMediaNodeRemoval: (node: PMNode | undefined, getPos: ProsemirrorGetPosHandler) => void;
	handleMediaNodeUnmount: (oldNode: PMNode) => void;
	ignoreLinks: boolean;
	imageEditorSelectedMedia?: MediaADFAttrs;
	insertFile: (
		mediaState: MediaState,
		onMediaStateChanged: MediaStateEventSubscriber,
		pickerType?: string,
		insertMediaVia?: InsertMediaVia,
	) => void;
	isFullscreen: boolean;
	isIdentifierInEditorScope: (identifier: Identifier) => boolean;
	// Image Editor State
	isImageEditorVisible?: boolean;
	// Media Viewer State
	isMediaViewerVisible?: boolean;
	isResizing: boolean;
	lastAddedMediaSingleFileIds: { id: string; selectionPosition: number }[];
	layout: MediaSingleLayout;
	mediaClientConfig?: MediaClientConfig;
	mediaNodes: MediaNodeWithPosHandler[];
	mediaOptions?: MediaOptions;
	mediaProvider?: MediaProvider;
	mediaViewerSelectedMedia?: MediaADFAttrs;
	onPopupPickerClose: () => void;
	onPopupToggle: (onPopupToogleCallback: (isOpen: boolean) => void) => void;
	options: MediaPluginOptions;
	pickerPromises: Array<Promise<PickerFacade>>;
	pickers: PickerFacade[];
	removeSelectedMediaContainer: () => boolean;
	resizingWidth: number;
	selectedMediaContainerNode: () => PMNode | undefined;
	setBrowseFn: (browseFn: () => void) => void;
	setImageEditorVisibility: (isVisible: boolean) => void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	setIsResizing(isResizing: boolean): void;
	setMediaProvider: (mediaProvider?: Promise<MediaProvider>) => Promise<void>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	setResizingWidth(width: number): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	setView(view: EditorView): void;
	showDropzone: boolean;
	showEditingDialog?: boolean;
	showMediaPicker: () => void;

	splitMediaGroup: () => boolean;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	subscribeToUploadInProgressState(fn: (isUploading: boolean) => void): void;
	trackOutOfScopeIdentifier: (identifier: Identifier) => void;

	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	unsubscribeFromUploadInProgressState(fn: (isUploading: boolean) => void): void;

	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	updateAndDispatch(
		props: Partial<
			Pick<
				this,
				'allowsUploads' | 'allUploadsFinished' | 'isFullscreen' | 'videoControlsWrapperRef'
			>
		>,
	): void;

	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	updateElement(): void;

	updateMediaSingleNodeAttrs: (id: string, attrs: object) => undefined | boolean;

	uploadMediaClientConfig?: MediaClientConfig;
	videoControlsWrapperRef?: HTMLElement;
	waitForMediaUpload: boolean;
	waitForPendingTasks: (
		timeout?: number,
		lastTask?: Promise<MediaState | null>,
	) => Promise<MediaState | null>;
}

export type EventInput = 'keyboard' | 'mouse' | 'floatingToolBar';
