import { type Preview, type ImagePreview } from '../types';

export const isImagePreview = (preview: Preview): preview is ImagePreview =>
	!!(preview as ImagePreview).dimensions;
