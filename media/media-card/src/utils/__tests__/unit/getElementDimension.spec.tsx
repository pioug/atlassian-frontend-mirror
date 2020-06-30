import { getElementDimension } from '../../getElementDimension';

describe('getElementDimension', () => {
  it('should return a rounded value for the passed dimension', () => {
    const element = {
      getBoundingClientRect() {
        return {
          width: 1.1,
          height: 10.2,
        };
      },
    } as Element;

    const width = getElementDimension(element, 'width');
    const height = getElementDimension(element, 'height');

    expect(width).toEqual(1);
    expect(height).toEqual(10);
  });
});
