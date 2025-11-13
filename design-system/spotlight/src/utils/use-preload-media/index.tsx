import { useEffect } from 'react';

import { getDocument } from '@atlaskit/browser-apis';
import __noop from '@atlaskit/ds-lib/noop';

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
type MimeType =
	| 'video/mp4'
	| 'video/webm'
	| 'video/ogg'
	| 'video/mpeg'
	| 'video/x-matroska'
	| 'image/jpeg'
	| 'image/png'
	| 'image/gif'
	| 'image/webp'
	| 'image/svg+xml';

interface PreloadMediaOptions {
	mimetype: MimeType;
}

/**
 * Preloads media (video/image) files to be cached by the browser.
 * Once loaded, the browser cache will be used when rendering the actual media element.
 *
 * @param src - The media source URL to preload
 * @param options - Configuration options including the MIME type
 */
export const usePreloadMedia = (src: string, options: PreloadMediaOptions) => {
	useEffect(() => {
		const handler = mimeTypeHandlers[options.mimetype];

		return handler(src);
	}, [src, options.mimetype]);
};

const preloadVideo = (src: string): (() => void) => {
	const doc = getDocument();
	if (!doc) {
		return __noop;
	}

	const video = doc.createElement('video');

	video.src = src;
	video.preload = 'auto';
	video.load();

	return () => {
		video.src = '';
		video.load();
	};
};

const preloadImage = (src: string): (() => void) => {
	const doc = getDocument();
	if (!doc) {
		return __noop;
	}

	const img = new Image();

	img.src = src;

	return () => {
		img.src = '';
	};
};

const mimeTypeHandlers: Record<MimeType, (src: string) => () => void> = {
	'video/mp4': preloadVideo,
	'video/webm': preloadVideo,
	'video/ogg': preloadVideo,
	'video/mpeg': preloadVideo,
	'video/x-matroska': preloadVideo,
	'image/jpeg': preloadImage,
	'image/png': preloadImage,
	'image/gif': preloadImage,
	'image/webp': preloadImage,
	'image/svg+xml': preloadImage,
};
