jest.mock('@atlaskit/media-ui', () => {
	const actual = jest.requireActual('@atlaskit/media-ui');
	return {
		...actual,
		fileToDataURI: jest.fn(async (file: File) => `data-uri-for-${file.name}`),
	};
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { smallImage } from '@atlaskit/media-test-helpers';
import { IntlProvider } from 'react-intl-next';
import * as isImageRemoteModule from '../../image-cropper/isImageRemote';
import * as utilModule from '../../util';
import ImageNavigator, { viewport } from '../../image-navigator';
import { errorIcon } from '../../image-navigator/images';

jest.spyOn(isImageRemoteModule, 'isImageRemote').mockImplementation(() => false);
const fileSizeMbSpy = jest.spyOn(utilModule, 'fileSizeMb');
const setScaleSpy = jest.spyOn(viewport, 'setScale');

declare var global: any; // we need define an interface for the Node global object when overwriting global objects, in this case FileReader

class MockFileReader {
	onload: any;
	readAsDataURL() {
		this.onload({ target: this });
	}
}

const mockDropEvent = (file: any): any => ({
	stopPropagation: jest.fn(),
	preventDefault: jest.fn(),
	dataTransfer: {
		files: [file],
	},
});

const droppedImage = new File(['dsjklDFljk'], 'nice-photo.png', {
	type: 'image/png',
});
const droppedNonImage = new File(['not an image'], 'text.txt', { type: 'text/plain' });

const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
	<IntlProvider locale="en">{children}</IntlProvider>
);

const dragZoneImageSelector = 'img#drag-zone-image';
const dragZoneTextSelector = 'div#drag-zone-text';
const paddedBreakSelector = 'p#padded-break';
const imageUploaderSelector = 'div#image-uploader';

describe('Image navigator', () => {
	describe('with an imageSource', () => {
		it('should have image cropper', async () => {
			render(
				<ImageNavigator
					imageSource={smallImage}
					onImageLoaded={jest.fn()}
					onRemoveImage={jest.fn()}
					onImageError={jest.fn()}
					onImageUploaded={jest.fn()}
					isLoading={false}
				/>,
				{ wrapper: AllTheProviders },
			);

			expect(await screen.findByTestId('image-cropper')).toBeInTheDocument();
			const imageCropperMask = await screen.findByTestId('image-cropper-mask');
			expect(imageCropperMask).toHaveAttribute(
				'aria-label',
				'Draggable Image, Ensure your screen reader is not in browse mode. use arrow keys to move & crop the image',
			);

			imageCropperMask.focus();

			fireEvent.keyDown(imageCropperMask, {
				key: 'ArrowUp',
			});
			const element = screen.getByText(
				'You have moved the image from top to bottom, use arrow keys to move & crop the image',
			);

			expect(element).toBeInTheDocument();
		});

		it('should have slider', async () => {
			render(
				<ImageNavigator
					imageSource={smallImage}
					onImageLoaded={jest.fn()}
					onRemoveImage={jest.fn()}
					onImageError={jest.fn()}
					onImageUploaded={jest.fn()}
					isLoading={false}
				/>,
				{ wrapper: AllTheProviders },
			);

			expect(await screen.findByTestId('slider')).toBeInTheDocument();
		});

		it('should change scale in state when slider is moved', async () => {
			const { container } = render(
				<ImageNavigator
					imageSource={smallImage}
					onImageLoaded={jest.fn()}
					onRemoveImage={jest.fn()}
					onImageError={jest.fn()}
					onImageUploaded={jest.fn()}
					isLoading={false}
				/>,
				{ wrapper: AllTheProviders },
			);

			const sliderRange = container.querySelector('input[type=range]');
			expect(sliderRange).toBeInTheDocument();

			sliderRange && fireEvent.change(sliderRange, { target: { value: 20 } });

			expect(setScaleSpy).toHaveBeenCalledWith(20);
		});

		it('should mark state as is dragging when mouse pressed down and not dragging when mouse is unpressed', () => {
			const { container } = render(
				<ImageNavigator
					imageSource={smallImage}
					onImageLoaded={jest.fn()}
					onRemoveImage={jest.fn()}
					onImageError={jest.fn()}
					onImageUploaded={jest.fn()}
					isLoading={false}
				/>,
				{ wrapper: AllTheProviders },
			);

			const imageCropperOverlay = container.querySelector('#drag-overlay');
			expect(imageCropperOverlay).toBeInTheDocument();
			if (!imageCropperOverlay) {
				throw new Error('imageCropperOverlay is not in the document');
			}

			fireEvent.mouseDown(imageCropperOverlay, { screenX: 0, screenY: 0 });

			const selectionBlocker = screen.getByTestId('selection-blocker');
			expect(selectionBlocker).toBeInTheDocument();

			fireEvent.mouseUp(imageCropperOverlay);

			expect(selectionBlocker).not.toBeInTheDocument();
		});

		it('should render loading state when "isLoading" is true when image is scaled', async () => {
			const { container } = render(
				<ImageNavigator
					imageSource={smallImage}
					onImageLoaded={jest.fn()}
					onRemoveImage={jest.fn()}
					onImageError={jest.fn()}
					onImageUploaded={jest.fn()}
					isLoading={true}
				/>,
				{ wrapper: AllTheProviders },
			);

			expect(await screen.findByTestId('spinner')).toBeInTheDocument();
			const dragZone = await screen.findByTestId('dragzone');
			expect(dragZone).toBeInTheDocument();
			expect(dragZone.style.border).toBe('');
			expect(screen.queryByTestId('image-cropper')).not.toBeInTheDocument();
			expect(screen.queryByTestId('upload-button')).not.toBeInTheDocument();
			expect(screen.queryByTestId('upload-button')).not.toBeInTheDocument();
			expect(container.querySelector(dragZoneImageSelector)).not.toBeInTheDocument();
			expect(container.querySelector(dragZoneTextSelector)).not.toBeInTheDocument();
			expect(container.querySelector(paddedBreakSelector)).not.toBeInTheDocument();
		});
	});

	describe('with no imageSource', () => {
		it('should render ImageUploader to allow users to pick an image', () => {
			const { container } = render(
				<ImageNavigator
					onImageLoaded={jest.fn()}
					onRemoveImage={jest.fn()}
					onImageError={jest.fn()}
					onImageUploaded={jest.fn()}
				/>,
				{ wrapper: AllTheProviders },
			);

			expect(container.querySelector(imageUploaderSelector)).toBeInTheDocument();
		});

		describe('when a file is dropped', () => {
			let FileReaderSpy: any;

			beforeEach(() => {
				FileReaderSpy = jest
					.spyOn(global, 'FileReader')
					.mockImplementation(() => new MockFileReader());
			});

			afterEach(() => {
				FileReaderSpy.mockReset();
				FileReaderSpy.mockRestore();
			});

			it('should set data-uri, image itself and orientation into state', async () => {
				const onImageUploaded = jest.fn();
				render(
					<ImageNavigator
						onImageLoaded={jest.fn()}
						onRemoveImage={jest.fn()}
						onImageError={jest.fn()}
						onImageUploaded={onImageUploaded}
					/>,
					{ wrapper: AllTheProviders },
				);
				const dragZone = await screen.findByTestId('dragzone');
				expect(dragZone).toBeInTheDocument();
				fireEvent.drop(dragZone, mockDropEvent(droppedImage));

				const mediaImage = await screen.findByTestId('media-image');
				expect(mediaImage).toBeInTheDocument();
				expect(mediaImage.getAttribute('src')).toBe('data-uri-for-nice-photo.png');
				expect(mediaImage.style.imageOrientation).toBe('from-image');
				// TODO: assert on viewport to have orientation 7
				// expect(viewport.orientation).toBe(7);
				expect(onImageUploaded).toHaveBeenCalledWith(droppedImage);
			});

			it('should not call onImageUploaded when file is not an image', async () => {
				const onImageUploaded = jest.fn();
				render(
					<ImageNavigator
						onImageLoaded={jest.fn()}
						onRemoveImage={jest.fn()}
						onImageError={jest.fn()}
						onImageUploaded={onImageUploaded}
					/>,
					{ wrapper: AllTheProviders },
				);

				const dragZone = await screen.findByTestId('dragzone');
				expect(dragZone).toBeInTheDocument();
				fireEvent.drop(dragZone, mockDropEvent(droppedNonImage));

				expect(onImageUploaded).not.toHaveBeenCalled();
			});

			it('should not allow images greater than the default defined MB limit', async () => {
				fileSizeMbSpy.mockImplementationOnce(() => 10.01);

				const onImageUploaded = jest.fn();
				const onImageError = jest.fn();
				render(
					<ImageNavigator
						onImageLoaded={jest.fn()}
						onRemoveImage={jest.fn()}
						onImageError={onImageError}
						onImageUploaded={onImageUploaded}
					/>,
					{ wrapper: AllTheProviders },
				);

				const dragZone = await screen.findByTestId('dragzone');
				expect(dragZone).toBeInTheDocument();
				fireEvent.drop(dragZone, mockDropEvent(droppedImage));

				expect(onImageError).toHaveBeenCalledWith(
					'Image is too large, must be no larger than 10Mb',
				);
				expect(onImageUploaded).not.toHaveBeenCalled();
			});

			it('should not allow images greater than passed maxImageSize', async () => {
				fileSizeMbSpy.mockImplementationOnce(() => 4.01);

				const onImageUploaded = jest.fn();
				const onImageError = jest.fn();
				render(
					<ImageNavigator
						onImageLoaded={jest.fn()}
						onRemoveImage={jest.fn()}
						onImageError={onImageError}
						onImageUploaded={onImageUploaded}
						maxImageSize={4}
					/>,
					{ wrapper: AllTheProviders },
				);

				const dragZone = await screen.findByTestId('dragzone');
				expect(dragZone).toBeInTheDocument();
				fireEvent.drop(dragZone, mockDropEvent(droppedImage));

				expect(onImageError).toHaveBeenCalledWith('Image is too large, must be no larger than 4Mb');
				expect(onImageUploaded).not.toHaveBeenCalled();
			});
		});
	});

	describe('when an image is removed', () => {
		it('should clear state', async () => {
			const { container } = render(
				<ImageNavigator
					imageSource={smallImage}
					onImageLoaded={jest.fn()}
					onRemoveImage={jest.fn()}
					onImageError={jest.fn()}
					onImageUploaded={jest.fn()}
				/>,
				{ wrapper: AllTheProviders },
			);

			const mediaImage = await screen.findByTestId('media-image');
			expect(mediaImage).toBeInTheDocument();

			const removeButton = container.querySelector('#remove-image-button');
			expect(removeButton).toBeInTheDocument();

			removeButton && fireEvent.click(removeButton);

			waitFor(() => {
				expect(mediaImage).not.toBeInTheDocument();
			});
		});
	});

	describe('when an error state is set', () => {
		it('should display error message and icon', () => {
			const errorMessage = 'Error message!';
			const { container } = render(
				<ImageNavigator
					imageSource={smallImage}
					onImageLoaded={jest.fn()}
					onRemoveImage={jest.fn()}
					errorMessage={errorMessage}
					onImageError={jest.fn()}
					onImageUploaded={jest.fn()}
				/>,
				{ wrapper: AllTheProviders },
			);

			const ellipsed = container.querySelector('.ellipsed-text');
			expect(ellipsed).toBeInTheDocument();
			// React 18 & React 16 discrepancies
			expect(['...message!', errorMessage].includes(ellipsed?.textContent || '')).toBe(true);
			expect(container.querySelector(dragZoneImageSelector)?.getAttribute('src')).toBe(errorIcon);
			expect(screen.queryByTestId('image-cropper')).not.toBeInTheDocument();
		});
	});
});
