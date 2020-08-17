import React from 'react';
import ImageCropper, { ImageCropperProp } from '../../image-cropper';
import { ERROR } from '../../avatar-picker-dialog';
import {
  Container,
  DragOverlay,
  ImageContainer,
  RemoveImageButton,
} from '../../image-cropper/styled';
import { smallImage, mountWithIntlContext } from '@atlaskit/media-test-helpers';
import { MediaImage } from '@atlaskit/media-ui';

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
    const component = mountWithIntlContext<ImageCropperProp, {}>(
      <ImageCropper {...allProps} />,
    );
    const img = component.find('img');
    const imgContainer = component.find(ImageContainer);
    const container = component.find(Container);
    const removeImageButton = component.find(RemoveImageButton);
    const dragOverlay = component.find(DragOverlay);

    return {
      onDragStartedSpy,
      onImageLoadedSpy,
      onLoadSpy,
      onRemoveImageSpy,
      onImageErrorSpy,
      component,
      img,
      imgContainer,
      container,
      removeImageButton,
      dragOverlay,
    };
  };

  describe('with image width', () => {
    describe("image tag and it's container", () => {
      it('should have defined source', () => {
        const { img } = createComponent({ imageWidth });

        expect(img.props().src).toBe(imageSource);
      });

      it('should have defined position', () => {
        const { img, imgContainer } = createComponent({ imageWidth });

        expect(imgContainer.props().style).toMatchObject({
          top: `${top}px`,
          left: `${left}px`,
        });

        expect(img.props().style).toMatchObject({
          height: '100%',
        });
      });
    });

    describe('container', () => {
      it('should have defined size', () => {
        const { container } = createComponent({ imageWidth });

        expect(container.props().style).toEqual({
          width: `${containerSize}px`,
          height: `${containerSize}px`,
        });
      });
    });

    it('should call onDragging callback', () => {
      const { dragOverlay, onDragStartedSpy } = createComponent({ imageWidth });

      dragOverlay.simulate('mousedown');
      expect(onDragStartedSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('without image width', () => {
    it('should call onImageLoaded when image is loaded', () => {
      const { component, onImageLoadedSpy } = createComponent({ imageWidth });
      const img = {
        naturalWidth: imageWidth,
        naturalHeight: imageHeight,
      } as any;

      component.find(MediaImage).props().onImageLoad!(img);
      expect(onImageLoadedSpy).toHaveBeenCalledTimes(1);
      expect(onImageLoadedSpy).toHaveBeenCalledWith(img);
    });
  });

  describe('when an image is removed', () => {
    it('should call onRemoveImage prop when cross clicked', () => {
      const { removeImageButton, onRemoveImageSpy } = createComponent({
        imageWidth,
      });

      removeImageButton.simulate('click');
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
      const { component, onImageErrorSpy } = createComponent({
        imageSource: badImageURI,
      });

      const onError = component.find('img').prop('onError');
      if (onError) {
        onError({} as React.SyntheticEvent<HTMLImageElement>);
      }

      expect(onImageErrorSpy).toHaveBeenCalledTimes(1);
      expect(onImageErrorSpy).toHaveBeenCalledWith(ERROR.FORMAT.defaultMessage);
    });
  });
});
