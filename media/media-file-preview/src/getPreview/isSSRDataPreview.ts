import { type MediaFilePreview } from '../types';

export const isSSRDataPreview = (preview: MediaFilePreview): boolean =>
	preview.source === 'ssr-data';
