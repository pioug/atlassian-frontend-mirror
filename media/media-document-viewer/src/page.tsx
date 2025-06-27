/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useEffect, useState } from 'react';

import { css } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import { useStaticCallback } from '@atlaskit/media-common';

import { Annotations } from './annotations';
import { DocumentLinks } from './documentLinks';
import { type Font, type PageContent, type Span } from './types';
import { getDocumentRoot } from './utils/getDocumentRoot';
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
	imageRendering: 'pixelated',
});

const pageWrapperStyles = css({
	position: 'relative',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: '#fff',
});

type PageProps = {
	getPageSrc: (pageIndex: number, zoom: number) => Promise<string>;
	content?: PageContent;
	fonts: readonly Font[];
	pageIndex: number;
	zoom: number;
	defaultDimensions?: { width: number; height: number };
	onVisible: () => void;
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

const PageView = forwardRef<HTMLDivElement, PageViewProps>(
	({ dimensions, imageSrc, content, fonts, pageIndex, zoom, onImageLoad }, ref) => {
		const style = {
			width: dimensions ? `calc(var(--document-viewer-zoom) * ${dimensions.width}px)` : 'initial',
			height: dimensions ? `calc(var(--document-viewer-zoom) * ${dimensions.height}px)` : 'initial',
		};

		return (
			<div
				ref={ref}
				css={pageWrapperStyles}
				style={style}
				data-testid={`page-${pageIndex}`}
				id={`page-${pageIndex + 1}`}
			>
				{imageSrc && (
					<img
						style={style}
						data-testid={`page-${pageIndex}-image`}
						data-zoom={zoom}
						src={imageSrc}
						css={pageImageStyles}
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
	content,
	fonts,
	pageIndex,
	zoom,
	defaultDimensions,
	onVisible,
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

		if (!content) {
			const zoom = image.dataset.zoom ? Number(image.dataset.zoom) : 1;
			setDimensions({ width: image.width / zoom, height: image.height / zoom });
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
