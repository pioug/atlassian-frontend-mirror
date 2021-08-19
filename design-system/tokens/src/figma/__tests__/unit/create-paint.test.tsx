// We don't statically export these so we supress the error.
// This is done so we can copy and paste the script to run it in Figma.
import {
  // @ts-ignore
  createPaint as create,
  CreatePaint,
} from '../../synchronize-figma-tokens';

const createPaint: CreatePaint = create;

describe('createPaint', () => {
  it('should generate a paint object from hex', () => {
    const value = createPaint('#0052CC');

    expect(value).toEqual({
      blendMode: 'NORMAL',
      color: {
        b: 0.8,
        g: 0.3215686274509804,
        r: 0,
      },
      opacity: 1,
      type: 'SOLID',
      visible: true,
    });
  });

  it('should parse an opaque color opacity to a value between zero and one', () => {
    const value = createPaint('#03040454');

    expect(value).toEqual({
      blendMode: 'NORMAL',
      color: {
        r: 0.011764705882352941,
        g: 0.01568627450980392,
        b: 0.01568627450980392,
      },
      opacity: 0.33,
      type: 'SOLID',
      visible: true,
    });
  });

  it('should handle half hex', () => {
    const value = createPaint('#fff');

    expect(value).toEqual({
      blendMode: 'NORMAL',
      color: {
        b: 1,
        g: 1,
        r: 1,
      },
      opacity: 1,
      type: 'SOLID',
      visible: true,
    });
  });

  it('should parse hex with opacity', () => {
    const value = createPaint('#03040421');

    expect(value).toEqual({
      blendMode: 'NORMAL',
      color: {
        b: 0.01568627450980392,
        g: 0.01568627450980392,
        r: 0.011764705882352941,
      },
      opacity: 0.13,
      type: 'SOLID',
      visible: true,
    });
  });

  it('should throw if not hex', () => {
    expect(() => createPaint('fff')).toThrow();
  });

  it('should throw if invalid length hex', () => {
    expect(() => createPaint('#ffff')).toThrow();
  });
});
