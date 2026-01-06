import type { CropperRef } from './Cropper';

export const useImageFlip = (cropperRef: React.RefObject<CropperRef>) => {

	const flipHorizontal = () => {
		const image = cropperRef.current?.getImage();
		if (image?.$scale) {
			image.$scale(-1, 1)
		}
	};

	const flipVertical = () => {
		const image = cropperRef.current?.getImage();
		if (image?.$scale) {
			image.$scale(1, -1)
		}
	};

	return {
		flipHorizontal,
		flipVertical,
	};
}; 
