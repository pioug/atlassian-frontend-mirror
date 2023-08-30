import { TypographyToken } from '../../../../../src/types';
import numberPixel from '../../number-pixel';

describe('numberPixel transformer', () => {
  it('should transform number based values', () => {
    // @ts-expect-error
    expect(numberPixel.transformer({ value: 16 })).toEqual('16px');
  });

  it('should not transform string based values', () => {
    // @ts-expect-error
    expect(numberPixel.transformer({ value: '100%' })).toEqual('100%');
  });

  it('should transform typography token', () => {
    expect(
      // @ts-expect-error
      numberPixel.transformer({
        attributes: { group: 'typography' },
        value: {
          fontWeight: 'bold',
          fontStyle: 'normal',
          fontSize: 16,
          fontFamily: 'sans-serif',
          lineHeight: 24,
        },
      } as TypographyToken<any>),
    ).toEqual({
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      lineHeight: '24px',
    });
  });
});
