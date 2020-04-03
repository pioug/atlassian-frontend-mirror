import renderEllipsis from '../../../components/renderEllipsis';
import collapseRange from '../../../util/collapseRange';
import { name } from '../../../version.json';
import { ReactChild } from 'react';

describe(`${name} - collapse range`, () => {
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
  it('should show ellipsis in start with there < 3 add ellipsis when not needed', () => {
    const pages = collapseRange<ReactChild>([1, 2, 3, 4], 2, {
      max: 4,
      ellipsis: renderEllipsis,
    });
    expect(pages).toEqual([1, 2, 3, 4]);
  });
});
