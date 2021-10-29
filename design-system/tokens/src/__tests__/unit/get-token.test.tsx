import { CSS_PREFIX } from '../../../scripts/style-dictionary/constants';
import token from '../../get-token';

describe('getToken', () => {
  it('returns a token', () => {
    // TS: Function should have specific return type.
    // CSS prefix has to be hardcoded as template literal types not supported
    const testToken: 'var(--ds-background-boldBrand-resting)' = token(
      'color.background.boldBrand.resting',
    );
    expect(testToken).toEqual(
      `var(--${CSS_PREFIX}-background-boldBrand-resting)`,
    );
  });

  it('returns a token with fallback', () => {
    // TS: Fallback shouldn't be included in return type.
    const testToken: `var(--ds-background-boldBrand-resting)` = token(
      'color.background.boldBrand.resting',
      '#000',
    );
    expect(testToken).toEqual(`var(--ds-background-boldBrand-resting, #000)`);
  });

  it('should throw when a token is not found', () => {
    // @ts-expect-error
    expect(() => token('this-token-does-not-exist')).toThrow();
  });
});
