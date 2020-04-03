import { mockCanvas } from '@atlaskit/media-test-helpers';
import { DEFAULT_INNER_WIDTH, DEFAULT_INNER_HEIGHT } from '../../viewport';
import { renderViewport } from '../../viewport/viewport-render';
import { setup as setupViewport } from './viewportSpec';

const getCanvasMock = mockCanvas();
const mockImagePlacerUtil = {
  getCanvas: jest.fn().mockReturnValue(getCanvasMock),
};
jest.mock('../../util', () => mockImagePlacerUtil);

export const radians = (deg: number) => deg * (Math.PI / 180);

const mockImage = {
  naturalWidth: 1,
  naturalHeight: 2,
} as HTMLImageElement;
const translate = getCanvasMock.context.translate! as jest.Mock;
const scale = getCanvasMock.context.scale! as jest.Mock;
const rotate = getCanvasMock.context.rotate! as jest.Mock;
const drawImage = getCanvasMock.context.drawImage! as jest.Mock;
const toDataURL = getCanvasMock.canvas.toDataURL! as jest.Mock;
toDataURL.mockReturnValue('some-data-url');

describe('Viewport Renderer', () => {
  beforeEach(() => {
    translate.mockClear();
    scale.mockClear();
    rotate.mockClear();
    drawImage.mockClear();
  });

  /* test the combinations of translate, scale, rotate required to achieve the orientation transforms */

  const setup = (orientation: number) => {
    const viewport = setupViewport();
    viewport.orientation = orientation;
    const { canvas, context } = mockImagePlacerUtil.getCanvas();

    renderViewport(viewport, mockImage, canvas);

    return {
      viewport,
      canvas,
      context,
    };
  };

  it('should apply orientation 2', () => {
    setup(2);
    expect(translate).toHaveBeenCalledTimes(1);
    expect(scale).toHaveBeenCalledTimes(1);
    expect(rotate).toHaveBeenCalledTimes(0);
    expect(translate).toHaveBeenCalledWith(DEFAULT_INNER_WIDTH, 0);
    expect(scale).toHaveBeenCalledWith(-1, 1);
  });

  it('should apply orientation 3', () => {
    setup(3);
    expect(translate).toHaveBeenCalledTimes(1);
    expect(scale).toHaveBeenCalledTimes(1);
    expect(rotate).toHaveBeenCalledTimes(0);
    expect(translate).toHaveBeenCalledWith(
      DEFAULT_INNER_WIDTH,
      DEFAULT_INNER_HEIGHT,
    );
    expect(scale).toHaveBeenCalledWith(-1, -1);
  });

  it('should apply orientation 4', () => {
    setup(4);
    expect(translate).toHaveBeenCalledTimes(1);
    expect(scale).toHaveBeenCalledTimes(1);
    expect(rotate).toHaveBeenCalledTimes(0);
    expect(translate).toHaveBeenCalledWith(0, DEFAULT_INNER_HEIGHT);
    expect(scale).toHaveBeenCalledWith(1, -1);
  });

  it('should apply orientation 5', () => {
    setup(5);
    expect(translate).toHaveBeenCalledTimes(2);
    expect(scale).toHaveBeenCalledTimes(1);
    expect(rotate).toHaveBeenCalledTimes(1);
    expect(translate).toHaveBeenNthCalledWith(1, DEFAULT_INNER_HEIGHT, 0);
    expect(translate).toHaveBeenNthCalledWith(2, 0, DEFAULT_INNER_HEIGHT);
    expect(scale).toHaveBeenCalledWith(1, -1);
    expect(rotate).toHaveBeenCalledWith(radians(90));
  });

  it('should apply orientation 6', () => {
    setup(6);
    expect(translate).toHaveBeenCalledTimes(1);
    expect(scale).toHaveBeenCalledTimes(0);
    expect(rotate).toHaveBeenCalledTimes(1);
    expect(translate).toHaveBeenCalledWith(DEFAULT_INNER_HEIGHT, 0);
    expect(rotate).toHaveBeenCalledWith(radians(90));
  });

  it('should apply orientation 7', () => {
    setup(7);
    expect(translate).toHaveBeenCalledTimes(2);
    expect(scale).toHaveBeenCalledTimes(1);
    expect(rotate).toHaveBeenCalledTimes(1);
    expect(translate).toHaveBeenNthCalledWith(1, DEFAULT_INNER_HEIGHT, 0);
    expect(translate).toHaveBeenNthCalledWith(2, DEFAULT_INNER_HEIGHT, 0);
    expect(rotate).toHaveBeenCalledWith(radians(90));
    expect(scale).toHaveBeenCalledWith(-1, 1);
  });

  it('should apply orientation 8', () => {
    setup(8);
    expect(translate).toHaveBeenCalledTimes(2);
    expect(scale).toHaveBeenCalledTimes(1);
    expect(rotate).toHaveBeenCalledTimes(1);
    expect(translate).toHaveBeenNthCalledWith(1, DEFAULT_INNER_HEIGHT, 0);
    expect(translate).toHaveBeenNthCalledWith(
      2,
      DEFAULT_INNER_WIDTH,
      DEFAULT_INNER_HEIGHT,
    );
    expect(rotate).toHaveBeenCalledWith(radians(90));
    expect(scale).toHaveBeenCalledWith(-1, -1);
  });
});
