/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useLayoutEffect, useRef } from 'react';

import { css } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Page } from './page';
import { type PageRangeContent } from './types';
import { usePageContent } from './usePageContent';
import { getScrollElement } from './utils/getDocumentRoot';
import { useCachedGetImage } from './utils/useCachedGetImage';

type DocumentViewerProps = {
	getContent: (pageStart: number, pageEnd: number) => Promise<PageRangeContent>;
	getPageImageUrl: (pageNumber: number, zoom: number) => Promise<string>;
	paginationSize?: number;
	zoom: number;
	onSuccess?: () => void;
};

const documentViewerStyles = css({
	marginTop: token('space.800', '64px'),
	minWidth: '100%',
	display: 'flex',
	gap: token('space.150'),
	flexDirection: 'column',
	overflow: 'auto',
});

const DEFAULT_PAGINATION_SIZE = 50;

export const DocumentViewer = ({
	onSuccess,
	getContent,
	getPageImageUrl,
	paginationSize = DEFAULT_PAGINATION_SIZE,
	zoom,
}: DocumentViewerProps) => {
	const { getPageContent, loadPageContent, documentMetadata } = usePageContent(
		getContent,
		paginationSize,
	);
	const getImageUrl = useCachedGetImage(getPageImageUrl);

	const style: Record<string, number> = {
		'--document-viewer-zoom': zoom,
	};

	const previousZoomRef = useRef(zoom);

	// Apply zoom with center-based adjustment
	useLayoutEffect(() => {
		const previousZoom = previousZoomRef.current;

		// Only adjust scroll if zoom actually changed
		if (previousZoom !== zoom) {
			// If we are not using a custom scroll element, we don't need to adjust the scroll position
			const container = getScrollElement();
			if (!container) {
				return;
			}

			// Calculate the center point of the viewport before zoom
			const viewportCenterX = container.scrollLeft + container.clientWidth / 2;
			const viewportCenterY = container.scrollTop + container.clientHeight / 2;

			// Calculate scale difference
			const scaleDiff = zoom / previousZoom - 1;

			// Adjust scroll to keep center point fixed
			container.scrollLeft += viewportCenterX * scaleDiff;
			container.scrollTop += viewportCenterY * scaleDiff;

			// Update previous zoom
			previousZoomRef.current = zoom;
		}
	}, [zoom]);

	return (
		<div data-testid="document-viewer" style={style} css={documentViewerStyles}>
			{[...Array(documentMetadata.pageCount ?? 4)].map((_, i) => {
				const { page, fonts } = getPageContent(i);
				return (
					<Page
						key={i}
						getPageSrc={getImageUrl}
						pageIndex={i}
						zoom={zoom}
						defaultDimensions={documentMetadata.defaultDimensions}
						onVisible={() => loadPageContent(i)}
						onLoad={i === 0 ? onSuccess : undefined}
						fonts={fonts}
						content={page}
					/>
				);
			})}
		</div>
	);
};
