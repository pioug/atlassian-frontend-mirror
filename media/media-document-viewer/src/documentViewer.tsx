/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useLayoutEffect, useRef } from 'react';

import { css } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import { useStaticCallback } from '@atlaskit/media-common';
import { token } from '@atlaskit/tokens';

import { Page } from './page';
import { type PageRangeContent } from './types';
import { usePageContent } from './usePageContent';
import { getScrollElement } from './utils/getDocumentRoot';
import { useCachedGetImage } from './utils/useCachedGetImage';

export type DocumentViewerProps = {
	getContent: (pageStart: number, pageEnd: number) => Promise<PageRangeContent>;
	getPageImageUrl: (pageNumber: number, zoom: number) => Promise<string>;
	paginationSize?: number;
	/**
	 * The maximum zoom level that will be requested from the image service.
	 * This is used to prevent the page from being too large to render server side in a reasonable time.
	 *
	 * The 'zoom' prop can still be greater than this value, but the server side image service will return
	 * a smaller image and the image will be scaled-up client side.
	 */
	maxPageImageZoom?: number;
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
	width: 'max-content',
});

const DEFAULT_PAGINATION_SIZE = 50;
const DEFAULT_MAX_PAGE_IMAGE_ZOOM = 6;

export const DocumentViewer = ({
	onSuccess,
	getContent,
	getPageImageUrl,
	paginationSize = DEFAULT_PAGINATION_SIZE,
	maxPageImageZoom = DEFAULT_MAX_PAGE_IMAGE_ZOOM,
	zoom,
}: DocumentViewerProps) => {
	const { getPageContent, loadPageContent, documentMetadata } = usePageContent(
		getContent,
		paginationSize,
	);
	const getImageUrl = useCachedGetImage(getPageImageUrl, maxPageImageZoom);

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

	const touchStartRef = useRef<{ x: number; y: number } | null>(null);

	const onTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
		const touch = event.touches[0];
		if (touch) {
			touchStartRef.current = { x: touch.clientX, y: touch.clientY };
		}
	}, []);

	const onTouchMove = useStaticCallback((event: React.TouchEvent<HTMLDivElement>) => {
		const container = getScrollElement();

		if (!container || !touchStartRef.current) {
			return;
		}

		const touch = event.touches[0];
		if (!touch) {
			return;
		}

		// Calculate the delta from the last touch position
		const deltaX = touchStartRef.current.x - touch.clientX;
		const deltaY = touchStartRef.current.y - touch.clientY;

		// Apply the scroll
		container.scrollLeft += deltaX;
		container.scrollTop += deltaY;

		// Update the reference position for the next move
		touchStartRef.current = { x: touch.clientX, y: touch.clientY };
	});

	const onTouchEnd = useCallback(() => {
		touchStartRef.current = null;
	}, []);

	return (
		<div
			data-testid="document-viewer"
			style={style}
			css={documentViewerStyles}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
		>
			{[...Array(documentMetadata.pageCount ?? 4)].map((_, i) => {
				const { page, fonts } = getPageContent(i);
				return (
					<Page
						key={i}
						getPageSrc={getImageUrl}
						maxPageImageZoom={maxPageImageZoom}
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
