/**
 * Entry Point: @atlaskit/media-card/types
 */

import type { CardPreview, CardPreviewSource } from './types';

export const isSSRServerPreview = (preview: CardPreview): boolean => {
	const ssrClientSources: CardPreviewSource[] = ['ssr-server', 'cache-ssr-server'];
	return ssrClientSources.includes(preview.source);
};
