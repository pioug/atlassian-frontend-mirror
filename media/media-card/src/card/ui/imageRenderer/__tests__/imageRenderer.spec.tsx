import React from 'react';
import { mount } from 'enzyme';
import { ImageRenderer } from '../imageRenderer';
import { resizeModeToMediaImageProps } from '../resizeModeToMediaImageProps';
import { type MediaType } from '@atlaskit/media-client';
import { MediaImage } from '@atlaskit/media-ui';

const nonImageMediaTypes: MediaType[] = ['video', 'audio', 'doc', 'unknown'];

const cardPreview = {
	dataURI: 'some-data',
	orientation: 6,
	source: 'remote',
} as const;

describe('ImageRenderer', () => {
	it('should render MediaImage with props', () => {
		const mediaType = 'image';
		const resizeMode = 'stretchy-fit';
		const alt = 'this is a test';
		const onImageLoad = jest.fn();
		const onImageError = jest.fn();
		const component = mount(
			<ImageRenderer
				cardPreview={cardPreview}
				mediaType={mediaType}
				resizeMode={resizeMode}
				alt={alt}
				onImageLoad={onImageLoad}
				onImageError={onImageError}
			/>,
		);

		const mediaImage = component.find(MediaImage);
		expect(mediaImage).toHaveLength(1);
		expect(mediaImage.props()).toMatchObject({
			dataURI: cardPreview.dataURI,
			previewOrientation: cardPreview.orientation,
			alt,
			onImageLoad: expect.any(Function),
			onImageError: expect.any(Function),
			...resizeModeToMediaImageProps(resizeMode),
		});
	});

	it('should pass card preview to image load & error callbacks', () => {
		const mediaType = 'image';
		const onImageLoad = jest.fn();
		const onImageError = jest.fn();
		const component = mount(
			<ImageRenderer
				cardPreview={cardPreview}
				mediaType={mediaType}
				onImageLoad={onImageLoad}
				onImageError={onImageError}
			/>,
		);

		const mediaImage = component.find(MediaImage);
		expect(mediaImage).toHaveLength(1);

		const onload = mediaImage.prop('onImageLoad');
		expect(onload).toBeInstanceOf(Function);
		(onload as unknown as Function)();
		expect(onImageLoad).toBeCalledWith(cardPreview);

		const onerror = mediaImage.prop('onImageError');
		expect(onerror).toBeInstanceOf(Function);
		(onerror as unknown as Function)();
		expect(onImageError).toBeCalledWith(cardPreview);
	});

	describe('Lazy Load', () => {
		it('should pass loading=lazy to MediaImage when nativeLazyLoad is true', () => {
			const component = mount(
				<ImageRenderer mediaType={'image'} cardPreview={cardPreview} nativeLazyLoad={true} />,
			);
			const mediaImage = component.find(MediaImage);
			expect(mediaImage).toHaveLength(1);
			expect(mediaImage.prop('loading')).toBe('lazy');
		});

		it('should not pass loading=lazy to MediaImage when nativeLazyLoad is false', () => {
			const component = mount(
				<ImageRenderer mediaType={'image'} cardPreview={cardPreview} nativeLazyLoad={false} />,
			);
			const mediaImage = component.find(MediaImage);
			expect(mediaImage).toHaveLength(1);
			expect(mediaImage.prop('loading')).toBe(undefined);
		});

		it('should not pass loading=lazy to MediaImage when nativeLazyLoad is undefined', () => {
			const component = mount(<ImageRenderer mediaType={'image'} cardPreview={cardPreview} />);
			const mediaImage = component.find(MediaImage);
			expect(mediaImage).toHaveLength(1);
			expect(mediaImage.prop('loading')).toBe(undefined);
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
		const card = mount(
			<ImageRenderer mediaType="image" cardPreview={cardPreview} onDisplayImage={onDisplayImage} />,
		);
		expect(onDisplayImage).toHaveBeenCalledTimes(1);
		card.update();
		expect(onDisplayImage).toHaveBeenCalledTimes(1);
	});

	it('should pass forceSyncDisplay to MediaImage', () => {
		const component = mount(<ImageRenderer mediaType={'image'} cardPreview={cardPreview} />);
		const mediaImage = component.find(MediaImage);
		expect(mediaImage).toHaveLength(1);
		expect(mediaImage.prop('forceSyncDisplay')).toBe(undefined);

		component.setProps({ forceSyncDisplay: true });
		expect(component.find(MediaImage).prop('forceSyncDisplay')).toBe(true);
	});

	it.each(nonImageMediaTypes)(
		`should not call onDisplayImage when mediaType is %s`,
		(mediaType) => {
			const onDisplayImage = jest.fn();
			mount(
				<ImageRenderer
					mediaType={mediaType}
					cardPreview={cardPreview}
					onDisplayImage={onDisplayImage}
				/>,
			);
			expect(onDisplayImage).toHaveBeenCalledTimes(0);
		},
	);
});
