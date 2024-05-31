import type { ImageUploadPluginReferenceEvent } from '../types';

export type InsertedImageProperties = {
	src?: string;
	alt?: string;
	title?: string;
};

export type ImageUploadProvider = (
	e: ImageUploadPluginReferenceEvent | undefined,
	insertImageFn: (props: InsertedImageProperties) => void,
) => void;
