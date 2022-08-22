import getScrollableScrollChange from '../../src/internal/get-scrollable-scroll-change';
import getWindowScrollChange from '../../src/internal/get-window-scroll-change';
import { scroll } from '../../src/internal/scroll';

import { getDefaultInput, setElementFromPoint } from './_util';

jest.mock('../../src/internal/get-scrollable-scroll-change', () => jest.fn());
jest.mock('../../src/internal/get-window-scroll-change', () => jest.fn());

describe('scroll()', () => {
  const scrollElement = jest.fn();
  const scrollWindowMock = jest.fn();

  const defaultProps = {
    input: getDefaultInput(),
    dragStartTime: 0,
    shouldUseTimeDampening: true,
    scrollElement: scrollElement,
    scrollWindow: scrollWindowMock,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('scrollWindow', () => {
    it('should not call "scrollWindow" if scroll value has not changed', () => {
      const cleanup = setElementFromPoint(null);
      (getWindowScrollChange as jest.Mock).mockReturnValue(null);
      scroll({
        ...defaultProps,
        input: getDefaultInput({ clientY: 80 }),
      });

      expect(scrollWindowMock).toHaveBeenCalledTimes(0);

      cleanup();
    });

    it('should call "scrollWindow" if scroll value has changed', () => {
      const cleanup = setElementFromPoint(null);
      const change = { x: 10, y: 0 };
      (getWindowScrollChange as jest.Mock).mockReturnValue(change);

      scroll({
        ...defaultProps,
        input: getDefaultInput({ clientY: 80 }),
      });
      expect(scrollWindowMock).toHaveBeenNthCalledWith(1, change);
      expect(scrollElement).toHaveBeenCalledTimes(0);
      cleanup();
    });
  });

  describe('scrollElement', () => {
    it('should not call "scrollElement" if there is no scrollable element', () => {
      const change = { x: 10, y: 0 };
      (getScrollableScrollChange as jest.Mock).mockReturnValue(change);
      const cleanup = setElementFromPoint(null);
      scroll({
        ...defaultProps,
        input: getDefaultInput({ clientY: 80 }),
      });
      expect(scrollElement).toHaveBeenCalledTimes(0);
      cleanup();
    });

    it('should not call "scrollElement" if scroll value has not changed', () => {
      const cleanup = setElementFromPoint(document.createElement('div'));
      (getScrollableScrollChange as jest.Mock).mockReturnValue(null);
      scroll({
        ...defaultProps,
        input: getDefaultInput({ clientY: 80 }),
      });
      expect(scrollElement).toHaveBeenCalledTimes(0);
      cleanup();
    });

    it('should call "scrollElement" if scroll value has changed', () => {
      const scrollable = document.createElement('div');
      scrollable.style.overflowY = 'auto';
      const cleanup = setElementFromPoint(scrollable);
      const change = { x: 10, y: 0 };
      (getScrollableScrollChange as jest.Mock).mockReturnValue(change);

      scroll({
        ...defaultProps,
        input: getDefaultInput({ clientY: 80 }),
      });

      expect(scrollElement).toHaveBeenNthCalledWith(1, scrollable, change);
      expect(scrollWindowMock).toHaveBeenCalledTimes(0);
      cleanup();
    });
  });
});
