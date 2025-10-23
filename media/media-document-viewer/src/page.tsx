/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useEffect, useState } from 'react';

import { css } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import { useStaticCallback } from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags';
import Spinner from '@atlaskit/spinner';

import { Annotations } from './annotations';
import { DocumentLinks } from './documentLinks';
import { type Font, type PageContent, type Span } from './types';
import { getDocumentRoot } from './utils/getDocumentRoot';
import { getImageZoom } from './utils/useCachedGetImage';
import { useIntersectionObserver } from './utils/useIntersectionObserver';

const Span = ({ span, font }: { span: Span; font: Font }) => {
	const width = span.l;
	const height = span.h;
	if (width <= 0) {
		return null;
	}

	return (
		<tspan
			lengthAdjust="spacingAndGlyphs"
			x={span.x}
			y={`-${span.y}`}
			height={height}
			textLength={width}
			style={{
				['fontFamily']: `${font.name}`,
				['fontSize']: `${font.size === 1 ? height : font.size}px`,
			}}
		>
			{span.text}
		</tspan>
	);
};

const textStyles = css({
	whiteSpace: 'pre',
});

const Line = (
	{
		spans,
		rotation,
		fonts,
		dataTestId,
	}: { spans: readonly Span[]; rotation: number; fonts: readonly Font[]; dataTestId?: string } = {
		spans: [],
		rotation: 0,
		fonts: [],
	},
) => (
	<text
		opacity="0.5"
		css={textStyles}
		// eslint-disable-next-line react/no-unknown-property
		transform-origin={`${spans[0].x} -${spans[0].y}`}
		style={{ transform: `rotate(${rotation}rad)` }}
		data-testid={dataTestId}
	>
		{spans.map((span, i) => (
			<Span span={span} font={fonts[span.fi]} key={i} />
		))}
	</text>
);

const pageSvgStyles = css({
	position: 'absolute',
	top: 0,
	left: 0,
	userSelect: 'text',
	cursor: 'text',
	fill: 'transparent',
});

const pageImageStyles = css({
	position: 'absolute',
	top: 0,
	left: 0,
	userSelect: 'none',
});

const pixelatedImageRendering = css({
	imageRendering: 'pixelated',
});

const pageSpinnerStyles = css({
	height: '100%',
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const pageWrapperStyles = css({
	position: 'relative',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: '#fff',
	marginLeft: 'auto',
	marginRight: 'auto',
});

type PageProps = {
	getPageSrc: (pageIndex: number, zoom: number) => Promise<string>;
	maxPageImageZoom: number;
	content?: PageContent;
	fonts: readonly Font[];
	pageIndex: number;
	zoom: number;
	defaultDimensions?: { width: number; height: number };
	onVisible: () => void;
	onLoad?: () => void;
};

type PageViewProps = {
	dimensions?: { width: number; height: number };
	imageSrc?: string;
	content?: PageContent;
	fonts: readonly Font[];
	pageIndex: number;
	zoom: number;
	onImageLoad: (event: React.SyntheticEvent<HTMLImageElement>) => void;
};

const a4Dimensions = { height: 595, width: 842 };

const PageView = forwardRef<HTMLDivElement, PageViewProps>(
	({ dimensions, imageSrc, content, fonts, pageIndex, zoom, onImageLoad }, ref) => {
		const style: Record<string, string> = {};
		if (dimensions) {
			// contents endpoint has loaded so dimensions are available
			style.width = `calc(var(--document-viewer-zoom) * ${dimensions.width}px)`;
			style.height = `calc(var(--document-viewer-zoom) * ${dimensions.height}px)`;
		} else if (imageSrc) {
			// contents endpoint has not loaded dimensions but image is loaded so we can use the image dimensions
			style.width = 'initial';
			style.height = 'initial';
		} else {
			// contents endpoint has not loaded dimensions and image is not loaded so we can use the a4 dimensions
			style.width = `calc(var(--document-viewer-zoom) * ${a4Dimensions.width}px)`;
			style.height = `calc(var(--document-viewer-zoom) * ${a4Dimensions.height}px)`;
		}

		return (
			<div
				ref={ref}
				css={pageWrapperStyles}
				style={style}
				data-testid={`page-${pageIndex}`}
				id={`page-${pageIndex + 1}`}
			>
				{!imageSrc && (
					<div css={pageSpinnerStyles}>
						<Spinner size="large" />
					</div>
				)}
				{imageSrc && (
					<img
						style={style}
						data-testid={`page-${pageIndex}-image`}
						data-zoom={zoom}
						src={imageSrc}
						css={[
							pageImageStyles,
							fg('media-document-viewer-clear-render') ? undefined : pixelatedImageRendering,
						]}
						alt=""
						onLoad={onImageLoad}
					/>
				)}
				{content && (
					<svg
						data-testid={`page-${pageIndex}-text-layer`}
						style={style}
						viewBox={`0 -${content.height} ${content.width} ${content.height}`}
						css={pageSvgStyles}
					>
						{content.lines.map((line, i) => (
							<Line
								dataTestId={`page-${pageIndex}-line-${i}`}
								spans={line.spans}
								rotation={line.r}
								fonts={fonts}
								key={i}
							/>
						))}
						{content.annotations && <Annotations annotations={content.annotations} />}
						{content.links && <DocumentLinks links={content.links} />}
					</svg>
				)}
			</div>
		);
	},
);

export const Page = ({
	getPageSrc,
	maxPageImageZoom,
	content,
	fonts,
	pageIndex,
	zoom,
	defaultDimensions,
	onVisible,
	onLoad,
}: PageProps) => {
	const [imageSrc, setImageSrc] = useState<string | undefined>();
	const { observedRef, isVisibleRef } = useIntersectionObserver(
		{
			root: getDocumentRoot(),
			// this will load the page 3 pages before or after the current page
			// ensuring that the page is loaded before the user scrolls to it
			rootMargin: '300%',
			threshold: 0.1,
		},
		() => {
			onVisible();
			getPageSrc(pageIndex, zoom).then(setImageSrc);
		},
	);

	const [dimensions, setDimensions] = useState<{ width: number; height: number } | undefined>();

	const onImageLoad = useStaticCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
		const image = event.currentTarget;
		onLoad?.();

		if (!content) {
			const zoom = image.dataset.zoom ? Number(image.dataset.zoom) : 1;
			const imageZoom = getImageZoom(zoom, maxPageImageZoom);
			const contentWidth = image.naturalWidth / imageZoom;
			const contentHeight = image.naturalHeight / imageZoom;
			setDimensions({ width: contentWidth, height: contentHeight });
		}
	});

	useEffect(() => {
		if (isVisibleRef.current) {
			getPageSrc(pageIndex, zoom).then(setImageSrc);
		}
	}, [isVisibleRef, pageIndex, zoom, getPageSrc]);

	return (
		<PageView
			ref={observedRef}
			dimensions={content ?? dimensions ?? defaultDimensions}
			imageSrc={imageSrc}
			content={content}
			fonts={fonts}
			pageIndex={pageIndex}
			zoom={zoom}
			onImageLoad={onImageLoad}
		/>
	);
};
