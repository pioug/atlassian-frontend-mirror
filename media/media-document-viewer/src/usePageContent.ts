import { useMemo, useRef, useState } from 'react';

import { useStaticCallback } from '@atlaskit/media-common';

import type { PageRangeContent } from './types';

export function usePageContent(
	getContent: (startIndex: number, endIndex: number) => Promise<PageRangeContent>,
	paginationSize: number,
) {
	const [contentRanges, setContentRanges] = useState<PageRangeContent[]>([]);
	const contentRangesRequestRef = useRef<Record<number, Promise<PageRangeContent>>>({});

	const loadPageContent = useStaticCallback(async (pageInd: number) => {
		const contentRangeInd = Math.floor(pageInd / paginationSize);
		// Content already loaded for this page range
		if (contentRanges[contentRangeInd]) {
			return;
		}

		const startIndex = contentRangeInd * paginationSize;
		const endIndex = startIndex + paginationSize;

		contentRangesRequestRef.current[contentRangeInd] ??= getContent(startIndex, endIndex);

		const content = await contentRangesRequestRef.current[contentRangeInd];

		setContentRanges((prev) => {
			const newRanges = [...prev];
			newRanges[contentRangeInd] = content;
			return newRanges;
		});
	});

	function getPageContent(pageInd: number) {
		const contentRangeInd = Math.floor(pageInd / paginationSize);
		const page = contentRanges[contentRangeInd]?.pages[pageInd % paginationSize];
		const fonts = contentRanges[contentRangeInd]?.fonts;
		return { page, fonts };
	}

	const documentMetadata = useMemo(
		() => ({
			defaultDimensions: contentRanges[0]?.pages[0]
				? {
						height: contentRanges[0].pages[0].height,
						width: contentRanges[0].pages[0].width,
					}
				: undefined,
			pageCount: contentRanges[0]?.total_pages ?? 4,
		}),
		[contentRanges],
	);

	return {
		getPageContent,
		loadPageContent,
		documentMetadata,
	};
}
