import React, { useEffect } from 'react';
import { type MediaType, type ImageResizeMode } from '@atlaskit/media-client';
import { MediaImage } from '@atlaskit/media-ui';
import { resizeModeToMediaImageProps } from './resizeModeToMediaImageProps';
import { type CardPreview } from '../../../types';
import { useCurrentValueRef } from '../../../utils/useCurrentValueRef';

export type ImageRendererProps = {
	readonly cardPreview?: CardPreview;
	readonly mediaType: MediaType;
	readonly alt?: string;
	readonly resizeMode?: ImageResizeMode;
	readonly onDisplayImage?: () => void;
	readonly onImageError?: (cardPreview: CardPreview) => void;
	readonly onImageLoad?: (cardPreview: CardPreview) => void;
	readonly nativeLazyLoad?: boolean;
	readonly forceSyncDisplay?: boolean;
};

export const ImageRenderer: React.FC<ImageRendererProps> = ({
	cardPreview,
	alt,
	resizeMode,
	onImageLoad,
	onImageError,
	onDisplayImage,
	mediaType,
	nativeLazyLoad,
	forceSyncDisplay,
}) => {
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
