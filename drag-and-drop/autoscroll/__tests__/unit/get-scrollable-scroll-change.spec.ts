import { canScrollScrollable } from '../../src/internal/can-scroll';
import getScroll from '../../src/internal/get-scroll';
import { getScrollable } from '../../src/internal/get-scrollable';
import getScrollableScrollChange from '../../src/internal/get-scrollable-scroll-change';

jest.mock('../../src/internal/can-scroll', () => ({
  canScrollScrollable: jest.fn(),
}));

jest.mock('../../src/internal/get-scroll', () => jest.fn());

describe('getScrollableScrollChange()', () => {
  const closestScrollableMock = document.createElement('div');

  const defaultProps = {
    scrollable: getScrollable({
      closestScrollable: closestScrollableMock,
    }),
    center: { x: 0, y: 0 },
    dragStartTime: 0,
    shouldUseTimeDampening: true,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return null if scroll has not change', () => {
    (getScroll as jest.Mock).mockReturnValue(0);

    const change = getScrollableScrollChange(defaultProps);
    expect(change).toEqual(null);
  });

  it('should return null if element cannot be scrolled', () => {
    const scrollValue = 10;
    (getScroll as jest.Mock).mockReturnValue(scrollValue);
    (canScrollScrollable as jest.Mock).mockReturnValue(false);

    const change = getScrollableScrollChange(defaultProps);
    expect(change).toEqual(null);
  });

  it('should return scroll value if element can be scrolled', () => {
    const scrollValue = 10;
    (getScroll as jest.Mock).mockReturnValue(scrollValue);
    (canScrollScrollable as jest.Mock).mockReturnValue(true);

    const change = getScrollableScrollChange(defaultProps);
    expect(change).toEqual(scrollValue);
  });
});
