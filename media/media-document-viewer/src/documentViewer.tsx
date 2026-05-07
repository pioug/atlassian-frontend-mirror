/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	type TouchEventHandler,
	type TouchEvent,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';

import { css } from '@compiled/react';

import { getDocument } from '@atlaskit/browser-apis';
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
	/**
	 * When true, renders an initial batch of pages and appends more as the user scrolls.
	 * Intended for large documents (e.g. large Excel previews).
	 * Default: false.
	 */
	enableLazyPageRendering?: boolean;
};

const documentViewerStyles = css({
	marginTop: token('space.800'),
	minWidth: '100%',
	display: 'flex',
	gap: token('space.150'),
	flexDirection: 'column',
	overflow: 'auto',
	width: 'max-content',
});

const DEFAULT_PAGINATION_SIZE = 50;
const INITIAL_PAGE_COUNT = 50;
const APPEND_STEP = 50;

/**
 * TAIL-APPEND PATTERN FOR LAZY LOADING:
 *
 * The <Page> component has an `onVisible: () => void` prop that is called when the page
 * enters the viewport (via useIntersectionObserver with a 300% rootMargin). This callback
 * is currently used to load page content via `loadPageContent(i)`.
 *
 * For the LazyAppendPages feature (T2.3), the parent component can leverage this same
 * mechanism by:
 * 1. Rendering only a subset of pages (lazyPageCount instead of all documentMetadata.pageCount)
 * 2. Passing onVisible={handleAppend} ONLY to the last rendered page (i === lazyPageCount - 1)
 * 3. For all other pages, passing onVisible={() => loadPageContent(i)} as usual
 *
 * When the last page enters the viewport, handleAppend will be triggered, which can:
 * - Fetch the next batch of pages
 * - Append them to the rendered page list
 * - This effectively creates a tail-append/infinite-scroll behavior without any changes to <Page>
 *
 * No changes to the <Page> signature are required. The onVisible callback is already
 * properly wired and can be overridden by parent components for different behaviors.
 */

type PageRenderingProps = {
	documentMetadata: ReturnType<typeof usePageContent>['documentMetadata'];
	getPageContent: ReturnType<typeof usePageContent>['getPageContent'];
	loadPageContent: ReturnType<typeof usePageContent>['loadPageContent'];
	getImageUrl: ReturnType<typeof useCachedGetImage>;
	zoom: number;
	onSuccess?: () => void;
	style: CSSProperties;
	onTouchStart: TouchEventHandler<HTMLDivElement>;
	onTouchMove: TouchEventHandler<HTMLDivElement>;
	onTouchEnd: TouchEventHandler<HTMLDivElement>;
};

const LegacyPages = ({
	documentMetadata,
	getPageContent,
	loadPageContent,
	getImageUrl,
	zoom,
	onSuccess,
	style,
	onTouchStart,
	onTouchMove,
	onTouchEnd,
}: PageRenderingProps): JSX.Element => {
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
						pageIndex={i}
						zoom={zoom}
						defaultDimensions={documentMetadata.defaultDimensions}
						onVisible={loadPageContent}
						onLoad={i === 0 ? onSuccess : undefined}
						fonts={fonts}
						content={page}
					/>
				);
			})}
		</div>
	);
};

const LazyAppendPages = ({
	documentMetadata,
	getPageContent,
	loadPageContent,
	getImageUrl,
	zoom,
	onSuccess,
	style,
	onTouchStart,
	onTouchMove,
	onTouchEnd,
}: PageRenderingProps): JSX.Element => {
	const totalPages = documentMetadata.pageCount ?? 4;

	const [lazyPageCount, setLazyPageCount] = useState(() =>
		Math.min(INITIAL_PAGE_COUNT, totalPages),
	);

	// lastAppendTriggerIndex deduplicates: only append when a strictly-larger
	// tail page fires onVisible. This prevents double-append on scroll-up-then-down.
	const lastAppendTriggerIndex = useRef(-1);

	// Handle #page-N URL hash on first load: fast-forward lazyPageCount to include the target page.
	// Capture totalPages in a ref so the one-shot effect can read it without being re-run when
	// totalPages changes (the effect must only fire once, on mount).
	const totalPagesRef = useRef(totalPages);
	useEffect(() => {
		const total = totalPagesRef.current;
		const hash = window.location.hash;
		const match = hash.match(/^#page-(\d+)$/);
		if (match) {
			const targetPage = parseInt(match[1], 10);
			if (targetPage >= 1 && targetPage <= total) {
				// Update dedup ref BEFORE setLazyPageCount so handleAppend does not
				// cascade when the new tail page enters the viewport via IntersectionObserver.
				lastAppendTriggerIndex.current = targetPage - 1;
				// Fast-forward lazyPageCount to include the target page
				setLazyPageCount((prev) => Math.max(prev, targetPage));
				// After the pages are mounted (next animation frame), scroll to the target
				requestAnimationFrame(() => {
					const el = getDocument()?.getElementById(`page-${targetPage}`);
					if (el) {
						el.scrollIntoView();
					}
				});
			}
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps -- intentionally one-shot; totalPages read via ref

	const handleAppendAndLoadPageContent = useCallback(
		(pageIndex: number) => {
			if (pageIndex > lastAppendTriggerIndex.current) {
				lastAppendTriggerIndex.current = pageIndex;
				setLazyPageCount((c) => Math.min(c + APPEND_STEP, totalPages));
			}
			loadPageContent(pageIndex);
		},
		[totalPages, loadPageContent],
	);

	const appendUpTo = useCallback(
		(targetPage: number) => {
			const clamped = Math.min(Math.max(targetPage, 0), totalPages);
			if (clamped > lastAppendTriggerIndex.current) {
				lastAppendTriggerIndex.current = clamped - 1;
				setLazyPageCount((prev) => Math.max(prev, clamped));
			}
		},
		[totalPages],
	);

	return (
		<div
			data-testid="document-viewer"
			style={style}
			css={documentViewerStyles}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
		>
			{[...Array(lazyPageCount)].map((_, i) => {
				const { page, fonts } = getPageContent(i);
				return (
					<Page
						key={i}
						getPageSrc={getImageUrl}
						pageIndex={i}
						zoom={zoom}
						defaultDimensions={documentMetadata.defaultDimensions}
						onVisible={
							i === lazyPageCount - 1
								? handleAppendAndLoadPageContent
								: loadPageContent
						}
						onLoad={i === 0 ? onSuccess : undefined}
						fonts={fonts}
						content={page}
						appendUpTo={appendUpTo}
					/>
				);
			})}
		</div>
	);
};

export const DocumentViewer = ({
	onSuccess,
	getContent,
	getPageImageUrl,
	paginationSize = DEFAULT_PAGINATION_SIZE,
	zoom,
	enableLazyPageRendering = false,
}: DocumentViewerProps): JSX.Element => {
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

	const touchStartRef = useRef<{ x: number; y: number } | null>(null);

	const onTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
		const touch = event.touches[0];
		if (touch) {
			touchStartRef.current = { x: touch.clientX, y: touch.clientY };
		}
	}, []);

	const onTouchMove = useStaticCallback((event: TouchEvent<HTMLDivElement>) => {
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

	const sharedProps = {
		documentMetadata,
		getPageContent,
		loadPageContent,
		getImageUrl,
		zoom,
		onSuccess,
		style,
		onTouchStart,
		onTouchMove,
		onTouchEnd,
	};

	return enableLazyPageRendering ? (
		<LazyAppendPages {...sharedProps} />
	) : (
		<LegacyPages {...sharedProps} />
	);
};
