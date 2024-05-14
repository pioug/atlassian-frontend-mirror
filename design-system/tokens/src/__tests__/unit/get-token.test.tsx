import warnOnce from '@atlaskit/ds-lib/warn-once';

import { CSS_PREFIX, TOKEN_NOT_FOUND_CSS_VAR } from '../../constants';
import token from '../../get-token';

jest.mock('@atlaskit/ds-lib/warn-once');

(warnOnce as jest.Mock).mockImplementation(() => 42);

describe('getToken', () => {
  it('returns a token', () => {
    // TS: Function should have specific return type.
    // CSS prefix has to be hardcoded as template literal types not supported
    // eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
    const testToken: 'var(--ds-background-brand-bold)' = token(
      'color.background.brand.bold',
    );
    expect(testToken).toEqual(`var(--${CSS_PREFIX}-background-brand-bold)`);
  });

  it('returns a token with fallback', () => {
    // TS: Fallback shouldn't be included in return type.
    const testToken: `var(--ds-background-brand-bold)` = token(
      'color.background.brand.bold',
      '#000',
    );
    expect(testToken).toEqual(`var(--ds-background-brand-bold, #000)`);
  });

  it('should log error when token is not found', () => {
    // @ts-expect-error
    // eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
    const result = token('this-token-does-not-exist');
    expect(result).toEqual('var(--ds-token-not-found)');
    // eslint-disable-next-line no-console
    expect(warnOnce).toHaveBeenCalledWith(
      `Unknown token id at path: this-token-does-not-exist in @atlaskit/tokens`,
    );
  });

  it('should log error and use fallback when token is not found', () => {
    // @ts-expect-error
    // eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
    const result = token('this-token-does-not-exist', '#FFF');
    expect(result).toEqual('var(--ds-token-not-found, #FFF)');
    // eslint-disable-next-line no-console
    expect(warnOnce).toHaveBeenCalledWith(
      `Unknown token id at path: this-token-does-not-exist in @atlaskit/tokens`,
    );
  });

  describe('on production environment', () => {
    let nodeEnv: string | undefined = '';
    beforeEach(() => {
      nodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
      process.env.NODE_ENV = nodeEnv;
    });

    it('returns correct css for non-existing token with fallback', () => {
      // eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
      const testToken = token('some.non.existing.token' as any, '#000');
      expect(testToken).toEqual(`var(${TOKEN_NOT_FOUND_CSS_VAR}, #000)`);
    });

    it('returns correct css for non-existing token without fallback', () => {
      // eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
      const testToken = token('some.non.existing.token' as any);
      expect(testToken).toEqual(`var(${TOKEN_NOT_FOUND_CSS_VAR})`);
    });
  });
});
