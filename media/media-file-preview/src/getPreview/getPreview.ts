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

/**
 * Allowlist of CDN signing query-param names that we propagate from a
 * pre-signed `previewCdnUrl` onto the URL produced by `getImageUrlSync`.
 * These are the standard CloudFront signed-URL params; if the upstream
 * adds a new one, this list needs updating.
 */
const SIGNING_PARAM_NAMES = ['token', 'Policy', 'Key-Pair-Id', 'Signature', 'Expires'] as const;

/**
 * Pull the CDN-signing query params (token / Policy / Key-Pair-Id / Signature
 * / Expires) out of a pre-signed CDN URL so they can be overlaid on a URL
 * built independently by `getImageUrlSync` (which constructs path, image
 * params, pathBased routing, wmv, etc.). Image-shape params from the cdn URL
 * itself (width/height/mode/...) are intentionally NOT extracted — those come
 * from `imageURLParams` via `getImageUrlSync`.
 *
 * Returns `{}` on parse failure so we degrade rather than throw.
 */
export const extractCdnSigningParams = (cdnUrl: string): Record<string, string> => {
	try {
		const url = new URL(cdnUrl);
		const out: Record<string, string> = {};
		for (const name of SIGNING_PARAM_NAMES) {
			const value = url.searchParams.get(name);
			if (value !== null) {
				out[name] = value;
			}
		}
		return out;
	} catch {
		return {};
	}
};

const applyCdnSigningParams = (url: string, cdnSigningParams?: Record<string, string>): string => {
	if (!cdnSigningParams || Object.keys(cdnSigningParams).length === 0) {
		return url;
	}
	try {
		const parsed = new URL(url);
		Object.entries(cdnSigningParams).forEach(([key, value]) => {
			parsed.searchParams.set(key, value);
		});
		return parsed.toString();
	} catch {
		return url;
	}
};

const getDataUri = (
	mediaClient: MediaClient,
	id: string,
	params: MediaStoreGetFileImageParams,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
	cdnSigningParams?: Record<string, string>,
) => {
	const rawDataURI = mediaClient.getImageUrlSync(id, params);
	const signedDataURI = applyCdnSigningParams(rawDataURI, cdnSigningParams);
	return mediaBlobUrlAttrs ? addFileAttrsToUrl(signedDataURI, mediaBlobUrlAttrs) : signedDataURI;
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
	cdnSigningParams?: Record<string, string>,
): MediaFilePreview => {
	try {
		// Synchronously extract clientId from initialAuth and merge into blob URL attrs
		const clientId = fg('platform_media_cross_client_copy_with_auth')
			? mediaClient.getClientIdSync()
			: undefined;
		const attrsWithClientId = mergeClientIdIntoAttrs(
			clientId,
			id,
			mediaBlobUrlAttrs,
			params.collection,
		);

		const dataURI = getDataUri(mediaClient, id, params, attrsWithClientId, cdnSigningParams);
		let srcSet = `${dataURI} 1x`;

		if (params.width) {
			const doubleDataURI = getDataUri(
				mediaClient,
				id,
				{ ...params, width: params.width * 2, height: params.height && params.height * 2 },
				attrsWithClientId,
				cdnSigningParams,
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
): Promise<MediaFilePreview> => {
	const [remotePreview, enrichedAttrs] = await Promise.all([
		getRemotePreview(mediaClient, id, params, traceContext),
		enrichAttrsWithClientId(mediaClient, id, mediaBlobUrlAttrs, params.collection),
	]);

	return extendAndCachePreview(id, params.mode, { ...remotePreview, dimensions }, enrichedAttrs);
};

export const getAndCacheLocalPreview = async (
	mediaClient: MediaClient,
	id: string,
	filePreview: FilePreview | Promise<FilePreview>,
	dimensions: MediaFilePreviewDimensions,
	mode: MediaStoreGetFileImageParams['mode'],
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
	collectionName?: string,
): Promise<MediaFilePreview> => {
	const [localPreview, enrichedAttrs] = await Promise.all([
		getLocalPreview(filePreview),
		enrichAttrsWithClientId(mediaClient, id, mediaBlobUrlAttrs, collectionName),
	]);

	return extendAndCachePreview(id, mode, { ...localPreview, dimensions }, enrichedAttrs);
};
