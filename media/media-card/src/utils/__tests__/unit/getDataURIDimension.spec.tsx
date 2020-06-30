jest.mock('../../isRetina');
jest.mock('../../getElementDimension');
import { getDataURIDimension } from '../../getDataURIDimension';
import { isRetina } from '../../isRetina';
import { getElementDimension } from '../../getElementDimension';

describe('getDataURIDimension()', () => {
  it('should use passed dimensions', () => {
    const element = document.createElement('div');
    const dimensions = {
      width: 100,
      height: 50,
    };
    const width = getDataURIDimension('width', {
      element,
      dimensions,
    });
    const height = getDataURIDimension('height', {
      element,
      dimensions,
    });

    expect(width).toEqual(100);
    expect(height).toEqual(50);
  });

  it('should use default dimensions', () => {
    const element = document.createElement('div');
    const noAppearanceWidth = getDataURIDimension('width', {
      element,
    });
    const noAppearanceHeight = getDataURIDimension('height', {
      element,
    });

    expect(noAppearanceWidth).toEqual(156);
    expect(noAppearanceHeight).toEqual(125);
  });

  it('should use getElementDimension when dimension is percentage unit', () => {
    (getElementDimension as any).mockReturnValueOnce(50);
    const element = document.createElement('div');
    const width = getDataURIDimension('width', {
      element,
      dimensions: {
        width: '25%',
      },
    });
    expect(width).toEqual(50);
  });

  it('should return double size dimensions when is retina factor', () => {
    (isRetina as any).mockReturnValue(true);
    const element = document.createElement('div');

    const width = getDataURIDimension('width', {
      element,
      dimensions: {
        width: 10,
      },
    });
    const height = getDataURIDimension('height', {
      element,
      dimensions: {
        height: 20,
      },
    });

    expect(width).toEqual(20);
    expect(height).toEqual(40);
  });
});
