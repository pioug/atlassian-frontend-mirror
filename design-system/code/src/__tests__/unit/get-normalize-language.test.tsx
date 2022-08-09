import { normalizeLanguage } from '../../../src/internal/utils/get-normalized-language';

describe('normalizeLanguage', () => {
  it('should work with base case', () => {
    expect(normalizeLanguage('js')).toEqual('javascript');
  });

  [undefined, null, '', false].forEach((input) => {
    it(`should fallback with falsey input (${input})`, () => {
      expect(normalizeLanguage(input as any)).toEqual('');
    });
  });

  [{}, [], class {}].forEach((input) => {
    it(`should not throw with bad input (${input})`, () => {
      expect(normalizeLanguage(input as any)).toBeDefined();
    });
  });
});
