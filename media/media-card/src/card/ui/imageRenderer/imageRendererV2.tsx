/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import React, { useState, useRef, useEffect } from 'react';
import { calculateDimensions, calculateInitialDimensions } from './helpers';
import { ImageRendererProps } from './types';
import { useCurrentValueRef } from '../../../utils/useCurrentValueRef';
import { ImageRendererWrapper } from './wrapper';
import { isFileIdentifier } from '@atlaskit/media-client';
const baseStyles = css({
	objectFit: 'contain',
});

const backgroundStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: 'white', // This background color is for SVG transparency
});

export const ImageRenderer = ({
	cardPreview,
	alt = '',
	resizeMode = 'crop',
	onImageLoad,
	onImageError,
	onDisplayImage,
	mediaType,
	nativeLazyLoad,
	forceSyncDisplay,
	identifier,
	wrapperRef,
	useWhiteBackground,
	testId,
}: ImageRendererProps) => {
	const onDisplayImageRef = useCurrentValueRef(onDisplayImage);
	useEffect(() => {
		if (mediaType === 'image') {
			onDisplayImageRef.current?.();
		}
	}, [mediaType, onDisplayImageRef]);

	const [didRender, setDidRender] = useState<boolean>(false);
	const [resolvedDimensions, setResolvedDimensions] = useState<React.CSSProperties>(
		calculateInitialDimensions(resizeMode),
	);
	const imgRef = useRef<HTMLImageElement>(null);

	const onLoad = (evt: React.SyntheticEvent<HTMLImageElement, Event>) => {
		wrapperRef.current &&
			setResolvedDimensions(calculateDimensions(evt.currentTarget, wrapperRef.current, resizeMode));
		setDidRender(true);
		cardPreview && onImageLoad?.(cardPreview);
	};

	const onError = () => {
		onImageError && cardPreview && onImageError(cardPreview);
	};

	useEffect(() => {
		if (imgRef.current && wrapperRef.current && imgRef.current) {
			setResolvedDimensions(calculateDimensions(imgRef.current, wrapperRef.current, resizeMode));
		}
	}, [resizeMode, wrapperRef]);

	return cardPreview ? (
		<ImageRendererWrapper>
			<img
				ref={imgRef}
				data-testid={testId}
				data-fileid={isFileIdentifier(identifier) ? identifier.id : null}
				data-filecollection={isFileIdentifier(identifier) ? identifier.collectionName : null}
				data-resizemode={resizeMode}
				data-source={cardPreview.source}
				src={cardPreview.dataURI}
				alt={alt}
				onLoad={onLoad}
				onError={onError}
				loading={nativeLazyLoad ? 'lazy' : undefined}
				css={[baseStyles, useWhiteBackground && backgroundStyles]}
				style={{
					visibility: didRender || forceSyncDisplay ? 'visible' : 'hidden',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					...resolvedDimensions,
				}}
			/>
		</ImageRendererWrapper>
	) : null;
};
