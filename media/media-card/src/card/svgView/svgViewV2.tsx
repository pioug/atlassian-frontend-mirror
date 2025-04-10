/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useMemo } from 'react';
import { MediaCardError, type SvgPrimaryReason } from '../../errors';

import { useResolveSvg, MediaSVGError, type MediaSVGErrorReason } from '@atlaskit/media-svg';
import { SvgViewProps } from './types';
import { ImageRenderer } from '../ui/imageRenderer/imageRendererV2';

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

export const SvgView = ({
	identifier,
	resizeMode,
	onLoad,
	onError,
	wrapperRef,
	alt,
}: SvgViewProps) => {
	const onSvgError = (err: MediaSVGError) => {
		const error = new MediaCardError(getErrorReason(err.primaryReason), err.secondaryError);
		onError?.(error);
	};

	const { svgUrl, source } = useResolveSvg(identifier, onSvgError);

	const cardPreview = useMemo(
		() => (svgUrl && source ? { dataURI: svgUrl, source } : undefined),
		[svgUrl, source],
	);

	return cardPreview ? (
		<ImageRenderer
			testId="media-card-svg"
			identifier={identifier}
			cardPreview={cardPreview}
			alt={alt}
			resizeMode={resizeMode}
			onImageLoad={onLoad}
			onImageError={() => {
				onSvgError(new MediaSVGError('img-error'));
			}}
			wrapperRef={wrapperRef}
			mediaType="image"
			useWhiteBackground
		/>
	) : null;
};
