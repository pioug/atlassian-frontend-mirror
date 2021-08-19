// We don't statically export these so we supress the error.
// This is done so we can copy and paste the script to run it in Figma.
import {
  // @ts-ignore
  createEffects as create,
  CreateEffects,
} from '../../synchronize-figma-tokens';

const createEffects: CreateEffects = create;

describe('create effects', () => {
  it('should create outer shadow', () => {
    const actual = createEffects([
      {
        color: '#03040454',
        offset: { x: 0, y: 0 },
        opacity: 1,
        radius: 1,
      },
    ]);

    expect(actual).toEqual([
      {
        blendMode: 'NORMAL',
        color: {
          a: 1,
          b: 0.01568627450980392,
          g: 0.01568627450980392,
          r: 0.011764705882352941,
        },
        offset: { x: 0, y: 0 },
        radius: 1,
        spread: undefined,
        type: 'DROP_SHADOW',
        visible: true,
      },
    ]);
  });

  it('should create inner shadow', () => {
    const actual = createEffects([
      {
        color: '#03040454',
        offset: { x: 0, y: 0 },
        opacity: 1,
        radius: 1,
        inset: true,
      },
    ]);

    expect(actual).toEqual([
      {
        blendMode: 'NORMAL',
        color: {
          a: 1,
          b: 0.01568627450980392,
          g: 0.01568627450980392,
          r: 0.011764705882352941,
        },
        offset: { x: 0, y: 0 },
        radius: 1,
        spread: undefined,
        type: 'INNER_SHADOW',
        visible: true,
      },
    ]);
  });

  it('should create spread shadow', () => {
    const actual = createEffects([
      {
        color: '#03040454',
        offset: { x: 0, y: 0 },
        opacity: 1,
        radius: 1,
        spread: 2,
      },
    ]);

    expect(actual).toEqual([
      {
        blendMode: 'NORMAL',
        color: {
          a: 1,
          b: 0.01568627450980392,
          g: 0.01568627450980392,
          r: 0.011764705882352941,
        },
        offset: { x: 0, y: 0 },
        radius: 1,
        spread: 2,
        type: 'DROP_SHADOW',
        visible: true,
      },
    ]);
  });

  it('should create opaque shadow', () => {
    const actual = createEffects([
      {
        color: '#03040454',
        offset: { x: 0, y: 0 },
        opacity: 0.5,
        radius: 1,
        spread: 2,
      },
    ]);

    expect(actual).toEqual([
      {
        blendMode: 'NORMAL',
        color: {
          a: 0.5,
          b: 0.01568627450980392,
          g: 0.01568627450980392,
          r: 0.011764705882352941,
        },
        offset: { x: 0, y: 0 },
        radius: 1,
        spread: 2,
        type: 'DROP_SHADOW',
        visible: true,
      },
    ]);
  });
});
