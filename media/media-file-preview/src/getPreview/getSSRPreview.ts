import {
	addFileAttrsToUrl,
	type MediaBlobUrlAttrs,
	type MediaClient,
	type MediaStoreGetFileImageParams,
} from '@atlaskit/media-client';
import { type SSR } from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { SsrPreviewError } from '../SsrPreviewError';
import { type MediaFilePreview } from '../types';
import { mergeClientIdIntoAttrs } from './mergeClientIdIntoAttrs';

const getDataUri = (
	mediaClient: MediaClient,
	id: string,
	params: MediaStoreGetFileImageParams,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
	seededCdnUrl?: string,
) => {
	const signedDataURI = mediaClient.getImageUrlSync(id, params, seededCdnUrl);
	return mediaBlobUrlAttrs ? addFileAttrsToUrl(signedDataURI, mediaBlobUrlAttrs) : signedDataURI;
};

export const getSSRPreview = (
	ssr: SSR,
	mediaClient: MediaClient,
	id: string,
	params: MediaStoreGetFileImageParams,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
	seededCdnUrl?: string,
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

		const dataURI = getDataUri(mediaClient, id, params, attrsWithClientId, seededCdnUrl);
		let srcSet = `${dataURI} 1x`;

		if (params.width) {
			const doubleDataURI = getDataUri(
				mediaClient,
				id,
				{ ...params, width: params.width * 2, height: params.height && params.height * 2 },
				attrsWithClientId,
				seededCdnUrl,
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
