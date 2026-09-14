import { type MediaType } from '@atlaskit/media-common';

export const isPreviewableType = (type: MediaType): boolean => {
	const defaultPreviewableTypes = ['audio', 'video', 'image', 'doc'];
	return defaultPreviewableTypes.indexOf(type) > -1;
};
