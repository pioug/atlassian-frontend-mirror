import { type MediaFilePreview, type MediaFilePreviewSource } from '../types';

export const isSSRPreview = (preview: MediaFilePreview): boolean => {
	const ssrClientSources: MediaFilePreviewSource[] = ['ssr-client', 'ssr-server', 'ssr-data'];
	return ssrClientSources.includes(preview.source);
};
