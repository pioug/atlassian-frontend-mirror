export { MediaStore } from './client/media-store';
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
  isAbortedRequestError,
  request,
  mapResponseToJson,
  mapResponseToBlob,
  mapResponseToVoid,
  createUrl,
} from './utils/request';
export type {
  RequestMethod,
  RequestParams,
  RequestHeaders,
  RequestOptions,
  CreateUrlOptions,
} from './utils/request';

export type ImageResizeMode = 'crop' | 'fit' | 'full-fit' | 'stretchy-fit';

export { FileFetcherImpl } from './client/file-fetcher';
export type {
  CopySourceFile,
  CopyDestination,
  CopyFileOptions,
  FileFetcher,
} from './client/file-fetcher';
export { CollectionFetcher } from './client/collection-fetcher';
export { MediaClient } from './client/media-client';
export { StargateClient } from './client/stargate-client';
export type { EdgeData } from './client/stargate-client';

export { isImageRemote } from './utils/isImageRemote';
export { checkWebpSupport } from './utils/checkWebpSupport';
export { observableToPromise } from './utils/observableToPromise';

export { getMediaTypeFromMimeType } from './utils/getMediaTypeFromMimeType';

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
