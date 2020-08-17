export {
  MediaStore,
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

export { AbortFunction, UploadController } from './upload-controller';

export {
  MediaItemType,
  FileItem,
  FileProcessingStatus,
  MediaArtifact,
  Artifacts,
  FileDetails,
} from './models/item';

export {
  MediaFileProcessingStatus,
  MediaType,
  isPreviewableType,
  MediaFile,
  MediaCollection,
  MediaCollectionItems,
  MediaCollectionItem,
  MediaCollectionItemMinimalDetails,
  MediaCollectionItemFullDetails,
  isMediaCollectionItemFullDetails,
  MediaRepresentations,
  MediaCollectionItemDetails,
  MediaUpload,
  MediaChunksProbe,
} from './models/media';

export {
  MediaFileArtifact,
  MediaFileArtifacts,
  getArtifactUrl,
} from './models/artifacts';

export {
  FileStatus,
  FilePreview,
  PreviewOptions,
  GetFileOptions,
  UploadingFileState,
  ProcessingFileState,
  isProcessingFileState,
  ProcessedFileState,
  isProcessedFileState,
  ProcessingFailedState,
  ErrorFileState,
  NonErrorFileState,
  isErrorFileState,
  PreviewableFileState,
  isPreviewableFileState,
  FileState,
  isFinalFileState,
  isImageRepresentationReady,
  mapMediaFileToFileState,
  mapMediaItemToFileState,
} from './models/file-state';

export { getFileStreamsCache, StreamsCache } from './file-streams-cache';

export {
  uploadFile,
  UploadableFile,
  UploadableFileUpfrontIds,
  UploadFileCallbacks,
  UploadFileResult,
} from './uploader';

export {
  isAbortedRequestError,
  RequestMethod,
  RequestParams,
  RequestHeaders,
  RequestOptions,
  request,
  mapResponseToJson,
  mapResponseToBlob,
  mapResponseToVoid,
  CreateUrlOptions,
  createUrl,
} from './utils/request';

export type ImageResizeMode = 'crop' | 'fit' | 'full-fit' | 'stretchy-fit';

export {
  CopySourceFile,
  CopyDestination,
  CopyFileOptions,
  FileFetcherImpl,
  FileFetcher,
} from './client/file-fetcher';
export { CollectionFetcher } from './client/collection-fetcher';
export { MediaClient } from './client/media-client';
export { StargateClient, EdgeData } from './client/stargate-client';

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
  Identifier,
  FileIdentifier,
  ExternalImageIdentifier,
  isFileIdentifier,
  isExternalImageIdentifier,
  isDifferentIdentifier,
} from './identifier';

export {
  EventPayloadListener,
  UploadEventPayloadMap,
  MediaViewedEventPayload,
} from './client/events';

export {
  withMediaClient,
  WithMediaClientConfig,
  getMediaClient,
  WithMediaClientConfigProps,
} from './utils/with-media-client-hoc';

export { globalMediaEventEmitter } from './globalMediaEventEmitter';

export {
  isMediaBlobUrl,
  getAttrsFromUrl,
  addFileAttrsToUrl,
  MediaBlobUrlAttrs,
  objectToQueryString,
} from './utils/url';

export { RECENTS_COLLECTION, MAX_RESOLUTION } from './constants';
