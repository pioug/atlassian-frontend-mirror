import * as mocks from './image-navigatorSpec.mock';
import React from 'react';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button/custom-theme-button';
import { Ellipsify } from '@atlaskit/media-ui';
import ImageNavigator, {
  ImageNavigator as ImageNavigatorView,
  Props as ImageNavigatorProps,
} from '../../image-navigator';
import { CONTAINER_INNER_SIZE } from '../../avatar-picker-dialog/layout-const';
import {
  ImageUploader,
  DragZone,
  DragZoneImage,
  DragZoneText,
  PaddedBreak,
} from '../../image-navigator/styled';
import { ImageCropper } from '../../image-cropper';
import { Slider } from '../../image-navigator/slider';
import {
  createMouseEvent,
  smallImage,
  mountWithIntlContext,
} from '@atlaskit/media-test-helpers';
import { errorIcon } from '../../image-navigator/images';
import { ReactWrapper } from 'enzyme';

declare var global: any; // we need define an interface for the Node global object when overwriting global objects, in this case FileReader

describe('Image navigator', () => {
  let component: any;
  let onImageLoaded: () => void;
  let onRemoveImage: () => void;
  let onImageError: () => void;
  let onImageUploaded: () => void;
  let isLoading: boolean;

  const setup = (props?: Partial<ImageNavigatorProps>) => {
    return mountWithIntlContext(
      <ImageNavigatorView
        imageSource={smallImage}
        onImageLoaded={onImageLoaded}
        onRemoveImage={onRemoveImage}
        onImageError={onImageError}
        onImageUploaded={onImageUploaded}
        isLoading={isLoading}
        intl={{ formatMessage() {} } as any}
        {...props}
      />,
    );
  };

  beforeEach(() => {
    onImageLoaded = jest.fn();
    onRemoveImage = jest.fn();
    onImageError = jest.fn();
    onImageUploaded = jest.fn();
    isLoading = false;
  });

  describe('with an imageSource', () => {
    let imageCropper: any;
    let slider: any;

    beforeEach(() => {
      component = setup();
      imageCropper = () => component.find(ImageCropper);
      slider = () => component.find(Slider);
    });

    it('should have image cropper', () => {
      expect(imageCropper().length).toBe(1);
    });

    it('should have slider', () => {
      expect(slider().length).toBe(1);
    });

    it('should change scale in state when slider is moved', () => {
      slider().props().onChange(20);

      component.update();
      expect(component.state().scale).toBe(20);
    });

    it('should mark state as is dragging when mouse pressed down', () => {
      imageCropper().props().onDragStarted(0, 0);

      expect(component.state().isDragging).toBe(true);
    });

    it('should mark state as is not dragging when mouse unpressed', () => {
      imageCropper().props().onDragStarted(0, 0);
      document.dispatchEvent(createMouseEvent('mouseup'));
      expect(component.state().isDragging).toBe(false);
    });

    describe('when image is dragged', () => {
      const imageHeight = CONTAINER_INNER_SIZE * 2;
      const imageWidth = CONTAINER_INNER_SIZE * 2;
      beforeEach(() => {
        imageCropper().props().onImageSize(imageWidth, imageHeight);
        slider().props().onChange(100);
      });
    });

    describe('when image is scaled', () => {
      it('should render loading state when "isLoading" is true', () => {
        const component = setup({ isLoading: true });

        expect(component.find(Spinner)).toHaveLength(1);
        expect(component.find(DragZone).prop('showBorder')).toBeFalsy();
        expect(component.find(DragZoneImage)).toHaveLength(0);
        expect(component.find(DragZoneText)).toHaveLength(0);
        expect(component.find(ImageCropper)).toHaveLength(0);
        expect(component.find(Button)).toHaveLength(0);
        expect(component.find(PaddedBreak)).toHaveLength(0);
      });
    });
  });

  describe('with no imageSource', () => {
    let viewComponent: ReactWrapper;

    beforeEach(() => {
      component = mountWithIntlContext(
        <ImageNavigator
          onImageLoaded={onImageLoaded}
          onRemoveImage={onRemoveImage}
          onImageError={onImageError}
          onImageUploaded={onImageUploaded}
        />,
      );
      viewComponent = mountWithIntlContext(
        <ImageNavigatorView
          onImageLoaded={onImageLoaded}
          onRemoveImage={onRemoveImage}
          onImageError={onImageError}
          onImageUploaded={onImageUploaded}
          intl={{ formatMessage() {} } as any}
        />,
      );
    });

    it('should render ImageUploader to allow users to pick an image', () => {
      expect(component.find(ImageUploader)).toHaveLength(1);
    });

    describe('when a file is dropped', () => {
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
        const { onDrop } = viewComponent.find(DragZone).props();

        onDrop!(mockDropEvent(droppedImage));

        await mocks.mockFileToDataURIPromise;
        await mocks.mockGetOrientationPromise;

        expect(viewComponent.state('imageFile')).toBe(droppedImage);
        expect(viewComponent.state('fileImageSource')).toBe('some-data-uri');
        expect(viewComponent.state('imageOrientation')).toBe(7);
        expect(onImageUploaded).toHaveBeenCalledWith(droppedImage);
      });

      it('should not call onImageUploaded when file is not an image', () => {
        const droppedImage = new File(['not an image'], 'text.txt', {
          type: 'text/plain',
        });
        const { onDrop } = component.find(DragZone).props();

        onDrop(mockDropEvent(droppedImage));

        expect(onImageUploaded).not.toHaveBeenCalled();
      });

      it('should not allow images greater than defined MB limit', () => {
        const { onDrop } = component.find(DragZone).props();

        onDrop(mockDropEvent(droppedImage));
        expect(onImageError).toHaveBeenCalledWith(
          'Image is too large, must be no larger than 10Mb',
        );
        expect(onImageUploaded).not.toHaveBeenCalled();
      });
    });
  });

  describe('when an image is removed', () => {
    it('should clear state', () => {
      component = mountWithIntlContext(
        <ImageNavigatorView
          imageSource={smallImage}
          onImageLoaded={onImageLoaded}
          onRemoveImage={onRemoveImage}
          onImageError={onImageError}
          onImageUploaded={onImageUploaded}
          intl={{ formatMessage() {} } as any}
        />,
      );
      const { onRemoveImage: onRemoveImageProp } = component
        .find(ImageCropper)
        .props();
      onRemoveImageProp();
      expect(component.state().fileImageSource).toBeUndefined();
      expect(component.state().imageFile).toBeUndefined();
    });
  });

  describe('when an error state is set', () => {
    const errorMessage = 'Error message!';

    beforeEach(() => {
      component = mountWithIntlContext(
        <ImageNavigator
          imageSource={smallImage}
          onImageLoaded={onImageLoaded}
          onRemoveImage={onRemoveImage}
          errorMessage={errorMessage}
          onImageError={onImageError}
          onImageUploaded={onImageUploaded}
        />,
      );
    });

    it('should display error message', () => {
      expect(component.find(Ellipsify).prop('text')).toBe(errorMessage);
    });

    it('should display error icon', () => {
      expect(component.find(DragZoneImage).props().src).toBe(errorIcon);
    });

    it('should not display image cropper', () => {
      expect(component.find(ImageCropper)).toHaveLength(0);
    });
  });
});
