import type { FileItem } from './item-viewer';

// Consts
export const isExternalImageItem = (fileItem: FileItem): fileItem is 'external-image' =>
	fileItem === 'external-image';
