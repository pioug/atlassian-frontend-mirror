import { TypographyToken } from '../../../../../src/types';
import webFont from '../../web-font';

describe('webFont transformer', () => {
  it('should transform typography token', () => {
    expect(
      // @ts-expect-error
      webFont.transformer({
        value: {
          fontWeight: 'bold',
          fontStyle: 'normal',
          fontSize: '16px',
          fontFamily: 'sans-serif',
          lineHeight: '24px',
        },
      } as TypographyToken<any>),
    ).toEqual('normal bold 16px/24px sans-serif');
  });
});
