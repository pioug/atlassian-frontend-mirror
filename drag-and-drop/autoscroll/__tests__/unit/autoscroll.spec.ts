import { replaceRaf, Stub } from 'raf-stub';

import { createAutoScroller } from '../../src/autoscroll';
import { getClosestScrollableElement } from '../../src/internal/get-closest-scrollable-element';
import { scroll } from '../../src/internal/scroll';

import { combine, getDefaultInput, setElementFromPoint } from './_util';

jest.mock('../../src/internal/scroll', () => ({
  scroll: jest.fn(),
}));

jest.mock('../../src/internal/get-closest-scrollable-element', () => ({
  getClosestScrollableElement: jest.fn(),
}));

describe('createAutoScroller()', () => {
  replaceRaf();
  const requestAnimationFrame = (window.requestAnimationFrame as any) as Stub;
  const closestScrollableMock = document.createElement('div');
  closestScrollableMock.scrollBy = jest.fn();

  let cleanup = () => {};

  const originalWindowScrollBy = window.scrollBy;
  beforeEach(() => {
    requestAnimationFrame.reset();

    const parent = document.createElement('div');
    cleanup = combine(setElementFromPoint(parent));
    (getClosestScrollableElement as jest.Mock).mockReturnValue(
      closestScrollableMock,
    );
    window.scrollBy = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
    window.scrollBy = originalWindowScrollBy;
  });

  afterAll(() => {
    requestAnimationFrame.reset();
  });

  it('should call scroll() on start()', () => {
    const { start } = createAutoScroller();
    start({ input: getDefaultInput() }); // 1st scroll

    expect(scroll).toHaveBeenCalledTimes(1);
  });

  it('should call scroll() in every rAf frame until stop() is called', () => {
    const { start, stop } = createAutoScroller();

    start({ input: getDefaultInput() }); // 1st scroll

    requestAnimationFrame.step(); // 2nd
    requestAnimationFrame.step(); // 3rd
    requestAnimationFrame.step(); // 4th
    stop();
    requestAnimationFrame.step(); // nothing

    expect(scroll).toHaveBeenCalledTimes(4);
  });

  it('should call scroll() once if stop() is called in the same frame', () => {
    const { start, stop } = createAutoScroller();
    start({ input: getDefaultInput() }); // 1st scroll
    stop();
    requestAnimationFrame.step(); // nothing
    requestAnimationFrame.step(); // nothing

    expect(scroll).toHaveBeenCalledTimes(1);
  });

  it('should pass correct props down to "scroll"', () => {
    const { start } = createAutoScroller();
    const input = getDefaultInput();
    start({ input });

    expect(scroll).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        input,
        shouldUseTimeDampening: false,
        dragStartTime: expect.any(Number),
        scrollElement: expect.any(Function),
        scrollWindow: expect.any(Function),
      }),
    );
  });

  describe('shouldUseTimeDampening', () => {
    it('should not change shouldUseTimeDampening on start() if scrollable element would not been scrolled', () => {
      const { start } = createAutoScroller();
      start({ input: getDefaultInput() });

      expect(scroll).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          shouldUseTimeDampening: false,
        }),
      );

      requestAnimationFrame.step();

      expect(scroll).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          shouldUseTimeDampening: false,
        }),
      );
    });

    it('should set shouldUseTimeDampening=true on start() if scrollable element would have been scrolled', () => {
      const { start } = createAutoScroller();
      start({ input: getDefaultInput() });

      const { scrollElement } = (scroll as jest.Mock).mock.calls[0][0];

      scrollElement({ x: 0, y: 10 });

      requestAnimationFrame.step();

      expect(scroll).toHaveBeenLastCalledWith(
        expect.objectContaining({
          shouldUseTimeDampening: true,
        }),
      );
    });
  });

  describe('scrollElement', () => {
    it('should not scroll closestScrollable on start(), then scroll in every frame', () => {
      const { start } = createAutoScroller();
      start({ input: getDefaultInput() });

      const {
        scrollElement: scrollElementOnStart,
      } = (scroll as jest.Mock).mock.calls[0][0];

      scrollElementOnStart(closestScrollableMock, { x: 0, y: 10 });
      expect(closestScrollableMock.scrollBy).toHaveBeenCalledTimes(0);

      requestAnimationFrame.step();

      const {
        scrollElement: scrollElement1stFrame,
      } = (scroll as jest.Mock).mock.calls[1][0];

      scrollElement1stFrame(closestScrollableMock, { x: 0, y: 10 });
      expect(closestScrollableMock.scrollBy).toHaveBeenCalledTimes(1);

      requestAnimationFrame.step();

      const {
        scrollElement: scrollElement2ndFrame,
      } = (scroll as jest.Mock).mock.calls[2][0];

      scrollElement2ndFrame(closestScrollableMock, { x: 0, y: 10 });
      expect(closestScrollableMock.scrollBy).toHaveBeenCalledTimes(2);
    });
  });

  describe('scrollWindow', () => {
    it('should not scroll window on start(), then scroll in every frame', () => {
      const { start } = createAutoScroller();
      start({ input: getDefaultInput() });

      const {
        scrollWindow: scrollWindowOnStart,
      } = (scroll as jest.Mock).mock.calls[0][0];

      scrollWindowOnStart({ x: 0, y: 10 });
      expect(window.scrollBy).toHaveBeenCalledTimes(0);

      requestAnimationFrame.step();

      const {
        scrollWindow: scrollWindow1stFrame,
      } = (scroll as jest.Mock).mock.calls[1][0];

      scrollWindow1stFrame({ x: 0, y: 10 });
      expect(window.scrollBy).toHaveBeenCalledTimes(1);

      requestAnimationFrame.step();

      const {
        scrollWindow: scrollWindow2ndFrame,
      } = (scroll as jest.Mock).mock.calls[2][0];

      scrollWindow2ndFrame({ x: 0, y: 10 });
      expect(window.scrollBy).toHaveBeenCalledTimes(2);
    });
  });
});
