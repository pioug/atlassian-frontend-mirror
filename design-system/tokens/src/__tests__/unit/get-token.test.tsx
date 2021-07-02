import token from '../../get-token';

describe('getToken', () => {
  it('returns a token', () => {
    // TS: Function should have specific return type
    const testToken: 'var(--backgroundBoldBrand-resting)' = token(
      'color.backgroundBoldBrand.resting',
    );
    expect(testToken).toEqual('var(--backgroundBoldBrand-resting)');
  });

  it('returns a token with fallback', () => {
    // TS: Fallback shouldn't be included in return type
    const testToken: 'var(--backgroundBoldBrand-resting)' = token(
      'color.backgroundBoldBrand.resting',
      '#000',
    );
    expect(testToken).toEqual('var(--backgroundBoldBrand-resting, #000)');
  });

  it('should throw when a token is not found', () => {
    // @ts-expect-error
    expect(() => token('this-token-does-not-exist')).toThrow();
  });
});
