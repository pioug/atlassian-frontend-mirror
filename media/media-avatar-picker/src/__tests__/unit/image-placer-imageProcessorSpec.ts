import { mockCanvas } from '@atlaskit/media-test-helpers';
import { FileInfo, Rectangle, Bounds } from '@atlaskit/media-ui';
import {
  mockLoadImage,
  mockLoadImageError,
  unMockLoadImage,
} from '@atlaskit/media-test-helpers';

const getCanvasMock = mockCanvas();
const mockImagePlacerUtil = {
  getCanvas: jest.fn().mockReturnValue(getCanvasMock),
};
jest.mock('../../util', () => mockImagePlacerUtil);

import {
  applyOrientation,
  radians,
  initialiseImagePreview,
  renderImageAtCurrentView,
  PreviewInfo,
  ViewInfo,
} from '../../image-placer/imageProcessor';

const mockImage = {
  naturalWidth: 1,
  naturalHeight: 2,
} as HTMLImageElement;
const translate = getCanvasMock.context.translate! as jest.Mock;
const scale = getCanvasMock.context.scale! as jest.Mock;
const rotate = getCanvasMock.context.rotate! as jest.Mock;
const drawImage = getCanvasMock.context.drawImage! as jest.Mock;
const clip = getCanvasMock.context.clip! as jest.Mock;
const toDataURL = getCanvasMock.canvas.toDataURL! as jest.Mock;
toDataURL.mockReturnValue('some-data-url');

describe('Image Placer Image Processing', () => {
  beforeEach(() => {
    translate.mockClear();
    scale.mockClear();
    rotate.mockClear();
    drawImage.mockClear();
  });

  describe('applyOrientation()', () => {
    /* test the combinations of translate, scale, rotate required to achieve the orientation transforms */
    const canvasWidth = 1;
    const canvasHeight = 2;
    const sourceWidth = 3;
    const sourceHeight = 4;
    const destWidth = 5;
    const destHeight = 6;

    const setup = (orientation: number) =>
      applyOrientation(
        mockImage,
        canvasWidth,
        canvasHeight,
        orientation,
        sourceWidth,
        sourceHeight,
        destWidth,
        destHeight,
      );

    it('should draw image at given location and return dataURL', () => {
      const dataURL = setup(1);
      expect(drawImage).toHaveBeenCalledWith(
        mockImage,
        0,
        0,
        sourceWidth,
        sourceHeight,
        0,
        0,
        destWidth,
        destHeight,
      );
      expect(toDataURL).toHaveBeenCalled();
      expect(dataURL).toEqual('some-data-url');
    });

    it('should apply orientation 2', () => {
      setup(2);
      expect(translate).toHaveBeenCalledTimes(1);
      expect(scale).toHaveBeenCalledTimes(1);
      expect(rotate).toHaveBeenCalledTimes(0);
      expect(translate).toHaveBeenCalledWith(destWidth, 0);
      expect(scale).toHaveBeenCalledWith(-1, 1);
    });

    it('should apply orientation 3', () => {
      setup(3);
      expect(translate).toHaveBeenCalledTimes(1);
      expect(scale).toHaveBeenCalledTimes(1);
      expect(rotate).toHaveBeenCalledTimes(0);
      expect(translate).toHaveBeenCalledWith(destWidth, destHeight);
      expect(scale).toHaveBeenCalledWith(-1, -1);
    });

    it('should apply orientation 4', () => {
      setup(4);
      expect(translate).toHaveBeenCalledTimes(1);
      expect(scale).toHaveBeenCalledTimes(1);
      expect(rotate).toHaveBeenCalledTimes(0);
      expect(translate).toHaveBeenCalledWith(0, destHeight);
      expect(scale).toHaveBeenCalledWith(1, -1);
    });

    it('should apply orientation 5', () => {
      setup(5);
      expect(translate).toHaveBeenCalledTimes(2);
      expect(scale).toHaveBeenCalledTimes(1);
      expect(rotate).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenNthCalledWith(1, destHeight, 0);
      expect(translate).toHaveBeenNthCalledWith(2, 0, destHeight);
      expect(scale).toHaveBeenCalledWith(1, -1);
      expect(rotate).toHaveBeenCalledWith(radians(90));
    });

    it('should apply orientation 6', () => {
      setup(6);
      expect(translate).toHaveBeenCalledTimes(1);
      expect(scale).toHaveBeenCalledTimes(0);
      expect(rotate).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenCalledWith(destHeight, 0);
      expect(rotate).toHaveBeenCalledWith(radians(90));
    });

    it('should apply orientation 7', () => {
      setup(7);
      expect(translate).toHaveBeenCalledTimes(2);
      expect(scale).toHaveBeenCalledTimes(1);
      expect(rotate).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenNthCalledWith(1, destHeight, 0);
      expect(translate).toHaveBeenNthCalledWith(2, destWidth, 0);
      expect(rotate).toHaveBeenCalledWith(radians(90));
      expect(scale).toHaveBeenCalledWith(-1, 1);
    });

    it('should apply orientation 8', () => {
      setup(8);
      expect(translate).toHaveBeenCalledTimes(2);
      expect(scale).toHaveBeenCalledTimes(1);
      expect(rotate).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenNthCalledWith(1, destHeight, 0);
      expect(translate).toHaveBeenNthCalledWith(2, destWidth, destHeight);
      expect(rotate).toHaveBeenCalledWith(radians(90));
      expect(scale).toHaveBeenCalledWith(-1, -1);
    });
  });

  describe('initialiseImagePreview()', () => {
    const mockFileInfo = {
      src: 'some-src',
      file: {} as File,
    } as FileInfo;

    beforeEach(() => mockLoadImage(1000, 1000));
    afterEach(() => unMockLoadImage());

    it('should return null if image fails to load', async () => {
      mockLoadImageError();
      const result = await initialiseImagePreview(
        mockFileInfo,
        new Rectangle(0, 0),
        1,
      );
      expect(result).toBeNull();
    });

    it('should scale down image to largest size required by max zoom', async () => {
      const result = await initialiseImagePreview(
        mockFileInfo,
        new Rectangle(10, 10),
        2,
      );
      expect(result).toEqual(
        expect.objectContaining({
          width: 20,
          height: 20,
        }),
      );
    });

    test.each([1, 2, 3, 4])(
      'should not flip orientation %i',
      async (orientation: number) => {
        mockLoadImage(1, 2, orientation);
        const { width, height } = (await initialiseImagePreview(
          mockFileInfo,
          new Rectangle(10, 10),
          2,
        )) as PreviewInfo;
        expect(width).toBeLessThan(height);
      },
    );

    test.each([5, 6, 7, 8])(
      'should flip orientation %i',
      async (orientation: number) => {
        mockLoadImage(1, 2, orientation);
        const { width, height } = (await initialiseImagePreview(
          mockFileInfo,
          new Rectangle(10, 10),
          2,
        )) as PreviewInfo;
        expect(width).toBeGreaterThan(height);
      },
    );
  });

  describe('renderImageAtCurrentView()', () => {
    const containerRect = new Rectangle(1, 2);
    const imageBounds = new Bounds(3, 4, 5, 6);
    const sourceBounds = new Bounds(7, 8, 9, 10);
    const visibleBounds = new Bounds(11, 12, 13, 14);
    const mockViewInfo = {
      containerRect,
      imageBounds,
      sourceBounds,
      visibleBounds,
    } as ViewInfo;

    beforeAll(() => mockLoadImage());
    afterAll(() => unMockLoadImage());

    it('should apply circular clip if option passed', () => {
      renderImageAtCurrentView(
        mockImage,
        mockViewInfo,
        true,
        true,
        'some-bg-color',
      );
      expect(clip).toHaveBeenCalled();
    });

    it('should draw image correctly when constraints used', () => {
      renderImageAtCurrentView(
        mockImage,
        mockViewInfo,
        true,
        false,
        'some-bg-color',
      );
      expect(drawImage).toHaveBeenCalledWith(
        mockImage,
        sourceBounds.left,
        sourceBounds.top,
        sourceBounds.width,
        sourceBounds.height,
        0,
        0,
        containerRect.width,
        containerRect.height,
      );
    });

    it('should draw image correctly when constraints not used', () => {
      renderImageAtCurrentView(
        mockImage,
        mockViewInfo,
        false,
        false,
        'some-bg-color',
      );
      const { left, top, width, height } = imageBounds.relativeTo(
        visibleBounds,
      );
      expect(drawImage).toHaveBeenCalledWith(
        mockImage,
        0,
        0,
        mockImage.naturalWidth,
        mockImage.naturalHeight,
        left,
        top,
        width,
        height,
      );
    });
  });
});
