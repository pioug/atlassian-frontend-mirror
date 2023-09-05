export {
  MediaStore,
  MediaStoreError,
  isMediaStoreError,
  getMediaEnvironment,
  getMediaRegion,
} from './client/media-store';
export type {
  ResponseFileItem,
  ItemsPayload,
  ImageMetadataArtifact,
  ImageMetadata,
  MediaStoreResponse,
  MediaStoreRequestOptions,
  MediaStoreCreateFileFromUploadParams,
  MediaStoreCreateFileParams,
  MediaStoreTouchFileParams,
  TouchFileDescriptor,
  MediaStoreTouchFileBody,
  MediaStoreCreateFileFromBinaryParams,
  MediaStoreCreateFileFromUploadConditions,
  MediaStoreCreateFileFromUploadBody,
  MediaStoreGetFileParams,
  MediaStoreGetFileImageParams,
  SourceFile,
  MediaStoreCopyFileWithTokenBody,
  MediaStoreCopyFileWithTokenParams,
  AppendChunksToUploadRequestBody,
  CreatedTouchedFile,
  TouchedFiles,
  EmptyFile,
  MediaStoreErrorReason,
  MediaStoreErrorAttributes,
} from './client/media-store';

export { UploadController } from './upload-controller';
export type { AbortFunction } from './upload-controller';

export type {
  MediaItemType,
  FileItem,
  FileProcessingStatus,
  MediaArtifact,
  Artifacts,
  FileDetails,
} from './models/item';

export { isPreviewableType } from './models/media';
export type {
  MediaFileProcessingStatus,
  MediaType,
  MediaFile,
  MediaRepresentations,
  MediaItemDetails,
  MediaUpload,
  MediaChunksProbe,
} from './models/media';

export { getArtifactUrl } from './models/artifacts';

export { isMediaClientError, getMediaClientErrorReason } from './models/errors';
export type {
  MediaClientError,
  MediaClientErrorReason,
  MediaClientErrorAttributes,
} from './models/errors';

export {
  isUploadingFileState,
  isProcessingFileState,
  isProcessedFileState,
  isErrorFileState,
  isPreviewableFileState,
  isFinalFileState,
  isImageRepresentationReady,
  mapMediaFileToFileState,
  mapMediaItemToFileState,
} from './models/file-state';
export type {
  FileStatus,
  PreviewOptions,
  GetFileOptions,
  NonErrorFileState,
  PreviewableFileState,
} from './models/file-state';

export type {
  FileState,
  FilePreview,
  ErrorFileState,
  UploadingFileState,
  ProcessingFileState,
  ProcessedFileState,
  ProcessingFailedState,
  MediaFileArtifact,
  MediaFileArtifacts,
} from '@atlaskit/media-state';

export type {
  MobileUpload,
  MobileUploadStartEvent,
  MobileUploadProgressEvent,
  MobileUploadEndEvent,
  MobileUploadErrorEvent,
} from './models/mobile-upload';

export { uploadFile } from './uploader';
export type {
  UploadableFile,
  UploadableFileUpfrontIds,
  UploadFileCallbacks,
  UploadFileResult,
} from './uploader';

export {
  request,
  RequestError,
  isRequestError,
  isRateLimitedError,
  createRequestErrorReason,
} from './utils/request';

export type {
  RequestErrorReason,
  RequestErrorMetadata,
  RequestErrorAttributes,
} from './utils/request';

export {
  isAbortedRequestError,
  mapResponseToJson,
  mapResponseToBlob,
  mapResponseToVoid,
  createUrl,
} from './utils/request/helpers';

export { PollingFunction } from './utils/polling';
export { isPollingError, PollingError } from './utils/polling/errors';
export type {
  Executor,
  PollingErrorAttributes,
  PollingErrorReason,
} from './utils/polling/types';

export type {
  RequestMethod,
  RequestParams,
  RequestHeaders,
  RetryOptions,
  ClientOptions,
  RequestMetadata,
  RequestOptions,
  CreateUrlOptions,
} from './utils/request/types';

export type { ImageResizeMode } from './utils/imageResizeModeToFileImageMode';
export { imageResizeModeToFileImageMode } from './utils/imageResizeModeToFileImageMode';

export {
  FileFetcherImpl,
  FileFetcherError,
  isFileFetcherError,
} from './client/file-fetcher';
export type {
  CopySourceFile,
  CopyDestination,
  CopyFileOptions,
  FileFetcher,
  FileFetcherErrorAttributes,
  FileFetcherErrorReason,
} from './client/file-fetcher';

export { MediaClient } from './client/media-client';
export { StargateClient } from './client/stargate-client';
export type { EdgeData } from './client/stargate-client';

export { isImageRemote } from './utils/isImageRemote';
export { checkWebpSupport } from './utils/checkWebpSupport';

export { getDimensionsFromBlob } from './utils/getDimensionsFromBlob';
export type { Dimensions } from './utils/getDimensionsFromBlob';

export { createMediaSubject } from './utils/createMediaSubject';
export { safeUnsubscribe } from './utils/safeUnsubscribe';

export {
  isFileIdentifier,
  isExternalImageIdentifier,
  isDifferentIdentifier,
} from './identifier';
export type {
  Identifier,
  FileIdentifier,
  ExternalImageIdentifier,
} from './identifier';

export type {
  EventPayloadListener,
  UploadEventPayloadMap,
  MediaViewedEventPayload,
} from './client/events';

export { withMediaClient, getMediaClient } from './utils/with-media-client-hoc';
export type {
  WithMediaClientConfig,
  WithMediaClientConfigProps,
  WithMediaClientFunction,
  WithMediaClient,
} from './utils/with-media-client-hoc';

export type { MediaClientConfig } from '@atlaskit/media-core';

export { globalMediaEventEmitter } from './globalMediaEventEmitter';

export {
  isMediaBlobUrl,
  getAttrsFromUrl,
  addFileAttrsToUrl,
  objectToQueryString,
} from './utils/url';
export type { MediaBlobUrlAttrs } from './utils/url';

export {
  createMediaSubscribable,
  fromObservable,
} from './utils/mediaSubscribable';

export type {
  MediaSubscribable,
  MediaSubscription,
  MediaObserver,
} from './utils/mediaSubscribable';

export { RECENTS_COLLECTION, MAX_RESOLUTION } from './constants';

export { getFileStreamsCache } from './file-streams-cache';

// TODO MEX-659 Remove these exports when all the usages from media-client are replaced with media-common.

import {
  getMediaTypeFromMimeType as _getMediaTypeFromMimeType,
  isImageMimeTypeSupportedByBrowser as _isImageMimeTypeSupportedByBrowser,
  isDocumentMimeTypeSupportedByBrowser as _isDocumentMimeTypeSupportedByBrowser,
  isMimeTypeSupportedByBrowser as _isMimeTypeSupportedByBrowser,
  isImageMimeTypeSupportedByServer as _isImageMimeTypeSupportedByServer,
  isDocumentMimeTypeSupportedByServer as _isDocumentMimeTypeSupportedByServer,
  isAudioMimeTypeSupportedByServer as _isAudioMimeTypeSupportedByServer,
  isVideoMimeTypeSupportedByServer as _isVideoMimeTypeSupportedByServer,
  isUnknownMimeTypeSupportedByServer as _isUnknownMimeTypeSupportedByServer,
  isMimeTypeSupportedByServer as _isMimeTypeSupportedByServer,
} from '@atlaskit/media-common/mediaTypeUtils';

/**
 * @deprecated This export will be removed. Please use one from @atlaskit/media-common or @atlaskit/media-common/mediaTypeUtils
 */
export const getMediaTypeFromMimeType = _getMediaTypeFromMimeType;
/**
 * @deprecated This export will be removed. Please use one from @atlaskit/media-common or @atlaskit/media-common/mediaTypeUtils
 */
export const isImageMimeTypeSupportedByBrowser =
  _isImageMimeTypeSupportedByBrowser;
/**
 * @deprecated This export will be removed. Please use one from @atlaskit/media-common or @atlaskit/media-common/mediaTypeUtils
 */
export const isDocumentMimeTypeSupportedByBrowser =
  _isDocumentMimeTypeSupportedByBrowser;
/**
 * @deprecated This export will be removed. Please use one from @atlaskit/media-common or @atlaskit/media-common/mediaTypeUtils
 */
export const isMimeTypeSupportedByBrowser = _isMimeTypeSupportedByBrowser;
/**
 * @deprecated This export will be removed. Please use one from @atlaskit/media-common or @atlaskit/media-common/mediaTypeUtils
 */
export const isImageMimeTypeSupportedByServer =
  _isImageMimeTypeSupportedByServer;
/**
 * @deprecated This export will be removed. Please use one from @atlaskit/media-common or @atlaskit/media-common/mediaTypeUtils
 */
export const isDocumentMimeTypeSupportedByServer =
  _isDocumentMimeTypeSupportedByServer;
/**
 * @deprecated This export will be removed. Please use one from @atlaskit/media-common or @atlaskit/media-common/mediaTypeUtils
 */
export const isAudioMimeTypeSupportedByServer =
  _isAudioMimeTypeSupportedByServer;
/**
 * @deprecated This export will be removed. Please use one from @atlaskit/media-common or @atlaskit/media-common/mediaTypeUtils
 */
export const isVideoMimeTypeSupportedByServer =
  _isVideoMimeTypeSupportedByServer;
/**
 * @deprecated This export will be removed. Please use one from @atlaskit/media-common or @atlaskit/media-common/mediaTypeUtils
 */
export const isUnknownMimeTypeSupportedByServer =
  _isUnknownMimeTypeSupportedByServer;
/**
 * @deprecated This export will be removed. Please use one from @atlaskit/media-common or @atlaskit/media-common/mediaTypeUtils
 */
export const isMimeTypeSupportedByServer = _isMimeTypeSupportedByServer;
