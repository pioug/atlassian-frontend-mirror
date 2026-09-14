import { type MediaType } from '@atlaskit/media-client';

/**
 * This method tells the support for the media
 * types covered in getCardPreviewFromFilePreview
 */
export const isSupportedLocalPreview = (mediaType?: MediaType): mediaType is 'video' | 'image' =>
	mediaType === 'image' || mediaType === 'video';
