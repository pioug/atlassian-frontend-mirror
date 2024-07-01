import { Rectangle, type Camera } from '@atlaskit/media-ui';
import { ZoomLevel } from '../../domain/zoomLevel';

export const clientRectangle = (el: HTMLElement): Rectangle => {
	const { clientWidth, clientHeight } = el;
	return new Rectangle(clientWidth, clientHeight);
};

export const naturalSizeRectangle = (el: HTMLImageElement): Rectangle => {
	// Firefox & Safari can't always read the "natural" dimensions correctly.
	// When these are undefined or zero, we replace them with the rendered values
	const { naturalWidth, naturalHeight, width, height } = el;
	return new Rectangle(naturalWidth || width, naturalHeight || height);
};

export function zoomLevelAfterResize(
	newCamera: Camera,
	oldCamera: Camera,
	oldZoomLevel: ZoomLevel,
) {
	const isImgScaledToFit = oldZoomLevel.value === oldCamera.scaleDownToFit;
	const zoomLevelToRefit = new ZoomLevel(newCamera.scaleDownToFit);
	return isImgScaledToFit ? zoomLevelToRefit : oldZoomLevel;
}
