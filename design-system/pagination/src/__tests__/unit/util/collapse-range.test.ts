import { ReactChild } from 'react';

import collapseRange from '../../../util/collapseRange';

describe('@atlaskit/pagination - collapse range', () => {
  const renderEllipsis = jest.fn(({ key }) => key);
  it('should not throw', () => {
    expect(() => {
      collapseRange<ReactChild>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2, {
        max: 5,
        ellipsis: renderEllipsis,
      });
    }).not.toThrow();
  });
  it('should not add ellipsis when not needed', () => {
    const pages = collapseRange<ReactChild>([1, 2, 3, 4], 2, {
      max: 4,
      ellipsis: renderEllipsis,
    });
    expect(pages).toEqual([1, 2, 3, 4]);
  });

  it('should show ellipsis in start', () => {
    const pages = collapseRange<ReactChild>([1, 2, 3, 4, 5, 6, 7, 8], 7, {
      max: 7,
      ellipsis: renderEllipsis,
    });
    const initialEllipsis = renderEllipsis({ key: 'elipses-1' });
    const expectedPages = [1, initialEllipsis, 4, 5, 6, 7, 8];
    expect(pages).toEqual(expectedPages);
  });

  it('should show ellipsis in last', () => {
    const pages = collapseRange<ReactChild>([1, 2, 3, 4, 5, 6, 7, 8], 0, {
      max: 7,
      ellipsis: renderEllipsis,
    });
    const finalEllipsis = renderEllipsis({ key: 'elipses-1' });
    const expectedPages = [1, 2, 3, 4, 5, finalEllipsis, 8];
    expect(pages).toEqual(expectedPages);
  });

  it('should show ellipsis in start with the next page', () => {
    const pages = collapseRange<ReactChild>(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      4,
      {
        max: 7,
        ellipsis: renderEllipsis,
      },
    );
    const initialEllipsis = renderEllipsis({ key: 'elipses-1' });
    const finalEllipsis = renderEllipsis({ key: 'elipses-2' });
    const expectedPages = [1, initialEllipsis, 4, 5, 6, finalEllipsis, 10];
    expect(pages).toEqual(expectedPages);
  });
});
