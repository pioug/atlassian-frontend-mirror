import { getScrollbarWidth } from '../../utils';

describe('getScrollbarWidth', () => {
  it('should return scrollbar width', () => {
    expect(getScrollbarWidth()).toEqual(15);
  });
});
