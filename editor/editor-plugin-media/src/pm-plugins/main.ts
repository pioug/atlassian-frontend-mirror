import assert from 'assert';

import React from 'react';

import ReactDOM from 'react-dom';
import type { IntlShape } from 'react-intl-next';
import { RawIntlProvider } from 'react-intl-next';

import type { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import type { InputMethodInsertMedia } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { mediaInlineImagesEnabled } from '@atlaskit/editor-common/media-inline';
import {
	CAPTION_PLACEHOLDER_ID,
	getMaxWidthForNestedNodeNext,
} from '@atlaskit/editor-common/media-single';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { browser, ErrorReporter } from '@atlaskit/editor-common/utils';
import type { WidthPluginState } from '@atlaskit/editor-plugin-width';
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
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import type { MediaClientConfig } from '@atlaskit/media-core';
import type { UploadParams } from '@atlaskit/media-picker/types';
import { fg } from '@atlaskit/platform-feature-flags';

import * as helpers from '../commands/helpers';
import { updateMediaNodeAttrs } from '../commands/helpers';
import type { MediaPluginOptions } from '../media-plugin-options';
import type { MediaNextEditorPluginType } from '../next-plugin-type';
import type {
	MediaStateEventListener,
	MediaStateEventSubscriber,
	PickerFacadeConfig,
} from '../picker-facade';
import PickerFacade from '../picker-facade';
import type {
	MediaOptions,
	MediaState,
	MediaStateStatus,
	getPosHandlerNode as ProsemirrorGetPosHandler,
} from '../types';
import type { PlaceholderType } from '../ui/Media/DropPlaceholder';
import DropPlaceholder from '../ui/Media/DropPlaceholder';
import { removeMediaNode, splitMediaGroup } from '../utils/media-common';
import { insertMediaGroupNode, insertMediaInlineNode } from '../utils/media-files';
import { getMediaNodeInsertionType } from '../utils/media-inline';
import { insertMediaSingleNode } from '../utils/media-single';

import { MediaTaskManager } from './mediaTaskManager';
import { stateKey } from './plugin-key';
import type { MediaNodeWithPosHandler, MediaPluginState } from './types';

export type { MediaState, MediaProvider, MediaStateStatus };
export { stateKey } from './plugin-key';

export const MEDIA_CONTENT_WRAP_CLASS_NAME = 'media-content-wrap';
export const MEDIA_PLUGIN_IS_RESIZING_KEY = 'mediaSinglePlugin.isResizing';
export const MEDIA_PLUGIN_RESIZING_WIDTH_KEY = 'mediaSinglePlugin.resizing-width';

const createDropPlaceholder = (intl: IntlShape, allowDropLine?: boolean) => {
	const dropPlaceholder = document.createElement('div');
	const createElement = React.createElement;

	if (allowDropLine) {
		ReactDOM.render(
			createElement(
				RawIntlProvider,
				{ value: intl },
				createElement(DropPlaceholder, { type: 'single' } as {
					type: PlaceholderType;
				}),
			),
			dropPlaceholder,
		);
	} else {
		ReactDOM.render(
			createElement(RawIntlProvider, { value: intl }, createElement(DropPlaceholder)),
			dropPlaceholder,
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

	private nodeCount = new Map<string, number>();
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
		newInsertionBehaviour: boolean | undefined,
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

		if (fg('platform_editor_media_provider_from_plugin_config')) {
			if (mediaOptions?.provider) {
				this.setMediaProvider(mediaOptions?.provider);
			}
		} else {
			options.providerFactory.subscribe(
				'mediaProvider',
				(_name: string, provider?: Promise<MediaProvider>) => this.setMediaProvider(provider),
			);
		}

		if (
			mediaInlineImagesEnabled(
				getMediaFeatureFlag('mediaInline', this.mediaOptions?.featureFlags),
				this.mediaOptions?.allowMediaInlineImages,
			)
		) {
			this.allowInlineImages = true;
		}

		this.errorReporter = options.errorReporter || new ErrorReporter();
		this.singletonCreatedAt = (performance || Date).now();
	}

	clone() {
		const clonedAt = (performance || Date).now();
		return new Proxy(this, {
			get(target, prop, receiver) {
				if (prop === 'singletonCreatedAt') {
					return clonedAt;
				}

				return Reflect.get(target, prop, receiver);
			},
		});
	}

	subscribeToUploadInProgressState(fn: (isUploading: boolean) => void) {
		this.uploadInProgressSubscriptions.push(fn);
	}

	unsubscribeFromUploadInProgressState(fn: (isUploading: boolean) => void) {
		this.uploadInProgressSubscriptions = this.uploadInProgressSubscriptions.filter(
			(subscribedFn) => subscribedFn !== fn,
		);
	}

	setMediaProvider = async (mediaProvider?: Promise<MediaProvider>) => {
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

		// TODO disable (not destroy!) pickers until mediaProvider is resolved
		try {
			this.mediaProvider = await mediaProvider;

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
	};

	getMediaOptions = () => this.options;

	setIsResizing(isResizing: boolean) {
		this.isResizing = isResizing;
	}

	setResizingWidth(width: number) {
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
	onNodeInserted = (id: string, selectionPosition: number) => {
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
	) => {
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
				);
				break;
			case 'group':
				insertMediaGroupNode(editorAnalyticsAPI)(
					this.view,
					[mediaStateWithContext],
					collection,
					this.getInputMethod(pickerType),
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

	addPendingTask = (task: Promise<any>) => {
		this.taskManager.addPendingTask(task);
	};

	splitMediaGroup = (): boolean => splitMediaGroup(this.view);

	onPopupPickerClose = () => {
		this.onPopupToggleCallback(false);
	};

	showMediaPicker = () => {
		if (this.openMediaPickerBrowser) {
			return this.openMediaPickerBrowser();
		}
		this.onPopupToggleCallback(true);
	};

	setBrowseFn = (browseFn: () => void) => {
		this.openMediaPickerBrowser = browseFn;
	};

	onPopupToggle = (onPopupToggleCallback: (isOpen: boolean) => void) => {
		this.onPopupToggleCallback = onPopupToggleCallback;
	};

	/**
	 * Returns a promise that is resolved after all pending operations have been finished.
	 * An optional timeout will cause the promise to reject if the operation takes too long
	 *
	 * NOTE: The promise will resolve even if some of the media have failed to process.
	 */
	waitForPendingTasks = this.taskManager.waitForPendingTasks;

	setView(view: EditorView) {
		this.view = view;
	}

	/**
	 * Called from React UI Component when user clicks on "Delete" icon
	 * inside of it
	 */
	handleMediaNodeRemoval = (node: PMNode | undefined, getPos: ProsemirrorGetPosHandler) => {
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

	trackMediaNodeAddition = (node: PMNode) => {
		const id = node.attrs.id;
		const count = this.nodeCount.get(id) ?? 0;
		if (count === 0) {
			this.taskManager.resumePendingTask(id);
		}
		this.nodeCount.set(id, count + 1);
	};

	trackMediaNodeRemoval = (node: PMNode) => {
		const id = node.attrs.id;
		const count = this.nodeCount.get(id) ?? 0;
		if (count === 1) {
			this.taskManager.cancelPendingTask(id);
		}
		this.nodeCount.set(id, count - 1);
	};
	/**
	 * Called from React UI Component on componentDidMount
	 */
	handleMediaNodeMount = (node: PMNode, getPos: ProsemirrorGetPosHandler) => {
		this.trackMediaNodeAddition(node);

		this.mediaNodes.unshift({ node, getPos });
	};

	/**
	 * Called from React UI Component on componentWillUnmount and UNSAFE_componentWillReceiveProps
	 * when React component's underlying node property is replaced with a new node
	 */
	handleMediaNodeUnmount = (oldNode: PMNode) => {
		this.trackMediaNodeRemoval(oldNode);

		this.mediaNodes = this.mediaNodes.filter(({ node }) => oldNode !== node);
	};

	handleMediaGroupUpdate = (oldNodes: PMNode[], newNodes: PMNode[]) => {
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

	destroy() {
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
			case 'clipboard':
				return INPUT_METHOD.CLIPBOARD;
			case 'dropzone':
				return INPUT_METHOD.DRAG_AND_DROP;
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

		let { from } = view.state.selection;
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

	handleDrag = (dragState: 'enter' | 'leave') => {
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
	) {
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
	reactContext: () => {},
	getIntl: () => IntlShape,
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	dispatch?: Dispatch,
	mediaOptions?: MediaOptions,
	newInsertionBehaviour?: boolean,
) => {
	const intl = getIntl();

	const dropPlaceholder = createDropPlaceholder(
		intl,
		mediaOptions && mediaOptions.allowDropzoneDropLine,
	);

	return new SafePlugin({
		state: {
			init(_config, state) {
				return new MediaPluginStateImplementation(
					state,
					options,
					mediaOptions,
					newInsertionBehaviour,
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

				if (mediaProvider && fg('platform_editor_media_provider_from_plugin_config')) {
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
					state.selection instanceof NodeSelection ||
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

				const dropPlaceholders: Decoration[] = [
					Decoration.widget(pos, dropPlaceholder, { key: 'drop-placeholder' }),
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
					return !!(event.target as HTMLElement)?.closest(
						`[class="${MEDIA_CONTENT_WRAP_CLASS_NAME}"]`,
					);
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
								let targetRelatedA11YKeys: string[] =
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
