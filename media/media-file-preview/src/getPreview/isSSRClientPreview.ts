import { type MediaFilePreview } from '../types';

export const isSSRClientPreview = (preview: MediaFilePreview): boolean =>
	preview.source === 'ssr-client';
