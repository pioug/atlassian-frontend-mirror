import { Node as PMNode } from 'prosemirror-model';
import { MediaClientConfig } from '@atlaskit/media-core';
import { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';
import { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { MediaOptions, MediaState } from '../types';
import { MediaPluginOptions } from '../media-plugin-options';
import { EditorView } from 'prosemirror-view';
import PickerFacade, { MediaStateEventSubscriber } from '../picker-facade';
import { Dispatch } from '../../../event-dispatcher';
import { ProsemirrorGetPosHandler } from '../../../nodeviews/types';

export interface MediaNodeWithPosHandler {
  node: PMNode;
  getPos: ProsemirrorGetPosHandler;
}

export interface MediaPluginState {
  allowsUploads: boolean;
  mediaClientConfig?: MediaClientConfig;
  uploadMediaClientConfig?: MediaClientConfig;
  ignoreLinks: boolean;
  waitForMediaUpload: boolean;
  allUploadsFinished: boolean;
  showDropzone: boolean;
  element?: HTMLElement;
  layout: MediaSingleLayout;
  mediaNodes: MediaNodeWithPosHandler[];
  mediaGroupNodes: Record<string, any>;
  mobileUploadComplete: Record<string, boolean>;
  options: MediaPluginOptions;
  mediaProvider?: MediaProvider;
  pickers: PickerFacade[];
  pickerPromises: Array<Promise<PickerFacade>>;
  editingMediaSinglePos?: number;
  showEditingDialog?: boolean;
  mediaOptions?: MediaOptions;
  dispatch?: Dispatch;
  onContextIdentifierProvider: (
    _name: string,
    provider?: Promise<ContextIdentifierProvider>,
  ) => Promise<void>;
  setMediaProvider: (mediaProvider?: Promise<MediaProvider>) => Promise<void>;
  getMediaOptions: () => MediaPluginOptions;
  shouldUseMediaPickerPopup: () => boolean;
  insertFile: (
    mediaState: MediaState,
    onMediaStateChanged: MediaStateEventSubscriber,
    pickerType?: string,
  ) => void;
  addPendingTask: (promise: Promise<any>) => void;
  splitMediaGroup: () => boolean;
  onPopupPickerClose: () => void;
  showMediaPicker: () => void;
  setBrowseFn: (browseFn: () => void) => void;
  onPopupToggle: (onPopupToogleCallback: (isOpen: boolean) => void) => void;
  waitForPendingTasks: (
    timeout?: number,
    lastTask?: Promise<MediaState | null>,
  ) => Promise<MediaState | null>;
  handleMediaNodeRemoval: (
    node: PMNode | undefined,
    getPos: ProsemirrorGetPosHandler,
  ) => void;
  handleMediaNodeMount: (
    node: PMNode,
    getPos: ProsemirrorGetPosHandler,
  ) => void;
  handleMediaNodeUnmount: (oldNode: PMNode) => void;
  findMediaNode: (id: string) => MediaNodeWithPosHandler | null;
  updateMediaNodeAttrs: (
    id: string,
    attrs: object,
    isMediaSingle: boolean,
  ) => undefined | boolean;
  isMobileUploadCompleted: (mediaId: string) => boolean | undefined;
  removeNodeById: (state: MediaState) => void;
  removeSelectedMediaContainer: () => boolean;
  selectedMediaContainerNode: () => PMNode | undefined;
  handleDrag: (dragState: 'enter' | 'leave') => void;

  updateElement(): void;

  setView(view: EditorView): void;

  destroy(): void;

  updateAndDispatch(
    props: Partial<Pick<this, 'allowsUploads' | 'allUploadsFinished'>>,
  ): void;
}
