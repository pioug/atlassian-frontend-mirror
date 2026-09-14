export { MediaStore } from './client/media-store/MediaStore';
export { MediaStoreError } from './client/media-store/MediaStoreError';
export { isMediaStoreError } from './client/media-store/isMediaStoreError';
export { getMediaRegion } from './client/media-store/getMediaRegion';
export { getMediaEnvironment } from './client/media-store/getMediaEnvironment';
export type {
	MediaStoreErrorReason,
	MediaStoreErrorAttributes,
} from './client/media-store/MediaStoreError';
export type {
	ResponseFileItem,
	EmptyResponseFileItem,
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
	MediaApi,
} from './client/media-store/types';

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

export { isPreviewableType } from './models/is-previewable-type';
export type {
	MediaFileProcessingStatus,
	MediaType,
	MediaFile,
	MediaRepresentations,
	MediaItemDetails,
	MediaUpload,
} from './models/media';

export { getArtifactUrl } from './models/artifacts';

export { getMediaClientErrorReason, isMediaClientError } from './models/errors';
export { isCommonMediaClientError } from './models/errors/isCommonMediaClientError';
export { toCommonMediaClientError } from './models/errors/toCommonMediaClientError';
export type {
	MediaClientError,
	MediaClientErrorReason,
	MediaClientErrorAttributes,
} from './models/errors';

export { hasArtifacts } from './models/has-artifacts';
export { isErrorFileState } from './models/is-error-file-state';
export { isFinalFileState } from './models/is-final-file-state';
export { isImageRepresentationReady } from './models/is-image-representation-ready';
export { isNonErrorFinalFileState } from './models/is-non-error-final-file-state';
export { isPreviewableFileState } from './models/is-previewable-file-state';
export { isProcessedFileState } from './models/is-processed-file-state';
export { isProcessingFileState } from './models/is-processing-file-state';
export { isUploadingFileState } from './models/is-uploading-file-state';
export { mapMediaFileToFileState } from './models/map-media-file-to-file-state';
export { mapMediaItemToFileState } from './models/map-media-item-to-file-state';
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
} from './media-state';

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

export { createUrl } from './utils/request/createUrl';
export { isAbortedRequestError } from './utils/request/isAbortedRequestError';

export { PollingFunction, isPollingError, PollingError } from './utils/polling';

export type { Executor, PollingErrorAttributes, PollingErrorReason } from './utils/polling/types';

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

export { FileFetcherImpl, FileFetcherError, isFileFetcherError } from './client/file-fetcher';
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

export { checkWebpSupport } from './utils/checkWebpSupport';

export { getDimensionsFromBlob } from './utils/getDimensionsFromBlob';
export type { Dimensions } from './utils/getDimensionsFromBlob';

export { createMediaSubject } from './utils/createMediaSubject';

export { isDifferentIdentifier } from './is-different-identifier';
export { isExternalImageIdentifier } from './is-external-image-identifier';
export { isFileIdentifier } from './is-file-identifier';
export type { Identifier, FileIdentifier, ExternalImageIdentifier } from './identifier';

export type {
	EventPayloadListener,
	UploadEventPayloadMap,
	MediaViewedEventPayload,
	AuthProviderSucceededEventPayload,
	AuthProviderFailedEventPayload,
} from './client/events';

export type { MediaClientConfig } from './media-core';

export { globalMediaEventEmitter } from './globalMediaEventEmitter';

export { addFileAttrsToUrl } from './utils/addFileAttrsToUrl';
export { getAttrsFromUrl } from './utils/getAttrsFromUrl';
export { isMediaBlobUrl } from './utils/isMediaBlobUrl';
export { objectToQueryString } from './utils/objectToQueryString';
export type { MediaBlobUrlAttrs } from './utils/url';

export { fromObservable } from './utils/mediaSubscribable/fromObservable';
export { createMediaSubscribable } from './utils/mediaSubscribable/createMediaSubscribable';

export type {
	MediaSubscribable,
	MediaSubscription,
	MediaObserver,
} from './utils/mediaSubscribable/types';

export { RECENTS_COLLECTION, MAX_RESOLUTION } from './constants';

export { getFileStreamsCache } from './file-streams-cache';

export { ChunkHashAlgorithm } from './media-core';
