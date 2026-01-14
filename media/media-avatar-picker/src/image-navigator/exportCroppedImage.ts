import { type Viewport, renderViewport } from '../viewport';

export const exportCroppedImage = (
	viewport: Viewport,
	imageElement?: HTMLImageElement,
	outputSize?: number,
): string => {
	if (imageElement) {
		const canvas = renderViewport(
			viewport,
			imageElement,
			document.createElement('canvas'),
			outputSize,
		);
		if (canvas) {
			return canvas.toDataURL();
		}
	}
	return '';
};
