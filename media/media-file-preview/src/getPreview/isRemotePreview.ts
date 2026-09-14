import { type MediaFilePreview, type MediaFilePreviewSource } from '../types';

export const isRemotePreview = (preview: MediaFilePreview): boolean => {
	const remoteSources: MediaFilePreviewSource[] = ['remote', 'cache-remote'];
	return remoteSources.includes(preview.source);
};
