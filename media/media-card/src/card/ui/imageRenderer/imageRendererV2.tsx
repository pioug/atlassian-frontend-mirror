/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { calculateDimensions, calculateInitialDimensions } from './helpers';
import type { ImageRendererProps } from './types';
import { useCurrentValueRef } from '../../../utils/useCurrentValueRef';
import { ImageRendererWrapper } from './wrapper';
import { isFileIdentifier } from '@atlaskit/media-client';
import { fg } from '@atlaskit/platform-feature-flags';
import UFOCustomData from '@atlaskit/react-ufo/custom-data';
import { useInteractionContext } from '@atlaskit/react-ufo/interaction-context';
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
	const ufoContext = useInteractionContext();

	useEffect(() => {
		if (mediaType === 'image') {
			onDisplayImageRef.current?.();
		}
	}, [mediaType, onDisplayImageRef]);

	const [didRender, setDidRender] = useState<boolean>(false);
	const [resolvedDimensions, setResolvedDimensions] = useState<React.CSSProperties>(
		calculateInitialDimensions(resizeMode),
	);

	useLayoutEffect(() => {
		if (!didRender && fg('platfrom_close_blindspot_for_img')) {
			return ufoContext?.hold('img-loading');
		}
	}, [didRender, ufoContext]);

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
			<UFOCustomData data={{ hasMediaComponent: true }} />
			<img
				ref={imgRef}
				data-testid={testId}
				data-fileid={isFileIdentifier(identifier) ? identifier.id : null}
				data-filecollection={isFileIdentifier(identifier) ? identifier.collectionName : null}
				data-resizemode={resizeMode}
				data-source={cardPreview.source}
				src={cardPreview.dataURI}
				srcSet={cardPreview.srcSet}
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
