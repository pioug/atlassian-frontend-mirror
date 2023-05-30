import pixelRem from '../../pixel-rem';

describe('pixelRem transformer', () => {
  it('should transform number based values', () => {
    // @ts-ignore
    expect(pixelRem.transformer({ value: 16 })).toEqual('1rem');
  });

  it('should not transform string based values', () => {
    // @ts-ignore
    expect(pixelRem.transformer({ value: '100%' })).toEqual('100%');
  });
});
