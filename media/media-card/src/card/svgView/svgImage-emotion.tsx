/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MediaCardError, type SvgPrimaryReason } from '../../errors';
import { calculateSvgDimensions } from './helpers';
import { useResolveSvg, MediaSVGError, type MediaSVGErrorReason } from '@atlaskit/media-svg';
import type { SvgViewProps } from './types';

const getErrorReason = (svgReason: MediaSVGErrorReason): SvgPrimaryReason => {
	switch (svgReason) {
		case 'img-error':
			return 'svg-img-error';
		case 'binary-fetch':
			return 'svg-binary-fetch';
		case 'blob-to-datauri':
			return 'svg-blob-to-datauri';
		default:
			return 'svg-unknown-error';
	}
};

const svgRendererStyles = css({
	objectFit: 'contain',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: 'white', // This background color is for transparency
});

const svgRendererMaxDimensionStyles = css({
	maxWidth: '100%',
	maxHeight: '100%',
});

export const SvgView = ({
	identifier,
	resizeMode,
	onLoad,
	onError,
	wrapperRef,
	alt,
}: SvgViewProps) => {
	const [didSvgRender, setDidSvgRender] = useState<boolean>(false);
	const [svgDimensions, setSvgDimensions] = useState<React.CSSProperties>({});
	const imgRef = useRef<HTMLImageElement>(null);

	const calculateDimensions = useCallback(
		(targetImgElem: HTMLImageElement) => {
			if (!wrapperRef.current || !targetImgElem) {
				return;
			}
			setSvgDimensions(calculateSvgDimensions(targetImgElem, wrapperRef.current, resizeMode));
		},
		[resizeMode, wrapperRef],
	);

	const onSvgLoad = (evt: React.SyntheticEvent<HTMLImageElement, Event>) => {
		calculateDimensions(evt.currentTarget);
		setDidSvgRender(true);
		onLoad?.();
	};

	const onSvgError = (err: MediaSVGError) => {
		const error = new MediaCardError(getErrorReason(err.primaryReason), err.secondaryError);
		onError?.(error);
	};

	useEffect(() => {
		if (imgRef.current) {
			calculateDimensions(imgRef.current);
		}
	}, [imgRef, calculateDimensions]);

	const { svgUrl, source } = useResolveSvg(identifier, onSvgError);
	const { width, height } = svgDimensions;

	return svgUrl && source ? (
		<img
			data-testid={'media-card-svg'}
			data-fileid={identifier.id}
			data-filecollection={identifier.collectionName}
			data-source={source}
			src={svgUrl}
			alt={alt}
			css={[svgRendererStyles, !width && !height && svgRendererMaxDimensionStyles]}
			style={{
				visibility: didSvgRender ? 'visible' : 'hidden',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				...svgDimensions,
			}}
			onLoad={onSvgLoad}
			onError={() => {
				onSvgError(new MediaSVGError('img-error'));
			}}
			ref={imgRef}
		/>
	) : null;
};
