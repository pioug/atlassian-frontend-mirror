export {
  MediaStore,
  MediaStoreError,
  isMediaStoreError,
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
  MediaStoreGetCollectionItemsParams,
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

export {
  isPreviewableType,
  isMediaCollectionItemFullDetails,
} from './models/media';
export type {
  MediaFileProcessingStatus,
  MediaType,
  MediaFile,
  MediaCollection,
  MediaCollectionItems,
  MediaCollectionItem,
  MediaCollectionItemMinimalDetails,
  MediaCollectionItemFullDetails,
  MediaRepresentations,
  MediaCollectionItemDetails,
  MediaUpload,
  MediaChunksProbe,
} from './models/media';

export { getArtifactUrl } from './models/artifacts';
export type { MediaFileArtifact, MediaFileArtifacts } from './models/artifacts';

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
  FilePreview,
  PreviewOptions,
  GetFileOptions,
  UploadingFileState,
  ProcessingFileState,
  ProcessedFileState,
  ProcessingFailedState,
  ErrorFileState,
  NonErrorFileState,
  PreviewableFileState,
  FileState,
} from './models/file-state';

export { getFileStreamsCache, StreamsCache } from './file-streams-cache';

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
  RequestOptions,
  CreateUrlOptions,
} from './utils/request/types';

export type ImageResizeMode = 'crop' | 'fit' | 'full-fit' | 'stretchy-fit';

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

export { CollectionFetcher } from './client/collection-fetcher';
export { MediaClient } from './client/media-client';
export { StargateClient } from './client/stargate-client';
export type { EdgeData } from './client/stargate-client';

export { isImageRemote } from './utils/isImageRemote';
export { checkWebpSupport } from './utils/checkWebpSupport';
export { observableToPromise } from './utils/observableToPromise';

export { getMediaTypeFromMimeType } from './utils/getMediaTypeFromMimeType';

export { getDimensionsFromBlob } from './utils/getDimensionsFromBlob';
export type { Dimensions } from './utils/getDimensionsFromBlob';

export {
  isImageMimeTypeSupportedByBrowser,
  isDocumentMimeTypeSupportedByBrowser,
  isMimeTypeSupportedByBrowser,
} from './utils/isMimeTypeSupportedByBrowser';

export {
  isImageMimeTypeSupportedByServer,
  isDocumentMimeTypeSupportedByServer,
  isAudioMimeTypeSupportedByServer,
  isVideoMimeTypeSupportedByServer,
  isUnknownMimeTypeSupportedByServer,
  isMimeTypeSupportedByServer,
} from './utils/isMimeTypeSupportedByServer';

export { createFileStateSubject } from './utils/createFileStateSubject';
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
} from './utils/with-media-client-hoc';

export { globalMediaEventEmitter } from './globalMediaEventEmitter';

export {
  isMediaBlobUrl,
  getAttrsFromUrl,
  addFileAttrsToUrl,
  objectToQueryString,
} from './utils/url';
export type { MediaBlobUrlAttrs } from './utils/url';

export { RECENTS_COLLECTION, MAX_RESOLUTION } from './constants';
