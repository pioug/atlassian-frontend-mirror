import type { PaintToken, ShadowToken } from '../../../../../src/types';
import palette from '../../palette';

describe('palette transformer', () => {
  it('should transform values', () => {
    expect(palette.type).toEqual('value');
  });

  it('should match non palette tokens', () => {
    const token: any = {
      attributes: {
        isPalette: false,
      },
    };

    const actual = palette.matcher?.(token);

    expect(actual).toEqual(true);
  });

  it('should not match palette tokens', () => {
    const token: any = {
      attributes: {
        isPalette: true,
      },
    };

    const actual = palette.matcher?.(token);

    expect(actual).toEqual(false);
  });

  it('should transform a paint token value to a palette value', () => {
    const token: PaintToken = {
      attributes: { group: 'paint' },
      value: 'B600',
    };

    const actual = palette.transformer({ original: token } as any);

    expect(actual).toEqual('#1D7AFC');
  });

  it('should transform a shadow token value to a palette value', () => {
    const token: ShadowToken = {
      attributes: { group: 'shadow' },
      value: [{ color: 'B100', offset: { x: 0, y: 0 }, opacity: 1, radius: 1 }],
    };

    const actual = palette.transformer({ original: token } as any);

    expect(actual[0].color).toEqual('#E9F2FF');
  });
});
