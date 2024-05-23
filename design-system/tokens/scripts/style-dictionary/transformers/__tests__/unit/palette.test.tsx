import defaultPalette, {
  type BaseToken,
} from '../../../../../schema/palettes/palette';
import { type PaintToken, type ShadowToken } from '../../../../../src/types';
import paletteTransformer from '../../palette';

const palette = paletteTransformer(defaultPalette);

describe('palette transformer', () => {
  it('should transform values', () => {
    expect(palette.type).toEqual('value');
  });

  it('should match non palette tokens', () => {
    const token: any = {
      attributes: {
        group: 'paint',
      },
    };

    const actual = palette.matcher?.(token);

    expect(actual).toEqual(true);
  });

  it('should not match palette tokens', () => {
    const token: any = {
      attributes: {
        group: 'palette',
      },
    };

    const actual = palette.matcher?.(token);

    expect(actual).toEqual(false);
  });

  it('should transform a paint token value to a palette value', () => {
    const token: PaintToken<BaseToken> = {
      attributes: {
        group: 'paint',
        description: '',
        state: 'active',
        introduced: '0.1.0',
      },
      value: 'Blue600',
    };

    const actual = palette.transformer({ original: token } as any, {});

    expect(actual).toEqual('#1D7AFC');
  });

  it('should transform a shadow token value to a palette value', () => {
    const token: ShadowToken<BaseToken> = {
      attributes: {
        group: 'shadow',
        description: '',
        state: 'active',
        introduced: '0.1.0',
      },
      value: [
        { color: 'Blue100', offset: { x: 0, y: 0 }, opacity: 1, radius: 1 },
      ],
    };

    const actual = palette.transformer({ original: token } as any, {});

    expect(actual[0].color).toEqual('#E9F2FF');
  });

  it('should transfer raw color values', () => {
    const token: PaintToken<BaseToken> = {
      attributes: {
        group: 'paint',
        description: '',
        state: 'active',
        introduced: '0.1.0',
      },
      // @ts-ignore
      value: '#FEFEFE',
    };

    const actual = palette.transformer({ original: token } as any, {});

    expect(actual).toEqual('#FEFEFE');
  });

  it('should transfer transparent to equivallant hex representation', () => {
    const token: PaintToken<BaseToken> = {
      attributes: {
        group: 'paint',
        description: '',
        state: 'active',
        introduced: '0.1.0',
      },
      // @ts-ignore
      value: 'transparent',
    };

    const actual = palette.transformer({ original: token } as any, {});

    expect(actual).toEqual('#00000000');
  });

  it('should throw error if invalid color format is provided', () => {
    const token = {
      path: ['color', 'background'],
      original: {
        attributes: { group: 'paint', description: '', state: 'active' },
        // @ts-ignore
        value: 'rgb(0,0,0)',
      },
    };

    expect(() => palette.transformer(token as any, {})).toThrowError(
      'Invalid color format "rgb(0,0,0)" provided to token: "color.background". Please use either a base token, hexadecimal or "transparent"',
    );
  });
});
