import React from 'react';
import ImageCropper, { type ImageCropperProp } from '../../image-cropper';
import { ERROR } from '../../avatar-picker-dialog';
import { smallImage, renderWithIntl } from '@atlaskit/media-test-helpers';
import { fireEvent } from '@testing-library/react';

const imageWidth = 600;
const imageHeight = 400;
const imageSource = smallImage;
const top = 10;
const left = 20;
const containerSize = 400;

describe('Image cropper', () => {
	const createComponent = (props = {}) => {
		const onDragStartedSpy = jest.fn();
		const onImageLoadedSpy = jest.fn();
		const onLoadSpy = jest.fn();
		const onRemoveImageSpy = jest.fn();
		const onImageErrorSpy = jest.fn();

		const allProps: ImageCropperProp = {
			imageSource,
			containerSize,
			top,
			left,
			onDragStarted: onDragStartedSpy,
			onImageLoaded: onImageLoadedSpy,
			onRemoveImage: onRemoveImageSpy,
			onImageError: onImageErrorSpy,
			imageOrientation: 1,
			...props,
		};
		const { container } = renderWithIntl(<ImageCropper {...allProps} />);
		const img = container.querySelector('img');
		const imgContainer = container.querySelector('#image-container');
		const containerEl = container.querySelector('#container');
		const removeImageButton = container.querySelector('#remove-image-button');
		const dragOverlay = container.querySelector('#drag-overlay');

		return {
			onDragStartedSpy,
			onImageLoadedSpy,
			onLoadSpy,
			onRemoveImageSpy,
			onImageErrorSpy,
			container,
			img,
			imgContainer,
			containerEl,
			removeImageButton,
			dragOverlay,
		};
	};

	describe('with image width', () => {
		describe("image tag and it's container", () => {
			it('should have defined source', () => {
				const { img } = createComponent({ imageWidth });

				expect(img?.getAttribute('src')).toBe(imageSource);
			});

			it('should have defined position', () => {
				const { img, imgContainer } = createComponent({ imageWidth });

				expect(imgContainer).toBeInTheDocument();
				expect(getComputedStyle(imgContainer!)).toMatchObject({
					top: `${top}px`,
					left: `${left}px`,
				});

				expect(img?.style.height).toBe('100%');
			});
		});

		describe('container', () => {
			it('should have defined size', () => {
				const { containerEl } = createComponent({ imageWidth });

				expect(containerEl).toBeInTheDocument();
				expect(getComputedStyle(containerEl!)).toMatchObject({
					width: `${containerSize}px`,
					height: `${containerSize}px`,
				});
			});
		});

		it('should call onDragging callback', () => {
			const { dragOverlay, onDragStartedSpy } = createComponent({ imageWidth });

			expect(dragOverlay).toBeInTheDocument();
			fireEvent.mouseDown(dragOverlay!);
			expect(onDragStartedSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('without image width', () => {
		it('should call onImageLoaded when image is loaded', () => {
			const { img, onImageLoadedSpy } = createComponent({ imageWidth });

			expect(img).toBeInTheDocument();
			// Set natural dimensions (browser sets these on load)
			Object.defineProperty(img!, 'naturalWidth', { value: imageWidth });
			Object.defineProperty(img!, 'naturalHeight', { value: imageHeight });
			// MediaImage calls onImageLoad on img load event - fire it to trigger the callback
			fireEvent.load(img!);

			expect(onImageLoadedSpy).toHaveBeenCalledTimes(1);
			expect(onImageLoadedSpy).toHaveBeenCalledWith(img);
		});
	});

	describe('when an image is removed', () => {
		it('should call onRemoveImage prop when cross clicked', () => {
			const { removeImageButton, onRemoveImageSpy } = createComponent({
				imageWidth,
			});

			expect(removeImageButton).toBeInTheDocument();
			fireEvent.click(removeImageButton!);
			expect(onRemoveImageSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('image errors', () => {
		const badImageURI = 'data:image/png;base64,bm90IGFuIGltYWdl=='; // === base64 data = btoa("not an image")

		it('should call onImageError prop with url error message when bad image url given', () => {
			const { onImageErrorSpy } = createComponent({
				imageSource: 'some-bad-url',
			});
			expect(onImageErrorSpy).toHaveBeenCalledTimes(1);
			expect(onImageErrorSpy).toHaveBeenCalledWith(ERROR.URL.defaultMessage);
		});

		it('should call onImageError prop with bad format message when bad image url given', () => {
			const { img, onImageErrorSpy } = createComponent({
				imageSource: badImageURI,
			});

			expect(img).toBeInTheDocument();
			fireEvent.error(img!);

			expect(onImageErrorSpy).toHaveBeenCalledTimes(1);
			expect(onImageErrorSpy).toHaveBeenCalledWith(ERROR.FORMAT.defaultMessage);
		});
	});
});
