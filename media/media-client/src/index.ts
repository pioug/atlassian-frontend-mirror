export {
	MediaStore,
	MediaStoreError,
	isMediaStoreError,
	getMediaEnvironment,
	getMediaRegion,
} from './client/media-store';
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
	MediaStoreErrorReason,
	MediaStoreErrorAttributes,
	MediaApi,
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
} from './models/media';

export { getArtifactUrl } from './models/artifacts';

export {
	isMediaClientError,
	getMediaClientErrorReason,
	isCommonMediaClientError,
	toCommonMediaClientError,
} from './models/errors';
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
	isNonErrorFinalFileState,
	mapMediaFileToFileState,
	mapMediaItemToFileState,
	hasArtifacts,
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

export { isAbortedRequestError, createUrl } from './utils/request/helpers';

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

export { isFileIdentifier, isExternalImageIdentifier, isDifferentIdentifier } from './identifier';
export type { Identifier, FileIdentifier, ExternalImageIdentifier } from './identifier';

export type {
	EventPayloadListener,
	UploadEventPayloadMap,
	MediaViewedEventPayload,
	AuthProviderSucceededEventPayload,
	AuthProviderFailedEventPayload,
} from './client/events';

export type { MediaClientConfig } from '@atlaskit/media-core';

export { globalMediaEventEmitter } from './globalMediaEventEmitter';

export {
	isMediaBlobUrl,
	getAttrsFromUrl,
	addFileAttrsToUrl,
	objectToQueryString,
} from './utils/url';
export type { MediaBlobUrlAttrs } from './utils/url';

export { createMediaSubscribable, fromObservable } from './utils/mediaSubscribable';

export type {
	MediaSubscribable,
	MediaSubscription,
	MediaObserver,
} from './utils/mediaSubscribable';

export { RECENTS_COLLECTION, MAX_RESOLUTION } from './constants';

export { getFileStreamsCache } from './file-streams-cache';

export { ChunkHashAlgorithm } from '@atlaskit/media-core';
