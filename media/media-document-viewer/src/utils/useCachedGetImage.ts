import { useRef } from 'react';

import { useStaticCallback } from './useStaticCallback';

export const useCachedGetImage = (
	getPageImageUrl: (pageNumber: number, zoom: number) => Promise<string>,
) => {
	const imageUrlRefs = useRef<Record<string, string>>({});

	const getImageUrl = useStaticCallback(async (pageNumber: number, zoom: number) => {
		const key = `${pageNumber}-${zoom}`;
		if (imageUrlRefs.current[key]) {
			return imageUrlRefs.current[key];
		}

		let url = await getPageImageUrl(pageNumber, zoom);

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
