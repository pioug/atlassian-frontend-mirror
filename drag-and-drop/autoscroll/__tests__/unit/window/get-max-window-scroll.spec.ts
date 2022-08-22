import getMaxScroll from '../../../src/internal/get-max-scroll';
import getMaxWindowScroll from '../../../src/internal/window/get-max-window-scroll';

jest.mock('../../../src/internal/get-max-scroll', () => jest.fn());

describe('getMaxWindowScroll()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return correct max window scroll', () => {
    const maxScrollMock = { x: 1, y: 2 };
    (getMaxScroll as jest.Mock).mockReturnValue(maxScrollMock);
    expect(getMaxWindowScroll()).toEqual(maxScrollMock);
  });
});
