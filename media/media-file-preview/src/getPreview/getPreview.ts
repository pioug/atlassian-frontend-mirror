import {
	addFileAttrsToUrl,
	type FilePreview,
	type MediaBlobUrlAttrs,
	type MediaClient,
	type MediaStoreGetFileImageParams,
} from '@atlaskit/media-client';
import { type MediaTraceContext, type SSR } from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags';

import { SsrPreviewError } from '../errors';
import {
	type MediaFilePreview,
	type MediaFilePreviewDimensions,
	type MediaFilePreviewSource,
} from '../types';

import { mediaFilePreviewCache } from './cache';
import { getLocalPreview, getRemotePreview } from './helpers';

const extendAndCachePreview = (
	id: string,
	mode: MediaStoreGetFileImageParams['mode'] | undefined,
	preview: MediaFilePreview,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
): MediaFilePreview => {
	let source: MediaFilePreview['source'];
	switch (preview.source) {
		case 'local':
			source = 'cache-local';
			break;
		case 'remote':
			source = 'cache-remote';
			break;
		default:
			source = preview.source;
	}
	// We want to embed some meta context into dataURI for Copy/Paste to work.
	const dataURI = mediaBlobUrlAttrs
		? addFileAttrsToUrl(preview.dataURI, mediaBlobUrlAttrs)
		: preview.dataURI;
	// We store new cardPreview into cache
	mediaFilePreviewCache.set(id, mode, { ...preview, source, dataURI });
	return { ...preview, dataURI };
};

const getDataUri = (
	mediaClient: MediaClient,
	id: string,
	params: MediaStoreGetFileImageParams,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
) => {
	const rawDataURI = mediaClient.getImageUrlSync(id, params);
	return mediaBlobUrlAttrs ? addFileAttrsToUrl(rawDataURI, mediaBlobUrlAttrs) : rawDataURI;
};

/**
 * Merges a clientId into mediaBlobUrlAttrs for cross-client copy support.
 * Returns the original attrs unchanged if clientId is not available or the feature flag is off.
 */
const mergeClientIdIntoAttrs = (
	clientId: string | undefined,
	id: string,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
	collectionName?: string,
): MediaBlobUrlAttrs | undefined => {
	if (!clientId) {
		return mediaBlobUrlAttrs;
	}

	if (mediaBlobUrlAttrs) {
		return { ...mediaBlobUrlAttrs, clientId };
	}

	// Construct minimal attrs when none provided
	return {
		id,
		clientId,
		contextId: collectionName || '',
		collection: collectionName,
	};
};

export const getSSRPreview = (
	ssr: SSR,
	mediaClient: MediaClient,
	id: string,
	params: MediaStoreGetFileImageParams,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
): MediaFilePreview => {
	try {
		// Synchronously extract clientId from initialAuth and merge into blob URL attrs
		const clientId = fg('platform_media_cross_client_copy_with_auth')
			? mediaClient.getClientIdSync()
			: undefined;
		const attrsWithClientId = mergeClientIdIntoAttrs(clientId, id, mediaBlobUrlAttrs, params.collection);

		const dataURI = getDataUri(mediaClient, id, params, attrsWithClientId);
		let srcSet = `${dataURI} 1x`;

		if (params.width) {
			const doubleDataURI = getDataUri(
				mediaClient,
				id,
				{ ...params, width: params.width * 2, height: params.height && params.height * 2 },
				attrsWithClientId,
			);
			// We want to embed some meta context into dataURI for Copy/Paste to work.
			srcSet += `, ${doubleDataURI} 2x`;
		}
		const source = ssr === 'client' ? 'ssr-client' : 'ssr-server';
		return { dataURI, source, orientation: 1, srcSet };
	} catch (e) {
		const reason = ssr === 'server' ? 'ssr-server-uri' : 'ssr-client-uri';
		throw new SsrPreviewError(reason, e instanceof Error ? e : undefined);
	}
};

export const isLocalPreview = (preview: MediaFilePreview): boolean => {
	const localSources: MediaFilePreviewSource[] = ['local', 'cache-local'];
	return localSources.includes(preview.source);
};

export const isRemotePreview = (preview: MediaFilePreview): boolean => {
	const remoteSources: MediaFilePreviewSource[] = ['remote', 'cache-remote'];
	return remoteSources.includes(preview.source);
};

export const isSSRClientPreview = (preview: MediaFilePreview): boolean =>
	preview.source === 'ssr-client';

export const isSSRDataPreview = (preview: MediaFilePreview): boolean =>
	preview.source === 'ssr-data';

export const isSSRPreview = (preview: MediaFilePreview): boolean => {
	const ssrClientSources: MediaFilePreviewSource[] = ['ssr-client', 'ssr-server', 'ssr-data'];
	return ssrClientSources.includes(preview.source);
};

/**
 * Resolves clientId (sync first, async fallback) and enriches mediaBlobUrlAttrs
 * with it for cross-client copy support.
 */
const enrichAttrsWithClientId = async (
	mediaClient: MediaClient,
	id: string,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
	collectionName?: string,
): Promise<MediaBlobUrlAttrs | undefined> => {
	if (!fg('platform_media_cross_client_copy_with_auth')) {
		return mediaBlobUrlAttrs;
	}

	// Try sync first, then async fallback
	let clientId = mediaClient.getClientIdSync();
	if (!clientId) {
		try {
			clientId = await mediaClient.getClientId(collectionName);
		} catch {
			// clientId is optional, silently fail
		}
	}

	return mergeClientIdIntoAttrs(clientId, id, mediaBlobUrlAttrs, collectionName);
};

export const getAndCacheRemotePreview = async (
	mediaClient: MediaClient,
	id: string,
	dimensions: MediaFilePreviewDimensions,
	params: MediaStoreGetFileImageParams,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
	traceContext?: MediaTraceContext,
) => {
	const [remotePreview, enrichedAttrs] = await Promise.all([
		getRemotePreview(mediaClient, id, params, traceContext),
		enrichAttrsWithClientId(mediaClient, id, mediaBlobUrlAttrs, params.collection),
	]);

	return extendAndCachePreview(
		id,
		params.mode,
		{ ...remotePreview, dimensions },
		enrichedAttrs,
	);
};

export const getAndCacheLocalPreview = async (
	mediaClient: MediaClient,
	id: string,
	filePreview: FilePreview | Promise<FilePreview>,
	dimensions: MediaFilePreviewDimensions,
	mode: MediaStoreGetFileImageParams['mode'],
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
	collectionName?: string,
) => {
	const [localPreview, enrichedAttrs] = await Promise.all([
		getLocalPreview(filePreview),
		enrichAttrsWithClientId(mediaClient, id, mediaBlobUrlAttrs, collectionName),
	]);

	return extendAndCachePreview(id, mode, { ...localPreview, dimensions }, enrichedAttrs);
};
