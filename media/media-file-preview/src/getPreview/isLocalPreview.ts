import { type MediaFilePreview, type MediaFilePreviewSource } from '../types';

export const isLocalPreview = (preview: MediaFilePreview): boolean => {
	const localSources: MediaFilePreviewSource[] = ['local', 'cache-local'];
	return localSources.includes(preview.source);
};
