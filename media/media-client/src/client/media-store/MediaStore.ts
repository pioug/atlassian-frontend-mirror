import {
	type AuthContext,
	type MediaApiConfig,
	type Auth,
	isClientBasedAuth,
} from '@atlaskit/media-core';
import { getRandomHex, type MediaTraceContext } from '@atlaskit/media-common';
import { type MediaFileArtifacts } from '@atlaskit/media-state';
import type {
	ItemsPayload,
	ImageMetadata,
	MediaStoreResponse,
	MediaStoreTouchFileParams,
	TouchFileDescriptor,
	MediaStoreTouchFileBody,
	RejectedTouchFile,
	MediaStoreRequestOptions,
	MediaStoreCreateFileFromUploadParams,
	MediaStoreCreateFileFromUploadBody,
	MediaStoreGetFileParams,
	MediaStoreGetFileImageParams,
	MediaStoreCopyFileWithTokenBody,
	MediaStoreCopyFileWithTokenParams,
	AppendChunksToUploadRequestBody,
	TouchedFiles,
	MediaApi,
} from './types';
import { FILE_CACHE_MAX_AGE, MAX_RESOLUTION } from '../../constants';
import { getArtifactUrl } from '../../models/artifacts';
import { type MediaFile, type MediaUpload } from '../../models/media';
import { request } from '../../utils/request';
import {
	createUrl,
	createMapResponseToJson,
	createMapResponseToBlob,
} from '../../utils/request/helpers';
import { mapToMediaCdnUrl } from '../../utils/mediaCdn';
import {
	type RequestHeaders,
	type RequestMetadata,
	type CreateUrlOptions,
} from '../../utils/request/types';
import { resolveAuth, resolveInitialAuth } from './resolveAuth';
import { ChunkHashAlgorithm } from '@atlaskit/media-core';
import { fg } from '@atlaskit/platform-feature-flags';
import { isCommercial } from '../../utils/isCommercial';

const MEDIA_API_REGION = 'media-api-region';
const MEDIA_API_ENVIRONMENT = 'media-api-environment';

const extendImageParams = (
	params?: MediaStoreGetFileImageParams,
	fetchMaxRes: boolean = false,
): MediaStoreGetFileImageParams => {
	return {
		...params,
		'max-age': params?.['max-age'] ?? FILE_CACHE_MAX_AGE,
		allowAnimated: params?.allowAnimated ?? true,
		mode: params?.mode ?? 'crop',
		...(fetchMaxRes ? { width: MAX_RESOLUTION, height: MAX_RESOLUTION } : {}),
	};
};

const jsonHeaders = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
};

const cdnFeatureFlag = (endpoint: string) => {
	let result = endpoint;
	if (fg('platform_media_cdn_delivery')) {
		if (isCommercial()) {
			result += '/cdn';
		}
	}
	return result;
};

export class MediaStore implements MediaApi {
	private readonly _chunkHashAlgorithm: ChunkHashAlgorithm;
	constructor(private readonly config: MediaApiConfig) {
		this._chunkHashAlgorithm = config.chunkHashAlgorithm || ChunkHashAlgorithm.Sha1;
	}

	async removeCollectionFile(
		id: string,
		collectionName: string,
		occurrenceKey?: string,
		traceContext?: MediaTraceContext,
	): Promise<void> {
		const metadata: RequestMetadata = {
			method: 'PUT',
			endpoint: '/collection/{collectionName}',
		};

		const body = {
			actions: [
				{
					action: 'remove',
					item: {
						type: 'file',
						id,
						occurrenceKey,
					},
				},
			],
		};

		const options: MediaStoreRequestOptions = {
			...metadata,
			authContext: { collectionName },
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
			traceContext,
		};

		await this.request(`/collection/${collectionName}`, options);
	}

	createUpload(
		createUpTo: number = 1,
		collectionName?: string,
		traceContext?: MediaTraceContext,
	): Promise<MediaStoreResponse<MediaUpload[]>> {
		const metadata: RequestMetadata = {
			method: 'POST',
			endpoint: '/upload',
		};

		const options: MediaStoreRequestOptions = {
			...metadata,
			authContext: { collectionName },
			params: {
				createUpTo,
				hashAlgorithm: this._chunkHashAlgorithm,
			},
			headers: {
				Accept: 'application/json',
			},
			traceContext,
		};

		return this.request(`/upload`, options).then(createMapResponseToJson(metadata));
	}

	async uploadChunk(
		etag: string,
		blob: Blob,
		uploadId: string,
		partNumber: number,
		collectionName?: string,
		traceContext?: MediaTraceContext,
	): Promise<void> {
		const metadata: RequestMetadata = {
			method: 'PUT',
			endpoint: '/chunk/{etag}',
		};

		const options: MediaStoreRequestOptions = {
			...metadata,
			params: { uploadId, partNumber },
			authContext: { collectionName },
			body: blob,
			traceContext,
		};

		await this.request(`/chunk/${etag}`, options);
	}

	createFileFromUpload(
		body: MediaStoreCreateFileFromUploadBody,
		params: MediaStoreCreateFileFromUploadParams = {},
		traceContext?: MediaTraceContext,
	): Promise<MediaStoreResponse<MediaFile>> {
		const metadata: RequestMetadata = {
			method: 'POST',
			endpoint: '/file/upload',
		};

		const options: MediaStoreRequestOptions = {
			...metadata,
			authContext: { collectionName: params.collection },
			params,
			headers: jsonHeaders,
			body: JSON.stringify(body),
			traceContext,
		};

		return this.request('/file/upload', options).then(createMapResponseToJson(metadata));
	}

	getRejectedResponseFromDescriptor(
		descriptor: TouchFileDescriptor,
		limit: number,
	): RejectedTouchFile {
		return {
			fileId: descriptor.fileId,
			error: {
				code: 'ExceedMaxFileSizeLimit',
				title: 'The expected file size exceeded the maximum size limit.',
				href: 'https://dt-api-filestore--app.ap-southeast-2.dev.atl-paas.net/api.html#BadRequest',
				limit,
				size: descriptor.size!,
			},
		};
	}

	async touchFiles(
		body: MediaStoreTouchFileBody,
		params: MediaStoreTouchFileParams = {},
		traceContext?: MediaTraceContext,
	): Promise<MediaStoreResponse<TouchedFiles>> {
		const metadata: RequestMetadata = {
			method: 'POST',
			endpoint: '/upload/createWithFiles',
		};

		const options: MediaStoreRequestOptions = {
			...metadata,
			authContext: { collectionName: params.collection },
			headers: jsonHeaders,
			body: JSON.stringify(body),
			traceContext,
			params: {
				hashAlgorithm: this._chunkHashAlgorithm,
			},
		};

		return this.request('/upload/createWithFiles', options).then(createMapResponseToJson(metadata));
	}

	getFile(
		fileId: string,
		params: MediaStoreGetFileParams = {},
		traceContext?: MediaTraceContext,
	): Promise<MediaStoreResponse<MediaFile>> {
		const metadata: RequestMetadata = {
			method: 'GET',
			endpoint: '/file/{fileId}',
		};

		const options: MediaStoreRequestOptions = {
			...metadata,
			authContext: { collectionName: params.collection },
			params,
			traceContext,
		};

		return this.request(`/file/${fileId}`, options).then(createMapResponseToJson(metadata));
	}

	async getFileImageURL(id: string, params?: MediaStoreGetFileImageParams): Promise<string> {
		const { collection: collectionName } = params || {};
		const auth = await this.resolveAuth({ collectionName });
		return this.createFileImageURL(id, auth, params);
	}

	// TODO Create ticket in case Trace Id can be supported through query params
	getFileImageURLSync(id: string, params?: MediaStoreGetFileImageParams): string {
		const auth = this.resolveInitialAuth();
		return this.createFileImageURL(id, auth, params);
	}

	private createFileImageURL(
		id: string,
		auth: Auth,
		params?: MediaStoreGetFileImageParams,
	): string {
		const options: CreateUrlOptions = {
			params: extendImageParams(params),
			auth,
		};

		const imageEndpoint = cdnFeatureFlag('image');

		return mapToMediaCdnUrl(
			createUrl(`${auth.baseUrl}/file/${id}/${imageEndpoint}`, options),
			auth.token,
		);
	}

	async getFileBinary(
		id: string,
		collectionName?: string,
		abortController?: AbortController,
		maxAge: number = FILE_CACHE_MAX_AGE,
	): Promise<Blob> {
		const headers: RequestHeaders = {};

		const binaryEndpoint = cdnFeatureFlag('binary');

		const metadata: RequestMetadata = {
			method: 'GET',
			endpoint: `/file/{fileId}/${binaryEndpoint}`,
		};

		const options: MediaStoreRequestOptions = {
			...metadata,
			authContext: { collectionName },
			headers,
			params: {
				collection: collectionName,
				'max-age': `${maxAge}`,
			},
		};

		return this.request(`/file/${id}/${binaryEndpoint}`, options, abortController, true).then(
			createMapResponseToBlob(metadata),
		);
	}

	async getFileBinaryURL(
		id: string,
		collectionName?: string,
		maxAge: number = FILE_CACHE_MAX_AGE,
	): Promise<string> {
		const auth = await this.resolveAuth({ collectionName });

		const options: CreateUrlOptions = {
			params: {
				dl: true,
				collection: collectionName,
				'max-age': maxAge,
			},
			auth,
		};

		const binaryEndpoint = cdnFeatureFlag('binary');

		return mapToMediaCdnUrl(
			createUrl(`${auth.baseUrl}/file/${id}/${binaryEndpoint}`, options),
			auth.token,
		);
	}

	async getArtifactURL(
		artifacts: MediaFileArtifacts,
		artifactName: keyof MediaFileArtifacts,
		collectionName?: string,
	): Promise<string> {
		const artifactUrl = getArtifactUrl(artifacts, artifactName);
		if (!artifactUrl) {
			throw new Error(`artifact ${artifactName} not found`);
		}

		const auth: Auth = await this.resolveAuth({ collectionName });

		const options: CreateUrlOptions = {
			params: {
				collection: collectionName,
				'max-age': FILE_CACHE_MAX_AGE,
			},
			auth,
		};

		return createUrl(mapToMediaCdnUrl(artifactUrl, auth.token), options);
	}

	async getImage(
		id: string,
		params?: MediaStoreGetFileImageParams,
		controller?: AbortController,
		fetchMaxRes?: boolean,
		traceContext?: MediaTraceContext,
	): Promise<Blob> {
		// TODO add checkWebpSupport() back https://product-fabric.atlassian.net/browse/MPT-584
		const isWebpSupported = false;
		const headers: RequestHeaders = {};
		if (isWebpSupported) {
			headers.accept = 'image/webp,image/*,*/*;q=0.8';
		}

		const imageEndpoint = cdnFeatureFlag('image');

		const metadata: RequestMetadata = {
			method: 'GET',
			endpoint: `/file/{fileId}/${imageEndpoint}`,
		};

		const options: MediaStoreRequestOptions = {
			...metadata,
			authContext: { collectionName: params && params.collection },
			params: extendImageParams(params, fetchMaxRes),
			headers,
			traceContext,
			addMediaClientParam: fg('platform.media-card-performance-observer_a803k') && true,
		};

		return this.request(`/file/${id}/${imageEndpoint}`, options, controller, true).then(
			createMapResponseToBlob(metadata),
		);
	}

	async getItems(
		ids: string[],
		collectionName?: string,
		traceContext?: MediaTraceContext,
	): Promise<MediaStoreResponse<ItemsPayload>> {
		const descriptors = ids.map((id) => ({
			type: 'file',
			id,
			collection: collectionName,
		}));

		const metadata: RequestMetadata = {
			method: 'POST',
			endpoint: '/items',
		};

		const options: MediaStoreRequestOptions = {
			...metadata,
			authContext: { collectionName },
			headers: jsonHeaders,
			body: JSON.stringify({ descriptors }),
			traceContext,
		};

		return this.request('/items', options).then(createMapResponseToJson(metadata));
	}

	async getImageMetadata(
		id: string,
		params?: MediaStoreGetFileImageParams,
		traceContext?: MediaTraceContext,
	): Promise<{ metadata: ImageMetadata }> {
		const metadata: RequestMetadata = {
			method: 'GET',
			endpoint: '/file/{fileId}/image/metadata',
		};

		const options: MediaStoreRequestOptions = {
			...metadata,
			authContext: { collectionName: params && params.collection },
			params,
			traceContext,
		};

		return this.request(`/file/${id}/image/metadata`, options).then(
			createMapResponseToJson(metadata),
		);
	}

	async appendChunksToUpload(
		uploadId: string,
		body: AppendChunksToUploadRequestBody,
		collectionName?: string,
		traceContext?: MediaTraceContext,
	): Promise<void> {
		const metadata: RequestMetadata = {
			method: 'PUT',
			endpoint: '/upload/{uploadId}/chunks',
		};

		const options: MediaStoreRequestOptions = {
			...metadata,
			authContext: { collectionName },
			headers: jsonHeaders,
			body: JSON.stringify(body),
			traceContext,
		};

		await this.request(`/upload/${uploadId}/chunks`, options);
	}

	copyFileWithToken(
		body: MediaStoreCopyFileWithTokenBody,
		params: MediaStoreCopyFileWithTokenParams,
		traceContext?: MediaTraceContext,
	): Promise<MediaStoreResponse<MediaFile>> {
		const metadata: RequestMetadata = {
			method: 'POST',
			endpoint: '/file/copy/withToken',
		};

		const options: MediaStoreRequestOptions = {
			...metadata,
			authContext: { collectionName: params.collection }, // Contains collection name to write to
			params, // Contains collection name to write to
			headers: jsonHeaders,
			body: JSON.stringify(body), // Contains collection name to read from
			traceContext,
		};

		return this.request('/file/copy/withToken', options).then(createMapResponseToJson(metadata));
	}

	async request(
		path: string,
		options: MediaStoreRequestOptions = {
			method: 'GET',
			endpoint: undefined,
			authContext: {},
		},
		controller?: AbortController,
		useMediaCdn?: boolean,
	): Promise<Response> {
		const {
			method,
			endpoint,
			authContext,
			params,
			headers,
			body,
			clientOptions,
			traceContext,
			addMediaClientParam,
		} = options;
		const auth = await this.resolveAuth(authContext);
		const clientId = isClientBasedAuth(auth) ? auth.clientId : undefined;
		const extendedTraceContext = traceContext
			? {
					...traceContext,
					spanId: traceContext?.spanId || getRandomHex(8),
				}
			: undefined;

		let url = `${auth.baseUrl}${path}`;

		if (useMediaCdn) {
			url = mapToMediaCdnUrl(url, auth.token);
		}

		const response = await request(
			url,
			{
				method,
				endpoint,
				auth,
				params: addMediaClientParam ? { ...params, clientId } : params,
				headers,
				body,
				clientOptions,
				traceContext: extendedTraceContext,
			},
			controller,
		);

		setKeyValueInSessionStorage(MEDIA_API_REGION, response.headers.get('x-media-region'));
		setKeyValueInSessionStorage(MEDIA_API_ENVIRONMENT, response.headers.get('x-media-env'));
		return response;
	}

	resolveAuth = (authContext?: AuthContext) =>
		resolveAuth(this.config.authProvider, authContext, this.config.authProviderTimeout);

	resolveInitialAuth = () => resolveInitialAuth(this.config.initialAuth);
	get chunkHashAlgorithm() {
		return this._chunkHashAlgorithm;
	}
}

const getValueFromSessionStorage = (key: string): string | undefined => {
	return (window && window.sessionStorage && window.sessionStorage.getItem(key)) || undefined;
};

const setKeyValueInSessionStorage = (key: string, value: string | null) => {
	if (!value || !(window && window.sessionStorage)) {
		return;
	}

	const currentValue = window.sessionStorage.getItem(key);

	if (currentValue !== value) {
		window.sessionStorage.setItem(key, value);
	}
};

export const getMediaEnvironment = (): string | undefined => {
	return getValueFromSessionStorage(MEDIA_API_ENVIRONMENT);
};

export const getMediaRegion = (): string | undefined => {
	return getValueFromSessionStorage(MEDIA_API_REGION);
};
