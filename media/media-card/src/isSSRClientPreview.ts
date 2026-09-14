/**
 * Entry Point: @atlaskit/media-card/types
 */

import type { CardPreview, CardPreviewSource } from './types';

export const isSSRClientPreview = (preview: CardPreview): boolean => {
	const ssrClientSources: CardPreviewSource[] = ['ssr-client', 'cache-ssr-client'];
	return ssrClientSources.includes(preview.source);
};
