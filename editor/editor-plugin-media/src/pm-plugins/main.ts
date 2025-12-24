import assert from 'assert';

import React from 'react';

import type { IntlShape } from 'react-intl-next';
import { RawIntlProvider } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

import type { MediaADFAttrs, RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import type { InputMethodInsertMedia, InsertMediaVia } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { mediaInlineImagesEnabled } from '@atlaskit/editor-common/media-inline';
import {
	CAPTION_PLACEHOLDER_ID,
	getMaxWidthForNestedNodeNext,
} from '@atlaskit/editor-common/media-single';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	EditorContainerWidth as WidthPluginState,
	ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import { browser, ErrorReporter } from '@atlaskit/editor-common/utils';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
	AllSelection,
	NodeSelection,
	Selection,
	TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import { insertPoint } from '@atlaskit/editor-prosemirror/transform';
import {
	findDomRefAtPos,
	findParentNodeOfType,
	findSelectedNodeOfType,
	isNodeSelection,
} from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { type Identifier, isFileIdentifier } from '@atlaskit/media-client';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import type { MediaClientConfig } from '@atlaskit/media-core';
import type { UploadParams } from '@atlaskit/media-picker/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { MediaNextEditorPluginType } from '../mediaPluginType';
// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as helpers from '../pm-plugins/commands/helpers';
import { updateMediaNodeAttrs } from '../pm-plugins/commands/helpers';
import {
	getIdentifier,
	getMediaFromSupportedMediaNodesFromSelection,
	isNodeDoubleClickSupportedInLivePagesViewMode,
	removeMediaNode,
	splitMediaGroup,
} from '../pm-plugins/utils/media-common';
import { insertMediaGroupNode, insertMediaInlineNode } from '../pm-plugins/utils/media-files';
import { getMediaNodeInsertionType } from '../pm-plugins/utils/media-inline';
import { insertMediaSingleNode } from '../pm-plugins/utils/media-single';
import type {
	getPosHandlerNode as ProsemirrorGetPosHandler,
	MediaOptions,
	MediaState,
	MediaStateEventListener,
	MediaStateEventSubscriber,
} from '../types';
import type { MediaPluginOptions } from '../types/media-plugin-options';
import type { PlaceholderType } from '../ui/Media/DropPlaceholder';
import DropPlaceholder from '../ui/Media/DropPlaceholder';

import { ACTIONS } from './actions';
import { MediaTaskManager } from './mediaTaskManager';
import type { PickerFacadeConfig } from './picker-facade';
import PickerFacade from './picker-facade';
import { stateKey } from './plugin-key';
import type { MediaNodeWithPosHandler, MediaPluginState } from './types';

export const MEDIA_CONTENT_WRAP_CLASS_NAME = 'media-content-wrap';
export const MEDIA_PLUGIN_IS_RESIZING_KEY = 'mediaSinglePlugin.isResizing';
export const MEDIA_PLUGIN_RESIZING_WIDTH_KEY = 'mediaSinglePlugin.resizing-width';

const createDropPlaceholder = (
	intl: IntlShape,
	nodeViewPortalProviderAPI: PortalProviderAPI,
	dropPlaceholderKey: string,
	allowDropLine?: boolean,
) => {
	// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
	const dropPlaceholder = document.createElement('div');
	const createElement = React.createElement;

	if (allowDropLine) {
		nodeViewPortalProviderAPI.render(
			() =>
				createElement(
					RawIntlProvider,
					{ value: intl },
					createElement(DropPlaceholder, { type: 'single' } as {
						type: PlaceholderType;
					}),
				),
			dropPlaceholder,
			dropPlaceholderKey,
		);
	} else {
		nodeViewPortalProviderAPI.render(
			() => createElement(RawIntlProvider, { value: intl }, createElement(DropPlaceholder)),
			dropPlaceholder,
			dropPlaceholderKey,
		);
	}

	return dropPlaceholder;
};

const MEDIA_RESOLVED_STATES = ['ready', 'error', 'cancelled'];
export class MediaPluginStateImplementation implements MediaPluginState {
	allowsUploads: boolean = false;
	mediaClientConfig?: MediaClientConfig;
	uploadMediaClientConfig?: MediaClientConfig;
	ignoreLinks: boolean = false;
	waitForMediaUpload: boolean = true;
	allUploadsFinished: boolean = true;
	showDropzone: boolean = false;
	isFullscreen: boolean = false;
	element?: HTMLElement;
	layout: MediaSingleLayout = 'center';
	mediaNodes: MediaNodeWithPosHandler[] = [];
	options: MediaPluginOptions;
	mediaProvider?: MediaProvider;
	isResizing: boolean = false;
	resizingWidth: number = 0;
	currentMaxWidth?: number;
	allowInlineImages = false;
	uploadInProgressSubscriptions: { (isUploading: boolean): void }[] = [];
	uploadInProgressSubscriptionsNotified: boolean = false;

	// this is only a temporary variable, which gets cleared after the last inserted node has been selected
	lastAddedMediaSingleFileIds: { id: string; selectionPosition: number }[] = [];

	private view!: EditorView;
	private destroyed = false;
	private errorReporter: ErrorReporter;
	// @ts-ignore: private is OK
	private customPicker?: PickerFacade;
	private removeOnCloseListener: () => void = () => {};

	private openMediaPickerBrowser?: () => void;
	private onPopupToggleCallback: (isOpen: boolean) => void = () => {};

	private identifierCount = new Map<string, { count: number; identifier: Identifier }>();

	// This is to enable mediaShallowCopySope to enable only shallow copying media referenced within the edtior
	// see: trackOutOfScopeIdentifier
	private outOfEditorScopeIdentifierMap = new Map<string, { identifier: Identifier }>();
	private taskManager = new MediaTaskManager();

	pickers: PickerFacade[] = [];
	pickerPromises: Array<Promise<PickerFacade>> = [];

	editingMediaSinglePos?: number;
	showEditingDialog?: boolean;
	mediaOptions?: MediaOptions;
	dispatch?: Dispatch;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	singletonCreatedAt: number;

	constructor(
		state: EditorState,
		options: MediaPluginOptions,
		mediaOptions: MediaOptions | undefined,
		dispatch: Dispatch | undefined,
		pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	) {
		this.options = options;
		this.mediaOptions = mediaOptions;
		this.dispatch = dispatch;
		this.pluginInjectionApi = pluginInjectionApi;

		this.waitForMediaUpload =
			options.waitForMediaUpload === undefined ? true : options.waitForMediaUpload;

		const { nodes } = state.schema;
		assert(
			nodes.media && (nodes.mediaGroup || nodes.mediaSingle),
			'Editor: unable to init media plugin - media or mediaGroup/mediaSingle node absent in schema',
		);

		if (mediaOptions?.syncProvider) {
			this.setMediaProvider(mediaOptions?.syncProvider);
		} else if (mediaOptions?.provider) {
			this.setMediaProvider(mediaOptions?.provider);
		}

		if (fg('platform_editor_remove_media_inline_feature_flag')) {
			if (this.mediaOptions?.allowMediaInlineImages) {
				this.allowInlineImages = true;
			}
		} else {
			if (
				mediaInlineImagesEnabled(
					getMediaFeatureFlag('mediaInline', this.mediaOptions?.featureFlags),
					this.mediaOptions?.allowMediaInlineImages,
				)
			) {
				this.allowInlineImages = true;
			}
		}

		this.errorReporter = options.errorReporter || new ErrorReporter();
		this.singletonCreatedAt = (performance || Date).now();
	}

	clone() {
		const clonedAt = (performance || Date).now();

		// Prevent double wrapping
		// If clone is repeatedly called, we want to proxy the underlying MediaPluginStateImplementation target, rather than the proxy itself
		// If we proxy the proxy, then calling get in future will need to recursively unwrap proxies to find the original target, which causes performance issues
		// Instead, we check if there is an original target stored on "this", and if so, we use that as the proxy target instead
		return new Proxy(
			(this as unknown as { originalTarget?: MediaPluginStateImplementation }).originalTarget ??
				this,
			{
				get(target, prop, receiver) {
					if (prop === 'singletonCreatedAt') {
						return clonedAt;
					}

					if (prop === 'originalTarget') {
						return target;
					}

					return Reflect.get(target, prop, receiver);
				},
			},
		);
	}

	subscribeToUploadInProgressState(fn: (isUploading: boolean) => void): void {
		this.uploadInProgressSubscriptions.push(fn);
	}

	unsubscribeFromUploadInProgressState(fn: (isUploading: boolean) => void): void {
		this.uploadInProgressSubscriptions = this.uploadInProgressSubscriptions.filter(
			(subscribedFn) => subscribedFn !== fn,
		);
	}

	private previousMediaProvider: Promise<MediaProvider> | MediaProvider | undefined;

	async setMediaProvider(mediaProvider?: Promise<MediaProvider> | MediaProvider): Promise<void> {
		// Prevent someone trying to set the exact same provider twice for performance reasons
		if (this.previousMediaProvider === mediaProvider) {
			return;
		}
		this.previousMediaProvider = mediaProvider;
		if (!mediaProvider) {
			this.destroyPickers();

			this.allowsUploads = false;
			if (!this.destroyed) {
				this.view.dispatch(
					this.view.state.tr.setMeta(stateKey, {
						allowsUploads: this.allowsUploads,
					}),
				);
			}

			return;
		}

		// Ignored via go/ees007
		// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
		// TODO disable (not destroy!) pickers until mediaProvider is resolved
		try {
			if (mediaProvider instanceof Promise) {
				this.mediaProvider = await mediaProvider;
			} else {
				this.mediaProvider = mediaProvider;
			}

			// Ignored via go/ees007
			// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
			// TODO [MS-2038]: remove once context api is removed
			// We want to re assign the view and upload configs if they are missing for backwards compatibility
			// as currently integrators can pass context || mediaClientConfig
			if (!this.mediaProvider.viewMediaClientConfig) {
				const viewMediaClientConfig = this.mediaProvider.viewMediaClientConfig;

				if (viewMediaClientConfig) {
					(this.mediaProvider as MediaProvider).viewMediaClientConfig = viewMediaClientConfig;
				}
			}

			assert(
				this.mediaProvider.viewMediaClientConfig,
				`MediaProvider promise did not resolve to a valid instance of MediaProvider - ${this.mediaProvider}`,
			);
		} catch (err) {
			const wrappedError = new Error(
				`Media functionality disabled due to rejected provider: ${
					err instanceof Error ? err.message : String(err)
				}`,
			);
			this.errorReporter.captureException(wrappedError);

			this.destroyPickers();

			this.allowsUploads = false;
			if (!this.destroyed) {
				this.view.dispatch(
					this.view.state.tr.setMeta(stateKey, {
						allowsUploads: this.allowsUploads,
					}),
				);
			}

			return;
		}

		this.mediaClientConfig = this.mediaProvider.viewMediaClientConfig;

		this.allowsUploads = !!this.mediaProvider.uploadMediaClientConfig;
		const { view, allowsUploads } = this;
		// make sure editable DOM node is mounted
		if (!this.destroyed && view && view.dom.parentNode) {
			// make PM plugin aware of the state change to update UI during 'apply' hook
			view.dispatch(view.state.tr.setMeta(stateKey, { allowsUploads }));
		}

		if (this.allowsUploads) {
			this.uploadMediaClientConfig = this.mediaProvider.uploadMediaClientConfig;

			if (this.mediaProvider.uploadParams && this.uploadMediaClientConfig) {
				await this.initPickers(this.mediaProvider.uploadParams, PickerFacade);
			} else {
				this.destroyPickers();
			}
		} else {
			this.destroyPickers();
		}
	}

	getMediaOptions = () => this.options;

	setIsResizing(isResizing: boolean): void {
		this.isResizing = isResizing;
	}

	setResizingWidth(width: number): void {
		this.resizingWidth = width;
	}

	updateElement(): void {
		let newElement;
		const selectedContainer = this.selectedMediaContainerNode();

		if (selectedContainer && this.isMediaSchemaNode(selectedContainer)) {
			newElement = this.getDomElement(this.view.domAtPos.bind(this.view)) as
				| HTMLElement
				| undefined;

			if (selectedContainer.type === this.view.state.schema.nodes.mediaSingle) {
				this.currentMaxWidth =
					getMaxWidthForNestedNodeNext(this.view, this.view.state.selection.$anchor.pos) ||
					undefined;
			} else {
				this.currentMaxWidth = undefined;
			}
		}

		if (this.element !== newElement) {
			this.element = newElement;
		}
	}

	private isMediaSchemaNode = ({ type }: PMNode): boolean => {
		const { mediaInline, mediaSingle, media } = this.view.state.schema.nodes;

		if (getMediaFeatureFlag('mediaInline', this.mediaOptions?.featureFlags)) {
			return type === mediaSingle || type === media || type === mediaInline;
		}

		return type === mediaSingle;
	};

	private getDomElement(domAtPos: EditorView['domAtPos']) {
		const { selection } = this.view.state;
		if (!(selection instanceof NodeSelection)) {
			return;
		}

		if (!this.isMediaSchemaNode(selection.node)) {
			return;
		}

		const node = findDomRefAtPos(selection.from, domAtPos);
		if (node) {
			if (!node.childNodes.length) {
				return node.parentNode as HTMLElement | undefined;
			}

			return node;
		}
		return;
	}

	get contextIdentifierProvider() {
		return this.pluginInjectionApi?.contextIdentifier?.sharedState.currentState()
			?.contextIdentifierProvider;
	}

	// callback to flag that a node has been inserted
	onNodeInserted = (id: string, selectionPosition: number): void => {
		this.lastAddedMediaSingleFileIds.unshift({ id, selectionPosition });
	};

	/**
	 * we insert a new file by inserting a initial state for that file.
	 *
	 * called when we insert a new file via the picker (connected via pickerfacade)
	 */
	insertFile = (
		mediaState: MediaState,
		onMediaStateChanged: MediaStateEventSubscriber,
		pickerType?: string,
		insertMediaVia?: InsertMediaVia,
	): void => {
		const { state } = this.view;
		const editorAnalyticsAPI = this.pluginInjectionApi?.analytics?.actions;

		const mediaStateWithContext: MediaState = {
			...mediaState,
			contextId: this.contextIdentifierProvider
				? this.contextIdentifierProvider.objectId
				: undefined,
		};

		const collection = mediaState.collection ?? this.collectionFromProvider();
		if (collection === undefined) {
			return;
		}

		// We need to dispatch the change to event dispatcher only for successful files
		if (mediaState.status !== 'error') {
			this.updateAndDispatch({
				allUploadsFinished: false,
			});
		}

		if (
			this.uploadInProgressSubscriptions.length > 0 &&
			!this.uploadInProgressSubscriptionsNotified
		) {
			this.uploadInProgressSubscriptions.forEach((fn) => fn(true));
			this.uploadInProgressSubscriptionsNotified = true;
		}

		switch (
			getMediaNodeInsertionType(state, this.mediaOptions, mediaStateWithContext.fileMimeType)
		) {
			case 'inline':
				insertMediaInlineNode(editorAnalyticsAPI)(
					this.view,
					mediaStateWithContext,
					collection,
					this.allowInlineImages,
					this.getInputMethod(pickerType),
					insertMediaVia,
				);
				break;
			case 'block':
				// read width state right before inserting to get up-to-date and define values
				const widthPluginState: WidthPluginState | undefined =
					this.pluginInjectionApi?.width?.sharedState.currentState();

				insertMediaSingleNode(
					this.view,
					mediaStateWithContext,
					this.getInputMethod(pickerType),
					collection,
					this.mediaOptions && this.mediaOptions.alignLeftOnInsert,
					widthPluginState,
					editorAnalyticsAPI,
					this.onNodeInserted,
					insertMediaVia,
					this.mediaOptions && this.mediaOptions.allowPixelResizing,
				);
				break;
			case 'group':
				insertMediaGroupNode(editorAnalyticsAPI)(
					this.view,
					[mediaStateWithContext],
					collection,
					this.getInputMethod(pickerType),
					insertMediaVia,
				);
				break;
		}

		// do events when media state changes
		onMediaStateChanged(this.handleMediaState);

		// handle waiting for upload complete
		const isEndState = (state: MediaState) =>
			state.status && MEDIA_RESOLVED_STATES.indexOf(state.status) !== -1;

		if (!isEndState(mediaStateWithContext)) {
			const uploadingPromise = new Promise<MediaState | null>((resolve) => {
				onMediaStateChanged((newState) => {
					// When media item reaches its final state, remove listener and resolve
					if (isEndState(newState)) {
						resolve(newState);
					}
				});
			});

			this.taskManager.addPendingTask(uploadingPromise, mediaStateWithContext.id).then(() => {
				this.updateAndDispatch({
					allUploadsFinished: true,
				});
			});
		}

		// refocus the view
		const { view } = this;
		if (!view.hasFocus()) {
			view.focus();
		}

		this.waitForPendingTasks().then(() => {
			if (
				this.uploadInProgressSubscriptions.length > 0 &&
				this.uploadInProgressSubscriptionsNotified
			) {
				this.uploadInProgressSubscriptions.forEach((fn) => fn(false));
				this.uploadInProgressSubscriptionsNotified = false;
			}
		});

		this.selectLastAddedMediaNode();
	};

	private selectLastAddedMediaNode() {
		// if preventAutoFocusOnUpload is enabled, skip auto-selection and just clear the tracking array
		if (
			this.mediaOptions?.preventAutoFocusOnUpload &&
			fg('jira_kuro-jjj_disable_auto_focus_after_img_upload')
		) {
			this.lastAddedMediaSingleFileIds = [];
			return;
		}

		// if lastAddedMediaSingleFileIds is empty exit because there are no added media single nodes to be selected
		if (this.lastAddedMediaSingleFileIds.length !== 0) {
			this.waitForPendingTasks().then(() => {
				const lastTrackedAddedNode = this.lastAddedMediaSingleFileIds[0];
				// execute selection only if selection did not change after the node has been inserted
				if (lastTrackedAddedNode?.selectionPosition === this.view.state.selection.from) {
					const lastAddedNode = this.mediaNodes.find((node) => {
						return node.node.attrs.id === lastTrackedAddedNode.id;
					});
					const lastAddedNodePos = lastAddedNode?.getPos();
					if (lastAddedNodePos) {
						const { dispatch, state } = this.view;
						const tr = state.tr;
						tr.setSelection(NodeSelection.create(tr.doc, lastAddedNodePos));
						if (dispatch) {
							dispatch(tr);
						}
					}
				}
				// reset temp constant after uploads finished
				this.lastAddedMediaSingleFileIds = [];
			});
		}
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addPendingTask = (task: Promise<any>): void => {
		this.taskManager.addPendingTask(task);
	};

	splitMediaGroup = (): boolean => splitMediaGroup(this.view);

	onPopupPickerClose = (): void => {
		this.onPopupToggleCallback(false);
	};

	showMediaPicker = (): void => {
		if (this.openMediaPickerBrowser) {
			return this.openMediaPickerBrowser();
		}
		this.onPopupToggleCallback(true);
	};

	setBrowseFn = (browseFn: () => void): void => {
		this.openMediaPickerBrowser = browseFn;
	};

	onPopupToggle = (onPopupToggleCallback: (isOpen: boolean) => void): void => {
		this.onPopupToggleCallback = onPopupToggleCallback;
	};

	/**
	 * Returns a promise that is resolved after all pending operations have been finished.
	 * An optional timeout will cause the promise to reject if the operation takes too long
	 *
	 * NOTE: The promise will resolve even if some of the media have failed to process.
	 */
	waitForPendingTasks = this.taskManager.waitForPendingTasks;

	setView(view: EditorView): void {
		this.view = view;
	}

	/**
	 * Called from React UI Component when user clicks on "Delete" icon
	 * inside of it
	 */
	handleMediaNodeRemoval = (node: PMNode | undefined, getPos: ProsemirrorGetPosHandler): void => {
		let getNode = node;
		if (!getNode) {
			const pos = getPos();
			if (typeof pos !== 'number') {
				return;
			}
			getNode = this.view.state.doc.nodeAt(pos) as PMNode;
		}

		removeMediaNode(this.view, getNode, getPos);
	};

	private getIdentifierKey = (identifier: Identifier) => {
		if (identifier.mediaItemType === 'file') {
			return identifier.id;
		} else {
			return identifier.dataURI;
		}
	};

	trackMediaNodeAddition = (node: PMNode): void => {
		const identifier = getIdentifier(node.attrs as MediaADFAttrs);
		const key = this.getIdentifierKey(identifier);
		const { count } = this.identifierCount.get(key) ?? { count: 0 };
		if (count === 0) {
			this.taskManager.resumePendingTask(key);
		}
		this.identifierCount.set(key, { identifier, count: count + 1 });
	};

	trackMediaNodeRemoval = (node: PMNode): void => {
		const identifier = getIdentifier(node.attrs as MediaADFAttrs);
		const key = this.getIdentifierKey(identifier);
		const { count } = this.identifierCount.get(key) ?? { count: 0 };
		if (count === 1) {
			this.taskManager.cancelPendingTask(key);
		}
		this.identifierCount.set(key, { identifier, count: count - 1 });
	};

	isIdentifierInEditorScope = (identifier: Identifier) => {
		const key = this.getIdentifierKey(identifier);

		// rely on has instead of count > 0 because if the user cuts and pastes the same media
		// the count will temporarily be 0 but the media is still in the scope of editor.
		return !this.outOfEditorScopeIdentifierMap.has(key) && this.identifierCount.has(key);
	};

	/**
	 * This is used in on Paste of media, this tracks which if the pasted media originated from a outside the editor
	 * i.e. the pasted media was not uplaoded to the current editor.
	 * This is to enable mediaShallowCopySope to enable only shallow copying media referenced within the edtior
	 */
	trackOutOfScopeIdentifier = (identifier: Identifier): void => {
		const key = this.getIdentifierKey(identifier);

		this.outOfEditorScopeIdentifierMap.set(key, { identifier });
	};

	/**
	 * Called from React UI Component on componentDidMount
	 */
	handleMediaNodeMount = (node: PMNode, getPos: ProsemirrorGetPosHandler): void => {
		this.trackMediaNodeAddition(node);

		this.mediaNodes.unshift({ node, getPos });
	};

	/**
	 * Called from React UI Component on componentWillUnmount and UNSAFE_componentWillReceiveProps
	 * when React component's underlying node property is replaced with a new node
	 */
	handleMediaNodeUnmount = (oldNode: PMNode): void => {
		this.trackMediaNodeRemoval(oldNode);

		this.mediaNodes = this.mediaNodes.filter(({ node }) => oldNode !== node);
	};

	handleMediaGroupUpdate = (oldNodes: PMNode[], newNodes: PMNode[]): void => {
		const addedNodes = newNodes.filter((node) =>
			oldNodes.every((oldNode) => oldNode.attrs.id !== node.attrs.id),
		);
		const removedNodes = oldNodes.filter((node) =>
			newNodes.every((newNode) => newNode.attrs.id !== node.attrs.id),
		);

		addedNodes.forEach((node) => {
			this.trackMediaNodeAddition(node);
		});

		removedNodes.forEach((oldNode) => {
			this.trackMediaNodeRemoval(oldNode);
		});
	};

	destroy(): void {
		if (this.destroyed) {
			return;
		}

		this.destroyed = true;

		const { mediaNodes } = this;
		mediaNodes.splice(0, mediaNodes.length);

		this.removeOnCloseListener();
		this.destroyPickers();
	}

	findMediaNode = (id: string): MediaNodeWithPosHandler | null => {
		return helpers.findMediaNode(this, id);
	};

	private destroyAllPickers = (pickers: Array<PickerFacade>) => {
		pickers.forEach((picker) => picker.destroy());
		this.pickers.splice(0, this.pickers.length);
	};

	private destroyPickers = () => {
		const { pickers, pickerPromises } = this;

		// If pickerPromises and pickers are the same length
		// All pickers have resolved and we safely destroy them
		// Otherwise wait for them to resolve then destroy.
		if (pickerPromises.length === pickers.length) {
			this.destroyAllPickers(this.pickers);
		} else {
			Promise.all(pickerPromises).then((resolvedPickers) =>
				this.destroyAllPickers(resolvedPickers),
			);
		}

		this.customPicker = undefined;
	};

	private async initPickers(uploadParams: UploadParams, Picker: typeof PickerFacade) {
		if (this.destroyed || !this.uploadMediaClientConfig) {
			return;
		}
		const { errorReporter, pickers, pickerPromises } = this;
		// create pickers if they don't exist, re-use otherwise
		if (!pickers.length) {
			const pickerFacadeConfig: PickerFacadeConfig = {
				mediaClientConfig: this.uploadMediaClientConfig,
				errorReporter,
			};

			if (this.options.customMediaPicker) {
				const customPicker = new Picker(
					'customMediaPicker',
					pickerFacadeConfig,
					this.options.customMediaPicker,
				).init();

				pickerPromises.push(customPicker);
				pickers.push((this.customPicker = await customPicker));
			}

			pickers.forEach((picker) => {
				picker.onNewMedia(this.insertFile);
			});
		}

		// set new upload params for the pickers
		pickers.forEach((picker) => picker.setUploadParams(uploadParams));
	}

	private getInputMethod = (pickerType?: string): InputMethodInsertMedia | undefined => {
		switch (pickerType) {
			case INPUT_METHOD.PICKER_CLOUD:
				return INPUT_METHOD.PICKER_CLOUD;
			case INPUT_METHOD.MEDIA_PICKER:
				return INPUT_METHOD.MEDIA_PICKER;
			case 'clipboard':
				return INPUT_METHOD.CLIPBOARD;
			case 'dropzone':
				return INPUT_METHOD.DRAG_AND_DROP;
			case 'browser':
				return INPUT_METHOD.BROWSER;
		}
		return;
	};

	updateMediaSingleNodeAttrs = (id: string, attrs: object) => {
		const { view } = this;
		if (!view) {
			return;
		}

		return updateMediaNodeAttrs(id, attrs)(view.state, view.dispatch);
	};

	private collectionFromProvider(): string | undefined {
		return (
			this.mediaProvider &&
			this.mediaProvider.uploadParams &&
			this.mediaProvider.uploadParams.collection
		);
	}

	private handleMediaState: MediaStateEventListener = (state) => {
		switch (state.status) {
			case 'error':
				const { uploadErrorHandler } = this.options;
				if (uploadErrorHandler) {
					uploadErrorHandler(state);
				}
				break;
		}
	};

	removeSelectedMediaContainer = (): boolean => {
		const { view } = this;

		const selectedNode = this.selectedMediaContainerNode();
		if (!selectedNode) {
			return false;
		}

		const { from } = view.state.selection;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		removeMediaNode(view, selectedNode.firstChild!, () => from + 1);
		return true;
	};

	selectedMediaContainerNode = (): PMNode | undefined => {
		const { selection } = this.view.state;
		if (selection instanceof NodeSelection && this.isMediaSchemaNode(selection.node)) {
			return selection.node;
		}
		return;
	};

	handleDrag = (dragState: 'enter' | 'leave'): void => {
		const isActive = dragState === 'enter';
		if (this.showDropzone === isActive) {
			return;
		}
		this.showDropzone = isActive;

		const { dispatch, state } = this.view;
		const { tr, selection, doc } = state;
		const { media, mediaGroup } = state.schema.nodes;

		// Workaround for wrong upload position
		// @see https://product-fabric.atlassian.net/browse/MEX-2457
		// If the media node is the last selectable item in the current cursor position and it is located within a mediaGroup,
		// we relocate the cursor to the first child of the mediaGroup.
		const pos = Math.max(0, selection.$from.pos - 1);
		const sel = Selection.findFrom(doc.resolve(pos), -1);

		if (sel && findSelectedNodeOfType(media)(sel)) {
			const parent = findParentNodeOfType(mediaGroup)(sel);
			if (parent) {
				tr.setSelection(NodeSelection.create(tr.doc, parent.start));
			}
		}

		// Trigger state change to be able to pick it up in the decorations handler
		dispatch(tr);
	};

	updateAndDispatch(
		props: Partial<Pick<this, 'allowsUploads' | 'allUploadsFinished' | 'isFullscreen'>>,
	): void {
		// update plugin state
		Object.keys(props).forEach((_key) => {
			const key = _key as keyof typeof props;
			const value = props[key];
			if (value !== undefined) {
				this[key] = value;
			}
		});

		if (this.dispatch) {
			this.dispatch(stateKey, { ...this });
		}
	}
}

export const getMediaPluginState = (state: EditorState) =>
	stateKey.getState(state) as MediaPluginState;

export const createPlugin = (
	_schema: Schema,
	options: MediaPluginOptions,
	getIntl: () => IntlShape,
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	nodeViewPortalProviderAPI: PortalProviderAPI,
	dispatch?: Dispatch,
	mediaOptions?: MediaOptions,
) => {
	const intl = getIntl();

	return new SafePlugin({
		state: {
			init(_config, state) {
				return new MediaPluginStateImplementation(
					state,
					options,
					mediaOptions,
					dispatch,
					pluginInjectionApi,
				);
			},
			apply(tr, pluginState: MediaPluginState) {
				const isResizing = tr.getMeta(MEDIA_PLUGIN_IS_RESIZING_KEY);
				const resizingWidth = tr.getMeta(MEDIA_PLUGIN_RESIZING_WIDTH_KEY);
				const mediaProvider = tr.getMeta(stateKey)?.mediaProvider;
				// Yes, I agree with you; this approach, using the clone() fuction, below is horrifying.
				// However, we needed to implement this workaround to solve the singleton Media PluginState.
				// The entire PluginInjectionAPI relies on the following axiom: "A PluginState that reflects a new EditorState.". We can not have the mutable singleton instance for all EditorState.
				// Unfortunately, we can't implement a proper fix for this media state situation. So, we are faking a new object using a Proxy instance.
				let nextPluginState = pluginState;

				if (isResizing !== undefined) {
					pluginState.setIsResizing(isResizing);
					nextPluginState = nextPluginState.clone();
				}

				if (mediaProvider) {
					pluginState.setMediaProvider(mediaProvider);
				}

				if (resizingWidth) {
					pluginState.setResizingWidth(resizingWidth);
					nextPluginState = nextPluginState.clone();
				}

				// remap editing media single position if we're in collab
				if (typeof pluginState.editingMediaSinglePos === 'number') {
					pluginState.editingMediaSinglePos = tr.mapping.map(pluginState.editingMediaSinglePos);
					nextPluginState = nextPluginState.clone();
				}

				const meta = tr.getMeta(stateKey);
				if (meta) {
					const { allowsUploads } = meta;
					pluginState.updateAndDispatch({
						allowsUploads:
							typeof allowsUploads === 'undefined' ? pluginState.allowsUploads : allowsUploads,
					});
					nextPluginState = nextPluginState.clone();
				}

				// ACTIONS
				switch (meta?.type) {
					case ACTIONS.SHOW_MEDIA_VIEWER:
						pluginState.mediaViewerSelectedMedia = meta.mediaViewerSelectedMedia;
						pluginState.isMediaViewerVisible = meta.isMediaViewerVisible;
						nextPluginState = nextPluginState.clone();
						break;
					case ACTIONS.HIDE_MEDIA_VIEWER:
						pluginState.mediaViewerSelectedMedia = undefined;
						pluginState.isMediaViewerVisible = meta.isMediaViewerVisible;
						nextPluginState = nextPluginState.clone();
						break;
					case ACTIONS.TRACK_MEDIA_PASTE:
						const { identifier } = meta;
						const isIdentifierInEditorScope = pluginState.isIdentifierInEditorScope(identifier);
						if (!isIdentifierInEditorScope && isFileIdentifier(identifier)) {
							pluginState.trackOutOfScopeIdentifier(identifier);
							nextPluginState = pluginState.clone();
						}
						break;
				}

				// NOTE: We're not calling passing new state to the Editor, because we depend on the view.state reference
				//       throughout the lifetime of view. We injected the view into the plugin state, because we dispatch()
				//       transformations from within the plugin state (i.e. when adding a new file).
				return nextPluginState;
			},
		},
		appendTransaction(transactions, _oldState: EditorState, newState: EditorState) {
			for (const transaction of transactions) {
				const isSelectionOnMediaInsideMediaSingle =
					transaction.selectionSet &&
					isNodeSelection(transaction.selection) &&
					(transaction.selection as NodeSelection).node.type === newState.schema.nodes.media &&
					transaction.selection.$anchor.parent.type === newState.schema.nodes.mediaSingle;

				// Note: this causes an additional transaction when selecting a media node
				// through clicking  on it with the cursor.
				if (isSelectionOnMediaInsideMediaSingle) {
					// If a selection has been placed on a media inside a media single,
					// we shift it to the media single parent as other code is opinionated about
					// the selection landing there. In particular the caption insertion and selection
					// action.
					return newState.tr.setSelection(
						NodeSelection.create(newState.doc, transaction.selection.$from.pos - 1),
					);
				}
			}
			return;
		},
		key: stateKey,
		view: (view) => {
			const pluginState = getMediaPluginState(view.state);
			pluginState.setView(view);
			pluginState.updateElement();

			return {
				update: () => {
					pluginState.updateElement();
				},
			};
		},
		props: {
			decorations: (state) => {
				// Use this to indicate that the media node is selected
				const mediaNodes: Decoration[] = [];
				const {
					schema,
					selection: { $anchor },
					doc,
				} = state;

				// Find any media nodes in the current selection
				if (
					state.selection instanceof TextSelection ||
					state.selection instanceof AllSelection ||
					(!expValEquals('platform_editor_nested_media_selection_fix', 'isEnabled', true) &&
						state.selection instanceof NodeSelection) ||
					state.selection instanceof CellSelection
				) {
					doc.nodesBetween(state.selection.from, state.selection.to, (node, pos) => {
						if (node.type === schema.nodes.media) {
							mediaNodes.push(
								Decoration.node(pos, pos + node.nodeSize, {}, { type: 'media', selected: true }),
							);
							return false;
						}
						return true;
					});
				} else if (
					expValEquals('platform_editor_nested_media_selection_fix', 'isEnabled', true) &&
					state.selection instanceof NodeSelection
				) {
					const { node, $from } = state.selection;

					if (node.type === schema.nodes.mediaSingle || node.type === schema.nodes.mediaGroup) {
						doc.nodesBetween($from.pos, $from.pos + node.nodeSize, (mediaNode, mediaPos) => {
							if (mediaNode.type === schema.nodes.media) {
								mediaNodes.push(
									Decoration.node(
										mediaPos,
										mediaPos + mediaNode.nodeSize,
										{},
										{ type: 'media', selected: true },
									),
								);
								return false;
							}
							return true;
						});
					}
				}

				const pluginState = getMediaPluginState(state);
				if (!pluginState.showDropzone) {
					return DecorationSet.create(state.doc, mediaNodes);
				}

				// When a media is already selected
				if (state.selection instanceof NodeSelection) {
					const node = state.selection.node;

					if (node.type === schema.nodes.mediaSingle) {
						const deco = Decoration.node(state.selection.from, state.selection.to, {
							class: 'richMedia-selected',
						});

						return DecorationSet.create(state.doc, [deco, ...mediaNodes]);
					}

					return DecorationSet.create(state.doc, mediaNodes);
				}

				let pos: number | null | void = $anchor.pos;
				if (
					$anchor.parent.type !== schema.nodes.paragraph &&
					$anchor.parent.type !== schema.nodes.codeBlock
				) {
					pos = insertPoint(state.doc, pos, schema.nodes.mediaGroup);
				}

				if (pos === null || pos === undefined) {
					return DecorationSet.create(state.doc, mediaNodes);
				}
				// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
				const dropPlaceholderKey = uuid();
				const dropPlaceholders: Decoration[] = [
					Decoration.widget(
						pos,
						() => {
							return createDropPlaceholder(
								intl,
								nodeViewPortalProviderAPI,
								dropPlaceholderKey,
								mediaOptions && mediaOptions.allowDropzoneDropLine,
							);
						},
						{
							key: 'drop-placeholder',
							destroy: (elem) => {
								if (elem instanceof HTMLElement) {
									nodeViewPortalProviderAPI.remove(dropPlaceholderKey);
								}
							},
						},
					),
					...mediaNodes,
				];
				return DecorationSet.create(state.doc, dropPlaceholders);
			},
			nodeViews: options.nodeViews,
			handleTextInput(view: EditorView, from, to, text): boolean {
				const { selection } = view.state;
				if (
					text === ' ' &&
					selection instanceof NodeSelection &&
					selection.node.type.name === 'mediaSingle'
				) {
					const videoControlsWrapperRef = stateKey.getState(view.state)?.element;
					const videoControls = videoControlsWrapperRef?.querySelectorAll<HTMLButtonElement>(
						'button, [tabindex]:not([tabindex="-1"])',
					);
					if (videoControls) {
						const isVideoControl = Array.from(videoControls).some(
							(videoControl: HTMLButtonElement) => {
								// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
								return document.activeElement === videoControl;
							},
						);
						if (isVideoControl) {
							return true;
						}
					}
				}

				getMediaPluginState(view.state).splitMediaGroup();
				return false;
			},
			handleClick: (_editorView, _pos, event: MouseEvent) => {
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const clickedInsideCaptionPlaceholder = (event.target as HTMLElement)?.closest(
					`[data-id="${CAPTION_PLACEHOLDER_ID}"]`,
				);

				// Workaround for Chrome given a regression introduced in prosemirror-view@1.18.6
				// Returning true prevents that updateSelection() is getting called in the commit below:
				// @see https://github.com/ProseMirror/prosemirror-view/compare/1.18.5...1.18.6
				if ((browser.chrome || browser.safari) && clickedInsideCaptionPlaceholder) {
					return true;
				}

				// Workaound for iOS 16 Caption selection issue
				// @see https://product-fabric.atlassian.net/browse/MEX-2012
				if (browser.ios) {
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					return !!(event.target as HTMLElement)?.closest(
						`[class="${MEDIA_CONTENT_WRAP_CLASS_NAME}"]`,
					);
				}

				return false;
			},
			handleDoubleClickOn: (view) => {
				// Check if media viewer is enabled
				const pluginState = getMediaPluginState(view.state);
				if (!pluginState.mediaOptions?.allowImagePreview) {
					return false;
				}

				const isLivePagesViewMode =
					pluginInjectionApi?.editorViewMode?.sharedState.currentState()?.mode === 'view';

				// Double Click support for Media Viewer Nodes
				const maybeMediaNode = getMediaFromSupportedMediaNodesFromSelection(view.state);
				if (maybeMediaNode) {
					// If media type is video, do not open media viewer
					if (!isNodeDoubleClickSupportedInLivePagesViewMode(isLivePagesViewMode, maybeMediaNode)) {
						return false;
					}
					// Show media viewer
					pluginInjectionApi?.core.actions.execute(
						pluginInjectionApi?.media.commands.showMediaViewer(
							maybeMediaNode.attrs as MediaADFAttrs,
						),
					);

					// Call analytics event
					pluginInjectionApi?.analytics?.actions.fireAnalyticsEvent({
						action: ACTION.OPENED,
						actionSubject: ACTION_SUBJECT.MEDIA_VIEWER,
						actionSubjectId: ACTION_SUBJECT_ID.MEDIA,
						eventType: EVENT_TYPE.UI,
						attributes: {
							nodeType: maybeMediaNode.type.name,
							inputMethod: INPUT_METHOD.DOUBLE_CLICK,
						},
					});

					return true;
				}

				return false;
			},
			handleDOMEvents: {
				keydown: (view, event: KeyboardEvent) => {
					const { selection } = view.state;
					if (selection instanceof NodeSelection && selection.node.type.name === 'mediaSingle') {
						// handle keydown events for video controls panel to prevent fire of rest prosemirror listeners;
						if (event?.target instanceof HTMLElement) {
							const a11yDefaultKeys = ['Tab', 'Space', 'Enter', 'Shift', 'Esc'];
							const targetsAndButtons = {
								button: a11yDefaultKeys,
								range: [...a11yDefaultKeys, 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'],
								combobox: [...a11yDefaultKeys, 'ArrowDown', 'ArrowUp', 'Esc'],
								slider: ['Tab', 'Shift', 'ArrowLeft', 'ArrowRight'],
							};

							const targetRole = event.target.role;
							const targetType = (event.target as HTMLElement & { type?: string }).type;

							const allowedTargets = targetRole || targetType;

							// only if targeting interactive elements fe. button, slider, range, dropdown
							if (allowedTargets && allowedTargets in targetsAndButtons) {
								const targetRelatedA11YKeys: string[] =
									targetsAndButtons[allowedTargets as keyof typeof targetsAndButtons];
								const allowedKeys = new Set(targetRelatedA11YKeys);

								if (allowedKeys.has(event.key) || allowedKeys.has(event.code)) {
									// allow event to bubble to be handled by react handlers
									return true;
								} else {
									// otherwise focus editor to allow setting gapCursor. (e.g.: arrowRightFromMediaSingle)
									view.focus();
								}
							}
						}
					}
					// fire regular prosemirror listeners;
					return false;
				},
			},
		},
	});
};
