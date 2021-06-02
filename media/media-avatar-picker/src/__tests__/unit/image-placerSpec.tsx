import './image-placer.mock';
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import {
  nextTick,
  mockLoadImage,
  mockLoadImageError,
  unMockLoadImage,
} from '@atlaskit/media-test-helpers';

import { Vector2, Rectangle, FileInfo } from '@atlaskit/media-ui';

import {
  ImagePlacer,
  ImagePlacerProps,
  defaultProps as defaultComponentProps,
  ImageActions,
} from '../../image-placer';
import { ImagePlacerContainer } from '../../image-placer/container';
import { ImagePlacerImage } from '../../image-placer/image';
import { ImagePlacerErrorWrapper } from '../../image-placer/styled';
import { initialiseImagePreview } from '../../image-placer/imageProcessor';

interface SetupInfo {
  wrapper: ShallowWrapper;
  instance: ImagePlacer;
  onDragStart: () => void;
  onDragMove: () => void;
  onWheel: () => void;
  onZoomChange: () => void;
  onSaveImage: () => void;
}

const smallSize = 5;
const mediumSize = 10;
const largeSize = 30;
const extraLargeSize = 1000;
const smallToMediumRatio = 2;
const containerSize = mediumSize;
const containerWidth = containerSize;
const containerHeight = containerSize;
const defaultMaxZoom = 2;
const defaultProps = {
  src: 'some-src',
  containerWidth,
  containerHeight,
  maxZoom: 2,
  margin: 2,
};
const imageSizes = [1, smallSize, mediumSize, largeSize];
const imageSizeSmall = [smallSize, smallSize];
const imageSizeMedium = [mediumSize, mediumSize];
const imageSizeLarge = [largeSize, largeSize];
const zoomSteps = 100;

/* rounding errors require normalisation to 5 decimal places to match
    note: we only trim decimal places, we don't round/ceil/floor */
const round = (num: number) => parseFloat(num.toFixed(5));

const setup = (
  props: Partial<ImagePlacerProps> = defaultProps,
  imageSourceWidth?: number,
  imageSourceHeight?: number,
): SetupInfo => {
  const onDragStart = jest.fn();
  const onDragMove = jest.fn();
  const onWheel = jest.fn();
  const onZoomChange = jest.fn();
  const onSaveImage = jest.fn();

  let wrapper = shallow(
    <ImagePlacer
      {...defaultComponentProps}
      onZoomChange={onZoomChange}
      onImageActions={onSaveImage}
      {...props}
    />,
  );

  const instance = wrapper.instance() as ImagePlacer;

  if (imageSourceWidth && imageSourceHeight) {
    /* force image load */
    instance.onImageLoad({} as any, imageSourceWidth, imageSourceHeight);
  }
  return {
    wrapper,
    instance,
    onDragStart,
    onDragMove,
    onWheel,
    onZoomChange,
    onSaveImage,
  };
};

describe('Image Placer', () => {
  describe('Image', () => {
    it('should show image if loads successfully', () => {
      const { wrapper } = setup();
      const img = wrapper.find(ImagePlacerImage);
      expect(img).toHaveLength(1);
      expect(img.props().src).toEqual('some-src');
    });

    it('should set error state if image load fails', () => {
      const { wrapper } = setup();
      const img = wrapper.find(ImagePlacerImage);
      img.props().onError('some-error');
      expect(wrapper.state('errorMessage')).toEqual('some-error');
    });

    it('should show image at zoomed to fit view when image loads', () => {
      const { instance } = setup();
      jest.spyOn(instance, 'zoomToFit');
      instance.onImageLoad({} as any, smallSize, smallSize);
      expect(instance.zoomToFit).toHaveBeenCalled();
    });

    it('should provide ImagePlacerAPI when image loads successfully', (done) => {
      setup({
        ...defaultProps,
        onImageActions: (api: ImageActions) => {
          try {
            expect(api).toHaveProperty('toCanvas');
            expect(api).toHaveProperty('toDataURL');
            expect(api).toHaveProperty('toFile');
            done();
          } catch (error) {
            done(error);
          }
        },
      });
    });

    it('should set image size state when image loads with no constraints', async () => {
      const { instance } = setup(
        {
          ...defaultProps,
          useConstraints: false,
        },
        smallSize,
        mediumSize,
      );
      expect(instance.state.imageWidth).toEqual(smallSize);
      expect(instance.state.imageHeight).toEqual(mediumSize);
    });

    it('should set image size state when image loads with constraints', async () => {
      const { instance } = setup(defaultProps, smallSize, mediumSize);
      const { containerWidth, containerHeight } = instance.props;
      expect(instance.state.imageWidth).toEqual(containerWidth);
      expect(instance.state.imageHeight).toEqual(
        containerHeight * smallToMediumRatio,
      );
    });
  });

  describe('Coordinates', () => {
    describe('Container Rect', () => {
      it('should be equal to container size plus margins', () => {
        const { instance } = setup();
        const {
          containerRectWithMargins,
          props: { margin, containerWidth, containerHeight },
        } = instance;
        const doubleMargin = margin * 2;
        expect(containerRectWithMargins.width).toEqual(
          containerWidth + doubleMargin,
        );
        expect(containerRectWithMargins.height).toEqual(
          containerHeight + doubleMargin,
        );
      });
    });

    describe('Visible Bounds', () => {
      it('should be equal to container size minus margins', () => {
        const { instance } = setup();
        const {
          visibleBounds,
          props: { containerWidth, containerHeight },
        } = instance;
        expect(visibleBounds.width).toEqual(containerWidth);
        expect(visibleBounds.height).toEqual(containerHeight);
      });
    });

    describe('Image Bounds', () => {
      it('should scale and move image correctly when zooming with no constraints', () => {
        const { instance } = setup(
          {
            ...defaultProps,
            useConstraints: false,
          },
          smallSize,
          mediumSize,
        );
        for (let zoom = 0; zoom <= zoomSteps; zoom++) {
          const currentZoom = zoom / zoomSteps;
          const center = instance.imageBounds.center;
          instance.setZoom(currentZoom);
          const imageBounds = instance.imageBounds.map(round);
          expect(imageBounds.width).toEqual(
            round(smallSize * (1 + currentZoom)),
          );
          expect(imageBounds.height).toEqual(
            round(mediumSize * (1 + currentZoom)),
          );
          expect(imageBounds.left).toEqual(
            round(center.x - imageBounds.width * 0.5),
          );
          expect(imageBounds.top).toEqual(
            round(center.y - imageBounds.height * 0.5),
          );
        }
      });

      it('should scale and move image correctly when zooming with constraints', () => {
        const { instance } = setup(defaultProps, smallSize, mediumSize);
        const {
          props: { containerWidth, containerHeight },
        } = instance;
        for (let zoom = 0; zoom <= zoomSteps; zoom++) {
          const currentZoom = zoom / zoomSteps;
          const center = instance.imageBounds.center;
          instance.setZoom(currentZoom);
          const imageBounds = instance.imageBounds.map(round);
          expect(imageBounds.width).toEqual(
            round(containerWidth * (1 + currentZoom)),
          );
          expect(imageBounds.height).toEqual(
            round(containerHeight * (1 + currentZoom) * smallToMediumRatio),
          );
          expect(imageBounds.left).toEqual(
            round(center.x - imageBounds.width * 0.5),
          );
          expect(imageBounds.top).toEqual(
            round(center.y - imageBounds.height * 0.5),
          );
        }
      });
    });

    describe('View Changes', () => {
      it('should zero imageSize, origin, and zoom when reset', async () => {
        const zoom = 0.5;
        const { instance } = setup(
          {
            ...defaultProps,
            zoom,
          },
          smallSize,
          smallSize,
        );
        instance.state.originX = 50;
        instance.state.originX = 60;
        instance.reset();
        expect(instance.imageBounds.width).toEqual(smallSize);
        expect(instance.imageBounds.height).toEqual(smallSize);
        expect(instance.state.zoom).toEqual(0);
        expect(instance.state.originX).toEqual(0);
        expect(instance.state.originY).toEqual(0);
      });
    });

    describe('Applying Constraints', () => {
      describe('Using Constraints', () => {
        it('should snap left/right edges', () => {
          imageSizes.forEach((imageSize) => {
            const { instance } = setup(defaultProps, imageSize, imageSize);
            const { visibleBounds } = instance;
            for (let x = -largeSize; x <= largeSize; x += 1) {
              instance.state.originX = x;
              instance.applyConstraints();
              expect(instance.imageBounds.left).toEqual(visibleBounds.left);
              expect(instance.imageBounds.right).toEqual(visibleBounds.right);
            }
          });
        });

        it('should snap top/bottom edges', () => {
          imageSizes.forEach((imageSize) => {
            const { instance } = setup(defaultProps, imageSize, imageSize);
            const { visibleBounds } = instance;
            for (let y = -largeSize; y <= largeSize; y++) {
              instance.state.originY = y;
              instance.applyConstraints();
              expect(instance.imageBounds.top).toEqual(visibleBounds.top);
              expect(instance.imageBounds.bottom).toEqual(visibleBounds.bottom);
            }
          });
        });
      });

      describe('Not Using Constraints', () => {
        it('should snap left edge', () => {
          imageSizes.forEach((imageSize) => {
            const { instance } = setup(defaultProps, imageSize, imageSize);
            const { visibleBounds } = instance;
            for (let x = -largeSize; x <= largeSize; x++) {
              instance.state.originX = x;
              instance.applyConstraints();
              expect(instance.imageBounds.left).toEqual(visibleBounds.left);
            }
          });
        });

        it('should snap top edge', () => {
          imageSizes.forEach((imageSize) => {
            const { instance } = setup(defaultProps, imageSize, imageSize);
            const { visibleBounds } = instance;
            for (let y = -largeSize; y <= largeSize; y++) {
              instance.state.originY = y;
              instance.applyConstraints();
              expect(instance.imageBounds.top).toEqual(visibleBounds.top);
            }
          });
        });

        it('should snap bottom edge', () => {
          imageSizes.forEach((imageSize) => {
            const { instance } = setup(defaultProps, imageSize, imageSize);
            const { visibleBounds } = instance;
            for (let y = -largeSize; y <= largeSize; y++) {
              instance.state.originY = y;
              instance.applyConstraints();
              expect(instance.imageBounds.bottom).toEqual(visibleBounds.bottom);
            }
          });
        });

        it('should snap right edge', () => {
          imageSizes.forEach((imageSize) => {
            const { instance } = setup(defaultProps, imageSize, imageSize);
            const { visibleBounds } = instance;
            for (let x = -largeSize; x <= largeSize; x++) {
              instance.state.originX = x;
              instance.applyConstraints();
              expect(instance.imageBounds.right).toEqual(visibleBounds.right);
            }
          });
        });
      });
    });

    describe('Zoom', () => {
      it('should scale image up/down if imageSourceRect different than visibleBounds when using constraints', () => {
        imageSizes.forEach((imageSize) => {
          const { instance } = setup(defaultProps, imageSize, imageSize);
          const { imageBounds } = instance;
          expect(imageBounds.width).toEqual(mediumSize);
          expect(imageBounds.height).toEqual(mediumSize);
        });
      });

      it('should scale image up/down if imageSourceRect different than visibleBounds when not using constraints', () => {
        imageSizes.forEach((imageSize) => {
          const { instance } = setup(
            {
              ...defaultProps,
              useConstraints: false,
            },
            imageSize,
            imageSize,
          );
          const { imageBounds } = instance;
          expect(imageBounds.width).toEqual(imageSize);
          expect(imageBounds.height).toEqual(imageSize);
        });
      });

      it('should not apply zoomToFit if zero imageBounds when image loads', () => {
        const { instance } = setup();
        jest.spyOn(instance, 'zoomToFit');
        instance.onImageLoad({} as any, 0, 0);
        expect(instance.zoomToFit).not.toHaveBeenCalled();
      });

      it('should not apply zoomToFit if not using constraints when image loads', () => {
        const { instance } = setup({
          ...defaultProps,
          useConstraints: false,
        });
        jest.spyOn(instance, 'zoomToFit');
        instance.onImageLoad({} as any, smallSize, smallSize);
        expect(instance.zoomToFit).not.toHaveBeenCalled();
      });

      it('should call onZoomChange prop when zoomToFit', () => {
        const { instance, onZoomChange } = setup();
        instance.zoomToFit();
        expect(onZoomChange).toHaveBeenCalledTimes(1);
      });
    });

    describe('Mapping Coordinates', () => {
      it('should map equally when imageBounds and visibleBounds equal', () => {
        const { instance } = setup(defaultProps, ...imageSizeMedium);
        const corner = instance.transformVisibleBoundsToImageCoords(
          containerSize,
          containerSize,
        );
        expect(corner.x).toEqual(mediumSize);
        expect(corner.y).toEqual(mediumSize);
      });

      it('should map reduced coords when imageBounds smaller than visibleBounds', () => {
        const { instance } = setup(defaultProps, ...imageSizeSmall);
        const corner = instance.transformVisibleBoundsToImageCoords(
          containerSize,
          containerSize,
        );
        expect(corner.x).toEqual(smallSize);
        expect(corner.y).toEqual(smallSize);
      });

      it('should map enlarged coords when imageBounds larger than visibleBounds', () => {
        const { instance } = setup(defaultProps, ...imageSizeLarge);
        const corner = instance.transformVisibleBoundsToImageCoords(
          containerSize,
          containerSize,
        );
        expect(corner.x).toEqual(largeSize);
        expect(corner.y).toEqual(largeSize);
      });
    });

    describe('Source Rect', () => {
      it('should map coords correctly when zoomed out', () => {
        const { instance } = setup(defaultProps, ...imageSizeMedium);
        const sourceBounds = instance.sourceBounds;
        expect(sourceBounds.left).toEqual(0);
        expect(sourceBounds.top).toEqual(0);
        expect(sourceBounds.width).toEqual(mediumSize);
        expect(sourceBounds.height).toEqual(mediumSize);
      });

      it('should map coords correctly when zoomed in', async () => {
        const { instance } = setup(defaultProps, ...imageSizeMedium);
        instance.setZoom(1);
        await nextTick();
        const sourceBounds = instance.sourceBounds;
        expect(instance.state.zoom).toEqual(1);
        expect(sourceBounds.left).toEqual(Math.round(mediumSize / 4));
        expect(sourceBounds.top).toEqual(Math.round(mediumSize / 4));
        expect(sourceBounds.width).toEqual(mediumSize / defaultMaxZoom);
        expect(sourceBounds.height).toEqual(mediumSize / defaultMaxZoom);
      });
    });
  });

  describe('Props', () => {
    it('should set zoom state when zoom prop changes', () => {
      const onZoomChange = jest.fn();
      const { instance, wrapper } = setup({
        ...defaultProps,
        onZoomChange,
      });
      jest.spyOn(instance, 'setZoom');
      wrapper.setProps({
        zoom: 0.5,
      });
      expect(instance.setZoom).toHaveBeenCalledWith(0.5);
      expect(wrapper.state('zoom')).toEqual(0.5);
    });

    it('should reset zoom and imageBounds when useConstraints prop changes', () => {
      const { instance, wrapper } = setup(defaultProps, mediumSize, mediumSize);
      wrapper.setState({
        imageWidth: largeSize,
        imageHeight: largeSize,
        zoom: 0.5,
      });
      wrapper.setProps({
        useConstraints: false,
      });
      const { zoom, imageWidth, imageHeight } = instance.state;
      expect(zoom).toEqual(0);
      expect(imageWidth).toEqual(mediumSize);
      expect(imageHeight).toEqual(mediumSize);
    });

    it('should reset zoom when containerWidth prop changes', () => {
      const { wrapper, onZoomChange } = setup({
        ...defaultProps,
        zoom: 0.5,
      });
      wrapper.setProps({
        containerWidth: largeSize,
      });
      expect(onZoomChange).toHaveBeenCalled();
      expect(wrapper.state('zoom')).toEqual(0);
    });

    it('should reset zoom when containerHeight prop changes', () => {
      const { wrapper, onZoomChange } = setup({
        ...defaultProps,
        zoom: 0.5,
      });
      wrapper.setProps({
        containerHeight: largeSize,
      });
      expect(onZoomChange).toHaveBeenCalled();
      expect(wrapper.state('zoom')).toEqual(0);
    });

    it('should reset zoom and update zoom prop callback when margin prop changes', () => {
      const { wrapper, onZoomChange } = setup({
        ...defaultProps,
        zoom: 0.5,
      });
      wrapper.setProps({
        margin: largeSize,
      });
      expect(onZoomChange).toHaveBeenCalled();
      expect(wrapper.state('zoom')).toEqual(0);
    });

    it('should preprocess image when src prop changes', async () => {
      const { instance, wrapper } = setup();
      instance.preprocessFile = jest.fn().mockResolvedValue(null);
      wrapper.setProps({
        src: 'some-new-src',
      });
      await nextTick();
      await nextTick();
      expect(instance.preprocessFile).toHaveBeenCalled();
    });

    it('should preprocess image when file prop changes', async () => {
      const { instance, wrapper } = setup();
      instance.preprocessFile = jest.fn().mockResolvedValue(null);
      wrapper.setProps({
        src: 'some-new-src',
      });
      await nextTick();
      await nextTick();
      expect(instance.preprocessFile).toHaveBeenCalled();
    });

    it('should clear error state when new src or file given', async () => {
      const { wrapper, instance } = setup();
      instance.onImageError('some-error');
      expect(wrapper.state('errorMessage')).not.toBeUndefined();
      instance.setSrc({ file: {} as File, src: 'some-src' });
      expect(wrapper.state('errorMessage')).toBeUndefined();
    });
  });

  describe('PreProcessing Image', () => {
    const mockFileInfo = { file: {}, src: '' } as FileInfo;
    const containerRect = new Rectangle(
      defaultProps.containerWidth,
      defaultProps.containerHeight,
    );

    afterEach(() => {
      unMockLoadImage();
    });

    it('should return null if error occurs when loading image during image initialisation', async () => {
      mockLoadImageError();

      const imageInfo = await initialiseImagePreview(
        mockFileInfo,
        containerRect,
        defaultProps.maxZoom,
      );
      expect(imageInfo).toBeNull();
    });

    it('should scale down image to fit largest zoom size required', async () => {
      mockLoadImage(extraLargeSize, extraLargeSize);

      const imageInfo = await initialiseImagePreview(
        mockFileInfo,
        containerRect,
        defaultProps.maxZoom,
      );
      expect(imageInfo).not.toBeNull();
      if (imageInfo !== null) {
        expect(imageInfo.width).toEqual(
          defaultProps.containerWidth * defaultProps.maxZoom,
        );
        expect(imageInfo.height).toEqual(
          defaultProps.containerHeight * defaultProps.maxZoom,
        );
      }
    });

    describe('Rotate imageSourceRect when Exif orientation', () => {
      const shortSide = mediumSize;
      const longSide = largeSize;

      afterEach(() => {
        unMockLoadImage();
      });

      const tearUp = async (orientation: number) => {
        mockLoadImage(shortSide, longSide, orientation);
        const imageInfo = await initialiseImagePreview(
          mockFileInfo,
          containerRect,
          defaultProps.maxZoom,
        );
        if (imageInfo !== null) {
          const { width: imageWidth, height: imageHeight } = imageInfo;
          return { imageWidth, imageHeight };
        }
        throw new Error();
      };

      it('orientation 1', async () => {
        const orientations = [1, 2, 3, 4];
        for (const orientation of orientations) {
          const { imageWidth, imageHeight } = await tearUp(orientation);
          expect(imageWidth).toBeLessThan(imageHeight);
        }
      });

      it('orientation > 5', async () => {
        const orientations = [5, 6, 7, 8];
        for (const orientation of orientations) {
          const { imageWidth, imageHeight } = await tearUp(orientation);
          expect(imageWidth).toBeGreaterThan(imageHeight);
        }
      });
    });
  });

  describe('Dragging', () => {
    it('should set dragOrigin state with current origin when drag starts', () => {
      const { instance } = setup();
      instance.state.originX = 5;
      instance.state.originY = 10;
      instance.onDragStart();
      const dragOrigin = instance.state.dragOrigin as Vector2;
      expect(dragOrigin.x).toEqual(5);
      expect(dragOrigin.y).toEqual(10);
    });

    it('should move origin and apply constraints when dragged', () => {
      const { instance } = setup();
      jest.spyOn(instance, 'applyConstraints');
      instance.onDragStart();
      instance.onDragMove({ x: 5, y: 10 } as Vector2);
      const { originX, originY } = instance.state;
      expect(originX).toBe(5);
      expect(originY).toBe(10);
    });
  });

  describe('Wheel', () => {
    it('should set clamped zoom between 0 - 1 from wheel event value', () => {
      const { instance } = setup();
      const setZoom = jest.fn();
      instance.setZoom = setZoom;
      instance.onWheel(10);
      expect(setZoom).toHaveBeenCalledWith(0.1);
      instance.onWheel(100);
      expect(setZoom).toHaveBeenCalledWith(1);
      instance.onWheel(-2000);
      expect(setZoom).toHaveBeenCalledWith(0);
    });

    it('should call onZoomChange during wheel event', (done) => {
      const { instance } = setup({
        ...defaultProps,
        onZoomChange(zoom: number) {
          try {
            expect(zoom).toBe(0.1);
            done();
          } catch (error) {
            done(error);
          }
        },
      });
      instance.onWheel(10);
    });
  });

  describe('Rendering', () => {
    it('should not render image when error', () => {
      const { wrapper, instance } = setup();
      instance.onImageError('some-error');
      wrapper.update();
      const image = wrapper.find(ImagePlacerImage);
      expect(image).toHaveLength(0);
    });

    it('should render error message if error and no errorRender passed', () => {
      const { wrapper, instance } = setup();
      instance.onImageError('some-error');
      wrapper.update();
      const errorWrapper = wrapper.find(ImagePlacerErrorWrapper);
      expect(errorWrapper).toHaveLength(1);
      expect(errorWrapper.dive().text()).toEqual('some-error');
    });

    it('should render onRenderError if error and passed', () => {
      const { wrapper, instance } = setup({
        ...defaultProps,
        onRenderError: (errorMessage: string) => <h1>{errorMessage}</h1>,
      });
      instance.onImageError('some-error');
      wrapper.update();
      const customErrorWrapper = wrapper.find('h1');
      expect(customErrorWrapper.text()).toEqual('some-error');
    });

    it('should listen to image events', () => {
      const { wrapper, instance } = setup();
      /* we need to rebind the mocked handles, so switch state around first... */
      instance.onImageError('some-error');
      wrapper.update();
      /* now re-render the container and image, to bind handles to mocked ones */
      jest.spyOn(instance, 'onImageLoad');
      jest.spyOn(instance, 'onImageError');
      wrapper.setState({ errorMessage: undefined });
      wrapper.update();
      /* now we can simluate load event and hand correct functions referenced by children */
      const image = wrapper.find(ImagePlacerImage);
      image.simulate('load');
      image.simulate('error');
      expect(instance.onImageLoad).toHaveBeenCalled();
      expect(instance.onImageError).toHaveBeenCalled();
    });

    it('should listen to container events', () => {
      /* same as above, we need to re-render after mocking functions to update child refs */
      const { wrapper, instance } = setup();
      instance.onImageError('some-error');
      wrapper.update();
      jest.spyOn(instance, 'onDragStart');
      jest.spyOn(instance, 'onDragMove');
      wrapper.setState({ errorMessage: undefined });
      wrapper.update();
      const container = wrapper.find(ImagePlacerContainer).get(0);
      container.props.onDragStart({});
      container.props.onDragMove({});
      expect(instance.onDragStart).toHaveBeenCalled();
      expect(instance.onDragMove).toHaveBeenCalled();
    });
  });
});
