import React from 'react';
import ReactDOM from 'react-dom';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { EditorState, NodeSelection, Plugin } from 'prosemirror-state';
import { insertPoint } from 'prosemirror-transform';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { MediaClientConfig } from '@atlaskit/media-core';
import { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import { PopupConfig, UploadParams } from '@atlaskit/media-picker/types';
import {
  ContextIdentifierProvider,
  ErrorReporter,
  MediaProvider,
} from '@atlaskit/editor-common';
import assert from 'assert';
import { findDomRefAtPos, isNodeSelection } from 'prosemirror-utils';
import { Dispatch } from '../../../event-dispatcher';
import { ProsemirrorGetPosHandler } from '../../../nodeviews';
import { insertMediaSingleNode, isMediaSingle } from '../utils/media-single';
import { MediaPluginOptions } from '../media-plugin-options';
import DropPlaceholder, { PlaceholderType } from '../ui/Media/DropPlaceholder';
import { MediaOptions, MediaState, MediaStateStatus } from '../types';
import { insertMediaGroupNode } from '../utils/media-files';
import { removeMediaNode, splitMediaGroup } from '../utils/media-common';
import * as helpers from '../commands/helpers';
import { updateMediaNodeAttrs } from '../commands/helpers';
import { stateKey } from './plugin-key';
import PickerFacade, {
  MediaStateEventListener,
  MediaStateEventSubscriber,
  PickerFacadeConfig,
} from '../picker-facade';
import { INPUT_METHOD, InputMethodInsertMedia } from '../../analytics/types';
import { isImage } from '../utils/is-image';
import { MediaNodeWithPosHandler, MediaPluginState } from './types';

export type { MediaState, MediaProvider, MediaStateStatus };
export { stateKey } from './plugin-key';

const createDropPlaceholder = (allowDropLine?: boolean) => {
  const dropPlaceholder = document.createElement('div');
  if (allowDropLine) {
    ReactDOM.render(
      React.createElement(DropPlaceholder, { type: 'single' } as {
        type: PlaceholderType;
      }),
      dropPlaceholder,
    );
  } else {
    ReactDOM.render(React.createElement(DropPlaceholder), dropPlaceholder);
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
  element?: HTMLElement;
  layout: MediaSingleLayout = 'center';
  mediaNodes: MediaNodeWithPosHandler[] = [];
  mediaGroupNodes: Record<string, any> = {};
  mobileUploadComplete: Record<string, boolean> = {};
  options: MediaPluginOptions;
  mediaProvider?: MediaProvider;

  private pendingTask = Promise.resolve<MediaState | null>(null);
  private view!: EditorView;
  private destroyed = false;
  private contextIdentifierProvider?: ContextIdentifierProvider;
  private errorReporter: ErrorReporter;
  private popupPicker?: PickerFacade;
  // @ts-ignore: private is OK
  private customPicker?: PickerFacade;
  private removeOnCloseListener: () => void = () => {};
  private openMediaPickerBrowser?: () => void;
  private onPopupToogleCallback: (isOpen: boolean) => void = () => {};
  private reactContext: () => {};

  pickers: PickerFacade[] = [];
  pickerPromises: Array<Promise<PickerFacade>> = [];

  editingMediaSinglePos?: number;
  showEditingDialog?: boolean;
  mediaOptions?: MediaOptions;
  dispatch?: Dispatch;

  constructor(
    state: EditorState,
    options: MediaPluginOptions,
    reactContext: () => {},
    mediaOptions?: MediaOptions,
    dispatch?: Dispatch,
  ) {
    this.reactContext = reactContext;
    this.options = options;
    this.mediaOptions = mediaOptions;
    this.dispatch = dispatch;
    this.waitForMediaUpload =
      options.waitForMediaUpload === undefined
        ? true
        : options.waitForMediaUpload;

    const { nodes } = state.schema;
    assert(
      nodes.media && (nodes.mediaGroup || nodes.mediaSingle),
      'Editor: unable to init media plugin - media or mediaGroup/mediaSingle node absent in schema',
    );

    options.providerFactory.subscribe(
      'mediaProvider',
      (_name: string, provider?: Promise<MediaProvider>) =>
        this.setMediaProvider(provider),
    );

    options.providerFactory.subscribe(
      'contextIdentifierProvider',
      this.onContextIdentifierProvider,
    );

    this.errorReporter = options.errorReporter || new ErrorReporter();
  }

  onContextIdentifierProvider = async (
    _name: string,
    provider?: Promise<ContextIdentifierProvider>,
  ) => {
    if (provider) {
      this.contextIdentifierProvider = await provider;
    }
  };

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
          (this
            .mediaProvider as MediaProvider).viewMediaClientConfig = viewMediaClientConfig;
        }
      }

      assert(
        this.mediaProvider.viewMediaClientConfig,
        `MediaProvider promise did not resolve to a valid instance of MediaProvider - ${this.mediaProvider}`,
      );
    } catch (err) {
      const wrappedError = new Error(
        `Media functionality disabled due to rejected provider: ${err.message}`,
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
        await this.initPickers(
          this.mediaProvider.uploadParams,
          PickerFacade,
          this.reactContext,
        );
      } else {
        this.destroyPickers();
      }
    } else {
      this.destroyPickers();
    }
  };

  getMediaOptions = () => this.options;

  updateElement(): void {
    let newElement;
    const selectedContainer = this.selectedMediaContainerNode();

    if (selectedContainer && this.isMediaSchemaNode(selectedContainer)) {
      newElement = this.getDomElement(this.view.domAtPos.bind(this.view)) as
        | HTMLElement
        | undefined;
    }
    if (this.element !== newElement) {
      this.element = newElement;
    }
  }

  private isMediaSchemaNode = ({ type }: PMNode): boolean => {
    const { mediaSingle, media } = this.view.state.schema.nodes;

    if (this.mediaOptions?.allowMediaInline) {
      return type === mediaSingle || type === media;
    }

    return type === mediaSingle;
  };

  private hasUserAuthProvider = () =>
    !!this.uploadMediaClientConfig &&
    !!this.uploadMediaClientConfig.userAuthProvider;

  private getDomElement(domAtPos: EditorView['domAtPos']) {
    const { selection } = this.view.state;
    if (!(selection instanceof NodeSelection)) {
      return;
    }

    if (!this.isMediaSchemaNode(selection.node)) {
      return;
    }

    const position = this.mediaOptions?.allowMediaInline
      ? selection.from + 1
      : selection.from;
    const node = findDomRefAtPos(position, domAtPos);
    if (node) {
      if (!node.childNodes.length) {
        return node.parentNode as HTMLElement | undefined;
      }

      const target = (node as HTMLElement).querySelector('figure') || node;
      return target;
    }
    return;
  }

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
    const mediaStateWithContext: MediaState = {
      ...mediaState,
      contextId: this.contextIdentifierProvider
        ? this.contextIdentifierProvider.objectId
        : undefined,
    };

    const collection = this.collectionFromProvider();
    if (collection === undefined) {
      return;
    }

    if (
      this.mediaOptions &&
      this.mediaOptions.allowMarkingUploadsAsIncomplete
    ) {
      this.mobileUploadComplete[mediaStateWithContext.id] = false;
    }
    // We need to dispatch the change to event dispatcher only for successful files
    if (mediaState.status !== 'error') {
      this.updateAndDispatch({
        allUploadsFinished: false,
      });
    }

    if (
      isMediaSingle(this.view.state.schema, mediaStateWithContext.fileMimeType)
    ) {
      insertMediaSingleNode(
        this.view,
        mediaStateWithContext,
        this.getInputMethod(pickerType),
        collection,
        this.mediaOptions && this.mediaOptions.alignLeftOnInsert,
      );
    } else {
      insertMediaGroupNode(
        this.view,
        [mediaStateWithContext],
        collection,
        this.getInputMethod(pickerType),
      );
    }

    // do events when media state changes
    onMediaStateChanged(this.handleMediaState);

    // handle waiting for upload complete
    const isEndState = (state: MediaState) =>
      state.status && MEDIA_RESOLVED_STATES.indexOf(state.status) !== -1;

    if (!isEndState(mediaStateWithContext)) {
      // Chain the previous promise with a new one for this media item
      this.addPendingTask(
        new Promise<MediaState | null>((resolve) => {
          onMediaStateChanged((newState) => {
            // When media item reaches its final state, remove listener and resolve
            if (isEndState(newState)) {
              resolve(newState);
            }
          });
        }),
      );

      this.pendingTask.then(() => {
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
  };

  addPendingTask = (promise: Promise<any>) => {
    const currentPendingTask = this.pendingTask;
    const pendingPromise = () => currentPendingTask;
    this.pendingTask = promise.then(pendingPromise, pendingPromise);
  };

  splitMediaGroup = (): boolean => splitMediaGroup(this.view);

  onPopupPickerClose = () => {
    this.onPopupToogleCallback(false);
  };

  shouldUseMediaPickerPopup = () => {
    if (
      !this.mediaOptions ||
      (this.mediaOptions && this.mediaOptions.useMediaPickerPopup === undefined)
    ) {
      return this.hasUserAuthProvider();
    }

    return !!this.mediaOptions.useMediaPickerPopup;
  };

  showMediaPicker = () => {
    if (this.openMediaPickerBrowser && !this.shouldUseMediaPickerPopup()) {
      return this.openMediaPickerBrowser();
    }
    if (!this.popupPicker) {
      return;
    }
    this.popupPicker.show();
    this.onPopupToogleCallback(true);
  };

  setBrowseFn = (browseFn: () => void) => {
    this.openMediaPickerBrowser = browseFn;
  };

  onPopupToggle = (onPopupToogleCallback: (isOpen: boolean) => void) => {
    this.onPopupToogleCallback = onPopupToogleCallback;
  };

  /**
   * Returns a promise that is resolved after all pending operations have been finished.
   * An optional timeout will cause the promise to reject if the operation takes too long
   *
   * NOTE: The promise will resolve even if some of the media have failed to process.
   */
  waitForPendingTasks = (
    timeout?: number,
    lastTask?: Promise<MediaState | null>,
  ): Promise<MediaState | null> => {
    if (lastTask && this.pendingTask === lastTask) {
      return lastTask;
    }

    const chainedPromise: Promise<MediaState | null> = this.pendingTask.then(
      () =>
        // Call ourselves to make sure that no new pending tasks have been
        // added before the current promise has resolved.
        this.waitForPendingTasks(undefined, this.pendingTask),
    );

    if (!timeout) {
      return chainedPromise;
    }

    let rejectTimeout: number;
    const timeoutPromise = new Promise<null>((_resolve, reject) => {
      rejectTimeout = window.setTimeout(
        () =>
          reject(new Error(`Media operations did not finish in ${timeout} ms`)),
        timeout,
      );
    });

    return Promise.race([
      timeoutPromise,
      chainedPromise.then((value) => {
        clearTimeout(rejectTimeout);
        return value;
      }),
    ]);
  };

  setView(view: EditorView) {
    this.view = view;
  }

  /**
   * Called from React UI Component when user clicks on "Delete" icon
   * inside of it
   */
  handleMediaNodeRemoval = (
    node: PMNode | undefined,
    getPos: ProsemirrorGetPosHandler,
  ) => {
    let getNode = node;
    if (!getNode) {
      getNode = this.view.state.doc.nodeAt(getPos()) as PMNode;
    }

    removeMediaNode(this.view, getNode, getPos);
  };

  /**
   * Called from React UI Component on componentDidMount
   */
  handleMediaNodeMount = (node: PMNode, getPos: ProsemirrorGetPosHandler) => {
    this.mediaNodes.unshift({ node, getPos });
  };

  /**
   * Called from React UI Component on componentWillUnmount and UNSAFE_componentWillReceiveProps
   * when React component's underlying node property is replaced with a new node
   */
  handleMediaNodeUnmount = (oldNode: PMNode) => {
    this.mediaNodes = this.mediaNodes.filter(({ node }) => oldNode !== node);
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
    return helpers.findMediaSingleNode(this, id);
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

    this.popupPicker = undefined;
    this.customPicker = undefined;
  };

  private async initPickers(
    uploadParams: UploadParams,
    Picker: typeof PickerFacade,
    reactContext: () => {},
  ) {
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
      const defaultPickerConfig = {
        uploadParams,
        proxyReactContext: reactContext(),
        useForgePlugins:
          (this.mediaOptions && this.mediaOptions.useForgePlugins) || false,
        featureFlags: this.mediaOptions && this.mediaOptions.featureFlags,
      };

      if (this.options.customMediaPicker) {
        const customPicker = new Picker(
          'customMediaPicker',
          pickerFacadeConfig,
          this.options.customMediaPicker,
        ).init();

        pickerPromises.push(customPicker);
        pickers.push((this.customPicker = await customPicker));
      } else if (this.shouldUseMediaPickerPopup()) {
        const popupPicker = new Picker(
          'popup',
          pickerFacadeConfig,
          defaultPickerConfig as PopupConfig,
        ).init();
        pickerPromises.push(popupPicker);
        pickers.push((this.popupPicker = await popupPicker));
        this.removeOnCloseListener = this.popupPicker.onClose(
          this.onPopupPickerClose,
        );
      }

      pickers.forEach((picker) => {
        picker.onNewMedia(this.insertFile);
      });
    }

    // set new upload params for the pickers
    pickers.forEach((picker) => picker.setUploadParams(uploadParams));
  }

  private getInputMethod = (
    pickerType?: string,
  ): InputMethodInsertMedia | undefined => {
    switch (pickerType) {
      case 'popup':
        return INPUT_METHOD.PICKER_CLOUD;
      case 'clipboard':
        return INPUT_METHOD.CLIPBOARD;
      case 'dropzone':
        return INPUT_METHOD.DRAG_AND_DROP;
    }
    return;
  };

  updateMediaNodeAttrs = (
    id: string,
    attrs: object,
    isMediaSingle: boolean,
  ) => {
    const { view } = this;
    if (!view) {
      return;
    }

    return updateMediaNodeAttrs(
      id,
      attrs,
      isMediaSingle,
    )(view.state, view.dispatch);
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

      case 'mobile-upload-end':
        const attrs: { id: string; collection?: string } = {
          id: state.publicId || state.id,
        };

        if (typeof state.collection === 'string') {
          attrs.collection = state.collection;
        }

        this.updateMediaNodeAttrs(
          state.id,
          attrs,
          isMediaSingle(this.view.state.schema, state.fileMimeType),
        );

        // mark mobile upload as complete
        this.mobileUploadComplete[attrs.id] = true;

        delete this.mediaGroupNodes[state.id];
        break;
    }
  };

  isMobileUploadCompleted = (mediaId: string): boolean | undefined =>
    helpers.isMobileUploadCompleted(this, mediaId);

  removeNodeById = (state: MediaState) => {
    const { id } = state;
    const mediaNodeWithPos = helpers.findMediaNode(
      this,
      id,
      isImage(state.fileMimeType),
    );

    if (mediaNodeWithPos) {
      removeMediaNode(
        this.view,
        mediaNodeWithPos.node,
        mediaNodeWithPos.getPos,
      );
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
    if (
      selection instanceof NodeSelection &&
      this.isMediaSchemaNode(selection.node)
    ) {
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
    // Trigger state change to be able to pick it up in the decorations handler
    dispatch(state.tr);
  };

  updateAndDispatch(
    props: Partial<Pick<this, 'allowsUploads' | 'allUploadsFinished'>>,
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
  dispatch?: Dispatch,
  mediaOptions?: MediaOptions,
) => {
  const dropPlaceholder = createDropPlaceholder(
    mediaOptions && mediaOptions.allowDropzoneDropLine,
  );

  return new Plugin({
    state: {
      init(_config, state) {
        return new MediaPluginStateImplementation(
          state,
          options,
          reactContext,
          mediaOptions,
          dispatch,
        );
      },
      apply(tr, pluginState: MediaPluginState) {
        // remap editing media single position if we're in collab
        if (typeof pluginState.editingMediaSinglePos === 'number') {
          pluginState.editingMediaSinglePos = tr.mapping.map(
            pluginState.editingMediaSinglePos,
          );
        }

        const meta = tr.getMeta(stateKey);
        if (meta) {
          const { allowsUploads } = meta;
          pluginState.updateAndDispatch({
            allowsUploads:
              typeof allowsUploads === 'undefined'
                ? pluginState.allowsUploads
                : allowsUploads,
          });
        }

        // NOTE: We're not calling passing new state to the Editor, because we depend on the view.state reference
        //       throughout the lifetime of view. We injected the view into the plugin state, because we dispatch()
        //       transformations from within the plugin state (i.e. when adding a new file).
        return pluginState;
      },
    },
    filterTransaction(transaction, state) {
      // Media node inside mediaSingle should not be selected
      // We are relying on plugins/media/nodeviews/mediaNodeView/media.tsx#selectMediaSingleFromCard
      // to set selection on correct mediaSingle node,
      // We don't use 'appendTransaction' because we would like to avoid have additional transactions
      // http://product-fabric.atlassian.net/browse/ED-10091
      return !(
        transaction.selectionSet &&
        isNodeSelection(transaction.selection) &&
        (transaction.selection as NodeSelection).node.type ===
          state.schema.nodes.media &&
        transaction.selection.$anchor.parent.type ===
          state.schema.nodes.mediaSingle
      );
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
        const pluginState = getMediaPluginState(state);
        if (!pluginState.showDropzone) {
          return;
        }

        const {
          schema,
          selection: { $anchor },
        } = state;

        // When a media is already selected
        if (state.selection instanceof NodeSelection) {
          const node = state.selection.node;

          if (node.type === schema.nodes.mediaSingle) {
            const deco = Decoration.node(
              state.selection.from,
              state.selection.to,
              {
                class: 'richMedia-selected',
              },
            );

            return DecorationSet.create(state.doc, [deco]);
          }

          return;
        }

        let pos: number | null | void = $anchor.pos;
        if (
          $anchor.parent.type !== schema.nodes.paragraph &&
          $anchor.parent.type !== schema.nodes.codeBlock
        ) {
          pos = insertPoint(state.doc, pos, schema.nodes.mediaGroup);
        }

        if (pos === null || pos === undefined) {
          return;
        }

        const dropPlaceholders: Decoration[] = [
          Decoration.widget(pos, dropPlaceholder, { key: 'drop-placeholder' }),
        ];
        return DecorationSet.create(state.doc, dropPlaceholders);
      },
      nodeViews: options.nodeViews,
      handleTextInput(view: EditorView): boolean {
        getMediaPluginState(view.state).splitMediaGroup();
        return false;
      },
    },
  });
};
