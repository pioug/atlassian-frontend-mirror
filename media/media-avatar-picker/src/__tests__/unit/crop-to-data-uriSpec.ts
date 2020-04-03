import { CONTAINER_PADDING } from '../../image-cropper/styled';

jest.mock('../../util');
import { asMock, mockCanvas } from '@atlaskit/media-test-helpers';
import { getCanvas } from '../../util';
import { cropToDataURI, Rect } from '../../image-cropper/crop-to-data-uri';

describe('cropToDataURI()', () => {
  let mockImage: HTMLImageElement;
  let defaultImageRect: Rect;
  // Crop details representing user input
  let defaultInputCropRect: Rect;
  // Final crop details expected to be applied for canvas with image data
  let defaultExpectedCrop: Rect & { right: number; bottom: number };
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  let contextTransformationOrder: string[];

  const assertCropCoordinates = ({
    left: expectedLeft,
    top: expectedTop,
    width: expectedWidth,
    height: expectedHeight,
  }: Rect) => {
    const [actualLeft, actualTop, actualWidth, actualHeight] = asMock(
      context.drawImage,
    ).mock.calls[0].slice(1);
    expect(actualLeft).toEqual(expectedLeft);
    expect(actualTop).toEqual(expectedTop);
    expect(actualWidth).toEqual(expectedWidth);
    expect(actualHeight).toEqual(expectedHeight);
  };

  beforeEach(() => {
    contextTransformationOrder = [];
    const canvasAndContext = mockCanvas();
    canvas = canvasAndContext.canvas as any;
    context = canvasAndContext.context as any;
    asMock(getCanvas).mockReturnValue(canvasAndContext);
    mockImage = {
      naturalWidth: 1,
      naturalHeight: 2,
    } as HTMLImageElement;
    defaultImageRect = {
      top: NaN, // Not used
      left: NaN, // Not used
      width: 800,
      height: 1000,
    };

    defaultExpectedCrop = {
      top: 24,
      left: 48,
      width: 400,
      height: 500,
      bottom: defaultImageRect.height - 500 - 24,
      right: defaultImageRect.width - 400 - 48,
    };

    defaultInputCropRect = {
      // See module to understand why all this math.
      top: -defaultExpectedCrop.top + CONTAINER_PADDING,
      left: -defaultExpectedCrop.left + CONTAINER_PADDING,
      width: defaultExpectedCrop.width + CONTAINER_PADDING * 2,
      height: defaultExpectedCrop.height + CONTAINER_PADDING * 2,
    };

    asMock(context.translate).mockImplementation(() =>
      contextTransformationOrder.push('translate'),
    );
    asMock(context.scale).mockImplementation(() =>
      contextTransformationOrder.push('scale'),
    );
    asMock(context.rotate).mockImplementation(() =>
      contextTransformationOrder.push('rotate'),
    );

    asMock(canvas.toDataURL).mockReturnValue('some-data-url');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return empty string when canvas' context missing", () => {
    asMock(getCanvas).mockReturnValue({ canvas, context: null });
    const result = cropToDataURI(
      mockImage,
      defaultImageRect,
      defaultInputCropRect,
      1,
      1,
    );
    expect(result).toBe('');
  });

  it('should draw given image into the canvas', () => {
    cropToDataURI(mockImage, defaultImageRect, defaultInputCropRect, 1, 1);
    expect(context.drawImage).toHaveBeenCalledTimes(1);
    const imageSupplied = asMock(context.drawImage).mock.calls[0][0];
    expect(imageSupplied).toBe(mockImage);
  });

  it('should return result of toDataURL', () => {
    asMock(canvas.toDataURL).mockReturnValue('some-data-uri');
    const result = cropToDataURI(
      mockImage,
      defaultImageRect,
      defaultInputCropRect,
      1,
      1,
    );
    expect(canvas.toDataURL).toHaveBeenCalledTimes(1);
    expect(result).toBe('some-data-uri');
  });

  describe('with orientation 1', () => {
    beforeEach(() => {
      cropToDataURI(mockImage, defaultImageRect, defaultInputCropRect, 2, 1);
    });

    it('should use original crop coordinates', () => {
      assertCropCoordinates({
        top: defaultExpectedCrop.top / 2, // 24 / 2
        left: defaultExpectedCrop.left / 2, // 48 / 2
        width: defaultExpectedCrop.width / 2, // 400 / 2
        height: defaultExpectedCrop.height / 2, // 500 / 2
      });
    });

    it('should not transform origin of context', () => {
      expect(context.rotate).not.toHaveBeenCalled();
      expect(context.translate).not.toHaveBeenCalled();
      expect(context.scale).not.toHaveBeenCalled();
    });
  });

  describe('with orientation 2', () => {
    beforeEach(() => {
      cropToDataURI(mockImage, defaultImageRect, defaultInputCropRect, 2, 2);
    });

    it('should use original crop coordinates', () => {
      assertCropCoordinates({
        top: defaultExpectedCrop.top / 2,
        left: defaultExpectedCrop.right / 2, // Horizontal mirror
        width: defaultExpectedCrop.width / 2,
        height: defaultExpectedCrop.height / 2,
      });
    });

    it('should transform origin of context', () => {
      expect(context.translate).toHaveBeenCalledWith(
        defaultExpectedCrop.width,
        0,
      );
      expect(context.scale).toHaveBeenCalledWith(-1, 1);
      expect(contextTransformationOrder).toEqual(['translate', 'scale']);
    });
  });

  describe('with orientation 3', () => {
    beforeEach(() => {
      cropToDataURI(mockImage, defaultImageRect, defaultInputCropRect, 4, 3);
    });

    it('should use original crop coordinates', () => {
      assertCropCoordinates({
        top: defaultExpectedCrop.bottom / 4, // 180 flip
        left: defaultExpectedCrop.right / 4, // 180 flip
        width: defaultExpectedCrop.width / 4,
        height: defaultExpectedCrop.height / 4,
      });
    });

    it('should transform origin of context', () => {
      expect(context.translate).toHaveBeenCalledWith(
        defaultExpectedCrop.width,
        defaultExpectedCrop.height,
      );
      expect(context.rotate).toHaveBeenCalledWith(Math.PI);
      expect(contextTransformationOrder).toEqual(['translate', 'rotate']);
    });
  });

  describe('with orientation 4', () => {
    beforeEach(() => {
      cropToDataURI(mockImage, defaultImageRect, defaultInputCropRect, 2, 4);
    });

    it('should use original crop coordinates', () => {
      assertCropCoordinates({
        top: defaultExpectedCrop.bottom / 2, // Vertical mirror
        left: defaultExpectedCrop.left / 2,
        width: defaultExpectedCrop.width / 2,
        height: defaultExpectedCrop.height / 2,
      });
    });

    it('should transform origin of context', () => {
      expect(context.translate).toHaveBeenCalledWith(
        0,
        defaultExpectedCrop.height,
      );
      expect(context.scale).toHaveBeenCalledWith(1, -1);
      expect(contextTransformationOrder).toEqual(['translate', 'scale']);
    });
  });

  describe('with orientation 5', () => {
    beforeEach(() => {
      cropToDataURI(mockImage, defaultImageRect, defaultInputCropRect, 4, 5);
    });

    it('should use original crop coordinates', () => {
      assertCropCoordinates({
        top: defaultExpectedCrop.left / 4,
        left: defaultExpectedCrop.top / 4,
        width: defaultExpectedCrop.height / 4,
        height: defaultExpectedCrop.width / 4,
      });
    });

    it('should transform origin of context', () => {
      expect(context.rotate).toHaveBeenCalledWith(Math.PI / 2);
      expect(context.scale).toHaveBeenCalledWith(1, -1);
      expect(contextTransformationOrder).toEqual(['rotate', 'scale']);
    });
  });

  describe('with orientation 6', () => {
    beforeEach(() => {
      cropToDataURI(mockImage, defaultImageRect, defaultInputCropRect, 2, 6);
    });

    it('should use original crop coordinates', () => {
      assertCropCoordinates({
        top: defaultExpectedCrop.right / 2,
        left: defaultExpectedCrop.top / 2,
        width: defaultExpectedCrop.height / 2,
        height: defaultExpectedCrop.width / 2,
      });
    });

    it('should transform origin of context', () => {
      expect(context.translate).toHaveBeenCalledWith(
        defaultExpectedCrop.width,
        0,
      );
      expect(context.rotate).toHaveBeenCalledWith(Math.PI / 2);
      expect(contextTransformationOrder).toEqual(['translate', 'rotate']);
    });
  });

  describe('with orientation 7', () => {
    beforeEach(() => {
      cropToDataURI(mockImage, defaultImageRect, defaultInputCropRect, 4, 7);
    });

    it('should use original crop coordinates', () => {
      assertCropCoordinates({
        top: defaultExpectedCrop.right / 4,
        left: defaultExpectedCrop.bottom / 4,
        width: defaultExpectedCrop.height / 4,
        height: defaultExpectedCrop.width / 4,
      });
    });

    it('should transform origin of context', () => {
      expect(context.translate).toHaveBeenCalledWith(
        defaultExpectedCrop.width,
        defaultExpectedCrop.height,
      );
      expect(context.rotate).toHaveBeenCalledWith(-Math.PI / 2);
      expect(context.scale).toHaveBeenCalledWith(1, -1);
      expect(contextTransformationOrder).toEqual([
        'translate',
        'rotate',
        'scale',
      ]);
    });
  });

  describe('with orientation 8', () => {
    beforeEach(() => {
      cropToDataURI(mockImage, defaultImageRect, defaultInputCropRect, 2, 8);
    });

    it('should use original crop coordinates', () => {
      assertCropCoordinates({
        top: defaultExpectedCrop.left / 2,
        left: defaultExpectedCrop.bottom / 2,
        width: defaultExpectedCrop.height / 2,
        height: defaultExpectedCrop.width / 2,
      });
    });

    it('should transform origin of context', () => {
      expect(context.translate).toHaveBeenCalledWith(
        0,
        defaultExpectedCrop.height,
      );
      expect(context.rotate).toHaveBeenCalledWith(-Math.PI / 2);
      expect(contextTransformationOrder).toEqual(['translate', 'rotate']);
    });
  });
});
