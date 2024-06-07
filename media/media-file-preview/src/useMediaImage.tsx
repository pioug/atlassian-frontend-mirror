import { useCallback } from 'react';

import {
	type FileIdentifier,
	type MediaBlobUrlAttrs,
	type MediaStoreGetFileImageParams,
} from '@atlaskit/media-client';
import { type MediaTraceContext, type SSR } from '@atlaskit/media-common';

import { type MediaFilePreviewDimensions } from './types';
import { useFilePreview } from './useFilePreview';

export interface UseMediaImageParams {
	/** Instance of file identifier. */
	readonly identifier: FileIdentifier;
	/** Resize the media to 'crop' | 'fit' | 'full-fit' */
	readonly resizeMode?: MediaStoreGetFileImageParams['mode'];
	/** Dimensions to be requested to the server. Will be scaled x2 in Retina Displays */
	readonly dimensions?: MediaFilePreviewDimensions;
	/** Server-Side-Rendering modes are "server" and "client" */
	readonly ssr?: SSR;
	/** Attributes to attach to the created Blob Url */
	readonly mediaBlobUrlAttrs?: MediaBlobUrlAttrs; // FOR COPY & PASTE
	/** Trace context to be passed to the backend requests */
	readonly traceContext?: MediaTraceContext;
	/** Do not fetch a remote preview. Helpful for lazy loading */
	readonly skipRemote?: boolean;
	/** Define whether an animated image is acceptable to return */
	readonly allowAnimated?: boolean;
	/** Define the upscale strategy for this image. */
	readonly upscale?: boolean;
	/** Make the client receive the response with the given max-age cache control header. Minimum: 0, maximum: 9223372036854776000.
	 */
	readonly maxAge?: number;
	/** On image load and on error callback from the parent. We are keeping the name same to streamline the customer experience when using these properties back to their image components */
	readonly onLoad?: () => void;
	readonly onError?: () => void;
}

export const useMediaImage = ({
	identifier,
	resizeMode,
	dimensions,
	ssr,
	mediaBlobUrlAttrs,
	traceContext,
	skipRemote,
	allowAnimated,
	upscale,
	maxAge,
	onLoad: onLoadCallback,
	onError: onErrorCallback,
}: UseMediaImageParams) => {
	const { preview, status, error, onImageError, onImageLoad, getSsrScriptProps } = useFilePreview({
		identifier,
		resizeMode,
		dimensions,
		ssr,
		mediaBlobUrlAttrs,
		traceContext,
		skipRemote,
		allowAnimated,
		upscale,
		maxAge,
	});

	const onLoad = useCallback(() => {
		onLoadCallback && onLoadCallback();
		onImageLoad(preview);
	}, [onImageLoad, onLoadCallback, preview]);

	const onError = useCallback(() => {
		onErrorCallback && onErrorCallback();
		onImageError(preview);
	}, [onErrorCallback, onImageError, preview]);

	const getImgProps = useCallback(
		() => ({
			src: preview?.dataURI,
			onLoad,
			onError,
			'data-test-file-id': identifier.id,
			'data-test-collection': identifier.collectionName,
			'data-test-preview-source': preview?.source,
		}),
		[identifier.collectionName, identifier.id, onError, onLoad, preview?.dataURI, preview?.source],
	);

	return { status, error, getImgProps, getSsrScriptProps };
};
