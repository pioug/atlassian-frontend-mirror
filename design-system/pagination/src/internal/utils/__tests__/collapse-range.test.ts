import collapseRange from '../collapse-range';

describe('#collapseRange', () => {
  const ellipsis = jest.fn(({ key }) => key);
  const transform = jest.fn((p: any) => p);

  it('should not throw', () => {
    expect(() => {
      collapseRange<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2, {
        max: 5,
        ellipsis,
        transform,
      });
    }).not.toThrow();
  });

  it('should not add ellipsis when not needed', () => {
    const pages = collapseRange<number>([1, 2, 3, 4], 2, {
      max: 4,
      ellipsis,
      transform,
    });

    expect(pages).toEqual([1, 2, 3, 4]);
    expect(ellipsis).not.toHaveBeenCalledTimes(1);
  });

  it('should show ellipsis in start', () => {
    const pages = collapseRange<number>([1, 2, 3, 4, 5, 6, 7, 8], 7, {
      max: 7,
      ellipsis,
      transform,
    });
    const initialEllipsis = 'elipses-1';

    expect(pages).toEqual([1, initialEllipsis, 4, 5, 6, 7, 8]);
    expect(ellipsis).toHaveBeenCalledWith({ key: initialEllipsis });
  });

  it('should show ellipsis in last', () => {
    const pages = collapseRange<number>([1, 2, 3, 4, 5, 6, 7, 8], 0, {
      max: 7,
      ellipsis,
      transform,
    });
    const endEllipsis = 'elipses-1';

    expect(pages).toEqual([1, 2, 3, 4, 5, endEllipsis, 8]);
    expect(ellipsis).toHaveBeenCalledWith({ key: endEllipsis });
  });

  it('should not show ellipsis in last, if there is only one element need to collapse', () => {
    const pages = collapseRange<number>([1, 2, 3, 4, 5, 6, 7, 8], 4, {
      max: 7,
      ellipsis,
      transform,
    });
    const startEllipsis = 'elipses-1';

    expect(pages).toEqual([1, startEllipsis, 4, 5, 6, 7, 8]);
    expect(ellipsis).toHaveBeenCalledWith({ key: startEllipsis });
  });

  it('should show ellipsis in start and end', () => {
    const pages = collapseRange<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4, {
      max: 7,
      ellipsis,
      transform,
    });
    const initialEllipsis = 'elipses-1';
    const endEllipsis = 'elipses-2';

    expect(pages).toEqual([1, initialEllipsis, 4, 5, 6, endEllipsis, 10]);
    expect(ellipsis).toHaveBeenNthCalledWith(1, { key: initialEllipsis });
    expect(ellipsis).toHaveBeenNthCalledWith(2, { key: endEllipsis });
  });
});
