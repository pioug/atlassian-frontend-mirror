import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import type { FileIdentifier } from '@atlaskit/media-client';
import type { MediaClientConfig } from '@atlaskit/media-core';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import type { UploadParams, MediaFile } from '@atlaskit/media-picker/types';
import type { EditorSelectionAPI } from '@atlaskit/editor-common/selection';
import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { PlaceholderTextOptions } from '../../plugins/placeholder-text/types';

export type MediaStateStatus =
  | 'unknown'
  | 'ready'
  | 'cancelled'
  | 'preview'
  | 'error'
  | 'mobile-upload-end';

export type MediaSingleWithType = 'pixel' | 'percentage';
export interface MediaOptions {
  provider?: Providers['mediaProvider'];
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

export type Listener = (data: any) => void;

export interface CustomMediaPicker {
  on(event: string, cb: Listener): void;
  removeAllListeners(event: any): void;
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
  allowLinking?: boolean;
  allowAdvancedToolBarOptions?: boolean;
  allowResizingInTables?: boolean;
  allowAltTextOnImages?: boolean;
  altTextValidator?: (value: string) => string[];
  getEditorFeatureFlags?: GetEditorFeatureFlags;
  fullWidthEnabled?: boolean;
};

export type MediaDecorationSpec = {
  type: 'media';
  selected: boolean;
};
