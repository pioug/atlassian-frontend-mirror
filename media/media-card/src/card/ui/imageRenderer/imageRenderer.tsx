import React, { useEffect } from 'react';
import { MediaImage } from '@atlaskit/media-ui';
import { resizeModeToMediaImageProps } from './resizeModeToMediaImageProps';
import { useCurrentValueRef } from '../../../utils/useCurrentValueRef';
import type { ImageRendererProps } from './types';

export const ImageRenderer = ({
	cardPreview,
	alt,
	resizeMode,
	onImageLoad,
	onImageError,
	onDisplayImage,
	mediaType,
	nativeLazyLoad,
	forceSyncDisplay,
}: ImageRendererProps): React.JSX.Element => {
	const onDisplayImageRef = useCurrentValueRef(onDisplayImage);
	useEffect(() => {
		// TODO: trigger accordingly with the succeeded event. This could be a breaking change
		if (mediaType === 'image') {
			onDisplayImageRef.current?.();
		}
	}, [mediaType, onDisplayImageRef]);

	const onLoad = () => {
		onImageLoad && cardPreview && onImageLoad(cardPreview);
	};

	const onError = () => {
		onImageError && cardPreview && onImageError(cardPreview);
	};

	return (
		<MediaImage
			dataURI={cardPreview?.dataURI}
			alt={alt}
			previewOrientation={cardPreview?.orientation}
			onImageLoad={onLoad}
			onImageError={onError}
			loading={nativeLazyLoad ? 'lazy' : undefined}
			forceSyncDisplay={forceSyncDisplay}
			{...resizeModeToMediaImageProps(resizeMode)}
		/>
	);
};
