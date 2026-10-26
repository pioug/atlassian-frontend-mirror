import type { MediaStoreGetFileImageParams } from '@atlaskit/media-client/media-store/types';

/**
 * `ImageViewer` asks for the image at media-client's maximum resolution so it stays
 * sharp when zoomed in.
 */
export const IMAGE_VIEWER_FETCH_MAX_RES = true;

/**
 * Params `ImageViewer` uses to fetch the image it renders.
 *
 * Shared with `preloadMediaViewer` so a warm-up fetches exactly the bytes the
 * viewer will render, and the resulting blob can be handed straight to it. Media
 * cards request the image at their own rendered size, usually with a different
 * `mode`, so a card's image is never a substitute for this one.
 */
export const getImageViewerRequestParams = (
	collectionName?: string,
): MediaStoreGetFileImageParams => ({
	collection: collectionName,
	mode: 'fit',
});
