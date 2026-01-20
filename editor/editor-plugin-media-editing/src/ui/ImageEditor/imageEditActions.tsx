import type { CropperRef } from './Cropper';

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
	const rotateLeft = async () => {
		const canvas = cropperRef.current?.getCanvas();
		if (!canvas) {
			return;
		}

		const selectionEl = canvas.querySelector('cropper-selection');
		if (selectionEl instanceof HTMLElement) {
			selectionEl.style.opacity = '0';
		}

		await rotateAndFit(-90, cropperRef);

		cropperRef.current?.fitStencilToImage();
		if (selectionEl instanceof HTMLElement) {
			selectionEl.style.opacity = '1';
		}
	};

	const rotateRight = async () => {
		const canvas = cropperRef.current?.getCanvas();
		if (!canvas) {
			return;
		}

		const selectionEl = canvas.querySelector('cropper-selection');
		if (selectionEl instanceof HTMLElement) {
			selectionEl.style.opacity = '0';
		}

		await rotateAndFit(90, cropperRef);

		cropperRef.current?.fitStencilToImage();
		if (selectionEl instanceof HTMLElement) {
			selectionEl.style.opacity = '1';
		}
	};

	return {
		rotateLeft,
		rotateRight,
	};
};

async function rotateAndFit(deg: number, cropperRef: React.RefObject<CropperRef>) {
	const canvas = cropperRef.current?.getCanvas();
	const image = cropperRef.current?.getImage();

	if (!image || !canvas) {
		return;
	}

	// Wait for the DOM/Matrix to update
	await new Promise(requestAnimationFrame);

	// Get Dimensions
	const containerRect = canvas.getBoundingClientRect();
	const imgRect = image.getBoundingClientRect();

	const naturalWidth = imgRect.width;
	const naturalHeight = imgRect.height;

	image.$rotate(`${deg}deg`);

	// Swap dimensions after each rotation
	const effectiveWidth = naturalHeight;
	const effectiveHeight = naturalWidth;

	const scaleX = containerRect.width / effectiveWidth;
	const scaleY = containerRect.height / effectiveHeight;
	const minScale = Math.min(scaleX, scaleY);

	image.$scale(minScale);
}
