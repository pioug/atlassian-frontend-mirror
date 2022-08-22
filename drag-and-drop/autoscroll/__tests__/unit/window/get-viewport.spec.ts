import { getRect } from 'css-box-model';

import getMaxScroll from '../../../src/internal/get-max-scroll';
import getViewport from '../../../src/internal/window/get-viewport';
import getWindowScroll from '../../../src/internal/window/get-window-scroll';

jest.mock('../../../src/internal/get-max-scroll', () => jest.fn());
jest.mock('../../../src/internal/window/get-window-scroll', () => jest.fn());
jest.mock('css-box-model', () => ({ getRect: jest.fn() }));

describe('getViewport()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return correct viewport', () => {
    const maxScrollMock = { x: 0, y: 2000 };
    const windowScrollMock = { x: 0, y: 10 };
    const rectMock = {
      top: 0,
      bottom: 100,
      left: 0,
      right: 200,
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      center: { x: 33, y: 44 },
    };

    (getMaxScroll as jest.Mock).mockReturnValue(maxScrollMock);
    (getWindowScroll as jest.Mock).mockReturnValue(windowScrollMock);
    (getRect as jest.Mock).mockReturnValue(rectMock);

    expect(getViewport()).toEqual({
      container: rectMock,
      scroll: {
        current: windowScrollMock,
        max: maxScrollMock,
      },
    });
  });
});
