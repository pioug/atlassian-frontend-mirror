import type { CropperRef } from './Cropper';

export type AspectRatioOption =
	| 'original'
	| 'custom'
	| 'square'
	| 'circle'
	| 'landscape'
	| 'portrait'
	| 'wide';

interface AspectRatioValue {
	x: number;
	y: number;
}

const ASPECT_RATIOS: Record<AspectRatioOption, AspectRatioValue | null> = {
	original: null,
	custom: null,
	square: { x: 1, y: 1 },
	circle: { x: 1, y: 1 },
	landscape: { x: 4, y: 3 },
	portrait: { x: 3, y: 4 },
	wide: { x: 16, y: 9 },
};

export const useImageAspectRatio = () => {
	// no ratio = undefined = custom cropping selection
	const getAspectRatioValue = (ratio: AspectRatioOption): number | undefined => {
		const aspectRatioValue = ASPECT_RATIOS[ratio];
		if (aspectRatioValue) {
			return aspectRatioValue.x / aspectRatioValue.y;
		}
		return undefined;
	};

	return {
		getAspectRatioValue,
	};
};

export const useImageFlip = (cropperRef: React.RefObject<CropperRef>) => {
	const flipHorizontal = () => {
		const image = cropperRef.current?.getImage();
		if (image?.$scale) {
			image.$scale(-1, 1);
		}
	};

	const flipVertical = () => {
		const image = cropperRef.current?.getImage();
		if (image?.$scale) {
			image.$scale(1, -1);
		}
	};

	return {
		flipHorizontal,
		flipVertical,
	};
};

export const useImageRotate = (cropperRef: React.RefObject<CropperRef>) => {
	const rotateRight = () => {
		const canvas = cropperRef.current?.getCanvas();
		const image = cropperRef.current?.getImage();
		if (!canvas || !image) {
			return;
		}

		const selectionEl = canvas.querySelector('cropper-selection');
		if (selectionEl instanceof HTMLElement) {
			selectionEl.style.opacity = '0';
		}

		image.$rotate('90deg');
		image.$center('contain');

		cropperRef.current?.fitStencilToImage();
		if (selectionEl instanceof HTMLElement) {
			selectionEl.style.opacity = '1';
		}
	};

	return {
		rotateRight,
	};
};
