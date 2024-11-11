import {
	type Auth,
	type AsapBasedAuth,
	type AuthContext,
	type ClientAltBasedAuth,
} from '@atlaskit/media-core';
import { type SSR, type MediaTraceContext } from '@atlaskit/media-common';

import { type MediaFileArtifacts } from '@atlaskit/media-state';

import { type MediaItemDetails, type MediaFile, type MediaUpload } from '../../models/media';

import {
	type ClientOptions,
	type RequestHeaders,
	type RequestMethod,
	type RequestParams,
	type RequestMetadata,
} from '../../utils/request/types';
import { type ChunkHashAlgorithm } from '@atlaskit/media-core';

export interface ResponseFileItem {
	id: string;
	type: 'file';
	details: MediaItemDetails;
	collection?: string;
	metadataTraceContext?: MediaTraceContext;
}

export interface EmptyResponseFileItem {
	id: string;
	type: 'not-found';
	collection?: string;
	metadataTraceContext?: MediaTraceContext;
}

export interface ItemsPayload {
	items: ResponseFileItem[];
}

export type ImageMetadataArtifact = {
	url?: string;
	width?: number;
	height?: number;
	size?: number;
};

export interface ImageMetadata {
	pending: boolean;
	preview?: ImageMetadataArtifact;
	original?: ImageMetadataArtifact;
}

export interface MediaStoreResponse<Data> {
	readonly data: Data;
}

export type MediaStoreRequestOptions = RequestMetadata & {
	readonly method?: RequestMethod;
	readonly authContext?: AuthContext;
	readonly params?: RequestParams;
	readonly headers?: RequestHeaders;
	readonly body?: any;
	readonly clientOptions?: ClientOptions;
	readonly traceContext?: MediaTraceContext;
	readonly ChunkhashAlgorithm?: ChunkHashAlgorithm;
	readonly addMediaClientParam?: boolean;
};

export type MediaStoreCreateFileFromUploadParams = {
	readonly collection?: string;
	readonly occurrenceKey?: string;
	readonly expireAfter?: number;
	readonly replaceFileId?: string;
	readonly skipConversions?: boolean;
};

export type MediaStoreCreateFileParams = {
	readonly occurrenceKey?: string;
	readonly collection?: string;
};

export interface MediaStoreTouchFileParams {
	readonly collection?: string;
}

export interface TouchFileDescriptor {
	fileId: string;
	collection?: string;
	occurrenceKey?: string;
	expireAfter?: number;
	deletable?: boolean;
	size?: number;
}

export interface MediaStoreTouchFileBody {
	descriptors: TouchFileDescriptor[];
}

export type MediaStoreCreateFileFromBinaryParams = {
	readonly replaceFileId?: string;
	readonly collection?: string;
	readonly occurrenceKey?: string;
	readonly expireAfter?: number;
	readonly skipConversions?: boolean;
	readonly name?: string;
};

export type MediaStoreCreateFileFromUploadConditions = {
	readonly hash?: string;
	readonly size?: number;
};

export type MediaStoreCreateFileFromUploadBody = {
	readonly uploadId: string;

	readonly name?: string;
	readonly mimeType?: string;
	readonly conditions?: MediaStoreCreateFileFromUploadConditions;
};

export type MediaStoreGetFileParams = {
	readonly version?: number;
	readonly collection?: string;
};

export type MediaStoreGetFileImageParams = {
	readonly allowAnimated?: boolean;
	readonly version?: number;
	readonly collection?: string;
	readonly width?: number;
	readonly height?: number;
	readonly mode?: 'fit' | 'full-fit' | 'crop';
	readonly upscale?: boolean;
	readonly 'max-age'?: number;
	/*
	The below parameters aren't accepted by the endpoint,
	but are required by hot-110955 to communicate information to the PerformanceObserver
	*/
	readonly source?: string;
	readonly ssr?: SSR;
};

export interface SourceFile {
	id: string;
	owner: ClientAltBasedAuth | AsapBasedAuth; // Auth information of source file copy from
	collection?: string;
	version?: number;
}

export type MediaStoreCopyFileWithTokenBody = {
	sourceFile: SourceFile;
};

export type MediaStoreCopyFileWithTokenParams = {
	// Name of the collection to insert the file to.
	readonly collection?: string;
	// the versioned file ID that this file will overwrite. Destination fileId.
	readonly replaceFileId?: string;
	// The file will be added to the specified collection with this occurrence key.
	readonly occurrenceKey?: string;
};

export type AppendChunksToUploadRequestBody = {
	readonly chunks: string[];

	readonly hash?: string;
	readonly offset?: number;
};

export interface CreatedTouchedFile {
	fileId: string;
	uploadId: string;
}

export interface RejectedTouchFile {
	fileId: string;
	error: RejectionError;
}

export type RejectionError = {
	code: 'ExceedMaxFileSizeLimit';
	title: string;
	href: string;
	limit: number;
	size: number;
};

export type TouchedFiles = {
	created: CreatedTouchedFile[];
	rejected?: RejectedTouchFile[];
};

export interface EmptyFile {
	readonly id: string;
	readonly createdAt: number;
}

export interface MediaApi {
	removeCollectionFile: (
		id: string,
		collectionName: string,
		occurrenceKey?: string,
		traceContext?: MediaTraceContext,
	) => Promise<void>;

	createUpload: (
		createUpTo: number,
		collectionName?: string,
		traceContext?: MediaTraceContext,
		chunkChunkHashAlgorithm?: ChunkHashAlgorithm,
	) => Promise<MediaStoreResponse<MediaUpload[]>>;

	uploadChunk: (
		etag: string,
		blob: Blob,
		uploadId: string,
		partNumber: number,
		collectionName?: string,
		traceContext?: MediaTraceContext,
	) => Promise<void>;

	createFileFromUpload: (
		body: MediaStoreCreateFileFromUploadBody,
		params: MediaStoreCreateFileFromUploadParams,
		traceContext?: MediaTraceContext,
	) => Promise<MediaStoreResponse<MediaFile>>;

	getRejectedResponseFromDescriptor: (
		descriptor: TouchFileDescriptor,
		limit: number,
	) => RejectedTouchFile;

	touchFiles: (
		body: MediaStoreTouchFileBody,
		params: MediaStoreTouchFileParams,
		traceContext?: MediaTraceContext,
	) => Promise<MediaStoreResponse<TouchedFiles>>;

	getFile: (
		fileId: string,
		params: MediaStoreGetFileParams,
		traceContext?: MediaTraceContext,
	) => Promise<MediaStoreResponse<MediaFile>>;

	getFileImageURL: (id: string, params?: MediaStoreGetFileImageParams) => Promise<string>;

	// TODO Create ticket in case Trace Id can be supported through query params
	getFileImageURLSync: (id: string, params?: MediaStoreGetFileImageParams) => string;

	getFileBinary: (id: string, collectionName?: string) => Promise<Blob>;

	getFileBinaryURL: (id: string, collectionName?: string) => Promise<string>;

	getArtifactURL: (
		artifacts: MediaFileArtifacts,
		artifactName: keyof MediaFileArtifacts,
		collectionName?: string,
	) => Promise<string>;

	getImage: (
		id: string,
		params?: MediaStoreGetFileImageParams,
		controller?: AbortController,
		fetchMaxRes?: boolean,
		traceContext?: MediaTraceContext,
	) => Promise<Blob>;

	getItems: (
		ids: string[],
		collectionName?: string,
		traceContext?: MediaTraceContext,
	) => Promise<MediaStoreResponse<ItemsPayload>>;

	getImageMetadata: (
		id: string,
		params?: MediaStoreGetFileImageParams,
		traceContext?: MediaTraceContext,
	) => Promise<{ metadata: ImageMetadata }>;

	appendChunksToUpload: (
		uploadId: string,
		body: AppendChunksToUploadRequestBody,
		collectionName?: string,
		traceContext?: MediaTraceContext,
	) => Promise<void>;

	copyFileWithToken: (
		body: MediaStoreCopyFileWithTokenBody,
		params: MediaStoreCopyFileWithTokenParams,
		traceContext?: MediaTraceContext,
	) => Promise<MediaStoreResponse<MediaFile>>;

	request: (
		path: string,
		options: MediaStoreRequestOptions,
		controller?: AbortController,
	) => Promise<Response>;

	resolveAuth: (authContext?: AuthContext) => Promise<Auth>;

	resolveInitialAuth: () => Auth;
}
