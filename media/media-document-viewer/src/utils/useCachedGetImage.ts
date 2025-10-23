import { useEffect, useRef } from 'react';

import { useStaticCallback } from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags';

export const useCachedGetImage = (
	getPageImageUrl: (pageNumber: number, zoom: number) => Promise<string>,
	maxPageImageZoom: number,
) => {
	const imageUrlRefs = useRef<Record<string, string>>({});

	useEffect(() => {
		return () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			for (const url of Object.values(imageUrlRefs.current)) {
				URL.revokeObjectURL(url);
			}
		};
	}, []);

	const getImageUrl = useStaticCallback(async (pageNumber: number, zoom: number) => {
		const imageZoom = getImageZoom(zoom, maxPageImageZoom);
		const key = `${pageNumber}-${imageZoom}`;
		if (imageUrlRefs.current[key]) {
			return imageUrlRefs.current[key];
		}

		let url = await getPageImageUrl(pageNumber, imageZoom);

		const isBlobUrl = url.startsWith('blob:');
		if (!isBlobUrl) {
			const blob = await fetch(url).then((res) => res.blob());
			url = URL.createObjectURL(blob);
		}

		imageUrlRefs.current[key] = url;
		return url;
	});

	return getImageUrl;
};

/**
 * The actual zoom that will be requested from the image service.
 *
 * This is different from the 'zoom' prop because it is adjusted for the device pixel ratio.
 * We're achieving the same result as a srcset, crisp images for high DPI screens.
 *
 * We also reduce impact of excessively slow rendering by setting a max zoom level.
 * If the user is zoomed past this level, the image will just be scaled-up client side.
 */
export function getImageZoom(zoom: number, maxPageImageZoom: number) {
	if (!fg('media-document-viewer-clear-render')) {
		return zoom;
	}

	const dpiAdjustedZoom = zoom * (window.devicePixelRatio || 1);
	return Math.min(dpiAdjustedZoom, maxPageImageZoom);
}
