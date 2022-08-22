import { canScrollWindow } from '../../src/internal/can-scroll';
import getScroll from '../../src/internal/get-scroll';
import getWindowScrollChange from '../../src/internal/get-window-scroll-change';
import getViewport from '../../src/internal/window/get-viewport';

jest.mock('../../src/internal/can-scroll', () => ({
  canScrollWindow: jest.fn(),
}));

jest.mock('../../src/internal/get-scroll', () => jest.fn());

describe('getWindowScrollChange()', () => {
  const defaultProps = {
    viewport: getViewport(),
    center: { x: 0, y: 0 },
    dragStartTime: 0,
    shouldUseTimeDampening: true,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return null if scroll has not change', () => {
    (getScroll as jest.Mock).mockReturnValue(0);

    const change = getWindowScrollChange(defaultProps);
    expect(change).toEqual(null);
  });

  it('should return null if window cannot be scrolled', () => {
    const scrollValue = 10;
    (getScroll as jest.Mock).mockReturnValue(scrollValue);
    (canScrollWindow as jest.Mock).mockReturnValue(false);

    const change = getWindowScrollChange(defaultProps);
    expect(change).toEqual(null);
  });

  it('should return scroll value if window can be scrolled', () => {
    const scrollValue = 10;
    (getScroll as jest.Mock).mockReturnValue(scrollValue);
    (canScrollWindow as jest.Mock).mockReturnValue(true);

    const change = getWindowScrollChange(defaultProps);
    expect(change).toEqual(scrollValue);
  });
});
