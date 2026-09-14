import { Rectangle } from '@atlaskit/media-ui/rectangle';

export const naturalSizeRectangle = (el: HTMLImageElement): Rectangle => {
	// Firefox & Safari can't always read the "natural" dimensions correctly.
	// When these are undefined or zero, we replace them with the rendered values
	const { naturalWidth, naturalHeight, width, height } = el;
	return new Rectangle(naturalWidth || width, naturalHeight || height);
};
