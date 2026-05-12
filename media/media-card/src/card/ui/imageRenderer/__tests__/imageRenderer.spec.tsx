import React from 'react';
import { render, screen, fireEvent } from '@atlassian/testing-library';
import { ImageRenderer } from '../imageRenderer';
import { resizeModeToMediaImageProps } from '../resizeModeToMediaImageProps';
import { type MediaType, type FileIdentifier } from '@atlaskit/media-client';

const nonImageMediaTypes: MediaType[] = ['video', 'audio', 'doc', 'unknown'];

const wrapperRef = { current: null };
const identifier: FileIdentifier = { id: '123', collectionName: 'test', mediaItemType: 'file' };

const cardPreview = {
	dataURI: 'some-data',
	orientation: 6,
	source: 'remote',
} as const;

describe('ImageRenderer', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<ImageRenderer
				cardPreview={cardPreview}
				mediaType={'image'}
				alt="a11y test image"
				wrapperRef={wrapperRef}
				identifier={identifier}
			/>,
		);
		await expect(container).toBeAccessible();
	});

	it('should render MediaImage with props', () => {
		const alt = 'this is a test';
		const onImageLoad = jest.fn();
		const onImageError = jest.fn();
		render(
			<ImageRenderer
				cardPreview={cardPreview}
				mediaType={'image'}
				resizeMode={'stretchy-fit'}
				alt={alt}
				onImageLoad={onImageLoad}
				onImageError={onImageError}
				wrapperRef={wrapperRef}
				identifier={identifier}
			/>,
		);

		const mediaImage = screen.getByTestId('media-image');
		expect(mediaImage).toBeInTheDocument();
		expect(mediaImage).toHaveAttribute('src', cardPreview.dataURI);
		expect(mediaImage).toHaveAttribute('alt', alt);
	});

	it('should pass card preview to image load & error callbacks', () => {
		const onImageLoad = jest.fn();
		const onImageError = jest.fn();
		render(
			<ImageRenderer
				cardPreview={cardPreview}
				mediaType={'image'}
				onImageLoad={onImageLoad}
				onImageError={onImageError}
				wrapperRef={wrapperRef}
				identifier={identifier}
			/>,
		);

		const mediaImage = screen.getByTestId('media-image');
		fireEvent.load(mediaImage);
		expect(onImageLoad).toBeCalledWith(cardPreview);

		fireEvent.error(mediaImage);
		expect(onImageError).toBeCalledWith(cardPreview);
	});

	describe('Lazy Load', () => {
		it('should pass loading=lazy to MediaImage when nativeLazyLoad is true', () => {
			render(
				<ImageRenderer
					mediaType={'image'}
					cardPreview={cardPreview}
					nativeLazyLoad={true}
					wrapperRef={wrapperRef}
					identifier={identifier}
				/>,
			);
			expect(screen.getByTestId('media-image')).toHaveAttribute('loading', 'lazy');
		});

		it('should not pass loading=lazy to MediaImage when nativeLazyLoad is false', () => {
			render(
				<ImageRenderer
					mediaType={'image'}
					cardPreview={cardPreview}
					nativeLazyLoad={false}
					wrapperRef={wrapperRef}
					identifier={identifier}
				/>,
			);
			expect(screen.getByTestId('media-image')).not.toHaveAttribute('loading');
		});

		it('should not pass loading=lazy to MediaImage when nativeLazyLoad is undefined', () => {
			render(
				<ImageRenderer
					mediaType={'image'}
					cardPreview={cardPreview}
					wrapperRef={wrapperRef}
					identifier={identifier}
				/>,
			);
			expect(screen.getByTestId('media-image')).not.toHaveAttribute('loading');
		});
	});

	it('should convert resizeMode to crop and stretch MediaImage props', () => {
		expect(resizeModeToMediaImageProps(undefined)).toMatchObject({
			crop: false,
			stretch: false,
		});
		expect(resizeModeToMediaImageProps('fit')).toMatchObject({
			crop: false,
			stretch: false,
		});
		expect(resizeModeToMediaImageProps('full-fit')).toMatchObject({
			crop: false,
			stretch: false,
		});
		expect(resizeModeToMediaImageProps('stretchy-fit')).toMatchObject({
			crop: false,
			stretch: true,
		});
		expect(resizeModeToMediaImageProps('crop')).toMatchObject({
			crop: true,
			stretch: false,
		});
	});

	it('should call onDisplayImage once', () => {
		const onDisplayImage = jest.fn();
		render(
			<ImageRenderer
				mediaType="image"
				cardPreview={cardPreview}
				onDisplayImage={onDisplayImage}
				wrapperRef={wrapperRef}
				identifier={identifier}
			/>,
		);
		expect(onDisplayImage).toHaveBeenCalledTimes(1);
	});

	it('should pass forceSyncDisplay to MediaImage', () => {
		const { rerender } = render(
			<ImageRenderer
				mediaType={'image'}
				cardPreview={cardPreview}
				wrapperRef={wrapperRef}
				identifier={identifier}
			/>,
		);
		// Without forceSyncDisplay the image is hidden (display:none) until load event fires
		// With forceSyncDisplay=true the image should be visible
		rerender(
			<ImageRenderer
				mediaType={'image'}
				cardPreview={cardPreview}
				forceSyncDisplay={true}
				wrapperRef={wrapperRef}
				identifier={identifier}
			/>,
		);
		const mediaImage = screen.getByTestId('media-image');
		expect(mediaImage).toBeInTheDocument();
		expect(mediaImage.style.display).not.toBe('none');
	});

	it.each(nonImageMediaTypes)(
		`should not call onDisplayImage when mediaType is %s`,
		(mediaType) => {
			const onDisplayImage = jest.fn();
			render(
				<ImageRenderer
					mediaType={mediaType}
					cardPreview={cardPreview}
					onDisplayImage={onDisplayImage}
					wrapperRef={wrapperRef}
					identifier={identifier}
				/>,
			);
			expect(onDisplayImage).toHaveBeenCalledTimes(0);
		},
	);
});
