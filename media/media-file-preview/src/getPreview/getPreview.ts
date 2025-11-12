import {
	addFileAttrsToUrl,
	type FilePreview,
	type MediaBlobUrlAttrs,
	type MediaClient,
	type MediaStoreGetFileImageParams,
} from '@atlaskit/media-client';
import { type MediaTraceContext, type SSR } from '@atlaskit/media-common';

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

export const getSSRPreview = (
	ssr: SSR,
	mediaClient: MediaClient,
	id: string,
	params: MediaStoreGetFileImageParams,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
): MediaFilePreview => {
	try {
		const dataURI = getDataUri(mediaClient, id, params, mediaBlobUrlAttrs);
		let srcSet = `${dataURI} 1x`;

		if (params.width) {
			const doubleDataURI = getDataUri(
				mediaClient,
				id,
				{ ...params, width: params.width * 2, height: params.height && params.height * 2 },
				mediaBlobUrlAttrs,
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

export const isLocalPreview = (preview: MediaFilePreview) => {
	const localSources: MediaFilePreviewSource[] = ['local', 'cache-local'];
	return localSources.includes(preview.source);
};

export const isRemotePreview = (preview: MediaFilePreview) => {
	const remoteSources: MediaFilePreviewSource[] = ['remote', 'cache-remote'];
	return remoteSources.includes(preview.source);
};

export const isSSRClientPreview = (preview: MediaFilePreview) => preview.source === 'ssr-client';

export const isSSRDataPreview = (preview: MediaFilePreview) => preview.source === 'ssr-data';

export const isSSRPreview = (preview: MediaFilePreview) => {
	const ssrClientSources: MediaFilePreviewSource[] = ['ssr-client', 'ssr-server', 'ssr-data'];
	return ssrClientSources.includes(preview.source);
};

export const getAndCacheRemotePreview = async (
	mediaClient: MediaClient,
	id: string,
	dimensions: MediaFilePreviewDimensions,
	params: MediaStoreGetFileImageParams,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
	traceContext?: MediaTraceContext,
) => {
	const remotePreview = await getRemotePreview(mediaClient, id, params, traceContext);

	return extendAndCachePreview(
		id,
		params.mode,
		{ ...remotePreview, dimensions },
		mediaBlobUrlAttrs,
	);
};

export const getAndCacheLocalPreview = async (
	id: string,
	filePreview: FilePreview | Promise<FilePreview>,
	dimensions: MediaFilePreviewDimensions,
	mode: MediaStoreGetFileImageParams['mode'],
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
) => {
	const localPreview = await getLocalPreview(filePreview);

	return extendAndCachePreview(id, mode, { ...localPreview, dimensions }, mediaBlobUrlAttrs);
};
